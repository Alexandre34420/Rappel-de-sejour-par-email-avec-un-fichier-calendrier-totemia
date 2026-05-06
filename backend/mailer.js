import nodemailer from "nodemailer";

export default async function sendMail({ to, subject, text, icsFile }) {
  // Création du transporteur SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail", // Tu peux changer si tu veux un autre service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Envoi de l'email
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    attachments: [
      {
        filename: "rappel_sejour.ics",
        content: icsFile,
        contentType: "text/calendar"
      }
    ]
  });
}
