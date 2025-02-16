"use client"

import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaSearch } from "react-icons/fa";


interface Verificator {
  id: string;
  type: string; // Pembimbing or Penguji
  status: string;
  submissionId: string;
  lecturerId: string;
}

interface Application {
  id: string;
  title: string;
  status: string;
  submissionDate: string;
  result: string;
  User: {
    name: string;
    nim: string;
  };
  Verificator: Verificator[];
}

const ListPengajuan = ({ slug }: { slug: string }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    if (!slug) return; // If slug is not available, stop fetching

    const fetchSubmissions = async () => {
      try {
        const response = await fetch(`/api/submission?type=${slug}`);
        const result = await response.json();
        if (response.ok) {
          setApplications(result.formattedSubmissions); // Store data
        } else {
          console.error("Failed to fetch submissions:", result.message);
        }
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [slug]);

  const handleEdit = (id: string) => {
    console.log(`Editing submission with ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    console.log(`Deleting submission with ID: ${id}`);
  };

  const handleResult = (id: string) => {
    console.log(`Viewing result for submission with ID: ${id}`);
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading message while data is being fetched
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
        Pengajuan Laporan Proposal Skripsi
      </h2>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="py-2 px-4 text-left font-semibold">No</th>
              <th className="py-2 px-4 text-left font-semibold">Judul</th>
              <th className="py-2 px-4 text-left font-semibold">Verifikator</th>
              <th className="py-2 px-4 text-left font-semibold">Status</th>
              <th className="py-2 px-4 text-left font-semibold">Tanggal Pengajuan</th>
              <th className="py-2 px-4 text-left font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-600">No data available</td>
              </tr>
            ) : (
              applications.map((application, index) => (
                <tr key={application.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 font-medium">{application.title}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1">
                      {application.Verificator.map((verifier, idx) => (
                        <div
                          key={verifier.id}
                          className={`px-3 py-1 rounded-full text-xs ${
                            verifier.type === "Pembimbing"
                              ? "bg-yellow-200 text-yellow-600"
                              : "bg-blue-200 text-blue-600"
                          }`}
                        >
                          {verifier.type}: {verifier.status}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        application.status === "Pending"
                          ? "bg-yellow-200 text-yellow-600"
                          : application.status === "Approved"
                          ? "bg-green-200 text-green-600"
                          : "bg-red-200 text-red-600"
                      }`}
                    >
                      {application.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{application.submissionDate}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(application.id)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(application.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        <FaTrashAlt /> Hapus
                      </button>
                      {/* <button
                        onClick={() => handleResult(application.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                      >
                        <FaSearch /> Hasil
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListPengajuan;
