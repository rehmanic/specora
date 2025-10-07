import express from "express";

const router = express.Router();

router.post("/chat", (req, res) => {
  res.json({ message: "Specbot chat endpoint - to be implemented" });
});

export default router;
