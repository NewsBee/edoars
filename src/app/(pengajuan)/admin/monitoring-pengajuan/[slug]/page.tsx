"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import KelompokKeahlian from "@/components/Admin/KelompokKeahlian";
import KelompokKeahlianList from "@/components/Admin/KelompokKeahlianList";
import ListPengajuan from "@/components/Pengajuan/ListPengajuan";
import SubmissionList from "@/components/Admin/SubmissionList";

export default function HalamanListPengajuan({
    params,
  }: {
    params: { slug: string };
  }) {
  const [loading, setLoading] = useState(true);
  const [existingSubmission, setExistingSubmission] = useState(null);
//   console.log(params.slug)

  return (
    <>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Daftar Pengajuan" />
        <SubmissionList slug={params.slug} />
        {/* <ListPengajuan slug={params.slug}/> */}
      </div>
    </>
  );
}
