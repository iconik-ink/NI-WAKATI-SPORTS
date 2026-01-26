import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 👇 REQUIRED for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👇 FORCE dotenv to backend/.env
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

console.log("ENV CHECK:", {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
});


import connectDB from "./config/database.js";
import app from "./app.js";

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Startup failed:", err.message);
    process.exit(1);
  }
};

startServer();
