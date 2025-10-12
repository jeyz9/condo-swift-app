import React from 'react';
import { FaSlidersH } from "react-icons/fa";
const SearchBar = () => {
  return (
    // คอนเทนเนอร์หลักยังคงตำแหน่งเดิม
    <div className="relative -mt-10 z-10 flex justify-center px-4">
      <div className="flex items-center h-[60px] w-full max-w-lg bg-base-100 rounded-md shadow-lg">
        <input 
          type="text" 
          placeholder="ค้นหาคอนโด..." 

          className="input input-ghost w-full focus:outline-none rounded-l-full"
        />
        <button className='btn text-[#8C6239] border-none btn-circle mr-2 text-xl '><FaSlidersH /></button>
        <button className="mr-2 btn bg-[#8C6239] border-none btn-circle text-white font-light w-15 h-12 ">
          ค้นหา
        </button>
      </div>
       
    </div>
    
  );
};

export default SearchBar;