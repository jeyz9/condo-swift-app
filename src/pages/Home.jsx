import { Link } from "react-router-dom";
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
  const [announce, setAnnounce] = useState({});
  const [loading, setLoading] = useState(true);
  const [saleType, setSaleType] = useState("");

  const imageList = [
    "/mrt/BTS-and-MRT-Bangkok.jpg",
    "/mrt/IM2019100039MO.jpg",
    "/mrt/MRT-BLUELINE-BLE.jpg",
    "/mrt/c1_1851229.jpg",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await AnnounceService.getAnnounceWithCategory();
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
          title: "?????????????????????????????",
          text:
            error.response?.data?.message ||
            error.message ||
            "????????????????????? ????????????????",
          confirmButtonText: "???",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const { recommendAnnounces, nearbyPlaces, luxuryHouses, villaProvince } =
    announce;

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

  const sectionWrapper =
    "px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-10 bg-white/80 backdrop-blur border border-[#e7dbce] rounded-3xl shadow-sm";
  const sectionTitle =
    "text-2xl sm:text-3xl md:text-4xl font-bold text-[#3f2c1d]";
  const sectionLink =
    "ml-auto text-xs sm:text-sm text-[#8C6239] hover:underline whitespace-nowrap";

  return (
    <div className="bg-gradient-to-b from-[#fdf8f2] via-[#f6ede3] to-[#f1e3d5] pb-12">
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
        <SearchBar selectedType={saleType} />
      </motion.div>

      {/* Sale type toggles */}
      <motion.div
        className="flex flex-row flex-wrap justify-center mt-8 gap-4 sm:gap-5 px-4"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setSaleType("?1??,S?1^?,?")}
          className={`btn border-[#8C6239] font-light rounded-md w-36 text-base sm:text-lg transition-all
            ${
              saleType === "?1??,S?1^?,?"
                ? "bg-[#8C6239] text-white"
                : "bg-white text-[#8C6239] hover:bg-[#8C6239] hover:text-white"
            }`}
        >
          <MdOutlineAddHome className="text-xl sm:text-2xl" />
          ?1??,S?1^?,?
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setSaleType("?,,?,??,?")}
          className={`btn border-[#8C6239] font-light rounded-md w-36 text-base sm:text-lg transition-all
            ${
              saleType === "?,,?,??,?"
                ? "bg-[#8C6239] text-white"
                : "bg-white text-[#8C6239] hover:bg-[#8C6239] hover:text-white"
            }`}
        >
          <MdSell className="text-xl sm:text-2xl" />
          ?,,?,??,?
        </motion.button>
      </motion.div>

      {/* Recommend */}
      <motion.div
        className={`${sectionWrapper} mt-10 mx-4 sm:mx-8 md:mx-12`}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-row items-center gap-3 mb-2 mt-4">
          <h2 className={sectionTitle}>???????????</h2>
          <span className="h-[3px] w-12 bg-[#8C6239] rounded-full" />
          <Link to="/filter?badge=?1??,T?,??,T?,3" className={sectionLink}>
            ????????? {`>`}
          </Link>
        </div>

        <motion.div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {loading ? (
              [...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  variants={fadeDelay(i)}
                  initial="hidden"
                  animate="visible"
                >
                  <CondoCardSkeleton />
                </motion.div>
              ))
            ) : recommendAnnounces?.length > 0 ? (
              recommendAnnounces.map((item, i) => (
                <motion.div
                  key={item.id}
                  variants={fadeDelay(i)}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <CondoCard announce={item} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                ????????????????????????
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* BTS/MRT */}
      <motion.div
        className={`${sectionWrapper} mt-8 mx-4 sm:mx-8 md:mx-12`}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-row items-center gap-3 mb-2 mt-4">
          <h2 className={sectionTitle}>???? BTS/MRT</h2>
          <span className="h-[3px] w-12 bg-[#8C6239] rounded-full" />
          <Link to="/filter?station=" className={sectionLink}>
            ????????? {`>`}
          </Link>
        </div>

        <motion.div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                variants={fadeDelay(i)}
                initial="hidden"
                animate="visible"
              >
                <CondoCardSkeleton />
              </motion.div>
            ))
          ) : nearbyPlaces?.length > 0 ? (
            nearbyPlaces.map((item, i) => (
              <motion.div
                key={item.id}
                variants={fadeDelay(i)}
                initial="hidden"
                animate="visible"
              >
                <CondoCardNearby
                  item={item}
                  image={imageList[i % imageList.length]}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              ??????????????? BTS/MRT
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Luxury */}
      <motion.div
        className={`${sectionWrapper} mt-8 mx-4 sm:mx-8 md:mx-12`}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-row items-center gap-3 mb-2 mt-4">
          <h2 className={sectionTitle}>???????????</h2>
          <span className="h-[3px] w-12 bg-[#8C6239] rounded-full" />
          <Link to="/filter?type=?,s?1%?,??,T" className={sectionLink}>
            ????????? {`>`}
          </Link>
        </div>

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
            ????????????????????
          </div>
        )}
      </motion.div>

      {/* Villas */}
      <motion.div
        className={`${sectionWrapper} mt-8 mx-4 sm:mx-8 md:mx-12 mb-10`}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-row items-center gap-3 mb-2 mt-4">
          <h2 className={sectionTitle}>?????????????????????</h2>
          <span className="h-[3px] w-12 bg-[#8C6239] rounded-full" />
        </div>

        <motion.div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                variants={fadeDelay(i)}
                initial="hidden"
                animate="visible"
              >
                <CondoCardSkeleton />
              </motion.div>
            ))
          ) : villaProvince?.length > 0 ? (
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
            <div className="col-span-full text-center text-gray-500">
              ????????????????????????????
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};
