import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
    const router = {
        post: vi.fn(),
    };

    const signup = vi.fn();
    const login = vi.fn();
    const validateSignupInput = vi.fn();

    const requireFieldsFactory = vi.fn((fields) => `requireFields:${fields.join('|')}`);
    const checkUserExistsFactory = vi.fn((mode) => `checkUserExists:${mode}`);

    return {
        router,
        signup,
        login,
        validateSignupInput,
        requireFieldsFactory,
        checkUserExistsFactory,
    };
});

vi.mock('express', () => ({
    default: {
        Router: vi.fn(() => mocks.router),
    },
}));

vi.mock('../../../../src/modules/auth/authController.js', () => ({
    signup: mocks.signup,
    login: mocks.login,
}));

vi.mock('../../../../src/middlewares/common/requireFields.js', () => ({
    default: mocks.requireFieldsFactory,
}));

vi.mock('../../../../src/middlewares/common/checkUserExists.js', () => ({
    default: mocks.checkUserExistsFactory,
}));

vi.mock('../../../../src/middlewares/auth/inputValidation.js', () => ({
    validateSignupInput: mocks.validateSignupInput,
}));

async function loadRoutes() {
    vi.resetModules();
    const mod = await import('../../../../src/modules/auth/authRoutes.js');
    return mod.default;
}

describe('authRoutes', () => {
    beforeEach(() => {
        mocks.router.post.mockReset();
        mocks.requireFieldsFactory.mockClear();
        mocks.checkUserExistsFactory.mockClear();
    });

    it('exports the express router instance', async () => {
        const router = await loadRoutes();
        expect(router).toBe(mocks.router);
    });

    it('registers signup route with expected middleware chain', async () => {
        await loadRoutes();

        expect(mocks.requireFieldsFactory).toHaveBeenNthCalledWith(1, ['username', 'email', 'password']);
        expect(mocks.checkUserExistsFactory).toHaveBeenNthCalledWith(1, 'by-username-email');

        expect(mocks.router.post).toHaveBeenNthCalledWith(
            1,
            '/signup',
            'requireFields:username|email|password',
            mocks.validateSignupInput,
            'checkUserExists:by-username-email',
            mocks.signup,
        );
    });

    it('registers login route with expected middleware chain', async () => {
        await loadRoutes();

        expect(mocks.requireFieldsFactory).toHaveBeenNthCalledWith(2, ['username', 'password']);
        expect(mocks.checkUserExistsFactory).toHaveBeenNthCalledWith(2, 'by-username');

        expect(mocks.router.post).toHaveBeenNthCalledWith(
            2,
            '/login',
            'requireFields:username|password',
            'checkUserExists:by-username',
            mocks.login,
        );
    });

    it('registers exactly two POST routes', async () => {
        await loadRoutes();
        expect(mocks.router.post).toHaveBeenCalledTimes(2);
    });
});
