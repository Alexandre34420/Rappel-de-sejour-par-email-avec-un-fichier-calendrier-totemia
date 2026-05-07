import { useState } from "react";

function DownloadICSButton({ stayData }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    const response = await fetch("http://localhost:5000/api/download-ics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stayData),
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${stayData.stayName}.ics`;
    a.click();
    window.URL.revokeObjectURL(url);
    setLoading(false);
  };

  return (
    <button onClick={handleDownload}>
      {loading ? "⏳ Téléchargement..." : "📅 Télécharger le calendrier (.ics)"}
    </button>
  );
}

export default DownloadICSButton;
