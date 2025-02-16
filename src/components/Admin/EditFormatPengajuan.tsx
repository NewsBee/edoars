"use client";

import { useRouter } from "next/navigation";
import { useState, ChangeEvent, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Pastikan Anda mengimpor CSS untuk toast
import FileRequired from "./RequiredFile";
import RequiredValue from "./RequiredValue";

interface FormData {
  id: string;
  name: string;
  isMainFormat: boolean | null;
  documentFile: File | null;
  shareAccess: boolean | null;
  isPassed: boolean;
  types: string[];
  ifPassGiveAccessTypes: string;
  requires: {
    supervisor: boolean;
    examiner: boolean;
    academicAdvisor: boolean;
    thesisSchedule: boolean;
    requires_skill_group: boolean;
    scheduleRequired: boolean;
    allLecturersComment: boolean;
  };
  maxSupervisor: number;
  fileColumns: string[][];
  ratingColumns: string[][];
}

interface EditFormatProps {
  idtipe: string;
  idformat: string;
}

interface RequiredFile {
  id: string;
  name: string;
  key: string;
  note: string;
}

interface RequiredValue {
  id: string;
  name: string;
  key: string;
  note: string;
}

export default function EditFormatPengajuan({
  idtipe,
  idformat,
}: EditFormatProps) {
  const router = useRouter();
  const [fileColumns, setFileColumns] = useState<any[]>([]);
  const [ratingColumns, setRatingColumns] = useState<any[]>([]);
  const [formData, setFormData] = useState<FormData>({
    id: "",
    name: "",
    isMainFormat: null,
    documentFile: null,
    shareAccess: null,
    isPassed: false,
    types: [],
    ifPassGiveAccessTypes: "",
    requires: {
      supervisor: false,
      examiner: false,
      academicAdvisor: false,
      thesisSchedule: false, // Nilai default untuk thesisSchedule
      requires_skill_group: false,
      scheduleRequired: false,
      allLecturersComment: false,
    },
    maxSupervisor: 1,
    fileColumns: [["", "", "", ""]],
    ratingColumns: [["", "", ""]],
  });

  const [availableTypes, setAvailableTypes] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    // Ambil fileColumns dari API
    fetch(`/api/requiredfile/${idformat}`)
      .then(res => res.json())
      .then(data => {
        setFileColumns(data); // Set data untuk fileColumns
      })
      .catch(err => console.error('Error fetching required files:', err));
  
    // Ambil ratingColumns dari API
    fetch(`/api/requiredvalue/${idformat}`)
      .then(res => res.json())
      .then(data => {
        setRatingColumns(data); // Set data untuk ratingColumns
      })
      .catch(err => console.error('Error fetching required values:', err));
  }, []);

  console.log(formData)

  useEffect(() => {

    const fetchTypes = async () => {
      try {
        const response = await fetch("/api/tipe-pengajuan-berkas");
        const result = await response.json();
        // console.log(result)
        if (response.ok) {
          setAvailableTypes(result.types);
        } else {
          console.error("Failed to fetch types:", result.message);
        }
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };

    const fetchFormatData = async () => {
      // Pastikan idformat tidak kosong atau undefined
      if (!idformat) {
        console.error("idformat is not defined or invalid");
        return;
      }

      try {
        const response = await fetch(`/api/format/${idformat}`);
        const result = await response.json();
        console.log("Format data response:", result); // Cek format data yang diterima
        console.log(response.ok);
        console.log(result);

        if (response.ok && result) {
          setFormData({
            id: result.id || "", // ID Format yang diterima
            name: result.name || "", // Nama format dari API
            isMainFormat: result.is_primary ?? false, // Menggunakan is_primary dari API
            documentFile: result.document_format_name || null, // Nama file format dokumen
            shareAccess: result.give_access_to_mahasiswa ?? false, // Hak akses mahasiswa
            isPassed: false, // Belum ada properti 'isPassed' di API, ini bisa ditambahkan jika perlu
            types: [], // Tipe pengajuan lainnya, misalnya diambil dari 'requiredFiles'
            ifPassGiveAccessTypes:
              result.if_pass_then_give_access_type_id ?? "", // ID tipe pengajuan
            requires: {
              supervisor: result.requires_pembimbing ?? false, // Memetakan dari requires_pembimbing
              examiner: result.requires_penguji ?? false, // Memetakan dari requires_penguji
              academicAdvisor: result.requires_skill_group ?? false, // Memetakan dari requires_skill_group
              thesisSchedule: result.requires_academic_advisor ?? false, // Memetakan dari requires_academic_advisor
              requires_skill_group: result.requires_skill_group ?? false, // Memetakan dari requires_academic_advisor
              scheduleRequired: result.is_schedule_required ?? false,
              allLecturersComment: result.allLecturersComment ?? false, // Ini opsional jika ada
            },
            maxSupervisor: 1, // Jika ada properti terkait maxSupervisor di API, sesuaikan
            fileColumns: result.requiredFiles.map((file: RequiredFile) => [
              file.id,
              file.name,
              file.key,
              file.note,
            ]) || [["", "", "", ""]],
            ratingColumns: result.requiredValues.map((value: RequiredValue) => [
              value.id,
              value.name,
              value.key,
              value.note,
            ]) || [["", "", "", ""]],
          });
        } else {
          console.error("Failed to fetch format data:", result.message);
        }
      } catch (error) {
        console.error("Error fetching format data:", error);
      }
    };

    fetchTypes();
    fetchFormatData();
  }, [idformat]); // Pastikan idformat berubah untuk memicu fetch ulang
  console.log(formData);
  console.log(availableTypes)


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      // checks if files is not null and has length
      setFormData((prevData) => ({
        ...prevData,
        documentFile: files[0],
      }));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "ifPassGiveAccessTypes") {
      setFormData((prevData) => ({
        ...prevData,
        ifPassGiveAccessTypes: value,
      }));
    } else if (e.target.type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        requires: {
          ...prevData.requires,
          [name]: e.target.checked,
        },
      }));
    } else if (e.target.type === "radio") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value === "true" ? true : value === "false" ? false : null,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
 



  const handleSubmit = async () => {
    let errors = {
      name: "",
      isMainFormat: "",
      shareAccess: "",
      requires: {
        supervisor: "",
        examiner: "",
        academicAdvisor: "",
        thesisSchedule: "",
        requires_skill_group: "",
        is_schedule_required: "",
        allLecturersComment: "",
      },
    };

    // Validasi Nama
    if (formData.name.trim() === "") {
      errors.name = "Nama harus diisi.";
      toast.error("Nama harus diisi.");
    }

    // Validasi Format Utama
    if (formData.isMainFormat === null) {
      errors.isMainFormat = "Pilih apakah ini format utama.";
      toast.error("Pilih apakah ini format utama.");
    }

    // Validasi Bagikan Hak Akses
    if (formData.shareAccess === null) {
      errors.shareAccess =
        "Pilih apakah Anda ingin membagikan hak akses pengajuan.";
      toast.error("Pilih apakah Anda ingin membagikan hak akses pengajuan.");
    }

    // Validasi Apakah (requires)
    if (
      !formData.requires.supervisor &&
      !formData.requires.examiner &&
      !formData.requires.academicAdvisor &&
      !formData.requires.thesisSchedule &&
      !formData.requires.scheduleRequired &&
      !formData.requires.allLecturersComment
    ) {
      errors.requires.supervisor = "Pilih setidaknya satu opsi untuk 'Apakah'.";
      toast.error("Pilih setidaknya satu opsi untuk 'Apakah'.");
    }

    const formDataToSend = new FormData();

    formDataToSend.append("typeId", BigInt(idtipe).toString());
    formDataToSend.append("document_format_name", formData.name);
    formDataToSend.append("name", formData.name);
    formDataToSend.append(
      "document_format_size",
      formData.documentFile ? `${formData.documentFile.size} bytes` : "",
    );
    formDataToSend.append(
      "is_primary",
      formData.isMainFormat ? "true" : "false",
    );
    formDataToSend.append(
      "is_schedule_required",
      formData.requires.scheduleRequired ? "true" : "false",
    );
    formDataToSend.append(
      "give_access_to_mahasiswa",
      formData.shareAccess ? "true" : "false",
    );
    formDataToSend.append(
      "if_pass_then_give_access_type_id",
      formData.ifPassGiveAccessTypes,
    );

    // Append the 'requires' object to the FormData
    formDataToSend.append(
      "requires_pembimbing",
      formData.requires.supervisor ? "true" : "false",
    );
    formDataToSend.append(
      "requires_penguji",
      formData.requires.examiner ? "true" : "false",
    );
    formDataToSend.append(
      "requires_skill_group",
      formData.requires.requires_skill_group ? "true" : "false",
    );
    formDataToSend.append(
      "requires_academic_advisor",
      formData.requires.thesisSchedule ? "true" : "false",
    );

    // Append the file if there is one
    if (formData.documentFile) {
      formDataToSend.append("document_format", formData.documentFile); // This will send the file as part of the request
    }

    // Handle fileColumns (you can do similar to requiredFiles)
    const requiredFiles = formData.fileColumns.map((row) => ({
      name: row[0],
      key: row[1],
      note: row[2],
      typeId: idtipe,
    }));

    if (requiredFiles.length > 0) {
      requiredFiles.forEach((file) => {
        formDataToSend.append("requiredFiles[]", JSON.stringify(file));
      });
    }

    // Handle ratingColumns (similar to requiredValues)
    const requiredValues = formData.ratingColumns.map((row) => ({
      name: row[0],
      key: row[1],
      note: row[2],
    }));

    if (requiredValues.length > 0) {
      requiredValues.forEach((value) => {
        formDataToSend.append("requiredValues[]", JSON.stringify(value));
      });
    }
    console.log("typeId:", formDataToSend.get("requiredValues"));
    formDataToSend.forEach((value, key) => {
      console.log(key, value); // Logs: "age 30"
    });
    // Pengolahan data yang akan dikirimkan ke API
    // const requiredFiles =
    // formData.fileColumns.length > 0
    //   ? formData.fileColumns
    //       .filter(
    //         (row) => // Memeriksa apakah kolom ID tidak kosong
    //           row[1].trim() !== "" && // Memeriksa apakah kolom 'name' tidak kosong
    //           row[2].trim() !== "" && // Memeriksa apakah kolom 'key' tidak kosong
    //           row[3].trim() !== "" // Memeriksa apakah kolom 'note' tidak kosong
    //       ) // Filter row yang kosong
    //       .map((row) => ({
    //         id: row[0] || null, // Jika ID kosong, beri nilai null
    //         name: row[1],
    //         key: row[2],
    //         note: row[3],
    //         typeId: idtipe,
    //       }))
    //   : [];
    //   formDataToSend.append("requiredFiles[]", JSON.stringify(requiredFiles));

    // const requiredValues =
    //   formData.ratingColumns.length > 0
    //     ? formData.ratingColumns
    //         .filter(
    //           (row) =>
    //             row[1].trim() !== "" &&
    //             row[2].trim() !== "" &&
    //             row[3].trim() !== "",
    //         ) // Filter row yang kosong
    //         .map((row) => ({
    //           id: row[0] || null,
    //           name: row[1],
    //           key: row[2],
    //           note: row[3],
    //         }))
    //     : [];
    //   formDataToSend.append("requiredValues[]", JSON.stringify(requiredValues));

    console.log(formData.fileColumns);
    console.log(requiredFiles);
    console.log(requiredValues);

    const data: any = {
      name: formData.name,
      typeId: BigInt(idtipe).toString(),
      document_format: formData.documentFile ? formData.documentFile.name : "",
      document_format_name: formData.name,
      document_format_size: formData.documentFile
        ? `${formData.documentFile.size} bytes`
        : "",
      is_primary: formData.isMainFormat,
      is_schedule_required: formData.requires.scheduleRequired,
      give_access_to_mahasiswa: formData.shareAccess,
      if_pass_then_give_access_type_id: formData.ifPassGiveAccessTypes,
      requires_pembimbing: formData.requires.supervisor,
      requires_penguji: formData.requires.examiner,
      requires_skill_group: formData.requires.requires_skill_group,
      requires_academic_advisor: formData.requires.thesisSchedule,
      next_submission_uses_current_verif: false,
    };

    // Only add requiredFiles and requiredValues if they are not empty
    if (requiredFiles.length > 0) {
      data.requiredFiles = requiredFiles;
    }

    if (requiredValues.length > 0) {
      data.requiredValues = requiredValues;
    }

    console.log(data);
    try {
      const response = await fetch(`/api/format/${idformat}`, {
        method: "PUT",
        // headers: { "Content-Type": "application/json" },
        body: formDataToSend,
        // body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Format updated successfully!"); // Menampilkan toast sukses
        console.log("Format updated successfully:", result);
        router.push(`/admin/tipe-pengajuan-berkas/${idtipe}/format`);
      } else {
        toast.error("Failed to update format: " + result.message); // Menampilkan toast error
        console.error("Failed to update format:", result);
      }
    } catch (error: any) {
      toast.error("Error updating format: " + error.message); // Menampilkan toast error jika terjadi error pada network
      console.error("Error updating format:", error);
    }
  };

  return (
    <div className="container mx-auto border-t-2 border-blue-900 p-6">
      <h1 className="mb-6 text-3xl font-bold">Edit Format Pengajuan</h1>

      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
        {/* Left Section */}
        <div className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-lg font-medium text-gray-700"
            >
              Nama *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData?.name || ""} // Pastikan ada fallback jika formData.name undefined
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-gray-300 p-3"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">
              Jadikan Format Utama *
            </label>
            <div className="mt-2 flex items-center">
              <input
                type="radio"
                name="isMainFormat"
                value="true"
                checked={formData.isMainFormat === true}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="mr-4">Ya</span>
              <input
                type="radio"
                name="isMainFormat"
                value="false"
                checked={formData.isMainFormat === false}
                onChange={handleChange}
                className="mr-2"
              />
              <span>Tidak</span>
            </div>
          </div>

          <div>
            <label
              htmlFor="documentFile"
              className="block text-lg font-medium text-gray-700"
            >
              Format Dokumen
            </label>
            <p className="mt-1 text-sm text-red-500">
              Format dokumen digunakan untuk keperluan{" "}
              <span className="font-semibold">output/penilaian</span> dan format
              file haruslah{" "}
              <span className="font-semibold text-red-500">doc, atau docx</span>{" "}
              yang sudah disesuaikan dengan{" "}
              <span className="font-semibold text-red-500">
                Key Meta Penilaian.
              </span>
            </p>

            <br />
            <div className="relative rounded-lg border bg-gray-50 p-4 shadow-sm hover:bg-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Format Dokumen
                </p>
                <p className="text-xs text-gray-500">
                  Upload format dokumen penilaian
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <input
                  type="file"
                  name="documentFile"
                  id="documentFile"
                  onChange={handleFileChange}
                  // accept=".pdf"
                  className="hidden"
                />
                <label
                  htmlFor="documentFile"
                  className="flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-blue-500 bg-blue-50 p-4 hover:bg-blue-100"
                >
                 
                  {formData.documentFile ? (
                    <span className="text-sm text-gray-700">
                      {formData.documentFile.name}
                    </span>
                  ) : (
                    <div>
                      <label
                        htmlFor="documentFile"
                        className="text-sm text-blue-500"
                      >
                        Upload Document
                      </label>
                    </div>
                  )}
                </label>
              </div>
            </div>
            {/* <input
              type="file"
              name="documentFile"
              id="documentFile"
              onChange={handleChange}
              className="hidden" // Hide the default input
            />
            <label
              htmlFor="documentFile"
              className="mt-2 w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-center text-gray-500"
            >
              Browse your file to input your format document
            </label> */}
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Bagikan Hak Akses Pengajuan ini ke semua mahasiswa *
            </label>
            <div className="mt-2 flex items-center">
              <input
                type="radio"
                name="shareAccess"
                value="true"
                checked={formData.shareAccess === true}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="mr-4">Ya</span>
              <input
                type="radio"
                name="shareAccess"
                value="false"
                checked={formData.shareAccess === false}
                onChange={handleChange}
                className="mr-2"
              />
              <span>Tidak</span>
            </div>
          </div>

          {/* Tipe Pengajuan Ketika Mahasiswa Lulus */}
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Jika lulus maka mahasiswa akan diberikan hak akses terhadap tipe
              pengajuan
            </label>
            <div className="mt-2 space-y-2">
              {availableTypes &&
                availableTypes.length > 0 &&
                availableTypes.map((type) => (
                  <div key={type.id} className="flex items-center">
                    <input
                      type="radio"
                      name="ifPassGiveAccessTypes"
                      value={type.id}
                      checked={formData.ifPassGiveAccessTypes.toString() === type.id.toString()}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span>{type.name}</span>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">
              Apakah
            </label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="supervisor"
                  checked={formData.requires?.supervisor || false} // Fallback default jika nilai tidak tersedia
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Memerlukan Pembimbing?</span>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="examiner"
                  checked={formData.requires?.examiner || false} // Tambahkan fallback jika formData.requires belum ada
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Memerlukan Penguji?</span>
              </div>
              {/* <div className="flex items-center">
                <input
                  type="checkbox"
                  name="academicAdvisor"
                  checked={formData.requires?.academicAdvisor || false} // Menambahkan fallback nilai false
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Memerlukan Kelompok Keahlian?</span>
              </div> */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="requires_skill_group"
                  checked={formData.requires?.requires_skill_group || false} // Menggunakan optional chaining untuk memeriksa keberadaan 'requires'
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Memerlukan Kelompok Keahlian?</span>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="scheduleRequired"
                  checked={formData.requires?.scheduleRequired || false} // Menggunakan optional chaining untuk memeriksa keberadaan 'requires'
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Memerlukan Jadwal Sidang?</span>
              </div>
              {/* <div className="flex items-center">
                <input
                  type="checkbox"
                  name="allLecturersComment"
                  checked={formData.requires?.allLecturersComment || false}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Semua dosen bisa berkomentar?</span>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="mt-6">
        {/* Table for File Yang Dibutuhkan */}
        {/* File Yang Dibutuhkan Section */}
        {/* <div className="space-y-4">
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
              {formData.fileColumns.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={row[1]}
                      onChange={(e) => handleFileColumnChange(e, rowIndex, 1)}
                      className="w-full rounded border border-gray-300 p-2"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={row[2]}
                      onChange={(e) => handleFileColumnChange(e, rowIndex, 2)}
                      className="w-full rounded border border-gray-300 p-2"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={row[3]}
                      onChange={(e) => handleFileColumnChange(e, rowIndex, 3)}
                      className="w-full rounded border border-gray-300 p-2"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleRemoveFileColumn(rowIndex)}
                      className="text-blue-600"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={addFileColumn}
            className="mt-4 w-full rounded bg-[#0abef9] px-4 py-2 text-black"
          >
            Tambah Kolom Baru
          </button>
        </div> */}
        <FileRequired idformat={idformat} />

        <RequiredValue idformat={idformat} />

        {/* Penilaian Yang Dibutuhkan Section */}
        {/* <div className="mt-6">
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
              {formData.ratingColumns.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={row[1]}
                      onChange={(e) => handleRatingColumnChange(e, rowIndex, 1)}
                      className="w-full rounded border border-gray-300 p-2"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={row[2]}
                      onChange={(e) => handleRatingColumnChange(e, rowIndex, 2)}
                      className="w-full rounded border border-gray-300 p-2"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      disabled
                      className="w-full rounded border border-gray-300 p-2"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={row[3]}
                      onChange={(e) => handleRatingColumnChange(e, rowIndex, 3)}
                      className="w-full rounded border border-gray-300 p-2"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleRemoveRatingColumn(rowIndex)}
                      className="text-blue-600"
                    >
                      Hapus
                    </button>
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
        </div> */}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          className="rounded bg-[#5750f1] px-6 py-2 text-white"
        >
          Submit Format
        </button>
      </div>
    </div>
  );
}
