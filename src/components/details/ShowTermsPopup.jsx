import Swal from "sweetalert2";

/**
 * ใช้แบบ:
 * const accepted = await showTermsPopup();
 * if (accepted) { ...ทำต่อ... }
 */
export const showTermsPopup = () => {
  return new Promise((resolve) => {
    Swal.fire({
      title: "ข้อตกลงและเงื่อนไข",
      html: `
        <div class="text-[15px] text-left mb-4 leading-relaxed">
          <span class="font-semibold">ข้อควรระวัง:</span>
          <span class="text-red-600 font-semibold"> ห้าม</span>
          โอนเงินก่อนเห็นห้องจริงและ
          <span class="text-red-600 font-semibold">ตรวจสอบ</span>
          เอกสารสิทธิให้ครบถ้วน
        </div>

        <label class="flex items-start gap-2 text-[14px] cursor-pointer select-none">
          <input
            id="terms-checkbox"
            type="checkbox"
            class="checkbox mt-[3px] w-4 h-4 border border-gray-400 rounded-sm"
          />
          <span>ฉันรับทราบและยอมรับข้อความเตือนข้างต้น</span>
        </label>

        <div class="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            id="terms-cancel"
            class="btn py-2.5 rounded-lg border border-[#8C6239] bg-white text-[#8C6239]
                   font-medium text-[15px] hover:bg-[#8C6239]/5 transition-colors duration-150"
          >
            ยกเลิก
          </button>

          <button
            type="button"
            id="terms-confirm"
            class="py-2.5 rounded-lg bg-[#8C6239] text-white font-medium text-[15px]
                   opacity-40 cursor-not-allowed
                   transition-colors duration-150"
          >
            ยืนยัน
          </button>
        </div>
      `,
      showConfirmButton: false,
      showCancelButton: false,
      width: "620px",
      padding: "24px",
      customClass: {
        popup: "rounded-2xl !p-6",
        title: "text-[18px] font-bold mb-4",
        closeButton: "!outline-none",
      },
      allowOutsideClick: false,
    });

    const popup = Swal.getPopup();
    const checkbox = popup.querySelector("#terms-checkbox");
    const cancelBtn = popup.querySelector("#terms-cancel");
    const confirmBtn = popup.querySelector("#terms-confirm");

    // disable/enable ปุ่มยืนยันตาม checkbox
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        confirmBtn.classList.remove("opacity-40", "cursor-not-allowed");
      } else {
        confirmBtn.classList.add("opacity-40", "cursor-not-allowed");
      }
    });

    cancelBtn.addEventListener("click", () => {
      Swal.close();
      resolve(false); // ไม่ยอมรับ
    });

    confirmBtn.addEventListener("click", () => {
      if (!checkbox.checked) return; // กันเผื่อคลิกตอนยังไม่ติ๊ก

      Swal.close();
      resolve(true); // ยอมรับ
    });
  });
};
