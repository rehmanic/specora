import { processTranscription } from "./src/modules/meetings/transcriptionService.js";
import ffmpegStatic from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

ffmpeg.setFfmpegPath(ffmpegStatic);

const testDir = path.join(process.cwd(), "storage", "recordings");
if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

const testFile = path.join(testDir, "test-audio.wav");

// Create a dummy audio file using ffmpeg (sine wave with speech-like frequencies)
// Or just try to download a small sample? 
// Generating simple tone might Result in garbage text or empty text, but process should succeed.
console.log("Generating test file:", testFile);

new Promise((resolve, reject) => {
    ffmpeg()
        .input("anullsrc=r=16000:cl=mono") // Null source
        .inputFormat("lavfi")
        .duration(3)
        .save(testFile)
        .on("end", resolve)
        .on("error", reject);
}).then(async () => {
    console.log("Test file generated. Running transcription...");
    // Mocking a meeting ID "test-meeting-123"
    // Audio URL is simulated as relative filename
    await processTranscription("test-meeting-123", "test-audio.wav");
}).catch(err => {
    console.error("Test failed:", err);
});
