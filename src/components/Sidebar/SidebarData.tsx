"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

const SidebarWithData = ({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) => {
  const [role, setRole] = useState<string>("Mahasiswa");
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
        setRole(data.role);
        setHasTitle(data.hasTitle);
      } catch (error) {
        console.error("Error fetching sidebar data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Tambahkan indikator loading jika diperlukan
  }

  return (
    <Sidebar
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      role={role}
      hasTitle={hasTitle}
    />
  );
};

export default SidebarWithData;
