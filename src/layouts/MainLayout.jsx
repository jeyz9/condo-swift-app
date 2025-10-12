import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <main className="flex-grow mt-16 mb-20 min-h-[calc(100vh-9rem)]">
        {" "}
        <Outlet />{" "}
      </main>
      <div className="mt-60">
      <Footer />
      
    </div>
    </div>
    
  );
};