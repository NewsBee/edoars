"use client";

import { FaClock, FaChalkboardTeacher, FaClipboardList } from "react-icons/fa";
import React from "react";

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

const ProposalSubmissionPage = ({ submission }: { submission: any }) => {
  console.log(submission);
  return (
    <div className="mt-8 flex w-full justify-center px-4">
      <div className="w-full rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">
          {submission.title}
        </h1>
        <h2 className="mb-6 text-center text-lg text-gray-600">
          {submission.skillGroup}
        </h2>

        {/* Status Pengajuan */}
        <div className="border-t border-gray-300 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaClipboardList className="text-lg text-yellow-500" />
              <h3 className="text-sm font-medium text-gray-700">
                Status Pengajuan
              </h3>
            </div>
            <span
              className={`rounded-md px-4 py-1 text-sm font-medium ${getStatusClass(submission.status)}`}
            >
              {submission.status.toUpperCase()}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">Menunggu Keputusan</p>
        </div>

        {/* Jadwal Seminar */}
        <div className="border-t border-gray-300 py-4">
          <div className="flex items-center space-x-2">
            <FaClock className="text-lg text-blue-500" />
            <h3 className="text-sm font-medium text-gray-700">
              Jadwal Seminar
            </h3>
          </div>
          <div className="mt-2 rounded-lg border bg-gray-50 px-4 py-3">
            <p className="text-sm font-medium text-gray-600">
              {submission.jadwal ? "Hari, Tanggal-Bulan-Tahun-Jam" : "Pending"}
            </p>
            <p className="text-sm text-gray-500">Lab Praktikum</p>
          </div>
        </div>

        {/* Pembimbing dan Penguji */}
        <div className="grid grid-cols-1 gap-y-4 border-t border-gray-300 py-4 md:grid-cols-2">
          {/* Pembimbing */}
          <div>
            <div className="mb-2 flex items-center space-x-2">
              <FaChalkboardTeacher className="text-lg text-green-500" />
              <h3 className="text-sm font-medium text-gray-700">Pembimbing</h3>
            </div>
            <div className="space-y-2">
              {submission.Verificator.filter(
                (item: any) => item.type === "Pembimbing",
              ).length > 0 ? (
                submission.Verificator.filter(
                  (item: any) => item.type === "Pembimbing",
                ).map((item: any, i: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border bg-gray-50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {item.lecturerName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.type} {i + 1}
                      </p>
                    </div>
                    {!submission.Type?.formats[0]?.is_newtitle_submission && (
                      <span
                        className={`rounded-md px-4 py-1 text-sm font-medium ${
                          item.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : item.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {item.status === "approved"
                          ? "Approved"
                          : item.status === "rejected"
                            ? "Rejected"
                            : "Pending"}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-between rounded-lg border bg-gray-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Belum ditentukan
                    </p>
                    <p className="text-xs text-gray-500">Pembimbing</p>
                  </div>
                  <span className="rounded-md bg-gray-200 px-4 py-1 text-sm font-medium text-gray-600">
                    Pending
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Penguji */}
          <div>
            <div className="mb-2 flex items-center space-x-2">
              <FaChalkboardTeacher className="text-lg text-red-500" />
              <h3 className="text-sm font-medium text-gray-700">Penguji</h3>
            </div>
            <div className="space-y-2">
              {submission.Verificator.filter(
                (item: any) => item.type === "Penguji",
              ).length > 0 ? (
                submission.Verificator.filter(
                  (item: any) => item.type === "Penguji",
                ).map((item: any, i: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border bg-gray-50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {item.lecturerName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.type} {i + 1}
                      </p>
                    </div>
                    {!submission.Type?.formats[0]?.is_newtitle_submission && (
                      <span
                        className={`rounded-md px-4 py-1 text-sm font-medium ${item.status === "approved" ? "bg-green-100 text-green-800" : item.status === "rejected" ? "bg-red-100 text-red-800" : "bg-gray-200 text-gray-600"}`}
                      >
                        {item.status === "approved"
                          ? "Approved"
                          : item.status === "rejected"
                            ? "Rejected"
                            : "Pending"}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-between rounded-lg border bg-gray-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Belum ditentukan
                    </p>
                    <p className="text-xs text-gray-500">Penguji</p>
                  </div>
                  {!submission.Type?.formats[0]?.is_newtitle_submission && (
                    <span className="rounded-md bg-gray-200 px-4 py-1 text-sm font-medium text-gray-600">
                      Pending
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Button Detail */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() =>
              (window.location.href = `${window.location.pathname}/${submission.id}/detail`)
            }
            className="rounded-lg bg-blue-500 px-6 py-2 text-sm text-white shadow hover:bg-blue-600"
          >
            Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProposalSubmissionPage;
