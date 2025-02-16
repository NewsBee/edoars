"use client";


import React, { useEffect, useState } from "react";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import FormatType from "@/components/Admin/FormatType";
import FormatPengajuan from "@/components/Admin/FormatPengajuan";
import EditFormatPengajuan from "@/components/Admin/EditFormatPengajuan";


export default function HalamanEditFormatTipePengajuan({
    params,
  }: {
    params: { idformat: string, idtipe: string };
  }) {
    // console.log(params.idformat)
    // console.log(params.idtipe)
  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <div className="p-6">
        <Breadcrumb pageName="Tambah Format" />
        <EditFormatPengajuan idtipe={params.idtipe} idformat={params.idformat} />
      </div>
    </div>
  );
}
