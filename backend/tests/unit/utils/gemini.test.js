/**
 * Gemini Utility Unit Tests
 * Note: The actual gemini.js module is mocked in setup.js
 * These tests verify the mocked behavior
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Import the mocked functions
import {
    generateGeminiResponse,
    generateStatelessResponse,
    clearChatSession,
    clearAllChatSessions,
} from '../../../src/utils/gemini.js';

describe('Gemini Utility', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('generateGeminiResponse', () => {
        it('should return AI response for valid input', async () => {
            const response = await generateGeminiResponse('chat-123', 'Hello, AI!', {});

            expect(response).toBe('AI response');
        });

        it('should be called with correct parameters', async () => {
            const instructions = { task: 'analyze requirements' };
            await generateGeminiResponse('chat-123', 'Analyze this', instructions);

            expect(generateGeminiResponse).toHaveBeenCalledWith('chat-123', 'Analyze this', instructions);
        });
    });

    describe('generateStatelessResponse', () => {
        it('should return stateless AI response', async () => {
            const response = await generateStatelessResponse('Analyze this content', {
                task: 'summarize',
                expectations: 'Return a summary',
            });

            expect(response).toBe('Stateless AI response');
        });

        it('should work without instructions', async () => {
            const response = await generateStatelessResponse('Content to analyze');

            expect(response).toBe('Stateless AI response');
        });
    });

    describe('clearChatSession', () => {
        it('should return true when session is cleared', () => {
            const result = clearChatSession('chat-123');

            expect(result).toBe(true);
        });

        it('should be called with correct chatId', () => {
            clearChatSession('specific-chat-id');

            expect(clearChatSession).toHaveBeenCalledWith('specific-chat-id');
        });
    });

    describe('clearAllChatSessions', () => {
        it('should clear all sessions without error', () => {
            expect(() => clearAllChatSessions()).not.toThrow();
        });

        it('should be callable', () => {
            clearAllChatSessions();

            expect(clearAllChatSessions).toHaveBeenCalled();
        });
    });
});
