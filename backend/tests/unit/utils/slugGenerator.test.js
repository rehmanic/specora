/**
 * Slug Generator Utility Unit Tests
 */

import { describe, it, expect } from 'vitest';
import { generateSlug } from '../../../src/utils/slugGenerator.js';

describe('slugGenerator', () => {
    describe('generateSlug', () => {
        it('should convert name to lowercase', () => {
            expect(generateSlug('Test Project')).toBe('test-project');
        });

        it('should replace spaces with hyphens', () => {
            expect(generateSlug('my project name')).toBe('my-project-name');
        });

        it('should remove special characters', () => {
            expect(generateSlug('Project@#$%Name!')).toBe('projectname');
        });

        it('should handle multiple spaces', () => {
            expect(generateSlug('my    project')).toBe('my-project');
        });

        it('should collapse multiple hyphens', () => {
            expect(generateSlug('my---project')).toBe('my-project');
        });

        it('should trim whitespace', () => {
            expect(generateSlug('  project name  ')).toBe('project-name');
        });

        it('should handle mixed case and special characters', () => {
            expect(generateSlug('My Cool Project! (2024)')).toBe('my-cool-project-2024');
        });

        it('should handle numbers', () => {
            expect(generateSlug('Project 123')).toBe('project-123');
        });

        it('should handle empty string', () => {
            expect(generateSlug('')).toBe('');
        });

        it('should preserve hyphens', () => {
            expect(generateSlug('my-project')).toBe('my-project');
        });

        it('should handle only special characters', () => {
            expect(generateSlug('@#$%^&*()')).toBe('');
        });

        it('should handle unicode characters', () => {
            // Unicode special chars get removed, only basic alphanumeric remain
            expect(generateSlug('Café Project')).toBe('caf-project');
        });
    });
});
