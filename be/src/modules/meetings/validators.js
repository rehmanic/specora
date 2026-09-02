import { body } from "express-validator";

export const createMeetingValidator = [
    body('title').isString().trim().notEmpty().withMessage('Title is required and must be a non-empty string'),
    body('start_time').isISO8601().withMessage('Start time must be a valid ISO 8601 date'),
    body('end_time').isISO8601().withMessage('End time must be a valid ISO 8601 date'),
    body('timezone').optional().isString().trim(),
    body('participants').optional().isArray().withMessage('Participants must be an array'),
    body('description').optional().isString().trim()
];

export const updateMeetingValidator = [
    body('title').optional().isString().trim().notEmpty().withMessage('Title cannot be empty if provided'),
    body('status').optional().isString().trim().isIn(['scheduled', 'in_progress', 'completed', 'cancelled']).withMessage('Invalid status'),
    body('start_time').optional().isISO8601().withMessage('Start time must be a valid ISO 8601 date'),
    body('end_time').optional().isISO8601().withMessage('End time must be a valid ISO 8601 date')
];
