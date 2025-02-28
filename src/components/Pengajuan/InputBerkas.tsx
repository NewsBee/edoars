"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const InputBerkas = ({
  typeSlug,
  submissionData,
}: {
  typeSlug: string;
  submissionData: any;
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [requiredFiles, setRequiredFiles] = useState<any[]>([]);
  const [formData, setFormData] = useState<{
    files: Record<string, File | null>;
  }>({
    files: {},
  });

  const [isLoading, setIsLoading] = useState(true); // State untuk mengelola status loading

  console.log(typeSlug);
  console.log(submissionData);
  useEffect(() => {
    const fetchRequiredFiles = async () => {
      try {
        const response = await fetch(
          `/api/submission/requiredfiles/?type=${typeSlug}`,
        );
        const data = await response.json();
        console.log(data);
        // console.log(response);

        if (response.ok) {
          setRequiredFiles(data);
        } else {
          toast.error(`Kesalahan: ${data.message}`);
        }
      } catch (error) {
        toast.error("Terjadi kesalahan saat mengambil data.");
      } finally {     
        setIsLoading(false);
      }
    };

    fetchRequiredFiles();
  }, [typeSlug]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files?.[0]) {
      setFormData({
        ...formData,
        files: {
          ...formData.files,
          [name]: files[0], // Memastikan file yang dipilih dimasukkan ke state
        },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
  console.log(formData);

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setShowModal(false);
    try {
      for (const [key, file] of Object.entries(formData.files)) {
        const requiredFile = requiredFiles.find((f) => f.key === key);
        if (!requiredFile) {
          throw new Error(`Required file with key ${key} not found`);
        }
        console.log(requiredFile.id, file);
        if (file) {
          const formDataToSend = new FormData();
          formDataToSend.append("submissionId", submissionData.id); // Replace with actual submissionId
          formDataToSend.append("requiredFileId", requiredFile.id);
          formDataToSend.append("file", file);

          const response = await fetch("/api/submission/file", {
            method: "POST",
            body: formDataToSend,
          });

          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.message);
          }
        }
      }

      // Redirect to submission detail page
      toast.success("Files uploaded successfully");
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Error uploading files");
    } finally {
      setIsSubmitting(false);
    }
  };
  if(isLoading){
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="loader h-32 w-32 rounded-full border-8 border-t-8 border-gray-200 ease-linear"></div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Notes Section */}
      <div className="mb-8 rounded-lg bg-blue-100 p-4 shadow-md">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
          Catatan:
        </h3>
        <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
          <li>
            Agar menu <strong>&quot;Proses Pengajuan&quot;</strong> terbuka,
            maka anda harus upload semua file pemberkasan terlebih dahulu.
          </li>
          <li>
            Pastikan semua file yang diupload sudah jelas dan benar adanya. Jika
            terdapat kesalahan pada berkas yang telah disetujui, maka anda dapat
            menghubungi pihak bagian administrasi atau admin untuk konfirmasi.
          </li>
          <li>
            Jika ingin <strong>&quot;Lihat Berkas&quot;</strong> atau{" "}
            <strong>&quot;Edit&quot;</strong> maka pastikan anda telah login ke
            akun gmail UNTAN.
          </li>
          <li>
            Browser yang disarankan adalah: <strong>Google Chrome</strong>
          </li>
        </ul>
      </div>
      <div className="w-full rounded-lg bg-white">
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Upload Berkas */}
          <div className="space-y-6">
            {requiredFiles.map((file, i) => (
              <div
                key={file.id}
                className="relative rounded-lg border bg-gray-50 p-4 shadow-sm hover:bg-gray-100"
              >
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    #{i + 1} - {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {file.note || "Upload file ini"}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <input
                    type="file"
                    name={file.key}
                    onChange={handleFileChange}
                    accept=".pdf,.docx"
                    className="hidden"
                    id={`${file.key}-upload`}
                  />
                  <label
                    htmlFor={`${file.key}-upload`}
                    className="flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-blue-500 bg-blue-50 p-4 hover:bg-blue-100"
                  >
                    {formData.files[file.key] ? (
                      <span className="text-sm text-gray-700">
                        {formData.files[file.key]?.name}
                      </span>
                    ) : (
                      <span className="text-sm text-blue-500">
                        Upload Document
                      </span>
                    )}
                  </label>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-600"></div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            {/* <button
                            type="button"
                            className="rounded-md bg-gray-200 px-5 py-2 text-gray-700 transition duration-200 hover:bg-gray-300"
                        >
                            Kembali
                        </button> */}
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
            <h2 className="mb-4 text-lg font-bold text-gray-800">
              Konfirmasi Pengajuan
            </h2>
            <p className="mb-6 text-gray-600">
              Apakah Anda yakin ingin mengirim pengajuan ini? Pastikan semua
              informasi sudah benar sebelum melanjutkan.
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

export default InputBerkas;
