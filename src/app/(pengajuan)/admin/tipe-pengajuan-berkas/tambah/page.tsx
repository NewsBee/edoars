"use client";

import React, { useEffect, useState } from "react";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AddTypeSubmission from "@/components/Admin/AddTypeSubmission ";

export default function HalamanFormatTipePengajuan() {
    return (
      <div className="min-h-screen w-full flex justify-center bg-gray-50">
        <div className="w-full max-w-6xl p-8">
          <Breadcrumb pageName="Tambah Tipe Pengajuan" />
          <AddTypeSubmission />
        </div>
      </div>
    );
  }
  
