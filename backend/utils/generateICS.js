import { createEvent } from "ics";

export default function generateICS({ stayName, stayDate, departureDate, childName, stayAddress }) {
  return new Promise((resolve, reject) => {
    // stayDate = "2025-07-12"
    const [year, month, day] = stayDate.split("-").map(Number);

    const event = {
      title: `Séjour : ${stayName}`,
      description: `Séjour de ${childName}\nAdresse : ${stayAddress}\nDépart : ${departureDate}`,
      location: stayAddress,

      // Date de début (09:00 par défaut)
      start: [year, month, day, 9, 0],

      // Durée de l'événement (1h)
      duration: { hours: 1 }
    };

    createEvent(event, (error, value) => {
      if (error) {
        console.error("Erreur ICS :", error);
        return reject(error);
      }
      resolve(value);
    });
  });
}
