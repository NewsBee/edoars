"use client";

import React from "react";
import { FaClipboardList } from "react-icons/fa";

export interface User {
  id: number;
  external_user_id: number;
  name: string;
  email: string;
  nim: string;
  role: string;
  periode_masuk?: string;
  createdAt: string;
  updatedAt: string;
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
  jadwal?: string;
  room?: string;
  approvedFiles?: number;
  totalFiles?: number;
  academicYear?: string;
  semester?: string;
  createdAt: string;
  updatedAt: string;
  decision?: string;
  User?: User;
  Type?: SubmissionType;
  Verificator?: Verificator[];
  skillGroup?: any;
}

const getStatusClass = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const ProposalSubmissionCard = ({
  submission,
}: {
  submission: Submission;
}) => {
  console.log(submission);
  console.log(submission.skillGroup);
  return (
    <div className="mb-6">
      <div className={`w-full rounded-lg bg-white p-6 shadow-lg`}>
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">
          {submission.title}
        </h1>
        <h2 className="mb-6 text-center text-lg text-gray-600">
          {submission.Type?.name || "Tipe Pengajuan Tidak Diketahui"}
        </h2>

        <div className="border-t border-gray-300 py-4">
          <>
            <p className="text-sm text-gray-700">
              {submission.User?.name || "Tidak ada nama"} -{" "}
              {submission.User?.nim || "Tidak ada NIM"}
            </p>
            <p className="text-sm text-gray-700">
              Status Pengajuan:
              <span
                className={`rounded-full px-2 py-1 ${getStatusClass(submission.status)}`}
              >
                {submission.status.charAt(0).toUpperCase() +
                  submission.status.slice(1)}
              </span>
              | Keputusan Seminar/Sidang:{" "}
              <span
                className={`font-semibold ${submission.decision === "MenungguKeputusan" ? "text-yellow-600" : submission.decision === "Diterima" ? "text-green-600" : submission.decision === "DiterimaDenganPerbaikan" ? "text-blue-600" : submission.decision === "Diulang" ? "text-orange-600" : "text-red-600"}`}
              >
                {submission.decision || "Belum ditentukan"}
              </span>
            </p>
            <p className="text-sm text-gray-700">
              Kelompok Keahlian:{" "}
              <span className="font-semibold text-blue-600">
                {submission.skillGroup
                  ? submission.skillGroup.name
                  : "Belum ditentukan"}
              </span>
            </p>
            <p className="text-sm text-gray-700">
              Tahun akademik: {submission.academicYear} | Semester:{" "}
              {submission.semester}
            </p>
            <p className="text-sm text-gray-700">
              Status Berkas:{" "}
              <span className="font-semibold text-blue-600">
                {submission.approvedFiles}
              </span>{" "}
              /{" "}
              <span className="font-semibold text-blue-600">
                {submission.totalFiles}
              </span>
            </p>
            <p className="text-sm text-gray-700">
              Jadwal Seminar: {submission.jadwal || "Belum ditentukan"} |
              Ruangan: {submission.room || "-"}
            </p>
            {/* <p className="text-sm text-gray-700">
              Belum dapat diproses, karena anda belum menyetujui syarat dan
              ketentuan.
            </p> */}
            {submission.Verificator && submission.Verificator.length > 0 ? (
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    {submission.Verificator.filter(
                      (verificator) => verificator.type === "Pembimbing",
                    ).length > 0 ? (
                      submission.Verificator.filter(
                        (verificator) => verificator.type === "Pembimbing",
                      ).map((verificator, index) => (
                        <div
                          key={verificator.id}
                          className="mb-2 rounded border border-gray-300 p-2"
                        >
                          <p className="text-sm font-semibold text-gray-700">
                            Pembimbing {index + 1}: {verificator.lecturerName}
                          </p>
                          <p className="text-sm text-gray-700">
                            Seminar/Sidang{""}
                            <span
                              className={`rounded-full px-2 py-1 ${getStatusClass(verificator.status)}`}
                            >
                              {verificator.status === "approved"
                                ? "Disetujui"
                                : verificator.status.charAt(0).toUpperCase() +
                                  verificator.status.slice(1)}
                            </span>
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-700">
                        Pembimbing belum ditetapkan
                      </p>
                    )}
                  </div>
                  <div>
                    {submission.Verificator.filter(
                      (verificator) => verificator.type === "Penguji",
                    ).length > 0 ? (
                      submission.Verificator.filter(
                        (verificator) => verificator.type === "Penguji",
                      ).map((verificator, index) => (
                        <div
                          key={verificator.id}
                          className="mb-2 rounded border border-gray-300 p-2"
                        >
                          <p className="text-sm font-semibold text-gray-700">
                            Penguji {index + 1}: {verificator.lecturerName}
                          </p>
                          <p className="text-sm text-gray-700">
                            Seminar/Sidang{""}
                            <span
                              className={`rounded-full px-2 py-1 ${getStatusClass(verificator.status)}`}
                            >
                              {verificator.status === "approved"
                                ? "Disetujui"
                                : verificator.status.charAt(0).toUpperCase() +
                                  verificator.status.slice(1)}
                            </span>
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-700">
                        Penguji belum ditetapkan
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-700">
                Verifikator belum ditetapkan
              </p>
            )}
            <p className="mt-4 text-sm text-gray-700">
              <span className="font-semibold">
                Pengajuan terakhir diupdate:
              </span>{" "}
              {new Date(submission.updatedAt).toLocaleString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="mt-1 text-sm text-gray-700">
              <span className="font-semibold">Dibuat pada:</span>{" "}
              {new Date(submission.createdAt).toLocaleString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() =>
              (window.location.href = `${window.location.origin}${window.location.pathname}/${submission.id}`)
            }
            className="rounded-lg bg-blue-500 px-6 py-2 text-sm text-white shadow hover:bg-blue-600"
          >
            Detail
          </button>
        </div>
      </div>
      <hr className="border-t border-gray-300" />
      <hr className="my-4 mb-4 border-t-2 border-gray-400" />
    </div>
  );
};
