import React, { useState, useEffect } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

export const CardDetails = ({ images = [] }) => {

  const [currentIndex, setCurrentIndex] = useState(null);

  const openPopup = (index) => setCurrentIndex(index);
  const closePopup = () => setCurrentIndex(null);

  const goToPrevious = () => {
    if (currentIndex === null) return;
    const isFirst = currentIndex === 0;
    const newIndex = isFirst ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    if (currentIndex === null) return;
    const isLast = currentIndex === images.length - 1;
    const newIndex = isLast ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentIndex === null) return;
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Escape") closePopup();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);


  if (!images.length) {
    return (
      <div className="w-full max-w-5xl">
        <div className="h-[400px] flex items-center justify-center bg-gray-200 rounded-lg text-gray-600">
          ไม่มีภาพประกอบ
        </div>
      </div>
    );
  }

  const mainImage = images[0];
  const otherImages = images.slice(1, 5);
  const totalImages = images.length;

  return (
    <div className="w-full max-w-5xl">
      <div className="flex flex-col md:flex-row -mx-2 gap-y-4">
        {/* Main Image */}
        <div className="w-full md:w-1/2 px-2">
          <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_35px_80px_-40px_rgba(15,23,42,0.35)]">
            <figure
              className="group relative w-full h-64 sm:h-80 md:h-[420px] cursor-pointer overflow-hidden"
              onClick={() => openPopup(0)}
            >
              <img
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                src={mainImage.imageUrl}
                alt={mainImage.imageName}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-white/70">
                      แกลเลอรี่ประกาศ
                    </p>
                    <p className="text-2xl font-semibold tracking-tight">
                      ดูภาพทั้งหมด {totalImages} รูป
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openPopup(0)}
                    className="inline-flex items-center justify-center rounded-full bg-[#8C6239] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#8C6239]/20 transition hover:bg-[#704c2c]"
                  >
                    ดูรูปขยาย
                  </button>
                </div>
              </div>
            </figure>
          </div>
        </div>

        {/* Other Images */}
        <div className="w-full md:w-1/2 px-2">
          <div className="grid grid-cols-2 gap-4 h-64 sm:h-80 md:h-[420px]">
            {otherImages.map((img, index) => (
              <div
                key={img.id || index}
                className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm"
              >
                <figure
                  className="relative w-full h-full cursor-pointer"
                  onClick={() => openPopup(index + 1)}
                >
                  <img
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    src={img.imageUrl}
                    alt={img.imageName}
                  />
                  <div className="absolute inset-0 bg-slate-950/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 p-3 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    คลิกเพื่อขยาย
                  </div>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Popup */}
      {currentIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={closePopup}
        >
          <div
            className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-[32px] bg-slate-950/95 shadow-[0_35px_90px_-30px_rgba(15,23,42,0.75)] ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-slate-950 shadow-lg shadow-slate-950/20 transition duration-200 hover:scale-105 hover:bg-white"
              onClick={closePopup}
              aria-label="ปิดรูปภาพ"
            >
              ✕
            </button>

            <button
              className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-950 shadow-lg shadow-slate-950/20 transition duration-200 hover:scale-105 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              aria-label="รูปก่อนหน้า"
            >
              <BiChevronLeft className="text-2xl" />
            </button>

            <button
              className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-950 shadow-lg shadow-slate-950/20 transition duration-200 hover:scale-105 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              aria-label="รูปถัดไป"
            >
              <BiChevronRight className="text-2xl" />
            </button>

            <div className="flex min-h-[28rem] items-center justify-center p-6">
              <img
                src={images[currentIndex].imageUrl}
                alt={images[currentIndex].imageName || "Popup view"}
                className="max-h-[78vh] max-w-full rounded-[28px] object-contain shadow-2xl shadow-slate-950/40"
              />
            </div>

            <div className="border-t border-white/10 bg-slate-950/90 px-6 py-4 text-slate-200 sm:flex sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm text-slate-400">รูปที่ {currentIndex + 1} / {totalImages}</p>
                <p className="text-base font-semibold text-white">
                  {images[currentIndex].imageName || `ภาพประกาศ ${currentIndex + 1}`}
                </p>
              </div>
              <p className="mt-3 text-sm text-slate-400 sm:mt-0">
                กด Esc หรือคลิกพื้นที่รอบรูปเพื่อปิด
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
