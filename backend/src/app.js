import express from "express";
import cors from "cors";

import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import newsletterRouter from "./routes/newsletter.routes.js";
import adminRouter from "./routes/admin.routes.js";

const app = express();

app.use(cors());
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
