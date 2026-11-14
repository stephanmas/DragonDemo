export type CategoryId = "work" | "wine" | "coffee" | "cocktails" | "food" | "outdoors" | "culture";

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
  tagline: string;
  /** Overpass QL selectors (without the `(around:...)` filter). */
  selectors: string[];
}

export const CATEGORIES: Category[] = [
  {
    id: "work",
    label: "Work spots",
    emoji: "💻",
    tagline: "Wi-Fi, a table and good coffee",
    selectors: [
      'nwr["amenity"="cafe"]["internet_access"~"wlan|yes|wifi|terminal"]',
      'nwr["amenity"="coworking_space"]',
      'nwr["office"="coworking"]',
      'nwr["amenity"="library"]',
    ],
  },
  {
    id: "wine",
    label: "Wine bars",
    emoji: "🍷",
    tagline: "A good glass, close by",
    selectors: [
      'nwr["amenity"~"^(bar|pub|restaurant|cafe)$"]["name"~"wine|vin|vino|vinho|enoteca|cave|bodega|winery",i]',
      'nwr["amenity"~"^(bar|pub|restaurant)$"]["drink:wine"~"yes|served"]',
      'nwr["amenity"="bar"]["cuisine"~"wine",i]',
    ],
  },
  {
    id: "coffee",
    label: "Coffee",
    emoji: "☕",
    tagline: "Your next flat white",
    selectors: ['nwr["amenity"="cafe"]'],
  },
  {
    id: "cocktails",
    label: "Bars",
    emoji: "🍸",
    tagline: "Drinks after dark",
    selectors: ['nwr["amenity"~"^(bar|pub)$"]'],
  },
  {
    id: "food",
    label: "Restaurants",
    emoji: "🍽️",
    tagline: "Somewhere good to eat",
    selectors: ['nwr["amenity"="restaurant"]'],
  },
  {
    id: "outdoors",
    label: "Outdoors",
    emoji: "🌳",
    tagline: "Parks, gardens and views",
    selectors: [
      'nwr["leisure"~"^(park|garden)$"]["name"]',
      'nwr["tourism"="viewpoint"]',
    ],
  },
  {
    id: "culture",
    label: "Culture",
    emoji: "🏛️",
    tagline: "Museums, galleries and sights",
    selectors: ['nwr["tourism"~"^(museum|gallery|attraction|artwork)$"]["name"]'],
  },
];

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<CategoryId, Category>;
