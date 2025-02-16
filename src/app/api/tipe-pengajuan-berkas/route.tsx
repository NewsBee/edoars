import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export const POST = async (req: Request) => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { name, description, status, is_primary, is_public } = body;

    // Validasi input
    if (!name || !description) {
      return NextResponse.json(
        { message: "Nama dan Deskripsi wajib diisi." },
        { status: 400 },
      );
    }

    // Cek apakah nama tipe pengajuan sudah ada dalam database
    const existingType = await prismadb.type.findUnique({
      where: { name },
    });

    if (existingType) {
      return NextResponse.json(
        { message: "Nama tipe pengajuan sudah ada. Nama harus unik." },
        { status: 400 },
      );
    }
    // Generate slug dari nama (URL-friendly string)
    const slug = name.toLowerCase().replace(/\s+/g, "-");

    // Tambahkan warna default jika tidak diberikan
    const defaultColor = "#0000FF"; // Warna biru default

    // Membuat data baru
    const newType = await prismadb.type.create({
      data: {
        name,
        slug,
        color: defaultColor, // Anda bisa mengganti dengan logika lain jika warna perlu di-generate
        description,
        status: status === "Aktif" ? "active" : "inactive",
      },
    });

    const serializedType = {
      ...newType,
      id: newType.id.toString(), // Mengonversi BigInt menjadi string
    };

    return NextResponse.json(
      {
        message: "Tipe Pengajuan Berkas berhasil dibuat.",
        newType: serializedType,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error saat membuat Tipe Pengajuan Berkas:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal.", error: error.message },
      { status: 500 },
    );
  }
};

export const GET = async () => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Ambil semua tipe pengajuan dari database
    const types = await prismadb.type.findMany({
      orderBy: { createdAt: "asc" },
    });

    // Convert BigInt fields to string
    const serializedTypes = types.map((type) => {
      return {
        ...type,
        id: type.id.toString(), // Menyelesaikan masalah BigInt
        typeId: type.id ? type.id.toString() : undefined, // Contoh lainnya
      };
    });

    return NextResponse.json({ types: serializedTypes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching types:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data." },
      { status: 500 },
    );
  }
};
