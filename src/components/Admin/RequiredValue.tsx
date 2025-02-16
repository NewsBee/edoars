"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RequiredValue: React.FC<{ idformat: string }> = ({ idformat }) => {
  const [ratingColumns, setRatingColumns] = useState<any[]>([]);
  const [editStatus, setEditStatus] = useState<{ [key: number]: boolean }>({});
  const [showModal, setShowModal] = useState<boolean>(false); // Untuk modal konfirmasi
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // Index data yang akan dihapus

  // Ambil data ratingColumns dari API saat komponen dimuat
  useEffect(() => {
    fetch(`/api/requiredvalue/${idformat}`)
      .then((res) => res.json())
      .then((data) => {
        setRatingColumns(data); // Set data untuk ratingColumns
      })
      .catch((err) => console.error("Error fetching required values:", err));
  }, [idformat]);

  // Mengubah nilai kolom rating
//   const handleRatingColumnChange = (
//     e: ChangeEvent<HTMLInputElement>,
//     rowIndex: number,
//     colIndex: number
//   ) => {
//     const updatedColumns = [...ratingColumns];
//     updatedColumns[rowIndex][colIndex] = e.target.value;
//     setRatingColumns(updatedColumns);
//   };
const handleRatingColumnChange = (e: ChangeEvent<HTMLInputElement>, rowIndex: number, colIndex: string | number) => {
    const updatedColumns = [...ratingColumns];
  
    // Memastikan tipe data yang benar untuk setiap kolom
    if (colIndex === "key" || colIndex === "note" || colIndex === "name") {
      updatedColumns[rowIndex][colIndex] = e.target.value; // Untuk teks, simpan sebagai string
    } else if (colIndex === "weight") {
      updatedColumns[rowIndex][colIndex] = parseInt(e.target.value, 10); // Untuk bobot, parse menjadi number
    }
  
    setRatingColumns(updatedColumns);
  };
  

  // Menambah kolom baru
  const addRatingColumn = () => {
    const newColumn = {
      name: "",
      key: "",
    //   weight: "", // Kolom bobot (0-100)
      note: "",
      id: null, // Kolom baru belum ada di database
    };
    setRatingColumns([...ratingColumns, newColumn]);
  };

  // Menghapus kolom rating (dari state atau database)
  const handleRemoveRatingColumn = (rowIndex: number, isExisting: boolean) => {
    if (isExisting) {
      const fileId = ratingColumns[rowIndex].id;

      if (fileId) {
        fetch(`/api/requiredvalue/${fileId}`, {
          method: "DELETE",
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("Failed to delete");
            }
            return res.json();
          })
          .then(() => {
            const updatedColumns = ratingColumns.filter(
              (_, index) => index !== rowIndex
            );
            setRatingColumns(updatedColumns);
            toast.success("Kolom berhasil dihapus");
          })
          .catch((err) => {
            console.error("Error deleting rating column:", err);
            toast.error("Gagal menghapus kolom");
          });
      } else {
        console.error("Invalid file ID");
        toast.error("ID file tidak valid");
      }
    } else {
      const updatedColumns = ratingColumns.filter(
        (_, index) => index !== rowIndex
      );
      setRatingColumns(updatedColumns);
      toast.success("Kolom berhasil dihapus dari form");
    }

    setShowModal(false); // Menutup modal setelah penghapusan
  };

  // Menyimpan perubahan kolom rating
  const saveRatingColumnChanges = (rowIndex: number) => {
    const updatedColumn = ratingColumns[rowIndex];
    updatedColumn.formatId = idformat;
    console.log(updatedColumn)

    if (updatedColumn.id) {
      fetch(`/api/requiredvalue/${updatedColumn.id}`, {
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
          setRatingColumns((prevColumns) =>
            prevColumns.map((column, index) =>
              index === rowIndex ? data : column
            )
          );
          setEditStatus((prev) => ({
            ...prev,
            [rowIndex]: false, // Disable editing after saving
          }));
          toast.success("Kolom berhasil diperbarui");
        })
        .catch((err) => {
          console.error("Error updating rating column:", err);
          toast.error("Gagal memperbarui kolom");
        });
    } else {
      fetch("/api/requiredvalue", {
        method: "POST",
        body: JSON.stringify(updatedColumn),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          setRatingColumns((prevColumns) =>
            prevColumns.map((column, index) =>
              index === rowIndex ? { ...column, id: data.id } : column
            )
          );
          toast.success("Kolom berhasil ditambahkan");
        })
        .catch((err) => console.error("Error saving new rating column:", err));
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
    <div className="space-y-4 mt-6">
      <div className="border-b border-gray-300 pb-2 text-center text-lg font-medium text-gray-700">
        Penilaian Yang Dibutuhkan
      </div>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-left">Nama</th>
            <th className="border px-4 py-2 text-left">Kunci</th>
            <th className="border px-4 py-2 text-left">Bobot (0-100)</th>
            <th className="border px-4 py-2 text-left">Catatan</th>
            <th className="border px-4 py-2 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {ratingColumns.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  value={row.name}
                  onChange={(e) => handleRatingColumnChange(e, rowIndex, "name")}
                  className="w-full rounded border border-gray-300 p-2"
                  disabled={row.id ? !editStatus[rowIndex] : false} // Disable input jika tidak dalam mode edit
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  value={row.key}
                  onChange={(e) => handleRatingColumnChange(e, rowIndex, "key")}
                  className="w-full rounded border border-gray-300 p-2"
                  disabled={row.id ? !editStatus[rowIndex] : false} // Disable input jika tidak dalam mode edit
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  value={row.weight}
                //   onChange={(e) => handleRatingColumnChange(e, rowIndex, "weight")}
                  className="w-full rounded border border-gray-300 p-2"
                  disabled
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  value={row.note}
                  onChange={(e) => handleRatingColumnChange(e, rowIndex, "note")}
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
                        onClick={() => saveRatingColumnChanges(rowIndex)} // Menyimpan perubahan setelah edit
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
                      onClick={() => saveRatingColumnChanges(rowIndex)} // Tombol simpan untuk kolom baru
                      className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => handleRemoveRatingColumn(rowIndex, false)} // Tombol hapus untuk kolom baru
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
        onClick={addRatingColumn}
        className="mt-4 w-full rounded bg-[#47fe89] px-4 py-2 text-black"
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
                onClick={() => handleRemoveRatingColumn(selectedIndex!, true)}
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

export default RequiredValue;
