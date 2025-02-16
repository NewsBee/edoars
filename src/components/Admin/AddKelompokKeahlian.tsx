import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddSkillGroupForm = () => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Aktif"); // Default status is 'Aktif'
  const [error, setError] = useState("");
  const router = useRouter()

  // Fungsi untuk menangani pengiriman formulir
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      setError("Nama tidak boleh kosong");
      return;
    }

    // Mengirim data ke API
    try {
      const response = await fetch("/api/kelompok-keahlian", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          status,
        }),
      });

      if (response.ok) {
        setName(""); // Reset form
        setStatus("Aktif"); // Reset status
        setError(""); // Clear error
        toast.success("Data berhasil ditambahkan");
        router.push("/admin/kelompok-keahlian")
      } else {
        toast.error("Gagal menambahkan data");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan, coba lagi nanti");
    }
  };

  return (
    <div className="mx-auto w-full rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">
        Kelompok Keahlian
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Nama Field */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-600"
            htmlFor="name"
          >
            Nama <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-md border border-gray-300 p-2"
            placeholder="Nama"
            required
          />
        </div>

        {/* Status Field */}
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
                checked={status === "Aktif"}
                onChange={() => setStatus("Aktif")}
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
                checked={status === "Tidak Aktif"}
                onChange={() => setStatus("Tidak Aktif")}
                className="mr-2"
              />
              <label htmlFor="tidak-aktif" className="text-sm text-gray-600">
                Tidak Aktif
              </label>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-md bg-[#5750f1] py-2 text-white hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddSkillGroupForm;
