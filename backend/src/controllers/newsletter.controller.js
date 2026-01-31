// backend/src/controllers/newsletter.controller.js
import { Newsletter } from "../models/newsletter.model.js";
import transporter from "../config/mailer.js";

// ------------------
// Subscribe to newsletter
// ------------------
export const subscribeNewsletter = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Check if already subscribed
    const exists = await Newsletter.findOne({ email });
    if (exists) {
      // ✅ Return 200 so frontend spinner stops
      return res.status(200).json({ message: "Email already subscribed" });
    }

    // Save new subscriber
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

    res.status(201).json({ message: "Subscription successful. Check your email 📩" });
  } catch (err) {
    console.error("Newsletter error:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
