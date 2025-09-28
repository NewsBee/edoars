import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prismadb from "@/lib/prismadb";
import StudentGuidancePanel from "./StudentGuidence";


export default async function StudentGuidancePage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "mahasiswa") {
    return <div className="p-6 text-sm text-red-600">Anda tidak berhak mengakses halaman ini.</div>;
  }

  // Ambil daftar Verificator (pembimbing/penguji) yang terhubung ke TitleSubmission/Submission milik mahasiswa ini
  const myId = Number(session.user.id);
  const vers = await prismadb.verificator.findMany({
    where: {
      OR: [
        { TitleSubmission: { userId: myId } },
        { Submission:      { userId: myId } },
      ],
    },
    select: {
      type: true, // Pembimbing/Penguji/PembimbingAkademik
      User: { select: { id: true, name: true } }, // dosen
    },
    orderBy: { createdAt: "asc" },
  });

  // Unikkan dosen (kalau dosen yang sama muncul di beberapa pengajuan)
  const seen = new Set<number>();
  const advisors = vers
    .filter(v => {
      if (!v.User) return false;
      if (seen.has(v.User.id)) return false;
      seen.add(v.User.id);
      return true;
    })
    .map(v => ({
      id: v.User!.id,
      name: v.User!.name,
      type: v.type as "Pembimbing" | "PembimbingAkademik" | "Penguji",
    }));

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Bimbingan Tugas Akhir</h1>
      <StudentGuidancePanel advisors={advisors} />
    </div>
  );
}
