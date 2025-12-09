/**
 * Specbot Input Validation Middleware Unit Tests
 * Note: These use express-validator which requires integration testing approach
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { validateChatInput, validateMessageInput } from '../../../../src/middlewares/specbot/inputValidation.js';
import { createMockRequest, createMockResponse, createMockNext } from '../../../setup.js';

// Mock express-validator
vi.mock('express-validator', () => ({
    body: vi.fn().mockImplementation(() => ({
        trim: vi.fn().mockReturnThis(),
        isLength: vi.fn().mockReturnThis(),
        isIn: vi.fn().mockReturnThis(),
        isUUID: vi.fn().mockReturnThis(),
        notEmpty: vi.fn().mockReturnThis(),
        withMessage: vi.fn().mockReturnThis(),
    })),
    validationResult: vi.fn(),
}));

import { validationResult } from 'express-validator';

describe('Specbot Input Validation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('validateChatInput', () => {
        it('should be an array with validation middleware', () => {
            expect(Array.isArray(validateChatInput)).toBe(true);
            expect(validateChatInput.length).toBeGreaterThan(0);
        });

        it('should call next when validation passes', () => {
            validationResult.mockReturnValue({
                isEmpty: () => true,
                array: () => [],
            });

            const req = createMockRequest({ body: { title: 'Valid Chat Title' } });
            const res = createMockResponse();
            const next = createMockNext();

            // Get the last middleware (the actual handler)
            const handler = validateChatInput[validateChatInput.length - 1];
            handler(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should return 400 when validation fails', () => {
            validationResult.mockReturnValue({
                isEmpty: () => false,
                array: () => [{ msg: 'Title is required' }],
            });

            const req = createMockRequest({ body: {} });
            const res = createMockResponse();
            const next = createMockNext();

            const handler = validateChatInput[validateChatInput.length - 1];
            handler(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.jsonData.errors).toBeDefined();
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('validateMessageInput', () => {
        it('should be an array with validation middleware', () => {
            expect(Array.isArray(validateMessageInput)).toBe(true);
            expect(validateMessageInput.length).toBeGreaterThan(0);
        });

        it('should call next when validation passes', () => {
            validationResult.mockReturnValue({
                isEmpty: () => true,
                array: () => [],
            });

            const req = createMockRequest({
                body: {
                    chat_type: 'specbot',
                    chat_id: '550e8400-e29b-41d4-a716-446655440000',
                    content: 'Hello, World!',
                    sender_type: 'user',
                    sender_id: '550e8400-e29b-41d4-a716-446655440001',
                },
            });
            const res = createMockResponse();
            const next = createMockNext();

            const handler = validateMessageInput[validateMessageInput.length - 1];
            handler(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should return 400 when validation fails', () => {
            validationResult.mockReturnValue({
                isEmpty: () => false,
                array: () => [{ msg: 'Chat type must be either specbot or group' }],
            });

            const req = createMockRequest({
                body: { chat_type: 'invalid' },
            });
            const res = createMockResponse();
            const next = createMockNext();

            const handler = validateMessageInput[validateMessageInput.length - 1];
            handler(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(next).not.toHaveBeenCalled();
        });
    });
});
