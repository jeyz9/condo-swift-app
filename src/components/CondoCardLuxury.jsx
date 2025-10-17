const CondoCardLuxury = ({ item }) => {
  const title = item?.name || item?.title || "บ้านหรู";
  const total = typeof item?.totalAnnounces === 'number' ? item.totalAnnounces : undefined;
  return (
    <div className="card bg-base-100 shadow-lg overflow-hidden rounded-[12px] transition delay-50 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 w-full">
      <div className="absolute right-0 mt-3 mr-3 card-actions justify-end">
        <div className="badge bg-[#28A745] border-none font-bold text-xs sm:text-sm md:text-base px-[9px] py-[2px] text-white rounded-2xl h-[24px] w-auto">คอนโด</div>
      </div>
      <figure className="w-full h-64 sm:h-80">
        <img
          className="object-cover w-full h-full"
          src="https://thumbs.dreamstime.com/b/vertical-view-white-scandinavian-playroom-tent-teddy-bear-wooden-ladder-beige-blanket-real-photo-130740136.jpg"
          alt="Shoes"
        />
      </figure>
      <div className="absolute bottom-0 items-center justify-center content-center text-center bg-[#ffff] text-black w-full h-[140px] p-4">
        <div className="ml-2 sm:ml-3 md:ml-5">
        <h2 className="card-title text-xl sm:text-2xl md:text-3xl">
         {title}
        </h2>
        <div className="mt-3 flex flex-row  w-full text-base sm:text-lg justify-between pr-2">
        <p className="flex items-center gap-1">
          {total !== undefined ? `${total} รายการ` : ''}
        </p>
        </div>
        </div>
      </div>
    </div>
  );
};
export default CondoCardLuxury
