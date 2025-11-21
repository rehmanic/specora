import express from 'express';
import { createSpecbotChat } from './specbotController.js';
import { requireClient } from '../../middlewares/common/roleCheck.js';
import { validateCreateChat } from '../../middlewares/specbot/inputValidation.js';
import requireFields from '../../middlewares/common/requireFields.js';
import { verifyToken } from '../../middlewares/common/verifyToken.js';

const router = express.Router();

router.use(verifyToken);

router.post('/chat/create', requireFields(["title"]), requireClient, validateCreateChat, createSpecbotChat);

export default router;
