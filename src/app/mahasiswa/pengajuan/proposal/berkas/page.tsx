import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import UploadPraSkripsi from "@/components/Pengajuan/UploadPraTa";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import StatusProposal from "@/components/Pengajuan/StatusProposal";
import DocumentStatus from "@/components/Pengajuan/StatusBerkas";
import ProjectInfo from "@/components/Pengajuan/HeaderPengajuan";
import NavigasiPengajuan from "@/components/Pengajuan/NavigasiPengajuan";

export const metadata: Metadata = {
    title:
        "Pengajuan Proposal",
    description: "Halaman Pengajuan Proposal",
};

export default function Proposal() {
    return (
        <>
            <DefaultLayout>
                <div className="mx-auto max-w-7xl">
                    <Breadcrumb pageName="Pengajuan Proposal" />
                    <ProjectInfo
                        title="Perancangan UI/UX Aplikasi Manajemen Skripsi Jurusan Arsitektur Universitas Tanjungpura dengan Metode Activity Centered Design"
                        status="Pending"
                        date="10 Feb 2024"
                        type="Proposal"
                        group="Sejarah, Teori, dan Kritik Arsitektur (KBK STKA)"
                        studentName="Roby Ronal Vieri Simanjuntak"
                        studentId="D1041201048"
                        profileImage="https://via.placeholder.com/40"
                    />
                    <NavigasiPengajuan />

                    <DocumentStatus />
                </div>
            </DefaultLayout>
        </>
    );
}
