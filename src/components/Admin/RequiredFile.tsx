"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

const FileRequired: React.FC<{ idformat: string }> = ({ idformat }) => {
  const [fileColumns, setFileColumns] = useState<any[]>([]);
  const [editStatus, setEditStatus] = useState<{ [key: number]: boolean }>({});
  const [showModal, setShowModal] = useState<boolean>(false); // Untuk modal konfirmasi
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // Index data yang akan dihapus

  // Ambil data fileColumns dari API saat komponen dimuat
  useEffect(() => {
    fetch(`/api/requiredfile/${idformat}`)
      .then((res) => res.json())
      .then((data) => {
        setFileColumns(data); // Set data untuk fileColumns
      })
      .catch((err) => console.error("Error fetching required files:", err));
  }, [idformat]);

  // Mengubah nilai kolom file
  const handleFileColumnChange = (
    e: ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: string,
  ) => {
    const updatedColumns = [...fileColumns];
    updatedColumns[rowIndex][colIndex] = e.target.value;
    setFileColumns(updatedColumns);
  };

  // Menambah kolom baru
  const addFileColumn = () => {
    const newColumn = {
      name: "",
      key: "",
      note: "",
      id: null, // Kolom baru belum ada di database
    };
    setFileColumns([...fileColumns, newColumn]);
  };

  console.log(fileColumns);
  // Menghapus kolom file (dari state atau database)
  const handleRemoveFileColumn = (rowIndex: number, isExisting: boolean) => {
    if (isExisting) {
      const fileId = fileColumns[rowIndex].id;

      // Pastikan fileId valid untuk penghapusan
      if (fileId) {
        fetch(`/api/requiredfile/${fileId}`, {
          method: "DELETE",
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("Failed to delete");
            }
            return res.json();
          })
          .then(() => {
            // Filter kolom yang dihapus dari state fileColumns
            const updatedColumns = fileColumns.filter(
              (_, index) => index !== rowIndex,
            );
            setFileColumns(updatedColumns);

            // Menampilkan toast hanya setelah penghapusan berhasil
            toast.success("Kolom berhasil dihapus");
          })
          .catch((err) => {
            console.error("Error deleting file column:", err);
            // Menampilkan toast error jika ada kesalahan
            toast.error("Gagal menghapus kolom");
          });
      } else {
        console.error("Invalid file ID");
        toast.error("ID file tidak valid");
      }
    } else {
      // Jika kolom tidak ada di database (hanya lokal)
      const updatedColumns = fileColumns.filter(
        (_, index) => index !== rowIndex,
      );
      setFileColumns(updatedColumns);

      // Menampilkan toast setelah penghapusan lokal
      toast.success("Kolom berhasil dihapus dari form");
    }

    setShowModal(false); // Menutup modal setelah penghapusan
  };

  // Menyimpan perubahan kolom file
  const saveFileColumnChanges = (rowIndex: number) => {
    const updatedColumn = fileColumns[rowIndex];
    updatedColumn.formatId = idformat;
    console.log(updatedColumn);
    if (updatedColumn.id) {
      fetch(`/api/requiredfile/${updatedColumn.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedColumn),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to update");
          }
          return res.json();
        })
        .then((data) => {
          setFileColumns((prevColumns) =>
            prevColumns.map((column, index) =>
              index === rowIndex ? data : column,
            ),
          );
          setEditStatus((prev) => ({
          ...prev,
          [rowIndex]: false, // Disable editing after saving
        }));
          toast.success("Kolom berhasil diperbarui");
        })
        .catch((err) => {
          console.error("Error updating file column:", err);
          // Optionally, you can show an error toast if the update fails
          toast.error("Gagal memperbarui kolom");
        });
    } else {
      // console.log(updatedColumn)
      fetch("/api/requiredfile", {
        method: "POST",
        body: JSON.stringify(updatedColumn),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          setFileColumns((prevColumns) =>
            prevColumns.map((column, index) =>
              index === rowIndex ? { ...column, id: data.id } : column,
            ),
          );
          toast.success("Kolom berhasil ditambahkan");
        })
        .catch((err) => console.error("Error saving new file column:", err));
    }
  };

  // Toggle edit mode
  const toggleEditMode = (rowIndex: number) => {
    setEditStatus((prev) => ({
      ...prev,
      [rowIndex]: !prev[rowIndex], // Toggle edit mode
    }));
  };

  // Menampilkan modal konfirmasi
  const handleShowModal = (rowIndex: number) => {
    setSelectedIndex(rowIndex);
    setShowModal(true);
  };

  // Menutup modal konfirmasi
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      {/* </> */}
      <div className="border-b border-gray-300 pb-2 text-center text-lg font-medium text-gray-700">
        File Yang Dibutuhkan
      </div>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-left">Nama</th>
            <th className="border px-4 py-2 text-left">Kunci</th>
            <th className="border px-4 py-2 text-left">Catatan</th>
            <th className="border px-4 py-2 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {fileColumns.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  value={row.name}
                  onChange={(e) => handleFileColumnChange(e, rowIndex, "name")}
                  className="w-full rounded border border-gray-300 p-2"
                  disabled={row.id ? !editStatus[rowIndex] : false} // Disable input jika tidak dalam mode edit
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  value={row.key}
                  onChange={(e) => handleFileColumnChange(e, rowIndex, "key")}
                  className="w-full rounded border border-gray-300 p-2"
                  disabled={row.id ? !editStatus[rowIndex] : false} // Disable input jika tidak dalam mode edit
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  value={row.note}
                  onChange={(e) => handleFileColumnChange(e, rowIndex, "note")}
                  className="w-full rounded border border-gray-300 p-2"
                  disabled={row.id ? !editStatus[rowIndex] : false} // Disable input jika tidak dalam mode edit
                />
              </td>
              <td className="border px-4 py-2">
                {row.id ? (
                  <>
                    {/* Tombol Edit dan Hapus untuk kolom yang sudah ada */}
                    {!editStatus[rowIndex] ? (
                      <button
                        onClick={() => toggleEditMode(rowIndex)} // Menyalakan mode edit
                        className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
                      >
                        Edit
                      </button>
                    ) : (
                      <button
                        onClick={() => saveFileColumnChanges(rowIndex)} // Menyimpan perubahan setelah edit
                        className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                      >
                        Simpan
                      </button>
                    )}
                    {/* Tombol Hapus untuk data yang sudah ada */}
                    <button
                      onClick={() => handleShowModal(rowIndex)} // Menampilkan modal konfirmasi hapus
                      className="ml-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:text-red-800"
                    >
                      Hapus
                    </button>
                  </>
                ) : (
                  <>
                    {/* Tombol Simpan dan Hapus Field untuk kolom baru */}
                    <button
                      onClick={() => saveFileColumnChanges(rowIndex)} // Tombol simpan untuk kolom baru
                      className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => handleRemoveFileColumn(rowIndex, false)} // Tombol hapus untuk kolom baru
                      className="ml-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:text-red-800"
                    >
                      Hapus Field
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={addFileColumn}
        className="mt-4 w-full rounded bg-[#0abef9] px-4 py-2 text-white hover:bg-[#0b8fe1] focus:outline-none focus:ring-2 focus:ring-[#0abef9] focus:ring-opacity-50"
      >
        Tambah Kolom Baru
      </button>

      {/* Modal Konfirmasi Hapus */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <p>Apakah Anda yakin ingin menghapus kolom ini?</p>
            <div className="mt-4">
              <button
                onClick={() => handleRemoveFileColumn(selectedIndex!, true)}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Ya, Hapus
              </button>
              <button
                onClick={handleCloseModal}
                className="ml-4 rounded-lg bg-gray-300 px-4 py-2 hover:bg-gray-400"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileRequired;
