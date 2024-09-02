import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import UploadPraSkripsi from "@/components/Pengajuan/UploadPraTa";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title:
        "Pengajuan Praskripsi",
    description: "Halaman pengajuan praskripsi",
};

export default function Praskripsi() {
    return (
        <>
            <DefaultLayout>
                <div className="mx-auto max-w-7xl">
                    <Breadcrumb pageName="Pengajuan Judul" />

                    <UploadPraSkripsi />
                </div>
            </DefaultLayout>
        </>
    );
}
