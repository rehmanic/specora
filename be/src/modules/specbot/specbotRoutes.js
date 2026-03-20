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
  clearSpecbotMessages,
} from './specbotController.js';
import { validateChatInput, validateMessageInput } from '../../middlewares/specbot/inputValidation.js';
import requireFields from '../../middlewares/common/requireFields.js';
import { verifyToken } from '../../middlewares/common/verifyToken.js';
import { requirePermissions } from '../../middlewares/common/requirePermissions.js';

const router = express.Router();

router.use(verifyToken);

// Chat CRUD
router.post('/chat/create', requirePermissions("create_specbot_chat"), requireFields(["title"]), validateChatInput, createSpecbotChat);
router.delete('/chat/delete/:chatId', requirePermissions("delete_specbot_chat"), deleteSpecbotChat);
router.delete('/chat/:chatId/clear', requirePermissions("delete_specbot_chat_message"), clearSpecbotMessages);
router.get('/chat/all', requirePermissions("view_specbot_chat"), getAllSpecbotChats);
router.put('/chat/update/:chatId', requirePermissions("update_specbot_chat"), requireFields(["title"]), validateChatInput, updateSpecbotChat);

// Messages
router.post('/message/create', requirePermissions("send_specbot_chat_message"), requireFields(["chat_type", "chat_id", "content", "sender_type", "sender_id"]), validateMessageInput, createMessage);
router.get('/messages/all/:chatId', requirePermissions("view_specbot_chat_messages"), getAllMessages);

// Advanced actions
router.post('/chat/:chatId/download', requirePermissions("download_specbot_chat_messages"), downloadSpecbotChat);
router.post('/chat/:chatId/summarize', requirePermissions("summarize_specbot_chat"), summarizeSpecbotChat);
router.post('/chat/:chatId/extract', requirePermissions("extract_requirements_from_specbot_chat"), extractRequirementsFromChat);

export default router;
