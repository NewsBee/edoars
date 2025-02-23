"use client";

import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ProposalSubmission from "@/components/Pengajuan/PengajuanJudul";
import ExistingSubmission from "@/components/Pengajuan/SudahMengajukan";
import DetailPengajuan from "@/components/Pengajuan/DetailPengajuan";

export default function HalamanDetailPengajuan({
  params,
}: {
  params: { id: string };
}) {
  console.log(params.id);
  const [loading, setLoading] = useState(true);
  // const [submissionData, setSubmissionData] = useState(null);

  // useEffect(() => {
  //   const fetchSubmissionData = async () => {
  //     try {
  //       const response = await fetch(`/api/submission/${params.id}`);
  //       const data = await response.json();
  //       setSubmissionData(data);
  //     } catch (error) {
  //       console.error("Error fetching submission data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchSubmissionData();
  // }, [params.id]);
  // console.log(submissionData);

  // if (loading) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="mx-auto max-w-7xl">
      {/* <div className="px-6 py-4"> 
        <Breadcrumb pageName="Detail" />
      </div> */}
      <DetailPengajuan submissionId={params.id} />
    </div>
  );
}
