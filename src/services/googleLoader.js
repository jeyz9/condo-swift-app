// Centralized Google Maps JS API loader
import { Loader } from "@googlemaps/js-api-loader";

const G_API = import.meta.env.VITE_GOOGLEMAP_API;

export const googleLoader = new Loader({
  apiKey: G_API,
  version: "weekly",
  libraries: ["places", "maps"],
});

// Convenience helper to load once from components
export function loadGoogleMaps() {
  return googleLoader.load();
}

