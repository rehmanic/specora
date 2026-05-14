import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
    const router = {
        post: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        use: vi.fn(),
    };

    const controller = {
        createSpecbotChat: vi.fn(),
        deleteSpecbotChat: vi.fn(),
        getAllSpecbotChats: vi.fn(),
        updateSpecbotChat: vi.fn(),
        createMessage: vi.fn(),
        getAllMessages: vi.fn(),
        downloadSpecbotChat: vi.fn(),
        summarizeSpecbotChat: vi.fn(),
        extractRequirementsFromChat: vi.fn(),
        clearSpecbotMessages: vi.fn(),
    };

    const middlewares = {
        validateChatInput: vi.fn(),
        validateMessageInput: vi.fn(),
        verifyToken: vi.fn(),
        requireFieldsFactory: vi.fn((fields) => `requireFields:${fields.join('|')}`),
        requirePermissionsFactory: vi.fn((permission) => `requirePermissions:${permission}`),
    };

    return {
        router,
        controller,
        middlewares,
    };
});

vi.mock('express', () => ({
    default: {
        Router: vi.fn(() => mocks.router),
    },
}));

vi.mock('../../../../src/modules/specbot/specbotController.js', () => mocks.controller);

vi.mock('../../../../src/middlewares/specbot/inputValidation.js', () => ({
    validateChatInput: mocks.middlewares.validateChatInput,
    validateMessageInput: mocks.middlewares.validateMessageInput,
}));

vi.mock('../../../../src/middlewares/common/requireFields.js', () => ({
    default: mocks.middlewares.requireFieldsFactory,
}));

vi.mock('../../../../src/middlewares/common/verifyToken.js', () => ({
    verifyToken: mocks.middlewares.verifyToken,
}));

vi.mock('../../../../src/middlewares/common/requirePermissions.js', () => ({
    requirePermissions: mocks.middlewares.requirePermissionsFactory,
}));

async function loadRoutes() {
    vi.resetModules();
    const mod = await import('../../../../src/modules/specbot/specbotRoutes.js');
    return mod.default;
}

describe('specbotRoutes', () => {
    beforeEach(() => {
        mocks.router.post.mockClear();
        mocks.router.get.mockClear();
        mocks.router.put.mockClear();
        mocks.router.delete.mockClear();
        mocks.router.use.mockClear();
        mocks.middlewares.requireFieldsFactory.mockClear();
        mocks.middlewares.requirePermissionsFactory.mockClear();
    });

    it('exports the express router instance and uses verifyToken', async () => {
        const router = await loadRoutes();
        expect(router).toBe(mocks.router);
        expect(mocks.router.use).toHaveBeenCalledWith(mocks.middlewares.verifyToken);
    });

    it('registers chat CRUD routes correctly', async () => {
        await loadRoutes();

        expect(mocks.router.post).toHaveBeenCalledWith(
            '/chat/create',
            'requirePermissions:create_specbot_chat',
            'requireFields:title',
            mocks.middlewares.validateChatInput,
            mocks.controller.createSpecbotChat
        );

        expect(mocks.router.delete).toHaveBeenCalledWith(
            '/chat/delete/:chatId',
            'requirePermissions:delete_specbot_chat',
            mocks.controller.deleteSpecbotChat
        );

        expect(mocks.router.delete).toHaveBeenCalledWith(
            '/chat/:chatId/clear',
            'requirePermissions:delete_specbot_chat_message',
            mocks.controller.clearSpecbotMessages
        );

        expect(mocks.router.get).toHaveBeenCalledWith(
            '/chat/all',
            'requirePermissions:view_specbot_chat',
            mocks.controller.getAllSpecbotChats
        );

        expect(mocks.router.put).toHaveBeenCalledWith(
            '/chat/update/:chatId',
            'requirePermissions:update_specbot_chat',
            'requireFields:title',
            mocks.middlewares.validateChatInput,
            mocks.controller.updateSpecbotChat
        );
    });

    it('registers message routes correctly', async () => {
        await loadRoutes();

        expect(mocks.router.post).toHaveBeenCalledWith(
            '/message/create',
            'requirePermissions:send_specbot_chat_message',
            'requireFields:chat_type|chat_id|content|sender_type|sender_id',
            mocks.middlewares.validateMessageInput,
            mocks.controller.createMessage
        );

        expect(mocks.router.get).toHaveBeenCalledWith(
            '/messages/all/:chatId',
            'requirePermissions:view_specbot_chat_messages',
            mocks.controller.getAllMessages
        );
    });

    it('registers advanced actions routes correctly', async () => {
        await loadRoutes();

        expect(mocks.router.post).toHaveBeenCalledWith(
            '/chat/:chatId/download',
            'requirePermissions:download_specbot_chat_messages',
            mocks.controller.downloadSpecbotChat
        );

        expect(mocks.router.post).toHaveBeenCalledWith(
            '/chat/:chatId/summarize',
            'requirePermissions:summarize_specbot_chat',
            mocks.controller.summarizeSpecbotChat
        );

        expect(mocks.router.post).toHaveBeenCalledWith(
            '/chat/:chatId/extract',
            'requirePermissions:extract_requirements_from_specbot_chat',
            mocks.controller.extractRequirementsFromChat
        );
    });
});
