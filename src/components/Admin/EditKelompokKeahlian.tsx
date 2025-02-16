import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface SkillGroup {
  id: number;
  name: string;
  status: string;
}

interface EditKelompokKeahlian {
  idkelompokkeahlian: string;
}

const EditSkillGroup = ({ idkelompokkeahlian }: EditKelompokKeahlian) => {
  const [skillGroup, setSkillGroup] = useState<SkillGroup | null>(null); // Data skill group yang akan diedit
  const [name, setName] = useState<string>("");
  const [status, setStatus] = useState<string>("Aktif");
  const [error, setError] = useState<string>("");

  const router = useRouter();
  const id = idkelompokkeahlian; // Ambil ID dari query parameter

  // Ambil data skill group berdasarkan ID
  useEffect(() => {
    if (!id) return;

    const fetchSkillGroup = async () => {
      try {
        const response = await fetch(`/api/kelompok-keahlian/${id}`);
        if (response.ok) {
          const data = await response.json();
          setSkillGroup(data);
          setName(data.name);
          setStatus(data.status);
        } else {
          console.error("Failed to fetch skill group data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSkillGroup();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !status) {
      setError("Nama dan status harus diisi.");
      return;
    }

    try {
      const response = await fetch(`/api/kelompok-keahlian/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, status }),
      });

      if (response.ok) {
        const updatedSkillGroup = await response.json();
        toast.success("Data berhasil diperbarui");
        router.push("/admin/kelompok-keahlian");
      } else {
        const errorMessage = await response.text();
        toast.error(`Gagal memperbarui data: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error updating skill group:", error);
      toast.error("Terjadi kesalahan saat memperbarui data.");
    }
  };

  if (!skillGroup) return <div>Loading...</div>; // Tampilkan loading saat data sedang diambil

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
          className="w-full rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600"
        >
          Update
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditSkillGroup;
