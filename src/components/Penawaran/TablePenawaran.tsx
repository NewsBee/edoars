import React from 'react';

const data = [
  {
    no: 1,
    judul: "Metoda Crawling dan Visualisasi Data PPDB Jalur Zonasi Secara Spasial",
    deskripsi: "1. Aplikasi WebGIS\n2. Crawling data PPDB ke website\n3. Untuk Memprediksi Jumlah Calon Peserta Didik Baru",
    bidangIlmiah: "SEJARAH, TEORI, DAN KRITIK ARSITEKTUR (KBK STKA)",
    dariDosen: "Dr. Uray Fery Andi",
    status: "Belum Diambil",
    diambilOleh: "-",
  },
  {
    no: 2,
    judul: "Klasifikasi Citra BATIK DAYAK menggunakan Metode X dengan Menambahkan Pendekatan Y",
    deskripsi: "Klasifikasi dilakukan terhadap image batik dayak kalimantan dengan dataset yang tersedia untuk dapat diklasifikasikan ke beberapa kelas...",
    bidangIlmiah: "PERANCANGAN ARSITEKTUR (KBK PA)",
    dariDosen: "Yudi Purnomo, ST, MT",
    status: "Sudah Diambil",
    diambilOleh: "USERNAME",
  },
];

const TablePenawaran = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Penawaran Judul</h2>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="mb-4 md:mb-0">
            <span className="text-gray-700 dark:text-gray-300 mr-2">Status Judul:</span>
            <label className="inline-flex items-center">
              <input type="radio" className="form-radio" name="status" value="belum" />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Belum Diambil</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input type="radio" className="form-radio" name="status" value="sudah" />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Sudah Diambil</span>
            </label>
          </div>
          <div className="flex items-center">
            <label className="text-gray-700 dark:text-gray-300 mr-2">Tampilkan:</label>
            <select className="form-select block w-full mt-1">
              <option>Semua Kelompok Keahlian</option>
              <option>KBK 1</option>
              <option>KBK 2</option>
            </select>
            <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">Filter</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-700">
            <thead className="bg-gray-200 dark:bg-gray-900">
              <tr>
                <th className="w-1/12 px-4 py-2 border-b-2 border-gray-300 dark:border-gray-600 text-left leading-4 text-gray-600 dark:text-gray-300 tracking-wider">No</th>
                <th className="w-2/12 px-4 py-2 border-b-2 border-gray-300 dark:border-gray-600 text-left leading-4 text-gray-600 dark:text-gray-300 tracking-wider">Judul</th>
                <th className="w-3/12 px-4 py-2 border-b-2 border-gray-300 dark:border-gray-600 text-left leading-4 text-gray-600 dark:text-gray-300 tracking-wider">Deskripsi</th>
                <th className="w-2/12 px-4 py-2 border-b-2 border-gray-300 dark:border-gray-600 text-left leading-4 text-gray-600 dark:text-gray-300 tracking-wider">Bidang Ilmiah</th>
                <th className="w-2/12 px-4 py-2 border-b-2 border-gray-300 dark:border-gray-600 text-left leading-4 text-gray-600 dark:text-gray-300 tracking-wider">Dari Dosen</th>
                <th className="w-1/12 px-4 py-2 border-b-2 border-gray-300 dark:border-gray-600 text-left leading-4 text-gray-600 dark:text-gray-300 tracking-wider">Status</th>
                <th className="w-1/12 px-4 py-2 border-b-2 border-gray-300 dark:border-gray-600 text-left leading-4 text-gray-600 dark:text-gray-300 tracking-wider">Diambil Oleh</th>
                <th className="w-1/12 px-4 py-2 border-b-2 border-gray-300 dark:border-gray-600 text-left leading-4 text-gray-600 dark:text-gray-300 tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="odd:bg-gray-100 dark:odd:bg-gray-800 even:bg-white dark:even:bg-gray-700">
                  <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-600">{item.no}</td>
                  <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-600">{item.judul}</td>
                  <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-600 whitespace-pre-line">{item.deskripsi}</td>
                  <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-600">{item.bidangIlmiah}</td>
                  <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-600">{item.dariDosen}</td>
                  <td className={`px-4 py-2 border-b border-gray-300 dark:border-gray-600 ${item.status === 'Belum Diambil' ? 'text-red-600' : 'text-green-600'}`}>{item.status}</td>
                  <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-600">{item.diambilOleh}</td>
                  <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-600">
                    <button className={`px-4 py-1 rounded-full text-white ${item.status === 'Belum Diambil' ? 'bg-green-500 hover:bg-green-700' : 'bg-gray-400 hover:bg-gray-600'}`}>Booking</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TablePenawaran;
