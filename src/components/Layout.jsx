// src/components/Layout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-[110px] bg-gray-50">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
