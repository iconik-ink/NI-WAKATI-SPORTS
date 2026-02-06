import express from "express";
import Content from "../models/content.model.js";
import adminAuth from "../middlewares/adminAuth.js";

const router = express.Router();

// =======================
// GET content (public)
// =======================
router.get("/:page", async (req, res) => {
  try {
    const content = await Content.findOne({ page: req.params.page });
    res.status(200).json(content || { page: req.params.page, data: {} });
  } catch (error) {
    console.error("Fetch content error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// =======================
// UPDATE content (admin/editor only)
// =======================
router.post("/:page", adminAuth, async (req, res) => {
  try {
    // ✅ Role check
    if (!["admin", "editor"].includes(req.admin.role)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // Upsert content: create if doesn't exist, else update
    const updated = await Content.findOneAndUpdate(
      { page: req.params.page },
      { data: req.body, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, content: updated });
  } catch (error) {
    console.error("Update content error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
});

export default router;
