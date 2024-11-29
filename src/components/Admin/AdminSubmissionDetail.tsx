"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminSubmissionDetail = ({ submission }: { submission: any }) => {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRevertModal, setShowRevertModal] = useState(false);
  const [showEditLecturersModal, setShowEditLecturersModal] = useState(false);
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [lecturers, setLecturers] = useState([]);
  const [selectedLecturers, setSelectedLecturers] = useState({
    lecturer1: "",
    lecturer2: "",
  });

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const response = await fetch("/api/lecturers");
        const data = await response.json();
        setLecturers(data.lecturers || []);
      } catch (error) {
        toast.error("Gagal memuat data dosen.");
      }
    };

    fetchLecturers();
  }, []);

  const handleReject = async () => {
    if (!reason) {
      toast.error("Harap masukkan alasan penolakan.");
      return;
    }

    try {
      const response = await fetch(
        `/api/title-submission/${submission.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: "Rejected", reason }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        toast.error(`Error: ${data.message}`);
        return;
      }

      toast.success("Pengajuan berhasil ditolak.");
      setShowRejectModal(false);
      window.location.reload();
      // router.push('/')
    } catch (error) {
      toast.error("Terjadi kesalahan saat menolak.");
    }
  };

  const handleRevert = async () => {
    try {
      const response = await fetch(
        `/api/title-submission/${submission.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ action: "Revert", status: "Pending" }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        toast.error(`Error: ${data.message}`);
        return;
      }

      toast.success("Status pengajuan berhasil dikembalikan ke Pending.");
      setShowRevertModal(false);
      window.location.reload();
      // router.push('/')
      router.refresh()
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengembalikan status.");
    }
  };

  const handleApprove = async () => {
    if (!selectedLecturers.lecturer1 || !selectedLecturers.lecturer2) {
      toast.error("Harap pilih kedua dosen pembimbing.");
      return;
    }

    try {
      const response = await fetch(
        `/api/title-submission/${submission.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status: "Approved",
            assignedLecturers: [
              {
                lecturerId: Number(selectedLecturers.lecturer1),
                role: "Pembimbing 1",
              },
              {
                lecturerId: Number(selectedLecturers.lecturer2),
                role: "Pembimbing 2",
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        toast.error(`Error: ${data.message}`);
        return;
      }

      toast.success("Pengajuan berhasil disetujui.");
      setShowApproveModal(false);
      window.location.reload();
      // router.push('/')
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyetujui.");
    }
  };

  const handleEditLecturers = async () => {
    if (!selectedLecturers.lecturer1 || !selectedLecturers.lecturer2) {
      toast.error("Harap pilih kedua dosen pembimbing.");
      return;
    }

    try {
      const response = await fetch(
        `/api/title-submission/${submission.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            action: "EditLecturers", // Tindakan untuk mengubah dosen pembimbing
            assignedLecturers: [
              {
                lecturerId: Number(selectedLecturers.lecturer1),
                role: "Pembimbing 1",
              },
              {
                lecturerId: Number(selectedLecturers.lecturer2),
                role: "Pembimbing 2",
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        toast.error(`Error: ${data.message}`);
        return;
      }

      toast.success("Dosen pembimbing berhasil diperbarui.");
      setShowEditLecturersModal(false); // Menutup modal setelah berhasil
      // window.location.reload();
      // router.push('/') // Navigasi kembali ke halaman utama
    } catch (error) {
      toast.error("Terjadi kesalahan saat memperbarui dosen pembimbing.");
    }
  };

  return (
    <div className="p-6 rounded-lg border border-gray-300 bg-white shadow-sm text-black">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="mb-4 text-2xl font-bold text-black">{submission.title}</h1>
      <div className="space-y-4">
        <p>
          <strong>Nama Mahasiswa:</strong> {submission.User.name}
        </p>
        <p>
          <strong>NIM:</strong> {submission.User.nim}
        </p>
        <p>
          <strong>Topik:</strong> {submission.topic}
        </p>
        <p className="">
          <strong>Abstrak:</strong> {submission.abstract}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`${
              submission.status === "Pending"
                ? "text-yellow-500"
                : submission.status === "Approved"
                  ? "text-green-500"
                  : "text-red-500"
            }`}
          >
            {submission.status}
          </span>
        </p>

        {/* Informasi Dosen Pembimbing */}
        {submission.status === "Approved" && submission.assignedLecturers && (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <h3 className="col-span-full text-lg font-bold text-gray-800">
              Dosen Pembimbing:
            </h3>
            {submission.assignedLecturers.map((lecturer: any) => (
              <div
                key={lecturer.id}
                className="flex flex-col rounded-lg border border-gray-300 bg-white p-4 shadow-sm"
              >
                <p className="text-sm font-medium text-gray-600">
                  {lecturer.role}
                </p>
                <p className="text-lg font-bold text-gray-800">
                  {lecturer.User.name}
                </p>
                <p className="text-sm text-gray-600">{lecturer.User.email}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex space-x-4">
        {submission.status === "Pending" && (
          <>
            <button
              className="rounded bg-green-500 px-4 py-2 text-white"
              onClick={() => setShowApproveModal(true)}
            >
              Approve
            </button>
            <button
              className="rounded bg-red-500 px-4 py-2 text-white"
              onClick={() => setShowRejectModal(true)}
            >
              Reject
            </button>
          </>
        )}
        {submission.status === "Approved" && (
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white"
            onClick={() => setShowEditLecturersModal(true)}
          >
            Ubah Dosen Pembimbing
          </button>
        )}
        {submission.status !== "Pending" && (
          <button
            className="rounded bg-yellow-500 px-4 py-2 text-white"
            onClick={() => setShowRevertModal(true)}
          >
            Revert to Pending
          </button>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold">Tolak Pengajuan</h2>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Masukkan alasan penolakan"
              className="mb-4 w-full rounded border p-2"
            ></textarea>
            <div className="flex justify-end space-x-4">
              <button
                className="rounded bg-gray-200 px-4 py-2"
                onClick={() => setShowRejectModal(false)}
              >
                Batal
              </button>
              <button
                className="rounded bg-red-500 px-4 py-2 text-white"
                onClick={handleReject}
              >
                Simpan dan Tolak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded bg-white p-6 shadow-lg">
            <h2 className="text-lg font-bold">Setujui Pengajuan</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label>Dosen Pembimbing 1</label>
                <select
                  value={selectedLecturers.lecturer1}
                  onChange={(e) =>
                    setSelectedLecturers({
                      ...selectedLecturers,
                      lecturer1: e.target.value,
                    })
                  }
                  className="w-full rounded border p-2"
                >
                  <option value="">Pilih</option>
                  {lecturers.map((lecturer: any) => (
                    <option key={lecturer.id} value={lecturer.id}>
                      {lecturer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Dosen Pembimbing 2</label>
                <select
                  value={selectedLecturers.lecturer2}
                  onChange={(e) =>
                    setSelectedLecturers({
                      ...selectedLecturers,
                      lecturer2: e.target.value,
                    })
                  }
                  className="w-full rounded border p-2"
                >
                  <option value="">Pilih</option>
                  {lecturers.map((lecturer: any) => (
                    <option key={lecturer.id} value={lecturer.id}>
                      {lecturer.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="rounded bg-gray-200 px-4 py-2"
                onClick={() => setShowApproveModal(false)}
              >
                Batal
              </button>
              <button
                className="rounded bg-green-500 px-4 py-2 text-white"
                onClick={handleApprove}
              >
                Simpan dan Setujui
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lecturers Modal */}
      {showEditLecturersModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded bg-white p-6 shadow-lg">
            <h2 className="text-lg font-bold">Ubah Dosen Pembimbing</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label>Dosen Pembimbing 1</label>
                <select
                  value={selectedLecturers.lecturer1}
                  onChange={(e) =>
                    setSelectedLecturers({
                      ...selectedLecturers,
                      lecturer1: e.target.value,
                    })
                  }
                  className="w-full rounded border p-2"
                >
                  <option value="">Pilih</option>
                  {lecturers.map((lecturer: any) => (
                    <option key={lecturer.id} value={lecturer.id}>
                      {lecturer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Dosen Pembimbing 2</label>
                <select
                  value={selectedLecturers.lecturer2}
                  onChange={(e) =>
                    setSelectedLecturers({
                      ...selectedLecturers,
                      lecturer2: e.target.value,
                    })
                  }
                  className="w-full rounded border p-2"
                >
                  <option value="">Pilih</option>
                  {lecturers.map((lecturer: any) => (
                    <option key={lecturer.id} value={lecturer.id}>
                      {lecturer.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="rounded bg-gray-200 px-4 py-2"
                onClick={() => setShowEditLecturersModal(false)}
              >
                Batal
              </button>
              <button
                className="rounded bg-blue-500 px-4 py-2 text-white"
                onClick={handleEditLecturers}
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revert Modal */}
      {showRevertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold">
              Kembalikan Status ke Pending
            </h2>
            <p className="mb-6 text-gray-600">
              Apakah Anda yakin ingin mengembalikan status pengajuan ini ke
              Pending?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="rounded bg-gray-200 px-4 py-2"
                onClick={() => setShowRevertModal(false)}
              >
                Batal
              </button>
              <button
                className="rounded bg-yellow-500 px-4 py-2 text-white"
                onClick={handleRevert}
              >
                Ya, Kembalikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubmissionDetail;
