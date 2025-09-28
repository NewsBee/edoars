"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import BimbinganChat from "@/components/Bimbingan/Chatting";
import StudentGuidancePage from "@/components/Bimbingan/ParentBimbingan";

export default function HalamanListPengajuan({
    params,
  }: {
    params: { slug: string };
  }) {
  const [loading, setLoading] = useState(true);
  const [existingSubmission, setExistingSubmission] = useState(null);


  return (
    <>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Pengajuan" />
        <BimbinganChat/>
        
         {/* <StudentGuidancePage   /> */}
      </div>
    </>
  );
}
