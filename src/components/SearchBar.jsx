import React, { useState } from "react";
import { useNavigate } from "react-router";

const propertyTypes = ["คอนโดมิเนียม", "บ้านเดี่ยว", "ทาวน์โฮม", "โฮมออฟฟิศ"];
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
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    const params = { keyword: searchText };

    if (selectedType && String(selectedType).trim() !== "") {
      params.type = selectedType;
    } else if (selectedFilter && String(selectedFilter).trim() !== "") {
      params.type = selectedFilter;
    }

    const queryParams = new URLSearchParams(params).toString();
    navigate(`/filter?${queryParams}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="mx-auto flex w-full max-w-3xl flex-col items-stretch gap-3 px-3 sm:flex-row sm:items-center"
    >
      <div className="dropdown dropdown-hover">
        <label
          tabIndex={0}
          className="btn w-full rounded-lg border-none bg-[#8C6239] font-light text-white sm:w-40"
        >
          {selectedFilter || "ตัวกรอง"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu z-10 w-52 rounded-box bg-base-100 p-2 shadow-lg"
        >
          <li className="menu-title text-xs text-gray-500">ประเภททรัพย์</li>
          {propertyTypes.map((type) => (
            <li key={type}>
              <button
                type="button"
                onClick={() => setSelectedFilter(type)}
                className="text-sm text-gray-800 hover:bg-gray-100"
              >
                {type}
              </button>
            </li>
          ))}

          <div className="divider my-1" />
          <li className="menu-title text-xs text-gray-500">จังหวัดยอดนิยม</li>
          {provinces.map((p) => (
            <li key={p}>
              <button
                type="button"
                onClick={() => setSelectedFilter(p)}
                className="text-sm text-gray-800 hover:bg-gray-100"
              >
                {p}
              </button>
            </li>
          ))}

          <div className="divider my-1" />
          <li>
            <button
              type="button"
              onClick={() => setSelectedFilter("")}
              className="text-sm font-semibold text-gray-800 hover:bg-gray-100"
            >
              ล้างตัวกรอง
            </button>
          </li>
        </ul>
      </div>

      <div className="relative flex-grow">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="พิมพ์ชื่อโครงการหรือจังหวัด เช่น คอนโดสุขุมวิท, เชียงใหม่..."
          className="w-full rounded-xl bg-white/95 py-3 pl-12 pr-4 text-gray-700 shadow-sm transition focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#8C6239]/60 placeholder:text-gray-400"
        />
        <svg
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
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
      </div>

      <button
        type="submit"
        className="btn w-full rounded-lg border-none bg-[#8C6239] text-white hover:bg-[#6f4f2e] sm:w-32"
      >
        ค้นหา
      </button>
    </form>
  );
}
