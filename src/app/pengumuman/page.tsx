import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import UploadPraSkripsi from "@/components/Pengajuan/UploadPraTa";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import StatusProposal from "@/components/Pengajuan/StatusProposal";
import TablePengumuman from "@/components/Pengumuman/TablePengumuman";

export const metadata: Metadata = {
    title:
        "Pengumuman",
    description: "Halaman Pengumuman",
};

export default function Pengumuman() {
    return (
        <>
            <DefaultLayout>
                <div className="mx-auto max-w-7xl">
                    <Breadcrumb pageName="Pengumuman" />

                    <TablePengumuman/>
                </div>
            </DefaultLayout>
        </>
    );
}
