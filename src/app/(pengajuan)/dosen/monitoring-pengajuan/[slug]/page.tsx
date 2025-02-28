"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DosenSubmissionList from "@/components/Admin/DosenSubmissionList";

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
        <DosenSubmissionList slug={params.slug} />
        {/* <ListPengajuan slug={params.slug}/> */}
      </div>
    </>
  );
}
