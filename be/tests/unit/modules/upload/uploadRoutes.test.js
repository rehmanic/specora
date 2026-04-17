import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
    const router = { post: vi.fn() };
    const upload = { single: vi.fn(() => 'single-file-middleware') };
    const uploadFile = vi.fn();
    return { router, upload, uploadFile };
});

vi.mock('express', () => ({ default: { Router: vi.fn(() => mocks.router) } }));
vi.mock('../../../../src/modules/upload/uploadController.js', () => ({ upload: mocks.upload, uploadFile: mocks.uploadFile }));

async function loadRoutes() {
    vi.resetModules();
    const mod = await import('../../../../src/modules/upload/uploadRoutes.js');
    return mod.default;
}

describe('uploadRoutes', () => {
    it('registers file upload route with multer middleware', async () => {
        const router = await loadRoutes();

        expect(router).toBe(mocks.router);
        expect(mocks.upload.single).toHaveBeenCalledWith('file');
        expect(mocks.router.post).toHaveBeenCalledWith('/', 'single-file-middleware', mocks.uploadFile);
    });
});