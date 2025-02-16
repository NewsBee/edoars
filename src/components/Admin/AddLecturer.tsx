import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// interface SkillGroup {
//   id: number;
//   name: string;
// }

interface User {
  id: number;
  name: string;
  email: string;
}

interface SkillGroup {
  id: number;
}

const AddLecturer = ({ id }: SkillGroup) => {
  const [position, setPosition] = useState<string>("");
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | string>("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Mengambil daftar skill groups dan users
    const fetchData = async () => {
      try {
        const usersResponse = await fetch("/api/dosen"); // Pastikan API ini ada untuk mengambil users

        // Cek apakah respons dari API berhasil
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          console.log(usersData); // Lihat hasil data dari API di console
          setUsers(usersData.lecturers); // Mengupdate state users dengan data dosen yang didapat
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  console.log(users);
  console.log(selectedPosition);
  console.log(selectedUserId);
  console.log(id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPosition || !selectedUserId) {
      setError("Position and User are required");
      return;
    }

    try {
      const response = await fetch("/api/skillGroupLecturer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          position: selectedPosition,
          skillGroupId: id,
          userId: selectedUserId,
        }),
      });

      if (response.ok) {
        toast.success("Dosen berhasil ditambahkan")
        router.push(`/admin/kelompok-keahlian/${id}/dosen`);
    } else {
        const errorMessage = await response.text();
        toast.error(errorMessage)
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Error adding lecturer:", error);
      setError("Terjadi kesalahan saat menambahkan dosen.");
    }
  };

  return (
    <div className="mx-auto w-full rounded-lg bg-white p-6 shadow-lg">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">
        Tambah Dosen
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Position Field */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-600"
            htmlFor="position"
          >
            Jabatan <span className="text-red-500">*</span>
          </label>
          <select
            name="position"
            id="position"
            value={selectedPosition}
            onChange={(e) => {
              setSelectedPosition(e.target.value);
            }}
            className="mt-2 w-full rounded-md border border-gray-300 p-2"
            required
          >
            <option value="">Pilih jabatan</option>
            <option value="Ketua">Ketua</option>
            <option value="Anggota">Anggota</option>
          </select>
          {/* <input
            id="position"
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="mt-2 w-full rounded-md border border-gray-300 p-2"
            placeholder="Jabatan"
            required
          /> */}
        </div>

        {/* User Selection */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-600"
            htmlFor="user"
          >
            Dosen <span className="text-red-500">*</span>
          </label>
          <select
            id="user"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="mt-2 w-full rounded-md border border-gray-300 p-2"
            required
          >
            <option value="">Pilih Dosen</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {/* Error Message */}
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600"
        >
          Tambah
        </button>
      </form>
    </div>
  );
};

export default AddLecturer;
