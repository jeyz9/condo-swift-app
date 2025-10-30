import React, { useState } from "react";
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
    type: selectedType || "",
    province: "",
    bedroomCount: 0,
    minPrice: 0,
    maxPrice: 10000000,
  });
  const navigate = useNavigate();

  // ✅ ฟังก์ชันค้นหา
  const handleSearch = () => {
    const f = filters;
    const params = {
      keyword: searchText || "",
      type: f.type || "",
      bedroomCount: f.bedroomCount || "",
      page: 0,
      size: 10,
    };

    if (f.minPrice > 0) params.minPrice = f.minPrice;
    if (f.maxPrice < 10000000) params.maxPrice = f.maxPrice;

    console.log("📦 ส่ง payload:", params);
    const queryParams = new URLSearchParams(params).toString();
    navigate(`/filter?${queryParams}`);
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
          <!-- ประเภท -->
          <div>
            <label class="block font-semibold text-[#8C6239] mb-1 text-sm">ประเภททรัพย์</label>
            <select id="filter-type" class="w-full border border-[#d0bfa8] rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#8C6239] focus:outline-none">
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

          <!-- จังหวัด -->
          <div>
            <label class="block font-semibold text-[#8C6239] mb-1 text-sm">จังหวัดยอดนิยม</label>
            <select id="filter-province" class="w-full border border-[#d0bfa8] rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#8C6239] focus:outline-none">
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

          <!-- ห้องนอน -->
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

          <!-- ราคา -->
          <div>
            <label class="block font-semibold text-[#8C6239] mb-2 text-sm">ช่วงราคา (บาท)</label>
            <div class="grid grid-cols-2 gap-3 mb-3">
              <div class="flex flex-col text-xs text-gray-600">
                <label>ต่ำสุด</label>
                <input id="price-min-input" type="number" min="0" max="10000000" step="10000"
                  value="${filters.minPrice}" class="border border-gray-300 rounded-md p-1.5 text-sm w-full focus:ring-[#8C6239] focus:outline-none" />
              </div>
              <div class="flex flex-col text-xs text-gray-600">
                <label>สูงสุด</label>
                <input id="price-max-input" type="number" min="0" max="10000000" step="10000"
                  value="${filters.maxPrice}" class="border border-gray-300 rounded-md p-1.5 text-sm w-full focus:ring-[#8C6239] focus:outline-none" />
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <input id="price-min" type="range" min="0" max="10000000" step="50000"
                value="${filters.minPrice}" class="w-full accent-[#8C6239]" />
              <input id="price-max" type="range" min="0" max="10000000" step="50000"
                value="${filters.maxPrice}" class="w-full accent-[#8C6239]" />
            </div>

            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span id="price-min-label">${filters.minPrice.toLocaleString()}</span>
              <span id="price-max-label">${filters.maxPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      `,
      didOpen: () => {
        const minRange = document.getElementById("price-min");
        const maxRange = document.getElementById("price-max");
        const minInput = document.getElementById("price-min-input");
        const maxInput = document.getElementById("price-max-input");
        const minLabel = document.getElementById("price-min-label");
        const maxLabel = document.getElementById("price-max-label");

        const sync = () => {
          minLabel.textContent = Number(minInput.value).toLocaleString();
          maxLabel.textContent = Number(maxInput.value).toLocaleString();
        };

        const validate = () => {
          let min = Number(minInput.value);
          let max = Number(maxInput.value);
          if (min > max) {
            max = min;
            maxInput.value = max;
            maxRange.value = max;
          } else if (max < min) {
            min = max;
            minInput.value = min;
            minRange.value = min;
          }
          sync();
        };

        [minRange, minInput].forEach((el) =>
          el.addEventListener("input", (e) => {
            minRange.value = minInput.value = e.target.value;
            validate();
          })
        );
        [maxRange, maxInput].forEach((el) =>
          el.addEventListener("input", (e) => {
            maxRange.value = maxInput.value = e.target.value;
            validate();
          })
        );

        sync();

        // ✅ ปุ่มจำนวนห้อง
        document.querySelectorAll(".bedroom-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            document
              .querySelectorAll(".bedroom-btn")
              .forEach((b) =>
                b.classList.remove(
                  "active-bedroom",
                  "bg-[#8C6239]",
                  "text-white",
                  "border-[#8C6239]"
                )
              );
            btn.classList.add(
              "active-bedroom",
              "bg-[#8C6239]",
              "text-white",
              "border-[#8C6239]"
            );
          });
        });
      },
      preConfirm: () => {
        const minEl = document.getElementById("price-min-input");
        const maxEl = document.getElementById("price-max-input");
        const typeEl = document.getElementById("filter-type");
        const provEl = document.getElementById("filter-province");
        const selectedBedroom = document.querySelector(".active-bedroom");

        // ✅ เก็บข้อมูลเฉย ๆ ยังไม่ค้นหา
        return {
          type: typeEl?.value || "",
          province: provEl?.value || "",
          bedroomCount: selectedBedroom
            ? Number(selectedBedroom.dataset.value)
            : 0,
          minPrice: Number(minEl?.value || 0),
          maxPrice: Number(maxEl?.value || 10000000),
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // ✅ เมื่อกด “ใช้ตัวกรอง” ค่อยเซ็ต state แล้วค่อยค้นหา
        const newFilters = result.value;
        console.log("✅ ตัวกรองใหม่จาก popup:", newFilters);
        setFilters(newFilters);
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
      {/* ช่องค้นหา */}
      <div className="relative w-full h-[60px]">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="พิมพ์ชื่อโครงการหรือจังหวัด "
          className="w-full rounded-xl bg-white/95 py-3 pl-12 pr-24 text-gray-700 shadow-sm transition focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#8C6239]/60 placeholder:text-gray-400"
        />

        {/* ไอคอนค้นหา */}
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

        {/* ปุ่มตัวกรอง */}
          <FaSlidersH onClick={openFilterPopup} className="text-[#8C6239] hover:text-[#704c29] absolute right-18 top-6 w-[44px] h-[44px] -translate-y-1/2 rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer transition" />


        {/* ปุ่มค้นหา */}
        <button
          type="submit"
          className="btn absolute right-2 top-1  bg-[#8C6239] text-white rounded-lg px-3 py-2 text-sm hover:bg-[#6f4f2e] transition"
        >
          ค้นหา
        </button>
      </div>
    </form>
  );
}
