import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { FaSlidersH } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";
import { FaMoneyBillWave } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import { FaGem } from "react-icons/fa";
const SearchBarNonFilter = ({ defaultKeyword = "", defaultFilter = "ทั้งหมด", onSearch }) => {
  const [searchText, setSearchText] = useState(defaultKeyword);
  const navigate = useNavigate();

  useEffect(() => {
    setSearchText(defaultKeyword || "");
  }, [defaultKeyword]);

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    const params = { keyword: searchText || "", filter: defaultFilter || "ทั้งหมด", page: 0 };
    if (onSearch) {
      onSearch({ ...params, type: params.filter });
    } else {
      // Build query; include type only if provided
      const queryObj = { keyword: params.keyword, page: String(params.page) };
      if (params.filter && String(params.filter).trim() !== "") {
        queryObj.type = params.filter;
      }
      const query = new URLSearchParams(queryObj).toString();
      navigate(`/filter?${query}`);
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
      <form onSubmit={handleSubmit} className="flex items-center h-[60px] w-full max-w-full bg-base-100 rounded-md shadow-lg">
        <input 
          type="text" 
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="ค้นหา..." 
          className="input input-ghost w-full focus:outline-none rounded-l-full"
        />
        <button type="submit" className="mr-2 btn bg-[#8C6239] border-none btn-circle text-white font-light w-15 h-12 ">
          ค้นหา
        </button>
      </form>
      <div className="flex  flex-wrap justify-start gap-4 mt-10">
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

    {/* 2 column */}

    
    </>
  );
};

export default SearchBarNonFilter;
