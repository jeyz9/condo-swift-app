import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CardFilter from "../components/filter/CardFilter";
import SearchBarNonFilter from "../components/filter/SearchBarNonFilter";
import Pagination from "../components/filter/Pagination";
import { Link, useLocation, useNavigate } from "react-router";
import AnnounceService from "../services/AnnounceService";
import UserService from "../services/UserService";
import Swal from "sweetalert2";
import RecommendedAgent from "../components/RecommendedAgent";
import { CondoCardSkeleton } from "../components/CondoCardSkeleton";
import { RecommendedAgentSkeleton } from "../components/RecommendedAgentSkeleton";

export const Filter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const keyword = queryParams.get("keyword") || queryParams.get("search_query") || "";
  const pageFromQuery = Number(queryParams.get("page") || 0) || 0;
  const type = queryParams.get("type") || queryParams.get("filter") || "";
  const bedroomCount = queryParams.get("bedroomCount");
  const minPrice = queryParams.get("minPrice");
  const maxPrice = queryParams.get("maxPrice");
  const saleType =
    queryParams.get("saleType") ||
    queryParams.get("effectiveType") || // รองรับชื่อใหม่จาก SearchBar
    "";
  const station = queryParams.get("station") || "";
  const province = queryParams.get("province") || "";
  const badge = queryParams.get("badge") || "";

  const [announces, setAnnounces] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(pageFromQuery);
  const [loading, setLoading] = useState(true);
  const listTopRef = useRef(null);

  // 🌟 ใหม่: state สำหรับ recommended agents
  const [recommendedAgents, setRecommendedAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(true);

  const itemsPerPage = 10;
  const pageCount = Math.ceil(total / itemsPerPage);

  // ✅ ดึงข้อมูลประกาศทุกครั้งที่ query string เปลี่ยน
  useEffect(() => {
    let ignore = false; // กันยิงซ้ำตอน navigate

    const fetchData = async () => {
      if (ignore) return;
      setLoading(true);
      try {
        const q = new URLSearchParams(location.search);
        const keyword = q.get("keyword") || q.get("search_query") || "";
        const type = q.get("type") || q.get("filter") || "";
        const saleType = q.get("saleType") || q.get("effectiveType") || "";
        const bedroomCount = q.get("bedroomCount");
        const minPrice = q.get("minPrice");
        const maxPrice = q.get("maxPrice");
        const badge = q.get("badge") || ""; // ดึง badge

        const res = await AnnounceService.getFilterAnnounceWithAgent({
          keyword,
          type,
          saleType,
          badge, // ส่ง badge
          bedroomCount: bedroomCount ? Number(bedroomCount) : undefined,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          station, // ส่ง station
          province, // ส่ง province
          page,
          size: itemsPerPage,
        });

        if (res.status === 200) {
          const data = res.data?.announceDetailsWithAgents || [];
          setAnnounces(data);
          setTotal(res.data?.total || data.length);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถโหลดข้อมูลได้",
          text: error.response?.data?.message || error.message,
          confirmButtonColor: "#8C6239",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [location.search]);

  // 🌟 ใหม่: ดึง Recommended Agents ครั้งเดียวตอน mount
  useEffect(() => {
    let ignore = false;

    const fetchRecommendedAgents = async () => {
      try {
        setLoadingAgents(true);
        // ใช้เส้น showRecommendedAgents จาก service
        const res = await UserService.showRecommendedAgents();
        if (!ignore && res.status === 200) {
          // ปรับตาม shape ของ API ถ้าต่าง
          const agents = Array.isArray(res.data)
            ? res.data
            : res.data?.agents || [];
          setRecommendedAgents(agents);
        }
      } catch (error) {
        console.error("โหลด Recommended Agents ไม่สำเร็จ:", error);
      } finally {
        if (!ignore) setLoadingAgents(false);
      }
    };

    fetchRecommendedAgents();

    return () => {
      ignore = true;
    };
  }, []);

  // ✅ Sync page state ทุกครั้งที่ URL เปลี่ยน
  useEffect(() => {
    const qPage = Number(new URLSearchParams(location.search).get("page") || 0);
    if (qPage !== page) setPage(qPage);
  }, [location.search]);

  // ✅ Pagination
  const handlePageClick = (newPage) => {
    const q = new URLSearchParams(location.search);
    q.set("page", newPage);
    q.set("size", itemsPerPage);
    navigate(`/filter?${q.toString()}`);
    setPage(newPage); // อัปเดตทันทีเพื่อให้สีเปลี่ยน
    listTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ✅ Animation
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
          <li>
            <Link to="/" className="hover:underline text-[#8C6239]">
              หน้าหลัก
            </Link>
          </li>
          <li>
            <Link to="/filter" className="hover:underline text-[#8C6239]">
              ประกาศขาย
            </Link>
          </li>
        </ul>
      </motion.div>

      {/* Search Bar */}
      <motion.div {...fadeUp}>
        <SearchBarNonFilter
          defaultKeyword={keyword}
          defaultFilter={type}
          defaultSaleType={saleType}
          defaultStation={station} // Pass defaultStation
          defaultProvince={province} // Pass defaultProvince
          defaultBadge={badge} // Pass defaultBadge
          onSearch={({ keyword: kw, type: ft, saleType: st, station: stn, province: prv, badge: bdg }) => {
            const params = new URLSearchParams(location.search);
            const nextKeyword = kw?.trim() || "";
            const nextType = ft || "";
            const nextSaleType = st || saleType || "";
            const nextStation = stn?.trim() || "";
            const nextProvince = prv?.trim() || "";
            const nextBadge = bdg || "";

            if (nextKeyword) {
              params.set("keyword", nextKeyword);
            } else {
              params.delete("keyword");
            }

            if (nextType) {
              params.set("type", nextType);
              params.delete("filter");
            } else {
              params.delete("type");
            }

            if (nextSaleType) {
              params.set("saleType", nextSaleType);
            } else {
              params.delete("saleType");
            }

            if (nextStation) {
              params.set("station", nextStation);
            } else {
              params.delete("station");
            }

            if (nextProvince) {
              params.set("province", nextProvince);
            } else {
              params.delete("province");
            }

            if (nextBadge) {
              params.set("badge", nextBadge);
            } else {
              params.delete("badge");
            }

            params.set("page", "0");
            params.set("size", String(itemsPerPage));

            navigate(`/filter?${params.toString()}`, { replace: true });
            setPage(0);
          }}
        />
        <div className="divider mt-5"></div>
      </motion.div>

      {/* Layout */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* ✅ Left Side */}
        <div className="w-full md:w-[70%]">
          <div ref={listTopRef} />
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                {...fadeUp}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div key={i} {...fadeUp}>
                    <CondoCardSkeleton />
                  </motion.div>
                ))}
              </motion.div>
            ) : announces.length > 0 ? (
              <motion.div
                key="list"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeUp}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {announces.map((item) => (
                  <motion.div key={item.id} {...fadeUp}>
                    <CardFilter announce={item} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.p
                key="empty"
                {...fadeUp}
                className="text-gray-500 text-center col-span-full py-10"
              >
                ไม่มีข้อมูลที่ตรงกับการค้นหา
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* ✅ Right Side */}
        <motion.div
          {...fadeUp}
          className="w-full md:w-[30%] flex flex-col items-start"
        >
          <h1 className="font-bold text-2xl sm:text-3xl text-gray-800 mb-4">
            ผู้ประกาศขายที่แนะนำ
          </h1>

          {loadingAgents ? (
            <RecommendedAgentSkeleton />
          ) : (
            <RecommendedAgent recommendedAgents={recommendedAgents} />
          )}
        </motion.div>
      </div>

      {/* ✅ Pagination */}
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
