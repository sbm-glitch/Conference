import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    // console.log("Email credentials:", process.env.EMAIL_USER, process.env.EMAIL_PASS ? "✅ Loaded" : "❌ Missing");

    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465, // or 587 if 465 doesn’t work
      secure: true, // true for port 465, false for 587
      auth: {
        user: process.env.EMAIL_USER, // e.g., info@yourdomain.com
        pass: process.env.EMAIL_PASS, // your Hostinger email password
      },
    });

    const mailOptions = {
      from: `"Conference Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    // console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
  }
};

