"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";

// Tipe data untuk proposal
type Pembimbing = {
  name: string;
  email: string;
};

type Penguji = {
  name: string;
  email: string;
};

type File = {
  file_name: string;
  status: string;
  file_url: string;
};

type ProposalData = {
  id: number;
  title: string;
  status: string;
  pembimbing: Pembimbing[];
  penguji: Penguji[];
  jadwal_sidang: string;
  files: File[];
};

// Komponen StatusProposal
const StatusProposal: React.FC<{ userId: number }> = ({ userId }) => {
  const [data, setData] = useState<ProposalData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/submission/proposal/${userId}`);
        if (!response.ok) {
          throw new Error("Data tidak ditemukan");
        }
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.log(error)
        setError("Gagal mengambil data. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="spinner-border text-blue-500" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="text-gray-500 mt-4">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center text-gray-500">
          <p>Tidak ada data yang ditemukan untuk proposal ini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7fbff] to-white p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <h1 className="text-2xl font-semibold text-center text-gray-900 mb-8">
          {data.title}
        </h1>

        {/* Status Proposal */}
        <div className="flex justify-between items-center bg-blue-50 rounded-md p-4 mb-6 shadow-sm border border-blue-100">
          <div className="text-base font-medium text-blue-700 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1 4v-4h-1m1-4h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
              />
            </svg>
            Status Proposal
          </div>
          <div
            className={`text-sm font-semibold px-4 py-1 rounded-full ${
              data.status === "Pending"
                ? "bg-yellow-100 text-yellow-600"
                : data.status === "Approved"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {data.status}
          </div>
        </div>

        {/* Jadwal Sidang */}
        <div className="bg-gray-100 rounded-md p-4 mb-6 shadow-sm border border-gray-200">
          <div className="text-gray-700 font-medium flex items-center gap-2 mb-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 9h10m-10 4h4m-4 4h10M3 21h18M3 21a2 2 0 01-2-2m20 2a2 2 0 002-2m-2 2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v16"
              />
            </svg>
            Jadwal Sidang
          </div>
          <div className="text-gray-600 text-sm">{data.jadwal_sidang}</div>
        </div>

        {/* Pembimbing dan Penguji */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pembimbing */}
          <div className="bg-gray-50 shadow-md rounded-md p-4 border-t-4 border-blue-600">
            <h3 className="text-base font-bold text-gray-700 mb-4">Pembimbing</h3>
            {data.pembimbing.map((supervisor, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white p-3 rounded-md mb-2 shadow-sm border"
              >
                <span className="text-gray-700 font-medium">{supervisor.name}</span>
                <span className="text-gray-600 text-sm">{supervisor.email}</span>
              </div>
            ))}
          </div>

          {/* Penguji */}
          <div className="bg-gray-50 shadow-md rounded-md p-4 border-t-4 border-blue-600">
            <h3 className="text-base font-bold text-gray-700 mb-4">Penguji</h3>
            {data.penguji.map((reviewer, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white p-3 rounded-md mb-2 shadow-sm border"
              >
                <span className="text-gray-700 font-medium">{reviewer.name}</span>
                <span className="text-gray-600 text-sm">{reviewer.email}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Files */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Files</h3>
          {data.files.length > 0 ? (
            data.files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white p-4 mb-4 rounded-md shadow-sm border"
              >
                <span className="text-gray-700">{file.file_name}</span>
                <a
                  href={file.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {file.status === "Pending" ? "Download" : "File Sudah Diterima"}
                </a>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Tidak ada file untuk ditampilkan.</p>
          )}
        </div>

        {/* Button */}
        <div className="mt-8 text-center">
          <Link href="/pengajuan/proposal/berkas" legacyBehavior>
            <a
              href="/pengajuan/proposal/berkas"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition duration-300"
            >
              Detail Proposal
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StatusProposal;
