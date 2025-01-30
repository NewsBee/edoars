"use client";

import { FaClock, FaChalkboardTeacher, FaClipboardList } from "react-icons/fa";
import React from "react";

const ProposalSubmissionPage = () => {
  return (
    <div className="min-h-screen w-full  flex items-center justify-center px-4">
      <div className="w-full rounded-lg bg-white p-6 shadow-lg">
        <h1 className="text-center text-2xl font-bold text-gray-800 mb-2">
          PERANCANGAN UI/UX APLIKASI MANAJEMEN SKRIPSI JURUSAN ARSITEKTUR
          UNIVERSITAS TANJUNGPURA
        </h1>
        <h2 className="text-center text-lg text-gray-600 mb-6">
          DENGAN METODE ACTIVITY CENTERED DESIGN
        </h2>

        {/* Status Pengajuan */}
        <div className="border-t border-gray-300 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaClipboardList className="text-yellow-500 text-lg" />
              <h3 className="text-sm font-medium text-gray-700">
                Status Pengajuan
              </h3>
            </div>
            <span className="rounded-md bg-yellow-100 px-4 py-1 text-yellow-600 text-sm font-medium">
              Pending
            </span>
          </div>
          <p className="text-sm mt-2 text-gray-500">Menunggu Keputusan</p>
        </div>

        {/* Jadwal Seminar */}
        <div className="border-t border-gray-300 py-4">
          <div className="flex items-center space-x-2">
            <FaClock className="text-blue-500 text-lg" />
            <h3 className="text-sm font-medium text-gray-700">
              Jadwal Seminar
            </h3>
          </div>
          <div className="mt-2 border rounded-lg bg-gray-50 px-4 py-3">
            <p className="text-sm font-medium text-gray-600">
              Hari, Tanggal-Bulan-Tahun-Jam
            </p>
            <p className="text-sm text-gray-500">Ruangan</p>
          </div>
        </div>

        {/* Pembimbing dan Penguji */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-gray-300 py-4 gap-y-4">
          {/* Pembimbing */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FaChalkboardTeacher className="text-green-500 text-lg" />
              <h3 className="text-sm font-medium text-gray-700">Pembimbing</h3>
            </div>
            <div className="space-y-2">
              {[1, 2].map((index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border rounded-lg bg-gray-50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Nama Dosen
                    </p>
                    <p className="text-xs text-gray-500">
                      Pembimbing {index}
                    </p>
                  </div>
                  <span className="rounded-md bg-gray-200 px-4 py-1 text-gray-600 text-sm font-medium">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Penguji */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FaChalkboardTeacher className="text-red-500 text-lg" />
              <h3 className="text-sm font-medium text-gray-700">Penguji</h3>
            </div>
            <div className="space-y-2">
              {[1, 2].map((index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border rounded-lg bg-gray-50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Nama Dosen
                    </p>
                    <p className="text-xs text-gray-500">
                      Penguji {index}
                    </p>
                  </div>
                  <span className="rounded-md bg-gray-200 px-4 py-1 text-gray-600 text-sm font-medium">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Button Detail */}
        <div className="mt-6 flex justify-end">
          <button className="rounded-lg bg-blue-500 px-6 py-2 text-sm text-white shadow hover:bg-blue-600">
            Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProposalSubmissionPage;
