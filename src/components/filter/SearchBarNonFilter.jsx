import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaFilter,
  FaBuilding,
  FaMoneyBillWave,
  FaBed,
} from "react-icons/fa";
import ProvinceService from "../../services/ProvinceService";
import { provinces as fallbackProvinces } from "../../data/provinces";
import { stations as fallbackStations } from "../../data/stations";

const fallbackStationOptions = fallbackStations.map(station => ({ value: station, label: station }));

export default function SearchBarNonFilter({
  defaultKeyword = "",
  defaultFilter = "",
  defaultSaleType = "",
  defaultSaleAbout = "",
  defaultStation = "",
  defaultProvince = "",
  defaultBadge = "",
  onSearch,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchText, setSearchText] = useState(defaultKeyword);
  const [saleType, setSaleType] = useState(defaultSaleType || defaultSaleAbout || "");
  const [filters, setFilters] = useState({
    type: defaultFilter || "",
    bedroomCount: "",
    minPrice: "",
    maxPrice: "",
    isPremium: false,
    station: defaultStation || "",
    province: defaultProvince || "",
    badge: defaultBadge || "",
  });
  const [provinceOptions, setProvinceOptions] = useState(fallbackProvinces);
  const [stationOptions, setStationOptions] = useState(fallbackStationOptions);
  const [announceTypes, setAnnounceTypes] = useState([]);

  useEffect(() => {
    ProvinceService.showAllAnnounceTypes()
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          setAnnounceTypes(res.data);
        }
      })
      .catch(err => {
        console.error("Failed to fetch announce types:", err);
      });

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
        setProvinceOptions(names.length > 0 ? names : fallbackProvinces);
      })
      .catch(() => setProvinceOptions(fallbackProvinces));

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

        if (options.length > 0) {
          setStationOptions(options);
        } else {
          setStationOptions(fallbackStationOptions);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch stations, using fallback. Error:", err);
        setStationOptions(fallbackStationOptions);
      });
  }, []);

  const normalizePriceValue = (raw) => {
    if (raw === null || raw === undefined) return "";
    const str = String(raw).trim();
    if (str === "") return "";
    const num = Number(str);
    if (!Number.isFinite(num) || num < 0) return null;
    return num;
  };

  const formatPriceLabel = (min, max) => {
    const hasMin = min !== "" && min !== null && min !== undefined;
    const hasMax = max !== "" && max !== null && max !== undefined;
    if (!hasMin && !hasMax) return "ราคา";

    const minStr = hasMin
      ? `THB ${Number(min).toLocaleString("en-US")}`
      : "THB 0";
    const maxStr = hasMax
      ? `THB ${Number(max).toLocaleString("en-US")}`
      : "ไม่จำกัด";

    return `${minStr} - ${maxStr}`;
  };

  useEffect(() => {
    setSearchText(defaultKeyword);
  }, [defaultKeyword]);

  useEffect(() => {
    setSaleType(defaultSaleType || defaultSaleAbout || "");
  }, [defaultSaleType, defaultSaleAbout]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      type: defaultFilter || "",
      station: defaultStation || "",
      province: defaultProvince || "",
      badge: defaultBadge || "",
    }));
  }, [defaultFilter, defaultStation, defaultProvince, defaultBadge]);

  const goFilter = (overrides = {}) => {
    const currentParams = new URLSearchParams(location.search);
    
    const merged = {
      keyword: overrides.keyword ?? searchText?.trim() ?? currentParams.get("keyword") ?? "",
      type: overrides.type ?? filters.type ?? currentParams.get("type") ?? "",
      saleType: overrides.saleType ?? saleType ?? currentParams.get("saleType") ?? "",
      bedroomCount: overrides.bedroomCount ?? filters.bedroomCount ?? currentParams.get("bedroomCount") ?? "",
      minPrice: overrides.minPrice ?? filters.minPrice ?? currentParams.get("minPrice") ?? "",
      maxPrice: overrides.maxPrice ?? filters.maxPrice ?? currentParams.get("maxPrice") ?? "",
      isPremium: overrides.isPremium !== undefined ? overrides.isPremium : filters.isPremium,
      station: overrides.station ?? filters.station ?? currentParams.get("station") ?? "",
      province: overrides.province ?? filters.province ?? currentParams.get("province") ?? "",
      badge: overrides.badge ?? filters.badge ?? currentParams.get("badge") ?? "",
      page: overrides.page ?? 0,
      size: overrides.size ?? 10,
    };

    const bedroomCountNum =
      merged.bedroomCount !== "" && merged.bedroomCount != null
        ? Number(merged.bedroomCount)
        : undefined;

    const minPriceNum =
      merged.minPrice !== "" && merged.minPrice != null
        ? Number(merged.minPrice)
        : undefined;

    const maxPriceNum =
      merged.maxPrice !== "" && merged.maxPrice != null
        ? Number(merged.maxPrice)
        : undefined;

    const params = {
      keyword: merged.keyword || undefined,
      type: merged.type || undefined,
      saleType: merged.saleType || undefined,
      bedroomCount:
        bedroomCountNum !== undefined && !Number.isNaN(bedroomCountNum)
          ? bedroomCountNum
          : undefined,
      minPrice:
        minPriceNum !== undefined && !Number.isNaN(minPriceNum)
          ? minPriceNum
          : undefined,
      maxPrice:
        maxPriceNum !== undefined && !Number.isNaN(maxPriceNum)
          ? maxPriceNum
          : undefined,
      badge: merged.badge || undefined,
      station: merged.station || undefined,
      province: merged.province || undefined,
      page: merged.page,
      size: merged.size,
    };

    const cleaned = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );

    console.log("🎯 goFilter - Current URL:", location.search);
    console.log("🎯 goFilter - Merged params:", cleaned);

    // ส่งไปให้ Filter.jsx จัดการ navigate
    if (onSearch) {
      onSearch(cleaned);
    }
  };

  const handleSearch = (e) => {
    e?.preventDefault?.();
    goFilter({ page: 0, size: 10 });
  };

  const handleAllFilter = async () => {
    const result = await Swal.fire({
      title: "ตัวกรองทั้งหมด",
      width: 520,
      background: "#fff",
      confirmButtonColor: "#8C6239",
      cancelButtonColor: "#aaa",
      confirmButtonText: "ค้นหา",
      cancelButtonText: "ยกเลิก",
      showCancelButton: true,
      customClass: {
        popup: "rounded-3xl p-0 overflow-hidden shadow-2xl border border-[#8C6239]/30",
      },
      html: `
        <div class="p-6 space-y-6 font-sans text-gray-700 text-left">
          <div>
            <label class="block font-semibold text-[#8C6239] mb-1 text-sm">ประเภทอสังหาฯ</label>
            <select id="filter-type" class="w-full border border-[#d0bfa8] rounded-xl p-2.5 text-sm">
              <option value="">ทั้งหมด</option>
              ${announceTypes
                .map(
                  (type) =>
                    `<option value="${type.typeName}" ${
                      filters.type === type.typeName ? "selected" : ""
                    }>${type.typeName}</option>`
                )
                .join("")}
            </select>
          </div>

          <div>
            <label class="block font-semibold text-[#8C6239] mb-1 text-sm">สถานี (BTS/MRT)</label>
            <select id="filter-station" class="w-full border border-[#d0bfa8] rounded-xl p-2.5 text-sm">
              <option value="">ทั้งหมด</option>
              ${stationOptions
                .map(
                  (station) =>
                    `<option value="${station.value}" ${
                      filters.station === station.value ? "selected" : ""
                    }>${station.label}</option>`
                )
                .join("")}
            </select>
          </div>

          <div>
            <label class="block font-semibold text-[#8C6239] mb-1 text-sm">จังหวัด</label>
            <select id="filter-province" class="w-full border border-[#d0bfa8] rounded-xl p-2.5 text-sm">
              <option value="">ทั้งหมด</option>
              ${provinceOptions
                .map(
                  (province) =>
                    `<option value="${province}" ${
                      filters.province === province ? "selected" : ""
                    }>${province}</option>`
                )
                .join("")}
            </select>
          </div>

          <div>
            <label class="block font-semibold text-[#8C6239] mb-2 text-sm">จำนวนห้องนอน</label>
            <input id="bedroomCount" type="number" min="0" placeholder="เช่น 2" value="${
              filters.bedroomCount || ""
            }" class="w-full border border-[#d0bfa8] rounded-xl p-2.5 text-sm"/>
          </div>

          <div>
            <label class="block font-semibold text-[#8C6239] mb-2 text-sm">ราคา (บาท)</label>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs text-gray-600">ราคาต่ำสุด</label>
                <input id="minPrice" type="number" min="0" step="1000" placeholder="0" value="${
                  filters.minPrice || ""
                }" class="w-full border border-gray-300 rounded-md p-1.5 text-sm" />
              </div>
              <div>
                <label class="text-xs text-gray-600">ราคาสูงสุด</label>
                <input id="maxPrice" type="number" min="0" step="1000" placeholder="ไม่จำกัด" value="${
                  filters.maxPrice || ""
                }" class="w-full border border-gray-300 rounded-md p-1.5 text-sm" />
              </div>
            </div>
            <p class="mt-1 text-[11px] text-gray-500">เว้นว่าง = ไม่จำกัด</p>
          </div>
          
          <div>
            <label class="block font-semibold text-[#8C6239] mb-1 text-sm">ประเภทประกาศ</label>
            <select id="filter-badge" class="w-full border border-[#d0bfa8] rounded-xl p-2.5 text-sm">
              <option value="">ทั้งหมด</option>
              <option value="ราคาพิเศษ" ${filters.badge === "ราคาพิเศษ" ? "selected" : ""}>ราคาพิเศษ</option>
              <option value="ประกาศใหม่" ${filters.badge === "ประกาศใหม่" ? "selected" : ""}>ประกาศใหม่</option>
              <option value="แนะนำ" ${filters.badge === "แนะนำ" ? "selected" : ""}>แนะนำ</option>
            </select>
          </div>
        </div>
      `,
      preConfirm: () => {
        const type = document.getElementById("filter-type").value;
        const station = document.getElementById("filter-station").value;
        const province = document.getElementById("filter-province").value;
        const badge = document.getElementById("filter-badge").value;
        const bedroom = document.getElementById("bedroomCount").value;
        const min = normalizePriceValue(document.getElementById("minPrice").value);
        const max = normalizePriceValue(document.getElementById("maxPrice").value);

        if (min === null || max === null) {
          Swal.showValidationMessage("กรุณากรอกราคาให้ถูกต้อง");
          return false;
        }

        if (min !== "" && max !== "" && Number(min) > Number(max)) {
          Swal.showValidationMessage("ราคาสูงสุดต้องมากกว่าราคาต่ำสุด");
          return false;
        }

        return {
          type,
          station,
          province,
          badge,
          bedroomCount: bedroom,
          minPrice: min,
          maxPrice: max,
        };
      },
    });

    if (result.isConfirmed && result.value) {
      const v = result.value;
      const normalized = {
        type: v.type || "",
        station: v.station || "",
        province: v.province || "",
        badge: v.badge || "",
        bedroomCount: v.bedroomCount || "",
        minPrice: v.minPrice === "" ? "" : v.minPrice,
        maxPrice: v.maxPrice === "" ? "" : v.maxPrice,
      };

      setFilters((prev) => ({
        ...prev,
        ...normalized,
      }));

      goFilter(normalized);
    }
  };

  const handlePropertyType = async () => {
    const propertyOptions = announceTypes.reduce((acc, curr) => {
      acc[curr.typeName] = curr.typeName;
      return acc;
    }, {});

    const { value, isConfirmed } = await Swal.fire({
      title: "เลือกประเภททรัพย์",
      input: "select",
      inputOptions: propertyOptions,
      inputPlaceholder: "กรุณาเลือก",
      confirmButtonText: "ยืนยัน",
      showCancelButton: true,
      confirmButtonColor: "#8C6239",
      cancelButtonColor: "#aaa",
      inputValue: filters.type || "",
    });

    if (isConfirmed) {
      setFilters((prev) => ({ ...prev, type: value || "" }));
      goFilter({ type: value || "" });
    }
  };

  const handlePrice = async () => {
    const shortcuts = [
      { label: "<= 1M", min: "", max: 1000000 },
      { label: "1M - 3M", min: 1000000, max: 3000000 },
      { label: "3M - 5M", min: 3000000, max: 5000000 },
      { label: ">= 5M", min: 5000000, max: "" },
    ];

    const { value, isConfirmed } = await Swal.fire({
      title: "ค้นหาตามราคา (บาท)",
      width: 520,
      background: "#fff",
      confirmButtonColor: "#8C6239",
      cancelButtonColor: "#aaa",
      confirmButtonText: "ตกลง",
      showCancelButton: true,
      customClass: {
        popup: "rounded-3xl p-0 overflow-hidden shadow-2xl border border-[#8C6239]/20",
        title: "pt-6 text-[22px]",
      },
      html: `
        <div style="max-width:420px;margin:0 auto;padding:4px 8px 16px;">
          <div class="flex flex-col gap-4 text-left font-sans text-gray-700">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs text-gray-500 mb-1">ราคาต่ำสุด</label>
                <input
                  id="price-min-input"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="0"
                  class="swal2-input"
                  style="width:100%;margin:0;"
                  value="${filters.minPrice || ""}"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">ราคาสูงสุด</label>
                <input
                  id="price-max-input"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="ไม่จำกัด"
                  class="swal2-input"
                  style="width:100%;margin:0;"
                  value="${filters.maxPrice || ""}"
                />
              </div>
            </div>

            <div class="mt-2">
              <p class="text-xs text-gray-500 mb-2">ทางลัดราคา:</p>
              <div class="flex flex-wrap gap-2" id="price-shortcuts">
                ${shortcuts
                  .map(
                    (s) => `
                    <button
                      type="button"
                      class="px-3 py-1.5 text-xs rounded-full border border-gray-200 bg-gray-50 hover:bg-[#8C6239]/10 hover:border-[#8C6239] transition-colors"
                      data-price-shortcut="1"
                      data-min="${s.min}"
                      data-max="${s.max}"
                    >
                      ${s.label}
                    </button>`
                  )
                  .join("")}
              </div>
            </div>

            <p class="text-[11px] text-gray-400 mt-1">
              สามารถเว้นว่างเพื่อไม่จำกัดราคาได้
            </p>
          </div>
        </div>
      `,
      didOpen: (popup) => {
        const minInput = popup.querySelector("#price-min-input");
        const maxInput = popup.querySelector("#price-max-input");

        popup.querySelectorAll("[data-price-shortcut]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const min = btn.getAttribute("data-min");
            const max = btn.getAttribute("data-max");
            minInput.value = min === "" ? "" : Number(min);
            maxInput.value = max === "" ? "" : Number(max);
          });
        });
      },
      preConfirm: () => {
        const minRaw = document.getElementById("price-min-input").value?.trim();
        const maxRaw = document.getElementById("price-max-input").value?.trim();

        const min = normalizePriceValue(minRaw);
        const max = normalizePriceValue(maxRaw);

        if (min === null || max === null) {
          Swal.showValidationMessage("กรุณากรอกราคาให้ถูกต้อง");
          return false;
        }

        if (min !== "" && max !== "" && Number(min) > Number(max)) {
          Swal.showValidationMessage("ราคาสูงสุดต้องมากกว่าราคาต่ำสุด");
          return false;
        }

        return {
          minPrice: min,
          maxPrice: max,
        };
      },
    });

    if (isConfirmed && value) {
      const normalized = {
        minPrice: value.minPrice === "" ? "" : value.minPrice,
        maxPrice: value.maxPrice === "" ? "" : value.maxPrice,
      };

      setFilters((prev) => ({
        ...prev,
        ...normalized,
      }));

      goFilter(normalized);
    }
  };

  const handleBedroom = async () => {
    const { value, isConfirmed } = await Swal.fire({
      title: "จำนวนห้องนอน",
      input: "number",
      inputValue: filters.bedroomCount || "",
      inputPlaceholder: "เช่น 2",
      confirmButtonText: "ตกลง",
      showCancelButton: true,
      confirmButtonColor: "#8C6239",
      cancelButtonColor: "#aaa",
    });

    if (isConfirmed && value !== undefined && value !== null && value !== "") {
      setFilters((prev) => ({ ...prev, bedroomCount: value }));
      goFilter({ bedroomCount: value });
    }
  };

  const priceLabel = formatPriceLabel(filters.minPrice, filters.maxPrice);

  const filterButtons = [
    { icon: <FaFilter />, label: "ตัวกรองทั้งหมด", action: handleAllFilter },
    {
      icon: <FaBuilding />,
      label: filters.type || "ประเภทอสังหาฯ",
      action: handlePropertyType,
    },
    {
      icon: <FaMoneyBillWave />,
      label: priceLabel,
      action: handlePrice,
    },
    {
      icon: <FaBed />,
      label:
        filters.bedroomCount && Number(filters.bedroomCount) > 0
          ? `${filters.bedroomCount} ห้องนอน`
          : "จำนวนห้องนอน",
      action: handleBedroom,
    },
  ];

  return (
    <div className="w-full">
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row sm:items-center w-full max-w-full bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden gap-2 sm:gap-0 p-2 sm:p-0"
      >
        <div className="flex-1 flex items-center">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="ค้นหาทำเล หรือชื่อโครงการ..."
            className="input input-ghost w-full h-11 sm:h-[60px] px-3 sm:px-4 focus:outline-none text-gray-700"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2 px-1 sm:px-0">
          <select
            value={saleType}
            onChange={(e) => setSaleType(e.target.value)}
            className="select select-bordered rounded-xl text-sm h-10 sm:h-[44px] border-gray-300 w-full sm:w-auto"
          >
            <option value="">ทั้งหมด</option>
            <option value="ขาย">ขาย</option>
            <option value="เช่า">เช่า</option>
          </select>

          <button
            type="submit"
            className="btn bg-[#8C6239] border-none rounded-xl text-white font-medium px-5 sm:px-6 h-10 sm:h-[44px] hover:bg-[#704c2c] w-full sm:w-auto mr-2"
          >
            ค้นหา
          </button>
        </div>
      </form>

      <div className="flex flex-wrap justify-start gap-2 sm:gap-3 mt-4 sm:mt-6">
        {filterButtons.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={item.action}
            className="btn flex items-center gap-2 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-medium shadow-sm transition min-w-[120px] bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            <span className="text-sm sm:text-base">{item.icon}</span>
            <span className="whitespace-nowrap truncate max-w-[120px] sm:max-w-none">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}