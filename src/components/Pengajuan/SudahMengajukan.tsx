"use client";

import React, { useState } from "react";
import {
  FaBook,
  FaTag,
  FaClipboard,
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

const ExistingSubmission = ({ submission }: { submission: any }) => {
  if (!submission) {
    return (
      <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
        <ToastContainer position="top-right" autoClose={3000} />
        <h2 className="text-2xl font-semibold text-gray-800">
          Pengajuan Tidak Ditemukan
        </h2>
        <p className="text-gray-600">
          Anda belum pernah mengajukan judul. Silakan ajukan judul terlebih
          dahulu.
        </p>
      </div>
    );
  }
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: submission.title,
    topic: submission.topic || "",
    abstract: submission.abstract,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log(submission)

  // Handle Input Change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Submit Changes
  const handleSubmitChanges = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/title-submission/${submission.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          topic: formData.topic,
          abstract: formData.abstract,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(`Kesalahan: ${data.message}`);
        setIsSubmitting(false);
        return;
      }

      toast.success("Pengajuan berhasil disimpan!");
      setShowModal(false);
      // Refresh halaman untuk memperbarui data
      window.location.reload();
    } catch (error) {
      console.error("Kesalahan saat menyimpan perubahan:", error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Definisi warna dan label status
  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-600",
    Approved: "bg-green-100 text-green-600",
    Rejected: "bg-red-100 text-red-600",
  };

  const statusLabels = {
    Pending: "Menunggu Persetujuan",
    Approved: "Disetujui",
    Rejected: "Ditolak",
  };

  const status = submission.status as keyof typeof statusColors;

  return (
    <div className="mt-6 space-y-6 rounded-lg bg-white p-6 shadow-md">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Header */}
      <div className="mb-4 border-b pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          {submission.title}
        </h2>
        <p className="text-sm text-gray-600">
          ID Pengajuan: {submission.id || "Tidak tersedia"}
        </p>
      </div>

      {/* Informasi Dasar */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-medium text-gray-700">
          <FaBook className="text-blue-500" /> Informasi Dasar
        </h3>
        <div className="space-y-2 text-gray-800">
          <p className="flex items-start gap-2">
            <FaClipboard className="mt-1 text-blue-500" />
            <span>
              <span className="font-semibold">Topik Skripsi: </span>
              {submission.topic || "Tidak ada topik yang diinputkan"}
            </span>
          </p>
          <p className="flex items-start gap-2">
            <FaClipboard className="mt-1 text-blue-500" />
            <span>
              <span className="font-semibold">Abstrak Skripsi: </span>
              {submission.abstract}
            </span>
          </p>
          <p className="flex items-start gap-2">
            <FaCalendarAlt className="mt-1 text-blue-500" />
            <span>
              <span className="font-semibold">Tanggal Pengajuan: </span>
              {new Date(submission.createdAt).toLocaleString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </p>
        </div>
      </div>

      {/* Status Pengajuan */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-medium text-gray-700">
          <FaTag className="text-blue-500" /> Status Pengajuan
        </h3>
        <div className="flex justify-between">
          <div
            className={`inline-block rounded-lg px-4 py-2 text-sm font-semibold ${statusColors[status]}`}
          >
            {statusLabels[status]}
          </div>
          <div className="">
            {submission.status === "Rejected" && (
              <button
                onClick={() => setShowModal(true)}
                className="rounded-md bg-red-100 px-5 py-2 text-red-600 transition duration-200 hover:bg-red-200"
              >
                Edit Pengajuan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Alasan Penolakan */}
      {submission.status === "Rejected" && (
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-medium text-gray-700">
            <FaTag className="text-red-500" /> Alasan Penolakan
          </h3>
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">
            {submission.reason || "Tidak ada alasan yang diberikan."}
          </div>
        </div>
      )}

      {/* Informasi Dosen Pembimbing */}
      {submission.status === "Approved" && (
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-medium text-gray-700">
            <FaUser className="text-blue-500" /> Informasi Dosen Pembimbing
          </h3>
          <div className="space-y-4">
            {submission.lecturers.map((lecturer: any) => (
              <div
                key={lecturer.id}
                className="rounded-lg border border-gray-300 p-4 shadow-sm"
              >
                <p className="flex items-start gap-2">
                  <FaUser className="mt-1 text-blue-500" />
                  <span>
                    <span className="font-semibold">Nama: </span>
                    {lecturer.name}
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <FaEnvelope className="mt-1 text-blue-500" />
                  <span>
                    <span className="font-semibold">Email: </span>
                    {lecturer.email}
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <FaTag className="mt-1 text-blue-500" />
                  <span>
                    <span className="font-semibold">Peran: </span>
                    {lecturer.role}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Edit Pengajuan */}
      {submission.status === "Rejected" && showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Edit Pengajuan Judul
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Judul
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Topik
                </label>
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Abstrak
                </label>
                <textarea
                  name="abstract"
                  value={formData.abstract}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  rows={5}
                ></textarea>
              </div>
            </form>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition duration-200 hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitChanges}
                className={`rounded-md px-4 py-2 text-white transition duration-200 ${
                  isSubmitting ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExistingSubmission;
