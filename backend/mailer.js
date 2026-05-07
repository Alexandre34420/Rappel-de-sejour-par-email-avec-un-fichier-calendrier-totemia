import nodemailer from "nodemailer";

export default async function sendMail({ to, subject, text, icsFile }) {
  // ✅ Création du transporteur SMTP vers MailHog
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "mailhog", // MailHog est défini dans docker-compose
    port: process.env.EMAIL_PORT || 1025,      // Port SMTP de MailHog
    secure: false,                             // Pas de TLS pour MailHog
  });

  // ✅ Envoi de l'email
  await transporter.sendMail({
    from: "test@example.com", // adresse fictive, MailHog accepte tout
    to,
    subject,
    text,
    attachments: [
      {
        filename: "rappel_sejour.ics",
        content: icsFile,
        contentType: "text/calendar",
      },
    ],
  });
}

