import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
    const router = {
        use: vi.fn(),
        post: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    };

    const rawMiddleware = vi.fn(() => 'raw-middleware');
    const verifyToken = vi.fn();
    const requirePermissionsFactory = vi.fn((permission) => `perm:${permission}`);
    const recordingUpload = { single: vi.fn(() => 'upload-middleware') };

    const controller = {
        createMeeting: vi.fn(),
        getProjectMeetings: vi.fn(),
        getMeeting: vi.fn(),
        joinMeeting: vi.fn(),
        updateMeeting: vi.fn(),
        transcribeMeeting: vi.fn(),
        deleteMeeting: vi.fn(),
        webhookHandler: vi.fn(),
        uploadRecording: vi.fn(),
        extractMeetingRequirements: vi.fn(),
        recordingUpload,
    };

    return { router, rawMiddleware, verifyToken, requirePermissionsFactory, controller };
});

vi.mock('express', () => ({
    default: {
        Router: vi.fn(() => mocks.router),
        raw: mocks.rawMiddleware,
    },
}));

vi.mock('../../../../src/modules/meetings/meetingsController.js', () => mocks.controller);
vi.mock('../../../../src/middlewares/common/verifyToken.js', () => ({ verifyToken: mocks.verifyToken }));
vi.mock('../../../../src/middlewares/common/requirePermissions.js', () => ({ requirePermissions: mocks.requirePermissionsFactory }));

async function loadRoutes() {
    vi.resetModules();
    const mod = await import('../../../../src/modules/meetings/meetingsRoutes.js');
    return mod.default;
}

describe('meetingsRoutes', () => {
    beforeEach(() => {
        mocks.router.use.mockReset();
        mocks.router.post.mockReset();
        mocks.router.get.mockReset();
        mocks.router.put.mockReset();
        mocks.router.delete.mockReset();
        mocks.rawMiddleware.mockClear();
        mocks.requirePermissionsFactory.mockClear();
        mocks.controller.recordingUpload.single.mockClear();
    });

    it('registers public webhook before auth middleware', async () => {
        await loadRoutes();

        expect(mocks.rawMiddleware).toHaveBeenCalledWith({ type: 'application/webhook+json' });
        expect(mocks.router.post).toHaveBeenNthCalledWith(1, '/webhook', 'raw-middleware', mocks.controller.webhookHandler);
        expect(mocks.router.use).toHaveBeenCalledWith(mocks.verifyToken);
    });

    it('registers all meeting routes with permissions', async () => {
        await loadRoutes();

        expect(mocks.router.post).toHaveBeenCalledWith('/create', 'perm:create_meeting', mocks.controller.createMeeting);
        expect(mocks.router.get).toHaveBeenCalledWith('/project/:projectId', 'perm:view_meetings', mocks.controller.getProjectMeetings);
        expect(mocks.router.get).toHaveBeenCalledWith('/:meetingId', 'perm:view_meeting_details', mocks.controller.getMeeting);
        expect(mocks.router.post).toHaveBeenCalledWith('/:meetingId/join', 'perm:join_meeting', mocks.controller.joinMeeting);
        expect(mocks.router.put).toHaveBeenCalledWith('/:meetingId', 'perm:update_meeting', mocks.controller.updateMeeting);
        expect(mocks.router.post).toHaveBeenCalledWith('/:meetingId/transcribe', 'perm:generate_meeting_transcript', mocks.controller.transcribeMeeting);
        expect(mocks.router.post).toHaveBeenCalledWith('/:meetingId/extract-requirements', 'perm:extract_requirements_from_meeting', mocks.controller.extractMeetingRequirements);
        expect(mocks.router.delete).toHaveBeenCalledWith('/:meetingId', 'perm:delete_meeting', mocks.controller.deleteMeeting);
        expect(mocks.router.post).toHaveBeenCalledWith('/:meetingId/upload-recording', 'perm:record_meeting', 'upload-middleware', mocks.controller.uploadRecording);
        expect(mocks.controller.recordingUpload.single).toHaveBeenCalledWith('recording');
    });
});