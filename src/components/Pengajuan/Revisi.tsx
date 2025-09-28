"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaCloudUploadAlt, FaCheck, FaDownload, FaFilePdf, FaInfoCircle, FaRedo, FaTimes } from "react-icons/fa";

/**
 * RevisiSection
 * --------------------------------------------------------
 * Fungsionalitas:
 * - Mahasiswa:
 *   • Upload / ganti file revisi skripsi (PDF) dengan UI yang rapi
 *   • Melihat status revisi terbaru (menunggu persetujuan / disetujui / ditolak)
 * - Dosen:
 *   • Jika belum ada file baru: tampilkan pesan "Mahasiswa belum melakukan revisi"
 *   • Jika ada file: bisa lihat/unduh dan tombol kecil untuk menyetujui revisi
 *
 * Asumsi endpoint API (silakan sesuaikan dengan backend Anda):
 *   GET    /api/submission/:id/revision
 *            -> { latestRevision: { id, fileUrl, filename, uploadedAt, approvedAt, approvedBy, status } }
 *   POST   /api/submission/:id/revision (multipart/form-data, field: file)
 *            -> { latestRevision: {...} }
 *   POST   /api/submission/:id/revision/approve  (body JSON: { revisionId })
 *            -> { ok: true }
 *
 * Props minimal yang diperlukan:
 *   - submissionId: string
 *   - role: "Mahasiswa" | "Dosen" | string
 *   - onChange?: () => void   -> opsional, dipanggil setelah upload/approve sukses untuk refresh parent
 */

export type Revision = {
  id: string;
  fileUrl: string;
  filename: string;
  uploadedAt: string; // ISO
  approvedAt?: string | null;
  approvedBy?: string | null;
  status?: "pending" | "approved" | "rejected";
};

