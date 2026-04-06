// Location and service data constants

export const ALL_LOCATIONS = [
  "Dubrovnik",
  "Ada Bojana",
  "Andrijevica",
  "Baosici",
  "Bar",
  "Bar Port",
  "Bar Train Station",
  "Berane",
  "Bigova",
  "Bijela",
  "Bjelila",
  "Brajici",
  "Budva",
  "Buljarica",
  "Canj",
  "Cavtat",
  "Danilovgrad",
  "Dinosa",
  "Dobra Voda",
  "Dobrota",
  "Donja Brezna",
  "Donja Lastva",
  "Dubrava, Bar",
  "Dubrovnik airport",
  "Durasevici",
  "Gornja Lastva",
  "Grebaja",
  "Herceg Novi",
  "Igalo",
  "Ivanova korita",
  "Kamenari",
  "Kamenovo",
  "Karuc",
  "Kolasin",
  "Kostanjica",
  "Kotor - Dobrota",
  "Kotor",
  "Krasici",
  "Krimovica",
  "Kuljace",
  "Lapcici - Budva",
  "Lastva Grbaljska",
  "Lepetane",
  "Ljuta",
  "Lustica Bay",
  "Marina Solila",
  "Markovici - Budva",
  "Matasevo",
  "Mirista",
  "Mojkovac",
  "Moraca Monastery",
  "Mostar",
  "Opasanica",
  "Orahovac",
  "Ostrog Monastery",
  "Perast",
  "Petrovac",
  "Plav",
  "Pljevlja",
  "Podgorica",
  "Podgorica Airport",
  "Podgorica Bus Station",
  "Podgorica Train Station",
  "Prcanj",
  "Pristina",
  "Radanovici",
  "Radovici",
  "Rafailovici",
  "Ribarsko selo",
  "Rijeka Crnojevica",
  "Rijeka Rezevici",
  "Risan",
  "Rozaje",
  "Rvaši",
  "Sarajevo",
  "Sarajevo Airport",
  "Savnik",
  "Scepan Polje",
  "Smokovac",
  "Stanisici - Budva",
  "Stavna",
  "Susanj",
  "Sveti Stefan",
  "Theth - Albania",
  "Tirana airport - Albania",
  "Tirana - Albania",
  "Tivat",
  "Tivat Airport",
  "Utjeha",
  "Verusa",
  "Virpazar",
  "Zabljak",
  "Zelenika - Herceg Novi",
  "Pluzine",
] as const;

export const SERVICE_LOCATIONS = [
  "Ada Bojana",
  "Virpazar",
  "Tivat Airport",
  "Verusa",
  "Petrovac",
  "Pluzine",
  "Sveti Stefan",
  "Rijeka Crnojevica",
  "Podgorica",
  "Podgorica Airport",
  "Podgorica Bus Station",
  "Podgorica Train Station",
  "Ostrog Monastery",
  "Danilovgrad",
  "Bar",
  "Bar Port",
  "Bar Train Station",
] as const;

export const DAY_TRIPS = [
  { id: "day-trip-1", name: "Day Trip 1", description: "Placeholder for future trip" },
  { id: "day-trip-2", name: "Day Trip 2", description: "Placeholder for future trip" },
  { id: "day-trip-3", name: "Day Trip 3", description: "Placeholder for future trip" },
  { id: "day-trip-4", name: "Day Trip 4", description: "Placeholder for future trip" },
  { id: "day-trip-5", name: "Day Trip 5", description: "Placeholder for future trip" },
] as const;

// Check if a route is a standard transfer (all service locations to/from Podgorica)
export function isStandardTransferRoute(start: string, end: string): boolean {
  const podgoricaLocations = [
    "Podgorica",
    "Podgorica Airport",
    "Podgorica Bus Station",
    "Podgorica Train Station",
  ];
  
  const isPodgoricaStart = podgoricaLocations.includes(start);
  const isPodgoricaEnd = podgoricaLocations.includes(end);
  const isServiceLocation = (loc: string) => SERVICE_LOCATIONS.includes(loc as (typeof SERVICE_LOCATIONS)[number]);
  
  return (isPodgoricaStart && isServiceLocation(end)) || (isPodgoricaEnd && isServiceLocation(start));
}

// Get minimum passengers based on season
export function getMinimumPassengers(date: string): number {
  const dateObj = new Date(date);
  const month = dateObj.getMonth() + 1; // 0-indexed, so add 1
  
  // April (4) to October (10) = 4 passengers minimum
  // November (11) to March (3) = 2 passengers minimum
  if (month >= 4 && month <= 10) {
    return 4;
  }
  return 2;
}
