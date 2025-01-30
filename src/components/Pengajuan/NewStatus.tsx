"use client";

import React, { useEffect, useState } from "react";

type FileData = {
  file_name: string;
  status: string;
  file_url: string;
};

type SubmissionData = {
  title: string;
  status: string;
  pembimbing: { name: string; role: string }[];
  penguji: { name: string; role: string }[];
  jadwal_sidang: string | null;
  files: FileData[];
};

const StatusProposal = () => {
  const [submissionData, setSubmissionData] = useState<SubmissionData | null>(null);

  useEffect(() => {
    // Fetch data dari API
    const fetchData = async () => {
      try {
        const response = await fetch("/api/submission/proposal/1");
        const data = await response.json();
        if (data.message === "Submission data retrieved successfully") {
          setSubmissionData(data.data);
        }
      } catch (error) {
        console.error("Error fetching submission data:", error);
      }
    };

    fetchData();
  }, []);

  if (!submissionData) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  const { title, status, pembimbing, penguji, jadwal_sidang, files } = submissionData;

  return (
    <div className=" p-6 rounded-xl  w-[90%] mx-auto mt-10">
      {/* Title */}
      <h1 className="text-center text-2xl font-bold text-gray-800 mb-6">{title}</h1>

      {/* Status */}
      <div className="flex justify-between items-center bg-white shadow-sm p-4 rounded-lg mb-6">
        <span className="text-lg font-semibold text-gray-800">Status Pengajuan</span>
        <span
          className={`px-4 py-1 rounded-full text-white ${
            status === "Pending" ? "bg-yellow-500" : "bg-green-500"
          }`}
        >
          {status === "Pending" ? "Menunggu Keputusan" : status}
        </span>
      </div>

      {/* Jadwal Seminar */}
      <div className="bg-white shadow-sm p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-800">Jadwal Seminar</h3>
        <p className="text-gray-600 mt-2">
          {jadwal_sidang ? jadwal_sidang : "Hari, Tanggal-Bulan-Tahun-Jam"}
        </p>
      </div>

      {/* Pembimbing dan Penguji */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Pembimbing */}
        <div className="bg-white shadow-sm p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-4">Pembimbing</h4>
          {pembimbing.length > 0 ? (
            pembimbing.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-100 p-3 rounded-lg mb-2"
              >
                <span className="text-gray-600">{item.name}</span>
                <span className="text-sm bg-yellow-500 text-white px-3 py-1 rounded-full">
                  Pending
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Belum ada pembimbing</p>
          )}
        </div>

        {/* Penguji */}
        <div className="bg-white shadow-sm p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-4">Penguji</h4>
          {penguji.length > 0 ? (
            penguji.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-100 p-3 rounded-lg mb-2"
              >
                <span className="text-gray-600">{item.name}</span>
                <span className="text-sm bg-yellow-500 text-white px-3 py-1 rounded-full">
                  Pending
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Belum ada penguji</p>
          )}
        </div>
      </div>

      {/* File Proposal */}
      <div className="bg-white shadow-sm p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800">File Proposal</h3>
        {files.length > 0 ? (
          files.map((file, index) => (
            <div key={index} className="mt-4">
              <p className="text-gray-700">
                {file.file_name} - Status:{" "}
                <span
                  className={`${
                    file.status === "Approved"
                      ? "text-green-500"
                      : file.status === "Pending"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {file.status}
                </span>
              </p>
              <a
                href={file.file_url}
                className="text-blue-500 mt-2 inline-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                Lihat File
              </a>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-4">Belum ada file yang diajukan.</p>
        )}
      </div>

      {/* Detail Button */}
      <div className="flex justify-end mt-6">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700">
          Detail
        </button>
      </div>
    </div>
  );
};

export default StatusProposal;
