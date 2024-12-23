"use client";

import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ProposalSubmission from "@/components/Pengajuan/PengajuanJudul";
import ExistingSubmission from "@/components/Pengajuan/SudahMengajukan";

export default function Praskripsi() {
  const [loading, setLoading] = useState(true);
  const [existingSubmission, setExistingSubmission] = useState(null);

  // Fetch data pengajuan judul yang sudah ada
  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await fetch("/api/title-submission/me");
        const data = await response.json();

        if (response.ok) {
          setExistingSubmission(data.submissions[0] || null); // Ambil pengajuan terbaru jika ada
        } else {
          console.error(
            "Kesalahan saat mengambil data pengajuan:",
            data.message
          );
        }
      } catch (error) {
        console.error("Kesalahan saat mengambil data pengajuan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, []);

  // Loading state
  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-lg text-gray-600">Memuat data...</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Pengajuan Judul" />
        {/* Render berdasarkan kondisi */}
        {existingSubmission ? (
          <ExistingSubmission submission={existingSubmission} />
        ) : (
          <ProposalSubmission />
        )}
      </div>
    </DefaultLayout>
  );
}
