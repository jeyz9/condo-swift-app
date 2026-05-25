import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CardFilter from "../components/filter/CardFilter";
import SearchBarNonFilter from "../components/filter/SearchBarNonFilter";
import Pagination from "../components/filter/Pagination";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AnnounceService from "../services/AnnounceService";
import UserService from "../services/UserService";
import Swal from "sweetalert2";
import RecommendedAgent from "../components/RecommendedAgent";
import { CondoCardSkeleton } from "../components/CondoCardSkeleton";
import { RecommendedAgentSkeleton } from "../components/RecommendedAgentSkeleton";
import { extractErrorMessage } from "../utils/errorUtils";

export const Filter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // URL is the single source of truth
  const queryParams = new URLSearchParams(location.search);
  const page = Number(queryParams.get("page") || 0);
  const keyword = queryParams.get("keyword") || queryParams.get("search_query") || "";
  const type = queryParams.get("type") || queryParams.get("filter") || "";
  const bedroomCount = queryParams.get("bedroomCount");
  const minPrice = queryParams.get("minPrice");
  const maxPrice = queryParams.get("maxPrice");
  const saleType = queryParams.get("saleType") || queryParams.get("effectiveType") || "";
  const station = queryParams.get("station") || "";
  const province = queryParams.get("province") || "";
  const badge = queryParams.get("badge") || "";

  const [announces, setAnnounces] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recommendedAgents, setRecommendedAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(true);
  
  const listTopRef = useRef(null);
  const itemsPerPage = 10;
  const pageCount = Math.ceil(total / itemsPerPage);

  // 🔥 Fetch Announces based on URL search params
  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      if (ignore) return;
      
      console.log("🔍 Fetching with params:", {
        keyword,
        type,
        saleType,
        station,
        province,
        badge,
        bedroomCount,
        minPrice,
        maxPrice,
        page
      });
      
      setLoading(true);

      try {
        const params = {
          page,
          size: itemsPerPage,
        };

        // เพิ่ม params ที่มีค่าเท่านั้น
        if (keyword) params.keyword = keyword;
        if (type) params.type = type;
        if (saleType) params.saleType = saleType;
        if (badge) params.badge = badge;
        if (station) params.station = station;
        if (province) params.province = province;
        if (bedroomCount) params.bedroomCount = Number(bedroomCount);
        if (minPrice) params.minPrice = Number(minPrice);
        if (maxPrice) params.maxPrice = Number(maxPrice);

        console.log("📤 Sending to API:", params);

        const res = await AnnounceService.getFilterAnnounceWithAgent(params);

        console.log("📥 API Response:", res);

        if (res.status === 200) {
          const data = res.data?.announceDetailsWithAgents || [];
          setAnnounces(data);
          setTotal(res.data?.total || data.length);
          console.log("✅ Data loaded:", data.length, "items");
        }
      } catch (error) {
        console.error("❌ Fetch error:", error);
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถโหลดข้อมูลได้",
          text: extractErrorMessage(error, "เกิดข้อผิดพลาดในการโหลดข้อมูล"),
          confirmButtonColor: "#8C6239",
        });
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      ignore = true;
    };
  }, [keyword, type, saleType, station, province, badge, bedroomCount, minPrice, maxPrice, page]);

  // 🔥 Recommended Agents (runs only once)
  useEffect(() => {
    let ignore = false;
    const fetchAgents = async () => {
      try {
        setLoadingAgents(true);
        const res = await UserService.showRecommendedAgents();
        if (!ignore && res.status === 200) {
          const agents = Array.isArray(res.data) ? res.data : res.data?.agents || [];
          setRecommendedAgents(agents);
        }
      } catch (error) {
        console.error("โหลด Recommended Agents ล้มเหลว:", error);
      } finally {
        if (!ignore) setLoadingAgents(false);
      }
    };
    fetchAgents();
    return () => (ignore = true);
  }, []);

  const handlePageClick = (newPage) => {
    const q = new URLSearchParams(location.search);
    q.set("page", String(newPage));
    q.set("size", String(itemsPerPage));
    navigate(`/filter?${q.toString()}`);
    listTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fadeUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.3, ease: "easeInOut" },
  };

  return (
    <div className="mt-5 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-8">
      {/* Breadcrumb */}
      <motion.div {...fadeUp} className="breadcrumbs text-sm mb-4">
        <ul>
          <li><Link to="/" className="hover:underline text-[#8C6239]">หน้าหลัก</Link></li>
          <li><Link to="/filter" className="hover:underline text-[#8C6239]">ประกาศขาย</Link></li>
        </ul>
      </motion.div>

      {/* Search Bar */}
      <motion.div {...fadeUp}>
        <SearchBarNonFilter
          defaultKeyword={keyword}
          defaultFilter={type}
          defaultSaleType={saleType}
          defaultStation={station}
          defaultProvince={province}
          defaultBadge={badge}
          onSearch={(params) => {
            const q = new URLSearchParams();
            Object.entries(params).forEach(([k, v]) => {
              if (v !== undefined && v !== null && v !== "") {
                q.set(k, String(v));
              }
            });
            navigate(`/filter?${q.toString()}`);
          }}
        />
        <div className="divider mt-5"></div>
      </motion.div>

      {/* --- Main Layout --- */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 items-start">
        <div>
          <div ref={listTopRef} />
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" {...fadeUp} className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                {[...Array(6)].map((_, i) => <motion.div key={i} {...fadeUp} className="h-full"><CondoCardSkeleton /></motion.div>)}
              </motion.div>
            ) : announces.length > 0 ? (
              <motion.div key="list" initial="initial" animate="animate" exit="exit" variants={fadeUp} className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                {announces.map((item) => (
                  <motion.div key={item.id} {...fadeUp} className="h-full">
                    <CardFilter announce={item} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.p key="empty" {...fadeUp} className="text-gray-500 text-center py-10">
                ไม่มีข้อมูลที่ตรงกับการค้นหา
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <motion.div {...fadeUp} className="w-full flex flex-col items-start">
          <h1 className="font-bold text-2xl sm:text-3xl text-gray-800 mb-4">
            ผู้ประกาศขายที่แนะนำ
          </h1>
          {loadingAgents ? <RecommendedAgentSkeleton /> : <RecommendedAgent recommendedAgents={recommendedAgents} />}
        </motion.div>
      </div>

      {/* Pagination */}
      <motion.div {...fadeUp} className="flex justify-center items-center mt-10">
        <Pagination
          currentPage={page}
          pageCount={pageCount}
          onPageChange={handlePageClick}
        />
      </motion.div>
    </div>
  );
};