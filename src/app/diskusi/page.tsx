import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import UploadPraSkripsi from "@/components/Pengajuan/UploadPraTa";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TablePenawaran from "@/components/Penawaran/TablePenawaran";
import DiskusiBox from "@/components/Diskusi/DiskusiBox";

export const metadata: Metadata = {
    title:
        "Penawaran Judul",
    description: "Halaman Penawaran Judul",
};

export default function Diskusi() {
    return (
        <>
            <DefaultLayout>
                <div className="mx-auto max-w-7xl">
                    <Breadcrumb pageName="Diskusi" />

                    <DiskusiBox />
                </div>
            </DefaultLayout>
        </>
    );
}
