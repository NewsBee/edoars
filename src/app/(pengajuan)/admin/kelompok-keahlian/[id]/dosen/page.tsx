"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import KelompokKeahlian from "@/components/Admin/KelompokKeahlian";
import AddSkillGroupForm from "@/components/Admin/AddKelompokKeahlian";
import EditSkillGroup from "@/components/Admin/EditKelompokKeahlian";
import ListLecturers from "@/components/Admin/DosenKelompokKeahlian";
import ListLecturersCopy from "@/components/Admin/DosenKelompokKeahlian copy";

interface SkillGroup {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  Lecturers: any[];  // Tipe data ini bisa disesuaikan dengan struktur Lecturers
}


export default function HalamanPengajuanDosen({
  params,
}: {
  params: { id: string };
}) {
  // const [data, setData] = useState([]);
  const [data, setData] = useState<SkillGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [existingSubmission, setExistingSubmission] = useState(null);

  useEffect(() => {
    const fetchSkillGroups = async () => {
      try {
        const response = await fetch("/api/kelompok-keahlian");
        if (response.ok) {
          const result = await response.json();

          // Menemukan data berdasarkan ID yang diterima dari params
          const selectedData = result.find((item: SkillGroup) => item.id === parseInt(params.id));
          console.log(selectedData)

          if (selectedData) {
            setData(selectedData);
          } else {
            console.log("Data not found for id:", params.id);
          }
        } else {
          console.error("Failed to fetch skill groups");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkillGroups();
  }, [params.id]);
  console.log(data);

  return (
    <>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Daftar Dosen" />
{/* 
        <ListLecturers namakk={data?.name} idkk={params.id} /> */}
        <ListLecturersCopy namakk={data?.name} idkk={params.id} />
      </div>
    </>
  );
}
