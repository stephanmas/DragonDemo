import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLon, Place } from "../nearby/places";

interface PlaceMapProps {
  center: LatLon;
  places: Place[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

const markerIcon = (selected: boolean, rank: number) =>
  L.divIcon({
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    html: `<div class="place-pin${selected ? " is-selected" : ""}"><span>${rank}</span></div>`,
  });

export function PlaceMap({ center, places, selectedId, onSelect }: PlaceMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const lastSelectedRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = L.map(containerRef.current, { zoomControl: false, attributionControl: true });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; CARTO',
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    L.circleMarker([center.lat, center.lon], {
      radius: 8,
      color: "#fff",
      weight: 3,
      fillColor: "#3b82f6",
      fillOpacity: 1,
    }).addTo(layer);
    const shown = places.slice(0, 15);
    shown.forEach((p, i) => {
      L.marker([p.lat, p.lon], { icon: markerIcon(p.id === selectedId, i + 1), zIndexOffset: p.id === selectedId ? 1000 : 0 })
        .on("click", () => onSelect(p.id))
        .addTo(layer);
    });
    const bounds = L.latLngBounds([[center.lat, center.lon], ...shown.map((p) => [p.lat, p.lon] as [number, number])]);
    map.fitBounds(bounds, { paddingTopLeft: [28, 52], paddingBottomRight: [28, 28], maxZoom: 16, animate: false });
    // places/center drive the fit; selection changes are handled below without refitting
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center, places, onSelect]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    let i = 0;
    layer.eachLayer((l) => {
      if (l instanceof L.Marker) {
        const p = places[i++];
        if (p) {
          l.setIcon(markerIcon(p.id === selectedId, i));
          l.setZIndexOffset(p.id === selectedId ? 1000 : 0);
        }
      }
    });
    // Only pan when the user picks a different place, not when a new result set was just fitted.
    if (lastSelectedRef.current === selectedId) return;
    const firstSelection = lastSelectedRef.current === undefined;
    lastSelectedRef.current = selectedId;
    if (firstSelection) return;
    const sel = places.find((p) => p.id === selectedId);
    const map = mapRef.current;
    if (sel && map && !map.getBounds().pad(-0.1).contains([sel.lat, sel.lon])) {
      map.panTo([sel.lat, sel.lon], { animate: true });
    }
  }, [selectedId, places]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%", background: "#e8eef3" }} />;
}
