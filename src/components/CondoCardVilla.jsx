import { Link } from "react-router-dom";

const CondoCardVilla = ({ item }) => {
  const name = item?.name || "วิลล่าแนะนำ";
  const total =
    typeof item?.totalAnnounce === "number" ? item.totalAnnounce : 0;

    console.log("item in Villa card: ", item)
  //  ตัดคำว่า "วิลล่า" ออก จะได้ชื่อจังหวัด/พื้นที่
  const provinceFromName = name.replace("วิลล่า", "").trim();

  console.log("provinceFromName: ", provinceFromName);

  //  กำหนดค่า province & type (เผื่อ backend ส่งมาใน item ด้วย)
  const province = provinceFromName 
;

  console.log("province: ", province);
  const type = item?.type || "วิลล่า"; // ถ้า backend ใช้ "VILLA" ก็เปลี่ยนเป็น "VILLA"

  //  เอาไว้ใช้เลือกภาพ
  const image = "/villa/poolvilla-1.png";

  //  สร้าง query string ให้ filter หน้า /filter รองรับ province + type
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
            src={image}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </figure>

        <div className="flex flex-col gap-3 bg-white p-4 text-center sm:p-5 sm:text-left">
          <h2 className="card-title text-xl sm:text-2xl line-clamp-1">
            {name}
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
