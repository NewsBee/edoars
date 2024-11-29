"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import SidebarWithData from "../Sidebar/SidebarData";


export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="md:p-3 2xl:p-10 bg-gray-100 min-h-screen flex">
      <div className="flex flex-1 overflow-hidden rounded-lg shadow-lg bg-white">
        {/* Sidebar */}
        <SidebarWithData
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Content Area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* Main Content */}
          <main className="p-4 md:p-6 2xl:p-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
