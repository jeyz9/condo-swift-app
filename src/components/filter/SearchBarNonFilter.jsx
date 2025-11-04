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

export default function SearchBarNonFilter({
  defaultKeyword = "",
  defaultFilter = "",
  defaultSaleType = "",
  defaultSaleAbout = "",
  onSearch,
}) {
  const [searchText, setSearchText] = useState(defaultKeyword);
  const [saleType, setSaleType] = useState(defaultSaleType || defaultSaleAbout || "");
  const [filters, setFilters] = useState({
    type: defaultFilter || "",
    bedroomCount: "",
    minPrice: "",
    maxPrice: "",
    isPremium: false,
  });

  const navigate = useNavigate();

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

  // ✅ รวมและไปหน้า filter
  const goFilter = (overrides = {}) => {
    const merged = {
      keyword: searchText.trim(),
      saleType,
      ...filters,
      ...overrides,
    };

    const cleaned = Object.fromEntries(
      Object.entries(merged).filter(([_, value]) => {
        if (value === null || value === undefined) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        return true;
      })
    );

    if (onSearch) {
      onSearch(cleaned);
      return;
    }

    const query = Object.entries(cleaned)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");

    navigate(`/filter?${query}`);
  };

  const handleSearch = (e) => {
    e?.preventDefault?.();
    goFilter({
      page: 0,
      size: 10,
    });
  };

  /* ✅ Popup ตัวกรองทั้งหมด */
  const handleAllFilter = async () => {
    await Swal.fire({
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
              <option value="คอนโด">คอนโด</option>
              <option value="บ้านหรู">บ้านหรู</option>
              <option value="วิลล่า">วิลล่า</option>
              <option value="ที่ดิน">ที่ดิน</option>
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
                <input id="minPrice" type="number" min="0" step="1000" value="${
                  filters.minPrice || ""
                }" class="w-full border border-gray-300 rounded-md p-1.5 text-sm" />
              </div>
              <div>
                <label class="text-xs text-gray-600">สูงสุด</label>
                <input id="maxPrice" type="number" min="0" step="1000" value="${
                  filters.maxPrice || ""
                }" class="w-full border border-gray-300 rounded-md p-1.5 text-sm" />
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 mt-2">
            <input id="premiumCheck" type="checkbox" ${
              filters.isPremium ? "checked" : ""
            } class="accent-[#8C6239]" />
            <label for="premiumCheck" class="text-sm text-[#8C6239] font-semibold">เฉพาะ Premium</label>
          </div>
        </div>
      `,
      preConfirm: () => {
        const type = document.getElementById("filter-type").value;
        const bedroom = document.getElementById("bedroomCount").value;
        const min = document.getElementById("minPrice").value;
        const max = document.getElementById("maxPrice").value;
        const premium = document.getElementById("premiumCheck").checked;

        return {
          type,
          bedroomCount: bedroom,
          minPrice: min,
          maxPrice: max,
          isPremium: premium,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setFilters(result.value);
        goFilter(result.value);
      }
    });
  };

  /* ✅ ฟิลเตอร์แยก */
  const handlePropertyType = async () => {
    const { value } = await Swal.fire({
      title: "เลือกประเภทอสังหาฯ",
      input: "select",
      inputOptions: {
        "คอนโด": "คอนโด",
        "บ้านหรู": "บ้านหรู",
        "วิลล่า": "วิลล่า",
        "ที่ดิน": "ที่ดิน",
      },
      inputPlaceholder: "ทั้งหมด",
      confirmButtonText: "ตกลง",
      showCancelButton: true,
      confirmButtonColor: "#8C6239",
      cancelButtonColor: "#aaa",
    });
    if (value) {
      setFilters((prev) => ({ ...prev, type: value }));
      goFilter({ type: value });
    }
  };

  const handlePrice = async () => {
    const { value } = await Swal.fire({
      title: "ช่วงราคา (บาท)",
      html: `
        <div class="flex flex-col gap-3">
          <input id="minPrice" type="number" placeholder="ต่ำสุด" class="swal2-input" style="width:100%">
          <input id="maxPrice" type="number" placeholder="สูงสุด" class="swal2-input" style="width:100%">
        </div>
      `,
      confirmButtonText: "ตกลง",
      showCancelButton: true,
      confirmButtonColor: "#8C6239",
      cancelButtonColor: "#aaa",
      preConfirm: () => {
        const min = document.getElementById("minPrice").value;
        const max = document.getElementById("maxPrice").value;
        return { minPrice: min, maxPrice: max };
      },
    });

    if (value) {
      setFilters((prev) => ({
        ...prev,
        minPrice: value.minPrice,
        maxPrice: value.maxPrice,
      }));
      goFilter(value);
    }
  };

  const handleBedroom = async () => {
    const { value } = await Swal.fire({
      title: "จำนวนห้องนอน",
      input: "number",
      inputPlaceholder: "เช่น 2",
      confirmButtonText: "ตกลง",
      showCancelButton: true,
      confirmButtonColor: "#8C6239",
      cancelButtonColor: "#aaa",
    });
    if (value) {
      setFilters((prev) => ({ ...prev, bedroomCount: value }));
      goFilter({ bedroomCount: value });
    }
  };

  const handlePremiumClick = () => {
    const newVal = !filters.isPremium;
    setFilters((prev) => ({ ...prev, isPremium: newVal }));
    if (newVal) goFilter({ badge: "Premium" });
    else navigate("/filter");
  };

  const filterButtons = [
    { icon: <FaFilter />, label: "ตัวกรองทั้งหมด", action: handleAllFilter },
    {
      icon: <FaBuilding />,
      label: filters.type || "ประเภทอสังหาฯ",
      action: handlePropertyType,
    },
    {
      icon: <FaMoneyBillWave />,
      label:
        filters.minPrice || filters.maxPrice
          ? `฿${filters.minPrice || 0} - ฿${filters.maxPrice || "∞"}`
          : "ราคา",
      action: handlePrice,
    },
    {
      icon: <FaBed />,
      label:
        filters.bedroomCount > 0
          ? `${filters.bedroomCount} ห้องนอน`
          : "ห้องนอน",
      action: handleBedroom,
    },
    {
      icon: <FaGem className="text-yellow-500" />,
      label: filters.isPremium ? "เฉพาะ Premium ✓" : "พิเศษสำหรับคุณ",
      action: handlePremiumClick,
    },
  ];

  return (
    <div className="w-full">
      {/* 🔍 ช่องค้นหา */}
      <form
        onSubmit={handleSearch}
        className="flex items-center h-[60px] w-full max-w-full bg-white rounded-full shadow-md border border-gray-200 overflow-hidden"
      >
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="ค้นหาคอนโด บ้าน หรือพื้นที่..."
          className="input input-ghost flex-1 h-full px-4 focus:outline-none text-gray-700"
        />
        <select
          value={saleType}
          onChange={(e) => setSaleType(e.target.value)}
          className="mx-2 select select-bordered rounded-lg text-sm h-[44px] border-gray-300"
        >
          <option value="">ทั้งหมด</option>
          <option value="ขาย">ขาย</option>
          <option value="เช่า">เช่า</option>
        </select>
        <button
          type="submit"
          className="mr-3 btn bg-[#8C6239] border-none rounded-full text-white font-medium px-6 h-[44px] hover:bg-[#704c2c]"
        >
          ค้นหา
        </button>
      </form>

      {/* 🔘 ปุ่มฟิลเตอร์เพิ่มเติม */}
      <div className="flex flex-wrap justify-start gap-4 mt-8">
        {filterButtons.map((item, i) => (
          <button
            key={i}
            onClick={item.action}
            className={`btn flex items-center gap-2 border rounded-full px-5 py-2 text-sm sm:text-base font-medium shadow-sm transition 
                        ${
                          item.label.includes("Premium")
                            ? "bg-[#fef7e6] border-[#d4a100] text-[#8C6239]"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                        }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
