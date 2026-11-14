import { CATEGORY_BY_ID, type CategoryId } from "./categories";
import { demoPlaces } from "./demoPlaces";

export interface LatLon {
  lat: number;
  lon: number;
}

export interface Place extends LatLon {
  id: string;
  name: string;
  kind: string;
  distance: number; // metres
  score: number;
  reasons: string[];
  address?: string;
  openingHours?: string;
  website?: string;
}

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const NOMINATIM_URL = "https://nominatim.openstreetmap.org";

export function haversine(a: LatLon, b: LatLon): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatDistance(m: number): string {
  const walkMin = Math.max(1, Math.round(m / 80));
  if (walkMin <= 25) return `${walkMin} min walk`;
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}

export function directionsUrl(p: LatLon): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}&travelmode=walking`;
}

type Tags = Record<string, string | undefined>;

function prettyKind(tags: Tags): string {
  const raw = tags.amenity ?? tags.tourism ?? tags.leisure ?? tags.office ?? tags.shop ?? "place";
  const map: Record<string, string> = {
    cafe: "Café",
    bar: "Bar",
    pub: "Pub",
    restaurant: "Restaurant",
    coworking_space: "Coworking",
    coworking: "Coworking",
    library: "Library",
    park: "Park",
    garden: "Garden",
    viewpoint: "Viewpoint",
    museum: "Museum",
    gallery: "Gallery",
    attraction: "Attraction",
    artwork: "Public art",
  };
  let label = map[raw] ?? raw.replace(/_/g, " ");
  const cuisine = tags.cuisine?.split(";")[0]?.replace(/_/g, " ");
  if (cuisine && (raw === "restaurant" || raw === "cafe")) {
    label = `${cuisine.charAt(0).toUpperCase()}${cuisine.slice(1)} · ${label}`;
  }
  return label;
}

/** Turns raw OSM tags into a score plus human-readable reasons for the recommendation. */
export function scorePlace(category: CategoryId, tags: Tags, distance: number, radius: number): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  // Closer is better: 0..50 points
  let score = 50 * Math.max(0, 1 - distance / radius);

  const wifi = /wlan|yes|wifi/.test(tags.internet_access ?? "");
  if (wifi) {
    score += category === "work" ? 30 : 5;
    reasons.push(tags.internet_access_fee === "no" ? "Free Wi-Fi" : "Wi-Fi");
  }
  if (category === "work") {
    if (tags.amenity === "coworking_space" || tags.office === "coworking") {
      score += 25;
      reasons.push("Coworking");
    }
    if (tags.amenity === "library") {
      score += 10;
      reasons.push("Quiet");
    }
    if (tags["socket"] || tags["power_supply"] === "yes") {
      score += 10;
      reasons.push("Power outlets");
    }
  }
  if (category === "wine" && /wine|vin|vino|vinho|enoteca|cave|bodega/i.test(tags.name ?? "")) {
    score += 15;
    reasons.push("Wine-focused");
  }
  if (tags.outdoor_seating === "yes") {
    score += 8;
    reasons.push("Outdoor seating");
  }
  if (tags.opening_hours) score += 6;
  if (tags.website || tags["contact:website"]) score += 6;
  if (tags.cuisine) score += 3;
  if (tags.wheelchair === "yes") {
    score += 3;
    reasons.push("Step-free");
  }
  if (tags.wikipedia || tags.wikidata) {
    score += 12;
    reasons.push("Notable");
  }
  reasons.unshift(formatDistance(distance));
  return { score: Math.round(score), reasons };
}

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: LatLon;
  tags?: Tags;
}

export async function fetchPlaces(center: LatLon, category: CategoryId, radius: number, signal?: AbortSignal): Promise<Place[]> {
  const around = `(around:${radius},${center.lat},${center.lon})`;
  const body = `[out:json][timeout:25];(${CATEGORY_BY_ID[category].selectors.map((s) => `${s}${around};`).join("")});out center tags 80;`;
  const res = await fetch(OVERPASS_URL, {
    method: "POST",
    body: new URLSearchParams({ data: body }),
    signal,
  });
  if (!res.ok) throw new Error(`OpenStreetMap returned ${res.status}`);
  const json = (await res.json()) as { elements: OverpassElement[] };

  const seen = new Set<string>();
  const places: Place[] = [];
  for (const el of json.elements) {
    const tags = el.tags ?? {};
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (!tags.name || lat == null || lon == null) continue;
    const dedupeKey = `${tags.name.toLowerCase()}|${lat.toFixed(3)}|${lon.toFixed(3)}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    const distance = haversine(center, { lat, lon });
    const { score, reasons } = scorePlace(category, tags, distance, radius);
    const street = [tags["addr:street"], tags["addr:housenumber"]].filter(Boolean).join(" ");
    places.push({
      id: `${el.type}/${el.id}`,
      name: tags.name,
      kind: prettyKind(tags),
      lat,
      lon,
      distance,
      score,
      reasons,
      address: street || undefined,
      openingHours: tags.opening_hours,
      website: tags.website ?? tags["contact:website"],
    });
  }
  return places.sort((a, b) => b.score - a.score);
}

export function getDemoPlaces(center: LatLon, category: CategoryId, radius: number): Place[] {
  return demoPlaces
    .filter((p) => p.category === category)
    .map((p, i) => {
      const distance = haversine(center, p);
      const { score, reasons } = scorePlace(category, p.tags, distance, radius);
      return {
        id: `demo/${category}/${i}`,
        name: p.tags.name!,
        kind: prettyKind(p.tags),
        lat: p.lat,
        lon: p.lon,
        distance,
        score,
        reasons,
        address: p.tags["addr:street"],
        openingHours: p.tags.opening_hours,
      };
    })
    .filter((p) => p.distance <= radius * 1.5)
    .sort((a, b) => b.score - a.score);
}

export async function geocode(query: string): Promise<(LatLon & { label: string }) | null> {
  const res = await fetch(`${NOMINATIM_URL}/search?format=json&limit=1&q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Search failed");
  const [hit] = (await res.json()) as { lat: string; lon: string; display_name: string }[];
  if (!hit) return null;
  return { lat: Number(hit.lat), lon: Number(hit.lon), label: hit.display_name.split(",").slice(0, 2).join(",") };
}

export async function reverseGeocode(p: LatLon): Promise<string | null> {
  try {
    const res = await fetch(`${NOMINATIM_URL}/reverse?format=json&zoom=14&lat=${p.lat}&lon=${p.lon}`);
    if (!res.ok) return null;
    const json = (await res.json()) as { address?: Record<string, string> };
    const a = json.address ?? {};
    return a.suburb ?? a.neighbourhood ?? a.city_district ?? a.city ?? a.town ?? a.village ?? null;
  } catch {
    return null;
  }
}
