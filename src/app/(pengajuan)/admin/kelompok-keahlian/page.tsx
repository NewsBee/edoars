"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import KelompokKeahlian from "@/components/Admin/KelompokKeahlian";
import KelompokKeahlianList from "@/components/Admin/KelompokKeahlianList";


export default function HalamanPengajuanDosen() {
  const [loading, setLoading] = useState(true);
  const [existingSubmission, setExistingSubmission] = useState(null);

  return (
    <>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Kelompok Keahlian" />

        <KelompokKeahlianList/>
      </div>
    </>
  );
}
