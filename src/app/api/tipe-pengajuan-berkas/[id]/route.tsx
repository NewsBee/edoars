import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const PUT = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = params;
    const body = await req.json();
    const { name, description, status } = body;

    // Validasi input
    if (!name || !description || !id) {
      return NextResponse.json(
        { message: "Nama, deskripsi, dan ID diperlukan." },
        { status: 400 },
      );
    }

    // Update data pada tabel Type
    const updatedType = await prismadb.type.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        status: status === "Aktif" ? "active" : "inactive",
      },
    });

    return NextResponse.json(
      { message: "Tipe pengajuan berhasil diperbarui.", updatedType },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error saat mengubah data:", error);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan saat mengubah data.",
        error: error.message,
      },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = params;

    // Validasi ID
    if (!id) {
      return NextResponse.json({ message: "ID tidak valid." }, { status: 400 });
    }

    // Hapus data dari tabel Type
    await prismadb.type.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: "Tipe pengajuan berhasil dihapus." },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error saat menghapus data:", error);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan saat menghapus data.",
        error: error.message,
      },
      { status: 500 },
    );
  }
};

export const GET = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = params;

    // Validasi ID
    if (!id) {
      return NextResponse.json({ message: "ID tidak valid." }, { status: 400 });
    }

    // Ambil data tipe pengajuan berdasarkan ID
    const type = await prismadb.type.findUnique({
      where: {
        id: parseInt(id), // Mengambil berdasarkan ID
      },
    });

    if (!type) {
      return NextResponse.json(
        { message: "Tipe pengajuan tidak ditemukan." },
        { status: 404 },
      );
    }

    return NextResponse.json({ type }, { status: 200 });
  } catch (error: any) {
    console.error("Error saat mengambil data tipe pengajuan:", error);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan saat mengambil data.",
        error: error.message,
      },
      { status: 500 },
    );
  }
};
