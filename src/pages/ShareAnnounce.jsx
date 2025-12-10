import React, { useEffect, useState } from "react";
import { Detail } from "./Detail";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import AnnounceService from "../services/AnnounceService";
import Swal from "sweetalert2";

const ShareAnnounce = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ids, setIds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    const stored = localStorage.getItem("pending_ids");
    if (stored) {
      const parsed = JSON.parse(stored);
      setIds(parsed);

      const index = parsed.indexOf(Number(id));
      setCurrentIndex(index);
    }
  }, [id]);


  const handleApprove = async () => {
    try {
    const confirmed = await Swal.fire({
      title: "ยืนยันการอนุมัติ?",
      text: "คุณต้องการอนุมัติประกาศนี้ใช่หรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "อนุมัติ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#8C6239",
    });

    if (!confirmed.isConfirmed) return;

    await AnnounceService.approveAnnounce(id);

    await Swal.fire({
      icon: "success",
      title: "อนุมัติสำเร็จ",
      timer: 1500,
      showConfirmButton: false,
    });

    goNextOrBack();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "อนุมัติไม่สำเร็จ",
      text: error?.response?.data?.message || error.message, 
    });
  }
  };

  const handleReject = async () => {
    const { value: remark, isConfirmed } = await Swal.fire({
      title: "เหตุผลการปฏิเสธ",
      input: "textarea",
      inputPlaceholder: "กรุณาใส่หมายเหตุ...",
      showCancelButton: true,
      confirmButtonText: "ปฏิเสธ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#d33",
      inputValidator: (value) => {
        if (!value) {
          return "กรุณากรอกหมายเหตุ!";
        }
      },
    });

    if (!isConfirmed) return;

    await AnnounceService.rejectAnnounce(id, {remark});

    await Swal.fire({
      icon: "success",
      title: "ปฏิเสธสำเร็จ",
      timer: 1500,
      showConfirmButton: false,
    });

    goNextOrBack();
  };


  const goNextOrBack = () => {
    localStorage.removeItem("pending_ids");

    if (currentIndex < ids.length - 1) {
      navigate(`/admin/announce/details/${ids[currentIndex + 1]}`, {
        replace: true,
      });
    } else {
      navigate("/admin/announce/pending", { replace: true });
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      navigate(`/admin/announce/details/${ids[currentIndex - 1]}`, {
        replace: true,
      });
    }
  };

  const goNext = () => {
    if (currentIndex < ids.length - 1) {
      navigate(`/admin/announce/details/${ids[currentIndex + 1]}`, {
        replace: true,
      });
    }
  };


  return (
    <>
      <Detail />

      <div className="flex items-center justify-between w-full mt-10 select-none">
        <button
          onClick={goPrev}
          disabled={currentIndex <= 0}
          className="px-8 py-2 text-md btn border-none bg-transparent hover:bg-transparent flex items-center gap-2 disabled:opacity-40"
        >
          <FaAngleLeft className="text-lg" />
          <span>ก่อนหน้า</span>
        </button>

        <div className="flex gap-4">
          <button
            className="border border-[#404040] text-[#404040] rounded-[5px] text-[16px] px-[20px] py-[5px] hover:bg-[#404040] hover:text-white transition"
            onClick={handleReject}
          >
            ปฏิเสธ
          </button>

          <button
            className="bg-[#8C6239] text-white rounded-[5px] text-[16px] px-[20px] py-[5px] hover:bg-[#795430] transition"
            onClick={handleApprove}
          >
            อนุมัติ
          </button>
        </div>

        <button
          onClick={goNext}
          disabled={currentIndex === ids.length - 1}
          className="px-8 py-2 text-md btn border-none bg-transparent hover:bg-transparent flex items-center gap-2 disabled:opacity-40"
        >
          <span>ถัดไป</span>
          <FaAngleRight className="text-lg" />
        </button>
      </div>
    </>
  );
};
export default ShareAnnounce;
