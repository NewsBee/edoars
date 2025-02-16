"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormatTypeProps {
  idtipe: string; // Accept idtipe as a prop
}

const FormatType: React.FC<FormatTypeProps> = ({ idtipe }) => {
  const [data, setData] = useState<any[]>([]); // Format data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error handling state
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [pageSize] = useState(10); // Items per page
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false); // Modal state
  const [formatToDelete, setFormatToDelete] = useState<string | null>(null); // ID of the format to delete

  const router = useRouter();

  useEffect(() => {
    if (!idtipe) return; // Ensure idtipe is available

    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch data from API with dynamic type ID (idtipe)
        const response = await fetch(`/api/format/type/${idtipe}`);
        const result = await response.json();

        if (response.ok) {
          setData(result.formats); // Set the formats data
        } else {
          setError(result.message || "Something went wrong!");
        }
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false); // Hide loader after data fetch is complete
      }
    };

    fetchData();
  }, [idtipe]); // Fetch data when `idtipe` changes

  const handlePagination = (page: number) => {
    setCurrentPage(page);
  };

  const handleTambah = () => {
    router.push(`/admin/tipe-pengajuan-berkas/${idtipe}/format/tambah`);
  };

  const handleUbah = (id: string) => {
    // Logic for "Ubah" (Edit)
    router.push(`/admin/tipe-pengajuan-berkas/${idtipe}/format/${id}/edit`);
  };

  const handleHapus = (id: string) => {
    // Set the ID of the format to delete and show modal
    setFormatToDelete(id);
    console.log(id);
    setDeleteConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (formatToDelete) {
      try {
        const response = await fetch(`/api/format/${formatToDelete}`, {
          method: "DELETE",
        });

        const result = await response.json();
        if (response.ok) {
          setData(data.filter((item) => item.id !== formatToDelete)); // Update data by removing deleted format
          setDeleteConfirmModal(false); // Close the modal
      
          toast.success(result.message);
        } else {
        
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Error deleting format:", error);
        toast.error("Failed to delete format");
      }
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmModal(false); // Close the modal without deleting
  };

  // Get the data for the current page
  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 space-y-8 p-8">
      {/* Add Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleTambah}
          className="transform rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-2 text-white shadow-md transition duration-300 hover:scale-105 focus:outline-none"
        >
          Tambah Format
        </button>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-lg ">
        <table className="min-w-full table-auto border-collapse rounded-lg bg-gray-50 shadow-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                No
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Nama
              </th>

              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-gray-600">
                  <div className="animate-pulse space-y-4">
                    {/* Skeleton Loader for Table */}
                    <div className="mx-auto h-8 w-32 rounded bg-gray-300"></div>
                    <div className="mx-auto h-6 w-24 rounded bg-gray-300"></div>
                    <div className="mx-auto h-6 w-20 rounded bg-gray-300"></div>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-gray-600">
                  Tidak ada format yang ditemukan untuk tipe ini
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b transition duration-200 ease-in-out hover:bg-gray-100"
                >
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.name}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.is_primary ? "Format Utama" : "Format cadangan"}
                  </td>
                  <td className="flex gap-4 px-6 py-4 text-sm">
                    <button
                      onClick={() => handleUbah(item.id)}
                      className="rounded-md bg-blue-500 p-2 text-white transition duration-200 ease-in-out hover:bg-blue-600"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleUbah(item.id)}
                      className="rounded-md bg-orange-500 p-2 text-white transition duration-200 ease-in-out hover:bg-orange-600"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleHapus(item.id)}
                      className="rounded-md bg-red-500 p-2 text-white transition duration-200 ease-in-out hover:bg-red-600"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-gray-600">
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, data.length)} of {data.length}{" "}
          entries
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePagination(currentPage - 1)}
            className={`rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 ${
              currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            onClick={() => handlePagination(currentPage + 1)}
            className={`rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 ${
              currentPage * pageSize >= data.length
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
            disabled={currentPage * pageSize >= data.length}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal Confirm Delete */}
      {deleteConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-700">
              Konfirmasi Hapus
            </h2>
            <p className="text-sm text-gray-600">
              Apakah Anda yakin ingin menghapus format ini?
            </p>
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="rounded-md bg-gray-300 px-4 py-2 text-gray-700"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-white"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="mt-6 text-sm text-red-600">
        <p>
          <strong>Catatan:</strong> Format yang telah dipakai pada pengajuan
          mahasiswa maka tidak bisa dilakukan edit atau dihapus, tetapi bisa
          diubah statusnya.
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FormatType;
