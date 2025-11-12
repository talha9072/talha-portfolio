const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  try {
    // Parse form data from frontend
    const { name, email, phone, subject, message } = JSON.parse(event.body);

    // Configure Hostinger SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, // info@prime.talha-solutions.site
        pass: process.env.EMAIL_PASS, // Hostinger mailbox password
      },
    });

    // 1️⃣ Send full message to you (admin)
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: "talhashahid978@gmail.com", // where you’ll receive all inquiries
      replyTo: email,
      subject: subject || `New message from ${name}`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;color:#333;">
          <h2 style="color:#0d6efd;">New Contact Message from Website</h2>
          <table style="border-collapse:collapse;width:100%;max-width:600px;">
            <tr><td style="padding:6px 0;"><strong>Name:</strong> ${name}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Email:</strong> ${email}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Phone:</strong> ${phone || "—"}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Subject:</strong> ${subject}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Message:</strong><br>
              <div style="margin-top:8px;padding:10px;background:#f8f9fa;border-left:4px solid #0d6efd;">
                ${message.replace(/\n/g, "<br>")}
              </div>
            </td></tr>
          </table>
          <hr style="margin:20px 0;border:none;border-top:1px solid #eee;">
          <p style="font-size:13px;color:#777;">This message was submitted via your website contact form.</p>
        </div>
      `,
    });

    // 2️⃣ Auto-reply confirmation to visitor
    await transporter.sendMail({
      from: `"Talha Solutions" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ We’ve received your message — Talha Solutions",
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;color:#333;line-height:1.6;background-color:#f9f9f9;padding:30px;">
          <div style="max-width:600px;margin:auto;background:#fff;padding:25px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <h2 style="color:#0d6efd;">Hi ${name},</h2>
            <p>Thank you for getting in touch! We’ve received your message and our team will respond soon.</p>

            <p style="margin-top:20px;">Here’s a copy of what you sent:</p>
            <blockquote style="margin:10px 0;padding:10px 15px;background:#f1f1f1;border-left:4px solid #0d6efd;">
              <p style="margin:0;"><strong>Phone:</strong> ${phone || "—"}<br>
              <strong>Subject:</strong> ${subject}<br><br>
              ${message.replace(/\n/g, "<br>")}</p>
            </blockquote>

            <p style="margin-top:25px;">We appreciate your interest in our services!</p>

            <!-- Signature -->
            <hr style="border:none;border-top:1px solid #ddd;margin:25px 0;">
            <div style="font-size:14px;color:#555;">
              <strong style="font-size:16px;color:#0d6efd;">Talha Solutions</strong><br>
              Digital Development & Automation Agency<br>
              📧 <a href="mailto:info@prime.talha-solutions.site" style="color:#0d6efd;text-decoration:none;">info@prime.talha-solutions.site</a><br>
              🌐 <a href="https://www.talha-solutions.site" style="color:#0d6efd;text-decoration:none;">www.talha-solutions.site</a><br>
              📍 Sargodha, Pakistan<br>
              📞 +92 XXX XXXXXXX
            </div>
            <p style="margin-top:15px;font-size:12px;color:#999;">
              © ${new Date().getFullYear()} Talha Solutions | All Rights Reserved
            </p>
          </div>
        </div>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Email sent successfully!" }),
    };
  } catch (error) {
    console.error("Email send failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
