import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    stayName: yup.string().required("Ce champ est obligatoire"),
    stayDate: yup.string().required("Ce champ est obligatoire"),
    departureDate: yup.string().required("Ce champ est obligatoire"),
    childName: yup.string().required("Ce champ est obligatoire"),
    email: yup.string().email("Email invalide").required("Ce champ est obligatoire"),
    stayAddress: yup.string().required("Ce champ est obligatoire")
  })
  .required();

export default function FormStay() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    setMessage("");
    setLoading(true);

    try {
      await axios.post(`${apiUrl}/send-email`, data, { timeout: 15000 });
      setMessage("Email envoyé avec succès !");
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de l'envoi. Vérifie le backend et les variables d'environnement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Rappel de séjour</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="form">

        {/* Nom du séjour */}
        <label>
          <span className="label-text">Nom du séjour</span>
          <input type="text" {...register("stayName")} />
          <div className="error">{errors.stayName?.message}</div>
        </label>

        {/* Date du séjour */}
        <label>
          <span className="label-text">Date du séjour</span>
          <input type="date" {...register("stayDate")} />
          <div className="error">{errors.stayDate?.message}</div>
        </label>

        {/* Date de départ */}
        <label>
          <span className="label-text">Date de départ</span>
          <input type="date" {...register("departureDate")} />
          <div className="error">{errors.departureDate?.message}</div>
        </label>

        {/* Nom de l'enfant */}
        <label>
          <span className="label-text">Nom de l'enfant</span>
          <input type="text" {...register("childName")} />
          <div className="error">{errors.childName?.message}</div>
        </label>

        {/* Adresse email */}
        <label>
          <span className="label-text">Adresse email</span>
          <input type="email" {...register("email")} />
          <div className="error">{errors.email?.message}</div>
        </label>

        {/* Adresse du séjour */}
        <label>
          <span className="label-text">Adresse du séjour</span>
          <input type="text" {...register("stayAddress")} />
          <div className="error">{errors.stayAddress?.message}</div>
        </label>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Envoi..." : "Envoyer"}
        </button>
      </form>

      {message && (
        <div className={`message ${message.includes("Erreur") ? "error-box" : "success-box"}`}>
          {message}
        </div>
      )}
    </div>
  );
}
