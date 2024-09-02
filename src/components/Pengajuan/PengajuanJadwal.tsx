"use client"

import React, { useState } from 'react';

const PengajuanJadwal: React.FC = () => {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <div className="p-6 dark:bg-gray-800 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Syarat & Ketentuan</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">Mahasiswa yang mengajukan pengajuan ini harus memenuhi syarat dan ketentuan berikut:</p>
                    <ul className="list-decimal list-inside mb-4 text-gray-700 dark:text-gray-300">
                        <li>Berkas syarat telah terupload semua.</li>
                        <li>syarat ke dua</li>
                        <li>syarat ke tiga</li>
                        <li>syarat ke empat</li>
                    </ul>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Harus diperhatikan bahwa:</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Setelah menyetujui ketentuan dan persyaratan diatas maka mahasiswa harus siap terhadap resiko dan harus bertanggung jawab terhadap tindakan yang melanggar.
                    </p>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Permintaan jadwal pelaksanaan seminar</label>
                        <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300" rows={3}></textarea>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Anda dapat melakukan permintaan jadwal pelaksanaan seminar anda dengan mengisi input diatas, jika anda tidak menginginkannya maka cukup biarkan kosong.</p>
                        <p className="text-xs text-red-500 mt-1">Rekomendasi jadwal yang dapat dipilih hanyalah satu minggu kedepan dari hari ini, namun hal tersebut tidak menutup kemungkinan bahwa jadwal pelaksanaan seminar anda dapat diputuskan oleh staff bagian administrasi lebih awal.</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Penetapan jadwal pelaksanaan seminar</label>
                        <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300" rows={3} disabled></textarea>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Berikut adalah penetapan jadwal pelaksanaan seminar anda berdasarkan keputusan pihak Bagian Administrasi.</p>
                    </div>
                    <div className="mb-4">
                        <label className="inline-flex items-center">
                            <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
                            <span className="ml-2 text-gray-700 dark:text-gray-300">Setuju terhadap syarat dan ketentuan yang berlaku diatas.</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PengajuanJadwal;
