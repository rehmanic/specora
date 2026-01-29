import fs from "fs";
import path from "path";
import { execFile, spawn } from "child_process";
import https from "https";
import prisma from "../../../config/db/prismaClient.js";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

// Constants
const STORAGE_DIR = path.join(process.cwd(), "storage");
const BIN_DIR = path.join(STORAGE_DIR, "bin");
const MODELS_DIR = path.join(STORAGE_DIR, "models");
const RECORDINGS_DIR = path.join(STORAGE_DIR, "recordings");

// Whisper CLI Configuration
// URL for pre-built Windows binary (approximate, might need updating)
const WHISPER_RELEASE_URL = "https://github.com/ggerganov/whisper.cpp/releases/download/v1.5.4/whisper-bin-x64.zip";
// We will assume the user might need to place main.exe manually if automatic download fails or is complex to unzip without libraries
const WHISPER_EXE = path.join(BIN_DIR, "main.exe");
const MODEL_NAME = "ggml-small.bin";
const MODEL_PATH = path.join(MODELS_DIR, MODEL_NAME);
const MODEL_URL = "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin";

// Helper: Download a file
const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                // Follow redirect
                downloadFile(response.headers.location, dest).then(resolve).catch(reject);
                return;
            }
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
};

// Helper: Ensure directories exist
const ensureDirectories = () => {
    if (!fs.existsSync(BIN_DIR)) fs.mkdirSync(BIN_DIR, { recursive: true });
    if (!fs.existsSync(MODELS_DIR)) fs.mkdirSync(MODELS_DIR, { recursive: true });
};

// Helper: Download and Extract Whisper Binary (Windows PowerShell)
const setupWhisperBinary = async () => {
    console.log("Whisper binary not found. Downloading from release (This may take a minute)...");
    const zipPath = path.join(BIN_DIR, "whisper.zip");

    // Powershell command to download and unzip
    const psCommand = `
        Invoke-WebRequest -Uri "${WHISPER_RELEASE_URL}" -OutFile "${zipPath}";
        Expand-Archive -Path "${zipPath}" -DestinationPath "${BIN_DIR}" -Force;
        Remove-Item "${zipPath}";
    `;

    return new Promise((resolve, reject) => {
        // Use spawn with stdio: 'inherit' to show progress in terminal
        const child = spawn('powershell', ['-Command', psCommand], { stdio: 'inherit' });

        child.on('close', (code) => {
            if (code === 0) {
                console.log("Whisper binary installed successfully.");
                resolve();
            } else {
                reject(new Error(`PowerShell setup failed with code ${code}`));
            }
        });

        child.on('error', (err) => {
            console.error("PowerShell process error:", err);
            reject(err);
        });
    });
};

// Helper: Ensure Whisper binary and model exist
const ensureDependencies = async () => {
    ensureDirectories();

    // Check Model
    if (!fs.existsSync(MODEL_PATH) || fs.statSync(MODEL_PATH).size < 400000000) { // Check if missing or too small (<400MB)
        console.log("Model not found or invalid. Downloading ggml-small.bin (approx 460MB)...");
        // Remove partial/invalid file
        if (fs.existsSync(MODEL_PATH)) fs.unlinkSync(MODEL_PATH);

        const psCommand = `
            Invoke-WebRequest -Uri "${MODEL_URL}" -OutFile "${MODEL_PATH}";
        `;

        await new Promise((resolve, reject) => {
            const child = spawn('powershell', ['-Command', psCommand], { stdio: 'inherit' });

            child.on('close', (code) => {
                if (code === 0) {
                    console.log("Model downloaded successfully.");
                    resolve();
                } else {
                    reject(new Error(`Model download failed with code ${code}`));
                }
            });

            child.on('error', (err) => {
                console.error("Model download process error:", err);
                reject(err);
            });
        });
    }

    // Check Binary
    if (!fs.existsSync(WHISPER_EXE)) {
        try {
            await setupWhisperBinary();
        } catch (e) {
            throw new Error("Failed to auto-install Whisper CLI. Please install manually.");
        }
    }
};

export const processTranscription = async (meetingId, audioUrl) => {
    let wavPath = null;
    let txtPath = null;

    try {
        console.log(`Processing transcription for meeting ${meetingId}`);

        // 1. Prepare Paths
        const filename = audioUrl.split('/').pop();
        // Handle case where audioUrl might be a full URL or relative
        const inputPath = path.join(RECORDINGS_DIR, filename);

        if (!fs.existsSync(inputPath)) {
            throw new Error(`Recording file not found at ${inputPath}`);
        }

        await ensureDependencies();

        // 2. Convert to WAV (16kHz, Mono, PCM)
        wavPath = inputPath + ".wav";
        console.log(`Converting to WAV: ${wavPath}`);

        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .toFormat('wav')
                .audioChannels(1)
                .audioFrequency(16000)
                .audioCodec('pcm_s16le') // Ensure PCM 16-bit
                .on('error', (err) => reject(err))
                .on('end', () => resolve())
                .save(wavPath);
        });

        // 3. Transcribe with Whisper CLI
        console.log("Starting Whisper transcription...");

        // Command: main.exe -m <model> -f <wav_file> -otxt
        // -otxt generates <wav_file>.txt

        await new Promise((resolve, reject) => {
            execFile(WHISPER_EXE, [
                '-m', MODEL_PATH,
                '-f', wavPath,
                '--output-txt', // Explicitly request txt output
                '--print-colors', // optimize for console?
                '--no-timestamps' // simplified text output
            ], (error, stdout, stderr) => {
                if (error) {
                    // Start of workaround: Whisper CLI sometimes exits with code != 0 strictly on some warnings, 
                    // or if it fails. We need to check if output was generated.
                    console.error("Whisper process error/warning:", error);
                    console.error("Stderr:", stderr);
                    // continue if we can find the output file, else reject
                }
                console.log("Whisper stdout:", stdout);
                resolve();
            });
        });

        // Whisper default output filename logic (often appends .txt to the input filename)
        txtPath = wavPath + ".txt";

        if (!fs.existsSync(txtPath)) {
            // Fallback: newer versions might name it slightly differently or argument differences
            // Try without double extension if needed, but standard behavior is valid
            throw new Error("Transcript file was not generated.");
        }

        const transcriptContent = fs.readFileSync(txtPath, 'utf-8');
        console.log("Transcript generated, length:", transcriptContent.length);

        // 4. Save to DB
        await prisma.meeting_transcript.create({
            data: {
                meeting_id: meetingId,
                content: transcriptContent
            }
        });

        console.log("Transcription saved successfully.");

    } catch (error) {
        console.error("Transcription failed:", error);
        // Update meeting status or log error in DB if needed
    } finally {
        // Cleanup temp files
        if (wavPath && fs.existsSync(wavPath)) {
            try { fs.unlinkSync(wavPath); } catch (e) { }
        }
        if (txtPath && fs.existsSync(txtPath)) {
            try { fs.unlinkSync(txtPath); } catch (e) { }
        }
    }
};
