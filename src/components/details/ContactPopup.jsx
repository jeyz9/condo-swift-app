import Swal from "sweetalert2";

export const showContactPopup = (phoneMasked, phoneFull, lineUrl) => {
  const lineButtonHtml = lineUrl
    ? `
      <a
        id="line-button"
        href="${lineUrl}"
        target="_blank"
        rel="noreferrer"
        class="cursor-pointer flex items-center justify-center w-full py-3 rounded-lg border border-[#06c755]
               text-[#06c755] font-semibold text-[16px]
               hover:bg-[#06c755]/10 transition-colors duration-150"
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg"
             class="w-5 h-5 mr-2" />
        Line
      </a>
    `
    : "";

  Swal.fire({
    title: "ช่องทางการติดต่อ",
    html: `
      <div class="text-left text-[16px] mb-4">
        <span class="font-semibold">เบอร์ติดต่อ:</span>
        <span id="phone-text" class="ml-1">${phoneMasked}</span>
      </div>

      <button
        id="show-full-phone"
        type="button"
        class="cursor-pointer w-full py-3 mb-4 rounded-lg bg-[#8C6239] text-white font-semibold text-[16px]
               hover:bg-[#7b5431] transition-colors duration-150 
               focus:outline-none focus:ring-2 focus:ring-[#8C6239]/50"
      >
        แสดงเบอร์เต็ม
      </button>

      ${lineButtonHtml}
    `,
    showConfirmButton: false,
    width: "600px",
    padding: "24px",
    customClass: {
      popup: "rounded-2xl !p-6",
      title: "text-[20px] font-semibold mb-4",
      closeButton: "!outline-none",
    },
  });

  const popup = Swal.getPopup();
  const phoneText = popup?.querySelector("#phone-text");
  const showBtn = popup?.querySelector("#show-full-phone");

  if (showBtn && phoneText) {
    let isShown = false; // ❗ สถานะ toggle

    showBtn.addEventListener("click", () => {
      isShown = !isShown;

      if (isShown) {
        // ➤ โชว์เบอร์เต็ม
        phoneText.textContent = phoneFull;
        showBtn.textContent = "ซ่อน";
        showBtn.classList.add("bg-[#6b4a2e]");
      } else {
        // ➤ ซ่อนกลับเป็นเบอร์ Mask
        phoneText.textContent = phoneMasked;
        showBtn.textContent = "แสดงเบอร์เต็ม";
        showBtn.classList.remove("bg-[#6b4a2e]");
      }
    });
  }
};
