import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FaSlidersH } from "react-icons/fa";
import { stations } from "../data/stations";
import AnnounceService from "../services/AnnounceService";

// ประเภททรัพย์
const propertyTypes = ["คอนโด", "บ้านเดี่ยว", "ทาวน์โฮม", "ที่ดิน"];

// 77 จังหวัด
const provinces = [
  "กรุงเทพมหานคร","กระบี่","กาญจนบุรี","กาฬสินธุ์","กำแพงเพชร","ขอนแก่น",
  "จันทบุรี","ฉะเชิงเทรา","ชลบุรี","ชัยนาท","ชัยภูมิ","ชุมพร","เชียงราย",
  "เชียงใหม่","ตรัง","ตราด","ตาก","นครนายก","นครปฐม","นครพนม","นครราชสีมา",
  "นครศรีธรรมราช","นครสวรรค์","นนทบุรี","นราธิวาส","น่าน","บึงกาฬ","บุรีรัมย์",
  "ปทุมธานี","ประจวบคีรีขันธ์","ปราจีนบุรี","ปัตตานี","พระนครศรีอยุธยา",
  "พะเยา","พังงา","พัทลุง","พิจิตร","พิษณุโลก","เพชรบุรี","เพชรบูรณ์","แพร่",
  "ภูเก็ต","มหาสารคาม","มุกดาหาร","แม่ฮ่องสอน","ยะลา","ยโสธร","ร้อยเอ็ด",
  "ระนอง","ระยอง","ราชบุรี","ลพบุรี","ลำปาง","ลำพูน","เลย","ศรีสะเกษ",
  "สกลนคร","สงขลา","สตูล","สมุทรปราการ","สมุทรสงคราม","สมุทรสาคร","สระแก้ว",
  "สระบุรี","สิงห์บุรี","สุโขทัย","สุพรรณบุรี","สุราษฎร์ธานี","สุรินทร์",
  "หนองคาย","หนองบัวลำภู","อ่างทอง","อำนาจเจริญ","อุดรธานี","อุตรดิตถ์",
  "อุทัยธานี","อุบลราชธานี"
];

export const bangkokStations = [
  // 🚈 BTS Sukhumvit Line
  "หมอชิต",
  "สะพานควาย",
  "อารีย์",
  "อนุสาวรีย์ชัยสมรภูมิ",
  "พญาไท",
  "ราชเทวี",
  "สยาม",
  "ชิดลม",
  "เพลินจิต",
  "นานา",
  "อโศก",
  "พร้อมพงษ์",
  "ทองหล่อ",
  "เอกมัย",
  "พระโขนง",
  "อ่อนนุช",
  "บางจาก",
  "ปุณณวิถี",
  "อุดมสุข",
  "บางนา",
  "แบริ่ง",
  "สมุทรปราการ",
  "ปู่เจ้า",
  "ช้างเอราวัณ",
  "สำโรง",
  "ปากน้ำ",
  "ศรีนครินทร์",
  "แพรกษา",
  "สายลวด",
  "เคหะฯ",

  // 🚈 BTS Silom Line
  "สนามกีฬาแห่งชาติ",
  "ราชดำริ",
  "ศาลาแดง",
  "ช่องนนทรี",
  "สุรศักดิ์",
  "สะพานตากสิน",
  "กรุงธนบุรี",
  "วงเวียนใหญ่",
  "โพธิ์นิมิตร",
  "ตลาดพลู",
  "วุฒากาศ",
  "บางหว้า",

  // 🌟 BTS Gold Line
  "กรุงธนบุรี (สายสีทอง)",
  "เจริญนคร",
  "คลองสาน",

  // 🚇 MRT Blue Line
  "หัวลำโพง",
  "วัดมังกร",
  "สามย่าน",
  "ลุมพินี",
  "คลองเตย",
  "ศูนย์ประชุมแห่งชาติสิริกิติ์",
  "สุขุมวิท",
  "เพชรบุรี",
  "พระราม 9",
  "ศูนย์วัฒนธรรมแห่งประเทศไทย",
  "ห้วยขวาง",
  "สุทธิสาร",
  "รัชดาภิเษก",
  "ลาดพร้าว",
  "พหลโยธิน",
  "สวนจตุจักร",
  "กำแพงเพชร",
  "บางซื่อ",
  "เตาปูน",
  "บางโพ",
  "บางอ้อ",
  "บางพลัด",
  "สิรินธร",
  "บางยี่ขัน",
  "บางขุนนนท์",
  "ไฟฉาย",
  "จรัญฯ 13",
  "ท่าพระ",
  "วัดสิงห์",
  "บางแค",
  "หลักสอง",
  "ภาษีเจริญ",
  "เพชรเกษม 48",
  "สายไหม",
  "พุทธมณฑลสาย 2",   // (ถ้าสายใหม่เปิด กำลังเพิ่ม)
  
  // 🚇 MRT Purple Line
  "คลองบางไผ่",
  "ตลาดบางใหญ่",
  "สามแยกบางใหญ่",
  "บางพลู",
  "บางรักใหญ่",
  "บางรักน้อยท่าอิฐ",
  "ไทรม้า",
  "แยกนนทบุรี 1",
  "นนทบุรี 1",
  "พระนั่งเกล้า",
  "แยกติวานนท์",
  "กระทรวงสาธารณสุข",
  "ศูนย์ราชการนนทบุรี",
  "แคราย",
  "บางกระสอ",
  "วงศ์สว่าง",
  "บางซ่อน",
  "เตาปูน",

  // 🚆 Airport Rail Link
  "พญาไท (ARL)",
  "ราชปรารภ",
  "มักกะสัน",
  "รามคำแหง",
  "หัวหมาก",
  "บ้านทับช้าง",
  "ลาดกระบัง",
  "สุวรรณภูมิ",

  // 🚌 BRT Bus Rapid Transit
  "สาทร (BRT)",
  "อาคารสงเคราะห์",
  "เทคนิคกรุงเทพ",
  "ถนนจันทน์",
  "นราธิวาส",
  "ราษฎร์บูรณะ",
  "วัดปริวาส",
  "พระราม 3",
  "เจริญราษฎร์",
  "สะพานพระราม 9"
];


