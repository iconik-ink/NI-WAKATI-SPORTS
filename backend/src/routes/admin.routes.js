import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;



router.post("/login", async (req, res) => {
  console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
  console.log("HAS HASH:", !!process.env.ADMIN_PASSWORD_HASH);

  const { email, password } = req.body;

  // 👇 READ ENV AT RUNTIME (NOT AT IMPORT TIME)
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

export default router;
