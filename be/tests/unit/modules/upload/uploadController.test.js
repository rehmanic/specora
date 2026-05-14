import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as uploadController from '../../../../src/modules/upload/uploadController.js';
import { createMockRequest, createMockResponse } from '../../../setup.js';

describe('Upload Controller', () => {
    let req, res;

    beforeEach(() => {
        vi.clearAllMocks();
        req = createMockRequest();
        res = createMockResponse();
        process.env.BASE_URL = 'http://localhost:5000';
    });

    describe('uploadFile', () => {
        it('returns 400 if no file is uploaded', () => {
            req.file = undefined;
            uploadController.uploadFile(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('returns 201 and file data if file is uploaded successfully', () => {
            req.file = {
                filename: 'test.jpg',
                originalname: 'test.jpg',
                mimetype: 'image/jpeg',
                size: 1024,
                path: '/tmp/test.jpg'
            };

            uploadController.uploadFile(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.jsonData.message).toBe("File uploaded successfully");
            expect(res.jsonData.data.url).toBe('http://localhost:5000/uploads/test.jpg');
        });
    });
});
