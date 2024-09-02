import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EditAnnouncement from "@/components/Pengumuman/EditPengumuman";


export const metadata: Metadata = {
    title: "Pengumuman",
    description: "Halaman Pengumuman",
};

export default function Page({ params }: { params: { id: string } }) {
    return (
        <>
            <DefaultLayout>
                <div className="mx-auto max-w-7xl">
                    <Breadcrumb pageName="Detail Pengumuman" />
                    {/* Pass the params to the DetailPengumuman component */}
                    <EditAnnouncement params={params} />
                </div>
            </DefaultLayout>
        </>
    );
}
