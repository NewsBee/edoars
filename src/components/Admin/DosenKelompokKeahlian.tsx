import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Definisikan tipe untuk data SkillGroupLecturer
interface SkillGroupLecturer {
  id: number;
  position: string;
  skillGroup: { name: string };
  user: { id: number; name: string; email: string };
}

interface Dosen {
    idkk: string;
    namakk?: string;
  }
  //id kelompok keahlian
  

const ListLecturers = ({
    idkk,
    namakk,
  }: Dosen) => {
  const [lecturers, setLecturers] = useState<SkillGroupLecturer[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  console.log(namakk)

  // Ambil data dosen berdasarkan skill group
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const response = await fetch(`/api/skillGroupLecturer/${idkk}`);
        if (response.ok) {
          const result = await response.json();
          setLecturers(result);
          console.log(result)
        } else {
          console.error("Failed to fetch lecturers");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchLecturers();
  }, []);
  console.log(idkk)

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
        setLecturers(lecturers.filter((lecturer) => lecturer.id !== deleteId));
      } else {
        console.error("Failed to delete lecturer");
      }
    } catch (error) {
      console.error("Error deleting lecturer:", error);
    }
  };

  // Filter berdasarkan pencarian
  const filteredLecturers = lecturers.filter(
    (lecturer) =>
      lecturer.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 font-sans">
      <h2 className="text-2xl font-semibold mb-6">Kelompok Keahlian: {namakk}</h2>

      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => router.push(`/admin/kelompok-keahlian/${idkk}/dosen/tambah`)}
          className="bg-green-500 text-white py-2 px-4 rounded-md text-lg hover:bg-green-600"
        >
          Tambah
        </button>
        <div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-md text-lg"
          />
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
        <thead>
          <tr className="bg-blue-100 text-left">
            <th className="py-3 px-4">No</th>
            <th className="py-3 px-4">Nama</th>
            <th className="py-3 px-4">Jabatan</th>
            <th className="py-3 px-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredLecturers.length > 0 ? (
            filteredLecturers.map((lecturer) => (
              <tr key={lecturer.id} className="border-b border-gray-200">
                <td className="py-3 px-4">{lecturer.id}</td>
                <td className="py-3 px-4">{lecturer.user.name}</td>
                <td className="py-3 px-4">{lecturer.position}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => router.push(`/admin/kelompok-keahlian/dosen/ubah/${lecturer.id}`)}
                    className="bg-blue-500 text-white py-1 px-3 rounded-md mr-2 hover:bg-blue-600"
                  >
                    Ubah
                  </button>
                  <button
                    onClick={() => {
                      setDeleteId(lecturer.id);
                      setIsModalOpen(true);
                    }}
                    className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="py-3 px-4 text-center text-gray-500">
                Tidak ada data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Konfirmasi Penghapusan</h2>
            <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus dosen ini?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 flex justify-between items-center">
        <div>
          <span className="text-gray-600 text-sm">
            Showing 1 to {filteredLecturers.length} of {filteredLecturers.length} entries
          </span>
        </div>
        <div>
          <button className="bg-blue-500 text-white py-2 px-6 rounded-md text-lg hover:bg-blue-600">
            Simpan Data
          </button>
        </div>
      </div>

      {/* Notes */}
      <p className="mt-4 text-red-500 text-sm">
        Catatan: Dosen tidak akan bisa dihapus jika sudah terdaftar pada kelompok keahlian.
      </p>
    </div>
  );
};

export default ListLecturers;
