"use client";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Body = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 px-4">
        <Outlet /> {/* 👈 This renders the current child page */}
      </main>
      <Footer />
    </div>
  );
};

export default Body;
