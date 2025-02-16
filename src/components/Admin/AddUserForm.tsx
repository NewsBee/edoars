"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddUserForm = ({ slug }: { slug: string }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Aktif");
  const [nim, setNim] = useState("");
  const [nip, setNip] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [availableTypes, setAvailableTypes] = useState<
    { id: string; name: string }[]
  >([]);
  const router = useRouter();

  // Mengambil tipe pengajuan dari API
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch("/api/tipe-pengajuan-berkas");
        const result = await response.json();
        if (response.ok) {
          setAvailableTypes(result.types); // Menyimpan tipe pengajuan
        } else {
          console.error("Failed to fetch types:", result.message);
        }
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };

    fetchTypes();
  }, []);

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSelectedTypes((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value),
    );
  };

  console.log(selectedTypes)
  // Fungsi untuk menangani pengiriman formulir
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi input
    if (!name || !email || !password || !status) {
      setError("Semua field harus diisi");
      return;
    }

    // Mengirim data ke API
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          status,
          nim,
          nip,
          phone_number: phoneNumber,
          role: slug,
          selectedTypes,
        }),
      });

      if (response.ok) {
        setName(""); // Reset form
        setEmail("");
        setPassword("");
        setStatus("Aktif");
        setError(""); // Clear error
        toast.success("Data berhasil ditambahkan");
        router.push(`/admin/daftar-pengguna/${slug.toLowerCase()}`);
      } else {
        toast.error("Gagal menambahkan data");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan, coba lagi nanti");
    }
  };

  // Sesuaikan inputan berdasarkan role (slug)
  const renderFormFields = () => {
    switch (slug) {
      case "Admin":
      case "admin":
      case "Administrasi":
      case "administrasi":
        return (
          <>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="name"
              >
                Nama <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-md border border-gray-300 p-2"
                placeholder="Nama"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="email"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-md border border-gray-300 p-2"
                placeholder="Email"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="password"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-md border border-gray-300 p-2"
                placeholder="Password"
                required
              />
            </div>
          </>
        );
      case "Dosen":
        return (
          <>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="name"
              >
                Nama <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-md border border-gray-300 p-2"
                placeholder="Nama"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="nip"
              >
                NIP/NIDN <span className="text-red-500">*</span>
              </label>
              <input
                id="nip"
                type="text"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                className="mt-2 w-full rounded-md border border-gray-300 p-2"
                placeholder="NIP/NIDN"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="email"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-md border border-gray-300 p-2"
                placeholder="Email"
                required
              />
            </div>
            {/* <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600" htmlFor="phoneNumber">
                Nomor Handphone <span className="text-red-500">*</span>
              </label>
              <input
                id="phoneNumber"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-2 w-full rounded-md border border-gray-300 p-2"
                placeholder="Nomor Handphone"
                required
              />
            </div> */}
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="password"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-md border border-gray-300 p-2"
                placeholder="Password"
                required
              />
            </div>
          </>
        );
      case "Mahasiswa":
        return (
          <>
            <div className="flex gap-8">
              {/* Kiri: Input Data */}
              <div className="flex-1">
                {/* Nama Field */}
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium text-gray-600"
                    htmlFor="name"
                  >
                    Nama <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full rounded-md border border-gray-300 p-2"
                    placeholder="Nama"
                    required
                  />
                </div>

                {/* Email Field */}
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium text-gray-600"
                    htmlFor="email"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-md border border-gray-300 p-2"
                    placeholder="Email"
                    required
                  />
                </div>

                {/* NIM Field */}
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium text-gray-600"
                    htmlFor="nim"
                  >
                    Nomor Induk Mahasiswa (NIM){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="nim"
                    type="text"
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                    className="mt-2 w-full rounded-md border border-gray-300 p-2"
                    placeholder="Nomor Induk Mahasiswa (NIM)"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium text-gray-600"
                    htmlFor="password"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 w-full rounded-md border border-gray-300 p-2"
                    placeholder="Password"
                    required
                  />
                </div>
              </div>

              {/* Kanan: Hak Akses */}
              <div className="flex-1">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-600">
                    Hak Akses
                  </label>
                  <div className="mt-2 flex flex-wrap gap-4">
                    {availableTypes.map((type) => (
                      <div key={type.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={type.id}
                          value={type.id}
                          checked={selectedTypes.includes(type.id)}
                          onChange={handleTypeChange}
                          className="mr-2"
                        />
                        <label
                          htmlFor={type.id}
                          className="text-sm text-gray-600"
                        >
                          {type.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto w-full rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">
        {slug === "admin" && "Admin"}
        {slug === "mahasiswa" && "Mahasiswa"}
        {slug === "dosen" && "Dosen"}
        {slug === "bagian_administrasi" && "Bagian Administrasi"}
      </h2>

      <form onSubmit={handleSubmit}>
        {renderFormFields()}

        {/* Status Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600">
            Status <span className="text-red-500">*</span>
          </label>
          <div className="mt-2 flex items-center space-x-6">
            <div>
              <input
                type="radio"
                id="aktif"
                name="status"
                value="Aktif"
                checked={status === "Aktif"}
                onChange={() => setStatus("Aktif")}
                className="mr-2"
              />
              <label htmlFor="aktif" className="text-sm text-gray-600">
                Aktif
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="tidak-aktif"
                name="status"
                value="Tidak Aktif"
                checked={status === "Tidak Aktif"}
                onChange={() => setStatus("Tidak Aktif")}
                className="mr-2"
              />
              <label htmlFor="tidak-aktif" className="text-sm text-gray-600">
                Tidak Aktif
              </label>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-md bg-[#5750f1] py-2 text-white hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddUserForm;
