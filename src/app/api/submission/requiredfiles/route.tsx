import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  const url = new URL(req.url);
  const typeSlug = url.searchParams.get("type"); // Mendapatkan nilai query 'type'

  if (!typeSlug) {
    return NextResponse.json(
      { message: "Query parameter 'type' tidak ditemukan" },
      { status: 400 },
    );
  }

  try {
    // Ambil data type berdasarkan slug
    const types = await prismadb.type.findUnique({
      where: { slug: typeSlug }, // Mencari tipe pengajuan berdasarkan slug
      include: {
        formats: {
          where: { is_primary: true }, // Ambil format yang is_primary: true
          include: {
            requiredFiles: {
              orderBy: {
                createdAt: "asc", // Mengurutkan berdasarkan tanggal dibuatnya
              },
            },
          },
        },
      },
    });

    if (!types) {
      return NextResponse.json(
        { message: "Tipe pengajuan tidak ditemukan" },
        { status: 404 },
      );
    }

    // Ambil daftar required_files dari format yang is_primary
    const requiredFiles = types.formats.flatMap(
      (format) => format.requiredFiles,
    );
    console.log(requiredFiles);
    const serializedFiles = requiredFiles.map((file) => ({
      ...file,
      id: file.id.toString(), // Mengubah BigInt ke string
      formatId: file.formatId.toString(), // Mengubah BigInt ke string
      createdAt: file.createdAt.toISOString(), // Mengubah Date menjadi ISO string
      updatedAt: file.updatedAt.toISOString(), // Mengubah Date menjadi ISO string
    }));
    return NextResponse.json(serializedFiles); // Mengembalikan daftar required files
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data." },
      { status: 500 },
    );
  }
};
