"use client";

import React, { useEffect, useState } from "react";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AddTypeSubmission from "@/components/Admin/AddTypeSubmission ";
import EditTypeSubmission from "@/components/Admin/EditTypeSubmission ";
import { useSession } from "next-auth/react";

export default function HalamanFormatTipePengajuan({
  params,
}: {
  params: { id: string };
}) {
  const { data: session, status } = useSession();

  return (
    <div className="flex min-h-screen w-full justify-center bg-gray-50">
      <div className="w-full max-w-6xl p-8">
        <Breadcrumb
          pageName="Edit Tipe Pengajuan"
        />
        <EditTypeSubmission id={params.id} />
      </div>
    </div>
  );
}
