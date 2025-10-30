import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CardFilter from "../components/filter/CardFilter";
import SearchBarNonFilter from "../components/filter/SearchBarNonFilter";
import SalerCard from "../components/details/SalerCard";
import Pagination from "../components/filter/Pagination";
import { Link, useLocation, useNavigate } from "react-router";
import AnnounceService from "../services/AnnounceService";
import Swal from "sweetalert2";

export const Filter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const keyword = queryParams.get("keyword") || "";
  const pageFromQuery = Number(queryParams.get("page") || 0) || 0;
  const type = queryParams.get("type") || queryParams.get("filter") || "";
  const bedroomCount = queryParams.get("bedroomCount");
  const minPrice = queryParams.get("minPrice");
  const maxPrice = queryParams.get("maxPrice");

  const [announces, setAnnounces] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(pageFromQuery);
  const [loading, setLoading] = useState(true);
  const listTopRef = useRef(null);

  const itemsPerPage = 10;
  const pageCount = Math.ceil(total / itemsPerPage);

  // ✅ Fetch data
 useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await AnnounceService.getFilterAnnounceWithAgent({
        keyword,
        type,
        bedroomCount: bedroomCount ? Number(bedroomCount) : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        page,
        size: itemsPerPage,
      });

      if (res.status === 200) {
        const data = res.data?.announceDetailsWithAgents || [];
        const totalCount = res.data?.total || data.length;

        setAnnounces(data);
        setTotal(totalCount);
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
}, [keyword, type, bedroomCount, minPrice, maxPrice, page]);


  // ✅ Sync page when URL changes
  useEffect(() => {
    const qPage = Number(new URLSearchParams(location.search).get("page") || 0) || 0;
    if (qPage !== page) setPage(qPage);
  }, [location.search]);

  // ✅ Pagination
  const handlePageClick = (newPage) => {
    const params = new URLSearchParams({
      keyword,
      type,
      page: String(newPage),
      ...(bedroomCount ? { bedroomCount } : {}),
      ...(minPrice ? { minPrice } : {}),
      ...(maxPrice ? { maxPrice } : {}),
    });
    navigate(`/filter?${params.toString()}`);
    setPage(newPage);
    listTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ✅ Animation variants
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

      {/* Search */}
      <motion.div {...fadeUp}>
        <SearchBarNonFilter
          defaultKeyword={keyword}
          defaultFilter={type}
          onSearch={({ keyword: kw, type: ft, page: pg }) => {
            const params = new URLSearchParams({
              keyword: kw || "",
              type: ft || "",
              page: String(pg || 0),
            });
            navigate(`/filter?${params.toString()}`);
            setPage(pg || 0);
          }}
        />
        <div className="divider mt-5"></div>
      </motion.div>

      {/* Layout */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* ✅ Left side */}
        <div className="w-full md:w-[70%]">
          <div ref={listTopRef} />

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.p
                key="loading"
                {...fadeUp}
                className="text-center text-gray-500 py-10"
              >
                กำลังโหลดข้อมูล...
              </motion.p>
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

        {/* ✅ Right side */}
        <motion.div
          {...fadeUp}
          className="w-full md:w-[30%] flex flex-col items-start"
        >
          <h1 className="font-bold text-2xl sm:text-3xl text-gray-800 mb-4">
            ผู้ประกาศขายที่แนะนำ
          </h1>
          <SalerCard />
        </motion.div>
      </div>

      {/* Pagination */}
      <motion.div
        {...fadeUp}
        className="flex justify-center items-center mt-10"
      >
        <Pagination
          currentPage={page}
          pageCount={pageCount}
          onPageChange={handlePageClick}
        />
      </motion.div>
    </div>
  );
};
