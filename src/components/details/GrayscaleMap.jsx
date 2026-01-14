import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { loadGoogleMaps } from "../../services/googleLoader";
import { MdLocalMall, MdRestaurant, MdPark, MdTrain, MdSchool } from "react-icons/md";

const containerStyle = {
  width: "100%",
  height: "400px",
};

export default function GrayscaleMap({ lat, lng }) {
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

  const mapRef = useRef();
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedType, setSelectedType] = useState("");

  const center = { lat: parseFloat(lat), lng: parseFloat(lng) };

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  useEffect(() => {
    if (!mapRef.current || !window.google || !selectedType) return;

    const service = new window.google.maps.places.PlacesService(mapRef.current);

    //  helper ฟังก์ชันค้นหาแต่ละ type
    const searchType = (type) => {
      return new Promise((resolve) => {
        const request = { location: center, radius: 1500, type };
        service.nearbySearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            resolve(results);
          } else {
            resolve([]);
          }
        });
      });
    };

    const fetchPlaces = async () => {
      if (Array.isArray(selectedType)) {
        //  ถ้าเป็นหลาย type เช่น ["train_station", "subway_station"]
        const results = await Promise.all(selectedType.map(searchType));
        setPlaces(results.flat()); // รวมผลลัพธ์ทั้งหมด
      } else {
        //  ถ้าเป็น type เดียว
        const results = await searchType(selectedType);
        setPlaces(results);
      }
    };

    fetchPlaces();
  }, [selectedType, lat, lng]);

  if (!isLoaded) return <div>กำลังโหลดแผนที่...</div>;

  return (
    <div className="w-full">
      {/* ปุ่มเลือกหมวด */}
      <div className="flex gap-2 mb-3 overflow-x-auto flex-nowrap">
        <button
          onClick={() => setSelectedType("shopping_mall")}
          className={`btn btn-outline rounded-full shrink-0 whitespace-nowrap ${
            selectedType === "shopping_mall" ? "btn-active btn-neutral" : ""
          }`}
        >
          <MdLocalMall className="w-5 h-5 mr-2" /> แหล่งช้อปปิ้ง
        </button>

        <button
          onClick={() => setSelectedType("restaurant")}
          className={`btn btn-outline rounded-full shrink-0 whitespace-nowrap ${
            selectedType === "restaurant" ? "btn-active btn-neutral" : ""
          }`}
        >
          <MdRestaurant className="w-5 h-5 mr-2" /> อาหารและเครื่องดื่ม
        </button>

        <button
          onClick={() => setSelectedType("park")}
          className={`btn btn-outline rounded-full shrink-0 whitespace-nowrap ${
            selectedType === "park" ? "btn-active btn-neutral" : ""
          }`}
        >
          <MdPark className="w-5 h-5 mr-2" /> สวนสาธารณะ
        </button>

        {/*  รวมทั้ง MRT, BTS, Train */}
        <button
          onClick={() =>
            setSelectedType(["train_station", "subway_station", "transit_station"])
          }
          className={`btn btn-outline rounded-full shrink-0 whitespace-nowrap ${
            Array.isArray(selectedType) ? "btn-active btn-neutral" : ""
          }`}
        >
          <MdTrain className="w-5 h-5 mr-2" /> รถไฟ / รถไฟฟ้า
        </button>

        <button
          onClick={() => setSelectedType("school")}
          className={`btn btn-outline rounded-full shrink-0 whitespace-nowrap ${
            selectedType === "school" ? "btn-active btn-neutral" : ""
          }`}
        >
          <MdSchool className="w-5 h-5 mr-2" /> โรงเรียน
        </button>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: [
            { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
            { featureType: "water", stylers: [{ color: "#c9c9c9" }] },
          ],
        }}
      >
        {/* 🏠 Marker ของประกาศ */}
        <Marker position={center} label="🏠" />

        {/* 📍 Marker ของสถานที่ใกล้เคียง */}
        {places.map((place) => (
          <Marker
            key={place.place_id}
            position={place.geometry.location}
            title={place.name}
            onClick={() => setSelectedPlace(place)}
          />
        ))}

        {/* 🪧 แสดงชื่อร้านเมื่อคลิก */}
        {selectedPlace && (
          <InfoWindow
            position={selectedPlace.geometry.location}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div className="text-sm">
              <h3 className="font-semibold text-base mb-1">
                {selectedPlace.name}
              </h3>
              {selectedPlace.vicinity && (
                <p className="text-gray-600">{selectedPlace.vicinity}</p>
              )}
              {selectedPlace.rating && (
                <p className="text-yellow-600">
                  ⭐ {selectedPlace.rating} ({selectedPlace.user_ratings_total} รีวิว)
                </p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
