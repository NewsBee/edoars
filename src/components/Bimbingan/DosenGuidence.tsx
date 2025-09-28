"use client";

import React, { useEffect, useState } from "react";
import { formatID } from "@/lib/date";
import { toast } from "react-toastify";
import StatusBadge from "../Chat/StatusBadge";

type StudentLite = { id: number; name: string };

type Guidance = {
  id: number;
  studentId: number;
  requestedAt: string;
  scheduledAt?: string | null;
  topic: string;
  description?: string | null;
  attachmentUrl?: string | null;
  status: "PENDING" | "APPROVED" | "REVISION" | "CANCELED";
};

export default function AdvisorGuidancePanel({
  students,
}: {
  students: StudentLite[];
}) {
  const [activeStudent, setActiveStudent] = useState<number>(students?.[0]?.id ?? 0);
  const [list, setList] = useState<Guidance[]>([]);
  const [note, setNote] = useState("");

  const fetchList = async () => {
    const q = activeStudent ? `?studentId=${activeStudent}` : "";
    const res = await fetch(`/api/guidance${q}`, { cache: "no-store" });
    const data = await res.json();
    if (res.ok) setList(data.data || []);
  };

  useEffect(() => { fetchList(); /* eslint-disable-next-line */ }, [activeStudent]);

  const review = async (id: number, status: "APPROVED" | "REVISION" | "CANCELED") => {
    const res = await fetch(`/api/guidance/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, lecturerNote: note || null }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "Gagal menyimpan");
    toast.success("Tersimpan");
    setNote("");
    fetchList();
  };

  const markReady = async () => {
    if (!activeStudent) return toast.error("Pilih mahasiswa");
    const res = await fetch(`/api/guidance/ready`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentUserId: activeStudent }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "Gagal setujui layak seminar");
    toast.success("Setuju: Layak Seminar");
  };

  return (
    <div className="space-y-6">
      {/* Pilih mahasiswa bimbingan */}
      <div className="flex flex-wrap gap-2">
        {students.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveStudent(s.id)}
            className={`rounded px-3 py-2 text-sm ${activeStudent === s.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Daftar bimbingan masuk */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-3 text-lg font-semibold">Daftar Bimbingan</h3>
        <div className="space-y-3">
          {list.map((g) => (
            <div key={g.id} className="rounded border p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Diajukan: {formatID(g.requestedAt)}</div>
                <StatusBadge status={g.status} />
              </div>
              {g.scheduledAt && <div className="text-sm text-gray-600">Jadwal: {formatID(g.scheduledAt)}</div>}
              <div className="mt-1 font-medium">{g.topic}</div>
              {g.description && <div className="text-sm">{g.description}</div>}
              {g.attachmentUrl && (
                <a className="text-sm text-blue-600 underline" href={g.attachmentUrl} target="_blank">
                  Lampiran
                </a>
              )}

              <div className="mt-3 grid gap-2">
                <textarea
                  className="w-full rounded border p-2"
                  placeholder="Catatan balikan (opsional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => review(g.id, "APPROVED")}
                    className="rounded bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700"
                  >
                    Setujui
                  </button>
                  <button
                    onClick={() => review(g.id, "REVISION")}
                    className="rounded bg-amber-500 px-3 py-2 text-white hover:bg-amber-600"
                  >
                    Kembalikan Revisi
                  </button>
                  <button
                    onClick={() => review(g.id, "CANCELED")}
                    className="rounded bg-slate-500 px-3 py-2 text-white hover:bg-slate-600"
                  >
                    Batalkan
                  </button>
                </div>
              </div>
            </div>
          ))}
          {list.length === 0 && <div className="text-sm text-gray-500">Tidak ada bimbingan.</div>}
        </div>
      </div>

      {/* Persetujuan Layak Seminar */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-3 text-lg font-semibold">Keputusan Pembimbing</h3>
        <button onClick={markReady} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Setujui Layak Seminar (pembimbing ini)
        </button>
      </div>
    </div>
  );
}
