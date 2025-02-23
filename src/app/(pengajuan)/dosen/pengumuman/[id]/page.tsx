"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DetailPengumuman from "@/components/Pengumuman/DetailPengumuman";

export default function HalamaDetailPengumuman({
  params,
}: {
  params: { id: string };
}) {
  const [loading, setLoading] = useState(true);
  const [existingSubmission, setExistingSubmission] = useState(null);

  return (
    <>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Pengumuman" />

        <DetailPengumuman id={params.id} />
      </div>
    </>
  );
}