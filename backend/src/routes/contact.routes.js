import express from "express";
import { sendContactEmail } from "../controllers/contact.controller.js";

const router = express.Router();

// PUBLIC
router.post("/", sendContactEmail);

export default router;
