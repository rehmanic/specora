/**
 * Projects Input Validation Middleware Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { validateProjectDataInput } from '../../../../src/middlewares/projects/inputValidation.js';
import { createMockRequest, createMockResponse, createMockNext } from '../../../setup.js';

describe('Projects Input Validation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('validateProjectDataInput', () => {
        it('should call next when all inputs are valid', () => {
            const req = createMockRequest({
                body: {
                    name: 'Valid Project',
                    description: 'A valid project description that is long enough',
                    status: 'active',
                    start_date: '2024-01-01',
                    end_date: '2024-12-31',
                    cover_image_url: 'https://example.com/image.jpg',
                    icon_url: 'https://example.com/icon.png',
                    tags: ['tag1', 'tag2'],
                    members: ['user-1', 'user-2'],
                },
            });
            const res = createMockResponse();
            const next = createMockNext();

            validateProjectDataInput(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should call next when body is empty', () => {
            const req = createMockRequest({ body: {} });
            const res = createMockResponse();
            const next = createMockNext();

            validateProjectDataInput(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        describe('name validation', () => {
            it('should reject name shorter than 3 characters', () => {
                const req = createMockRequest({ body: { name: 'AB' } });
                const res = createMockResponse();
                const next = createMockNext();

                validateProjectDataInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.jsonData.message).toContain('Invalid project name');
                expect(next).not.toHaveBeenCalled();
            });

            it('should reject name with special characters', () => {
                const req = createMockRequest({ body: { name: 'Project@123!' } });
                const res = createMockResponse();
                const next = createMockNext();

                validateProjectDataInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('description validation', () => {
            it('should reject description shorter than 5 characters', () => {
                const req = createMockRequest({ body: { description: 'abc' } });
                const res = createMockResponse();
                const next = createMockNext();

                validateProjectDataInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.jsonData.message).toContain('description length');
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('status validation', () => {
            it('should reject invalid status', () => {
                const req = createMockRequest({ body: { status: 'invalid' } });
                const res = createMockResponse();
                const next = createMockNext();

                validateProjectDataInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.jsonData.message).toBe('Invalid status value.');
                expect(next).not.toHaveBeenCalled();
            });

            it('should accept valid status values', () => {
                const statuses = ['active', 'on_hold', 'completed', 'archived'];
                for (const status of statuses) {
                    const req = createMockRequest({ body: { status } });
                    const res = createMockResponse();
                    const next = createMockNext();

                    validateProjectDataInput(req, res, next);

                    expect(next).toHaveBeenCalled();
                }
            });
        });

        describe('date validation', () => {
            it('should reject invalid start_date format', () => {
                const req = createMockRequest({ body: { start_date: '01-01-2024' } });
                const res = createMockResponse();
                const next = createMockNext();

                validateProjectDataInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.jsonData.message).toContain('YYYY-MM-DD');
                expect(next).not.toHaveBeenCalled();
            });

            it('should reject when start_date is after end_date', () => {
                const req = createMockRequest({
                    body: { start_date: '2024-12-31', end_date: '2024-01-01' },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateProjectDataInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.jsonData.message).toContain('start_date cannot be later');
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('URL validation', () => {
            it('should reject invalid cover_image_url', () => {
                const req = createMockRequest({ body: { cover_image_url: 'not-a-url' } });
                const res = createMockResponse();
                const next = createMockNext();

                validateProjectDataInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.jsonData.message).toBe('Invalid cover_image_url.');
                expect(next).not.toHaveBeenCalled();
            });

            it('should reject invalid icon_url', () => {
                const req = createMockRequest({ body: { icon_url: 'not-a-url' } });
                const res = createMockResponse();
                const next = createMockNext();

                validateProjectDataInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.jsonData.message).toBe('Invalid icon_url.');
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('tags validation', () => {
            it('should reject tags that are not an array', () => {
                const req = createMockRequest({ body: { tags: 'not-an-array' } });
                const res = createMockResponse();
                const next = createMockNext();

                validateProjectDataInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.jsonData.message).toBe('tags must be an array.');
                expect(next).not.toHaveBeenCalled();
            });

            it('should reject more than 10 tags', () => {
                const req = createMockRequest({
                    body: { tags: Array(11).fill('tag') },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateProjectDataInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.jsonData.message).toContain('maximum of 10 tags');
                expect(next).not.toHaveBeenCalled();
            });

            it('should reject tags shorter than 3 characters', () => {
                const req = createMockRequest({ body: { tags: ['ab', 'valid-tag'] } });
                const res = createMockResponse();
                const next = createMockNext();

                validateProjectDataInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.jsonData.message).toContain('between 3 and 30');
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('members validation', () => {
            it('should reject members that are not an array', () => {
                const req = createMockRequest({ body: { members: 'not-an-array' } });
                const res = createMockResponse();
                const next = createMockNext();

                validateProjectDataInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.jsonData.message).toBe('members must be an array.');
                expect(next).not.toHaveBeenCalled();
            });

            it('should reject non-string member entries', () => {
                const req = createMockRequest({ body: { members: [123, 'user-1'] } });
                const res = createMockResponse();
                const next = createMockNext();

                validateProjectDataInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.jsonData.message).toContain('Each member must be a string');
                expect(next).not.toHaveBeenCalled();
            });
        });
    });
});
