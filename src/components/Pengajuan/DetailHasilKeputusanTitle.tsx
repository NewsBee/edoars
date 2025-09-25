import React from "react";
import { FaCheckCircle } from "react-icons/fa";

interface DesainHasilKeputusanTitleProps {
    status: string;
    title: string;
    approvedDate: string;
}

const HasilKeputusanTitle: React.FC<DesainHasilKeputusanTitleProps> = ({
    status,
    title,
    approvedDate,
}) => {
    return (
        <div className="rounded-lg border border-green-400 bg-gradient-to-br from-green-50 to-green-200 p-6 shadow-lg">
            <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-md">
                    <FaCheckCircle size={32} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-green-800">
                        Status Pengajuan: {status}
                    </h1>
                    <p className="text-sm text-green-700">
                        Pengajuan Anda telah disetujui pada{" "}
                        <span className="font-semibold">{approvedDate}</span>.
                    </p>
                </div>
            </div>
            <div className="mt-6 border-t border-green-300 pt-4">
                <h2 className="text-xl font-semibold text-green-800">{title}</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Selamat! Pengajuan Anda telah berhasil diproses. Silakan cek detail lebih lanjut di dashboard Anda.
                </p>
            </div>
        </div>
    );
};

export default HasilKeputusanTitle;