import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSlidersH } from "react-icons/fa";
import AnnounceService from "../services/AnnounceService";
import ProvinceService from "../services/ProvinceService";
import { Badge } from "lucide-react";

const BANGKOK_PROVINCE = "กรุงเทพมหานคร";

const saleTypes = [
  { label: "ทั้งหมด", value: "" },
  { label: "ขาย", value: "SELL" },
  { label: "เช่า", value: "RENT" },
];

export default function SearchBarWithFilter({
  selectedType = "",
  defaultKeyword = "",
  defaultFilter = "",
  defaultProvince = "",
  defaultStation = "",
  defaultBadge = "",
  onSearch,
}) {
  const [searchText, setSearchText] = useState("");
  const [announceTypes, setAnnounceTypes] = useState([]);
  const [badgeOptions, setBadgeOptions] = useState([]);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [stationOptions, setStationOptions] = useState([]);

  const [filters, setFilters] = useState({
    type: "",
    province: "",
    station: "",
    saleType: selectedType || "",
    bedroomCount: 0,
    badge: [],
    minPrice: 0,
    maxPrice: 1000000000,
  });

  const [tempFilters, setTempFilters] = useState(filters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const navigate = useNavigate();

  const isBangkokProvince = (value) => {
    if (!value) return false;
    const text = String(value).toLowerCase();
    return (
      value === BANGKOK_PROVINCE ||
      text.includes("กรุงเทพ") ||
      text.includes("bangkok")
    );
  };

  useEffect(() => {
    ProvinceService.showAllAnnounceTypes()
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setAnnounceTypes(res.data);
        }
      })
      .catch(() => {
        setAnnounceTypes([]);
      });
  }, []);

  useEffect(() => {
    AnnounceService.getAllBadges()
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setBadgeOptions(res.data);
        }
      })
      .catch(() => {
        setBadgeOptions(["ราคาพิเศษ", "โครงการใหม่", "หายาก"]);
      });
  }, []);

  useEffect(() => {
    ProvinceService.getAllProvinces()
      .then((res) => {
        const raw = res?.data;
        const list = Array.isArray(raw) ? raw : [];
        const names = list
          .map((item) =>
            typeof item === "string"
              ? item
              : item?.provinceName || item?.name || item?.title
          )
          .filter(Boolean);
        setProvinceOptions(names.length > 0 ? names : []);
      })
      .catch(() => setProvinceOptions([]));
  }, []);

  useEffect(() => {
    ProvinceService.getAllStations()
      .then((res) => {
        const raw = res?.data;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.stations)
          ? raw.stations
          : Array.isArray(raw?.data)
          ? raw.data
          : [];

        const options = list
          .map((item) => {
            if (typeof item === "string") {
              return { value: item, label: item };
            }

            if (!item) return null;

            const value = item.name || item.stationName || item.title;
            if (!value) return null;

            const type = item.stationType || item.type || item.line;
            const label =
              type && typeof type === "string"
                ? `${value} (${type.toUpperCase()})`
                : value;

            return { value, label };
          })
          .filter(Boolean);

        setStationOptions(options.length > 0 ? options : []);
      })
      .catch(() => setStationOptions([]));
  }, []);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, saleType: selectedType }));
    setTempFilters((prev) => ({ ...prev, saleType: selectedType }));
  }, [selectedType]);

  // initialize from defaults when provided (useful for filter page)
  useEffect(() => {
    if (defaultKeyword) setSearchText(defaultKeyword);
    setFilters((prev) => ({
      ...prev,
      type: defaultFilter || prev.type,
      province: defaultProvince || prev.province,
      station: defaultStation || prev.station,
      badge: defaultBadge ? (Array.isArray(defaultBadge) ? defaultBadge : String(defaultBadge).split(",")) : prev.badge,
    }));
    setTempFilters((prev) => ({
      ...prev,
      type: defaultFilter || prev.type,
      province: defaultProvince || prev.province,
      station: defaultStation || prev.station,
      badge: defaultBadge ? (Array.isArray(defaultBadge) ? defaultBadge : String(defaultBadge).split(",")) : prev.badge,
    }));
  }, [defaultKeyword, defaultFilter, defaultProvince, defaultStation, defaultBadge]);

  // If announceTypes include ids, and defaultFilter was provided as id, map to typeName for UI display
  useEffect(() => {
    if (!announceTypes || announceTypes.length === 0) return;
    if (!defaultFilter) return;
    const byId = announceTypes.find((t) => String(t.id) === String(defaultFilter));
    if (byId) {
      setFilters((prev) => ({ ...prev, type: byId.typeName }));
      setTempFilters((prev) => ({ ...prev, type: byId.typeName }));
    }
  }, [announceTypes, defaultFilter]);

  const handleSearch = (activeFilters = filters, activeSearchText = searchText) => {
    const f = activeFilters;
    // Ensure `type` is sent as text (typeName). If an id was provided, map it to typeName.
    let typeParam = f.type || "";
    if (typeParam && announceTypes && announceTypes.length > 0) {
      // If user passed an id (e.g. from URL), find the matching announceType and use its typeName
      const byId = announceTypes.find((t) => String(t.id) === String(typeParam));
      if (byId) typeParam = byId.typeName || String(byId.id);
      // otherwise assume it's already a textual typeName and send as-is
    }

    const params = {
      keyword: activeSearchText || "",
      type: typeParam || "",
      province: f.province || "",
      station: f.station || "",
      saleType: f.saleType || "",
      bedroomCount: f.bedroomCount || "",
      badge: Array.isArray(f.badge) ? f.badge.join(",") : f.badge || "",
      minPrice: f.minPrice,
      maxPrice: f.maxPrice,
      page: 0,
      size: 10,
    };

    const query = new URLSearchParams(params).toString();
    if (typeof onSearch === "function") {
      onSearch(params);
    } else {
      navigate(`/filter?${query}`);
    }
  };

  const handleTempChange = (name, value) => {
    setTempFilters((prev) => ({ ...prev, [name]: value }));
  };

  const toggleBadge = (b) => {
    setTempFilters((prev) => {
      const exists = prev.badge.includes(b);
      return {
        ...prev,
        badge: exists ? prev.badge.filter((i) => i !== b) : [...prev.badge, b],
      };
    });
  };

  const clearFilters = () => {
    const cleared = {
      type: "",
      province: "",
      station: "",
      saleType: "",
      bedroomCount: 0,
      badge: [],
      minPrice: 0,
      maxPrice: 1000000000,
    };
    setTempFilters(cleared);
    setFilters(cleared);
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setIsFilterOpen(false);
    handleSearch(tempFilters);
  };

  return (
    <>
      {/* SEARCH BAR */}
      <div className="w-full flex justify-center -mt-1 mb-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="w-full max-w-4xl px-4"
        >
          <div className="relative w-full h-16 rounded-2xl border border-[#e7dbce] bg-white shadow-lg flex items-center px-4 gap-3">

            {/* icon */}
            <svg
              className="h-5 w-5 text-[#8C6239]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
            </svg>

            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="ค้นหาโครงการ ทำเล หรือคำสำคัญ..."
              className="flex-1 bg-transparent focus:outline-none text-gray-800 placeholder:text-gray-400"
            />

            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="btn btn-sm sm:btn-md btn-outline border-[#e7dbce] text-[#8C6239] bg-white hover:bg-[#f7ede2] rounded-md"
            >
              <FaSlidersH />
              <span className="hidden sm:inline">ตัวกรอง</span>
            </button>

            <button
              type="submit"
              className="btn btn-sm sm:btn-md bg-[#8C6239] text-white border-none hover:bg-[#704c2c]"
            >
              ค้นหา
            </button>

          </div>
        </form>
      </div>

      {/* FILTER MODAL */}
      <dialog className={`modal ${isFilterOpen ? "modal-open" : ""}`}>
        <div className="modal-box w-11/12 max-w-3xl bg-white rounded-2xl p-6 space-y-6">

          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-[#8C6239]">
              ตัวกรองการค้นหา
            </h2>
            <button onClick={() => setIsFilterOpen(false)} className="btn btn-ghost btn-sm">✕</button>
          </div>

          {/* ประเภททรัพย์ */}
          <section>
            <h3 className="font-medium text-gray-700 mb-2">ประเภททรัพย์</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {announceTypes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleTempChange("type", t.typeName || t.name || t.id)}
                  className={`btn btn-sm rounded-full ${
                    tempFilters.type === (t.typeName || t.name || t.id)
                      ? "bg-[#8C6239] text-white"
                      : "btn-outline border-[#e7dbce]"
                  }`}
                >
                  {t.typeName || t.name || t.id}
                </button>
              ))}
            </div>
          </section>

          {/* ประเภทประกาศ */}
          <section>
            <h3 className="font-medium text-gray-700 mb-2">ประเภทประกาศ</h3>
            <div className="flex flex-wrap gap-2">
              {saleTypes.map((s) => (
                <button
                  key={s.value + "saleType"}
                  type="button"
                  onClick={() => handleTempChange("saleType", s.value)}
                  className={`btn btn-sm rounded-full ${
                    tempFilters.saleType === s.value
                      ? "bg-[#8C6239] text-white"
                      : "btn-outline border-[#e7dbce]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </section>

          {/* จังหวัด + สถานี */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">จังหวัด</h3>
              <select
                value={tempFilters.province}
                onChange={(e) => {
                  const value = e.target.value;
                  handleTempChange("province", value);
                  if (!isBangkokProvince(value)) handleTempChange("station", "");
                }}
                className="select select-bordered w-full bg-white cursor-pointer"
              >
                <option value="">ทั้งหมด</option>
                {provinceOptions.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">สถานี (ถ้ามี)</h3>
              <select
                value={tempFilters.station}
                onChange={(e) => handleTempChange("station", e.target.value)}
                disabled={!isBangkokProvince(tempFilters.province)}
                className="select select-bordered w-full bg-white cursor-pointer"
              >
                <option value="">
                  {isBangkokProvince(tempFilters.province)
                    ? "สถานีทั้งหมด"
                    : "เลือกกรุงเทพมหานครก่อน"}
                </option>
                {isBangkokProvince(tempFilters.province) &&
                  stationOptions.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
              </select>
            </div>
          </section>

          {/* ราคา */}
          <section>
            <h3 className="font-medium text-gray-700 mb-2 text-center">ช่วงราคา</h3>

            <div className="flex justify-between text-sm mb-2">
              <span>{tempFilters.minPrice.toLocaleString()} บาท</span>
              <span>{tempFilters.maxPrice.toLocaleString()} บาท</span>
            </div>

            <input
              type="range"
              min="0"
              max="1000000000"
              step="50000"
              value={tempFilters.minPrice}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v <= tempFilters.maxPrice) handleTempChange("minPrice", v);
              }}
              className="range range-xs [--range-shdw:#8C6239] w-full"
            />

            <input
              type="range"
              min="0"
              max="1000000000"
              step="50000"
              value={tempFilters.maxPrice}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v >= tempFilters.minPrice) handleTempChange("maxPrice", v);
              }}
              className="range range-xs [--range-shdw:#8C6239] mt-2 w-full"
            />
          </section>

          {/* ห้องนอน */}
          <section>
            <h3 className="font-medium text-gray-700 mb-2">จำนวนห้องนอน</h3>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() =>
                    handleTempChange(
                      "bedroomCount",
                      tempFilters.bedroomCount === n ? 0 : n
                    )
                  }
                  className={`btn btn-sm rounded-full ${
                    tempFilters.bedroomCount === n
                      ? "bg-[#8C6239] text-white"
                      : "btn-outline border-[#e7dbce]"
                  }`}
                >
                  {n} ห้อง
                </button>
              ))}
            </div>
          </section>

          {/* Badge */}
          <section>
            <h3 className="font-medium text-gray-700 mb-2">ป้ายกำกับ (Badge)</h3>
            <div className="flex flex-wrap gap-2">
              {badgeOptions.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => toggleBadge(b.badgeName)}
                  className={`btn btn-sm rounded-full ${
                    tempFilters.badge.includes(b.badgeName)
                      ? "bg-[#8C6239] text-white"
                      : "btn-outline border-[#e7dbce]"
                  }`}
                >
                  {b.badgeName}
                </button>
              ))}
            </div>
          </section>

          {/* Action */}
          <div className="modal-action flex justify-between">
            <button
              type="button"
              onClick={clearFilters}
              className="btn btn-ghost text-gray-600"
            >
              ล้างตัวกรอง
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="btn bg-gray-100 text-gray-700"
              >
                ปิด
              </button>

              <button
                type="button"
                onClick={applyFilters}
                className="btn bg-[#8C6239] text-white"
              >
                ใช้ตัวกรอง
              </button>
            </div>
          </div>

        </div>
      </dialog>
    </>
  );
}
