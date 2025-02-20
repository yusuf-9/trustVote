import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);

export async function sendOutwardMail(to: string, subject: string, html: string) {
  try {
    await resend.emails.send({
      from: process.env.VERIFICATION_EMAIL_SENDER_ADDRESS!,
      to: [to],
      subject: subject,
      html: html,
    });
  } catch (error) {
    console.error("Error sending email via Resend", error);
    throw error;
  }
}

export async function sendInwardMail(fromName: string, fromEmail: string, subject: string, message: string) {
  try {
    await resend.emails.send({
      from: process.env.VERIFICATION_EMAIL_SENDER_ADDRESS!,
      to: [process.env.SITE_MAIL_RECEIVER_EMAIL!],
      replyTo: fromEmail,
      subject: `TrustVote Email received from ${fromName}`,
      text: `
        New message from the website contact form:
        
        Name: ${fromName}
        Email: ${fromEmail}
        Subject: ${subject}
        Message: ${message}
      `,
    });
  } catch (error) {
    console.error("Error sending inward email via Resend", error);
    throw error;
  }
}
