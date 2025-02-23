"use client"

import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React, { useEffect, useState } from "react";
import UploadPraSkripsi from "@/components/Pengajuan/UploadPraTa";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ProposalSubmission from "@/components/Pengajuan/PengajuanJudul";
import ExistingSubmission from "@/components/Pengajuan/SudahMengajukan";
import AdminTitleSubmissionList from "@/components/Admin/AdminTitleSubmissionList";

// export const metadata: Metadata = {
//   title: "Pengajuan Praskripsi",
//   description: "Halaman pengajuan praskripsi",
// };

export default function Praskripsi() {
  const [loading, setLoading] = useState(true);
  const [existingSubmission, setExistingSubmission] = useState(null);


  return (
    <>
      <DefaultLayout>
        <div className="mx-auto max-w-7xl">
          <Breadcrumb pageName="Daftar Pengajuan Judul" />

          <AdminTitleSubmissionList/>
        </div>
      </DefaultLayout>
    </>
  );
}
