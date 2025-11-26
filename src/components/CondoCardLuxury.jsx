import { Link } from "react-router-dom";

const CondoCardLuxury = ({ item }) => {

  const title = item?.name || item?.title || "โครงการไฮไลต์ระดับลักชูรี";
  const image = item?.image
  const total =
  
    typeof item?.totalAnnounces === "number" ? item.totalAnnounces : undefined;
  const location = item?.location
    console.log(`item: `, item)
  return (
    <Link to={`/detail/${item.id}`}>
    <div className="card relative flex h-full flex-col overflow-hidden rounded-[12px] bg-base-100 shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02]">
      <div className="absolute right-0 top-0 p-3">
      </div>
      <figure className="h-56 w-full sm:h-64">
        <img
          className="h-full w-full object-cover"
          src={image}
          alt={title}
        />
      </figure>
      <div className="flex flex-col gap-3 bg-white p-4 text-center sm:p-5 sm:text-left">
        <h2 className="card-title text-xl sm:text-2xl md:text-3xl">{title}</h2>
        <p className="card-sm text-sm sm:text-sm md:text-sm text-gray-600 truncate" >{location}</p>
        {typeof total === "number" && (
          <p className="text-sm text-gray-600 sm:text-base">
            มีประกาศทั้งหมด {total} รายการ
          </p>
        )}
      </div>
    </div>
    </Link>
  );
};
export default CondoCardLuxury;
