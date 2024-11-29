"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function KaprodiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    // <div className="flex min-h-screen bg-gray-100 md:p-3 2xl:p-10">
    //   <div className="flex">
    //     {/* Sidebar */}
    //     <Sidebar
    //       sidebarOpen={sidebarOpen}
    //       setSidebarOpen={setSidebarOpen}
    //       role="Kaprodi"
    //       hasTitle={true} // Ubah sesuai kebutuhan
    //     />

    //     {/* Main Content */}
    //     <div className="flex-1">
    //       <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    //       <main className="p-6">{children}</main>
    //     </div>
    //   </div>
    // </div>
    <div className="flex min-h-screen bg-gray-100 md:p-3 2xl:p-10">
      <div className="flex w-full">
        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          role="Kaprodi"
          hasTitle={true}
        />

        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
