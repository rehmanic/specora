import fs from "fs";
import path from "path";
import https from "https";
import { execFile } from "child_process";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import prisma from "../../../config/db/prismaClient.js";

// Configuration
const STORAGE_DIR = path.join(process.cwd(), "storage");
const BIN_DIR = path.join(STORAGE_DIR, "bin");
const MODELS_DIR = path.join(STORAGE_DIR, "models");
const RECORDINGS_DIR = path.join(STORAGE_DIR, "recordings");

// Whisper Configuration
const WHISPER_EXE = "/usr/local/bin/whisper-cli";
const MODEL_NAME = "ggml-small.bin";
const MODEL_PATH = `/usr/local/share/whisper/models/${MODEL_NAME}`;

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

/**
 * Ensure necessary directories exist.
 */
const ensureDirectories = () => {
    if (!fs.existsSync(RECORDINGS_DIR)) fs.mkdirSync(RECORDINGS_DIR, { recursive: true });
};

/**
 * Transcribe a meeting recording.
 * @param {string} meetingId - The ID of the meeting.
 * @param {string} audioUrl - The URL/path of the audio file.
 */
export const processTranscription = async (meetingId, audioUrl) => {
    const startTime = Date.now();
    let wavPath = null;
    let txtPath = null;

    try {
        console.log(`[Transcription] Processing meeting ${meetingId}`);

        const filename = audioUrl.split('/').pop();
        const inputPath = path.join(RECORDINGS_DIR, filename);

        if (!fs.existsSync(inputPath)) {
            throw new Error(`Recording file not found at ${inputPath}`);
        }

        ensureDirectories();

        // Prepare paths
        wavPath = inputPath + ".wav";
        txtPath = wavPath + ".txt"; // Whisper outputs to [filename].txt

        // Convert to WAV (16kHz, Mono, PCM)
        console.log(`[Transcription] Converting to WAV...`);
        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .toFormat('wav')
                .audioChannels(1)
                .audioFrequency(16000)
                .audioCodec('pcm_s16le')
                .on('error', reject)
                .on('end', resolve)
                .save(wavPath);
        });

        if (!fs.existsSync(wavPath)) {
            throw new Error(`Failed to create WAV file at ${wavPath}`);
        }

        // Run Whisper
        console.log(`[Transcription] Running Whisper...`);
        const whisperArgs = [
            '-m', MODEL_PATH,
            '-f', wavPath,
            '--output-txt',
            '--no-timestamps'
        ];

        await new Promise((resolve, reject) => {
            execFile(WHISPER_EXE, whisperArgs, (error, stdout, stderr) => {
                if (error) {
                    console.error("[Transcription] Whisper Error:", stderr);
                    // reject(error); // Optionally reject if strict
                }
                resolve();
            });
        });

        if (!fs.existsSync(txtPath)) {
            throw new Error("Transcript file was not generated.");
        }

        const transcriptContent = fs.readFileSync(txtPath, 'utf-8');
        console.log(`[Transcription] Generated ${transcriptContent.length} chars.`);

        // Save to Database
        console.log("[Transcription] Saving to database...");

        const existing = await prisma.meeting_transcript.findFirst({
            where: { meeting_id: meetingId }
        });

        if (existing) {
            await prisma.meeting_transcript.update({
                where: { id: existing.id },
                data: { content: transcriptContent }
            });
            console.log(`[Transcription] Updated transcript (ID: ${existing.id})`);
        } else {
            await prisma.meeting_transcript.create({
                data: {
                    meeting_id: meetingId,
                    content: transcriptContent
                }
            });
            console.log("[Transcription] Created new transcript.");
        }

        console.log(`[Transcription] Completed in ${(Date.now() - startTime) / 1000}s`);

    } catch (error) {
        console.error("[Transcription] Failed:", error);
    } finally {
        // Cleanup temporary files
        [wavPath, txtPath].forEach(p => {
            if (p && fs.existsSync(p)) {
                try {
                    fs.unlinkSync(p);
                } catch (e) {
                    console.error(`[Transcription] Failed to delete ${p}`, e);
                }
            }
        });
    }
};
