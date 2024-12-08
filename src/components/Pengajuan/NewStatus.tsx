"use client"

import React, { useEffect, useState } from 'react';

type Pembimbing = {
  name: string;
  email: string;
};

type Penguji = {
  name: string;
  email: string;
};

type FileData = {
  file_name: string;
  status: string;
  file_url: string;
};

type SubmissionData = {
  id: number;
  title: string;
  status: string;
  pembimbing: Pembimbing[];
  penguji: Penguji[];
  jadwal_sidang: string | null;
  files: FileData[];
};

const StatusProposal = () => {
  const [submissionData, setSubmissionData] = useState<SubmissionData | null>(null);

  useEffect(() => {
    // Fetch data dari API
    const fetchData = async () => {
      try {
        const response = await fetch('/api/submission/proposal/1');
        const data = await response.json();
        if (data.message === 'Submission data retrieved successfully') {
          setSubmissionData(data.data);
        }
      } catch (error) {
        console.error('Error fetching submission data:', error);
      }
    };

    fetchData();
  }, []);

  if (!submissionData) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  const { title, status, pembimbing, penguji, jadwal_sidang, files } = submissionData;

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Title and Status */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <p className={`mt-2 text-lg ${status === 'Approved' ? 'text-green-500' : status === 'Pending' ? 'text-yellow-500' : 'text-red-500'}`}>
          Status: {status}
        </p>
      </div>

      {/* Pembimbing and Penguji */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Pembimbing</h3>
          {pembimbing.length > 0 ? (
            pembimbing.map((supervisor, index) => (
              <div key={index} className="mt-4">
                <p className="text-gray-700">{supervisor.name} - {supervisor.email}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 mt-4">Belum ada pembimbing yang ditugaskan.</p>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800">Penguji</h3>
          {penguji.length > 0 ? (
            penguji.map((examiner, index) => (
              <div key={index} className="mt-4">
                <p className="text-gray-700">{examiner.name} - {examiner.email}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 mt-4">Belum ada penguji yang ditugaskan.</p>
          )}
        </div>
      </div>

      {/* Jadwal Sidang */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800">Jadwal Sidang</h3>
        {jadwal_sidang ? (
          <p className="text-gray-700 mt-2">{new Date(jadwal_sidang).toLocaleString()}</p>
        ) : (
          <p className="text-gray-500 mt-2">Jadwal sidang belum ditentukan.</p>
        )}
      </div>

      {/* Files */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800">File Proposal</h3>
        {files.length > 0 ? (
          files.map((file, index) => (
            <div key={index} className="mt-4">
              <p className="text-gray-700">{file.file_name} - Status: <span className={file.status === 'Approved' ? 'text-green-500' : 'text-yellow-500'}>{file.status}</span></p>
              <a href={file.file_url} className="text-blue-500 mt-2 inline-block" target="_blank" rel="noopener noreferrer">
                Lihat File
              </a>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-4">Belum ada file yang diajukan.</p>
        )}
      </div>
    </div>
  );
};

export default StatusProposal;
