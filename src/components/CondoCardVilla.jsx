import { Link } from "react-router-dom";

const CondoCardVilla = ({ item, image }) => {
  const name = item?.name || "วิลล่าแนะนำ";
  const total =
    typeof item?.totalAnnounce === "number" ? item.totalAnnounce : 0;

  const provinceFromName = name.replace("วิลล่า", "").trim();


  const province = provinceFromName 
;

  const type = item?.type || "วิลล่า";

  const imageToShow = image || "/villa/poolvilla-1.png";

  const queryString = new URLSearchParams({
    province,
    type,
  }).toString();

  return (
    <Link to={`/filter?${queryString}`}>
      <div className="card relative flex h-full flex-col overflow-hidden rounded-[12px] bg-white shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02]">
        <div className="absolute right-0 top-0 p-3">
          <div className="badge h-[24px] rounded-2xl border-none bg-[#28A745] px-[9px] py-[2px] text-xs font-bold text-white">
            แนะนำ
          </div>
        </div>

        <figure className="h-56 w-full sm:h-64">
          <img
            src={imageToShow}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </figure>

        <div className="flex flex-col gap-3 bg-white p-4 text-center sm:p-5 sm:text-left">
          <h2 className="card-title text-xl sm:text-2xl line-clamp-1" title={name}>
            {name?.length > 40 ? name.slice(0, 40).trimEnd() + "..." : name}
          </h2>
          <p className="text-sm text-gray-600 sm:text-base">
            {total} ประกาศพร้อมให้เลือกชม
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CondoCardVilla;
