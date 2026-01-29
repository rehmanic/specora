import fs from "fs";
import path from "path";
import OpenAI from "openai";
import prisma from "../../../config/db/prismaClient.js";
import https from "https";
// const openai = new OpenAI(process.env.OPENAI_API_KEY);

export const processTranscription = async (meetingId, audioUrl) => {
    try {
        console.log(`Processing transcription for meeting ${meetingId} from ${audioUrl}`);

        // 1. Download file locally (or stream)
        // For simplicity, let's assume we pass the URL to OpenAI if supported, or download.
        // OpenAI API 'file' param requires a ReadStream.

        // Logic: Download to temp, send to OpenAI, delete temp.
        const tempFile = `temp_${meetingId}.mp4`; // or mp3
        // await downloadFile(audioUrl, tempFile);

        // 2. Transcribe
        /*
        const transcription = await openai.audio.transcriptions.create({
          file: fs.createReadStream(tempFile),
          model: "whisper-1",
          language: "en",
        });
        */

        const mockText = "This is a simulated transcription of the meeting. The actual audio processing requires a valid OpenAI Key and file storage.";

        // 3. Save to DB
        await prisma.meeting_transcript.create({
            data: {
                meeting_id: meetingId,
                content: mockText // transcription.text
            }
        });

        // fs.unlinkSync(tempFile);
        console.log("Transcription saved.");

    } catch (error) {
        console.error("Transcription failed:", error);
    }
};
