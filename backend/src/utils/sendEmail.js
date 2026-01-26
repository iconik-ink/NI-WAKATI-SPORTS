import nodemailer from "nodemailer";

export const sendWelcomeEmail = async (toEmail) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  await transporter.sendMail({
    from: `"Ni-Wakati Sports" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Welcome to Ni-Wakati Sports 🎉",
    html: `
      <h2>Welcome to Ni-Wakati Sports!</h2>
      <p>Thank you for subscribing to our newsletter.</p>
      <p>You’ll receive updates, events, and community stories from us.</p>
      <br/>
      <strong>— Ni-Wakati Sports Team</strong>
    `
  });
};
