import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import { MdOutlineAddHome, MdSell } from "react-icons/md";
import { useState, useEffect } from "react";
import AnnounceService from "../services/AnnounceService";
import Swal from "sweetalert2";
import CondoCardNearby from "../components/CondoCardNearby";
import CondoCardLuxury from "../components/CondoCardLuxury";
import CondoCardVilla from "../components/CondoCardVilla";
import { CondoCard } from "../components/CondoCard";
import { CondoCardSkeleton } from "../components/CondoCardSkeleton";
import { motion, AnimatePresence } from "framer-motion";

export const Home = () => {
  const [announce, setAnnounce] = useState([]);
  const [saleType, setSaleType] = useState(""); // แค่เก็บไว้เฉย ๆ

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AnnounceService.getAnnounceWithCategory();
        const responseFilter = await AnnounceService.getFilterAnnounceWithAgent(
          {
            keyword: "", // ❌ ไม่ใส่คำค้น เพื่อให้ดึงทั้งหมด
            type: "คอนโด", // ✅ ค้นหาเฉพาะ type = คอนโดมิเนียม
            page: 0, // ✅ หน้าแรก
            size: 20, // ✅ จำนวนข้อมูลต่อหน้า (ปรับได้)
          }
        );
        setAnnounce(responseFilter.status === 200 ? responseFilter.data : [])
        setAnnounce(response.status === 200 ? response.data : []);
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


  const { recommendAnnounces, nearbyPlaces, luxuryHouses, villaProvince } =
    announce;

  // 🎨 Animation settings
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const fadeDelay = (i) => ({
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    },
  });

  return (
    <>
      {/* HERO */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Hero />
      </motion.div>

      {/* SEARCH BAR */}
      <motion.div
        className="relative -top-6 text-gray-600 p-2"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <SearchBar selectedType={saleType} /> {/* ✅ ส่ง type ให้ SearchBar */}
      </motion.div>

      {/* ปุ่ม “เช่า” และ “ขาย” */}
      <motion.div
        className="flex flex-row flex-wrap justify-center mt-10 gap-4 sm:gap-5"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        {/* ปุ่มเช่า */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setSaleType("เช่า")}
          className={`btn border-[#8C6239] font-light rounded-md w-32 text-base sm:text-lg transition-all
            ${
              saleType === "เช่า"
                ? "bg-[#8C6239] text-white"
                : "bg-white text-[#8C6239] hover:bg-[#8C6239] hover:text-white"
            }`}
        >
          <MdOutlineAddHome className="text-xl sm:text-2xl" />
          เช่า
        </motion.button>

        {/* ปุ่มขาย */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setSaleType("ขาย")}
          className={`btn border-[#8C6239] font-light rounded-md w-32 text-base sm:text-lg transition-all
            ${
              saleType === "ขาย"
                ? "bg-[#8C6239] text-white"
                : "bg-white text-[#8C6239] hover:bg-[#8C6239] hover:text-white"
            }`}
        >
          <MdSell className="text-xl sm:text-2xl" />
          ขาย
        </motion.button>
      </motion.div>

      {/* SECTION: คอนโดแนะนำ */}
      <motion.div
        className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-8"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 mt-10 flex flex-row items-baseline">
          คอนโดแนะนำ (ข้อเสนอที่ดีที่สุด)
          <a
            href="#"
            className="ml-auto text-xs sm:text-sm text-[#8C6239] hover:underline"
          >
            รายละเอียดเพิ่มเติม {`>`}
          </a>
        </h2>

        <motion.div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {recommendAnnounces?.length > 0
              ? recommendAnnounces.map((announce, i) => (
                  <motion.div
                    key={announce.id}
                    variants={fadeDelay(i)}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <CondoCard announce={announce} />
                  </motion.div>
                ))
              : [...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    variants={fadeDelay(i)}
                    initial="hidden"
                    animate="visible"
                  >
                    <CondoCardSkeleton />
                  </motion.div>
                ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* SECTION: คอนโดใกล้ BTS/MRT */}
      <motion.div
        className="mt-10 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-8"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 mt-10 flex flex-row items-baseline">
          คอนโดใกล้ BTS/MRT
          <a
            href="#"
            className="ml-auto text-xs sm:text-sm text-[#8C6239] hover:underline"
          >
            รายละเอียดเพิ่มเติม {`>`}
          </a>
        </h2>

        <motion.div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {nearbyPlaces?.length > 0 ? (
            nearbyPlaces.map((item, i) => (
              <motion.div
                key={item.id}
                variants={fadeDelay(i)}
                initial="hidden"
                animate="visible"
              >
                <CondoCardNearby item={item} />
              </motion.div>
            ))
          ) : (
            <CondoCardNearby item={{ name: "ใกล้ BTS", totalAnnounces: 0 }} />
          )}
        </motion.div>
      </motion.div>

      {/* SECTION: บ้านหรู */}
      <motion.div
        className="mt-10 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-8"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 mt-10 flex flex-row items-baseline">
          บ้านหรู
          <a
            href="#"
            className="ml-auto text-xs sm:text-sm text-[#8C6239] hover:underline"
          >
            รายละเอียดเพิ่มเติม {`>`}
          </a>
        </h2>

        <motion.div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {luxuryHouses?.length > 0 ? (
            luxuryHouses.map((item, i) => (
              <motion.div
                key={item.id}
                variants={fadeDelay(i)}
                initial="hidden"
                animate="visible"
              >
                <CondoCardLuxury item={item} />
              </motion.div>
            ))
          ) : (
            <CondoCardLuxury item={{ name: "บ้านหรู", totalAnnounces: 0 }} />
          )}
        </motion.div>
      </motion.div>

      {/* SECTION: วิลล่า */}
      <motion.div
        className="mt-10 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-8"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 mt-10 flex flex-row items-baseline">
          รีสอร์ต วิลล่า
          <a
            href="#"
            className="ml-auto text-xs sm:text-sm text-[#8C6239] hover:underline"
          >
            รายละเอียดเพิ่มเติม {`>`}
          </a>
        </h2>

        <motion.div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {villaProvince?.length > 0 ? (
            villaProvince.map((item, i) => (
              <motion.div
                key={item.id}
                variants={fadeDelay(i)}
                initial="hidden"
                animate="visible"
              >
                <CondoCardVilla item={item} />
              </motion.div>
            ))
          ) : (
            <CondoCardVilla item={{ name: "วิลล่า", totalAnnounces: 0 }} />
          )}
        </motion.div>
      </motion.div>
    </>
  );
};
