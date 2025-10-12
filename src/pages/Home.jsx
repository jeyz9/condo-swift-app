import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar"; // Import SearchBar
import { MdOutlineAddHome } from "react-icons/md";
import { MdSell } from "react-icons/md";
import { useState, useEffect } from "react";
import CondoService from "../services/CondoService";
import Swal from "sweetalert2";
import { CondoCard } from "../components/CondoCard";
import CondoCardSec from "../components/CondoCardSec";
const Home = () => {
  const [condo, setCondo] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await CondoService.getAllCondo();

        setCondo(response.status === 200 ? response.data : []);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการเชื่อมต่อ",
          text:
            error.response?.data?.message ||
            error.message ||
            "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
          confirmButtonText: "ตกลง",
        });
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Hero />
      <div className="relative top-3  text-gray-600 p-2 ">
        <SearchBar /> {/* Add SearchBar here */}
      </div>
      <div className="flex flex-row justify-center mt-10 gap-5">
        <button className="btn bg-[#8C6239] text-white font-light rounded-md w-32 text-base sm:text-lg">
          <MdOutlineAddHome className="text-xl sm:text-2xl" />
          เช่า
        </button>
        <button className="btn bg-white text-[#8C6239] border-[#8C6239] font-light rounded-md w-32 text-base sm:text-lg">
          <MdSell className="text-xl sm:text-2xl" />
          ขาย
        </button>
      </div>
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-1000 mb-4 mt-10">
          <div className="flex flex-row items-baseline">
            คอนโดแนะนำ (ข้อเสนอที่ดีที่สุด)
            <a
              href="#"
              className="bg-transparent border-transparent ml-auto text-xs sm:text-sm mt-5"
            >
              รายละเอียดเพิ่มเติม {`>`}
            </a>
          </div>
        </h2>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {condo?.data?.length > 0 ? (
            condo?.data?.map((condo) => (
              <CondoCard key={condo.itemId} condo={condo} />
            ))
          ) : (
            <>
              <CondoCard />
              <CondoCard />
              <CondoCard />
              <CondoCard />
            </>
          )}
        </div>
      </div>

      <div className="mt-10 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-1000 mb-4 mt-10">
          <div className="flex flex-row items-baseline">
            คอนโดใกล้ BTS/MRT
            <a
              href="#"
              className="bg-transparent border-transparent ml-auto text-xs sm:text-sm mt-5"
            >
              รายละเอียดเพิ่มเติม {`>`}
            </a>
          </div>
        </h2>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {condo?.data?.length > 0 ? (
            condo?.data?.map((condo) => (
              <CondoCardSec key={condo.itemId} condo={condo} />
            ))
          ) : (
            <>
              <CondoCardSec />
              <CondoCardSec />
              <CondoCardSec />
              <CondoCardSec />
            </>
          )}
        </div>
      </div>

      <div className="mt-10 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-1000 mb-4 mt-10">
          <div className="flex flex-row items-baseline">
            บ้านหรู
            <a
              href="#"
              className="bg-transparent border-transparent ml-auto text-xs sm:text-sm mt-5"
            >
              รายละเอียดเพิ่มเติม {`>`}
            </a>
          </div>
        </h2>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {condo?.data?.length > 0 ? (
            condo?.data?.map((condo) => (
              <CondoCardSec key={condo.itemId} condo={condo} />
            ))
          ) : (
            <>
              <CondoCardSec />
              <CondoCardSec />
              <CondoCardSec />
              <CondoCardSec />
            </>
          )}
        </div>
      </div>

            <div className="mt-10 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-1000 mb-4 mt-10">
          <div className="flex flex-row items-baseline">
            รีสอร์ต วิลล่า
            <a
              href="#"
              className="bg-transparent border-transparent ml-auto text-xs sm:text-sm mt-5"
            >
              รายละเอียดเพิ่มเติม {`>`}
            </a>
          </div>
        </h2>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {condo?.data?.length > 0 ? (
            condo?.data?.map((condo) => (
              <CondoCardSec key={condo.itemId} condo={condo} />
            ))
          ) : (
            <>
              <CondoCardSec />
              <CondoCardSec />
              <CondoCardSec />
              <CondoCardSec />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
