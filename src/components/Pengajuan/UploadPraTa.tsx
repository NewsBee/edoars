"use client"

import React, { useState } from 'react';

interface FileItem {
  [key: number]: File;
}

const UploadPraSkripsi = () => {
  const [files, setFiles] = useState<FileItem>({});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (event.target.files && event.target.files[0]) {
      const newFiles = { ...files, [index]: event.target.files[0] };
      setFiles(newFiles);
    }
  };

  const fileItems = [
    {
      id: 1,
      title: 'LIRS (Lembar Isian Rencana Studi)',
      description: 'Upload LIRS semester anda disini',
      note: 'File hanya dapat berupa: Word dan Pdf',
    },
    {
      id: 2,
      title: 'Sertifikat TOEFL / Bukti Pembayaran',
      description: 'Upload Sertifikat / Bukti pembayaran TOEFL anda disini',
      note: 'File dapat berupa: Gambar, PDF, Word, Powerpoint, Slideshow, Presentation, Zip, dan File lainnya',
    },
    {
      id: 3,
      title: 'Pra TA Proposal',
      description: 'Upload Pra TA Proposal anda disini',
      note: 'File dapat berupa: PDF, Word, Zip, dan File lainnya',
    },
  ];

  return (
    <div className="p-6 bg-white dark:bg-gray-800 min-h-screen rounded-lg shadow-md">
      <div className="max-w-4xl mx-auto">
        {fileItems.map((item, index) => (
          <div key={item.id} className="border-b py-6">
            <div className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{`#${item.id} - ${item.title}`}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{item.description}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mb-3">{item.note}</div>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <label
                htmlFor={`file-upload-${item.id}`}
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 dark:hover:border-blue-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-10 h-10 mb-3 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16v-8m4 8v-4m4 4v-2m-6 6h2a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm6 0h2a2 2 0 002-2v-4a2 2 0 00-2-2h-2a2 2 0 00-2 2v4a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Drag & Drop your files</span> or{' '}
                    <span className="text-blue-600 dark:text-blue-400 hover:underline">Browse</span>
                  </p>
                </div>
                <input
                  id={`file-upload-${item.id}`}
                  type="file"
                  className="hidden"
                  onChange={(event) => handleFileChange(event, index)}
                />
              </label>
              <div>
                {files[index] ? (
                  <span className="text-sm text-green-500 dark:text-green-400">File Uploaded: {files[index].name}</span>
                ) : (
                  <span className="text-sm text-red-500 dark:text-red-400">Belum Ada Berkas</span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div className="flex justify-end mt-6">
          <button className="bg-[#0DCAF0] dark:bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-700 transition duration-300">
            Simpan Berkas
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPraSkripsi;
