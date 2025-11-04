import React from "react";
import { Link } from "react-router-dom";
import { FaPlay, FaFacebook } from "react-icons/fa";
const Footer = () => {
  return (
    <>
      <footer className=" shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)] footer sm:footer-horizontal  text-base-content p-10 bg-[#8C6239]">
        <aside>
          <Link to="/" className="flex flex-col items-start text-white">
            <span className="text-xs sm:text-sm ">Condo</span>
            <span className="text-xl sm:text-2xl font-bold -mt-2">Swift</span>
          </Link>
        </aside>

        <nav className="text-white">
          <h6 className="footer-title">ข้อมูล / About</h6>
          <Link to="/about-us" className="link link-hover">
            เกี่ยวกับเรา
          </Link>
          <a href="mailto:support@condoswift.com" className="link link-hover">
            ติดต่อเรา
          </a>
          <a href="tel:+6621234567" className="link link-hover">
            +66 2 123 4567
          </a>
        </nav>
        <nav className="text-white">
          <h6 className="footer-title">กฎหมาย / Legal</h6>
          <Link to="/terms-of-service" className="link link-hover">
            ข้อกำหนดการใช้บริการ
          </Link>
          <Link to="/privacy-policy" className="link link-hover">
            นโยบายความเป็นส่วนตัว
          </Link>
        </nav>
      </footer>
      <div className="bg-[#8C6239] h-32">
        <div className="w-full h-full flex items-center justify-between px-10">
          <p className="text-white">© 2024 — Copyright</p>
          <div className="flex items-center gap-4 text-white">
            <a aria-label="Play">
              <FaPlay size={24} />
            </a>
            <a aria-label="Facebook">
              <FaFacebook size={24} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
