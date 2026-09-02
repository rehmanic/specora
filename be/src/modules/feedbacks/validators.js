import { body } from "express-validator";

export const createFeedbackValidator = [
    body('project_id').isString().trim().notEmpty().withMessage('project_id is required'),
    body('title').isString().trim().notEmpty().withMessage('title is required and must be a string'),
    body('description').optional().isString().trim(),
    body('status').optional().isIn(['draft', 'published', 'closed']).withMessage('Invalid status'),
    body('form_schema').optional().isArray().withMessage('form_schema must be an array of fields')
];

export const updateFeedbackValidator = [
    body('title').optional().isString().trim().notEmpty().withMessage('title cannot be empty if provided'),
    body('description').optional().isString().trim(),
    body('status').optional().isIn(['draft', 'published', 'closed']).withMessage('Invalid status'),
    body('form_schema').optional().isArray().withMessage('form_schema must be an array of fields')
];

export const submitResponseValidator = [
    body('response_data').isObject().withMessage('response_data must be an object containing the answers')
];
