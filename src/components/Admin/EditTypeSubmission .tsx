"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditTypeSubmission = ({ id }: { id: string }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Aktif",
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Fetch data berdasarkan ID
  useEffect(() => {
    if (!id) return; // Pastikan ID ada

    const fetchTypeData = async () => {
      try {
        const response = await fetch(`/api/tipe-pengajuan-berkas/${id}`);
        if (!response.ok) {
          throw new Error("Gagal memuat data.");
        }
        const data = await response.json();
        setFormData({
          name: data.type.name,
          description: data.type.description,
          status: data.type.status === "active" ? "Aktif" : "Non Aktif",
        });
      } catch (error: any) {
        toast.error(error.message || "Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTypeData();
  }, [id]);

  // Handle input perubahan
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/tipe-pengajuan-berkas/${id}`, {
        method: "PUT",
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

      toast.success("Tipe pengajuan berhasil diperbarui!");

      // Arahkan kembali ke halaman sebelumnya
      setTimeout(() => {
        router.push("/admin/tipe-pengajuan-berkas");
      }, 2000);
    } catch (error) {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-6">Memuat data...</div>;
  }

  return (
    <div className="w-full bg-white p-8 shadow-md rounded-lg">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-xl font-bold text-gray-800 mb-6">Ubah Tipe Pengajuan</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
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
            disabled={isSubmitting}
            className={`px-6 py-2 text-white rounded-lg shadow-md ${
              isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTypeSubmission;
