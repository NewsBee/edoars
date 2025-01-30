"use client";

import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React, { useEffect, useState } from "react";
import UploadPraSkripsi from "@/components/Pengajuan/UploadPraTa";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ProposalSubmission from "@/components/Pengajuan/PengajuanJudul";
import ExistingSubmission from "@/components/Pengajuan/SudahMengajukan";
import AdminTitleSubmissionList from "@/components/Admin/AdminTitleSubmissionList";
import TypeSubmissionPage from "@/components/Admin/TypeSubmission";

// export const metadata: Metadata = {
//   title: "Pengajuan Praskripsi",
//   description: "Halaman pengajuan praskripsi",
// };

export default function HalamanFormatTipePengajuan() {
  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <div className="p-6">
        <Breadcrumb pageName="Format Tipe Pengajuan" />
        {/* <AdminTitleSubmissionList/> */}
        <TypeSubmissionPage />
      </div>
    </div>
  );
}
