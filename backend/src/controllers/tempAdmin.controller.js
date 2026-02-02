import jwt from "jsonwebtoken";

// Read TEMP keys from .env
const TEMP_KEYS = process.env.TEMP_ADMIN_KEYS
  ? process.env.TEMP_ADMIN_KEYS.split(",")
  : [];

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
