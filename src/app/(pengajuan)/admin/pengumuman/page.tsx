"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PengumumanList from "@/components/Admin/Pengumuman";


export default function HalamanPengajuanDosen() {
  const [loading, setLoading] = useState(true);
  const [existingSubmission, setExistingSubmission] = useState(null);

  return (
    <>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Pengumuman" />

        <PengumumanList/>
      </div>
    </>
  );
}
