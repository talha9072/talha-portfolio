import nodemailer from "nodemailer";

export async function handler(event) {
  try {
    // Parse incoming data from form
    const { name, email, message } = JSON.parse(event.body);

    // Configure Hostinger SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, // info@prime.talha-solutions.site
        pass: process.env.EMAIL_PASS, // your Hostinger mailbox password
      },
    });

    // Email details
    await transporter.sendMail({
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      to: "yourpersonal@gmail.com", // Change to your receiving address
      subject: `New message from ${name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Email sent successfully!" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
}
