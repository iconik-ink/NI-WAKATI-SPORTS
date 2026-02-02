import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import adminAuth from "../middlewares/adminAuth.js";
import { exportSubscribersCSV } from "../controllers/newsletter.admin.controller.js";
import { tempAdminLogin } from "../controllers/tempAdmin.controller.js";
import { generateTempKey } from "../controllers/tempAdmin.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js"; // full admin only

const router = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;


// TEMP admin login route
router.post("/login-temp", tempAdminLogin);

router.post("/generate-temp-key", verifyAdmin, generateTempKey);

// ==============================
// 🔑 ADMIN LOGIN (PUBLIC)
// ==============================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

  if (!ADMIN_PASSWORD_HASH) {
    return res.status(500).json({
      message: "Admin password not configured"
    });
  }

  if (email !== ADMIN_EMAIL) {
    return res.status(401).json({
      message: "Invalid credentials"
    });
  }

  const valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!valid) {
    return res.status(401).json({
      message: "Invalid credentials"
    });
  }

  const token = jwt.sign(
    { role: "admin", email },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token });
});




// ==============================
// ⏳ TEMP ADMIN LOGIN (CLIENT)
// ==============================
router.post("/login-temp", async (req, res) => {
  const { key } = req.body;

  const TEMP_ADMIN_KEY = process.env.TEMP_ADMIN_KEY;

  if (!TEMP_ADMIN_KEY) {
    return res.status(500).json({
      message: "Temp admin key not configured"
    });
  }

  if (key !== TEMP_ADMIN_KEY) {
    return res.status(401).json({
      message: "Invalid temp admin key"
    });
  }

  const token = jwt.sign(
    {
      role: "admin",
      email: "client@temporary",
      temp: true,
      permissions: ["view", "export"]
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // ⏳ auto expires
  );

  res.json({ token });
});


// ==============================
// 🔒 PROTECT ALL ROUTES BELOW
// ==============================
router.use(adminAuth);

// ==============================
// 👤 VERIFY ADMIN SESSION
// ==============================
router.get("/me", (req, res) => {
  res.json({
    email: req.admin.email,
    role: req.admin.role
  });
});

// ==============================
// 📥 EXPORT NEWSLETTER (CSV)
// ==============================
router.get("/newsletter/export", exportSubscribersCSV);

export default router;
