"use client";

import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";

interface DetailSubmissionProps {
  submissionData: any;
}

const DetailSubmission: React.FC<DetailSubmissionProps> = ({
  submissionData,
}) => {
  const {
    id,
    title,
    status,
    description,
    academicYear,
    amountOfSks,
    ipkNow,
    semester,
    room,
    jadwal,
    skillGroup,
    Verificator = [],
    Type,
  } = submissionData || {};

  const { data: session } = useSession();

  const [formData, setFormData] = useState<{
    judul: string;
    deskripsi: string;
    bidangKeahlian: string;
    jadwal: string;
    ruangan: string;
    hasilKeputusan: string;
    jumlahSKS: string;
    ipk: string;
    tahunAkademik: string;
    semester: string;
    skillGroup: string;
    file: File | null;
  }>({
    judul: title || "",
    deskripsi: description || "",
    bidangKeahlian: skillGroup?.id || "",
    jadwal: jadwal || "",
    ruangan: room || "",
    hasilKeputusan: status || "Pending",
    jumlahSKS: amountOfSks || "",
    ipk: ipkNow || "",
    tahunAkademik: academicYear || "",
    semester: semester || "",
    skillGroup: skillGroup?.id || "",
    file: null,
  });

  const [showAddVerificatorModal, setShowAddVerificatorModal] = useState(false);
  const [showEditVerificatorModal, setShowEditVerificatorModal] =
    useState(false);
  const [searchLecturer, setSearchLecturer] = useState("");
  const [filterSkillGroup, setFilterSkillGroup] = useState("");
  const [selectedLecturer, setSelectedLecturer] = useState("");
  const [type, setType] = useState("");
  const [verificator, setVerificator] = useState("");
  const [verificatorStatus, setVerificatorStatus] = useState(() => {
    const verificator = Verificator.find(
      (v: any) => v.lecturerName === session?.user?.name,
    );
    return verificator ? verificator.status : "";
  });

  const [verificatorId, setVerificatorId] = useState(() => {
    const verificator = Verificator.find(
      (v: any) => v.lecturerName === session?.user?.name,
    );
    return verificator ? verificator.id : "";
  });
  const [lecturers, setLecturers] = useState<any[]>([]);

  console.log(Verificator);
  console.log(verificatorStatus);
  console.log(verificatorId);

  useEffect(() => {
    fetch("/api/dosen")
      .then((response) => response.json())
      .then((data) => setLecturers(data.lecturers || []))
      .catch((error) => console.error("Error fetching lecturers:", error));
  }, []);

  // console.log(lecturers);

  // Add these functions near the top of your component
  const handleAddVerificator = async (
    lecturerId: string,
    type: "Pembimbing" | "Penguji",
  ) => {
    try {
      const response = await fetch("/api/verificator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submissionId: id,
          lecturerId,
          type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add verificator");
      }

      const result = await response.json();
      toast.success("Verificator added successfully");
      // Refresh the page or update the state
      window.location.reload();
    } catch (error) {
      console.error("Error adding verificator:", error);
      toast.error("Error adding verificator");
    }
  };

  const handleEditVerificator = async (
    verificatorId: string,
    lecturerId: string,
  ) => {
    try {
      const response = await fetch(`/api/verificator/${verificatorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lecturerId,
          submissionId: submissionData.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update verificator");
      }

      const result = await response.json();
      toast.success("Verificator updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error updating verificator:", error);
      toast.error("Error updating verificator");
    }
  };

  const handleDeleteVerificator = async (verificatorId: string) => {
    if (!confirm("Are you sure you want to delete this verificator?")) return;

    try {
      const response = await fetch(`/api/verificator/${verificatorId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete verificator");
      }

      toast.success("Verificator deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting verificator:", error);
      toast.error("Error deleting verificator");
    }
  };

  const filteredLecturers =
    (lecturers || []).filter(
      (lecturer) =>
        lecturer.name.toLowerCase().includes(searchLecturer.toLowerCase()) &&
        (filterSkillGroup === "" || lecturer.skillGroupId === filterSkillGroup),
    ) || [];
  console.log(filteredLecturers);

  useEffect(() => {
    if (submissionData) {
      setFormData({
        judul: title || "",
        deskripsi: description || "",
        bidangKeahlian: submissionData.skillGroupId || "",
        jadwal: jadwal || "",
        ruangan: room || "",
        hasilKeputusan: status || "Pending",
        jumlahSKS: amountOfSks || "",
        ipk: ipkNow || "",
        tahunAkademik: academicYear || "",
        semester: semester || "",
        skillGroup: skillGroup?.id || "",
        file: null,
      });
    }
  }, [
    submissionData,
    title,
    description,
    skillGroup,
    jadwal,
    room,
    status,
    amountOfSks,
    ipkNow,
    academicYear,
    semester,
  ]);

  if (!submissionData) {
    return <div>Loading...</div>;
  }

  console.log(submissionData);
  console.log(verificatorStatus);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.hasilKeputusan === "approved" &&
      submissionData.approvedFiles !== submissionData.totalFiles
    ) {
      toast.error("Ada file yang belum Anda setujui.");
      return;
    }
    try {
      const response = await fetch(`/api/submission/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.judul,
          description: formData.deskripsi,
          status: formData.hasilKeputusan,
          jadwal: formData.jadwal,
          room: formData.ruangan,
          academicYear: formData.tahunAkademik,
          amountOfSks: formData.jumlahSKS,
          ipkNow: formData.ipk,
          semester: formData.semester,
          skillGroupId: formData.bidangKeahlian,
          verificatorStatus,
          verificatorId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update submission");
      }

      const result = await response.json();
      console.log("Submission updated successfully:", result);
      toast.success("Submission updated successfully");
    } catch (error) {
      console.error("Error updating submission:", error);
      toast.error("Error updating submission");
    }
  };

  // Always prepare 2 slots for pembimbing

  // Data verificator
  const pembimbingList = Verificator.filter(
    (v: any) => v.type === "Pembimbing",
  );
  const pengujiList = Verificator.filter((v: any) => v.type === "Penguji");
  const pembimbingSlots = Array.from(
    { length: 2 },
    (_, i) => pembimbingList[i] || null,
  );

  // Always prepare 2 slots for penguji
  const pengujiSlots = Array.from(
    { length: 2 },
    (_, i) => pengujiList[i] || null,
  );

  return (
    <div className="container mx-auto p-8">
      <div className="dark:bg-gray-800">
        <h2 className="mb-8 text-3xl font-bold text-gray-800 dark:text-gray-100">
          Detail Pengajuan
        </h2>

        {session?.user?.role === "Mahasiswa" ? (
          <form>
            {/* Judul (disabled) */}
            <div className="mb-6">
              <label
                htmlFor="judul"
                className="block text-lg font-medium text-gray-700 dark:text-gray-300"
              >
                Judul
              </label>
              <input
                type="text"
                id="judul"
                name="judul"
                value={formData.judul}
                disabled
                className="mt-2 w-full cursor-not-allowed rounded-lg border border-gray-300 p-3 dark:bg-gray-700 dark:text-white"
              />
            </div>
            {/* Deskripsi (readOnly) */}
            <div className="mb-6">
              <label
                htmlFor="deskripsi"
                className="block text-lg font-medium text-gray-700 dark:text-gray-300"
              >
                Deskripsi
              </label>
              <ReactQuill
                value={formData.deskripsi}
                readOnly
                modules={{ toolbar: false }}
                className="mt-2 w-full border border-gray-300 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Verificator Section */}
            <div className="mt-8">
              <h3 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Verificator
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Pembimbing */}
                <div>
                  {pembimbingSlots.map((v, index) =>
                    v ? (
                      <div
                        key={`pembimbing-${v.id}`}
                        className="mb-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-700"
                      >
                        <p>
                          <strong>Role:</strong> {v.type}{" "}
                          <span className="ml-2 inline-block rounded-full bg-blue-200 px-3 py-1 text-sm font-semibold text-blue-700">
                            {v.status}
                          </span>
                        </p>
                        <p>
                          <strong>Nama:</strong> {v.lecturerName}
                        </p>
                      </div>
                    ) : (
                      <div
                        key={`pembimbing-new-${index}`}
                        className="mb-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-700"
                      >
                        <p>Belum ada pembimbing.</p>
                      </div>
                    ),
                  )}
                </div>
                {/* Penguji */}
                <div>
                  {pengujiSlots.map((v, index) =>
                    v ? (
                      <div
                        key={`penguji-${v.id}`}
                        className="mb-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-700"
                      >
                        <p>
                          <strong>Role:</strong> {v.type}{" "}
                          <span className="ml-2 inline-block rounded-full bg-blue-200 px-3 py-1 text-sm font-semibold text-blue-700">
                            {v.status}
                          </span>
                        </p>
                        <p>
                          <strong>Nama:</strong> {v.lecturerName}
                        </p>
                      </div>
                    ) : (
                      <div
                        key={`penguji-new-${index}`}
                        className="mb-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-700"
                      >
                        <p>Belum ada penguji.</p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Judul */}
            <div className="mb-6">
              <label
                htmlFor="judul"
                className="block text-lg font-medium text-gray-700 dark:text-gray-300"
              >
                Judul
              </label>
              <input
                type="text"
                id="judul"
                name="judul"
                value={formData.judul}
                onChange={handleChange}
                disabled={session?.user?.role === "Dosen"}
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 dark:bg-gray-700 dark:text-white"
              />
            </div>
            {/* Deskripsi */}
            <div className="mb-6">
              <label
                htmlFor="deskripsi"
                className="block text-lg font-medium text-gray-700 dark:text-gray-300"
              >
                Deskripsi
              </label>
              {session?.user?.role === "Admin" ? (
                <ReactQuill
                  value={formData.deskripsi}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, deskripsi: value }))
                  }
                  className="mt-2 w-full border border-gray-300 dark:bg-gray-700 dark:text-white"
                />
              ) : (
                <ReactQuill
                  value={formData.deskripsi}
                  readOnly
                  modules={{ toolbar: false }}
                  className="mt-2 w-full border border-gray-300 dark:bg-gray-700 dark:text-white"
                />
              )}
            </div>
            {/* Bidang Keahlian */}
            <div className="mb-6">
              <label
                htmlFor="bidangKeahlian"
                className="block text-lg font-medium text-gray-700 dark:text-gray-300"
              >
                Bidang Keahlian
              </label>
              <select
                id="bidangKeahlian"
                name="bidangKeahlian"
                value={formData.bidangKeahlian}
                onChange={handleChange}
                disabled={session?.user?.role === "Dosen"}
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 dark:bg-gray-700 dark:text-white"
              >
                {formData.bidangKeahlian === "null" && (
                  <option value="">Belum ada kelompok keahlian</option>
                )}
                {submissionData.skillGroups?.map((skill: any) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Jadwal */}
            {Type?.formats[0]?.is_schedule_required && (
              <div className="mb-6">
                <label
                  htmlFor="jadwal"
                  className="block text-lg font-medium text-gray-700 dark:text-gray-300"
                >
                  Tentukan jadwal seminar
                </label>
                <input
                  type="datetime-local"
                  id="jadwal"
                  name="jadwal"
                  value={formData.jadwal}
                  onChange={handleChange}
                  disabled={
                    session?.user?.role === "Dosen" ||
                    Type?.formats[0]?.is_newtitle_submission
                  }
                  className={`mt-2 w-full rounded-lg border border-gray-300 p-3 dark:bg-gray-700 dark:text-white ${
                    session?.user?.role === "Dosen" ||
                    Type?.formats[0]?.is_newtitle_submission
                      ? "bg-gray-300 dark:bg-gray-600"
                      : ""
                  }`}
                />
                {Type?.formats[0]?.is_newtitle_submission && (
                  <p className="mt-2 text-sm text-red-500">
                    Pengajuan ini tidak memerlukan jadwal.
                  </p>
                )}
              </div>
            )}
            <div className="mb-6">
              <label
                htmlFor="ruangan"
                className="block text-lg font-medium text-gray-700 dark:text-gray-300"
              >
                Tentukan Ruangan Offline / Online
              </label>
              <input
                type="text"
                id="ruangan"
                name="ruangan"
                value={formData.ruangan}
                onChange={handleChange}
                disabled={
                  Type?.formats[0]?.is_newtitle_submission ||
                  session?.user?.role === "Dosen"
                }
                className={`mt-2 w-full rounded-lg border border-gray-300 p-3 dark:bg-gray-700 dark:text-white ${
                  Type?.formats[0]?.is_newtitle_submission ||
                  session?.user?.role === "Dosen"
                    ? "bg-gray-300 dark:bg-gray-600"
                    : ""
                }`}
              />
              {Type?.formats[0]?.is_newtitle_submission && (
                <p className="mt-2 text-sm text-red-500">
                  Pengajuan ini tidak memerlukan ruangan.
                </p>
              )}
              {!Type?.formats[0]?.is_newtitle_submission && (
                <p className="mt-2 text-sm text-gray-500">
                  <strong>Catatan:</strong> Ruangan akan ditentukan oleh bagian
                  administrasi.
                </p>
              )}
            </div>
            {/* Hasil Rekomendasi Sidang */}
            <div className="mb-6">
              <label
                htmlFor="hasilKeputusan"
                className="block text-lg font-medium text-gray-700 dark:text-gray-300"
              >
                Hasil Rekomendasi Sidang
              </label>
              <select
                id="hasilKeputusan"
                name="hasilKeputusan"
                value={formData.hasilKeputusan}
                disabled={session?.user?.role === "Dosen"}
                onChange={handleChange}
                className={`mt-2 w-full rounded-lg border border-gray-300 p-3 dark:bg-gray-700 dark:text-white ${
                  session?.user?.role === "Dosen"
                    ? "bg-gray-300 dark:bg-gray-600"
                    : ""
                }`}
              >
                <option value="pending">Pending</option>
                <option value="processed">On Process</option>
                <option value="approved">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="repeated">Repeated</option>
              </select>
            </div>
            {/* Jumlah SKS dan IPK */}
            {session?.user?.role !== "Dosen" && (
              <>
                <div className="mb-6 flex space-x-4">
                  <div className="w-1/2">
                    <label
                      htmlFor="jumlahSKS"
                      className="block text-lg font-medium text-gray-700 dark:text-gray-300"
                    >
                      Jumlah SKS saat ini
                    </label>
                    <input
                      type="number"
                      id="jumlahSKS"
                      name="jumlahSKS"
                      value={formData.jumlahSKS}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-lg border border-gray-300 p-3 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="w-1/2">
                    <label
                      htmlFor="ipk"
                      className="block text-lg font-medium text-gray-700 dark:text-gray-300"
                    >
                      IPK saat ini
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      id="ipk"
                      name="ipk"
                      value={formData.ipk}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-lg border border-gray-300 p-3 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                {/* Tahun Akademik dan Semester */}
                <div className="mb-6 flex space-x-4">
                  <div className="w-1/2">
                    <label
                      htmlFor="tahunAkademik"
                      className="block text-lg font-medium text-gray-700 dark:text-gray-300"
                    >
                      Tahun Akademik
                    </label>
                    <input
                      type="text"
                      id="tahunAkademik"
                      name="tahunAkademik"
                      value={formData.tahunAkademik}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-lg border border-gray-300 p-3 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="w-1/2">
                    <label
                      htmlFor="semester"
                      className="block text-lg font-medium text-gray-700 dark:text-gray-300"
                    >
                      Semester
                    </label>
                    <select
                      id="semester"
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-lg border border-gray-300 p-3 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Ganjil">Ganjil</option>
                      <option value="Genap">Genap</option>
                    </select>
                  </div>
                </div>
              </>
            )}
            {session?.user?.role === "Dosen" && (
              <div className="mb-6">
                <label
                  htmlFor="verificatorStatus"
                  className="block text-lg font-medium text-gray-700 dark:text-gray-300"
                >
                  Ubah Status Pengajuan
                </label>
                <select
                  id="verificatorStatus"
                  name="verificatorStatus"
                  value={verificatorStatus}
                  onChange={(e) => {
                    setVerificatorStatus(e.target.value);
                  }}
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 dark:bg-gray-700 dark:text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Disetujui</option>
                  <option value="rejected">Ditolak</option>
                </select>
              </div>
            )}
            {/* Verificator Section */}
            <div className="mt-8">
              <h3 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Verificator
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Pembimbing */}
                {Type?.formats[0]?.requires_pembimbing && (
                  <div>
                    {pembimbingSlots.map((v, index) =>
                      v ? (
                        <div
                          key={`pembimbing-${v.id}`}
                          className="mb-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-700"
                        >
                          <p>
                            <strong>Role:</strong> {v.type}{" "}
                            <span
                              className={`ml-2 inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                                v.status === "pending"
                                  ? "bg-yellow-200 text-yellow-700"
                                  : v.status === "approved"
                                    ? "bg-green-200 text-green-700"
                                    : v.status === "rejected"
                                      ? "bg-red-200 text-red-700"
                                      : "bg-blue-200 text-blue-700"
                              }`}
                            >
                              {v.status === "approved"
                                ? "Disetujui"
                                : v.status.charAt(0).toUpperCase() +
                                  v.status.slice(1)}
                            </span>
                          </p>
                          <p>
                            <strong>Nama:</strong> {v.lecturerName}
                          </p>
                          {session?.user?.role !== "Dosen" && (
                            <div className="mt-2 flex space-x-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowEditVerificatorModal(true);
                                  setVerificator(v.id);
                                  setSelectedLecturer(v.lecturerId);
                                }}
                                className="rounded-lg bg-yellow-500 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-yellow-600"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteVerificator(v.id)}
                                className="rounded-lg bg-red-500 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-red-600"
                              >
                                Hapus
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          key={`pembimbing-new-${index}`}
                          className="mb-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-700"
                        >
                          <p>Belum ada pembimbing.</p>
                          {session?.user?.role !== "Dosen" && (
                            <div className="mt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAddVerificatorModal(true);
                                  setType("Pembimbing");
                                }}
                                className="rounded-lg bg-green-500 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-green-600"
                              >
                                Tambah Verifikator
                              </button>
                            </div>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                )}
                {/* Penguji */}
                {Type?.formats[0]?.requires_penguji && (
                  <div>
                    {pengujiSlots.map((v, index) =>
                      v ? (
                        <div
                          key={`penguji-${v.id}`}
                          className="mb-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-700"
                        >
                          <p>
                            <strong>Role:</strong> {v.type}{" "}
                            <span
                              className={`ml-2 inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                                v.status === "pending"
                                  ? "bg-yellow-200 text-yellow-700"
                                  : v.status === "approved"
                                    ? "bg-green-200 text-green-700"
                                    : v.status === "rejected"
                                      ? "bg-red-200 text-red-700"
                                      : "bg-blue-200 text-blue-700"
                              }`}
                            >
                              {v.status === "approved"
                                ? "Disetujui"
                                : v.status.charAt(0).toUpperCase() +
                                  v.status.slice(1)}
                            </span>
                          </p>
                          <p>
                            <strong>Nama:</strong> {v.lecturerName}
                          </p>
                          {session?.user?.role !== "Dosen" && (
                            <div className="mt-2 flex space-x-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowEditVerificatorModal(true);
                                  setVerificator(v.id);
                                  setSelectedLecturer(v.lecturerId);
                                }}
                                className="rounded-lg bg-yellow-500 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-yellow-600"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteVerificator(v.id)}
                                className="rounded-lg bg-red-500 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-red-600"
                              >
                                Hapus
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          key={`penguji-new-${index}`}
                          className="mb-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-700"
                        >
                          <p>Belum ada penguji.</p>
                          {session?.user?.role !== "Dosen" && (
                            <div className="mt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAddVerificatorModal(true);
                                  setType("Penguji");
                                }}
                                className="rounded-lg bg-green-500 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-green-600"
                              >
                                Tambah Verifikator
                              </button>
                            </div>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-lg bg-blue-500 px-8 py-3 font-medium text-white transition duration-300 ease-in-out hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </form>
        )}

        {showEditVerificatorModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-[700px] rounded-lg bg-white p-8 shadow-2xl">
              <h2 className="mb-6 text-2xl font-bold text-gray-800">
                Edit Verifikator
              </h2>

              <div className="mb-6 flex space-x-4">
                <div className="flex w-1/2 items-center">
                  <input
                    type="text"
                    id="searchLecturer"
                    value={searchLecturer}
                    onChange={(e) => setSearchLecturer(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm transition duration-150 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                    placeholder="🔍 Cari nama dosen..."
                  />
                  <span className="ml-2 text-gray-500">
                    <i className="ri-search-line"></i>
                  </span>
                </div>
                <div className="flex w-1/2 items-center">
                  <select
                    id="filterSkillGroup"
                    value={filterSkillGroup}
                    onChange={(e) => setFilterSkillGroup(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm transition duration-150 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                  >
                    <option value="">🎓 Semua Bidang Keahlian</option>
                    {submissionData.skillGroups?.map((group: any) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                  <span className="ml-2 text-gray-500">
                    <i className="ri-filter-3-line"></i>
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <label
                  htmlFor="lecturerList"
                  className="mb-2 block text-lg font-medium text-gray-700"
                >
                  Pilih Dosen
                </label>
                <select
                  id="lecturerList"
                  name="lecturerList"
                  value={selectedLecturer}
                  onChange={(e) => setSelectedLecturer(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white p-4 text-lg shadow-md transition duration-150 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">Pilih dosen verifikator</option>
                  {filteredLecturers.map((lecturer) => (
                    <option key={lecturer.id} value={lecturer.id}>
                      {lecturer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowEditVerificatorModal(false)}
                  className="rounded-lg bg-gray-100 px-6 py-3 text-lg font-semibold text-gray-700 transition duration-150 hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    // TODO: Update Verificator di server
                    handleEditVerificator(verificator, selectedLecturer);
                    setShowEditVerificatorModal(false);
                  }}
                  className="rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition duration-150 hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddVerificatorModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-[700px] rounded-lg bg-white p-8 shadow-2xl">
              <h2 className="mb-6 text-2xl font-bold text-gray-800">
                Tambah Verifikator
              </h2>

              <div className="mb-6 flex space-x-4">
                <div className="w-1/2">
                  <input
                    type="text"
                    id="searchLecturer"
                    value={searchLecturer}
                    onChange={(e) => setSearchLecturer(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm transition duration-150 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                    placeholder="🔍 Cari nama dosen..."
                  />
                </div>
                <div className="w-1/2">
                  <select
                    id="filterSkillGroup"
                    value={filterSkillGroup}
                    onChange={(e) => setFilterSkillGroup(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm transition duration-150 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                  >
                    <option value="">🎓 Semua Bidang Keahlian</option>
                    {submissionData.skillGroups?.map((group: any) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-8">
                <label
                  htmlFor="lecturerList"
                  className="mb-2 block text-lg font-medium text-gray-700"
                >
                  Pilih Dosen
                </label>
                <select
                  id="lecturerList"
                  name="lecturerList"
                  value={selectedLecturer}
                  onChange={(e) => setSelectedLecturer(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white p-4 text-lg shadow-md transition duration-150 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">Pilih dosen verifikator</option>
                  {filteredLecturers.map((lecturer) => (
                    <option key={lecturer.id} value={lecturer.id}>
                      {lecturer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowAddVerificatorModal(false)}
                  className="rounded-lg bg-gray-100 px-6 py-3 text-lg font-semibold text-gray-700 transition duration-150 hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    // TODO: Simpan Verificator baru ke server
                    handleAddVerificator(selectedLecturer, type as any);
                    setShowAddVerificatorModal(false);
                  }}
                  className="rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition duration-150 hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailSubmission;
