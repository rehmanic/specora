import { body } from "express-validator";

const VALID_PRIORITIES = ['low', 'mid', 'high'];
const VALID_STATUSES = ['draft', 'pending', 'approved', 'rejected'];

export const createRequirementValidator = [
    body('title').isString().trim().notEmpty().withMessage('Title is required and must be a non-empty string'),
    body('description').isString().trim().notEmpty().withMessage('Description is required and must be a non-empty string'),
    body('priority').optional().isIn(VALID_PRIORITIES).withMessage(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}`),
    body('status').optional().isIn(VALID_STATUSES).withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('category').optional().isString(),
    body('attributes').optional().isObject(),
];

export const updateRequirementValidator = [
    body('title').optional().isString().trim().notEmpty().withMessage('Title cannot be empty if provided'),
    body('description').optional().isString().trim().notEmpty().withMessage('Description cannot be empty if provided'),
    body('priority').optional().isIn(VALID_PRIORITIES).withMessage(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}`),
    body('status').optional().isIn(VALID_STATUSES).withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('change_reason').optional().isString().trim()
];

export const addCommentValidator = [
    body('content').isString().trim().notEmpty().withMessage('Comment content is required')
];

export const createTraceabilityLinkValidator = [
    body('target_type').isString().trim().notEmpty().withMessage('Target type is required'),
    body('target_id').isString().trim().notEmpty().withMessage('Target ID is required'),
    body('link_type').isString().trim().notEmpty().withMessage('Link type is required')
];

export const importRequirementsValidator = [
    body('requirements').isArray({ min: 1 }).withMessage('Requirements must be a non-empty array')
];
