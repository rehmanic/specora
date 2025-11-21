import { body, validationResult } from 'express-validator';

export const validateCreateChat = [
    body('title')
        .trim()
        .isLength({ min: 3, max: 255 }).withMessage('Title must be between 3 and 255 characters'),
    body('project_id')
        .isUUID().withMessage('Project ID must be a valid UUID'),
    body('user_id')
        .isUUID().withMessage('User ID must be a valid UUID'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
