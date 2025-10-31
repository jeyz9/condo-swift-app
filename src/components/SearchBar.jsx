import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { FaSlidersH } from "react-icons/fa";

const propertyTypes = ["คอนโด", "บ้านเดี่ยว", "ทาวน์โฮม", "ที่ดิน"];
const provinces = [
  "กรุงเทพมหานคร",
  "นนทบุรี",
  "ปทุมธานี",
  "สมุทรปราการ",
  "เชียงใหม่",
  "ขอนแก่น",
  "ภูเก็ต",
  "ชลบุรี",
  "ระยอง",
  "สงขลา",
];

export default function SearchBarWithFilter({ selectedType = "" }) {
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    province: "",
    saleType: selectedType || "",
    bedroomCount: 0,
    minPrice: 0,
    maxPrice: 10000000,
  });

  const navigate = useNavigate();

  // ✅ sync saleType จากหน้า Home (ขาย / เช่า)
  useEffect(() => {
    setFilters((prev) => {
      const next = selectedType || "";
      if ((prev.saleType || "") === next) {
        return prev;
      }
      return { ...prev, saleType: next };
    });
  }, [selectedType]);
  // ✅ ฟังก์ชันค้นหา (ทำงานได้แม้ไม่มี filter)
  const handleSearch = () => {
    const f = filters;
    const currentSaleType = f.saleType || selectedType || "";

    const params = {
      keyword: searchText?.trim() || "",
      type: f.type || "",
      province: f.province || "",
      bedroomCount: f.bedroomCount > 0 ? f.bedroomCount : undefined,
      minPrice: f.minPrice > 0 ? f.minPrice : undefined,
      maxPrice: f.maxPrice > 0 && f.maxPrice < 10000000 ? f.maxPrice : undefined,
      page: 0,
      size: 10,
    };

    if (currentSaleType) {
      params.saleType = currentSaleType;
    }

    const queryParams = Object.entries(params)
      .filter(([key, value]) => {
        if (value === undefined || value === null) return false;
        if (typeof value === "string" && value === "") return false;
        if (key === "bedroomCount" && value === 0) return false;
        return true;
      })
      .map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(v))
      .join("&");

    navigate("/filter?" + queryParams);
  };

  // ✅ Popup ตัวกรอง
  const openFilterPopup = async () => {
    await Swal.fire({
      title: "ตัวกรองการค้นหา",
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
        confirmButton: "px-6 py-2 rounded-full text-sm",
        cancelButton: "px-6 py-2 rounded-full text-sm",
      },
      html: `
        <div class="p-6 space-y-6 font-sans text-gray-700">
          <div>
            <label class="block font-semibold text-[#8C6239] mb-1 text-sm">ประเภททรัพย์</label>
            <select id="filter-type" class="w-full border border-[#d0bfa8] rounded-xl p-2.5 text-sm">
              <option value="">ทั้งหมด</option>
              ${propertyTypes
                .map(
                  (t) =>
                    `<option value="${t}" ${
                      filters.type === t ? "selected" : ""
                    }>${t}</option>`
                )
                .join("")}
            </select>
          </div>

          <div>
            <label class="block font-semibold text-[#8C6239] mb-1 text-sm">จังหวัดยอดนิยม</label>
            <select id="filter-province" class="w-full border border-[#d0bfa8] rounded-xl p-2.5 text-sm">
              <option value="">ทั้งหมด</option>
              ${provinces
                .map(
                  (p) =>
                    `<option value="${p}" ${
                      filters.province === p ? "selected" : ""
                    }>${p}</option>`
                )
                .join("")}
            </select>
          </div>

          <div>
            <label class="block font-semibold text-[#8C6239] mb-2 text-sm">จำนวนห้องนอน</label>
            <div class="grid grid-cols-5 gap-2">
              ${[1, 2, 3, 4, 5]
                .map(
                  (n) => `
                  <button type="button"
                    class="bedroom-btn border rounded-lg py-1.5 text-sm ${
                      filters.bedroomCount === n
                        ? "active-bedroom bg-[#8C6239] text-white border-[#8C6239]"
                        : "border-gray-300 hover:bg-[#f4f1ed]"
                    }"
                    data-value="${n}"
                  >${n} ห้อง</button>`
                )
                .join("")}
            </div>
          </div>

          <div>
            <label class="block font-semibold text-[#8C6239] mb-2 text-sm">ช่วงราคา (บาท)</label>
            <div class="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label class="text-xs text-gray-600">ต่ำสุด</label>
                <input id="price-min-input" type="number" min="0" max="10000000" step="10000"
                  value="${filters.minPrice}" class="border border-gray-300 rounded-md p-1.5 text-sm w-full" />
              </div>
              <div>
                <label class="text-xs text-gray-600">สูงสุด</label>
                <input id="price-max-input" type="number" min="0" max="10000000" step="10000"
                  value="${filters.maxPrice}" class="border border-gray-300 rounded-md p-1.5 text-sm w-full" />
              </div>
            </div>
          </div>
        </div>
      `,
      preConfirm: () => {
        const typeEl = document.getElementById("filter-type");
        const provEl = document.getElementById("filter-province");
        const selectedBedroom = document.querySelector(".active-bedroom");
        const minEl = document.getElementById("price-min-input");
        const maxEl = document.getElementById("price-max-input");

        return {
          type: typeEl?.value || "",
          province: provEl?.value || "",
          saleType: filters.saleType || selectedType || "",
          bedroomCount: selectedBedroom
            ? Number(selectedBedroom.dataset.value)
            : 0,
          minPrice: Number(minEl?.value || 0),
          maxPrice: Number(maxEl?.value || 10000000),
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setFilters(result.value);
      }
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
      className="relative mx-auto flex w-full max-w-3xl items-center px-3"
    >
      <div className="relative w-full h-[60px]">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="พิมพ์ชื่อโครงการหรือจังหวัด"
          className="w-full rounded-xl bg-white/95 py-3 pl-12 pr-24 text-gray-700 shadow-sm focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#8C6239]/60"
        />
        <svg
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-4 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
          />
        </svg>

        <FaSlidersH
          onClick={openFilterPopup}
          className="text-[#8C6239] hover:text-[#704c29] absolute right-18 top-6 w-[44px] h-[44px] -translate-y-1/2 rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer transition"
        />

        <button
          type="submit"
          className="btn absolute right-2 top-1 bg-[#8C6239] text-white rounded-lg px-3 py-2 text-sm hover:bg-[#6f4f2e] transition"
        >
          ค้นหา
        </button>
      </div>
    </form>
  );
}
