import { createEvent } from "ics";

export default function generateICS({ stayName, stayDate, departureDate, childName, stayAddress }) {
  return new Promise((resolve, reject) => {
    const event = {
      title: `Séjour : ${stayName}`,
      description: `Séjour de ${childName} à ${stayAddress}`,
      start: stayDate.split("-").map(Number), // format YYYY-MM-DD
      end: departureDate.split("-").map(Number),
      location: stayAddress,
    };

    createEvent(event, (error, value) => {
      if (error) {
        reject(error);
      } else {
        resolve(value);
      }
    });
  });
}
