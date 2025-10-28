import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="fixed inset-x-0 top-0 z-50">
        <Navbar />
      </header>
      <main className="flex-grow pt-20 pb-16 sm:pt-17">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
