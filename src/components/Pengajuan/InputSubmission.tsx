"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InputSubmission = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [requiredFiles, setRequiredFiles] = useState<any[]>([]);
  const [formData, setFormData] = useState<{
    title: string;
    topic: string;
    description: string;
    files: Record<string, File | null>;
  }>({
    title: "",
    topic: "",
    description: "",
    files: {},
  });

  const typeSlug = "seminar-proposal"; // Ganti sesuai dengan slug tipe yang dipilih

  // Ambil required files berdasarkan slug dari API
  useEffect(() => {
    const fetchRequiredFiles = async () => {
      try {
        const response = await fetch(`api/submission/${typeSlug}/required-files`);
        const data = await response.json();
        console.log(data)
        console.log(response)

        if (response.ok) {
          setRequiredFiles(data);
        } else {
          toast.error(`Kesalahan: ${data.message}`);
        }
      } catch (error) {
        toast.error("Terjadi kesalahan saat mengambil data.");
      }
    };

    fetchRequiredFiles();
  }, [typeSlug]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setFormData({ ...formData, files: { ...formData.files, [name]: files?.[0] || null } });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      toast.error("Judul dan Deskripsi wajib diisi.");
      return;
    }

    // Validasi file yang dibutuhkan
    for (let file of requiredFiles) {
      if (!formData.files[file.key]) {
        toast.error(`File ${file.name} wajib diunggah.`);
        return;
      }
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
      formDataToSend.append("description", formData.description);

      // Menambahkan file yang diunggah ke FormData
      requiredFiles.forEach((file) => {
        const fileToUpload = formData.files[file.key];
        if (fileToUpload) {
          formDataToSend.append(file.key, fileToUpload);
        }
      });

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

      toast.success("Pengajuan berhasil dikirim!");

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengirim.");
    } finally {
      setIsSubmitting(false);
      setShowModal(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
      <div className="w-full rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-semibold text-gray-800">Pengajuan Judul Proposal</h1>
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Field Input */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Judul */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Judul</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Masukkan judul"
                className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Deskripsi */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Masukkan Deskripsi"
                rows={5}
                className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              ></textarea>
            </div>
          </div>

          <div className="flex items-center">
            <div className="h-px flex-grow border-2 border-dashed bg-gray-300" />
            <span className="mx-2 text-gray-500">UPLOAD BERKAS</span>
            <div className="h-px flex-grow border-2 border-dashed bg-gray-300" />
          </div>

          {/* Upload Berkas */}
          <div className="space-y-6">
            {requiredFiles.map((file) => (
              <div key={file.id} className="relative rounded-lg border bg-gray-50 p-4 shadow-sm hover:bg-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-700">#{file.id} - {file.name}</p>
                  <p className="text-xs text-gray-500">{file.note || "Upload file ini"}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <input
                    type="file"
                    name={file.key}
                    onChange={handleFileChange}
                    accept={file.allowed_formats}
                    className="hidden"
                    id={`${file.key}-upload`}
                  />
                  <label
                    htmlFor={`${file.key}-upload`}
                    className="flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-blue-500 bg-blue-50 p-4 hover:bg-blue-100"
                  >
                    {formData.files[file.key] ? (
                      <span className="text-sm text-gray-700">{formData.files[file.key]?.name}</span>
                    ) : (
                      <span className="text-sm text-blue-500">Upload Document</span>
                    )}
                  </label>
                </div>
              </div>
            ))}
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
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold text-gray-800">Konfirmasi Pengajuan</h2>
            <p className="mb-6 text-gray-600">
              Apakah Anda yakin ingin mengirim pengajuan ini? Pastikan semua informasi sudah benar sebelum melanjutkan.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
              <button
                className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
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

export default InputSubmission;
