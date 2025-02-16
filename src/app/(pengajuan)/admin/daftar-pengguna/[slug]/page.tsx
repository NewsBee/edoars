"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import KelompokKeahlian from "@/components/Admin/KelompokKeahlian";
import AddSkillGroupForm from "@/components/Admin/AddKelompokKeahlian";
import EditSkillGroup from "@/components/Admin/EditKelompokKeahlian";
import ListLecturers from "@/components/Admin/DosenKelompokKeahlian";
import ListLecturersCopy from "@/components/Admin/DosenKelompokKeahlian copy";
import UserList from "@/components/Admin/UserList";

interface SkillGroup {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  Lecturers: any[];  // Tipe data ini bisa disesuaikan dengan struktur Lecturers
}


export default function HalamanListUser({
  params,
}: {
  params: { slug: string };
}) {
  // const [data, setData] = useState([]);
  const [data, setData] = useState<SkillGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [existingSubmission, setExistingSubmission] = useState(null);
  let upperSlug = params.slug.charAt(0)
  upperSlug = upperSlug.toUpperCase()
  console.log(upperSlug)
  const remainingLetters = params.slug.slice(1)
  console.log(remainingLetters)
  let newSlug = upperSlug + remainingLetters
  console.log(newSlug)

  

  return (
    <>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName={`Daftar User ${ newSlug}`} />

        <UserList slug={newSlug} />
        
      </div>
    </>
  );
}
