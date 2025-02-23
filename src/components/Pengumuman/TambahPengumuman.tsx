"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const AddAnnouncement = () => {
  const [judul, setJudul] = useState("");
  const [desc, setDesc] = useState("");
  // const [postDate, setPostDate] = useState("");
  const [status, setStatus] = useState<Boolean>(true); // Default status is 'Aktif'
  const [lampiran, setLampiran] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null; // Check if files are selected
    setLampiran(file); // Set the selected file to state
  };

  const router = useRouter();

  const formDataToSend = new FormData();

  // formDataToSend.append("typeId", BigInt(idtipe).toString());
  formDataToSend.append("judul", judul);
  formDataToSend.append("description", desc);
  formDataToSend.append("status", status !== undefined ? status.toString() : "false");

  if (lampiran) {
    formDataToSend.append("lampiran", lampiran); // Only append if 'lampiran' is a valid File
    console.log(lampiran)
  } else {
    // Optionally handle the case when 'lampiran' is null (e.g., append a placeholder or skip it)
    console.log("No file selected.");
  }
  formDataToSend.forEach((value, key) => {
    if (value instanceof File) {
      console.log(`${key}: File with name ${value.name}`);
    } else {
      console.log(`${key}: ${value}`);
    }
  });

  console.log(status)
  const handleBack = () => {
    router.back(); // Navigate to the previous page
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/pengumuman", {
        method: "POST",
        body: formDataToSend, // Directly use FormData here
      });

      if (response.ok) {
        toast.success("Pengumuman berhasil ditambahkan!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // Reset the form
        setJudul("");
        setDesc("");
        router.push("/admin/pengumuman")
        // setPostDate("");
      } else {
        throw new Error("Failed to add announcement");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal menambahkan pengumuman. Silakan coba lagi.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="container mx-auto p-8">
      {/* <ToastContainer /> */}
      <h2 className="mb-6 text-3xl font-bold text-gray-800 dark:text-gray-100">
        Tambah Pengumuman Baru
      </h2>
      <form
        onSubmit={handleSubmit}
        className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-900"
      >
        <div className="mb-6">
          <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
            Judul
          </label>
          <input
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            className="focus:shadow-outline w-full appearance-none rounded border border-gray-300 bg-gray-50 px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            placeholder="Masukkan judul pengumuman"
          />
        </div>
        <div className="mb-6">
          <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
            Isi Pengumuman
          </label>
          <div className="rounded border border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <ReactQuill
              value={desc}
              onChange={setDesc}
              modules={{
                toolbar: [
                  [{ header: "1" }, { header: "2" }, { font: [] }],
                  [{ size: [] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image", "video"],
                  ["clean"],
                  ["code-block"],
                ],
              }}
              formats={[
                "header",
                "font",
                "size",
                "bold",
                "italic",
                "underline",
                "strike",
                "blockquote",
                "list",
                "bullet",
                "indent",
                "link",
                "image",
                "video",
                "code-block",
              ]}
              className="mb-2 dark:text-gray-300"
              theme="snow"
            />
          </div>
        </div>
        {/* <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Tanggal Posting</label>
          <input
            type="datetime-local"
            value={postDate}
            onChange={(e) => setPostDate(e.target.value)}
            className="shadow appearance-none border border-gray-300 dark:border-gray-700 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 dark:bg-gray-800"
          />
        </div> */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600">
            Status <span className="text-red-500">*</span>
          </label>
          <div className="mt-2 flex items-center space-x-6">
            <div>
              <input
                type="radio"
                id="aktif"
                name="status"
                value="Aktif"
                checked={status === true}
                onChange={() => setStatus(true)}
                className="mr-2"
              />
              <label htmlFor="aktif" className="text-sm text-gray-600">
                Aktif
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="tidak-aktif"
                name="status"
                value="Tidak Aktif"
                checked={status === false}
                onChange={() => setStatus(false)}
                className="mr-2"
              />
              <label htmlFor="tidak-aktif" className="text-sm text-gray-600">
                Tidak Aktif
              </label>
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="lampiran"
            className="block text-lg font-medium text-gray-700"
          >
            Lampirkanan Dokumen
          </label>
          <p className="mt-1 text-sm text-red-500">
            *Optional
          </p>

          <br />
          <div className="relative rounded-lg border bg-gray-50 p-4 shadow-sm hover:bg-gray-100 mb-4">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Tambahkan Lampiran
              </p>
              <p className="text-xs text-gray-500">
                Upload dokumen lampiran
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <input
                type="file"
                name="lampiran"
                id="lampiran"
                onChange={handleFileChange}
                // accept=".pdf"
                className="hidden"
              />
              <label
                htmlFor="lirs-upload"
                className="flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-blue-500 bg-blue-50 p-4 hover:bg-blue-100"
              >
                {lampiran ? (
                  <span className="text-sm text-gray-700">{lampiran.name}</span>
                ) : (
                  <div>
                    <label htmlFor="lampiran" className="text-sm text-blue-500">
                      Upload Document
                    </label>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="mr-2 rounded bg-blue-500 px-6 py-2 text-white transition duration-300 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Tambah Pengumuman
          </button>
          <button
            type="button"
            onClick={handleBack}
            className="rounded bg-gray-500 px-6 py-2 text-white transition duration-300 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
          >
            Kembali
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAnnouncement;
