import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { FaSlidersH, FaFilter, FaBuilding, FaMoneyBillWave, FaBed, FaGem } from "react-icons/fa";

const SearchBarNonFilter = ({
  defaultKeyword = "",
  defaultFilter = "ทั้งหมด",
  defaultSaleType = "", // ✅ เพิ่ม prop นี้
  onSearch,
}) => {
  const [searchText, setSearchText] = useState(defaultKeyword);
  const [saleType, setSaleType] = useState(defaultSaleType || ""); // ✅ เก็บค่า saleType ภายใน component
  const navigate = useNavigate();

  useEffect(() => {
    setSearchText(defaultKeyword || "");
  }, [defaultKeyword]);

  // ✅ เมื่อค่า defaultSaleType เปลี่ยน (เช่น จากหน้า Home)
  useEffect(() => {
    setSaleType(defaultSaleType || "");
  }, [defaultSaleType]);

  const handleSubmit = (e) => {
    e?.preventDefault?.();

    // ✅ รวมค่าทุกฟิลด์ (รวม saleType)
    const params = {
      keyword: searchText || "",
      filter: defaultFilter || "ทั้งหมด",
      saleType: saleType || "", // ✅ เพิ่มตรงนี้
      page: 0,
      size: 10,
    };

    if (onSearch) {
      onSearch({ ...params, type: params.filter });
    } else {
      // ✅ สร้าง query จาก params ที่มีค่าเท่านั้น
      const queryObj = {};
      Object.entries(params).forEach(([k, v]) => {
        if (v !== "" && v !== null && v !== undefined) queryObj[k] = v;
      });
      const query = new URLSearchParams(queryObj).toString();
      navigate(`/filter?${query}`, { replace: true });

    }
  };

  const filters = [
    { icon: <FaFilter />, label: "ตัวกรอง" },
    { icon: <FaBuilding />, label: "ประเภทอสังหาฯ" },
    { icon: <FaMoneyBillWave />, label: "ราคา" },
    { icon: <FaBed />, label: "ห้องนอน" },
    { icon: <FaGem className="text-yellow-500" />, label: "พิเศษสำหรับคุณ" },
  ];

  return (
    <>
      {/* 🔍 ช่องค้นหา */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center h-[60px] w-full max-w-full bg-base-100 rounded-md shadow-lg"
      >
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="ค้นหา..."
          className="input input-ghost w-full focus:outline-none rounded-l-full"
        />

        {/* ✅ Dropdown เลือกประเภทการขาย/เช่า */}
        <select
          value={saleType}
          onChange={(e) => setSaleType(e.target.value)}
          className="mx-2 select select-bordered rounded-lg text-sm h-[44px]"
        >
          <option value="">ทั้งหมด</option>
          <option value="ขาย">ขาย</option>
          <option value="เช่า">เช่า</option>
        </select>

        <button
          type="submit"
          className="mr-2 btn bg-[#8C6239] border-none btn-circle text-white font-light w-15 h-12"
        >
          ค้นหา
        </button>
      </form>

      {/* 🔘 ปุ่มฟิลเตอร์อื่น ๆ */}
      <div className="flex flex-wrap justify-start gap-4 mt-10">
        {filters.map((item, index) => (
          <button
            key={index}
            className="btn hover:bg-gray-200 flex items-center gap-2 border border-gray-400 rounded-full 
                       px-5 py-2 text-sm sm:text-base text-gray-700 font-medium 
                       transition duration-200 active:scale-95"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default SearchBarNonFilter;
