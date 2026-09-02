import { body } from "express-validator";

const nameRegex = /^[A-Za-z0-9 _-]{3,100}$/;
const descriptionRegex = /^.{5,1000}$/;
const statusValues = ["active", "on_hold", "completed", "archived"];
const urlRegex = /^https?:\/\/[^\s]+$/i;

export const projectValidator = [
    body('name').optional().matches(nameRegex).withMessage('Invalid project name format/length.'),
    body('description').optional().matches(descriptionRegex).withMessage('Project description length not sufficient'),
    body('status').optional().isIn(statusValues).withMessage('Invalid status value.'),
    body('start_date').optional().isDate({ format: 'YYYY-MM-DD', strictMode: true }).withMessage('start_date must be in YYYY-MM-DD format.'),
    body('end_date').optional().isDate({ format: 'YYYY-MM-DD', strictMode: true }).withMessage('end_date must be in YYYY-MM-DD format.'),
    body('start_date').custom((value, { req }) => {
        if (value && req.body.end_date) {
            if (new Date(value) > new Date(req.body.end_date)) {
                throw new Error('start_date cannot be later than end_date.');
            }
        }
        return true;
    }),
    body('cover_image_url').optional().matches(urlRegex).withMessage('Invalid cover_image_url.'),
    body('icon_url').optional().matches(urlRegex).withMessage('Invalid icon_url.'),
    body('tags').optional().isArray({ max: 10 }).withMessage('A maximum of 10 tags is allowed.'),
    body('tags.*').optional().isString().isLength({ min: 3, max: 30 }).withMessage('Each tag must be a string between 3 and 30 characters.'),
    body('members').optional().isArray().withMessage('members must be an array.'),
    body('members.*').optional().isString().withMessage('Each member must be a string.')
];

export const createProjectValidator = [
    body('name').notEmpty().withMessage('name is required.'),
    body('start_date').notEmpty().withMessage('start_date is required.'),
    body('end_date').notEmpty().withMessage('end_date is required.'),
    ...projectValidator
];

export const updateProjectValidator = [
    ...projectValidator
];
