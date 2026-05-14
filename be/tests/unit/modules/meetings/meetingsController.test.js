import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as meetingsController from '../../../../src/modules/meetings/meetingsController.js';
import prisma from '../../../../config/db/prismaClient.js';
import { generateStatelessResponse } from '../../../../src/utils/gemini.js';
import { processTranscription } from '../../../../src/modules/meetings/transcriptionService.js';
import { createMockRequest, createMockResponse } from '../../../setup.js';

vi.mock('../../../../src/modules/meetings/transcriptionService.js', () => ({
    processTranscription: vi.fn().mockResolvedValue()
}));

// Mock LiveKit
vi.mock('livekit-server-sdk', () => {
    return {
        AccessToken: class {
            constructor() {
                this.addGrant = vi.fn();
            }
            toJwt() {
                return Promise.resolve('fake-jwt-token');
            }
        },
        WebhookReceiver: class {
            receive() {
                return Promise.resolve();
            }
        }
    };
});

describe('Meetings Controller', () => {
    let req, res;

    beforeEach(() => {
        vi.clearAllMocks();
        req = createMockRequest({
            user: { userId: 'user-1', display_name: 'User 1' }
        });
        res = createMockResponse();
        process.env.LIVEKIT_API_KEY = 'key';
        process.env.LIVEKIT_API_SECRET = 'secret';
    });

    describe('createMeeting', () => {
        it('creates a new meeting with attendees', async () => {
            req.body = { title: 'Standup', project_id: '123e4567-e89b-12d3-a456-426614174000', attendees: ['u1'] };
            prisma.meeting.create.mockResolvedValue({ id: 'm1' });
            prisma.meeting_attendee.create.mockResolvedValue({});

            await meetingsController.createMeeting(req, res);

            expect(prisma.meeting.create).toHaveBeenCalled();
            expect(prisma.meeting_attendee.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('getProjectMeetings', () => {
        it('fetches meetings for project', async () => {
            req.params.projectId = '123e4567-e89b-12d3-a456-426614174000';
            prisma.meeting.findMany.mockResolvedValue([{ id: 'm1' }]);

            await meetingsController.getProjectMeetings(req, res);

            expect(prisma.meeting.findMany).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalled();
        });
    });

    describe('joinMeeting', () => {
        it('generates LiveKit token', async () => {
            req.params.meetingId = 'm1';
            
            await meetingsController.joinMeeting(req, res);

            expect(res.json).toHaveBeenCalledWith({ token: 'fake-jwt-token' });
        });
    });

    describe('uploadRecording', () => {
        it('updates meeting with recording url', async () => {
            req.params.meetingId = 'm1';
            req.file = { filename: 'rec.webm', size: 100 };
            
            prisma.meeting.update.mockResolvedValue({});

            await meetingsController.uploadRecording(req, res);

            expect(prisma.meeting.update).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ filename: 'rec.webm' }));
        });
    });

    describe('transcribeMeeting', () => {
        it('triggers background transcription if recording exists', async () => {
            req.params.meetingId = 'm1';
            prisma.meeting.findUnique.mockResolvedValue({
                id: 'm1', recording_url: 'http://url', transcripts: []
            });

            await meetingsController.transcribeMeeting(req, res);

            expect(processTranscription).toHaveBeenCalledWith('m1', 'http://url');
            expect(res.status).toHaveBeenCalledWith(202);
        });
    });

    describe('extractMeetingRequirements', () => {
        it('uses Gemini to extract requirements from transcript', async () => {
            req.params.meetingId = 'm1';
            prisma.meeting.findUnique.mockResolvedValue({
                id: 'm1', project_id: 'p1', transcripts: [{ content: 'We need login.' }]
            });

            generateStatelessResponse.mockResolvedValue(JSON.stringify([
                { title: 'Login', description: 'desc', priority: 'high' }
            ]));

            await meetingsController.extractMeetingRequirements(req, res);

            expect(generateStatelessResponse).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
