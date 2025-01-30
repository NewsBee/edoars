"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddTypeSubmission = () => {
  const router = useRouter(); // Untuk navigasi setelah submit
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Aktif",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false); // Untuk modal konfirmasi

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/tipe-pengajuan-berkas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(`Error: ${data.message}`);
        setIsSubmitting(false);
        return;
      }

      toast.success("Tipe pengajuan berhasil ditambahkan!");

      // Arahkan ke halaman sebelumnya setelah 2 detik
      setTimeout(() => {
        router.push("/admin/tipe-pengajuan-berkas");
      }, 2000);
    } catch (error) {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
      setShowModal(false); // Tutup modal
    }
  };

  return (
    <div className="w-full bg-white p-8 shadow-md rounded-lg">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-xl font-bold text-gray-800 mb-6">
        Tambah Tipe Pengajuan
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setShowModal(true); // Tampilkan modal konfirmasi
        }}
        className="space-y-6"
      >
        {/* Nama */}
        <div className="w-full">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nama <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-100 focus:outline-none"
          />
        </div>

        {/* Deskripsi */}
        <div className="w-full">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Deskripsi <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            required
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-100 focus:outline-none"
          ></textarea>
        </div>

        {/* Status */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700">
            Status <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-6 mt-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="status"
                value="Aktif"
                checked={formData.status === "Aktif"}
                onChange={handleInputChange}
                className="form-radio text-blue-500"
              />
              <span className="ml-2 text-gray-700">Aktif</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="status"
                value="Non Aktif"
                checked={formData.status === "Non Aktif"}
                onChange={handleInputChange}
                className="form-radio text-red-500"
              />
              <span className="ml-2 text-gray-700">Non Aktif</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end w-full">
          <button
            type="submit"
            className="px-6 py-2 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600"
          >
            Simpan Data
          </button>
        </div>
      </form>

      {/* Modal Konfirmasi */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Konfirmasi Pengisian
            </h2>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menyimpan data ini?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-4 py-2 text-white rounded-lg shadow-md ${
                  isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isSubmitting ? "Menyimpan..." : "Ya, Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTypeSubmission;
