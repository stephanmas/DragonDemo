import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CATEGORIES, CATEGORY_BY_ID, type CategoryId } from "../nearby/categories";
import { DEMO_CENTER } from "../nearby/demoPlaces";
import {
  directionsUrl,
  fetchPlaces,
  formatDistance,
  geocode,
  getDemoPlaces,
  reverseGeocode,
  type LatLon,
  type Place,
} from "../nearby/places";
import { PlaceMap } from "../components/PlaceMap";

type Origin = LatLon & { label: string; demo?: boolean };
type Status = "locating" | "needs-location" | "loading" | "ready" | "error";

const RADII = [
  { m: 800, label: "10 min" },
  { m: 1600, label: "20 min" },
  { m: 4000, label: "Further" },
];

const card = {
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
} as const;

export function NearbyScreen() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("locating");
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [category, setCategory] = useState<CategoryId>("work");
  const [radius, setRadius] = useState(RADII[1].m);
  const [places, setPlaces] = useState<Place[]>([]);
  const [pickId, setPickId] = useState<string>();
  const [error, setError] = useState<string>();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const showDemo = useCallback(() => {
    setOrigin({ ...DEMO_CENTER, demo: true });
    setSearchOpen(false);
  }, []);

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setStatus("needs-location");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const here = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setOrigin({ ...here, label: "Your location" });
        const name = await reverseGeocode(here);
        if (name) setOrigin((o) => (o && o.lat === here.lat ? { ...o, label: name } : o));
      },
      () => setStatus("needs-location"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
    );
  }, []);

  useEffect(() => {
    locate();
  }, [locate]);

  useEffect(() => {
    if (!origin) return;
    const ctrl = new AbortController();
    setStatus("loading");
    setError(undefined);
    const load = origin.demo
      ? Promise.resolve(getDemoPlaces(origin, category, radius))
      : fetchPlaces(origin, category, radius, ctrl.signal);
    load
      .then((list) => {
        setPlaces(list);
        setPickId(list[0]?.id);
        setStatus("ready");
      })
      .catch((e: unknown) => {
        if (ctrl.signal.aborted) return;
        setError(e instanceof Error ? e.message : "Something went wrong");
        setStatus("error");
      });
    return () => ctrl.abort();
  }, [origin, category, radius]);

  const pick = useMemo(() => places.find((p) => p.id === pickId), [places, pickId]);

  const surprise = () => {
    const pool = places.slice(0, Math.min(6, places.length)).filter((p) => p.id !== pickId);
    if (pool.length) setPickId(pool[Math.floor(Math.random() * pool.length)].id);
  };

  const onSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const hit = await geocode(query.trim());
      if (hit) {
        setOrigin(hit);
        setSearchOpen(false);
        setQuery("");
      } else {
        setError(`Couldn't find “${query}”`);
      }
    } catch {
      setError("Location search is unavailable right now");
    } finally {
      setSearching(false);
    }
  };

  const cat = CATEGORY_BY_ID[category];

  return (
    <div className="app-container nearby-screen" style={{ height: "100%", minHeight: 0, display: "flex", flexDirection: "column", background: "#f4f4f2", overflow: "hidden" }}>
      {/* Header */}
      <header style={{ padding: "12px 16px 8px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <motion.button whileTap={{ scale: 0.94 }} onClick={() => navigate(-1)} aria-label="Back" className="icon-btn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </motion.button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em" }}>Discover nearby</h1>
            <button className="location-pill" onClick={() => setSearchOpen((s) => !s)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {origin ? origin.label : status === "locating" ? "Finding you…" : "Set a location"}
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {(searchOpen || status === "needs-location") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden" }}
            >
              <div style={{ ...card, padding: 12, marginTop: 10 }}>
                {status === "needs-location" && !origin && (
                  <p style={{ margin: "0 0 10px", fontSize: 14, color: "var(--color-text-secondary)" }}>
                    We couldn't get your location. Search for a place, or try the demo.
                  </p>
                )}
                <form onSubmit={onSearch} style={{ display: "flex", gap: 8 }}>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="City, neighbourhood or address"
                    className="search-input"
                    aria-label="Search location"
                  />
                  <button type="submit" className="primary-btn" disabled={searching}>
                    {searching ? "…" : "Go"}
                  </button>
                </form>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button className="ghost-btn" onClick={() => { setSearchOpen(false); locate(); }}>📍 Use my location</button>
                  <button className="ghost-btn" onClick={showDemo}>✨ Demo: Rio</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Categories */}
      <div className="chip-row" role="tablist" aria-label="Categories">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={c.id === category}
            className={`chip${c.id === category ? " is-active" : ""}`}
            onClick={() => setCategory(c.id)}
          >
            <span aria-hidden>{c.emoji}</span> {c.label}
          </button>
        ))}
      </div>

      <main style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "4px 16px 40px" }}>
        {origin?.demo && (
          <div className="banner">Showing invented sample places for a demo location.</div>
        )}

        {/* Map */}
        {origin && (
          <div style={{ ...card, height: 210, overflow: "hidden", position: "relative", marginBottom: 14 }}>
            <PlaceMap center={origin} places={places} selectedId={pickId} onSelect={setPickId} />
            <div className="radius-toggle" role="radiogroup" aria-label="Walking distance">
              {RADII.map((r) => (
                <button key={r.m} role="radio" aria-checked={radius === r.m} className={radius === r.m ? "is-active" : ""} onClick={() => setRadius(r.m)}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {(status === "locating" || status === "loading") && <SkeletonList />}

        {status === "error" && (
          <div style={{ ...card, padding: 20, textAlign: "center" }}>
            <p style={{ margin: "0 0 4px", fontWeight: 600 }}>Couldn't load places</p>
            <p style={{ margin: "0 0 14px", fontSize: 14, color: "var(--color-text-secondary)" }}>{error}</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <button className="primary-btn" onClick={() => origin && setOrigin({ ...origin })}>Try again</button>
              <button className="ghost-btn" onClick={showDemo}>Show demo</button>
            </div>
          </div>
        )}

        {status === "ready" && places.length === 0 && (
          <div style={{ ...card, padding: 20, textAlign: "center" }}>
            <p style={{ margin: "0 0 4px", fontWeight: 600 }}>No {cat.label.toLowerCase()} found nearby</p>
            <p style={{ margin: "0 0 14px", fontSize: 14, color: "var(--color-text-secondary)" }}>Try a wider radius or another category.</p>
            {radius < RADII[RADII.length - 1].m && (
              <button className="primary-btn" onClick={() => setRadius(RADII[RADII.length - 1].m)}>Search further</button>
            )}
          </div>
        )}

        {status === "ready" && pick && (
          <>
            {/* Top pick */}
            <AnimatePresence mode="wait">
              <motion.section
                key={pick.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="hero-pick"
              >
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.8 }}>
                  {cat.emoji} Our pick · {cat.tagline}
                </div>
                <h2 style={{ margin: "6px 0 2px", fontSize: 24, lineHeight: 1.2 }}>{pick.name}</h2>
                <div style={{ fontSize: 14, opacity: 0.85 }}>
                  {pick.kind}
                  {pick.address ? ` · ${pick.address}` : ""}
                </div>
                <Reasons reasons={pick.reasons} light />
                {pick.openingHours && <div style={{ fontSize: 13, opacity: 0.8, marginTop: 8 }}>🕒 {pick.openingHours}</div>}
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <a className="hero-btn primary" href={directionsUrl(pick)} target="_blank" rel="noreferrer">Take me there</a>
                  <button className="hero-btn" onClick={surprise} disabled={places.length < 2}>🎲 Another</button>
                </div>
              </motion.section>
            </AnimatePresence>

            {/* List */}
            <h3 style={{ margin: "20px 4px 10px", fontSize: 15, fontWeight: 600, color: "var(--color-text-secondary)" }}>
              {places.length} {cat.label.toLowerCase()} within {formatDistance(radius)}
            </h3>
            <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {places.slice(0, 15).map((p, i) => (
                <li key={p.id}>
                  <button
                    onClick={() => setPickId(p.id)}
                    className={`place-row${p.id === pickId ? " is-selected" : ""}`}
                  >
                    <span className="rank">{i + 1}</span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span className="place-name">{p.name}</span>
                      <span className="place-meta">{p.kind}</span>
                      <Reasons reasons={p.reasons.slice(0, 3)} />
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <p style={{ fontSize: 12, color: "var(--color-text-muted)", textAlign: "center", marginTop: 20 }}>
              {origin?.demo ? "Sample data" : "Place data © OpenStreetMap contributors"}
            </p>
          </>
        )}
      </main>
    </div>
  );
}

function Reasons({ reasons, light }: { reasons: string[]; light?: boolean }) {
  return (
    <span style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
      {reasons.map((r) => (
        <span key={r} className={`reason${light ? " light" : ""}`}>{r}</span>
      ))}
    </span>
  );
}

function SkeletonList() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }} aria-busy="true" aria-label="Loading places">
      <div className="skeleton" style={{ height: 170, borderRadius: 20 }} />
      {[0, 1, 2].map((i) => (
        <div key={i} className="skeleton" style={{ height: 72, borderRadius: 14 }} />
      ))}
    </div>
  );
}
