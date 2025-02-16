import { useRouter } from "next/navigation";
import { useState, ChangeEvent, useEffect } from "react";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Pastikan Anda mengimpor CSS untuk toast

interface FormData {
  name: string;
  isMainFormat: boolean | null; // Initially null to have no selection
  documentFile: File | null;
  shareAccess: boolean | null; // Initially null to have no selection
  isPassed: boolean;
  types: string[];
  ifPassGiveAccessTypes: string;
  requires: {
    supervisor: boolean;
    examiner: boolean;
    academicAdvisor: boolean;
    requires_skill_group: boolean;
    thesisSchedule: boolean;
    scheduleRequired: boolean;
    allLecturersComment: boolean;
  };
  maxSupervisor: number;
  fileColumns: string[][];
  ratingColumns: string[][];
}

interface FormatTypeProps {
  idtipe: string;
}

export default function TambahFormat({ idtipe }: FormatTypeProps) {
  const router = useRouter();
  const formDataToSends = new FormData();
  formDataToSends.append("age", "30");
  formDataToSends.forEach((value, key) => {
    console.log(key, value); // Logs: "age 30"
  });
  console.log(formDataToSends)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    isMainFormat: null,
    documentFile: null,
    shareAccess: null,
    isPassed: false,
    types: [],
    ifPassGiveAccessTypes: "", // Array for the selected types when student passes
    requires: {
      supervisor: false,
      examiner: false,
      academicAdvisor: false,
      requires_skill_group: false, 
      thesisSchedule: false,
      scheduleRequired: false,
      allLecturersComment: false,
    },
    maxSupervisor: 1,
    fileColumns: [["", ""]],
    ratingColumns: [["", "", ""]],
  });

  const [errorMessages, setErrorMessages] = useState({
    name: "",
    isMainFormat: "",
    shareAccess: "",
    requires: {
      supervisor: "",
      examiner: "",
      academicAdvisor: "",
      thesisSchedule: "",
      scheduleRequired: "",
      allLecturersComment: "",
    },
  });

  const [availableTypes, setAvailableTypes] = useState<
    { id: string; name: string }[]
  >([]);

  // Mengambil tipe pengajuan
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

  // Menangani perubahan input
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "ifPassGiveAccessTypes") {
      setFormData((prevData) => ({
        ...prevData,
        ifPassGiveAccessTypes: value, // Simpan satu tipe yang dipilih
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
        [name]: e.target.value,
      }));
    }
  };

  const handleRemoveFileColumn = (rowIndex: number) => {
    const updatedColumns = formData.fileColumns.filter(
      (_, index) => index !== rowIndex,
    );
    setFormData((prevData) => ({
      ...prevData,
      fileColumns: updatedColumns,
    }));
  };

  const handleRemoveRatingColumn = (rowIndex: number) => {
    const updatedColumns = formData.ratingColumns.filter(
      (_, index) => index !== rowIndex,
    );
    setFormData((prevData) => ({
      ...prevData,
      ratingColumns: updatedColumns,
    }));
  };

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

  const addFileColumn = () => {
    setFormData((prevData) => ({
      ...prevData,
      fileColumns: [...prevData.fileColumns, ["", ""]],
    }));
  };

  const addRatingColumn = () => {
    setFormData((prevData) => ({
      ...prevData,
      ratingColumns: [...prevData.ratingColumns, ["", "", ""]],
    }));
  };

  const handleFileColumnChange = (
    e: ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number,
  ) => {
    const updatedColumns = [...formData.fileColumns];
    updatedColumns[rowIndex][colIndex] = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      fileColumns: updatedColumns,
    }));
  };

  const handleRatingColumnChange = (
    e: ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number,
  ) => {
    const updatedColumns = [...formData.ratingColumns];
    updatedColumns[rowIndex][colIndex] = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      ratingColumns: updatedColumns,
    }));
  };
  // console.log(formData.ifPassGiveAccessTypes)

  // Tombol Submit
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
        scheduleRequired: "",
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

    // Logging formDataToSend contents after appending data

    // console.log("typeId:", formDataToSend.get("typeId"));
    // console.log("document_format_name:", formDataToSend.get("document_format_name"));
    // Similarly for other fields...
    

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
      note: row[3],
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

    // // Pengolahan data yang akan dikirimkan ke API
    // const requiredFiles =
    //   formData.fileColumns.length > 0
    //     ? formData.fileColumns
    //         .filter((row) => row[0].trim() !== "" && row[1].trim() !== "") // Filter row yang kosong
    //         .map((row) => ({
    //           name: row[0],
    //           key: row[1],
    //           note: row[2],
    //           typeId: idtipe,
    //         }))
    //     : [];

    // const requiredValues =
    //   formData.ratingColumns.length > 0
    //     ? formData.ratingColumns
    //         .filter(
    //           (row) =>
    //             row[0].trim() !== "" &&
    //             row[1].trim() !== "" &&
    //             row[3].trim() !== "",
    //         ) // Filter row yang kosong
    //         .map((row) => ({
    //           name: row[0],
    //           key: row[1],
    //           note: row[3],
    //         }))
    //     : [];

    // const data: any = {
    //   name: formData.name,
    //   typeId: BigInt(idtipe).toString(),
    //   document_format: formData.documentFile ? formData.documentFile as Blob : "",
    //   document_format_name: formData.name,
    //   document_format_size: formData.documentFile
    //     ? `${formData.documentFile.size} bytes`
    //     : "",
    //   is_primary: formData.isMainFormat,
    //   is_schedule_required: formData.requires.thesisSchedule,
    //   give_access_to_mahasiswa: formData.shareAccess,
    //   if_pass_then_give_access_type_id: formData.ifPassGiveAccessTypes,
    //   requires_pembimbing: formData.requires.supervisor,
    //   requires_penguji: formData.requires.examiner,
    //   requires_skill_group: formData.requires.academicAdvisor,
    //   requires_academic_advisor: formData.requires.thesisSchedule,
    //   next_submission_uses_current_verif: false,
    // };
    // console.log(formData.documentFile)
    // console.log(data)

    // // Only add requiredFiles and requiredValues if they are not empty
    // if (requiredFiles.length > 0) {
    //   data.requiredFiles = requiredFiles;
    // }

    // if (requiredValues.length > 0) {
    //   data.requiredValues = requiredValues;
    // }
    // console.log(requiredFiles);
    console.log(formData);
    console.log(formDataToSend);

    try {
      const response = await fetch(`/api/format/type/${idtipe}`, {
        method: "POST",
        // headers: { "Content-Type": "application/json" },
        body: formDataToSend,
        // body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result)
      if (response.ok) {
        toast.success("Format created successfully!"); // Menampilkan toast sukses
        console.log("Format created successfully:", result);
        router.push(`/admin/tipe-pengajuan-berkas/${idtipe}/format`);
      } else {
        toast.error("Failed to create format: " + result.message); // Menampilkan toast error
        console.error("Failed to create format:", result);
      }
    } catch (error: any) {
      toast.error("Error creating format: " + error.message); // Menampilkan toast error jika terjadi error pada network
      console.error("Error creating format:", error);
    }
  };

  return (
    <div className="container mx-auto border-t-2 border-blue-900 p-6">
      <h1 className="mb-6 text-3xl font-bold">Form Pengajuan</h1>

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
              value={formData.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-gray-300 p-3"
              required
            />
            {errorMessages.name && (
              <p className="text-sm text-red-500">{errorMessages.name}</p>
            )}{" "}
            {/* Pesan Error */}
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
            {errorMessages.isMainFormat && (
              <p className="text-sm text-red-500">
                {errorMessages.isMainFormat}
              </p>
            )}{" "}
            {/* Pesan Error */}
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
                  htmlFor="lirs-upload"
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
              onChange={handleFileChange}
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
            {errorMessages.shareAccess && (
              <p className="text-sm text-red-500">
                {errorMessages.shareAccess}
              </p>
            )}{" "}
            {/* Pesan Error */}
          </div>

          {/* Tipe Pengajuan Ketika Mahasiswa Lulus */}
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Jika lulus maka mahasiswa akan diberikan hak akses terhadap tipe
              pengajuan
            </label>
            <div className="mt-2 space-y-2">
              {availableTypes.map((type) => (
                <div key={type.id} className="flex items-center">
                  <input
                    type="radio"
                    name="ifPassGiveAccessTypes"
                    value={type.id}
                    checked={formData.ifPassGiveAccessTypes === type.id} // Cek jika id tipe yang dipilih sama
                    onChange={handleChange} // Tangani perubahan saat pilihan diubah
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
                  checked={formData.requires.supervisor}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Memerlukan Pembimbing?</span>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="examiner"
                  checked={formData.requires.examiner}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Memerlukan Penguji?</span>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="requires_skill_group"
                  checked={formData.requires.requires_skill_group}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Memerlukan Kelompok Keahlian?</span>
              </div>
              {/* <div className="flex items-center">
                <input
                  type="checkbox"
                  name="thesisSchedule"
                  checked={formData.requires.academicAdvisor}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Memerlukan Pembimbing Akademik?</span>
              </div> */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="scheduleRequired"
                  checked={formData.requires.scheduleRequired}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Memerlukan Jadwal Sidang?</span>
              </div>
              {/* <div className="flex items-center">
                <input
                  type="checkbox"
                  name="allLecturersComment"
                  checked={formData.requires.allLecturersComment}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Semua dosen bisa berkomentar?</span>
              </div> */}
            </div>
            {errorMessages.requires.supervisor && (
              <p className="text-sm text-red-500">
                {errorMessages.requires.supervisor}
              </p>
            )}{" "}
            {/* Pesan Error */}
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="mt-6">
        {/* Table for File Yang Dibutuhkan */}
        {/* File Yang Dibutuhkan Section */}
        <div className="space-y-4">
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
                      value={row[0]}
                      onChange={(e) => handleFileColumnChange(e, rowIndex, 0)}
                      className="w-full rounded border border-gray-300 p-2"
                    />
                  </td>
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
        </div>

        {/* Penilaian Yang Dibutuhkan Section */}
        <div className="mt-6">
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
                      value={row[0]}
                      onChange={(e) => handleRatingColumnChange(e, rowIndex, 0)}
                      className="w-full rounded border border-gray-300 p-2"
                    />
                  </td>
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
                      type="number"
                      value={row[2]}
                      disabled
                      onChange={(e) => handleRatingColumnChange(e, rowIndex, 2)}
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
        </div>
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
