import { Loader } from "@googlemaps/js-api-loader";

const G_API = import.meta.env.VITE_GOOGLEMAP_API;

export const googleLoader = new Loader({
  apiKey: G_API,
  version: "weekly",
  libraries: ["places"], //  ต้องมี places
});

export async function loadGoogleMaps() {
  try {
    await googleLoader.load();
    return window.google;
  } catch (error) {
    console.error("❌ โหลด Google Maps ไม่สำเร็จ:", error);
    throw error;
  }
}
