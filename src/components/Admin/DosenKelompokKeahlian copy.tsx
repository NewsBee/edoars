import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Definisikan tipe untuk data SkillGroupLecturer
interface SkillGroupLecturer {
  id: number;
  position: string;
  user: { id: number; name: string; email: string };
}

interface Dosen {
    idkk: string;
    namakk?: string;
  }
  //id kelompok keahlian
  

const ListLecturersCopy = ({
    idkk,
    namakk,
  }: Dosen) => {
  const [data, setData] = useState<SkillGroupLecturer[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Halaman aktif
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Menampilkan modal konfirmasi hapus
  const itemsPerPage = 10; // Jumlah item per halaman

  console.log(namakk)

  // Ambil data dosen berdasarkan skill group
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const response = await fetch(`/api/skillGroupLecturer/${idkk}`);
        if (response.ok) {
          const result = await response.json();
          setData(result);
          console.log(result)
        } else {
          console.error("Failed to fetch lecturers");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }finally{
        setLoading(false)
      }
    };

    fetchLecturers();
  }, []);
  console.log(idkk)
  console.log(data)

  // Handle delete action
  const handleDelete = async () => {
    if (deleteId === null) return;

    try {
      const response = await fetch(`/api/skillGroupLecturer/${deleteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Close modal after delete
        setIsModalOpen(false);
        setDeleteId(null);
        // Refresh the data
        toast.success("Data berhasil dihapus")
        setData(data.filter((lecturer) => lecturer.id !== deleteId));
      } else {
        toast.success("Data gagal dihapus")
        console.error("Failed to delete lecturer");
      }
    } catch (error) {
      console.error("Error deleting lecturer:", error);
    }
  };

  const handleChange = async (e: any) => {
    router.push(`/admin/kelompok-keahlian/${idkk}/dosen/${e}`);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  console.log(paginatedData);
  // console.log(paginatedData[0]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Filter berdasarkan pencarian
  // const filteredLecturers = data.filter(
  //   (lecturer) =>
  //     lecturer.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     lecturer.position.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <div className="w-full rounded-lg bg-white p-6 shadow-md">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Kelompok Keahlian : {namakk}</h1>
        <button
          onClick={() => router.push(`/admin/kelompok-keahlian/${idkk}/dosen/tambah`)}
          className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-green-600"
        >
          Tambah
        </button>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-sm uppercase leading-normal text-gray-600">
              <th className="w-12 border-b border-gray-200 px-6 py-3">No</th>
              <th className="w-1/2 border-b border-gray-200 px-6 py-3">Nama</th>
              <th className="w-1/6 border-b border-gray-200 px-6 py-3 text-center">
                Jabatan
              </th>
              <th className="w-1/4 border-b border-gray-200 px-6 py-3 text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4">
                  <div className="flex animate-pulse space-x-4">
                    <div className="h-6 w-6 rounded bg-gray-300"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-gray-300"></div>
                      <div className="h-4 w-1/2 rounded bg-gray-300"></div>
                    </div>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item: any, index: number) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 transition-colors duration-150 hover:bg-gray-50"
                >
                  <td className="px-6 py-3 text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="break-words px-6 py-3">
                    <div>
                      <span className="font-medium text-gray-800">
                        {item.User.name}
                      </span>
                      {/* <p className="text-sm text-gray-500">
                        {item.status}
                      </p> */}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        item.position === "Ketua"
                          ? "bg-green-100 text-red-600 "
                          : "bg-red-100 text-green-600"
                      }`}
                    >
                      {item.position}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleChange(item.id)}
                        className="rounded-lg bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600"
                      >
                        Ubah
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(item.id);
                          setIsModalOpen(true);
                        }}
                        className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-500">
                  Tidak ada data yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Konfirmasi Hapus */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold text-gray-800">
              Konfirmasi Penghapusan
            </h2>
            <p className="mb-6 text-gray-600">
              Apakah Anda yakin ingin menghapus data ini?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer dengan Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Menampilkan {paginatedData.length} dari {data.length} entri
        </p>
        <div className="flex space-x-2">
          <button
            className={`rounded-lg px-3 py-1 text-sm ${
              currentPage === 1
                ? "bg-gray-300 text-gray-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="rounded-lg bg-blue-500 px-4 py-1 text-white">
            {currentPage}
          </span>
          <button
            className={`rounded-lg px-3 py-1 text-sm ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Catatan */}
      <p className="mt-4 text-sm font-medium text-red-500">
        Pastikan bahwa kelompok keahlian yang dihapusbelum pernah dipilih oleh mahasiswa.
      </p>
    </div>
  );
};

export default ListLecturersCopy;
