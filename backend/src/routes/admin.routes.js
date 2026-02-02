import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import adminAuth from "../middlewares/adminAuth.js"; // protects routes
import { exportSubscribersCSV } from "../controllers/newsletter.admin.controller.js";
import { tempAdminLogin, generateTempKey } from "../controllers/tempAdmin.controller.js";


const router = express.Router();

// ==============================
// 🔑 FULL ADMIN LOGIN
// ==============================
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

  if (!ADMIN_PASSWORD_HASH) return res.status(500).json({ message: "Admin password not configured" });
  if (email !== ADMIN_EMAIL) return res.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET, { expiresIn: "2h" });
  res.json({ token });
});

// ==============================
// 🔑 TEMP ADMIN LOGIN
// ==============================
router.post("/login-temp", tempAdminLogin);

// ==============================
// 🆕 GENERATE TEMP KEY (FULL ADMINS ONLY)
// ==============================
router.post("/generate-temp-key", adminAuth, generateTempKey);


// ==============================
// 🔒 PROTECT ALL ROUTES BELOW
// ==============================
router.use(adminAuth);

// ==============================
// 👤 VERIFY ADMIN SESSION
// ==============================
router.get("/me", (req, res) => {
  res.json({ email: req.admin.email, role: req.admin.role });
});

// ==============================
// 📥 EXPORT NEWSLETTER (CSV)
// ==============================
router.get("/newsletter/export", exportSubscribersCSV);

export default router;