export default function RevisiSection({
  submissionId,
  role,
  onChange,
}: {
  submissionId: string;
  role: string;
  onChange?: () => void;
}) {
  const [latestRevision, setLatestRevision] = useState<Revision | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isMahasiswa = role === "Mahasiswa";
  const isDosen = role === "Dosen";

  const canPreviewPdf = useMemo(() => {
    const url = latestRevision?.fileUrl || "";
    return url.toLowerCase().endsWith(".pdf");
  }, [latestRevision?.fileUrl]);

  const fetchLatest = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/submission/${submissionId}/revision`);
      if (!res.ok) throw new Error("Gagal memuat data revisi");
      const data = await res.json();
      setLatestRevision(data?.latestRevision ?? null);
    } catch (e: any) {
      setError(e?.message || "Terjadi kesalahan saat mengambil revisi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId]);

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("File harus berformat PDF");
      e.target.value = "";
      return;
    }
    // contoh limit 25MB
    if (f.size > 25 * 1024 * 1024) {
      setError("Ukuran file maksimal 25MB");
      e.target.value = "";
      return;
    }
    setError(null);
    setFile(f);
  };

  const doUpload = async () => {
    if (!file) return;
    try {
      setUploading(true);
      setProgress(10);
      const form = new FormData();
      form.append("file", file);

      // XHR agar bisa progress
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `/api/submission/${submissionId}/revision`);

      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) {
          const pct = Math.round((evt.loaded / evt.total) * 100);
          setProgress(pct);
        }
      };

      const res: Revision | null = await new Promise((resolve, reject) => {
        xhr.onload = () => {
          try {
            if (xhr.status >= 200 && xhr.status < 300) {
              const json = JSON.parse(xhr.responseText);
              resolve(json?.latestRevision ?? null);
            } else {
              reject(new Error("Gagal mengunggah file"));
            }
          } catch (err) {
            reject(err);
          }
        };
        xhr.onerror = () => reject(new Error("Gagal mengunggah file"));
        xhr.send(form);
      });

      if (res) {
        setLatestRevision(res);
        setFile(null);
        if (inputRef.current) inputRef.current.value = "";
        if (onChange) onChange();
      }
    } catch (e: any) {
      setError(e?.message || "Upload gagal");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const approve = async () => {
    if (!latestRevision) return;
    try {
      setUploading(true);
      const res = await fetch(`/api/submission/${submissionId}/revision/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revisionId: latestRevision.id }),
      });
      if (!res.ok) throw new Error("Gagal menyetujui revisi");
      await fetchLatest();
      if (onChange) onChange();
    } catch (e: any) {
      setError(e?.message || "Terjadi kesalahan saat menyetujui");
    } finally {
      setUploading(false);
    }
  };

  const statusBadge = (status?: string) => {
    const base = "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold";
    switch (status) {
      case "approved":
        return <span className={`${base} bg-green-100 text-green-700`}><FaCheck /> Disetujui</span>;
      case "rejected":
        return <span className={`${base} bg-rose-100 text-rose-700`}><FaTimes /> Ditolak</span>;
      default:
        return <span className={`${base} bg-amber-100 text-amber-700`}><FaInfoCircle /> Menunggu persetujuan</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-b-transparent border-gray-300" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error */}
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-700">
          {error}
        </div>
      )}

      {/* Info status terkini */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100"><FaFilePdf /></div>
            <div>
              <div className="text-sm text-gray-500">Status Revisi</div>
              <div className="mt-1">{statusBadge(latestRevision?.status)}</div>
            </div>
          </div>
          {latestRevision && (
            <div className="text-xs text-gray-500">
              Diupload: {new Date(latestRevision.uploadedAt).toLocaleString("id-ID")}
              {latestRevision.approvedAt && (
                <>
                  <span className="mx-2">•</span>
                  Disetujui: {new Date(latestRevision.approvedAt).toLocaleString("id-ID")}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bagian Mahasiswa */}
      {isMahasiswa && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 text-sm text-gray-600">
            Unggah file revisi skripsi Anda (PDF, maks 25MB). Mengunggah ulang akan menggantikan file sebelumnya.
          </div>

          {/* Current file */}
          {latestRevision ? (
            <div className="mb-4 rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-700">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="truncate">
                  <span className="font-medium">File saat ini:</span> {latestRevision.filename}
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={latestRevision.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    <FaDownload /> Lihat / Unduh
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4 text-sm text-amber-600">Belum ada file revisi yang diunggah.</div>
          )}

          <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 p-6 text-center dark:bg-gray-900">
            <FaCloudUploadAlt className="mb-3 text-3xl" />
            <div className="mb-2 text-sm font-medium">Tarik & lepas file ke sini atau pilih dari perangkat</div>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              onChange={onPickFile}
              className="mt-2 w-full max-w-sm cursor-pointer rounded-lg border border-gray-300 bg-white p-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700 dark:border-gray-700 dark:bg-gray-800"
            />
            {file && (
              <div className="mt-3 text-xs text-gray-600">
                File dipilih: <span className="font-medium">{file.name}</span>
              </div>
            )}

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={doUpload}
                disabled={!file || uploading}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaRedo className={uploading ? "animate-spin" : ""} />
                {uploading ? "Mengunggah..." : latestRevision ? "Ganti File" : "Unggah File"}
              </button>
              {file && !uploading && (
                <button
                  onClick={() => {
                    setFile(null);
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                  className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Batalkan
                </button>
              )}
            </div>

            {uploading && (
              <div className="mt-4 w-full max-w-sm">
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-blue-600 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-1 text-right text-xs text-gray-500">{progress}%</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bagian Dosen */}
      {isDosen && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {!latestRevision ? (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Mahasiswa belum melakukan revisi.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-700">
                <div className="truncate">
                  <span className="font-medium">File revisi:</span> {latestRevision.filename}
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={latestRevision.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    <FaDownload /> Lihat / Unduh
                  </a>
                </div>
              </div>

              {/* Preview ringan jika PDF */}
              {canPreviewPdf && (
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <iframe
                    src={`${latestRevision.fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                    className="h-[70vh] w-full"
                    title="Preview Revisi PDF"
                  />
                </div>
              )}

              <div className="flex items-center justify-end">
                <button
                  onClick={approve}
                  disabled={uploading || latestRevision.status === "approved"}
                  className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  title="Setujui revisi"
                >
                  <FaCheck /> Setujui Revisi
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Peran lain (Admin/Verifikator non-dosen) hanya info ringkas */}
      {!isMahasiswa && !isDosen && (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {latestRevision ? (
            <div className="flex items-center justify-between">
              <div className="truncate">Terakhir revisi: {latestRevision.filename}</div>
              <a
                href={latestRevision.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <FaDownload /> Lihat / Unduh
              </a>
            </div>
          ) : (
            <div className="text-gray-600 dark:text-gray-300">Belum ada revisi yang diunggah.</div>
          )}
        </div>
      )}
    </div>
  );
}
