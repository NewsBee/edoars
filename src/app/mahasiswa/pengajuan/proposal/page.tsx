import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import UploadPraSkripsi from "@/components/Pengajuan/UploadPraTa";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import StatusProposal from "@/components/Pengajuan/NewStatus";

export const metadata: Metadata = {
  title: "Pengajuan Proposal",
  description: "Halaman Pengajuan Proposal",
};

export default function Proposal() {
  return (
    <>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Pengajuan Proposal" />

        {/* <StatusProposal /> */}
        <StatusProposal userId={1}/>
      </div>
    </>
  );
}
