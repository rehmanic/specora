/**
 * Auth Input Validation Middleware Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { validateSignupInput } from '../../../../src/middlewares/auth/inputValidation.js';
import { createMockRequest, createMockResponse, createMockNext } from '../../../setup.js';

describe('Auth Input Validation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('validateSignupInput', () => {
        it('should call next when all inputs are valid', () => {
            const req = createMockRequest({
                body: {
                    username: 'testuser123',
                    email: 'test@example.com',
                    password: 'password123',
                },
            });
            const res = createMockResponse();
            const next = createMockNext();

            validateSignupInput(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        describe('username validation', () => {
            it('should reject username with less than 5 characters', () => {
                const req = createMockRequest({
                    body: { username: 'abc', email: 'test@example.com', password: 'password123' },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateSignupInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.jsonData.message).toContain('Username must be 5-20 characters');
                expect(next).not.toHaveBeenCalled();
            });

            it('should reject username with more than 20 characters', () => {
                const req = createMockRequest({
                    body: {
                        username: 'abcdefghijklmnopqrstuvwxyz',
                        email: 'test@example.com',
                        password: 'password123',
                    },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateSignupInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(next).not.toHaveBeenCalled();
            });

            it('should reject username with less than 3 letters', () => {
                const req = createMockRequest({
                    body: { username: 'ab123', email: 'test@example.com', password: 'password123' },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateSignupInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(next).not.toHaveBeenCalled();
            });

            it('should reject username with special characters', () => {
                const req = createMockRequest({
                    body: { username: 'test@user', email: 'test@example.com', password: 'password123' },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateSignupInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(next).not.toHaveBeenCalled();
            });

            it('should accept valid username with letters and numbers', () => {
                const req = createMockRequest({
                    body: { username: 'user123', email: 'test@example.com', password: 'password123' },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateSignupInput(req, res, next);

                expect(next).toHaveBeenCalled();
            });
        });

        describe('email validation', () => {
            it('should reject invalid email format', () => {
                const req = createMockRequest({
                    body: { username: 'testuser', email: 'invalid-email', password: 'password123' },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateSignupInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.jsonData.message).toBe('Invalid email format.');
                expect(next).not.toHaveBeenCalled();
            });

            it('should reject email without domain', () => {
                const req = createMockRequest({
                    body: { username: 'testuser', email: 'test@', password: 'password123' },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateSignupInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(next).not.toHaveBeenCalled();
            });

            it('should accept valid email', () => {
                const req = createMockRequest({
                    body: { username: 'testuser', email: 'test@example.com', password: 'password123' },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateSignupInput(req, res, next);

                expect(next).toHaveBeenCalled();
            });
        });

        describe('password validation', () => {
            it('should reject password shorter than 6 characters', () => {
                const req = createMockRequest({
                    body: { username: 'testuser', email: 'test@example.com', password: '12345' },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateSignupInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.jsonData.message).toBe('Password must be 6-32 characters long.');
                expect(next).not.toHaveBeenCalled();
            });

            it('should reject password longer than 32 characters', () => {
                const req = createMockRequest({
                    body: {
                        username: 'testuser',
                        email: 'test@example.com',
                        password: 'a'.repeat(33),
                    },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateSignupInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(next).not.toHaveBeenCalled();
            });

            it('should reject non-string password', () => {
                const req = createMockRequest({
                    body: { username: 'testuser', email: 'test@example.com', password: 123456 },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateSignupInput(req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(next).not.toHaveBeenCalled();
            });

            it('should accept valid password', () => {
                const req = createMockRequest({
                    body: { username: 'testuser', email: 'test@example.com', password: 'validpassword' },
                });
                const res = createMockResponse();
                const next = createMockNext();

                validateSignupInput(req, res, next);

                expect(next).toHaveBeenCalled();
            });
        });
    });
});
