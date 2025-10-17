import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { loadGoogleMaps } from "../services/googleLoader";
const containerStyle = { width: "100%", height: "400px" };

export default function AddressMapPreview({ query, onGeocode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    let mounted = true;
    loadGoogleMaps().then(() => {
      if (mounted) setIsLoaded(true);
    });
    return () => {
      mounted = false;
    };
  }, []);
  const defaultCenter = useMemo(() => ({ lat: 13.7563, lng: 100.5018 }), []);
  const [center, setCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(13);
  const [hasMarker, setHasMarker] = useState(false);
  const [placeName, setPlaceName] = useState("");
  const geocodeTimeout = useRef(null);

  // 📍 ปักหมุดและ geocode จากพิกัด
  const pinLocation = useCallback(
    (lat, lng) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const formatted = results[0].formatted_address;
          setCenter({ lat, lng });
          setZoom(17);
          setHasMarker(true);
          setPlaceName(formatted);
          onGeocode?.(lat, lng, results[0]);
        }
      });
    },
    [onGeocode]
  );

  // 🧭 ใช้ตำแหน่งปัจจุบัน (GPS)
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("⚠️ เบราว์เซอร์ของคุณไม่รองรับการใช้ตำแหน่ง");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        pinLocation(latitude, longitude);
      },
      () => alert("❌ ไม่สามารถเข้าถึงตำแหน่งของคุณได้")
    );
  };

  // 📍 คลิกบนแผนที่เพื่อปักหมุด
  const handleMapClick = useCallback(
    (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      pinLocation(lat, lng);
    },
    [pinLocation]
  );

  // 📍 ลากหมุดเพื่ออัปเดตตำแหน่ง
  const handleMarkerDragEnd = useCallback(
    (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      pinLocation(lat, lng);
    },
    [pinLocation]
  );

  // 🔍 ค้นหาชื่อสถานที่อัตโนมัติเมื่อ query เปลี่ยน
  useEffect(() => {
    if (!isLoaded || !query) return;
    if (geocodeTimeout.current) clearTimeout(geocodeTimeout.current);

    geocodeTimeout.current = setTimeout(() => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: query }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const loc = results[0].geometry.location;
          const lat = loc.lat();
          const lng = loc.lng();
          setCenter({ lat, lng });
          setZoom(16);
          setHasMarker(true);
          setPlaceName(results[0].formatted_address);
          onGeocode?.(lat, lng, results[0]);
        }
      });
    }, 600);

    return () => clearTimeout(geocodeTimeout.current);
  }, [query, isLoaded, onGeocode]);

  if (!isLoaded)
    return (
      <div className="flex justify-center items-center h-[300px] text-gray-500">
        กำลังโหลดแผนที่...
      </div>
    );

  return (
    <div className="relative mt-3 w-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onClick={handleMapClick}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          disableDoubleClickZoom: true,
          gestureHandling: "auto",
        }}
      >
        {hasMarker && (
          <Marker
            position={center}
            draggable
            onDragEnd={handleMarkerDragEnd}
          />
        )}
        
      </GoogleMap>
       {/* 🧭 ปุ่ม GPS */}
      <button
        onClick={handleUseMyLocation}
        className="mt-3 btn absolute  right-3 bg-white shadow-md rounded-xl flex items-center justify-center hover:bg-gray-100"
        title="ใช้ตำแหน่งปัจจุบัน"
      >
        📍ใช้ตำแหน่งปัจจุบัน
      </button>

      <div className=" text-sm text-gray-700 mt-15">
        {placeName
          ? `📍 ${placeName}`
          : "พิมพ์ชื่อสถานที่หรือคลิกบนแผนที่เพื่อปักหมุด"}
      </div>
      <div className="text-xs text-gray-500 text-right">
        พิกัด: {center.lat.toFixed(5)}, {center.lng.toFixed(5)}
      </div>

     
    </div>
  );
}
