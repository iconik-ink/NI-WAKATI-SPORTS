import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { exportSubscribersCSV } from "../controllers/newsletter.admin.controller.js";

const router = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

/**
 * 🔐 Admin JWT middleware
 */
const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/**
 * 🔑 Admin login
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

/**
 * 📥 Export newsletter subscribers (CSV)
 */
router.get(
  "/newsletter/export",
  requireAdmin,
  exportSubscribersCSV
);

export default router;
