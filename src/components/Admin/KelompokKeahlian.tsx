import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Definisikan tipe untuk data SkillGroup
interface SkillGroup {
  id: number;
  name: string;
  status: string;
}

interface EditKelompokKeahlian {
    idkelompokkeahlian?: string;
  }

const TableComponent = () => {
  const [data, setData] = useState<SkillGroup[]>([]); // Data skill group
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [deleteId, setDeleteId] = useState<number | null>(null); // ID data yang akan dihapus
  const router = useRouter();

  // Ambil data dari API saat komponen dimuat
  useEffect(() => {
    const fetchSkillGroups = async () => {
      try {
        const response = await fetch("/api/kelompok-keahlian");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error("Failed to fetch skill groups");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSkillGroups();
  }, []);

  // Handle delete action
  const handleDelete = async () => {
    if (deleteId === null) return;

    try {
      const response = await fetch(`/api/kelompok-keahlian/${deleteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Close modal after delete
        setIsModalOpen(false);
        setDeleteId(null);
        // Refresh the data
        const updatedData = data.filter((item) => item.id !== deleteId);
        setData(updatedData);
        toast.success("Berhasil dihapus")
      } else {
        console.error("Failed to delete skill group");
      }
    } catch (error) {
      console.error("Error deleting skill group:", error);
    }
  };

  const handleChange = async (e:any) => {
    router.push(`/admin/kelompok-keahlian/${e}/ubah`)
  };

  // Filter berdasarkan pencarian
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="font-sans bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => router.push("/admin/kelompok-keahlian/tambah")}
          className="rounded-md bg-green-500 px-4 py-2 text-lg text-white hover:bg-green-600"
        >
          Tambah
        </button>
        <div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-md border border-gray-300 p-2 text-lg"
          />
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full rounded-md border border-gray-300 bg-white shadow-md">
        <thead>
          <tr className="bg-blue-100 text-left">
            <th className="px-4 py-3">No</th>
            <th className="px-4 py-3">Nama</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, i) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="px-4 py-3">{i+1}</td>
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">
                  <span className="rounded-md bg-green-500 px-3 py-1 text-white">
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={()=>handleChange(item.id)} className="mr-2 rounded-md bg-blue-500 px-3 py-1 text-white hover:bg-blue-600">
                    Ubah
                  </button>
                  <button
                    className="rounded-md bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                    onClick={() => {
                      setDeleteId(item.id);
                      setIsModalOpen(true);
                    }}
                  >
                    Hapus
                  </button>
                  <button
                    className="rounded-md bg-[#5750f1] mx-3 px-3 py-1 text-white hover:bg-blue-600"
                    onClick={() => {
                      router.push(`/admin/kelompok-keahlian/${item.id}/dosen`)
                    }}
                  >
                    Daftar Dosen
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-4 py-3 text-center text-gray-500">
                Tidak ada data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <span className="text-sm text-gray-600">
            Showing 1 to {filteredData.length} of {filteredData.length} entries
          </span>
        </div>
        <div>
          {/* <button className="rounded-md bg-blue-500 px-6 py-2 text-lg text-white hover:bg-blue-600">
            Simpan Data
          </button> */}
        </div>
      </div>

      {/* Notes */}
      <p className="mt-4 text-sm text-red-500">
        Catatan: Kelompok keahlian tidak akan bisa dihapus jika telah memiliki
        data pengajuan, sehingga jika ingin menonaktifkan cukup dengan mengubah
        status saja.
      </p>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="w-96 rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Konfirmasi Penghapusan
            </h2>
            <p className="mb-6 text-gray-600">
              Apakah Anda yakin ingin menghapus kelompok keahlian ini?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-md bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default TableComponent;
