import type { CategoryId } from "./categories";

/**
 * Invented sample places around Ipanema, Rio de Janeiro. Used only when the
 * user explicitly picks the demo location (or OpenStreetMap can't be reached).
 */
export const DEMO_CENTER = { lat: -22.9845, lon: -43.2045, label: "Ipanema, Rio (demo)" };

type DemoPlace = { category: CategoryId; lat: number; lon: number; tags: Record<string, string> };

export const demoPlaces: DemoPlace[] = [
  // Work spots
  { category: "work", lat: -22.9838, lon: -43.2021, tags: { name: "Laptop & Lime", amenity: "cafe", internet_access: "wlan", internet_access_fee: "no", socket: "yes", opening_hours: "Mo-Fr 07:30-19:00", "addr:street": "Rua Visconde de Pirajá" } },
  { category: "work", lat: -22.9861, lon: -43.2079, tags: { name: "Maré Cowork", amenity: "coworking_space", internet_access: "wlan", opening_hours: "Mo-Fr 08:00-20:00", website: "#" } },
  { category: "work", lat: -22.9822, lon: -43.2003, tags: { name: "Biblioteca do Bairro", amenity: "library", internet_access: "wlan", wheelchair: "yes" } },
  { category: "work", lat: -22.9871, lon: -43.1985, tags: { name: "Café Onda", amenity: "cafe", internet_access: "wlan", outdoor_seating: "yes" } },
  // Wine bars
  { category: "wine", lat: -22.9852, lon: -43.2061, tags: { name: "Vinho & Sal", amenity: "bar", outdoor_seating: "yes", opening_hours: "Tu-Su 17:00-01:00", website: "#" } },
  { category: "wine", lat: -22.9829, lon: -43.2098, tags: { name: "Enoteca Lagoa", amenity: "restaurant", cuisine: "italian", opening_hours: "Mo-Su 18:00-00:00" } },
  { category: "wine", lat: -22.9879, lon: -43.2032, tags: { name: "A Cave Pequena", amenity: "bar", wheelchair: "yes" } },
  // Coffee
  { category: "coffee", lat: -22.9841, lon: -43.2052, tags: { name: "Grão Torrado", amenity: "cafe", outdoor_seating: "yes", opening_hours: "07:00-18:00" } },
  { category: "coffee", lat: -22.9858, lon: -43.2012, tags: { name: "Café da Esquina", amenity: "cafe", internet_access: "wlan" } },
  { category: "coffee", lat: -22.9819, lon: -43.2071, tags: { name: "Leite de Coco", amenity: "cafe", cuisine: "brunch" } },
  // Bars
  { category: "cocktails", lat: -22.9866, lon: -43.2049, tags: { name: "Sunset Bar Arpoador", amenity: "bar", outdoor_seating: "yes", opening_hours: "16:00-02:00" } },
  { category: "cocktails", lat: -22.9833, lon: -43.2027, tags: { name: "Boteco Azul", amenity: "pub", outdoor_seating: "yes" } },
  { category: "cocktails", lat: -22.9848, lon: -43.2112, tags: { name: "Caipi Club", amenity: "bar", website: "#" } },
  // Restaurants
  { category: "food", lat: -22.9844, lon: -43.2083, tags: { name: "Peixe na Brasa", amenity: "restaurant", cuisine: "seafood", outdoor_seating: "yes", opening_hours: "12:00-23:00" } },
  { category: "food", lat: -22.9826, lon: -43.2039, tags: { name: "Feijão Moderno", amenity: "restaurant", cuisine: "brazilian", website: "#" } },
  { category: "food", lat: -22.9869, lon: -43.2003, tags: { name: "Tigela Verde", amenity: "restaurant", cuisine: "vegetarian", wheelchair: "yes" } },
  // Outdoors
  { category: "outdoors", lat: -22.9889, lon: -43.1925, tags: { name: "Pedra do Arpoador", tourism: "viewpoint", wikidata: "Q0" } },
  { category: "outdoors", lat: -22.9812, lon: -43.2068, tags: { name: "Praça Nossa Senhora", leisure: "park" } },
  { category: "outdoors", lat: -22.9768, lon: -43.2105, tags: { name: "Lagoa Shore Path", leisure: "park" } },
  // Culture
  { category: "culture", lat: -22.9836, lon: -43.1992, tags: { name: "Galeria Atlântica", tourism: "gallery", opening_hours: "Tu-Su 10:00-18:00" } },
  { category: "culture", lat: -22.9808, lon: -43.2041, tags: { name: "Museu da Bossa", tourism: "museum", wikidata: "Q0", wheelchair: "yes" } },
  { category: "culture", lat: -22.9874, lon: -43.2088, tags: { name: "Mural do Mar", tourism: "artwork" } },
];
