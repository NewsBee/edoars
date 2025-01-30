"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProposalSubmission = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    topic: string;
    abstract: string;
    lirs: File | null;
    toefl: File | null;
    proposal: File | null;
  }>({
    title: "",
    topic: "",
    abstract: "",
    lirs: null,
    toefl: null,
    proposal: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files?.[0] || null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.abstract) {
      toast.error("Judul dan Abstrak wajib diisi.");
      return;
    }

    if (!formData.lirs || !formData.toefl || !formData.proposal) {
      toast.error("Semua berkas wajib diunggah.");
      return;
    }

    // Tampilkan modal konfirmasi
    setShowModal(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("topic", formData.topic);
      formDataToSend.append("abstract", formData.abstract);
      formDataToSend.append("lirs", formData.lirs as Blob);
      formDataToSend.append("toefl", formData.toefl as Blob);
      formDataToSend.append("proposal", formData.proposal as Blob);

      const response = await fetch("/api/title-submission", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(`Kesalahan: ${data.message}`);
        setIsSubmitting(false);
        return;
      }

      toast.success("Pengajuan judul berhasil dikirim!");

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengirim. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
      setShowModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-5xl w-full rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Pengajuan Judul Proposal
        </h1>
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Field Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Judul */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Judul
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Masukkan judul"
                className="mt-1 p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Topik */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700">
                Topik
              </label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                placeholder="Masukkan topik"
                className="mt-1 p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Abstrak */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Abstrak
              </label>
              <textarea
                name="abstract"
                value={formData.abstract}
                onChange={handleInputChange}
                placeholder="Masukkan abstrak"
                rows={5}
                className="mt-1 p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              ></textarea>
            </div>
          </div>

          {/* Upload Berkas */}
          <div className="space-y-6">
            {/* LIRS */}
            <div className="relative border rounded-lg p-4 shadow-sm bg-gray-50 hover:bg-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-700">#1 - LIRS</p>
                <p className="text-xs text-gray-500">
                  Upload LIRS semester Anda di sini
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <input
                  type="file"
                  name="lirs"
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="hidden"
                  id="lirs-upload"
                />
                <label
                  htmlFor="lirs-upload"
                  className="cursor-pointer w-full flex items-center justify-center border-2 border-dashed border-blue-500 rounded-md bg-blue-50 p-4 hover:bg-blue-100"
                >
                  {formData.lirs ? (
                    <span className="text-sm text-gray-700">
                      {formData.lirs.name}
                    </span>
                  ) : (
                    <span className="text-sm text-blue-500">Upload Document</span>
                  )}
                </label>
              </div>
            </div>

            {/* TOEFL */}
            <div className="relative border rounded-lg p-4 shadow-sm bg-gray-50 hover:bg-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  #2 - Sertifikat TOEFL
                </p>
                <p className="text-xs text-gray-500">
                  Upload sertifikat TOEFL Anda di sini
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <input
                  type="file"
                  name="toefl"
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="hidden"
                  id="toefl-upload"
                />
                <label
                  htmlFor="toefl-upload"
                  className="cursor-pointer w-full flex items-center justify-center border-2 border-dashed border-blue-500 rounded-md bg-blue-50 p-4 hover:bg-blue-100"
                >
                  {formData.toefl ? (
                    <span className="text-sm text-gray-700">
                      {formData.toefl.name}
                    </span>
                  ) : (
                    <span className="text-sm text-blue-500">Upload Document</span>
                  )}
                </label>
              </div>
            </div>

            {/* Proposal */}
            <div className="relative border rounded-lg p-4 shadow-sm bg-gray-50 hover:bg-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  #3 - Proposal
                </p>
                <p className="text-xs text-gray-500">
                  Upload proposal Anda di sini
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <input
                  type="file"
                  name="proposal"
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="hidden"
                  id="proposal-upload"
                />
                <label
                  htmlFor="proposal-upload"
                  className="cursor-pointer w-full flex items-center justify-center border-2 border-dashed border-blue-500 rounded-md bg-blue-50 p-4 hover:bg-blue-100"
                >
                  {formData.proposal ? (
                    <span className="text-sm text-gray-700">
                      {formData.proposal.name}
                    </span>
                  ) : (
                    <span className="text-sm text-blue-500">Upload Document</span>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="rounded-md bg-gray-200 px-5 py-2 text-gray-700 transition duration-200 hover:bg-gray-300"
            >
              Kembali
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-500 px-5 py-2 text-white transition duration-200 hover:bg-indigo-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mengirim..." : "Kirim"}
            </button>
          </div>
        </form>
      </div>

      {/* Modal Konfirmasi */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Konfirmasi Pengajuan
            </h2>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin mengirim pengajuan ini? Pastikan semua
              informasi sudah benar sebelum melanjutkan.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-200 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-300"
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
              <button
                className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
                onClick={handleConfirmSubmit}
              >
                Ya, Kirim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalSubmission;
