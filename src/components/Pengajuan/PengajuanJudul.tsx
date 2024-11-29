"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProposalSubmission = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    abstract: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.abstract) {
      toast.error("Judul dan Abstrak wajib diisi.");
      return;
    }

    setShowModal(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/title-submission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(`Kesalahan: ${data.message}`);
        setIsSubmitting(false);
        return;
      }

      toast.success("Pengajuan judul berhasil dikirim!");

      // Redirect dan refresh halaman
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

  const closeModal = () => {
    setShowModal(false);
    setIsCheckboxChecked(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-4xl w-full rounded-lg bg-white p-6 shadow">
        <form className="grid grid-cols-1 gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
          {/* Input Title */}
          <div className="col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Judul
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Masukkan judul"
              className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Input Topic */}
          <div className="col-span-2 md:col-span-1">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Topik
            </label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              placeholder="Masukkan topik"
              className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Input Abstract */}
          <div className="col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Abstrak
            </label>
            <textarea
              name="abstract"
              value={formData.abstract}
              onChange={handleInputChange}
              placeholder="Masukkan abstrak"
              rows={5}
              className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end space-x-4">
            <button
              type="button"
              className="rounded-md bg-gray-200 px-5 py-2 text-gray-700 transition duration-200 hover:bg-gray-300"
            >
              Kembali
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-5 py-2 text-white transition duration-200 hover:bg-blue-600"
            >
              Kirim
            </button>
          </div>
        </form>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Apakah Anda yakin ingin mengirim?
            </h2>
            <p className="mb-4 text-gray-600">
              Mohon konfirmasi bahwa data Anda sudah benar. Setelah dikirim, data tidak dapat diubah hingga ditinjau.
            </p>
            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="confirmation-checkbox"
                className="mr-2"
                checked={isCheckboxChecked}
                onChange={(e) => setIsCheckboxChecked(e.target.checked)}
              />
              <label htmlFor="confirmation-checkbox" className="text-gray-700">
                Saya mengonfirmasi bahwa data saya benar.
              </label>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition duration-200 hover:bg-gray-300"
                onClick={closeModal}
              >
                Batal
              </button>
              <button
                className={`rounded-md px-4 py-2 ${
                  isCheckboxChecked
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "cursor-not-allowed bg-gray-300 text-gray-500"
                }`}
                onClick={handleConfirmSubmit}
                disabled={!isCheckboxChecked || isSubmitting}
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalSubmission;
