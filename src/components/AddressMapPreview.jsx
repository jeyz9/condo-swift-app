import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../utils/leafletIconFix";

const FALLBACK_CENTER = { lat: 13.7563, lng: 100.5018 };

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position ? <Marker position={position} /> : null;
}

function RecenterMap({ position }) {
  const map = useMap();

  React.useEffect(() => {
    if (position && position.lat !== undefined && position.lng !== undefined) {
      map.setView([position.lat, position.lng], map.getZoom(), {
        animate: true,
      });
    }
  }, [map, position]);

  return null;
}

export default function AddressMapPreview({
  initialCenter,
  onGeocode,
  query,
}) {
  const [position, setPosition] = React.useState(
    initialCenter?.lat && initialCenter?.lng
      ? { lat: initialCenter.lat, lng: initialCenter.lng }
      : FALLBACK_CENTER
  );

  const [error, setError] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);

  React.useEffect(() => {
    const hasLat = initialCenter?.lat !== undefined && initialCenter?.lat !== null;
    const hasLng = initialCenter?.lng !== undefined && initialCenter?.lng !== null;
    if (hasLat && hasLng) {
      const lat = parseFloat(initialCenter.lat);
      const lng = parseFloat(initialCenter.lng);
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        setPosition({ lat, lng });
      }
    }
  }, [initialCenter]);

  React.useEffect(() => {
    if (!query || !query.trim()) {
      setError("");
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setError("");
      setIsSearching(true);

      async function searchNominatim() {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&countrycodes=th&accept-language=th&q=${encodeURIComponent(
          query,
        )}`;
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("nominatim-error");
        }

        const results = await response.json();
        if (Array.isArray(results) && results.length > 0) {
          const [first] = results;
          const lat = parseFloat(first.lat);
          const lng = parseFloat(first.lon);
          if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
            return { lat, lng };
          }
          throw new Error("nominatim-no-coordinates");
        }
        throw new Error("nominatim-no-results");
      }

      async function searchPhoton() {
        const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=1`;        
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("photon-error");
        }

        const results = await response.json();
        const feature = results?.features?.[0];
        const coordinates = feature?.geometry?.coordinates;
        if (Array.isArray(coordinates) && coordinates.length >= 2) {
          const [lng, lat] = coordinates;
          if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
            return { lat, lng };
          }
          throw new Error("photon-no-coordinates");
        }
        throw new Error("photon-no-results");
      }

      try {
        let coords;
        try {
          coords = await searchNominatim();
        } catch (firstError) {
          coords = await searchPhoton();
        }

        if (coords) {
          setPosition(coords);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("AddressMapPreview search error:", err);
          const message =
            err.message === "nominatim-no-results" || err.message === "photon-no-results"
              ? "ไม่พบตำแหน่งที่ค้นหา"
              : "ไม่สามารถค้นหาตำแหน่งได้ในขณะนี้";
          setError(message);
        }
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  React.useEffect(() => {
    if (onGeocode && position) {
      onGeocode(position.lat, position.lng);
    }
  }, [position]);

  return (
    <div className="relative z-0" style={{ width: "100%", height: 400, borderRadius: 8, overflow: "hidden" }}>
      <MapContainer
        center={position}
        zoom={15}
        style={{ width: "100%", height: "100%", zIndex: 0 }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap position={position} />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
      <div className="absolute left-4 top-4 z-20 rounded-xl bg-white/95 border border-gray-200 px-3 py-2 text-sm text-gray-600 shadow-sm">
        {isSearching
          ? "ค้นหาตำแหน่ง..."
          : error || `Coordinates: ${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}`}
      </div>
    </div>
  );
}