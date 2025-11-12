const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  try {
    // Parse form data from frontend
    const { name, email, subject, message } = JSON.parse(event.body);

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

    // ✅ Send a single email to you (admin)
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: "talhashahid978@gmail.com", // your destination email
      replyTo: email,
      subject: subject || `New message from ${name}`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;color:#333;line-height:1.6;">
          <h2 style="color:#0d6efd;">New Contact Form Submission</h2>
          <table style="border-collapse:collapse;width:100%;max-width:600px;">
            <tr><td style="padding:6px 0;"><strong>Name:</strong> ${name}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Email:</strong> ${email}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Subject:</strong> ${subject}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Message:</strong></td></tr>
            <tr><td style="padding:10px;background:#f8f9fa;border-left:4px solid #0d6efd;">${message.replace(/\n/g, "<br>")}</td></tr>
          </table>

          <hr style="margin:25px 0;border:none;border-top:1px solid #ddd;">
          <div style="font-size:14px;color:#555;">
            <strong style="font-size:16px;color:#0d6efd;">Talha Solutions</strong><br>
            Digital Development & Automation Agency<br>
            📧 <a href="mailto:info@prime.talha-solutions.site" style="color:#0d6efd;text-decoration:none;">info@prime.talha-solutions.site</a><br>
            🌐 <a href="https://www.talha-solutions.site" style="color:#0d6efd;text-decoration:none;">www.talha-solutions.site</a><br>
            📍 Sargodha, Pakistan
          </div>
          <p style="margin-top:10px;font-size:12px;color:#999;">
            © ${new Date().getFullYear()} Talha Solutions | All Rights Reserved
          </p>
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
