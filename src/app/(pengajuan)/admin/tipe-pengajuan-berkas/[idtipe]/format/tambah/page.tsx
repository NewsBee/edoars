"use client";


import React, { useEffect, useState } from "react";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import FormatType from "@/components/Admin/FormatType";
import FormatPengajuan from "@/components/Admin/FormatPengajuan";


export default function HalamanFormatTipePengajuan({
    params,
  }: {
    params: { idtipe: string };
  }) {
  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <div className="p-6">
        <Breadcrumb pageName="Tambah Format" />
        {/* <AdminTitleSubmissionList/> */}
        <FormatPengajuan idtipe={params.idtipe} />
      </div>
    </div>
  );
}
