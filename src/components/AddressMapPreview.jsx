import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const FALLBACK_CENTER = { lat: 13.7563, lng: 100.5018 };

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position ? <Marker position={position} /> : null;
}

export default function AddressMapPreview({
  initialCenter,
  onGeocode,
}) {
  const [position, setPosition] = React.useState(
    initialCenter?.lat && initialCenter?.lng
      ? { lat: initialCenter.lat, lng: initialCenter.lng }
      : FALLBACK_CENTER
  );

  React.useEffect(() => {
    if (onGeocode && position) {
      onGeocode(position);
    }
    // eslint-disable-next-line
  }, [position]);

  return (
    <div style={{ width: "100%", height: 400, borderRadius: 8, overflow: "hidden" }}>
      <MapContainer
        center={position}
        zoom={15}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
      <div className="text-xs text-gray-500 text-right mt-2">
        Coordinates: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
      </div>
    </div>
  );
}