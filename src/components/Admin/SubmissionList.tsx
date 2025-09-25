"use client"; // Jika Anda menggunakan App Router Next.js (folder 'app'), pastikan menambahkan ini

import React, { useState, useEffect } from "react";

// types/submission.d.ts (misal)
// Sesuaikan nama file & struktur data sesuai kebutuhan

export interface User {
  id: number;
  external_user_id: number;
  name: string;
  email: string;
  nim: string;
  role: string;
  periode_masuk?: string; // Contoh
  createdAt: string;
  updatedAt: string;
  // Tambahkan properti lain sesuai data Anda
}

export interface Verificator {
  id: string;
  type: string;
  status: string;
  submissionId: string;
  lecturerId: number;
  createdAt: string;
  updatedAt: string;
  lecturerName: string;
}

export interface SubmissionType {
  id: string;
  name: string;
  slug: string;
  color: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: string;
  typeId: string;
  userId: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  User?: User;
  Type?: SubmissionType;
  Verificator?: Verificator[];
  // Tambahkan properti lain sesuai data Anda
}

export interface SubmissionData {
  formattedSubmissions: Submission[];
}

export default function SubmissionList({ slug }: { slug: string }) {
  // State untuk menampung data
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);

  // State filter / pencarian
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [angkatanFilter, setAngkatanFilter] = useState("");
  const [orderBy, setOrderBy] = useState("tanggalDesc");

  // 1. Ambil data dari API saat komponen dimuat
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/submission?type=${slug}`);
        // Beri tahu TS bentuk data respons yang kita harapkan
        const data = (await res.json()) as SubmissionData;
        if (data?.formattedSubmissions) {
          setSubmissions(data.formattedSubmissions);
          setFilteredSubmissions(data.formattedSubmissions);
        }
      } catch (error) {
        console.error("Gagal memuat data:", error);
      }
    }
    fetchData();
  }, [slug]);

  // 2. Filter & sort setiap ada perubahan di state filter
  useEffect(() => {
    let temp = [...submissions];

    // Filter berdasarkan searchText (judul / nama user)
    if (searchText.trim() !== "") {
      const lowerSearch = searchText.toLowerCase();
      temp = temp.filter((item) => {
        const titleMatches = item.title?.toLowerCase().includes(lowerSearch);
        const userMatches = item.User?.name?.toLowerCase().includes(lowerSearch);
        return titleMatches || userMatches;
      });
    }

    // Filter status
    if (statusFilter !== "") {
      temp = temp.filter((item) => item.status === statusFilter);
    }

    // Filter angkatan
    if (angkatanFilter !== "") {
      temp = temp.filter((item) => {
        return item.User?.periode_masuk?.startsWith(angkatanFilter);
      });
    }

    // Sort (urutan)
    temp.sort((a, b) => {
      switch (orderBy) {
        case "tanggalAsc":
          return new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf();
        case "tanggalDesc":
          return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
        case "namaAsc":
          return a.User?.name.localeCompare(b.User?.name || "") || 0;
        case "namaDesc":
          return b.User?.name.localeCompare(a.User?.name || "") || 0;
        default:
          // Default: terbaru
          return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
      }
    });

    setFilteredSubmissions(temp);
  }, [submissions, searchText, statusFilter, angkatanFilter, orderBy]);

  // Fungsi untuk menghapus submission
  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus pengajuan ini?")) {
      try {
        const res = await fetch(`/api/submission/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setSubmissions(submissions.filter((submission) => submission.id !== id));
          setFilteredSubmissions(filteredSubmissions.filter((submission) => submission.id !== id));
        } else {
          console.error("Gagal menghapus data:", res.statusText);
        }
      } catch (error) {
        console.error("Gagal menghapus data:", error);
      }
    }
  };

  // 3. Render
  return (
    <div className="rounded-xl bg-white p-4">
      <h2 className="mb-4 text-xl font-semibold">
        Pengajuan: Laporan Proposal Skripsi (Seminar Proposal)
      </h2>

      {/* Filter & Pencarian */}
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Cari judul atau nama..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="rounded border border-gray-300 p-2"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded border border-gray-300 p-2"
        >
          <option value="">-- Filter Status --</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={angkatanFilter}
          onChange={(e) => setAngkatanFilter(e.target.value)}
          className="rounded border border-gray-300 p-2"
        >
          <option value="">-- Filter Angkatan --</option>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          {/* Tambah lagi sesuai kebutuhan */}
        </select>

        <select
          value={orderBy}
          onChange={(e) => setOrderBy(e.target.value)}
          className="rounded border border-gray-300 p-2"
        >
          <option value="tanggalDesc">Terbaru</option>
          <option value="tanggalAsc">Terlama</option>
          <option value="namaAsc">Nama A-Z</option>
          <option value="namaDesc">Nama Z-A</option>
        </select>
      </div>

      {/* Tabel Data */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-3 text-left">No</th>
              <th className="p-3 text-left">Judul</th>
              <th className="p-3 text-left">Nama Mahasiswa</th>
              <th className="p-3 text-left">Pihak Verifikasi</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Tanggal Pengajuan</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map((item, index) => {
              const formattedDate = new Date(item.createdAt).toLocaleString("id-ID");

              return (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{item.title}</td>
                  <td className="p-3">{item.User?.name || "Tidak ada nama"}</td>
                  <td className="p-3">
                    {item.Verificator && item.Verificator.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {item.Verificator.map((verifier) => (
                          <div
                            key={verifier.id}
                            className="rounded border bg-gray-50 p-2"
                          >
                            <strong>{verifier.lecturerName}</strong>
                            <br />
                            {verifier.status === "active" ? "Disetujui" : "Pending"}
                            <br />
                            {`${verifier.type}` || "Tidak ada nama"}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">Belum Ada Verifikator</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                        item.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : item.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : item.status === "on process"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {new Date(item.createdAt).toLocaleString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        className="rounded bg-blue-500 px-2 py-1 text-white shadow-md transition duration-300 ease-in-out hover:bg-blue-600 hover:shadow-lg"
                        onClick={() =>
                          (window.location.href = `${window.location.origin}${window.location.pathname}/${item.id}`)
                        }
                      >
                        Ubah
                      </button>
                      <button
                        className="rounded bg-red-500 px-2 py-1 text-white shadow-md transition duration-300 ease-in-out hover:bg-red-600 hover:shadow-lg"
                        onClick={() => handleDelete(item.id)}
                      >
                        Hapus
                      </button>
                      {/* <button className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow-md transition duration-300 ease-in-out">
                          Hasil
                        </button> */}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredSubmissions.length === 0 && (
              <tr>
                <td colSpan={7} className="p-3 text-center text-gray-500">
                  Tidak ada data yang cocok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
