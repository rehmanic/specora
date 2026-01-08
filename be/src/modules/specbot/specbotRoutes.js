import express from 'express';
import {
  createSpecbotChat,
  deleteSpecbotChat,
  getAllSpecbotChats,
  updateSpecbotChat,
  createMessage,
  getAllMessages,
  downloadSpecbotChat,
  summarizeSpecbotChat,
  extractRequirementsFromChat,
} from './specbotController.js';
import { requireClient, requireRoles } from '../../middlewares/common/roleCheck.js';
import { validateChatInput, validateMessageInput } from '../../middlewares/specbot/inputValidation.js';
import requireFields from '../../middlewares/common/requireFields.js';
import { verifyToken } from '../../middlewares/common/verifyToken.js';

const router = express.Router();

router.use(verifyToken);

router.post('/chat/create', requireFields(["title"]), requireClient, validateChatInput, createSpecbotChat);
router.delete('/chat/delete/:chatId', requireClient, deleteSpecbotChat);
router.get('/chat/all', requireRoles("client", "manager", "requirements_engineer"), getAllSpecbotChats);
router.put('/chat/update/:chatId', requireFields(["title"]), requireClient, validateChatInput, updateSpecbotChat);
router.post('/message/create', requireFields(["chat_type", "chat_id", "content", "sender_type", "sender_id"]), requireClient, validateMessageInput, createMessage);
router.get('/messages/all/:chatId', requireRoles("client", "manager", "requirements_engineer"), getAllMessages);
router.post('/chat/:chatId/download', requireRoles("client", "manager", "requirements_engineer"), downloadSpecbotChat);
router.post('/chat/:chatId/summarize', requireRoles("client", "manager", "requirements_engineer"), summarizeSpecbotChat);
router.post('/chat/:chatId/extract', requireRoles("client", "manager", "requirements_engineer"), extractRequirementsFromChat);

export default router;
