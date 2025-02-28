//// filepath: /d:/next/edoars/src/components/Pengajuan/DetailHasilKeputusan.tsx
import React from "react";
import { FaUser, FaStar, FaStickyNote, FaChartLine } from "react-icons/fa";

interface VerificatorAverage {
  verificatorId: string;
  average: number;
  name: string;
  note?: string;
}

interface DetailHasilKeputusanProps {
  verificatorAverages?: VerificatorAverage[];
  requiredFiles?: any;
}

const DetailHasilKeputusan: React.FC<DetailHasilKeputusanProps> = ({
  verificatorAverages = [],
  requiredFiles,
}) => {
  if (!verificatorAverages.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-4">
        <FaChartLine size={24} className="text-gray-400" />
        <p className="text-gray-500">Belum ada hasil penilaian.</p>
      </div>
    );
  }
  console.log(requiredFiles);

  const totalScore = verificatorAverages.reduce(
    (acc, verifier) => acc + verifier.average,
    0,
  );
  const overallAverage = totalScore / verificatorAverages.length;

  return (
    <div className="space-y-6 p-4">
      {requiredFiles.status === "approved" && (
        <div className="rounded-lg bg-green-100 p-4 shadow-lg">
          <h2 className="text-2xl font-bold text-green-700">
            Status Pengajuan Disetujui
          </h2>
          <p className="text-green-600">
            Hasil pengajuan mahasiswa bersifat final dengan status: Disetujui
          </p>
        </div>
      )}
      <div className="flex items-center gap-2 text-xl font-bold text-green-700">
        <FaChartLine />
        <h2>Hasil Penilaian</h2>
      </div>

      {verificatorAverages.map((verifier, index) => (
        <div
          key={index}
          className="relative rounded-lg border-l-4 border-green-500 bg-white p-4 shadow-sm"
        >
          <div className="mb-2 flex items-center gap-2 text-green-600">
            <FaUser />
            <span className="font-semibold">Nama Verifikator</span>
          </div>
          <input
            type="text"
            className="mb-4 w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700 focus:outline-none"
            value={verifier.name}
            disabled
          />

          <div className="mb-2 flex items-center gap-2 text-green-600">
            <FaStar />
            <span className="font-semibold">Nilai Rata-Rata</span>
          </div>
          <input
            type="text"
            className="mb-4 w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700 focus:outline-none"
            value={verifier.average.toFixed(2)}
            disabled
          />

          <div className="mb-2 flex items-center gap-2 text-green-600">
            <FaStickyNote />
            <span className="font-semibold">Catatan</span>
          </div>
          <textarea
            className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700 focus:outline-none"
            value={verifier.note || ""}
            disabled
          />
        </div>
      ))}

      <div className="rounded-lg bg-green-50 p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2 text-green-600">
          <FaChartLine />
          <span className="font-semibold">Total Rata-Rata Keseluruhan</span>
        </div>
        <input
          type="text"
          className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700 focus:outline-none"
          value={overallAverage.toFixed(2)}
          disabled
        />
      </div>
    </div>
  );
};

export default DetailHasilKeputusan;
