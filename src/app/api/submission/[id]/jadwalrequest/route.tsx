import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const POST = async (req: Request, { params }: { params: { id: string } }) => {
  const { id } = params;
  const { requestJadwal, isReadyToBeProcessed, isAdmin } = await req.json();

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    // 1) Ambil submission dulu
    const submission = await prismadb.submission.findUnique({
      where: { id: BigInt(id) },
    });
    if (!submission) {
      return new Response(JSON.stringify({ error: "Submission tidak ditemukan" }), { status: 404 });
    }

    // Opsi: pastikan role admin dari session
    const role = (session.user as any)?.role || "Mahasiswa";
    const isSessionAdmin = isAdmin === true && role === "Admin";

    // 2) Validasi kepemilikan untuk non-admin
    if (!isSessionAdmin && submission.userId !== Number(session.user.id)) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    // 3) Siapkan updateData
    const updateData: any = {};

    if (isSessionAdmin) {
      // Admin: bisa set/override jadwal resmi kapan saja
      if (requestJadwal) {
        updateData.jadwal = new Date(requestJadwal);
      } else {
        // Admin boleh juga mengosongkan jadwal (jika dibutuhkan)
        // updateData.jadwal = null;
      }
    } else {
      // Mahasiswa: wajib setuju terlebih dahulu
      if (!isReadyToBeProcessed) {
        return new Response(JSON.stringify({ error: "Data ini harus diisi" }), { status: 400 });
      }
      updateData.isReadyToBeProcessed = true;
      updateData.status = "processed"; // Ubah status menjadi "processed" saat mahasiswa setuju
      updateData.decision = "MenungguKeputusan"; // Reset decision saat mahasiswa setuju


      if (requestJadwal) {
        updateData.requestJadwal = new Date(requestJadwal);
      }

    }

    const updated = await prismadb.submission.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    const serialized = {
      ...updated,
      id: updated.id.toString(),
      typeId: updated.typeId?.toString?.() ?? updated.typeId,
      userId: updated.userId?.toString?.() ?? updated.userId,
    };

    return new Response(JSON.stringify(serialized), { status: 200 });
  } catch (error) {
    console.error("Error updating submission:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};
