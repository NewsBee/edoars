"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

interface DetailProsesProps {
  submissionData: any;
  isAdmin?: boolean;
}

// ke value <input type="datetime-local">
const toDatetimeLocal = (d?: string | Date | null) => {
  if (!d) return "";
  const dt = typeof d === "string" ? new Date(d) : d;
  return new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16); // YYYY-MM-DDTHH:mm
};

// untuk display: "29/9/2025, 13:00"
const formatID = (d?: string | Date | null) => {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "";
  const day = date.getDate();                // tanpa leading zero
  const month = date.getMonth() + 1;         // tanpa leading zero
  const year = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year}, ${hh}:${mm}`;
};

const DetailProses: React.FC<DetailProsesProps> = ({ submissionData, isAdmin }) => {
  const initialDate = useMemo(() => {
    if (isAdmin) {
      return toDatetimeLocal(submissionData.jadwal ?? submissionData.requestJadwal);
    }
    return toDatetimeLocal(submissionData.requestJadwal);
  }, [isAdmin, submissionData]);

  const [seminarDate, setSeminarDate] = useState<string>(initialDate);
  const [statusChecked, setStatusChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setSeminarDate(initialDate);
  }, [initialDate]);

  const handleCheckboxChange = () => setStatusChecked(true);

  const handleSubmitStudent = async () => {
    try {
      const response = await fetch(`/api/submission/${submissionData.id}/jadwalrequest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestJadwal: seminarDate || null,
          isReadyToBeProcessed: true,
          isAdmin: false,
        }),
      });
      if (response.ok) {
        toast.success("Jadwal berhasil diajukan");
        window.location.reload();
      } else {
        const data = await response.json();
        toast.error(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error submitting jadwal:", error);
      toast.error("Error submitting jadwal");
    }
    setIsModalOpen(false);
  };

  const handleSubmitAdmin = async () => {
    try {
      const response = await fetch(`/api/submission/${submissionData.id}/jadwalrequest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestJadwal: seminarDate || null, // server treat as 'jadwal' untuk admin
          isReadyToBeProcessed: true,
          isAdmin: true,
        }),
      });
      if (response.ok) {
        toast.success("Jadwal resmi disimpan");
        window.location.reload();
      } else {
        const data = await response.json();
        toast.error(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error admin saving jadwal:", error);
      toast.error("Gagal menyimpan jadwal");
    }
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      {!isAdmin && !submissionData.isReadyToBeProcessed && (
        <div className="rounded-md bg-blue-500 p-4 text-white">
          <h2 className="text-3xl font-bold">Ajukan Proses Pengajuan</h2>
          <p className="mt-2">Pilih tanggal untuk jadwal seminar anda.</p>
        </div>
      )}
      {!isAdmin && submissionData.isReadyToBeProcessed && (
        <div className="rounded-md bg-green-500 p-4 text-white">
          <h2 className="text-3xl font-bold">Proses Pengajuan Siap</h2>
          <p className="mt-2">Anda telah menyetujui dan siap diproses.</p>
        </div>
      )}
      {isAdmin && (
        <div className="rounded-md bg-slate-800 p-4 text-white">
          <h2 className="text-2xl font-semibold">Panel Admin – Penetapan/Perubahan Jadwal</h2>
          <p className="text-sm opacity-90">Anda dapat menetapkan atau mengubah jadwal resmi kapan pun.</p>
        </div>
      )}

      {/* S&K (sembunyikan untuk admin) */}
      {!isAdmin && (
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <h3 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">Syarat & Ketentuan</h3>
          <ul className="list-disc space-y-2 pl-5">
            <li className="text-sm text-gray-700 dark:text-gray-300">Semua dokumen persyaratan telah diunggah dan diverifikasi.</li>
            <li className="text-sm text-gray-700 dark:text-gray-300">Proposal penelitian telah disetujui oleh pembimbing.</li>
            <li className="text-sm text-gray-700 dark:text-gray-300">Jadwal seminar telah disepakati oleh semua pihak terkait.</li>
            <li className="text-sm text-gray-700 dark:text-gray-300">Semua biaya administrasi telah dilunasi.</li>
          </ul>
        </div>
      )}

      <div className="border-t border-gray-300 dark:border-gray-700" />

      {/* Jadwal */}
      <div className="bg-white p-6 dark:bg-gray-800">
        <h3 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">Jadwal Seminar</h3>

        {/* Info request (admin saja) */}
        {isAdmin && (
          <div className="mb-4 rounded-md bg-slate-100 p-3 text-sm dark:bg-slate-700 dark:text-slate-100">
            Permintaan Jadwal Mahasiswa:{" "}
            <strong>{submissionData.requestJadwal ? formatID(submissionData.requestJadwal) : "— (tidak ada permintaan)"}</strong>
          </div>
        )}

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {isAdmin ? "Tetapkan/ubah Jadwal Resmi:" : "Pilih Tanggal Seminar:"}
          </label>
          <input
            type="datetime-local"
            value={seminarDate}
            onChange={(e) => setSeminarDate(e.target.value)}
            className="w-full border border-gray-300 p-2 dark:bg-gray-700 dark:text-white"
            disabled={!isAdmin && submissionData.isReadyToBeProcessed}
          />
          {/* Preview dengan format yang kamu mau */}
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {seminarDate ? (
              (() => {
              const now = new Date();
              const seminar = new Date(seminarDate);
              const diffMs = seminar.getTime() - now.getTime();
              const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
              return (
                <span
                  className={`inline-flex items-center rounded px-3 py-1 text-sm font-medium ${
                    diffDays > 0
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : diffDays === 0
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {diffDays > 0
                    ? `Seminar dijadwalkan dalam ${diffDays} hari`
                    : diffDays === 0
                    ? "Seminar dijadwalkan hari ini"
                    : `Jadwal seminar telah berlalu ${Math.abs(diffDays)} hari yang lalu`}
                </span>
              );
              })()
            ) : (
              <span className="font-medium">—</span>
            )}
            </p>

          {!isAdmin && (
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Anda dapat mengajukan jadwal. Rekomendasi jadwal hanya satu minggu ke depan; jadwal final diputuskan admin.
            </p>
          )}
        </div>

        {/* Jadwal resmi ditetapkan */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Jadwal yang Ditetapkan:</label>
          <input
            type="text"
            value={
              submissionData.jadwal
                ? formatID(submissionData.jadwal)
                : "Jadwal belum ditentukan"
            }
            readOnly
            className="w-full border border-gray-300 p-2 dark:bg-gray-700 dark:text-white"
            disabled
          />
        </div>
      </div>

      <div className="border-t border-gray-300 dark:border-gray-700" />

      {/* Checkbox (hanya mahasiswa) */}
      {!isAdmin && (
        <div className="rounded-lg bg-blue-100 p-6 shadow-md dark:bg-gray-800">
          <p className="mb-4 text-lg font-medium text-gray-700 dark:text-gray-300">Dengan ini menyatakan bahwa:</p>
          <div className="mb-2 flex items-center">
            <input
              type="checkbox"
              checked={submissionData.isReadyToBeProcessed ? true : statusChecked}
              onChange={() => setStatusChecked(true)}
              className="h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={submissionData.isReadyToBeProcessed}
            />
            <label className="ml-3 text-sm text-gray-600 dark:text-gray-400">
              Setuju terhadap syarat dan ketentuan yang berlaku di atas.
            </label>
          </div>
          {submissionData.isReadyToBeProcessed && (
            <p className="ml-8 text-sm text-blue-800 dark:text-blue-200">
              Anda telah menyetujui syarat dan ketentuan ini pada tanggal {formatID(submissionData.updatedAt)}
            </p>
          )}
        </div>
      )}

      {/* Tombol aksi */}
      {!isAdmin && !submissionData.isReadyToBeProcessed && (
        <div className="bg-white p-6 dark:bg-gray-800">
          <button
            onClick={() => setIsModalOpen(true)}
            className={`w-full p-2 text-white ${statusChecked ? "bg-blue-500 hover:bg-blue-700" : "cursor-not-allowed bg-gray-400"}`}
            disabled={!statusChecked}
          >
            Submit
          </button>
        </div>
      )}

      {isAdmin && (
        <div className="bg-white p-6 dark:bg-gray-800">
          <button onClick={handleSubmitAdmin} className="w-full rounded bg-emerald-600 p-2 text-white hover:bg-emerald-700">
            Simpan / Perbarui Jadwal Resmi
          </button>
        </div>
      )}

      {/* Modal konfirmasi (mahasiswa) */}
      {!isAdmin && isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Konfirmasi</h2>
            <p className="mb-4">Apakah anda yakin ingin mengajukan jadwal seminar?</p>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setIsModalOpen(false)} className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400">
                Batal
              </button>
              <button onClick={handleSubmitStudent} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">
                Ya, Ajukan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailProses;
