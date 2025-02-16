import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
  id: number;
  name: string;
  email: string;
}

interface SkillGroup {
  id: string;
  idDosen: string;
}

const EditLecturer = ({ id , idDosen}: SkillGroup) => {
  const [position, setPosition] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | string>("");
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Fetch data for skill groups and users
    const fetchData = async () => {
      try {
        // Fetch users (dosen)
        const usersResponse = await fetch("/api/dosen");

        // console.log(await usersResponse.json())
        // console.log(usersResponse.ok)

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(usersData.lecturers);
        } else {
          console.error("Failed to fetch users");
        }

        // Fetch the specific lecturer data based on id
        const lecturerResponse = await fetch(`/api/skillGroupLecturer/${id}`);
        console.log(lecturerResponse.ok);
        if (lecturerResponse.ok) {
          const lecturerData = await lecturerResponse.json();
          console.log(lecturerData);
          console.log(lecturerData[0].position);
          setPosition(lecturerData[0].position);
          setSelectedPosition(lecturerData[0].position);
          setSelectedUserId(lecturerData[0].User.id);
        } else {
          console.error("Failed to fetch lecturer data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);
  console.log(selectedPosition)
  console.log(selectedUserId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPosition || !selectedUserId) {
      setError("Position and User are required");
      return;
    }

    try {
      const response = await fetch(`/api/skillGroupLecturer/${idDosen}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          position: selectedPosition,
          userId: selectedUserId,
        }),
      });

      if (response.ok) {
        toast.success("Dosen berhasil diperbarui");
        router.push(`/admin/kelompok-keahlian/${id}/dosen`);
      } else {
        const errorMessage = await response.text();
        toast.error(errorMessage);
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Error updating lecturer:", error);
      setError("Terjadi kesalahan saat memperbarui dosen.");
    }
  };

  return (
    <div className="mx-auto w-full rounded-lg bg-white p-6 shadow-lg">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">Edit Dosen</h2>

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
          Update
        </button>
      </form>
    </div>
  );
};

export default EditLecturer;
