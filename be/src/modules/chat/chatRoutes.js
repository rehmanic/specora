import express from "express";
import { getProjectGroupChat, getGroupMessages, saveGroupMessage, deleteGroupMessage } from "./chatController.js";
import { verifyToken } from "../../middlewares/common/verifyToken.js";
import { requirePermissions } from "../../middlewares/common/requirePermissions.js";

const router = express.Router();

router.get("/project/:projectId", verifyToken, requirePermissions("view_group_chat_messages"), getProjectGroupChat);
router.get("/:chatId/messages", verifyToken, requirePermissions("view_group_chat_messages"), getGroupMessages);
router.post("/:chatId/messages", verifyToken, requirePermissions("send_group_chat_message"), saveGroupMessage);
router.delete("/message/:messageId", verifyToken, requirePermissions("delete_group_chat_message"), deleteGroupMessage);

export default router;
