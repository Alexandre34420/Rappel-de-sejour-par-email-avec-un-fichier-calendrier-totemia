import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import generateICS from "./utils/generateICS.js";
import sendMail from "./mailer.js";

dotenv.config();

const app = express();

// Autoriser le frontend à communiquer
app.use(cors());

// Lire le JSON envoyé par React
app.use(express.json());

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

    // Vérification des champs
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

    res.json({
      success: true,
      message: "Email envoyé avec succès !"
    });

  } catch (error) {
    console.error("❌ Erreur backend :", error);
    res.status(500).json({
      success: false,
      error: "Erreur interne du serveur"
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Backend running on port ${process.env.PORT}`);
});

