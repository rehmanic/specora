import express from "express";
import { getProjectGroupChat, getGroupMessages, saveGroupMessage, deleteGroupMessage } from "./chatController.js";
import { verifyToken } from "../../middlewares/common/verifyToken.js";

const router = express.Router();

router.get("/project/:projectId", verifyToken, getProjectGroupChat);
router.get("/:chatId/messages", verifyToken, getGroupMessages);
router.post("/:chatId/messages", verifyToken, saveGroupMessage);
router.delete("/message/:messageId", verifyToken, deleteGroupMessage);

export default router;
