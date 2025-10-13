import React from 'react'

export const CardDetails = () => {
  return (
    <div className="w-full max-w-5xl">
      <div className="flex flex-col md:flex-row -mx-2 gap-y-4">
        {/* Left: Large card */}
        <div className="w-full md:w-1/2 px-2">
          <div className="card bg-base-100 shadow-sm overflow-hidden h-full">
            <figure className="w-full h-64 sm:h-80 md:h-[420px]">
              <img
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1595526051245-4506e0005bd0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
                alt="การ์ดใหญ่"
              />
            </figure>
          </div>
        </div>

        {/* Right: 4 small cards in 2x2 */}
        <div className="w-full md:w-1/2 px-2">
          <div className="grid grid-cols-2 grid-rows-2 gap-4 h-64 sm:h-80 md:h-[420px]">
            {[1,2,3,4].map((i) => (
              <div key={i} className="card bg-base-100 shadow-sm overflow-hidden h-full">
               <figure className="w-full h-full">
                  <img
                    className="w-full h-full object-cover  bg-[#D9D9D9] "
                    src=""
                    alt={`รายละเอียด ${i}`}
                  /> 
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
