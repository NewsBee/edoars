"use client";

import React, { useEffect, useState } from "react";
import { toLocalInput, formatID } from "@/lib/date";
import { toast } from "react-toastify";
import StatusBadge from "../Chat/StatusBadge";


type AdvisorLite = { id: number; name: string; type: "Pembimbing" | "PembimbingAkademik" | "Penguji" };

type Guidance = {
  id: number;
  requestedAt: string;
  scheduledAt?: string | null;
  topic: string;
  description?: string | null;
  attachmentUrl?: string | null;
  status: "PENDING" | "APPROVED" | "REVISION" | "CANCELED";
  lecturerNote?: string | null;
};

export default function StudentGuidancePanel({ advisors }: { advisors: AdvisorLite[] }) {
  const [activeLecturer, setActiveLecturer] = useState<number>(advisors?.[0]?.id ?? 0);
  const [list, setList] = useState<Guidance[]>([]);
  const [topic, setTopic] = useState("");
  const [desc, setDesc] = useState("");
  const [when, setWhen] = useState<string>(toLocalInput(new Date()));
  const [attach, setAttach] = useState("");
  const [scheduledAt, setScheduledAt] = useState<string>("");

  const fetchList = async () => {
    if (!activeLecturer) return;
    const res = await fetch(`/api/guidance?lecturerId=${activeLecturer}`, { cache: "no-store" });
    const data = await res.json();
    if (res.ok) setList(data.data || []);
  };

  useEffect(() => { fetchList(); /* eslint-disable-next-line */ }, [activeLecturer]);

  const submit = async () => {
    if (!activeLecturer) return toast.error("Pilih pembimbing/penguji lebih dahulu");
    if (!topic) return toast.error("Topik wajib diisi");
    if (!when) return toast.error("Waktu pengajuan wajib diisi");

    const res = await fetch("/api/guidance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lecturerUserId: activeLecturer,
        topic,
        description: desc || null,
        requestedAt: when,
        attachmentUrl: attach || null,
        scheduledAt: scheduledAt || null,
      }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "Gagal mengajukan bimbingan");

    toast.success("Bimbingan diajukan");
    setTopic(""); setDesc(""); setAttach(""); setScheduledAt("");
    fetchList();
  };

  return (
    <div className="space-y-6">
      {/* Tabs pembimbing/penguji */}
      <div className="flex flex-wrap gap-2">
        {advisors.map(a => (
          <button
            key={a.id}
            onClick={() => setActiveLecturer(a.id)}
            className={`rounded px-3 py-2 text-sm ${activeLecturer === a.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
            title={a.type}
          >
            {a.type}: {a.name}
          </button>
        ))}
      </div>

      {/* Form ajukan bimbingan */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-3 text-lg font-semibold">Ajukan Bimbingan</h3>
        <div className="grid gap-3">
          <input
            className="w-full rounded border p-2"
            placeholder="Topik bimbingan"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <textarea
            className="w-full rounded border p-2"
            placeholder="Deskripsi (opsional)"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <div>
            <label className="mb-1 block text-sm">Waktu pengajuan</label>
            <input
              type="datetime-local"
              className="w-full rounded border p-2"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-500">Preview: {when ? formatID(when) : "—"}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm">Jadwal pertemuan (opsional)</label>
            <input
              type="datetime-local"
              className="w-full rounded border p-2"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-500">Preview: {scheduledAt ? formatID(scheduledAt) : "—"}</p>
          </div>
          <input
            className="w-full rounded border p-2"
            placeholder="Link lampiran (opsional)"
            value={attach}
            onChange={(e) => setAttach(e.target.value)}
          />
          <div className="flex justify-end">
            <button onClick={submit} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Kirim
            </button>
          </div>
        </div>
      </div>

      {/* Riwayat bimbingan */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-3 text-lg font-semibold">Riwayat Bimbingan</h3>
        <div className="space-y-3">
          {list.map((g) => (
            <div key={g.id} className="rounded border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm text-gray-600">Diajukan: {formatID(g.requestedAt)}</div>
                <StatusBadge status={g.status} />
              </div>
              {g.scheduledAt && (
                <div className="text-sm text-gray-600">Jadwal: {formatID(g.scheduledAt)}</div>
              )}
              <div className="mt-1 font-medium">{g.topic}</div>
              {g.description && <div className="text-sm">{g.description}</div>}
              {g.attachmentUrl && (
                <a className="text-sm text-blue-600 underline" href={g.attachmentUrl} target="_blank">
                  Lampiran
                </a>
              )}
              {g.lecturerNote && (
                <div className="mt-2 text-xs">
                  Catatan dosen: <i>{g.lecturerNote}</i>
                </div>
              )}
            </div>
          ))}
          {list.length === 0 && <div className="text-sm text-gray-500">Belum ada bimbingan.</div>}
        </div>
      </div>
    </div>
  );
}