// ประเภทการขาย
const saleTypes = [
  { label: "ทั้งหมด", value: "" },
  { label: "ขาย", value: "SELL" },
  { label: "เช่า", value: "RENT" },
];

export default function SearchBarWithFilter({ selectedType = "" }) {
  const [searchText, setSearchText] = useState("");

  const [badgeOptions, setBadgeOptions] = useState([]);

  const [filters, setFilters] = useState({
    type: "",
    province: "",
    station: "",
    saleType: selectedType || "",
    bedroomCount: 0,
    badge: [],
    minPrice: 0,
    maxPrice: 10000000,
  });

  const [tempFilters, setTempFilters] = useState(filters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const navigate = useNavigate();

  // ดึง badge
  useEffect(() => {
    AnnounceService.getBadges()
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setBadgeOptions(res.data);
        }
      })
      .catch(() => {
        setBadgeOptions(["ราคาพิเศษ", "โครงการใหม่", "หายาก"]);
      });
  }, []);

  // sync saleType
  useEffect(() => {
    setFilters((prev) => ({ ...prev, saleType: selectedType }));
    setTempFilters((prev) => ({ ...prev, saleType: selectedType }));
  }, [selectedType]);

  // ทำ search
  const handleSearch = () => {
    const f = filters;

    const params = {
      keyword: searchText || "",
      type: f.type || "",
      province: f.province || "",
      station: f.station || "",
      saleType: f.saleType || "",
      bedroomCount: f.bedroomCount || "",
      badge: f.badge.join(",") || "",
      minPrice: f.minPrice,
      maxPrice: f.maxPrice,
      page: 0,
      size: 10,
    };

    navigate(`/filter?${new URLSearchParams(params).toString()}`);
  };

  const handleTempChange = (name, value) => {
    setTempFilters((prev) => ({ ...prev, [name]: value }));
  };

  const toggleBadge = (b) => {
    setTempFilters((prev) => {
      const exists = prev.badge.includes(b);
      return {
        ...prev,
        badge: exists ? prev.badge.filter((i) => i !== b) : [...prev.badge, b],
      };
    });
  };

  const clearFilters = () => {
    const cleared = {
      type: "",
      province: "",
      station: "",
      saleType: "",
      bedroomCount: 0,
      badge: [],
      minPrice: 0,
      maxPrice: 10000000,
    };
    setTempFilters(cleared);
    setFilters(cleared);
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setIsFilterOpen(false);
  };

  return (
    <>
      {/* SEARCH BAR */}
      <div className="w-full flex justify-center mt-6 mb-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="w-full max-w-4xl px-4"
        >
          <div className="relative w-full h-[64px] rounded-2xl border border-[#e7dbce] bg-white shadow-lg flex items-center px-4 gap-3">

            {/* icon */}
            <svg
              className="h-5 w-5 text-[#8C6239]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
            </svg>

            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="ค้นหาโครงการ ทำเล หรือคำสำคัญ..."
              className="flex-1 bg-transparent focus:outline-none text-gray-800 placeholder:text-gray-400"
            />

            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="btn btn-outline border-[#e7dbce] text-[#8C6239] bg-white hover:bg-[#f7ede2]"
            >
              <FaSlidersH />
              ตัวกรอง
            </button>

            <button
              type="submit"
              className="btn bg-[#8C6239] text-white border-none hover:bg-[#704c2c]"
            >
              ค้นหา
            </button>

          </div>
        </form>
      </div>

      {/* FILTER MODAL */}
      <dialog className={`modal ${isFilterOpen ? "modal-open" : ""}`}>
        <div className="modal-box max-w-3xl bg-white rounded-2xl p-6 space-y-6">

          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-[#8C6239]">
              ตัวกรองการค้นหา
            </h2>
            <button onClick={() => setIsFilterOpen(false)} className="btn btn-ghost btn-sm">✕</button>
          </div>

          {/* ประเภททรัพย์ */}
          <section>
            <h3 className="font-medium text-gray-700 mb-2">ประเภททรัพย์</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {propertyTypes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTempChange("type", t)}
                  className={`btn btn-sm rounded-full ${
                    tempFilters.type === t
                      ? "bg-[#8C6239] text-white"
                      : "btn-outline border-[#e7dbce]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          {/* ประเภทประกาศ */}
          <section>
            <h3 className="font-medium text-gray-700 mb-2">ประเภทประกาศ</h3>
            <div className="flex flex-wrap gap-2">
              {saleTypes.map((s) => (
                <button
                  key={s.value + "saleType"}
                  type="button"
                  onClick={() => handleTempChange("saleType", s.value)}
                  className={`btn btn-sm rounded-full ${
                    tempFilters.saleType === s.value
                      ? "bg-[#8C6239] text-white"
                      : "btn-outline border-[#e7dbce]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </section>

          {/* จังหวัด + สถานี */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">จังหวัด</h3>
              <select
                value={tempFilters.province}
                onChange={(e) => {
                  const value = e.target.value;
                  handleTempChange("province", value);
                  if (value !== "กรุงเทพมหานคร") handleTempChange("station", "");
                }}
                className="select select-bordered w-full bg-white cursor-pointer"
              >
                <option value="">ทั้งหมด</option>
                {provinces.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">สถานี (ถ้ามี)</h3>
              <select
                value={tempFilters.station}
                onChange={(e) => handleTempChange("station", e.target.value)}
                disabled={tempFilters.province !== "กรุงเทพมหานคร"}
                className="select select-bordered w-full bg-white cursor-pointer"
              >
                <option value="">
                  {tempFilters.province === "กรุงเทพมหานคร"
                    ? "สถานีทั้งหมด"
                    : "เลือกกรุงเทพมหานครก่อน"}
                </option>
                {tempFilters.province === "กรุงเทพมหานคร" &&
                  bangkokStations.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
              </select>
            </div>
          </section>

          {/* ราคา */}
          <section>
            <h3 className="font-medium text-gray-700 mb-2 text-center">ช่วงราคา</h3>

            <div className="flex justify-between text-sm mb-2">
              <span>{tempFilters.minPrice.toLocaleString()} บาท</span>
              <span>{tempFilters.maxPrice.toLocaleString()} บาท</span>
            </div>

            <input
              type="range"
              min="0"
              max="10000000"
              step="50000"
              value={tempFilters.minPrice}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v <= tempFilters.maxPrice) handleTempChange("minPrice", v);
              }}
              className="range range-xs [--range-shdw:#8C6239] w-full"
            />

            <input
              type="range"
              min="0"
              max="10000000"
              step="50000"
              value={tempFilters.maxPrice}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v >= tempFilters.minPrice) handleTempChange("maxPrice", v);
              }}
              className="range range-xs [--range-shdw:#8C6239] mt-2 w-full"
            />
          </section>

          {/* ห้องนอน */}
          <section>
            <h3 className="font-medium text-gray-700 mb-2">จำนวนห้องนอน</h3>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() =>
                    handleTempChange(
                      "bedroomCount",
                      tempFilters.bedroomCount === n ? 0 : n
                    )
                  }
                  className={`btn btn-sm rounded-full ${
                    tempFilters.bedroomCount === n
                      ? "bg-[#8C6239] text-white"
                      : "btn-outline border-[#e7dbce]"
                  }`}
                >
                  {n} ห้อง
                </button>
              ))}
            </div>
          </section>

          {/* Badge */}
          <section>
            <h3 className="font-medium text-gray-700 mb-2">ป้ายกำกับ (Badge)</h3>
            <div className="flex flex-wrap gap-2">
              {badgeOptions.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => toggleBadge(b)}
                  className={`btn btn-sm rounded-full ${
                    tempFilters.badge.includes(b)
                      ? "bg-[#8C6239] text-white"
                      : "btn-outline border-[#e7dbce]"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </section>

          {/* Action */}
          <div className="modal-action flex justify-between">
            <button
              type="button"
              onClick={clearFilters}
              className="btn btn-ghost text-gray-600"
            >
              ล้างตัวกรอง
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="btn bg-gray-100 text-gray-700"
              >
                ปิด
              </button>

              <button
                type="button"
                onClick={applyFilters}
                className="btn bg-[#8C6239] text-white"
              >
                ใช้ตัวกรอง
              </button>
            </div>
          </div>

        </div>
      </dialog>
    </>
  );
}
