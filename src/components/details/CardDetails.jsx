import React from "react";

export const CardDetails = ({ images = [] }) => {
  

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
        {/* รูปใหญ่ซ้าย */}
        <div className="w-full md:w-1/2 px-2">
          <div className="card bg-base-100 shadow-sm overflow-hidden h-full">
            <figure className="w-full h-64 sm:h-80 md:h-[420px]">
              <img
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                src={mainImage.imageUrl}
                alt={mainImage.imageName}
              />
            </figure>
          </div>
        </div>

        {/* รูปเล็กขวา */}
        <div className="w-full md:w-1/2 px-2">
          <div className="grid grid-cols-2 grid-rows-2 gap-4 h-64 sm:h-80 md:h-[420px]">
            {otherImages.map((img) => (
              <div
                key={img.id}
                className="card bg-base-100 shadow-sm overflow-hidden h-full"
              >
                <figure className="w-full h-full">
                  <img
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    src={`${img.imageUrl}`}
                    alt={img.imageName}
                  />
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
