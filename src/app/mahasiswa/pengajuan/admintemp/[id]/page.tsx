"use client";

import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AdminSubmissionDetail from "@/components/Admin/AdminSubmissionDetail";

export default function DetailTitleSubmission({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data detail pengajuan dari API
    const fetchSubmission = async () => {
      try {
        const response = await fetch(`/api/title-submission/${params.id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Gagal memuat data pengajuan.");
        }
        const data = await response.json();
        setSubmission(data.titleSubmission); // Sesuaikan dengan struktur data API
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [params.id]);

  console.log("Params ID:", params.id);
  console.log("Submission Data:", submission);

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-lg text-gray-600">Memuat detail pengajuan...</p>
        </div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-lg text-red-600">Error: {error}</p>
        </div>
      </DefaultLayout>
    );
  }

  if (!submission) {
    return (
      <DefaultLayout>
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-lg text-gray-600">Data pengajuan tidak ditemukan.</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Detail Pengajuan Judul" />
        <AdminSubmissionDetail submission={submission} />
      </div>
    </DefaultLayout>
  );
}
