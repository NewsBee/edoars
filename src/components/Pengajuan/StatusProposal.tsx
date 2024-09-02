import { ProposalData, StatusProposalProps } from '@/types/status';
import Link from 'next/link';
import React from 'react';



const StatusProposal: React.FC<StatusProposalProps> = ({ data }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-7xl mx-auto mt-8">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                {data.title}
            </h1>
            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
                Masih ada berkas yang belum diterima oleh pihak Tata Usaha Arsitektur UNTAN, segera diperbaiki dan hubungi Tata Usaha Arsitektur UNTAN.
            </div>
            <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300">
                    <strong>{data.studentName} - {data.studentId}</strong>
                </p>
                <p className="text-gray-600 dark:text-gray-400">Status Pengajuan: <span className="text-yellow-500">{data.status}</span> | Keputusan Seminar/Sidang: <span className="text-yellow-500">{data.decision}</span></p>
                <p className="text-gray-600 dark:text-gray-400">Kelompok keahlian: {data.expertiseGroup}</p>
                <p className="text-gray-600 dark:text-gray-400">Tahun akademik: {data.academicYear} | semester: {data.semester}</p>
                <p className="text-gray-600 dark:text-gray-400">Pengajuan diupdate: {data.updatedDate} | dibuat: {data.submissionDate}</p>
                <p className="text-gray-600 dark:text-gray-400">Status Berkas:
                    <span className="inline-flex items-center justify-center h-6 w-6 bg-blue-500 text-white rounded-full mx-1">{data.documentStatus.submitted}</span>
                    <span className="inline-flex items-center justify-center h-6 w-6 bg-green-500 text-white rounded-full mx-1">{data.documentStatus.approved}</span>
                    <span className="inline-flex items-center justify-center h-6 w-6 bg-red-500 text-white rounded-full mx-1">{data.documentStatus.rejected}</span>
                </p>
                <p className="text-gray-600 dark:text-gray-400">Jadwal Seminar: <span className="text-red-500">{data.seminarSchedule}</span> | Ruangan: {data.room}</p>
                <p className="text-gray-500 dark:text-gray-500 mt-2">Belum dapat diproses, karena anda belum menyetujui syarat dan ketentuan.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {data.supervisors.map((supervisor, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md shadow">
                        <p className="text-gray-700 dark:text-gray-300">Pembimbing {index + 1} <strong>{supervisor.name}</strong></p>
                        <p className="text-gray-600 dark:text-gray-400">Seminar/Sidang: <span className="bg-yellow-100 text-yellow-600 py-1 px-2 rounded">{supervisor.status}</span> | Revisi: <span className="bg-gray-100 text-gray-600 py-1 px-2 rounded">{supervisor.revision}</span></p>
                        <p className="text-gray-600 dark:text-gray-400 mt-2"><span className="bg-purple-500 text-white py-1 px-2 rounded">Belum Dikonfirmasi</span></p>
                    </div>
                ))}
                {data.reviewers.map((reviewer, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md shadow">
                        <p className="text-gray-700 dark:text-gray-300">Penguji {index + 1} <strong>{reviewer.name}</strong></p>
                        <p className="text-gray-600 dark:text-gray-400">Seminar/Sidang: <span className="bg-yellow-100 text-yellow-600 py-1 px-2 rounded">{reviewer.status}</span> | Revisi: <span className="bg-gray-100 text-gray-600 py-1 px-2 rounded">{reviewer.revision}</span></p>
                        <p className="text-gray-600 dark:text-gray-400 mt-2"><span className="bg-purple-500 text-white py-1 px-2 rounded">Belum Dikonfirmasi</span></p>
                    </div>
                ))}
            </div>
            <div className='mt-5'>
                {/* <Link
                    href="/pengajuan/proposal/berkas"
                    className="flex items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base"
                >
                    <button className="p-4 bg-[#0DCAF0] cursor-pointer dark:bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-700 transition duration-300">
                        Detail
                    </button>

                    Account Settings
                </Link> */}
                <Link href="/pengajuan/proposal/berkas" legacyBehavior>

                    <a
                        href='/pengajuan/proposal/berkas'
                        className="p-4 bg-[#0DCAF0] cursor-pointer dark:bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-700 transition duration-300"
                    >
                        Detail
                    </a>
                </Link>
            </div>
        </div>
    );
};

// Data dummy
const dummyData: ProposalData = {
    title: 'Perancangan User Interface/User Experience dengan menggunakan Metode User Centered Design (UCD) pada Aplikasi Manajemen Skripsi dan Seminar pada Jurusan Arsitektur Universitas Tanjungpura',
    studentName: 'ROBY RONAL VIERI SIMANJUNTAK',
    studentId: 'D1041201044',
    status: 'Pending',
    decision: 'Menunggu Keputusan',
    expertiseGroup: 'SEJARAH, TEORI, DAN KRITIK ARSITEKTUR (KBK STKA)',
    academicYear: '2023/2024',
    semester: 'GAS-2023',
    submissionDate: '02/12/2023 10:12',
    updatedDate: '02/12/2023 10:12',
    documentStatus: {
        submitted: 4,
        approved: 1,
        rejected: 0,
    },
    seminarSchedule: 'Belum ditentukan',
    room: '-',
    supervisors: [
        {
            name: 'Helen Sastyapratwi, S.T., M.Eng',
            status: 'Pending',
            revision: 'Pending',
        },
        {
            name: 'Novi Safriadi, S.T., M.T.',
            status: 'Pending',
            revision: 'Pending',
        },
    ],
    reviewers: [
        {
            name: 'Valentinus Pebriano, ST, MT',
            status: 'Pending',
            revision: 'Pending',
        },
        {
            name: 'Muhammad Nurhamsyah, ST, MSc',
            status: 'Pending',
            revision: 'Pending',
        },
    ],
};

const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <StatusProposal data={dummyData} />
        </div>
    );
};

export default App;
