import express from "express";

const router = express.Router();

router.post("/login", (req, res) => {
  res.json({ message: "Login endpoint - to be implemented" });
});

router.post("/register", (req, res) => {
  res.json({ message: "Register endpoint - to be implemented" });
});

export default router;
