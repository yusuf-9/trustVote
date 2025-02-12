import nodemailer from "nodemailer";

const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_PORT = process.env.SMTP_SERVER_PORT;

const SMTP_SERVER_EMAIL = process.env.SMTP_SERVER_EMAIL;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;

const SITE_MAIL_RECEIVER_EMAIL = process.env.SITE_MAIL_RECEIVER_EMAIL;

export async function sendOutwardMail(to: string, subject: string, html: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_SERVER_HOST,
      port: Number(SMTP_SERVER_PORT),
      secure: process.env.NODE_ENV === "production",
      auth: {
        user: SMTP_SERVER_EMAIL,
        pass: SMTP_SERVER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: SMTP_SERVER_EMAIL,
      to: to,
      subject: subject,
      html,
    });
  } catch (error) {
    console.error("Error creating transport client", error);
    throw error;
  }
}

export async function sendInwardMail(fromName: string, fromEmail: string, subject: string, message: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_SERVER_HOST,
      port: Number(SMTP_SERVER_PORT),
      secure: process.env.NODE_ENV === "production",
      auth: {
        user: SMTP_SERVER_EMAIL,
        pass: SMTP_SERVER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: SMTP_SERVER_EMAIL,
      to: SITE_MAIL_RECEIVER_EMAIL,
      replyTo: fromEmail,
      subject: `Plot-Express Email received from ${fromName}`,
      text: `
             New message from the website contact form:
      
             Name: ${name}
             Email: ${fromEmail}
             Subject: ${subject}
             Message: ${message}
           `,
    });
  } catch (error) {
    console.error("Error creating transport client", error);
    throw error;
  }
}