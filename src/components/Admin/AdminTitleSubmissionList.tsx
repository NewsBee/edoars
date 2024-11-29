"use client";

import React, { useState, useEffect } from "react";
import { FaSearch, FaEye } from "react-icons/fa";

type User = {
  id: number;
  name: string;
  email: string;
  nim: string;
};

type Lecturer = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type Submission = {
  id: number;
  user: User;
  title: string;
  topic: string;
  abstract: string;
  status: string;
  createdAt: string;
  lecturers: Lecturer[];
};

const AdminTitleSubmissionList = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch("/api/title-submission");
        if (!response.ok) {
          throw new Error("Gagal mengambil data pengajuan");
        }
        const data = await response.json();
        setSubmissions(data.submissions || []);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };

    fetchSubmissions();
  }, []);

  const statusOrder: { [key: string]: number } = {
    Pending: 1,
    Rejected: 2,
    Approved: 3,
  };

  const filteredSubmissions = submissions
    .filter((submission) => {
      const matchesFilter =
        filterStatus === "" || submission.status === filterStatus;
      const matchesSearch =
        submission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.user?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        submission.user?.nim?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      const statusA = statusOrder[a.status] || 0;
      const statusB = statusOrder[b.status] || 0;
      return statusA - statusB;
    });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        Daftar Pengajuan Judul
      </h1> */}

      {/* Filter dan Search */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Cari judul, nama, atau NIM"
          className="w-full md:w-2/3 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="w-full md:w-1/3 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Semua Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Tabel Pengajuan */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-md">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-blue-100">
              <th className="px-4 py-4 text-left text-gray-700 font-semibold">
                Nomor
              </th>
              <th className="px-4 py-4 text-left text-gray-700 font-semibold">
                Nama Mahasiswa
              </th>
              <th className="px-4 py-4 text-left text-gray-700 font-semibold">
                NIM
              </th>
              <th className="px-4 py-4 text-left text-gray-700 font-semibold">
                Judul Penelitian
              </th>
              <th className="px-4 py-4 text-left text-gray-700 font-semibold">
                Status
              </th>
              <th className="px-4 py-4 text-left text-gray-700 font-semibold">
                Tanggal Pengajuan
              </th>
              <th className="px-4 py-4 text-center text-gray-700 font-semibold">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((submission, index) => (
                <tr
                  key={submission.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-blue-50`}
                >
                  <td className="px-4 py-4 text-gray-800">{index + 1}</td>
                  <td className="px-4 py-4 text-gray-800">
                    {submission.user?.name || "Tidak tersedia"}
                  </td>
                  <td className="px-4 py-4 text-gray-800">
                    {submission.user?.nim || "Tidak tersedia"}
                  </td>
                  <td className="px-4 py-4 text-gray-800">
                    {submission.title}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        submission.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : submission.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-800">
                    {new Date(submission.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                      onClick={() =>
                        (window.location.href = `/kaprodi/pengajuan/${submission.id}`)
                      }
                    >
                      <FaEye className="inline mr-1" /> Lihat Detail
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                  Tidak ada data yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTitleSubmissionList;
