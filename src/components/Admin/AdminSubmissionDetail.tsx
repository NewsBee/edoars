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
  const [skillGroups, setSkillGroups] = useState<
    { id: number; name: string }[]
  >([]);

  const [allLecturers, setAllLecturers] = useState([]); // Semua dosen dari API
  const [selectedSkillGroup, setSelectedSkillGroup] = useState(""); // Kelompok keahlian yang dipilih

  const [selectedLecturers, setSelectedLecturers] = useState({
    lecturer1: "",
    lecturer2: "",
  });

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const response = await fetch("/api/lecturers");
        const data = await response.json();
        console.log("Respons API:", data);
        setSkillGroups(data.skillGroups || []); // Simpan kelompok keahlian
        setAllLecturers(data.lecturers || []); // Simpan semua dosen
        setLecturers(data.lecturers || []); // Awalnya tampilkan semua dosen
        // setLecturers(data.lecturers || []);
      } catch (error) {
        toast.error("Gagal memuat data dosen.");
      }
    };

    fetchLecturers();
  }, []);

  // Filter dosen berdasarkan kelompok keahlian yang dipilih
  useEffect(() => {
    if (!selectedSkillGroup) {
      setLecturers([]); // Jika kelompok keahlian tidak dipilih, kosongkan dosen
      return;
    }

    // Filter dosen yang relevan
    const filteredLecturers = allLecturers.filter((lecturer: any) => {
      const group = skillGroups.find(
        (group) => group.id === Number(selectedSkillGroup),
      );
      return group ? lecturer.skillGroups.includes(group.name) : false;
    });

    setLecturers(filteredLecturers);
  }, [selectedSkillGroup, allLecturers, skillGroups]);

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
      router.refresh();
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
        // toast.error(`Error: ${data.message}`);
        console.log(data);
        throw new Error(data.message);
        // return;
      }

      toast.success("Pengajuan berhasil disetujui.");
      setShowApproveModal(false);
      window.location.reload();
      // router.push('/')
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat menyetujui.");
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
    <div className="rounded-lg border border-gray-300 bg-white p-6 text-black shadow-sm">
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
        <p>
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

        {/* Bagian Berkas */}
        {submission.requiredFiles && submission.requiredFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-800">
              Berkas Mahasiswa:
            </h3>
            <ul className="mt-4 space-y-4">
              {submission.requiredFiles.map((file: any, index: number) => (
                <li
                  key={index}
                  className="flex items-center justify-between rounded-lg border bg-gray-50 p-4 shadow-sm"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {file.RequiredFile.file_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Status: {file.status}
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <a
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white shadow hover:bg-blue-600"
                    >
                      Preview
                    </a>
                    <a
                      href={file.file_url}
                      download
                      className="rounded-md bg-green-500 px-4 py-2 text-sm text-white shadow hover:bg-green-600"
                    >
                      Download
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

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
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-bold">Setujui Pengajuan</h2>
            <div className="mt-4 space-y-4">
              {/* Dropdown untuk Kelompok Keahlian */}
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Kelompok Keahlian
                </label>
                <select
                  value={selectedSkillGroup}
                  onChange={(e) => {
                    const selectedGroupId = e.target.value;
                    setSelectedSkillGroup(selectedGroupId);

                    // Filter dosen berdasarkan kelompok keahlian yang dipilih
                    const group = skillGroups.find(
                      (group) => group.id === Number(selectedGroupId),
                    );
                    if (!group) {
                      setLecturers([]);
                      return;
                    }

                    const filteredLecturers = allLecturers.filter(
                      (lecturer: any) =>
                        lecturer.skillGroups.includes(group.name),
                    );
                    setLecturers(filteredLecturers);
                  }}
                  className="w-full rounded-lg border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                >
                  <option value="">Pilih Kelompok Keahlian</option>
                  {skillGroups.map((group: any) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dropdown untuk Dosen Pembimbing 1 */}
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Dosen Pembimbing 1
                </label>
                <select
                  value={selectedLecturers.lecturer1}
                  onChange={(e) => {
                    setSelectedLecturers({
                      ...selectedLecturers,
                      lecturer1: e.target.value,
                    });
                  }}
                  className="w-full rounded-lg border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                  disabled={!selectedSkillGroup} // Disabled jika belum memilih kelompok keahlian
                >
                  <option value="">Pilih</option>
                  {lecturers.map((lecturer: any) => (
                    <option key={lecturer.id} value={lecturer.id}>
                      {lecturer.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dropdown untuk Dosen Pembimbing 2 */}
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Dosen Pembimbing 2
                </label>
                <select
                  value={selectedLecturers.lecturer2}
                  onChange={(e) => {
                    setSelectedLecturers({
                      ...selectedLecturers,
                      lecturer2: e.target.value,
                    });
                  }}
                  className="w-full rounded-lg border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                  disabled={!selectedSkillGroup} // Disabled jika belum memilih kelompok keahlian
                >
                  <option value="">Pilih</option>
                  {lecturers.map((lecturer: any) => (
                    <option
                      key={lecturer.id}
                      value={lecturer.id}
                      disabled={selectedLecturers.lecturer1 === lecturer.id} // Disable jika sudah dipilih di Pembimbing 1
                    >
                      {lecturer.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="rounded-lg bg-gray-200 px-4 py-2"
                onClick={() => setShowApproveModal(false)}
              >
                Batal
              </button>
              <button
                className="rounded-lg bg-green-500 px-4 py-2 text-white shadow hover:bg-green-600"
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
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-bold">Ubah Dosen Pembimbing</h2>
            <div className="mt-4 space-y-4">
              {/* Dropdown untuk Kelompok Keahlian */}
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Kelompok Keahlian
                </label>
                <select
                  value={selectedSkillGroup}
                  onChange={(e) => {
                    const selectedGroupId = e.target.value;
                    setSelectedSkillGroup(selectedGroupId);

                    // Filter dosen berdasarkan kelompok keahlian
                    const group = skillGroups.find(
                      (group) => group.id === Number(selectedGroupId),
                    );
                    if (!group) {
                      setLecturers([]);
                      return;
                    }

                    const filteredLecturers = allLecturers.filter(
                      (lecturer: any) =>
                        lecturer.skillGroups.includes(group.name),
                    );
                    setLecturers(filteredLecturers);
                  }}
                  className="w-full rounded-lg border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                >
                  <option value="">Pilih Kelompok Keahlian</option>
                  {skillGroups.map((group: any) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dropdown untuk Dosen Pembimbing 1 */}
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Dosen Pembimbing 1
                </label>
                <select
                  value={selectedLecturers.lecturer1}
                  onChange={(e) => {
                    setSelectedLecturers({
                      ...selectedLecturers,
                      lecturer1: e.target.value,
                    });
                  }}
                  className="w-full rounded-lg border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                  disabled={!selectedSkillGroup} // Disabled jika belum memilih kelompok keahlian
                >
                  <option value="">Pilih</option>
                  {lecturers.map((lecturer: any) => (
                    <option key={lecturer.id} value={lecturer.id}>
                      {lecturer.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dropdown untuk Dosen Pembimbing 2 */}
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Dosen Pembimbing 2
                </label>
                <select
                  value={selectedLecturers.lecturer2}
                  onChange={(e) => {
                    setSelectedLecturers({
                      ...selectedLecturers,
                      lecturer2: e.target.value,
                    });
                  }}
                  className="w-full rounded-lg border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                  disabled={!selectedSkillGroup} // Disabled jika belum memilih kelompok keahlian
                >
                  <option value="">Pilih</option>
                  {lecturers
                    .filter(
                      (lecturer: any) =>
                        lecturer.id !== selectedLecturers.lecturer1,
                    ) // Filter untuk tidak menampilkan dosen yang sama
                    .map((lecturer: any) => (
                      <option key={lecturer.id} value={lecturer.id}>
                        {lecturer.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="rounded-lg bg-gray-200 px-4 py-2"
                onClick={() => setShowEditLecturersModal(false)}
              >
                Batal
              </button>
              <button
                className="rounded-lg bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-600"
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
