// backend/src/routes/newsletter.routes.js

import express from "express";
import {
  subscribeNewsletter,
  getAllSubscribers,
  deleteSubscriber
} from "../controllers/newsletter.controller.js";
import adminAuth from "../middlewares/adminAuth.js";

// ✅ JWT middleware

const router = express.Router();

// ------------------
// PUBLIC ROUTES
// ------------------
router.post("/subscribe", subscribeNewsletter);

// ------------------
// ADMIN ONLY ROUTES
// ------------------

// Get all subscribers
router.get("/subscribers", adminAuth, getAllSubscribers);

// Delete a subscriber by ID
router.delete("/subscribers/:id", adminAuth, deleteSubscriber);

export default router;
