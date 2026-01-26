import { Newsletter } from "../models/newsletter.model.js";
import { sendWelcomeEmail } from "../utils/sendEmail.js";

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingEmail = await Newsletter.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        message: "This email is already subscribed"
      });
    }

    await Newsletter.create({ email });

    // ✅ Send welcome email
    await sendWelcomeEmail(email);

    res.status(201).json({
      message: "Subscribed successfully & welcome email sent 🎉"
    });

  } catch (error) {
    console.error("Newsletter error:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

// GET ALL SUBSCRIBERS
export const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: subscribers.length,
      subscribers
    });
  } catch (error) {
    console.error("Get subscribers error:", error);
    res.status(500).json({
      message: "Failed to fetch subscribers"
    });
  }
};

// DELETE A SUBSCRIBER
export const deleteSubscriber = async (req, res) => {
  const { id } = req.params;

  try {
    const subscriber = await Newsletter.findByIdAndDelete(id);

    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }

    res.status(200).json({ message: "Subscriber deleted successfully" });
  } catch (error) {
    console.error("Delete subscriber error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

