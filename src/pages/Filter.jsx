import { useEffect, useRef, useState } from "react";
import CardFilter from "../components/filter/CardFilter";
import SearchBarNonFilter from "../components/filter/SearchBarNonFilter";
import SalerCard from "../components/details/SalerCard";
import Pagination from "../components/filter/Pagination";
import { Link, useLocation, useNavigate } from "react-router";
import AnnounceService from "../services/AnnounceService";
import Swal from "sweetalert";

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
  const listTopRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
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
          setAnnounces(res.data.announceDetailsWithAgents || []);
          setTotal(res.data.total || 0);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถโหลดข้อมูลได้",
          text: error.response?.data?.message || error.message,
          confirmButtonColor: "#8C6239",
        });
      }
    };

    fetchData();
  }, [keyword, type, bedroomCount, minPrice, maxPrice, page]);

  // sync page state when url query changes
  useEffect(() => {
    const qPage = Number(new URLSearchParams(location.search).get("page") || 0) || 0;
    if (qPage !== page) setPage(qPage);
  }, [location.search]);

  // Pagination
  const itemsPerPage = 6;
  const pageCount = Math.ceil(total / itemsPerPage);

  const handlePageClick = (newPage) => {
    // update url query params
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
    if (listTopRef.current) {
      listTopRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="mt-5 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-8">
      {/* Breadcrumb */}
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link to="/">หน้าหลัก</Link>
          </li>
          <li>
            <Link to="/filter">ประกาศขาย</Link>
          </li>
        </ul>
      </div>

      {/* Search */}
      <div className="mt-5">
        <SearchBarNonFilter
          defaultKeyword={keyword}
          defaultFilter={type}
          onSearch={({ keyword: kw, type: ft, page: pg }) => {
            const params = new URLSearchParams({ keyword: kw || "", type: ft || "", page: String(pg || 0) });
            navigate(`/filter?${params.toString()}`);
            setPage(pg || 0);
          }}
        />
        <div className="divider mt-5"></div>
      </div>

      {/* Layout 2 ฝั่ง */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* ฝั่งซ้าย 70% */}
        <div className="w-full md:w-[70%]">
          <div ref={listTopRef} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {announces.length > 0 ? (
              announces.map((item) => (
                <CardFilter key={item.id} announce={item} />
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                ไม่มีข้อมูลที่ตรงกับการค้นหา
              </p>
            )}
          </div>
        </div>

        {/* ฝั่งขวา 30% */}
        <div className="w-full md:w-[30%]">
          <h1 className="font-bold text-[28px] mb-4">
            ผู้ประกาศขายที่แนะนำ
          </h1>
          <SalerCard />
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-10">
        <Pagination
          currentPage={page}
          pageCount={pageCount}
          onPageChange={handlePageClick}
        />
      </div>
    </div>
  );
};
