import { describe, it, expect, beforeEach, vi } from 'vitest';
import { processTranscription } from '../../../../src/modules/meetings/transcriptionService.js';
import prisma from '../../../../config/db/prismaClient.js';
import fs from 'fs';
import { execFile } from 'child_process';
import ffmpeg from 'fluent-ffmpeg';

vi.mock('fs');
vi.mock('child_process', () => ({
    execFile: vi.fn()
}));
vi.mock('fluent-ffmpeg', () => {
    const mockFfmpeg = vi.fn().mockImplementation(() => {
        const chain = {
            toFormat: vi.fn().mockReturnThis(),
            audioChannels: vi.fn().mockReturnThis(),
            audioFrequency: vi.fn().mockReturnThis(),
            audioCodec: vi.fn().mockReturnThis(),
            on: vi.fn().mockImplementation(function(event, callback) {
                if (event === 'end') {
                    // Simulate async completion
                    setTimeout(callback, 0);
                }
                return this;
            }),
            save: vi.fn().mockReturnThis()
        };
        return chain;
    });
    mockFfmpeg.setFfmpegPath = vi.fn();
    return { default: mockFfmpeg };
});

describe('Transcription Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue('Mock Transcript Content');
    });

    it('processes transcription successfully', async () => {
        execFile.mockImplementation((cmd, args, cb) => cb(null, 'stdout', 'stderr'));
        prisma.meeting_transcript.findFirst.mockResolvedValue(null);
        prisma.meeting_transcript.create.mockResolvedValue({});

        await processTranscription('meeting-1', 'http://localhost/audio.webm');

        // Check if ffmpeg was called
        expect(ffmpeg).toHaveBeenCalled();
        // Check if execFile (Whisper) was called
        expect(execFile).toHaveBeenCalled();
        // Check if transcript saved to DB
        expect(prisma.meeting_transcript.create).toHaveBeenCalledWith(expect.objectContaining({
            data: { meeting_id: 'meeting-1', content: 'Mock Transcript Content' }
        }));
    });
});
