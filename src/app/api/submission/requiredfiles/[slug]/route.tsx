import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  const session = await getServerSession(authOptions);

  console.log(1);
  //   console.log(slug)

  try {
    // Ambil data type berdasarkan slug
    const types = await prismadb.type.findUnique({
      where: { slug: "seminar-proposal" }, // Mencari tipe pengajuan berdasarkan slug
      include: {
        formats: {
          where: { is_primary: true }, // Ambil format yang is_primary: true
          include: {
            requiredFiles: true, // Mengambil required_files terkait dengan format
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
