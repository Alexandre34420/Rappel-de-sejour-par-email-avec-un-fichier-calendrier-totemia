import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  stayName: yup.string().required("Ce champ est obligatoire"),
  stayDate: yup.string().required("Ce champ est obligatoire"),
  childName: yup.string().required("Ce champ est obligatoire")
}).required();

export default function FormStay() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    setMessage("");
    setLoading(true);
    try {
      await axios.post(`${apiUrl}/send`, data, { timeout: 15000 });
      setMessage("Email envoyé avec succès");
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
        <label>
          <span className="label-text">Nom du séjour</span>
          <input type="text" {...register("stayName")} />
          <div className="error">{errors.stayName?.message}</div>
        </label>

        <label>
          <span className="label-text">Date du séjour</span>
          <input type="date" {...register("stayDate")} />
          <div className="error">{errors.stayDate?.message}</div>
        </label>

        <label>
          <span className="label-text">Nom de l'enfant</span>
          <input type="text" {...register("childName")} />
          <div className="error">{errors.childName?.message}</div>
        </label>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Envoi..." : "Envoyer"}
        </button>
      </form>

      {message && <div className={`message ${message.includes("Erreur") ? "error-box" : "success-box"}`}>{message}</div>}
    </div>
  );
}
