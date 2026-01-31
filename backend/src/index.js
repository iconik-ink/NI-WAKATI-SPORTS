import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/database.js";
import app from "./app.js";

console.log("ENV CHECK:", {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
});

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (ENV PORT=${process.env.PORT})`);
    });

  } catch (err) {
    console.error("Startup failed:", err.message);
    process.exit(1);
  }
};

startServer();
