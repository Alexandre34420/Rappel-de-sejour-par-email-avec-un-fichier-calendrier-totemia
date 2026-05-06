import { createEvent } from "ics";

export default function generateICS({ stayName, stayDate, departureDate, childName, stayAddress }) {
  return new Promise((resolve, reject) => {
    const [year, month, day] = stayDate.split("-").map(Number);

    const event = {
      title: `Séjour : ${stayName}`,
      description: `Séjour de ${childName}\nAdresse : ${stayAddress}\nDépart : ${departureDate}`,
      location: stayAddress,
      start: [year, month, day],
      duration: { hours: 1 }
    };

    createEvent(event, (error, value) => {
      if (error) return reject(error);
      resolve(value);
    });
  });
}
