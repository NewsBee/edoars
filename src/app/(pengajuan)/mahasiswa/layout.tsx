"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function MahasiswaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [hasTitle, setHasTitle] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/user-sidebar");
        if (!response.ok) {
          throw new Error("Failed to fetch sidebar data");
        }
        const data = await response.json();
        setHasTitle(data.hasTitle);
      } catch (error) {
        console.error("Error fetching sidebar data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    // <div className="flex min-h-screen bg-gray-100 md:p-3 2xl:p-10">
    //   <div className="flex">
    //     {/* Sidebar */}
    //     <Sidebar
    //       sidebarOpen={sidebarOpen}
    //       setSidebarOpen={setSidebarOpen}
    //       role="Mahasiswa"
    //       hasTitle={hasTitle}
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
          role="Mahasiswa"
          hasTitle={hasTitle}
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
