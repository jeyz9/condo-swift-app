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
          <h6 className="footer-title">Info</h6>
          <a className="link link-hover">Branding</a>
          <a className="link link-hover">Design</a>
          <a className="link link-hover">Marketing</a>
          <a className="link link-hover">Advertisement</a>
        </nav>
        <nav className="text-white">
          <h6 className="footer-title">About</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </nav>
        <nav className="text-white">
          <h6 className="footer-title">Contact</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
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
