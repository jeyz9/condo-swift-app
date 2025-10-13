import React from 'react'
import { MdVerified } from 'react-icons/md'

const SallerCard = () => {
  return (
    <div className="card bg-base-100 w-full shadow-sm border-1 border-[#FAAF1C] rounded-2xl relative">
      <div className="absolute top-2 right-2">
        <div className="badge bg-[#28A745] border-none rounded-full text-white text-xs sm:text-sm inline-flex items-center gap-1">
          <MdVerified className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          ยืนยันตัวตนแล้ว
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 sm:p-5">
        <div className="avatar">
          <div className="w-16 sm:w-20 rounded-full ring ring-base-200 ring-offset-2">
            <img
              src="https://img.freepik.com/premium-photo/memoji-emoji-handsome-smiling-man-white-background_826801-6987.jpg?semt=ais_hybrid&w=740&q=80"
              alt="โปรไฟล์ผู้ขาย"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-semibold truncate">ผู้ขาย</h3>
          <p className="text-sm text-base-content/70">ที่ปรึกษาอสังหาฯ</p>
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-4">
        <button className="btn w-full bg-[#8C6239] text-white border-none rounded-full">ติดต่อสอบถาม</button>
      </div>
    </div>
  )
}

export default SallerCard
