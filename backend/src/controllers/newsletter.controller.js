import { Newsletter } from "../models/newsletter.model.js";
import transporter from "../config/mailer.js";

// ------------------
// Subscribe to newsletter
// ------------------
export const subscribeNewsletter = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const exists = await Newsletter.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already subscribed" });

    const subscriber = await Newsletter.create({ email });

    // ✉️ Send confirmation email
    await transporter.sendMail({
      from: `"NI WAKATI SPORTS" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to NI WAKATI SPORTS 🏆",
      html: `
        <h2>Welcome to NI WAKATI SPORTS!</h2>
        <p>Thanks for subscribing to our newsletter.</p>
        <p>You’ll now receive the latest sports updates, news, and exclusive content.</p>
        <br/>
        <strong>— NI WAKATI SPORTS Team</strong>
      `
    });

    res.status(201).json({
      message: "Subscription successful. Check your email 📩",
      subscriber
    });
  } catch (err) {
    console.error("Newsletter error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------
// Admin: Get all subscribers
// ------------------
export const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.json({ subscribers });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch subscribers" });
  }
};

// ------------------
// Admin: Delete subscriber
// ------------------
export const deleteSubscriber = async (req, res) => {
  try {
    const deleted = await Newsletter.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Subscriber not found" });
    res.json({ message: "Subscriber deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete subscriber" });
  }
};
