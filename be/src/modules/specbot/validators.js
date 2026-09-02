import { body } from 'express-validator';

export const validateChatInput = [
    body('title')
        .trim()
        .isLength({ min: 3, max: 255 }).withMessage('Title must be between 3 and 255 characters')
];

export const validateMessageInput = [
    body('chat_type')
        .trim()
        .isIn(['specbot', 'group']).withMessage('Chat type must be either specbot or group'),
    body('chat_id')
        .isUUID().withMessage('Chat ID must be a valid UUID'),
    body('content')
        .trim()
        .notEmpty().withMessage('Content is required'),
    body('sender_type')
        .trim()
        .isIn(['user', 'bot']).withMessage('Sender type must be either user or bot'),
    body('sender_id')
        .isUUID().withMessage('Sender ID must be a valid UUID')
];
