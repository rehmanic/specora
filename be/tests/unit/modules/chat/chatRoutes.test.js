import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
    const router = {
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
    };

    const verifyToken = vi.fn();
    const requirePermissionsFactory = vi.fn((permission) => `perm:${permission}`);

    const controller = {
        getProjectGroupChat: vi.fn(),
        getGroupMessages: vi.fn(),
        saveGroupMessage: vi.fn(),
        deleteGroupMessage: vi.fn(),
    };

    return {
        router,
        verifyToken,
        requirePermissionsFactory,
        controller,
    };
});

vi.mock('express', () => ({
    default: {
        Router: vi.fn(() => mocks.router),
    },
}));

vi.mock('../../../../src/modules/chat/chatController.js', () => mocks.controller);

vi.mock('../../../../src/middlewares/common/verifyToken.js', () => ({
    verifyToken: mocks.verifyToken,
}));

vi.mock('../../../../src/middlewares/common/requirePermissions.js', () => ({
    requirePermissions: mocks.requirePermissionsFactory,
}));

async function loadRoutes() {
    vi.resetModules();
    const mod = await import('../../../../src/modules/chat/chatRoutes.js');
    return mod.default;
}

describe('chatRoutes', () => {
    beforeEach(() => {
        mocks.router.get.mockReset();
        mocks.router.post.mockReset();
        mocks.router.delete.mockReset();
        mocks.requirePermissionsFactory.mockClear();
    });

    it('registers all chat endpoints with token and permission middleware', async () => {
        await loadRoutes();

        expect(mocks.router.get).toHaveBeenCalledWith(
            '/project/:projectId',
            mocks.verifyToken,
            'perm:view_group_chat_messages',
            mocks.controller.getProjectGroupChat,
        );
        expect(mocks.router.get).toHaveBeenCalledWith(
            '/:chatId/messages',
            mocks.verifyToken,
            'perm:view_group_chat_messages',
            mocks.controller.getGroupMessages,
        );
        expect(mocks.router.post).toHaveBeenCalledWith(
            '/:chatId/messages',
            mocks.verifyToken,
            'perm:send_group_chat_message',
            mocks.controller.saveGroupMessage,
        );
        expect(mocks.router.delete).toHaveBeenCalledWith(
            '/message/:messageId',
            mocks.verifyToken,
            'perm:delete_group_chat_message',
            mocks.controller.deleteGroupMessage,
        );
    });

    it('builds permission middleware for each route registration', async () => {
        await loadRoutes();

        expect(mocks.requirePermissionsFactory).toHaveBeenCalledTimes(4);
        expect(mocks.router.get).toHaveBeenCalledTimes(2);
        expect(mocks.router.post).toHaveBeenCalledTimes(1);
        expect(mocks.router.delete).toHaveBeenCalledTimes(1);
    });
});
