"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SidebarAdmin from "@/components/Sidebar/SidebarAdmin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 md:p-3 2xl:p-10">
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
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="w-full flex- p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
