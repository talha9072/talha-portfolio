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

    // Send email to yourself (your business inbox)
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: "info@prime.talha-solutions.site", // 👈 your receiving address (you)
      replyTo: email, // so you can reply directly to sender
      subject: subject || `New message from ${name}`,
      html: `
        <h2>New Contact Message from Website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    // Optional: Send auto-confirmation to the user
    await transporter.sendMail({
      from: `"Talha Solutions" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "We received your message ✅",
      html: `
        <p>Hi ${name},</p>
        <p>Thanks for contacting us! We’ve received your message and will get back to you shortly.</p>
        <p>— Team Talha Solutions</p>
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
