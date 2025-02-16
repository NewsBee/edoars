"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import KelompokKeahlian from "@/components/Admin/KelompokKeahlian";
import AddSkillGroupForm from "@/components/Admin/AddKelompokKeahlian";
import EditSkillGroup from "@/components/Admin/EditKelompokKeahlian";
import ListLecturers from "@/components/Admin/DosenKelompokKeahlian";
import AddLecturer from "@/components/Admin/AddLecturer";


export default function HalamanPengajuanDosen({params,}:{params:{id:number}}) {
  const [loading, setLoading] = useState(true);
  const [existingSubmission, setExistingSubmission] = useState(null);

  return (
    <>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Daftar Dosen" />

        <AddLecturer id={params.id} />
      </div>
    </>
  );
}
