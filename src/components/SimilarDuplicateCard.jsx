import React from "react";

const clamp01 = (n) => Math.max(0, Math.min(1, Number(n) || 0));
const toPct = (n01) => Math.round(clamp01(n01) * 100);

export default function SimilarDuplicateCard({
  similarDuplicates = [],
  exactDuplicates = [],
}) {
  const totalDuplicates =
    (exactDuplicates?.length || 0) + (similarDuplicates?.length || 0);

  if (totalDuplicates === 0) {
    return null;
  }

  return (
    <div className="w-full rounded-lg border border-[#F2A43B] bg-white p-4">
      <h3 className="text-xl font-extrabold leading-tight text-black md:text-2xl">
        ตรวจพบประกาศซ้ำและใกล้เคียง {totalDuplicates} รายการ
      </h3>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center rounded-full bg-[#FF3B30] px-3 py-1 text-sm font-bold text-white">
          ซ้ำตรง {exactDuplicates?.length || 0}
        </span>
        <span className="inline-flex items-center rounded-full bg-[#F2A43B] px-3 py-1 text-sm font-bold text-white">
          ใกล้เคียง {similarDuplicates?.length || 0}
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {exactDuplicates?.map((item) => (
          <div
            key={item.id}
            className="w-full max-w-md rounded-md bg-white p-4 shadow-[0_4px_10px_rgba(255,59,48,0.2)]"
          >
            <div className="truncate text-lg font-extrabold text-black">
              {item.title}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="text-sm font-bold text-black">Similarity:</div>
              <div className="relative h-4 flex-1">
                <div className="absolute inset-0 rounded-sm bg-gray-200" />
                <div
                  className="absolute inset-y-0 left-0 rounded-sm bg-[#8C6239]"
                  style={{ width: `100%` }}
                />
              </div>
              <div className="text-sm font-bold text-black">100%</div>
            </div>
            <div className="mt-1 text-sm font-extrabold text-black">
              Status: {item.status}
            </div>
            <div className="mt-3">
              <span className="inline-flex cursor-pointer items-center rounded-full bg-[#8C6239] px-4 py-1 text-sm font-bold text-white">
                ดูประกาศ
              </span>
            </div>
          </div>
        ))}

        {similarDuplicates?.map((item) => {
          const pct = toPct(item.similarity);

          return (
            <div
              key={item.id}
              className="w-full max-w-md rounded-md bg-white p-4 shadow-[0_4px_10px_rgba(0,0,0,0.1)]"
            >
              <div className="truncate text-lg font-extrabold text-black">
                {item.title}
              </div>

              <div className="mt-2 flex items-center gap-2">
                <div className="text-sm font-bold text-black">Similarity:</div>

                <div className="relative h-4 flex-1">
                  <div className="absolute inset-0 rounded-sm bg-gray-200" />

                  <div
                    className="absolute inset-y-0 left-0 rounded-sm bg-[#8B5A2B]"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="text-sm font-bold text-black">{pct}%</div>
              </div>

              <div className="mt-1 text-sm font-extrabold text-black">
                Status: {item.status}
              </div>

              <div className="mt-3">
                <span className="inline-flex cursor-pointer items-center rounded-full bg-[#8B5A2B] px-4 py-1 text-sm font-bold text-white">
                  ดูประกาศ
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
