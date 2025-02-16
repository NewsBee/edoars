"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import KelompokKeahlian from "@/components/Admin/KelompokKeahlian";
import AddSkillGroupForm from "@/components/Admin/AddKelompokKeahlian";
import EditSkillGroup from "@/components/Admin/EditKelompokKeahlian";


export default function HalamanPengajuanDosen({params,}:{params:{id:string}}) {
  const [loading, setLoading] = useState(true);
  const [existingSubmission, setExistingSubmission] = useState(null);

  return (
    <>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Edit Kelompok Keahlian" />

        <EditSkillGroup idkelompokkeahlian={params.id}/>
      </div>
    </>
  );
}
