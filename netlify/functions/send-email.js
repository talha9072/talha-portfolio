const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  try {
    const { name, email, subject, message } = JSON.parse(event.body);

    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, // info@prime.talha-solutions.site
        pass: process.env.EMAIL_PASS, // Hostinger mailbox password
      },
    });

    // 1️⃣ Email to yourself
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: "info@prime.talha-solutions.site",
      replyTo: email,
      subject: subject || `New message from ${name}`,
      html: `
        <h2 style="color:#0d6efd;">New Contact Message from Website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-line;">${message}</p>
        <hr style="margin:20px 0;border:none;border-top:1px solid #eee;">
        <p style="font-size:13px;color:#777;">This message was sent from your website contact form.</p>
      `,
    });

    // 2️⃣ Auto-reply with signature
    await transporter.sendMail({
      from: `"Talha Solutions" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "We’ve received your message — Talha Solutions",
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;color:#333;line-height:1.6;background-color:#f9f9f9;padding:30px;">
          <div style="max-width:600px;margin:auto;background:#fff;padding:25px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <h2 style="color:#0d6efd;">Thank you for reaching out, ${name}!</h2>
            <p>We’ve received your message and our team will get back to you shortly.</p>

            <p style="margin-top:20px;">Here’s a copy of what you sent:</p>
            <blockquote style="margin:10px 0;padding:10px 15px;background:#f1f1f1;border-left:4px solid #0d6efd;">
              <p style="margin:0;white-space:pre-line;">${message}</p>
            </blockquote>

            <p style="margin-top:25px;">In the meantime, feel free to visit our website or reply to this email if you have any updates.</p>

            <!-- Signature -->
            <hr style="border:none;border-top:1px solid #ddd;margin:25px 0;">
            <table style="font-size:14px;color:#555;">
              <tr>
                <td style="padding-right:12px;vertical-align:top;">
                  <img src="https://prime.talha-solutions.site/assets/logo.png" width="60" alt="Talha Solutions Logo" style="border-radius:8px;">
                </td>
                <td style="vertical-align:top;">
                  <strong style="font-size:16px;color:#0d6efd;">Talha Solutions</strong><br>
                  <span style="color:#333;">Digital Development & Automation Agency</span><br>
                  📧 <a href="mailto:info@prime.talha-solutions.site" style="color:#0d6efd;text-decoration:none;">info@prime.talha-solutions.site</a><br>
                  🌐 <a href="https://www.talha-solutions.site" style="color:#0d6efd;text-decoration:none;">www.talha-solutions.site</a><br>
                  📍 Sargodha, Pakistan
                </td>
              </tr>
            </table>
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
