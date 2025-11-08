const imageMap = {
  วิลล่ากรุงเทพมหานคร: "/src/assets/villa/Bangkok-กรุงเทพมหานคร.jpg",
  วิลล่าชลบุรี: "/src/assets/villa/chonburi.png",
  วิลล่าพัทยา: "/src/assets/villa/pattaya.jpg",
  วิลล่าระยอง: "/src/assets/villa/rayong.jpg",
  วิลล่าภูเก็ต: "/src/assets/villa/phuket.jpg",
  วิลล่ากระบี่: "/src/assets/villa/krabi.jpg",
  วิลล่าสงขลา: "/src/assets/villa/songkhla.jpg",
  วิลล่าสมุย: "/src/assets/villa/samui.jpg",
  วิลล่าสุราษฎร์ธานี: "/src/assets/villa/surat.jpg",
  วิลล่านครศรีธรรมราช: "/src/assets/villa/nakhonsi.jpg",
  วิลล่าขอนแก่น: "/src/assets/villa/khonkaen.jpg",
  วิลล่าอุดรธานี: "/src/assets/villa/udon.jpg",
  วิลล่านครราชสีมา: "/src/assets/villa/korat.jpg",
  วิลล่าเชียงใหม่:  "/src/assets/villa/chiangmai.jpg",
  วิลล่าประจวบคีรีขันธ์: "/src/assets/villa/prachuap.jpg",
  วิลล่าหัวหิน: "/src/assets/villa/huahin.jpg",
  วิลล่าราชบุรี: "/src/assets/villa/raatchaburi.jpg",
  วิลล่านนทบุรี: "/src/assets/villa/nonthaburi.jpg",
  วิลล่าปทุมธานี: "/src/assets/villa/pathum.jpg",
  วิลล่านครปฐม: "/src/assets/villa/nakhonpathom.jpg",
  วิลล่าสมุทรปราการ: "/src/assets/villa/samutprakan.jpg",
  วิลล่ากาญจนบุรี: "/src/assets/villa/kanchanaburi.jpg",
  วิลล่าเพชรบุรี: "/src/assets/villa/phetburi.jpg",
  Default: "/src/assets/villa/default.jpg",
};

const CondoCardVilla = ({ item }) => {
  const name = item?.name || "วิลล่าแนะนำ";
  const total =
    typeof item?.totalAnnounce === "number" ? item.totalAnnounce : 0;

  // ✅ ดึงรูปตามชื่อ ถ้าไม่พบให้ใช้ default
  const cleanName = name?.replace(/\s+/g, "") || "";
  const image = imageMap[cleanName] || imageMap.Default;

  return (
    <div className="card relative flex h-full flex-col overflow-hidden rounded-[12px] bg-white shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02]">
      <div className="absolute right-0 top-0 p-3">
        <div className="badge h-[24px] rounded-2xl border-none bg-[#28A745] px-[9px] py-[2px] text-xs font-bold text-white">
          แนะนำ
        </div>
      </div>

      <figure className="h-56 w-full sm:h-64">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </figure>

      <div className="flex flex-col gap-3 bg-white p-4 text-center sm:p-5 sm:text-left">
        <h2 className="card-title text-xl sm:text-2xl line-clamp-1">{name}</h2>
        <p className="text-sm text-gray-600 sm:text-base">
          {total} ประกาศพร้อมให้เลือกชม
        </p>
      </div>
    </div>
  );
};

export default CondoCardVilla;
