/**
 * Users Input Validation Middleware Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { validateUserDataInput } from '../../../../src/middlewares/users/inputValidation.js';
import { createMockRequest, createMockResponse, createMockNext } from '../../../setup.js';

describe('Users Input Validation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const validUser = {
        username: 'testuser123',
        display_name: 'Test User',
        email: 'test@example.com',
        role: 'manager',
    };

    describe('validateUserDataInput', () => {
        it('should call next when all inputs are valid', () => {
            const req = createMockRequest({ body: validUser });
            const res = createMockResponse();
            const next = createMockNext();

            validateUserDataInput(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        describe('username validation', () => {
            it('should reject username shorter than 5 characters', () => {
                const req = createMockRequest({
                    body: { ...validUser, username: 'abc' },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateUserDataInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.jsonData.message).toContain('Username must be 5-20');
                expect(next).not.toHaveBeenCalled();
            });

            it('should reject username with less than 3 letters', () => {
                const req = createMockRequest({
                    body: { ...validUser, username: 'ab123' },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateUserDataInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(next).not.toHaveBeenCalled();
            });

            it('should reject username with special characters', () => {
                const req = createMockRequest({
                    body: { ...validUser, username: 'test@user' },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateUserDataInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('display_name validation', () => {
            it('should reject display_name shorter than 3 characters', () => {
                const req = createMockRequest({
                    body: { ...validUser, display_name: 'AB' },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateUserDataInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.jsonData.message).toContain('Display name must be 3-50');
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('email validation', () => {
            it('should reject invalid email format', () => {
                const req = createMockRequest({
                    body: { ...validUser, email: 'invalid-email' },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateUserDataInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.jsonData.message).toBe('Invalid email format.');
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('password validation', () => {
            it('should reject password shorter than 6 characters', () => {
                const req = createMockRequest({
                    body: { ...validUser, password: '12345' },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateUserDataInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.jsonData.message).toBe('Password must be 6-32 characters long.');
                expect(next).not.toHaveBeenCalled();
            });

            it('should reject password longer than 32 characters', () => {
                const req = createMockRequest({
                    body: { ...validUser, password: 'a'.repeat(33) },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateUserDataInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(next).not.toHaveBeenCalled();
            });

            it('should skip password validation when password is empty string', () => {
                const req = createMockRequest({
                    body: { ...validUser, password: '' },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateUserDataInput(req, res, next);

                expect(next).toHaveBeenCalled();
            });

            it('should skip password validation when password is not provided', () => {
                const req = createMockRequest({ body: validUser });
                const res = createMockResponse();
                const next = createMockNext();

                validateUserDataInput(req, res, next);

                expect(next).toHaveBeenCalled();
            });
        });

        describe('role validation', () => {
            it('should reject invalid role', () => {
                const req = createMockRequest({
                    body: { ...validUser, role: 'admin' },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateUserDataInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.jsonData.message).toContain('Invalid role');
                expect(next).not.toHaveBeenCalled();
            });

            it('should accept valid roles', () => {
                const roles = ['manager', 'client', 'requirements_engineer'];
                for (const role of roles) {
                    const req = createMockRequest({
                        body: { ...validUser, role },
                    });
                    const res = createMockResponse();
                    const next = createMockNext();

                    validateUserDataInput(req, res, next);

                    expect(next).toHaveBeenCalled();
                }
            });
        });

        describe('permissions validation', () => {
            it('should reject non-array permissions', () => {
                const req = createMockRequest({
                    body: { ...validUser, permissions: 'view_projects' },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateUserDataInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.jsonData.message).toContain('Invalid permissions');
                expect(next).not.toHaveBeenCalled();
            });

            it('should reject invalid permission values', () => {
                const req = createMockRequest({
                    body: { ...validUser, permissions: ['view_projects', 'invalid_permission'] },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateUserDataInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(next).not.toHaveBeenCalled();
            });

            it('should accept valid permissions', () => {
                const req = createMockRequest({
                    body: { ...validUser, permissions: ['view_projects', 'create_project'] },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateUserDataInput(req, res, next);

                expect(next).toHaveBeenCalled();
            });
        });

        describe('profile_pic_url validation', () => {
            it('should reject invalid profile_pic_url', () => {
                const req = createMockRequest({
                    body: { ...validUser, profile_pic_url: 'not-a-url' },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateUserDataInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.jsonData.message).toBe('Invalid profile picture URL.');
                expect(next).not.toHaveBeenCalled();
            });

            it('should accept valid profile_pic_url', () => {
                const req = createMockRequest({
                    body: { ...validUser, profile_pic_url: 'https://example.com/avatar.jpg' },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateUserDataInput(req, res, next);

                expect(next).toHaveBeenCalled();
            });
        });
    });
});
