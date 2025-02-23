"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaCalendarAlt,
  FaDownload,
  FaFileAlt,
  FaRegCheckCircle,
  FaRegTimesCircle,
} from "react-icons/fa"; // React Icons

const DetailPengumuman = ({ id }: { id: string }) => {
  const [judul, setJudul] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState<Boolean>(true);
  const [file, setFile] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch(`/api/pengumuman/${id}`);
        if (response.ok) {
          const result = await response.json();
          console.log(result);
          setJudul(result.serializedAnnouncement.judul);
          setDesc(result.serializedAnnouncement.description);
          setFile(result.serializedAnnouncement.fileLampiran);
          setStatus(result.serializedAnnouncement.status);
          setCreatedAt(result.serializedAnnouncement.createdAt);
        } else {
          throw new Error("Failed to fetch announcement");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Gagal memuat pengumuman. Silakan coba lagi.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    };

    fetchAnnouncement();
  }, [id]);
  const handleDownload = () => {
    window.open(file, "_blank");
  }

  return (
    <div className="container mx-auto p-8">
      <ToastContainer />
      <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <h2 className="mb-8 text-center text-4xl font-bold text-gray-800 dark:text-gray-100">
          {judul}
        </h2>

        <div className="space-y-8">
          {/* Judul */}
          <div>
            <h3 className="flex items-center text-2xl font-semibold text-gray-700 dark:text-gray-300">
              <FaFileAlt className="mr-2 text-blue-600" /> File Lampiran
            </h3>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              <button
                onClick={() => handleDownload()} // Handle the download logic
                className="flex items-center rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FaDownload className="mr-2" /> Download File
              </button>
            </p>
          </div>
          {/* Isi Pengumuman */}
          <div>
            <h3 className="flex items-center text-2xl font-semibold text-gray-700 dark:text-gray-300">
              <FaFileAlt className="mr-2 text-blue-600" /> Isi Pengumuman
            </h3>
            <div
              className="mt-2 text-lg text-gray-600 dark:text-gray-400"
              dangerouslySetInnerHTML={{ __html: desc }}
            />
          </div>
          {/* Status */}
          <div>
            <h3 className="flex items-center text-2xl font-semibold text-gray-700 dark:text-gray-300">
              <FaRegCheckCircle className="mr-2 text-blue-600" /> Status
            </h3>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              {status ? (
                <span className="font-bold text-green-600">Aktif</span>
              ) : (
                <span className="font-bold text-red-600">Tidak Aktif</span>
              )}
            </p>
          </div>
          {/* Tanggal Dibuat */}
          <div>
            <h3 className="flex items-center text-2xl font-semibold text-gray-700 dark:text-gray-300">
              <FaCalendarAlt className="mr-2 text-blue-600" /> Tanggal Dibuat
            </h3>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              {new Date(createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => router.back()}
            className="rounded-lg bg-gray-500 px-8 py-3 font-medium text-white transition duration-300 ease-in-out hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPengumuman;
