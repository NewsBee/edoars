"use client"; // Jika Anda menggunakan App Router Next.js (folder 'app'), pastikan menambahkan ini

import React, { useState, useEffect } from "react";
import { ProposalSubmissionCard } from "../Pengajuan/SubmissionCard";
import { toast } from "react-toastify";

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
  jadwal?: string;
  room?: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  decision?: string;
  User?: User;
  Type?: SubmissionType;
  Verificator?: Verificator[];
  approvedFiles?: number;
  totalFiles?: number;
  academicYear?: string;
  semester?: string;
  // Tambahkan properti lain sesuai data Anda
  //   approvedFiles, totalFiles, academicYear, semester
}

export interface SubmissionData {
  formattedSubmissions: Submission[];
}

export default function DosenSubmissionList({ slug }: { slug: string }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>(
    [],
  );
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [angkatanFilter, setAngkatanFilter] = useState("");
  const [orderBy, setOrderBy] = useState("tanggalDesc");
  console.log(submissions)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/submission/dosen?type=${slug}`);
        const data = (await res.json()) as SubmissionData;
        console.log(data);
        if (data?.formattedSubmissions) {
          setSubmissions(data.formattedSubmissions);
          setFilteredSubmissions(data.formattedSubmissions);
        }
      } catch (error) {
        console.error("Gagal memuat data:", error);
        toast.error("Gagal memuat data");
      }
    }
    fetchData();
  }, [slug]);
  console.log(angkatanFilter);

  useEffect(() => {
    let temp = [...submissions];

    // Filter berdasarkan searchText (judul / nama user)
    if (searchText.trim() !== "") {
      const lowerSearch = searchText.toLowerCase();
      temp = temp.filter((item) => {
        const titleMatches = item.title?.toLowerCase().includes(lowerSearch);
        const userMatches = item.User?.name
          ?.toLowerCase()
          .includes(lowerSearch);
        return titleMatches || userMatches;
      });
    }

    // Filter status
    if (statusFilter !== "") {
      temp = temp.filter((item) => item.status === statusFilter);
    }

    // Filter angkatan
    if (angkatanFilter !== "") {
      temp = temp.filter((item) =>
        item.User?.periode_masuk?.startsWith(angkatanFilter),
      );
    }

    // Sort
    temp.sort((a, b) => {
      switch (orderBy) {
        case "tanggalAsc":
          return (
            new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf()
          );
        case "tanggalDesc":
          return (
            new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
          );
        case "namaAsc":
          return a.User?.name.localeCompare(b.User?.name || "") || 0;
        case "namaDesc":
          return b.User?.name.localeCompare(a.User?.name || "") || 0;
        default:
          return (
            new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
          );
      }
    });

    setFilteredSubmissions(temp);
  }, [submissions, searchText, statusFilter, angkatanFilter, orderBy]);

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

      {/* List Submission menggunakan ProposalSubmissionCard */}
      {filteredSubmissions.length > 0 ? (
        filteredSubmissions.map((submission) => (
          <ProposalSubmissionCard key={submission.id} submission={submission} />
        ))
      ) : (
        <p className="text-center text-gray-500">
          Tidak ada submission yang cocok.
        </p>
      )}
    </div>
  );
}
