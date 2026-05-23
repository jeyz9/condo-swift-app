import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import { MdOutlineAddHome, MdSell } from "react-icons/md";
import { useState, useEffect, useMemo } from "react";
import AnnounceService from "../services/AnnounceService";
import Swal from "sweetalert2";
import CondoCardNearby from "../components/CondoCardNearby";
import CondoCardLuxury from "../components/CondoCardLuxury";
import CondoCardVilla from "../components/CondoCardVilla";
import villa1 from "../assets/villa1.jpg";
import villa2 from "../assets/villa2.jpg";
import villa3 from "../assets/villa3.jpg";
import villa4 from "../assets/villa4.jpg";
import { CondoCard } from "../components/CondoCard";
import { CondoCardSkeleton } from "../components/CondoCardSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthContext } from "../context/AuthContext";
import { extractErrorMessage } from "../utils/errorUtils";

export const Home = () => {
  const user = useAuthContext()
  const [announce, setAnnounce] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saleType, setSaleType] = useState("");

  //  รูป villa (เรียงตาม index)
  const imageList = [villa1, villa2, villa3, villa4];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await AnnounceService.getAnnounceWithCategory();
        const responseFilter = await AnnounceService.getFilterAnnounceWithAgent(
          {
            keyword: "",
            type: "คอนโด",
            page: 0,
            size: 20,
          }
        );

        setAnnounce(
          response.status === 200
            ? response.data
            : {
                recommendAnnounces: [],
                nearbyPlaces: [],
                luxuryHouses: [],
                villaProvince: [],
              }
        );
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการเชื่อมต่อ",
          text: extractErrorMessage(error, "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"),
          confirmButtonText: "ตกลง",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //  ดึงข้อมูลแต่ละหมวด
  const { recommendAnnounces, nearbyPlaces, luxuryHouses, villaProvince } =
    announce;

  //  Animation
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
        className="relative -top-6 text-gray-600 p-2 -mt-2"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <SearchBar selectedType={saleType} />
      </motion.div>

      {/* ปุ่ม “เช่า” และ “ขาย” */}
      <motion.div
        className="flex flex-row flex-wrap justify-center  gap-4 sm:gap-5"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
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
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 mt-10 flex flex-row items-baseline">
           คอนโด แนะนำ
          <Link
            to="/filter?badge=แนะนำ&type=คอนโด"
            className="ml-auto text-xs sm:text-sm text-[#8C6239] hover:underline"
          >
            รายละเอียดเพิ่มเติม {`>`}
          </Link>
        </h2>

        <motion.div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {loading
              ? [...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  variants={fadeDelay(i)}
                  initial="hidden"
                  animate="visible"
                >
                  <CondoCardSkeleton />
                </motion.div>
              ))
              : recommendAnnounces?.length > 0 ? (
              recommendAnnounces.map((announce, i) => (
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
            ) : (
              <div className="col-span-full text-center text-gray-500">
                ไม่มีคอนโดแนะนำในขณะนี้
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* SECTION: คอนโดใกล้ BTS/MRT */}
      <motion.div
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
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
           
          </a>
        </h2>

        <motion.div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? [...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                variants={fadeDelay(i)}
                initial="hidden"
                animate="visible"
              >
                <CondoCardSkeleton />
              </motion.div>
            ))
              : nearbyPlaces?.length > 0 ? (
            nearbyPlaces.map((item, i) => (
              <motion.div
                key={item.id}
                variants={fadeDelay(i)}
                initial="hidden"
                animate="visible"
              >
                {/*  ใช้รูปเรียงตามลำดับ */}
                <CondoCardNearby
                  item={item}
                  image={imageList[i % imageList.length]}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              ไม่มีคอนโดใกล้ BTS/MRT ในขณะนี้
            </div>
                          )}        </motion.div>
      </motion.div>

      {/* SECTION: บ้าน */}
      <motion.div
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 mt-10 flex flex-row items-baseline">
          บ้าน แนะนำ
          <Link
            to="/filter?type=บ้านหรู"
            className="ml-auto text-xs sm:text-sm text-[#8C6239] hover:underline"
          >
            รายละเอียดเพิ่มเติม {`>`}
          </Link>
        </h2>

        {loading ? (
          <motion.div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                variants={fadeDelay(i)}
                initial="hidden"
                animate="visible"
              >
                <CondoCardSkeleton />
              </motion.div>
            ))}
          </motion.div>
        ) : luxuryHouses && luxuryHouses.length > 0 ? (
          <motion.div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {luxuryHouses.map((item, i) => (
              <motion.div
                key={item.id}
                variants={fadeDelay(i)}
                initial="hidden"
                animate="visible"
              >
                <CondoCardLuxury item={item} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="mt-6 p-4 rounded-lg text-center">
            ยังไม่มีบ้านแนะนำในขณะนี้
          </div>
        )}
      </motion.div>

      {/* SECTION: วิลล่า */}
      <motion.div
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 mt-10 flex flex-row items-baseline">
          รีสอร์ต วิลล่า
        </h2>

        <motion.div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? [...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                variants={fadeDelay(i)}
                initial="hidden"
                animate="visible"
              >
                <CondoCardSkeleton />
              </motion.div>
            ))
            : villaProvince?.length > 0 ? (
            villaProvince.map((item, i) => (
              <motion.div
                key={item.id}
                variants={fadeDelay(i)}
                initial="hidden"
                animate="visible"
              >
                <CondoCardVilla item={item} image={imageList[i % imageList.length]} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              ไม่มีวิลล่าแนะนำในขณะนี้
            </div>
                          )}        </motion.div>
      </motion.div>
    </>
  );
};
