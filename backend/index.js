import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import generateICS from "./utils/generateICS.js";
import sendMail from "./mailer.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Route test GET /
app.get("/", (req, res) => {
  res.send("✅ Backend API is running");
});

// ✅ Route pour envoyer un email avec ICS
app.post("/api/send", async (req, res) => {
  try {
    console.log("📩 Données reçues du frontend :", req.body);

    const {
      stayName,
      stayDate,
      departureDate,
      childName,
      email,
      stayAddress
    } = req.body;

    if (!stayName || !stayDate || !departureDate || !childName || !email || !stayAddress) {
      return res.status(400).json({ success: false, error: "Champs manquants" });
    }

    const icsFile = await generateICS({
      stayName,
      stayDate,
      departureDate,
      childName,
      stayAddress
    });

    await sendMail({
      to: email,
      subject: `Rappel de séjour : ${stayName}`,
      text: `Bonjour,\n\nVoici le rappel du séjour de ${childName}.\n\nAdresse : ${stayAddress}\nDépart : ${departureDate}`,
      icsFile
    });

    res.json({ success: true, message: "Email envoyé avec succès !" });
  } catch (error) {
    console.error("❌ Erreur backend :", error);
    res.status(500).json({ success: false, error: "Erreur interne du serveur" });
  }
});

// ✅ Route pour télécharger le fichier ICS
app.post("/api/download-ics", async (req, res) => {
  try {
    const { stayName, stayDate, departureDate, childName, stayAddress } = req.body;

    const icsFile = await generateICS({
      stayName,
      stayDate,
      departureDate,
      childName,
      stayAddress
    });

    res.setHeader("Content-Disposition", `attachment; filename=${stayName}.ics`);
    res.setHeader("Content-Type", "text/calendar");
    res.send(icsFile);
  } catch (error) {
    console.error("❌ Erreur ICS :", error);
    res.status(500).send("Erreur lors de la génération du fichier ICS");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
