import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { loadGoogleMaps } from "../services/googleLoader";

const containerStyle = { width: "100%", height: "400px" };

export default function AddressMapPreview({ query, onGeocode }) {
  const defaultCenter = useMemo(() => ({ lat: 13.7563, lng: 100.5018 }), []);
  const [isLoaded, setIsLoaded] = useState(false);
  const [center, setCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(13);
  const [hasMarker, setHasMarker] = useState(false);
  const [placeName, setPlaceName] = useState("");
  const [searchError, setSearchError] = useState("");
  const geocodeTimeout = useRef(null);
  const geocoderRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    loadGoogleMaps()
      .then(() => {
        if (mounted) setIsLoaded(true);
      })
      .catch((error) => {
        console.error("Failed to load Google Maps:", error);
        setSearchError("Unable to load Google Maps. Please retry.");
      });
    return () => {
      mounted = false;
    };
  }, []);

  const ensureGeocoder = useCallback(() => {
    if (!window.google?.maps) return null;
    if (!geocoderRef.current) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }
    return geocoderRef.current;
  }, []);

  const pinLocation = useCallback(
    (lat, lng, result = null) => {
      setCenter({ lat, lng });
      setZoom(17);
      setHasMarker(true);
      setSearchError("");

      if (result?.formatted_address) {
        setPlaceName(result.formatted_address);
        onGeocode?.(lat, lng, result);
        return;
      }

      const geocoder = ensureGeocoder();
      if (!geocoder) {
        onGeocode?.(lat, lng, result);
        return;
      }

      geocoder.geocode(
        { location: { lat, lng } },
        (results, status) => {
          if (status === "OK" && results?.[0]) {
            setPlaceName(results[0].formatted_address || "");
            onGeocode?.(lat, lng, results[0]);
          } else {
            setPlaceName("");
            onGeocode?.(lat, lng, result);
          }
        }
      );
    },
    [ensureGeocoder, onGeocode]
  );

  const geocodeAddress = useCallback(
    (address) => {
      const trimmed = address.trim();
      if (!trimmed) return;

      const geocoder = ensureGeocoder();
      if (!geocoder) {
        setSearchError("Google Maps not ready yet. Please try again.");
        return;
      }

      geocoder.geocode(
        { address: trimmed, region: "th" },
        (results, status) => {
          if (status === "OK" && results?.[0]) {
            const loc = results[0].geometry.location;
            const lat = typeof loc.lat === "function" ? loc.lat() : loc.lat;
            const lng = typeof loc.lng === "function" ? loc.lng() : loc.lng;
            pinLocation(lat, lng, results[0]);
          } else {
            setHasMarker(false);
            setPlaceName("");
            setSearchError("No matching location found for that search.");
          }
        }
      );
    },
    [ensureGeocoder, pinLocation]
  );

  useEffect(() => {
    if (!isLoaded) return;

    if (geocodeTimeout.current) {
      clearTimeout(geocodeTimeout.current);
    }

    const trimmedQuery = typeof query === "string" ? query.trim() : "";
    if (!trimmedQuery) {
      setSearchError("");
      return;
    }

    geocodeTimeout.current = setTimeout(() => {
      try {
        const service = new window.google.maps.places.PlacesService(
          document.createElement("div")
        );

        const request = {
          query: trimmedQuery,
          fields: ["name", "geometry", "formatted_address", "place_id"],
          language: "th",
          region: "th",
        };

        service.findPlaceFromQuery(request, (results, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            Array.isArray(results) &&
            results[0]
          ) {
            const loc = results[0].geometry.location;
            const lat = typeof loc.lat === "function" ? loc.lat() : loc.lat;
            const lng = typeof loc.lng === "function" ? loc.lng() : loc.lng;
            pinLocation(lat, lng, results[0]);
          } else {
            geocodeAddress(trimmedQuery);
          }
        });
      } catch (error) {
        console.error("Places query failed:", error);
        geocodeAddress(trimmedQuery);
      }
    }, 600);

    return () => {
      if (geocodeTimeout.current) clearTimeout(geocodeTimeout.current);
    };
  }, [query, isLoaded, geocodeAddress, pinLocation]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Device does not support geolocation.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        pinLocation(latitude, longitude);
      },
      () => alert("Unable to retrieve your current location.")
    );
  };

  const handleMapInteraction = useCallback(
    (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      pinLocation(lat, lng);
    },
    [pinLocation]
  );

  if (!isLoaded)
    return (
      <div className="flex justify-center items-center h-[300px] text-gray-500">
        Loading map...
      </div>
    );

  return (
    <div className="relative mt-3 w-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onClick={handleMapInteraction}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          disableDoubleClickZoom: true,
          gestureHandling: "auto",
        }}
      >
        {hasMarker && (
          <Marker position={center} draggable onDragEnd={handleMapInteraction} />
        )}
      </GoogleMap>

      <button
        onClick={handleUseMyLocation}
        className="mt-3 btn absolute right-3 bg-white shadow-md rounded-xl flex items-center justify-center hover:bg-gray-100"
        title="Use my current position"
      >
        Use my location
      </button>

      <div className="text-sm text-gray-700 mt-3">
        {placeName
          ? `Selected location: ${placeName}`
          : "Search or click on the map to choose the announce location."}
      </div>
      {searchError && (
        <div className="mt-2 text-sm text-red-600">{searchError}</div>
      )}
      <div className="text-xs text-gray-500 text-right">
        Coordinates: {center.lat.toFixed(5)}, {center.lng.toFixed(5)}
      </div>
    </div>
  );
}
