import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import {
  FaFilter,
  FaBuilding,
  FaMoneyBillWave,
  FaBed,
  FaGem,
} from "react-icons/fa";

// Define THAI_PROVINCES
const THAI_PROVINCES = [
  "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร", "ขอนแก่น",
  "จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี", "ชัยนาท", "ชัยภูมิ", "ชุมพร",
  "เชียงราย", "เชียงใหม่", "ตรัง", "ตราด", "ตาก", "นครนายก",
  "นครปฐม", "นครพนม", "นครราชสีมา", "นครศรีธรรมราช", "นครสวรรค์", "นนทบุรี",
  "นราธิวาส", "น่าน", "บึงกาฬ", "บุรีรัมย์", "ปทุมธานี", "ประจวบคีรีขันธ์",
  "ปราจีนบุรี", "ปัตตานี", "พระนครศรีอยุธยา", "พะเยา", "พังงา", "พัทลุง",
  "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์", "แพร่", "ภูเก็ต",
  "มหาสารคาม", "มุกดาหาร", "แม่ฮ่องสอน", "ยโสธร", "ยะลา", "ร้อยเอ็ด",
  "ระนอง", "ระยอง", "ราชบุรี", "ลพบุรี", "เลย", "ศรีสะเกษ",
  "สกลนคร", "สงขลา", "สตูล", "สมุทรปราการ", "สมุทรสงคราม", "สมุทรสาคร",
  "สระแก้ว", "สระบุรี", "สิงห์บุรี", "สุโขทัย", "สุพรรณบุรี", "สุราษฎร์ธานี",
  "สุรินทร์", "หนองคาย", "หนองบัวลำภู", "อ่างทอง", "อำนาจเจริญ", "อุดรธานี",
  "อุตรดิตถ์", "อุทัยธานี", "อุบลราชธานี"
];

// Define BTS_MRT_LINES
const BTS_MRT_LINES = [
  "สายสุขุมวิท (BTS)", "สายสีลม (BTS)", "สายสีน้ำเงิน (MRT)", "สายสีม่วง (MRT)",
  "สายสีเหลือง (MRT)", "สายสีชมพู (MRT)", "สายสีแดง (SRT)", "Airport Rail Link"
];

