import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { adminAuth } from "../middleware/adminAuth.js";
import { exportSubscribersCSV } from "../controllers/newsletter.admin.controller.js";

const router = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

/**
 * 🔑 Admin login (PUBLIC)
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

  if (!ADMIN_PASSWORD_HASH) {
    return res.status(500).json({ message: "Admin password not configured" });
  }

  if (email !== ADMIN_EMAIL) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { role: "admin", email },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token });
});

/* 🔒 PROTECT EVERYTHING BELOW */
router.use(adminAuth);

/**
 * 📥 Export newsletter subscribers (ADMIN ONLY)
 */
router.get("/newsletter/export", exportSubscribersCSV);

export default router;
