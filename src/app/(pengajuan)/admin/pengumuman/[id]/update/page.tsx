"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EditAnnouncement from "@/components/Pengumuman/EditPengumuman";

export default function HalamaEditPengumuman({
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

        <EditAnnouncement id={params.id} />
      </div>
    </>
  );
}