export default function SearchBarNonFilter({
  defaultKeyword = "",
  defaultFilter = "",
  defaultSaleType = "",
  defaultSaleAbout = "",
  defaultStation = "", // Add defaultStation prop
  defaultProvince = "", // Add defaultProvince prop
  defaultBadge = "", // Add defaultBadge prop
  onSearch,
}) {
  const [searchText, setSearchText] = useState(defaultKeyword);
  const [saleType, setSaleType] = useState(
    defaultSaleType || defaultSaleAbout || ""
  );
  const [filters, setFilters] = useState({
    type: defaultFilter || "",
    bedroomCount: "",
    minPrice: "",
    maxPrice: "",
    isPremium: false,
    station: defaultStation || "", // Initialize station state
    province: defaultProvince || "", // Initialize province state
    badge: defaultBadge || "", // Initialize badge state
  });

  const navigate = useNavigate();

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
    }));
  }, [defaultFilter]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      station: defaultStation || "",
    }));
  }, [defaultStation]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      province: defaultProvince || "",
    }));
  }, [defaultProvince]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      badge: defaultBadge || "",
    }));
  }, [defaultBadge]);

  // ✅ รวม filter → สร้าง query แล้วไปหน้า /filter
  const goFilter = (overrides = {}) => {
    const merged = {
      keyword: (overrides.keyword ?? searchText)?.trim(),
      type: overrides.type ?? filters.type,
      saleType: overrides.saleType ?? saleType,
      bedroomCount: overrides.bedroomCount ?? filters.bedroomCount,
      minPrice: overrides.minPrice ?? filters.minPrice,
      maxPrice: overrides.maxPrice ?? filters.maxPrice,
      isPremium:
        overrides.isPremium !== undefined
          ? overrides.isPremium
          : filters.isPremium, // ⬅ ให้ priority จาก overrides
      station: overrides.station ?? filters.station, // Add station to merged
      province: overrides.province ?? filters.province, // Add province to merged
      badge: overrides.badge ?? filters.badge, // Add badge to merged
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
      badge: merged.badge || undefined, // Use merged.badge directly
      station: merged.station || undefined, // Add station to params
      province: merged.province || undefined, // Add province to params
      page: merged.page,
      size: merged.size,
    };

    const cleaned = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );

    if (onSearch) {
      onSearch(cleaned);
    }

    const query = Object.entries(cleaned)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");

    // ลองเปิดดูใน Network tab จะเห็น ?badge=พรีเมียม เพิ่มมา
    navigate(`/filter?${query}`);
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
      confirmButtonText: "ใช้ตัวกรอง",
      cancelButtonText: "ยกเลิก",
      showCancelButton: true,
      customClass: {
        popup:
          "rounded-3xl p-0 overflow-hidden shadow-2xl border border-[#8C6239]/30",
      },
      html: `
        <div class="p-6 space-y-6 font-sans text-gray-700 text-left">
          <div>
            <label class="block font-semibold text-[#8C6239] mb-1 text-sm">ประเภทอสังหาฯ</label>
            <select id="filter-type" class="w-full border border-[#d0bfa8] rounded-xl p-2.5 text-sm">
              <option value="">ทั้งหมด</option>
              <option value="คอนโด" ${filters.type === "คอนโด" ? "selected" : ""}>คอนโด</option>
              <option value="บ้านหรู" ${filters.type === "บ้านหรู" ? "selected" : ""}>บ้านหรู</option>
              <option value="วิลล่า" ${filters.type === "วิลล่า" ? "selected" : ""}>วิลล่า</option>
              <option value="ที่ดิน" ${filters.type === "ที่ดิน" ? "selected" : ""}>ที่ดิน</option>
            </select>
          </div>

          <div>
            <label class="block font-semibold text-[#8C6239] mb-1 text-sm">สถานี (BTS/MRT)</label>
            <select id="filter-station" class="w-full border border-[#d0bfa8] rounded-xl p-2.5 text-sm">
              <option value="">ทั้งหมด</option>
              ${BTS_MRT_LINES.map(
                (line) =>
                  `<option value="${line}" ${
                    filters.station === line ? "selected" : ""
                  }>${line}</option>`
              ).join("")}
            </select>
          </div>

          <div>
            <label class="block font-semibold text-[#8C6239] mb-1 text-sm">จังหวัด</label>
            <select id="filter-province" class="w-full border border-[#d0bfa8] rounded-xl p-2.5 text-sm">
              <option value="">ทั้งหมด</option>
              ${THAI_PROVINCES.map(
                (province) =>
                  `<option value="${province}" ${
                    filters.province === province ? "selected" : ""
                  }>${province}</option>`
              ).join("")}
            </select>
          </div>

          <div>
            <label class="block font-semibold text-[#8C6239] mb-2 text-sm">จำนวนห้องนอน</label>
            <input id="bedroomCount" type="number" min="0" placeholder="เช่น 2" value="${
              filters.bedroomCount || ""
            }" class="w-full border border-[#d0bfa8] rounded-xl p-2.5 text-sm"/>
          </div>

          <div>
            <label class="block font-semibold text-[#8C6239] mb-2 text-sm">ช่วงราคา (บาท)</label>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs text-gray-600">ต่ำสุด</label>
                <input id="minPrice" type="number" min="0" step="1000" placeholder="0" value="${
                  filters.minPrice || ""
                }" class="w-full border border-gray-300 rounded-md p-1.5 text-sm" />
              </div>
              <div>
                <label class="text-xs text-gray-600">สูงสุด</label>
                <input id="maxPrice" type="number" min="0" step="1000" placeholder="ไม่จำกัด" value="${
                  filters.maxPrice || ""
                }" class="w-full border border-gray-300 rounded-md p-1.5 text-sm" />
              </div>
            </div>
            <p class="mt-1 text-[11px] text-gray-500">เว้นว่าง = ไม่จำกัด</p>
                    </div>
          
                    <div>
                      <label class="block font-semibold text-[#8C6239] mb-1 text-sm">ป้ายประกาศ</label>
                      <select id="filter-badge" class="w-full border border-[#d0bfa8] rounded-xl p-2.5 text-sm">
                        <option value="">ทั้งหมด</option>
                        <option value="มาใหม่" ${filters.badge === "มาใหม่" ? "selected" : ""}>มาใหม่</option>
                        <option value="พรีเมียม" ${filters.badge === "พรีเมียม" ? "selected" : ""}>พรีเมียม</option>
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
                  const min = normalizePriceValue(
                    document.getElementById("minPrice").value
                  );
                  const max = normalizePriceValue(
                    document.getElementById("maxPrice").value
                  );
          
                  if (min === null || max === null) {
                    Swal.showValidationMessage("กรุณากรอกราคาเป็นตัวเลขที่ถูกต้อง");
                    return false;
                  }
          
                  if (min !== "" && max !== "" && Number(min) > Number(max)) {
                    Swal.showValidationMessage("ราคาต่ำสุดต้องไม่มากกว่าราคาสูงสุด");
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
              const { value, isConfirmed } = await Swal.fire({
                title: "เลือกประเภทอสังหาฯ",
                input: "select",
                inputOptions: {
                  คอนโด: "คอนโด",
                  บ้านหรู: "บ้าน",
                  วิลล่า: "วิลล่า",
                  ที่ดิน: "ที่ดิน",
                },
                inputPlaceholder: "ทั้งหมด",
                confirmButtonText: "ตกลง",
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
      title: "กำหนดช่วงราคา (บาท)",
      width: 520,
      background: "#fff",
      confirmButtonColor: "#8C6239",
      cancelButtonColor: "#aaa",
      confirmButtonText: "ยืนยัน",
      showCancelButton: true,
      customClass: {
        popup:
          "rounded-3xl p-0 overflow-hidden shadow-2xl border border-[#8C6239]/20",
        title: "pt-6 text-[22px]",
      },
      html: `
        <div style="max-width:420px;margin:0 auto;padding:4px 8px 16px;">
          <div class="flex flex-col gap-4 text-left font-sans text-gray-700">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs text-gray-500 mb-1">ราคาขั้นต่ำ</label>
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
              <p class="text-xs text-gray-500 mb-2">ตัวเลือกด่วน:</p>
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
              กรอกตัวเลขโดยไม่ต้องใส่ลูกน้ำ เช่น <span class="font-semibold text-gray-500">1500000</span>
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
          Swal.showValidationMessage("กรุณากรอกราคาเป็นตัวเลขที่ถูกต้อง");
          return false;
        }

        if (min !== "" && max !== "" && Number(min) > Number(max)) {
          Swal.showValidationMessage("ราคาต่ำสุดต้องไม่มากกว่าราคาสูงสุด");
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

  // ✅ ปุ่ม Premium / พิเศษสำหรับคุณ
  // const handlePremiumClick = () => {
  //   const newVal = !filters.isPremium;
  //   setFilters((prev) => ({ ...prev, isPremium: newVal }));
  //   // ⬅ ตรงนี้สำคัญ: ส่ง isPremium เข้าไปตรง ๆ → goFilter จะ map เป็น badge=พรีเมียม ให้
  //   goFilter({ isPremium: newVal });
  // };

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
          : "ห้องนอน",
      action: handleBedroom,
    },
    // {
    //   icon: <FaGem className="text-yellow-500" />,
    //   label: filters.isPremium ? "เฉพาะ Premium ✓" : "พิเศษสำหรับคุณ",
    //   action: handlePremiumClick,
    //   isPremiumButton: true,
    // },
  ];

  return (
    <div className="w-full">
      {/* 🔍 ช่องค้นหา */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row sm:items-center w-full max-w-full bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden gap-2 sm:gap-0 p-2 sm:p-0"
      >
        <div className="flex-1 flex items-center">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="ค้นหาคอนโด บ้าน หรือพื้นที่..."
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
            className="btn bg-[#8C6239] border-none rounded-xl text-white font-medium px-5 sm:px-6 h-10 sm:h-[44px] hover:bg-[#704c2c] w-full sm:w-auto"
          >
            ค้นหา
          </button>
        </div>
      </form>

      {/* 🔘 ปุ่มฟิลเตอร์เพิ่มเติม */}
      <div className="flex flex-wrap justify-start gap-2 sm:gap-3 mt-4 sm:mt-6">
        {filterButtons.map((item, i) => {
          const isPremiumBtn = item.isPremiumButton === true;
          const activePremium = isPremiumBtn && filters.isPremium;

          return (
            <button
              key={i}
              type="button"
              onClick={item.action}
              className={`btn flex items-center gap-2 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-medium shadow-sm transition min-w-[120px]
                ${
                  activePremium
                    ? "bg-[#fef3c7] border border-[#d97706] text-[#8C6239]"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
            >
              <span className="text-sm sm:text-base">{item.icon}</span>
              <span className="whitespace-nowrap truncate max-w-[120px] sm:max-w-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
