import express from "express";
import cors from "cors";

import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import newsletterRouter from "./routes/newsletter.routes.js";
import adminRouter from "./routes/admin.routes.js";

const app = express();

const allowedOrigins = [
  "https://ni-wakati-sports.netlify.app",
  "https://ni-wakati-sports-1.onrender.com",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5500"   
];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Postman / curl

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error("Blocked by CORS:", origin);
    return callback(new Error("CORS not allowed"));
  },
  credentials: true
}));




app.use(express.json());
//for render.com
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "NI WAKATI SPORTS API",
    message: "Backend is running"
  });
});


app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/newsletter", newsletterRouter);
app.use("/api/v1/admin", adminRouter);

export default app;
