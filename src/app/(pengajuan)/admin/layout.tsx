"use client";

import React, { useState } from "react";
import SidebarAdmin from "@/components/Sidebar/SidebarAdmin";
import HeaderAdmin from "@/components/Header/HeaderAdmin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 md:p-3 ">
      <div className="flex w-full">
        {/* Sidebar */}
        {/* <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          role="Mahasiswa"
          hasTitle={true} // Ubah sesuai kebutuhan
        /> */}
        <SidebarAdmin
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main Content */}
        <div className="flex-1">
          <HeaderAdmin sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
          <main className="w-full flex- p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
