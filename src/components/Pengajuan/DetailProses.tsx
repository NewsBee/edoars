"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

interface DetailProsesProps {
  submissionData: any;
}

const DetailProses: React.FC<DetailProsesProps> = ({ submissionData }) => {
  const [seminarDate, setSeminarDate] = useState("");
  const [statusChecked, setStatusChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCheckboxChange = () => {
    setStatusChecked(!statusChecked);
  };

  console.log(submissionData.id);
  console.log(submissionData);
  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `/api/submission/${submissionData.id}/jadwalrequest`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestJadwal: seminarDate,
            isReadyToBeProcessed: statusChecked,
          }),
        },
      );

      if (response.ok) {
        toast.success("Jadwal berhasil diajukan");
        window.location.reload(); // Refresh the component
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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header Section */}
      {!submissionData.isReadyToBeProcessed && (
        <div className="rounded-md bg-blue-500 p-4 text-white">
          <h2 className="text-3xl font-bold">Ajukan Proses Pengajuan</h2>
          <p className="mt-2">Pilih tanggal untuk jadwal seminar anda.</p>
        </div>
      )}
      {submissionData.isReadyToBeProcessed && (
        <div className="rounded-md bg-green-500 p-4 text-white">
          <h2 className="text-3xl font-bold">Proses Pengajuan Siap</h2>
          <p className="mt-2">Anda telah menyetujui dan siap diproses.</p>
        </div>
      )}

      {/* Syarat & Ketentuan Section */}
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <h3 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Syarat & Ketentuan
        </h3>
        <ul className="list-disc space-y-2 pl-5">
          <li className="text-sm text-gray-700 dark:text-gray-300">
            Semua dokumen persyaratan telah diunggah dan diverifikasi.
          </li>
          <li className="text-sm text-gray-700 dark:text-gray-300">
            Proposal penelitian telah disetujui oleh pembimbing.
          </li>
          <li className="text-sm text-gray-700 dark:text-gray-300">
            Jadwal seminar telah disepakati oleh semua pihak terkait.
          </li>
          <li className="text-sm text-gray-700 dark:text-gray-300">
            Semua biaya administrasi telah dilunasi.
          </li>
        </ul>
      </div>

      {/* Divider Section */}
      <div className="border-t border-gray-300 dark:border-gray-700"></div>

      {/* Seminar Date Input Section */}
      <div className="bg-white p-6 dark:bg-gray-800">
        <h3 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Jadwal Seminar
        </h3>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Pilih Tanggal Seminar:
          </label>
          <input
            type="datetime-local"
            value={
              submissionData.requestJadwal
                ? new Date(submissionData.requestJadwal)
                    .toISOString()
                    .slice(0, 16) // Format sesuai datetime-local
                : seminarDate
            }
            onChange={(e) => setSeminarDate(e.target.value)}
            className="w-full border border-gray-300 p-2 dark:bg-gray-700 dark:text-white"
            disabled={submissionData.isReadyToBeProcessed}
          />
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Anda dapat melakukan permintaan jadwal pelaksanaan seminar anda
            dengan mengisi input diatas, jika anda tidak menginginkannya maka
            cukup biarkan kosong.
            <br />
            <span className="font-semibold">Rekomendasi jadwal</span> yang dapat
            dipilih hanyalah satu minggu kedepan dari hari ini, namun hal
            tersebut tidak menutup kemungkinan bahwa jadwal pelaksanaan seminar
            anda dapat diputuskan oleh staff bagian administrasi lebih awal.
          </p>
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Jadwal yang Ditetapkan:
          </label>
          <input
            type="text"
            value={
              submissionData.jadwal
                ? submissionData.jadwal
                : "Jadwal belum ditentukan"
            }
            readOnly
            className="w-full border border-gray-300 p-2 dark:bg-gray-700 dark:text-white"
            disabled
          />
        </div>
      </div>
      <div className="border-t border-gray-300 dark:border-gray-700"></div>

      {/* Confirmation Checkbox */}
      <div className="rounded-lg bg-blue-100 p-6 shadow-md dark:bg-gray-800">
        <p className="mb-4 text-lg font-medium text-gray-700 dark:text-gray-300">
          Dengan ini menyatakan bahwa:
        </p>
        <div className="mb-2 flex items-center">
          <input
            type="checkbox"
            checked={submissionData.isReadyToBeProcessed ? true : statusChecked}
            onChange={handleCheckboxChange}
            className="h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
            disabled={submissionData.isReadyToBeProcessed}
          />
          <label className="ml-3 text-sm text-gray-600 dark:text-gray-400">
            Setuju terhadap syarat dan ketentuan yang berlaku diatas.
          </label>
        </div>
        {submissionData.isReadyToBeProcessed && (
          <p className="ml-8 text-sm text-blue-800 dark:text-blue-200">
            Anda telah menyetujui syarat dan ketentuan ini pada tanggal{" "}
            {submissionData.updatedAt}
          </p>
        )}
      </div>

      {/* Submit Button */}
      {!submissionData.isReadyToBeProcessed && (
        <div className="bg-white p-6 dark:bg-gray-800">
          <button
            onClick={openModal}
            className={`w-full p-2 text-white ${statusChecked ? "bg-blue-500 hover:bg-blue-700" : "cursor-not-allowed bg-gray-400"}`}
            disabled={!statusChecked}
          >
            Submit
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Konfirmasi</h2>
            <p className="mb-4">
              Apakah anda yakin ingin mengajukan jadwal seminar?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
              >
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
