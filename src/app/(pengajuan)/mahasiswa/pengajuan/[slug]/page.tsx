"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import KelompokKeahlian from "@/components/Admin/KelompokKeahlian";
import KelompokKeahlianList from "@/components/Admin/KelompokKeahlianList";
import ListPengajuan from "@/components/Pengajuan/ListPengajuan";
import SubmissionList from "@/components/Admin/SubmissionList";
import ExistingSubmission from "@/components/Pengajuan/SudahMengajukan";
import ProposalSubmission from "@/components/Pengajuan/PengajuanJudul";
import InputSubmission from "@/components/Pengajuan/InputSubmission";

export default function HalamanListPengajuan({
    params,
  }: {
    params: { slug: string };
  }) {
  const [loading, setLoading] = useState(true);
  const [existingSubmission, setExistingSubmission] = useState(null);

   useEffect(() => {
      const fetchSubmission = async () => {
        try {
          const response = await fetch("/api/title-submission/me");
          const data = await response.json();
  
          if (response.ok) {
            setExistingSubmission(data.submissions[0] || null); // Ambil pengajuan terbaru jika ada
          } else {
            console.error(
              "Kesalahan saat mengambil data pengajuan:",
              data.message
            );
          }
        } catch (error) {
          console.error("Kesalahan saat mengambil data pengajuan:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchSubmission();
    }, []);
//   console.log(params.slug)

  return (
    <>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Pengajuan" />
        {/* <ExistingSubmission submission={existingSubmission} /> */}
         {existingSubmission ? (
          <ExistingSubmission submission={existingSubmission} />
        ) : (
          <InputSubmission />
        )}
        {/* <SubmissionList slug={params.slug} /> */}
        {/* <ListPengajuan slug={params.slug}/> */}
      </div>
    </>
  );
}
