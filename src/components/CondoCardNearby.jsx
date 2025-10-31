const CondoCardNearby = ({ item }) => {
  const name = item?.name || "สถานีรถไฟฟ้าใกล้เคียง";
  const total =
    typeof item?.totalAnnounces === "number" ? item.totalAnnounces : 0;
  console.log(item)
  return (
    <div className="card relative flex h-full flex-col overflow-hidden rounded-[12px] bg-base-100 shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02]">
      <div className="absolute right-0 top-0 p-3">
        <div className="badge h-[24px] w-auto rounded-2xl border-none bg-[#28A745] px-[9px] py-[2px] text-xs font-bold text-white sm:text-sm md:text-base">
          ใกล้ BTS/MRT
        </div>
      </div>
      <figure className="h-56 w-full sm:h-64">
        <img
          className="h-full w-full object-cover"
          src="https://www.bts.co.th/assets/images/home/bts-car.png"
          alt={name}
        />
      </figure>
      <div className="flex flex-col gap-3 bg-white p-4 text-center sm:p-5 sm:text-left">
        <h2 className="card-title text-xl sm:text-2xl md:text-3xl">{name}</h2>
        <p className="text-sm text-gray-600 sm:text-base">
          {total} ประกาศที่เปิดอยู่
        </p>
      </div>
    </div>
  );
};
export default CondoCardNearby;
