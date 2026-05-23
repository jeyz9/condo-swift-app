import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function SimpleMap({ lat, lng }) {
  const numericLat = Number(lat);
  const numericLng = Number(lng);

  if (!Number.isFinite(numericLat) || !Number.isFinite(numericLng)) {
    return <div>ไม่มีพิกัดแผนที่</div>;
  }

  const position = { lat: numericLat, lng: numericLng };
  return (
    <div style={{ width: "100%", height: 400, borderRadius: 8, overflow: "hidden" }}>
      <MapContainer center={position} zoom={15} style={{ width: "100%", height: "100%" }} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} />
      </MapContainer>
    </div>
  );
}
