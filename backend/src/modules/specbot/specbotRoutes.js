import express from 'express';
import { createSpecbotChat, deleteSpecbotChat, getAllSpecbotChats, updateSpecbotChat, createMessage, getAllMessages } from './specbotController.js';
import { requireClient } from '../../middlewares/common/roleCheck.js';
import { validateChatInput, validateMessageInput } from '../../middlewares/specbot/inputValidation.js';
import requireFields from '../../middlewares/common/requireFields.js';
import { verifyToken } from '../../middlewares/common/verifyToken.js';

const router = express.Router();

router.use(verifyToken);

router.post('/chat/create', requireFields(["title"]), requireClient, validateChatInput, createSpecbotChat);
router.delete('/chat/delete/:chatId', requireClient, deleteSpecbotChat);
router.get('/chat/all', requireClient, getAllSpecbotChats);
router.put('/chat/update/:chatId', requireFields(["title"]), requireClient, validateChatInput, updateSpecbotChat);
router.post('/message/create', requireFields(["chat_type", "chat_id", "content", "sender_type", "sender_id"]), requireClient, validateMessageInput, createMessage);
router.get('/messages/all/:chatId', requireClient, getAllMessages);

export default router;
