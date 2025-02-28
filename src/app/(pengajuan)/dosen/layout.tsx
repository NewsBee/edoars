"use client";

import React, { useEffect, useState } from "react";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar/SidabarMahasiswa";
import SidebarDosen from "@/components/Sidebar/SidebarDosen";
import HeaderAdmin from "@/components/Header/HeaderAdmin";

export default function MahasiswaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [hasTitle, setHasTitle] = useState<boolean>(false);

  return (
    <div className="flex min-h-screen bg-gray-100 md:p-3">
      <div className="flex w-full">
        <SidebarDosen
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          <HeaderAdmin
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          <main className="flex-1 ">{children}</main>
        </div>
      </div>
    </div>
  );
}
