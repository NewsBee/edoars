"use client";


import React, { useEffect, useState } from "react";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import FormatType from "@/components/Admin/FormatType";

// export const metadata: Metadata = {
//   title: "Pengajuan Praskripsi",
//   description: "Halaman pengajuan praskripsi",
// };

export default function HalamanFormatTipePengajuan({
    params,
  }: {
    params: { idtipe: string };
  }) {
  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <div className="p-6">
        <Breadcrumb pageName="Format Tipe Pengajuan" />
        {/* <AdminTitleSubmissionList/> */}
        <FormatType idtipe={params.idtipe} />
      </div>
    </div>
  );
}
