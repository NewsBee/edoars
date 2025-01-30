"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TypeSubmissionPage = () => {
  const [data, setData] = useState([]); // Menyimpan data dari API
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Halaman aktif
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Menampilkan modal konfirmasi hapus
  const [deleteId, setDeleteId] = useState<number | null>(null); // ID yang akan dihapus
  const itemsPerPage = 10; // Jumlah item per halaman
  const router = useRouter();

  // Fungsi untuk mengambil data dari API
  const fetchData = async () => {
    try {
      const response = await fetch("/api/tipe-pengajuan-berkas");
      if (!response.ok) {
        throw new Error("Gagal memuat data.");
      }
      const result = await response.json();
      setData(result.types); // Menyimpan data
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false); // Matikan indikator loading
    }
  };

  // Fetch data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi untuk Hapus Data
  const handleDelete = async (id: number) => {
    setDeleteId(id);
    setShowDeleteModal(true); // Menampilkan modal konfirmasi
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/tipe-pengajuan-berkas/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus data.");
      }

      toast.success("Data berhasil dihapus!");
      setShowDeleteModal(false);
      fetchData(); // Refresh data setelah penghapusan
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat menghapus data.");
      setShowDeleteModal(false);
    }
  };

  // Fungsi untuk Edit Data
  const handleEdit = (id: number) => {
    router.push(`/admin/tipe-pengajuan-berkas/edit/${id}`);
  };

  // Data yang ditampilkan per halaman
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Menghitung jumlah total halaman
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="w-full bg-white p-6 shadow-md rounded-lg">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold text-gray-800">Tipe Pengajuan Berkas</h1>
        <button
          onClick={() => router.push("/admin/tipe-pengajuan-berkas/tambah")}
          className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600"
        >
          Tambah
        </button>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 border-b border-gray-200 w-12">No</th>
              <th className="py-3 px-6 border-b border-gray-200 w-1/2">Nama</th>
              <th className="py-3 px-6 border-b border-gray-200 w-1/6 text-center">
                Status
              </th>
              <th className="py-3 px-6 border-b border-gray-200 w-1/4 text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {loading ? (
              <tr>
                <td colSpan={4} className="py-4 px-6">
                  <div className="animate-pulse flex space-x-4">
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item: any, index: number) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="py-3 px-6 text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="py-3 px-6 break-words">
                    <div>
                      <span className="font-medium text-gray-800">{item.name}</span>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        item.status === "active"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {item.status === "active" ? "Aktif" : "Non Aktif"}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="px-3 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                      >
                        Ubah
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600"
                      >
                        Hapus
                      </button>
                      <button className="px-3 py-2 text-sm text-white bg-gray-500 rounded-lg hover:bg-gray-600">
                        Format
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-500">
                  Tidak ada data yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Konfirmasi Penghapusan
            </h2>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus data ini?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer dengan Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Menampilkan {paginatedData.length} dari {data.length} entri
        </p>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded-lg text-sm ${
              currentPage === 1 ? "bg-gray-300 text-gray-600" : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-4 py-1 bg-blue-500 text-white rounded-lg">{currentPage}</span>
          <button
            className={`px-3 py-1 rounded-lg text-sm ${
              currentPage === totalPages ? "bg-gray-300 text-gray-600" : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Catatan */}
      <p className="mt-4 text-sm text-red-500 font-medium">
        Pastikan bahwa pengajuan memiliki format yang dipakai agar mahasiswa bisa melakukan pengajuan.
      </p>
    </div>
  );
};

export default TypeSubmissionPage;
