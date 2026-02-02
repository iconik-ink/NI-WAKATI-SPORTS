import jwt from "jsonwebtoken";
import crypto from "crypto";

// Read TEMP keys from .env
let TEMP_KEYS = process.env.TEMP_ADMIN_KEYS
  ? process.env.TEMP_ADMIN_KEYS.split(",")
  : [];

// -----------------------------
// 🔑 TEMP ADMIN LOGIN
// -----------------------------
export const tempAdminLogin = (req, res) => {
  const { key } = req.body;

  if (!key || !TEMP_KEYS.includes(key)) {
    return res.status(400).json({ message: "Temp admin key not configured" });
  }

  // Issue JWT for temporary admin
  const token = jwt.sign({ temp: true }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return res.json({ token });
};

// -----------------------------
// 🆕 GENERATE NEW TEMP KEY
// -----------------------------
export const generateTempKey = (req, res) => {
  try {
    // Create a unique key
    const randomKey =
      "TEMP-" + crypto.randomBytes(4).toString("hex") + "-" + new Date().getFullYear();

    // Store in TEMP_KEYS in memory (optional: store in DB for persistence)
    TEMP_KEYS.push(randomKey);

    return res.json({ key: randomKey });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to generate TEMP key" });
  }
};
