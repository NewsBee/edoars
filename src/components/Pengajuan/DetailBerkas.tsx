import React, { useState } from "react";
import Modal from "react-modal";
import { Document, Page } from "react-pdf";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

interface DetailBerkasProps {
  submissionData: any;
  requiredFiles: any[];
  openModal: (fileUrl: string) => void;
  closeModal: () => void;
  modalIsOpen: boolean;
  selectedFileUrl: string | null;
  isAdmin?: boolean;
}

const DetailBerkas: React.FC<DetailBerkasProps> = ({
  requiredFiles,
  submissionData,
  openModal,
  closeModal,
  modalIsOpen,
  selectedFileUrl,
  isAdmin = false,
}) => {
  const [files, setFiles] = useState(requiredFiles);
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const [uploadModalIsOpen, setUploadModalIsOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null,
  );
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const { data: session } = useSession();
  console.log(requiredFiles)
  console.log(submissionData.requiredFilesFormatted)

  const handleApprove = async (fileId: number) => {
    try {
      const response = await fetch(
        `/api/requiredfile/${fileId}/status?status=approved`,
        {
          method: "PUT",
        },
      );

      if (response.ok) {
        toast.success("File approved successfully");
        const updatedFiles = files.map((file) =>
          file.id === fileId ? { ...file, status: "approved" } : file,
        );
        setFiles(updatedFiles);
      } else {
        toast.error("Failed to approve file");
      }
    } catch (error) {
      console.error("Error approving file:", error);
      toast.error("Error approving file");
    }
  };

  const handleReject = async (fileId: number) => {
    try {
      const response = await fetch(
        `/api/requiredfile/${fileId}/status?status=rejected`,
        {
          method: "PUT",
        },
      );

      if (response.ok) {
        toast.success("File rejected successfully");
        const updatedFiles = files.map((file) =>
          file.id === fileId ? { ...file, status: "rejected" } : file,
        );
        setFiles(updatedFiles);
      } else {
        toast.error("Failed to reject file");
      }
    } catch (error) {
      console.error("Error rejecting file:", error);
      toast.error("Error rejecting file");
    }
  };

  const handleUpload = async (fileId: number) => {
    if (!newFile) return;

    const formData = new FormData();
    formData.append("file", newFile);

    try {
      const response = await fetch(`/api/requiredfile/${fileId}/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("File uploaded successfully");
        const updatedFiles = files.map((file) =>
          file.id === fileId ? { ...file, status: "pending" } : file,
        );
        setFiles(updatedFiles);
        closeUploadModal();
      } else {
        toast.error("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file");
    }
  };

  const handleEditFile = async (fileId: number) => {
    if (!newFile) return;

    const formData = new FormData();
    formData.append("file", newFile);

    try {
      const response = await fetch(`/api/requiredfile/${fileId}/edit`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        toast.success("File uploaded successfully");
        const updatedFiles = files.map((file) =>
          file.id === fileId ? { ...file, status: "pending" } : file,
        );
        setFiles(updatedFiles);
        window.location.reload();
        closeUploadModal();

      } else {
        toast.error("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file");
    }
  };

  const openConfirmModal = (fileId: number, action: "approve" | "reject") => {
    setSelectedFileId(fileId);
    setActionType(action);
    setConfirmModalIsOpen(true);
  };

  const closeConfirmModal = () => {
    setSelectedFileId(null);
    setActionType(null);
    setConfirmModalIsOpen(false);
  };

  const openUploadModal = (fileId: number) => {
    setSelectedFileId(fileId);
    setUploadModalIsOpen(true);
  };

  const closeUploadModal = () => {
    setSelectedFileId(null);
    setUploadModalIsOpen(false);
  };

  const handleConfirmAction = () => {
    if (selectedFileId !== null && actionType !== null) {
      if (actionType === "approve") {
        handleApprove(selectedFileId);
      } else if (actionType === "reject") {
        handleReject(selectedFileId);
      }
      closeConfirmModal();
    }
  };

  return (
    <div>
      {/* Notes Section */}
      <div className="mb-8 rounded-lg bg-blue-100 p-4 shadow-md">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
          Catatan:
        </h3>
        <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
          <li>
            Agar menu <strong>&quot;Proses Pengajuan&quot;</strong> terbuka,
            maka anda harus upload semua file pemberkasan terlebih dahulu.
          </li>
          <li>
            Pastikan semua file yang diupload sudah jelas dan benar adanya. Jika
            terdapat kesalahan pada berkas yang telah disetujui, maka anda dapat
            menghubungi pihak bagian administrasi atau admin untuk konfirmasi.
          </li>
          <li>
            Jika ingin <strong>&quot;Lihat Berkas&quot;</strong> atau{" "}
            <strong>&quot;Edit&quot;</strong> maka pastikan anda telah login ke
            akun gmail UNTAN.
          </li>
          <li>
            Browser yang disarankan adalah: <strong>Google Chrome</strong>
          </li>
        </ul>
      </div>
      {/* Files Section */}
      <div className="rounded-lg p-4 shadow-md">
        <div className="space-y-4">
          {files.map((file: any, i: any) => (
            <div key={file.id} className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    #{i + 1} - {file.RequiredFile.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Terakhir diperbarui{" "}
                    {new Date(file.updatedAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    -{" "}
                    <span
                      className={`rounded px-2 py-1 ${
                        file.status === "approved"
                          ? "bg-green-200 text-green-800"
                          : file.status === "rejected"
                            ? "bg-red-200 text-red-800"
                            : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {file.status.charAt(0).toUpperCase() +
                        file.status.slice(1)}
                    </span>
                  </span>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => openModal(file.file_url)}
                    className="rounded bg-indigo-500 px-3 py-1 text-sm text-white hover:bg-indigo-600"
                  >
                    Lihat Berkas
                  </button>
                  <a
                    href={file.file_url}
                    className="rounded bg-teal-500 px-3 py-1 text-sm text-white hover:bg-teal-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                </div>
              </div>
              {isAdmin && (
                <div className="mt-2 flex space-x-4">
                  {file.status === "approved" ? (
                    <span className="text-sm text-green-600">
                      Anda telah menyetujui berkas ini
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => openConfirmModal(file.id, "approve")}
                        className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => openConfirmModal(file.id, "reject")}
                        className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              )}
              {session &&
                session.user.role === "Mahasiswa" &&
                file.status === "rejected" && (
                  <div className="mt-2 flex space-x-4">
                    <button
                      onClick={() => openUploadModal(file.id)}
                      className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  </div>
                )}
              <div className="border-t border-gray-300 dark:border-gray-600"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Viewing File */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Lihat Berkas"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="relative w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg">
          <button
            onClick={closeModal}
            className="absolute right-2 top-2 text-gray-600 hover:text-gray-800"
          >
            &times;
          </button>
          {selectedFileUrl && selectedFileUrl.endsWith(".pdf") ? (
            <Document file={selectedFileUrl} className="h-96 w-full">
              <Page pageNumber={1} />
            </Document>
          ) : (
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                selectedFileUrl || "",
              )}`}
              className="h-96 w-full"
              frameBorder="0"
            ></iframe>
          )}
        </div>
      </Modal>

      {/* Modal for Confirming Action */}
      <Modal
        isOpen={confirmModalIsOpen}
        onRequestClose={closeConfirmModal}
        contentLabel="Konfirmasi Tindakan"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Konfirmasi Tindakan
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            Apakah Anda sudah yakin dan telah membaca berkas pengajuan ini?
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={closeConfirmModal}
              className="rounded bg-gray-500 px-4 py-2 text-sm text-white hover:bg-gray-600"
            >
              Batal
            </button>
            <button
              onClick={handleConfirmAction}
              className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
            >
              Ya, Saya Yakin
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal for Uploading New File */}
      <Modal
        isOpen={uploadModalIsOpen}
        onRequestClose={closeUploadModal}
        contentLabel="Upload File Baru"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Upload File Baru
          </h2>
          <input
            type="file"
            onChange={(e) =>
              setNewFile(e.target.files ? e.target.files[0] : null)
            }
            className="mb-4 w-full"
          />
          <div className="flex justify-end space-x-4">
            <button
              onClick={closeUploadModal}
              className="rounded bg-gray-500 px-4 py-2 text-sm text-white hover:bg-gray-600"
            >
              Batal
            </button>
            <button
              onClick={() => handleEditFile(selectedFileId!)}
              className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
            >
              Upload
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DetailBerkas;
