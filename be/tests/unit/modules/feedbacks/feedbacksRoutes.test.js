import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
    const router = {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    };

    const verifyToken = vi.fn();
    const requirePermissionsFactory = vi.fn((permission) => `perm:${permission}`);

    const controller = {
        createFeedback: vi.fn(),
        getFeedback: vi.fn(),
        getProjectFeedbacks: vi.fn(),
        submitResponse: vi.fn(),
        getResponses: vi.fn(),
        updateFeedback: vi.fn(),
        deleteFeedback: vi.fn(),
        deleteResponse: vi.fn(),
        getUserResponse: vi.fn(),
    };

    return { router, verifyToken, requirePermissionsFactory, controller };
});

vi.mock('express', () => ({
    default: {
        Router: vi.fn(() => mocks.router),
    },
}));

vi.mock('../../../../src/modules/feedbacks/feedbacksController.js', () => mocks.controller);
vi.mock('../../../../src/middlewares/common/verifyToken.js', () => ({ verifyToken: mocks.verifyToken }));
vi.mock('../../../../src/middlewares/common/requirePermissions.js', () => ({ requirePermissions: mocks.requirePermissionsFactory }));

async function loadRoutes() {
    vi.resetModules();
    const mod = await import('../../../../src/modules/feedbacks/feedbacksRoutes.js');
    return mod.default;
}

describe('feedbacksRoutes', () => {
    beforeEach(() => {
        mocks.router.get.mockReset();
        mocks.router.post.mockReset();
        mocks.router.put.mockReset();
        mocks.router.delete.mockReset();
        mocks.requirePermissionsFactory.mockClear();
    });

    it('registers all feedback endpoints', async () => {
        await loadRoutes();

        expect(mocks.router.get).toHaveBeenCalledWith('/project/:projectId', mocks.verifyToken, 'perm:view_feedback_forms', mocks.controller.getProjectFeedbacks);
        expect(mocks.router.get).toHaveBeenCalledWith('/:feedbackId', mocks.verifyToken, 'perm:view_feedback_forms', mocks.controller.getFeedback);
        expect(mocks.router.post).toHaveBeenCalledWith('/:feedbackId/responses', mocks.verifyToken, 'perm:submit_feedback_response', mocks.controller.submitResponse);
        expect(mocks.router.get).toHaveBeenCalledWith('/:feedbackId/my-response', mocks.verifyToken, 'perm:view_own_feedback_response', mocks.controller.getUserResponse);
        expect(mocks.router.delete).toHaveBeenCalledWith('/responses/:responseId', mocks.verifyToken, 'perm:delete_feedback_form', mocks.controller.deleteResponse);
        expect(mocks.router.post).toHaveBeenCalledWith('/', mocks.verifyToken, 'perm:create_feedback_form', mocks.controller.createFeedback);
        expect(mocks.router.put).toHaveBeenCalledWith('/:feedbackId', mocks.verifyToken, 'perm:update_feedback_form', mocks.controller.updateFeedback);
        expect(mocks.router.delete).toHaveBeenCalledWith('/:feedbackId', mocks.verifyToken, 'perm:delete_feedback_form', mocks.controller.deleteFeedback);
        expect(mocks.router.get).toHaveBeenCalledWith('/:feedbackId/responses', mocks.verifyToken, 'perm:view_feedback_form_responses', mocks.controller.getResponses);
    });

    it('creates permission middleware for each protected route', async () => {
        await loadRoutes();
        expect(mocks.requirePermissionsFactory).toHaveBeenCalledTimes(9);
    });
});