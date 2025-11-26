import React, { useState, useEffect } from "react";

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

  return (
    <div className="w-full max-w-5xl">
      <div className="flex flex-col md:flex-row -mx-2 gap-y-4">
        {/* Main Image */}
        <div className="w-full md:w-1/2 px-2">
          <div className="card bg-base-100 shadow-sm overflow-hidden h-full">
            <figure
              className="w-full h-64 sm:h-80 md:h-[420px] cursor-pointer"
              onClick={() => openPopup(0)}
            >
              <img
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                src={mainImage.imageUrl}
                alt={mainImage.imageName}
              />
            </figure>
          </div>
        </div>

        {/* Other Images */}
        <div className="w-full md:w-1/2 px-2">
          <div className="grid grid-cols-2 grid-rows-2 gap-4 h-64 sm:h-80 md:h-[420px]">
            {otherImages.map((img, index) => (
              <div
                key={img.id}
                className="card bg-base-100 shadow-sm overflow-hidden h-full"
              >
                <figure
                  className="w-full h-full cursor-pointer"
                  onClick={() => openPopup(index + 1)}
                >
                  <img
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    src={img.imageUrl}
                    alt={img.imageName}
                  />
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Popup */}
      {currentIndex !== null && (
        <div
          className="fixed inset-0  bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={closePopup}
        >
          <div
            className="relative bg-opacity-10 p-2 rounded-lg w-full max-w-4xl h-auto max-h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="btn absolute top-2 right-2 z-20 bg-black bg-opacity-50 rounded-full text-white cursor-pointer w-8 h-8 flex items-center justify-center text-lg md:w-10 md:h-10 md:text-xl hover:bg-opacity-75 transition-opacity"
              onClick={closePopup}
            >
              ✕
            </button>

            {/* Previous Button */}
            <button
              className="cursor-pointer absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-40 rounded-full text-white p-2 text-2xl md:text-3xl hover:bg-opacity-60 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
            >
              &#10094;
            </button>

            {/* Next Button */}
            <button
              className="cursor-pointer absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-40 rounded-full text-white p-2 text-2xl md:text-3xl hover:bg-opacity-60 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
            >
              &#10095;
            </button>

            <img
              src={images[currentIndex].imageUrl}
              alt={images[currentIndex].imageName || "Popup view"}
              className="w-auto h-auto object-contain max-h-[90vh] rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};
