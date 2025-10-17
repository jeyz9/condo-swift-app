import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function SearchBarWithFilter({ selectedType = "" }) {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const provinces = [
    "กรุงเทพมหานคร",
    "เชียงใหม่",
    "ภูเก็ต",
    "ขอนแก่น",
    "ชลบุรี",
    "นนทบุรี",
    "ปทุมธานี",
    "นครราชสีมา",
    "สงขลา",
    "นครปฐม",
  ];

  const types = ["คอนโด", "บ้านหรู", "ที่ดิน", "วิลล่า"];

  const handleSearch = (e) => {
    e.preventDefault();

    const params = { keyword: searchText };

    // ถ้ามีค่า selectedType จากหน้าหลัก ให้ใช้ก่อน
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
      className="w-full max-w-3xl mx-auto flex flex-col sm:flex-row items-stretch gap-3 p-3 bg-white rounded-2xl shadow-md"
    >
      {/* Dropdown Filter */}
      <div className="dropdown dropdown-hover">
        <label
          tabIndex={0}
          className="btn bg-[#8C6239] text-white font-light border-none w-full sm:w-40 rounded-lg"
        >
          {selectedFilter || "เลือกตัวกรอง"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow-lg z-10"
        >
          <li className="menu-title text-gray-500 text-xs">ประเภทอสังหา</li>
          {types.map((type) => (
            <li key={type}>
              <button
                type="button"
                onClick={() => setSelectedFilter(type)}
                className="text-gray-800 hover:bg-gray-100 text-sm"
              >
                {type}
              </button>
            </li>
          ))}

          <div className="divider my-1"></div>
          <li className="menu-title text-gray-500 text-xs">จังหวัด</li>
          {provinces.map((p) => (
            <li key={p}>
              <button
                type="button"
                onClick={() => setSelectedFilter(p)}
                className="text-gray-800 hover:bg-gray-100 text-sm"
              >
                {p}
              </button>
            </li>
          ))}

          <div className="divider my-1"></div>
          <li>
            <button
              type="button"
              onClick={() => setSelectedFilter("")}
              className="text-gray-800 hover:bg-gray-100 text-sm font-semibold"
            >
              ล้างตัวกรอง
            </button>
          </li>
        </ul>
      </div>

      {/* ช่องค้นหา */}
      <div className="relative flex-grow">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="พิมพ์ชื่อโครงการหรือจังหวัด เช่น คอนโดสุขุมวิท, เชียงใหม่..."
          className="input input-bordered w-full rounded-lg pl-10"
        />
        <svg
          className="w-5 h-5 text-gray-400 absolute left-3 top-3"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
        </svg>
      </div>

      {/* ปุ่มค้นหา */}
      <button
        type="submit"
        className="btn bg-[#8C6239] hover:bg-[#6f4f2e] text-white border-none rounded-lg w-full sm:w-32"
      >
        ค้นหา
      </button>
    </form>
  );
}
