import { validationResult } from "express-validator";
import AppError from "../utils/AppError.js";

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => `${err.path}: ${err.msg}`).join(', ');
        return next(new AppError(`Validation failed: ${errorMessages}`, 400));
    }
    next();
};
