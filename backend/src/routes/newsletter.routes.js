import express from "express";
import {
  subscribeNewsletter,
  getAllSubscribers,
  deleteSubscriber
} from "../controllers/newsletter.controller.js";
import adminAuth from "../middlewares/adminAuth.js";

const router = express.Router();

// ------------------
// PUBLIC ROUTES
// ------------------
router.post("/subscribe", subscribeNewsletter);

// ------------------
// ADMIN ONLY ROUTES
// ------------------
router.get("/subscribers", adminAuth, getAllSubscribers);
router.delete("/subscribers/:id", adminAuth, deleteSubscriber);

export default router;
