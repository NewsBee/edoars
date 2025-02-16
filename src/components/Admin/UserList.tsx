"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

// Definisikan tipe untuk data SkillGroup
interface SkillGroup {
  id: number;
  name: string;
  status: string;
}

interface Slug {
  slug?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  role: string;
  nim?: string;
  nip?: string;
  phone_number?: string;
}

const UserList = ({ slug }: Slug) => {
  const [data, setData] = useState<SkillGroup[]>([]); // Data skill group
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Halaman aktif
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Menampilkan modal konfirmasi hapus
  const [deleteId, setDeleteId] = useState<number | null>(null); // ID yang akan dihapus
  const itemsPerPage = 10; // Jumlah item per halaman
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  // console.log(slug);

  // Ambil daftar pengguna
  useEffect(() => {
    const fetchUsers = async () => {
      // console.log(slug);

      try {
        const response = await fetch(`/api/users/filter/${slug}`); // Menggunakan slug sebagai bagian dari URL
        // console.log(slug);
        if (response.ok) {
          const result = await response.json();
          setUsers(result.users); // Menyimpan daftar pengguna
        } else {
          console.error("Failed to fetch users", await response.json());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [slug]);
  console.log(users);

  const handleEdit = (id: number) => {
    // router.push(`/admin/daftar-pengguna/${slug?.toLowerCase()}/edit/${id}`);
    window.location.href = `/admin/daftar-pengguna/${slug?.toLocaleLowerCase()}/edit/${id}`;
  };

  const handleDetail = (id: number) => {
    router.push(`/admin/daftar-pengguna/${slug?.toLowerCase()}/detail/${id}`);
  };

  const handleModalOpen = (id: number) => {
    console.log(id)
    setIsModalOpen(true)
    setDeleteId(id)
    // router.push(`/admin/daftar-pengguna/${slug?.toLowerCase()}/edit/${id}`);
  };

  const handleRedirect = () => {
    window.location.href = `/admin/daftar-pengguna/${slug}/tambah`;
  };

  const handleAdd = () => {
    router.push("/admin/users/add");
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
  
    try {
      const response = await fetch(`/api/users/${deleteId}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        // Close modal after delete
        setIsModalOpen(false);
        setDeleteId(null);
  
        // Menghapus item yang dihapus langsung dari state 'users'
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== deleteId));
  
        toast.success("Berhasil dihapus");
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // console.log(paginatedData);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleChange = async (e: any) => {
    router.push(`/admin/kelompok-keahlian/${e}/ubah`);
  };

  // Filter berdasarkan pencarian
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full rounded-lg bg-white p-6 shadow-md">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">Pengguna</h1>
        {/* <h1 className="text-lg font-bold text-gray-800">{slug}</h1> */}
        {/* <Link
          href={`/admin/daftar-pengguna/${slug}/tambah`}
          passHref
          className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-green-600"
        >
          Tambah
        </Link> */}
        <button
          onClick={handleRedirect}
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
              <th className="w-1/2 border-b border-gray-200 px-6 py-3">Name</th>
              <th className="w-1/2 border-b border-gray-200 px-6 py-3">
                Email
              </th>
              {slug === "admin" || slug === "bagian_administrasi" ? (
                <th className="w-1/6 border-b border-gray-200 px-6 py-3 text-center">
                  Password
                </th>
              ) : null}
              {slug === "dosen" ? (
                <>
                  <th className="w-1/6 border-b border-gray-200 px-6 py-3 text-center">
                    NIP/NIDN
                  </th>
                  <th className="w-1/6 border-b border-gray-200 px-6 py-3 text-center">
                    Phone
                  </th>
                </>
              ) : null}
              <th className="w-1/6 border-b border-gray-200 px-6 py-3 text-center">
                Status
              </th>
              <th className="w-1/4 border-b border-gray-200 px-6 py-3 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4">
                  <div className="flex animate-pulse space-x-4">
                    <div className="h-6 w-6 rounded bg-gray-300"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-gray-300"></div>
                      <div className="h-4 w-1/2 rounded bg-gray-300"></div>
                    </div>
                  </div>
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-200 transition-colors duration-150 hover:bg-gray-50"
                >
                  <td className="px-6 py-3 text-center">{index + 1}</td>
                  {/* <td className="px-6 py-3">{user.name}</td> */}
                  <td className="break-words px-6 py-3">
                    <div>
                      <span className="font-medium text-gray-800">
                        {user.name}
                      </span>
                      {user.nim || user.nip ? (
                        <p className="text-sm text-gray-500">
                          {user.nim || user.nip}
                        </p>
                      ) : null}
                      {/* <p className="text-sm text-gray-500">{item.description}</p> */}
                    </div>
                  </td>
                  <td className="px-6 py-3">{user.email}</td>
                  {slug === "admin" || slug === "bagian_administrasi" ? (
                    <td className="px-6 py-3 text-center">********</td>
                  ) : null}
                  {slug === "dosen" ? (
                    <>
                      <td className="px-6 py-3 text-center">{user.nip}</td>
                      <td className="px-6 py-3 text-center">
                        {user.phone_number}
                      </td>
                    </>
                  ) : null}
                  <td className="px-6 py-3 text-center">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${user.status === "1" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                    >
                      {user.status === "1" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {slug === "Dosen" || slug == "Mahasiswa" ? (
                        <button
                        onClick={() => handleEdit(user.id)}
                          className="rounded-lg bg-gray-500 px-3 py-2 text-sm text-white hover:bg-gray-600"
                        >
                          Detail
                        </button>
                      ) : null}
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="rounded-lg bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => 
                          handleModalOpen(user.id)
                      }
                        className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-500">
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
                onClick={() => 
                  setIsModalOpen(false)
                }
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
        Pastikan bahwa kelompok keahlian yang dihapusbelum pernah dipilih oleh
        mahasiswa.
      </p>
    </div>
  );
};

export default UserList;
