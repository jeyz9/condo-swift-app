import React, { useState, useEffect } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

const popupButtonClasses =
  "absolute top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-950 shadow-lg shadow-slate-950/20 transition duration-200 hover:scale-105 hover:bg-white";

const thumbnailClass =
  "group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm";

const thumbnailHoverOverlay =
  "absolute inset-0 bg-slate-950/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100";

const thumbnailHint =
  "absolute inset-x-0 bottom-0 p-3 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100";

const emptyState = (
  <div className="w-full max-w-5xl">
    <div className="h-[400px] flex items-center justify-center bg-gray-200 rounded-lg text-gray-600">
      ไม่มีภาพประกอบ
    </div>
  </div>
);

export const CardDetails = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(null);
  const hasImages = images.length > 0;
  const totalImages = images.length;
  const hasMultipleImages = totalImages > 1;
  const mainImage = images[0];
  const otherImages = hasMultipleImages ? images.slice(1, 5) : [];
  const hasOtherImages = otherImages.length > 0;
  const currentImage = currentIndex !== null ? images[currentIndex] : null;

  const openPopup = (index) => setCurrentIndex(index);
  const closePopup = () => setCurrentIndex(null);

  const goToPrevious = () => {
    if (currentIndex === null) return;
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    if (currentIndex === null) return;
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1,
    );
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (currentIndex === null) return;
      if (event.key === "ArrowLeft") goToPrevious();
      if (event.key === "ArrowRight") goToNext();
      if (event.key === "Escape") closePopup();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images.length]);

  useEffect(() => {
    if (currentIndex !== null) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [currentIndex]);

  if (!hasImages) return emptyState;

  return (
    <div className="w-full max-w-5xl">
      <div className="flex flex-col md:flex-row -mx-2 gap-y-4">
        <div className={`w-full ${hasOtherImages ? "md:w-1/2" : "md:w-full"} px-2`}>
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

        {hasOtherImages && (
          <div className="w-full md:w-1/2 px-2">
            <div className="grid grid-cols-2 gap-4 h-64 sm:h-80 md:h-[420px]">
              {otherImages.map((img, index) => (
                <div key={img.id || index} className={thumbnailClass}>
                <figure
                  className="relative w-full h-full cursor-pointer"
                  onClick={() => openPopup(index + 1)}
                >
                  <img
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    src={img.imageUrl}
                    alt={img.imageName}
                  />
                  <div className={thumbnailHoverOverlay} />
                  <div className={thumbnailHint}>คลิกเพื่อขยาย</div>
                </figure>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>

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
              aria-label="ปิดรูป"
            >
              ✕
            </button>

            {hasMultipleImages && (
              <>
                <button
                  className={`${popupButtonClasses} left-4`}
                  onClick={(event) => {
                    event.stopPropagation();
                    goToPrevious();
                  }}
                  aria-label="รูปก่อนหน้า"
                >
                  <BiChevronLeft className="text-2xl" />
                </button>

                <button
                  className={`${popupButtonClasses} right-4`}
                  onClick={(event) => {
                    event.stopPropagation();
                    goToNext();
                  }}
                  aria-label="รูปถัดไป"
                >
                  <BiChevronRight className="text-2xl" />
                </button>
              </>
            )}

            <div className="flex min-h-[28rem] items-center justify-center p-6">
              <img
                src={currentImage.imageUrl}
                alt={currentImage.imageName || "Popup view"}
                className="max-h-[78vh] max-w-full rounded-[28px] object-contain shadow-2xl shadow-slate-950/40"
              />
            </div>

            <div className="border-t border-white/10 bg-slate-950/90 px-6 py-4 text-slate-200 sm:flex sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm text-slate-400">
                  รูปที่ {currentIndex + 1} / {totalImages}
                </p>
                <p className="text-base font-semibold text-white">
                  {currentImage.imageName || `ภาพประกาศ ${currentIndex + 1}`}
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
