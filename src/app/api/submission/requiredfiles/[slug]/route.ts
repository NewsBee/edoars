import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  console.log(1)

  try {
    // Ambil data type berdasarkan slug
    const types = await prismadb.type.findUnique({
      where: { slug: slug },  // Mencari tipe pengajuan berdasarkan slug
      include: {
        formats: {
          where: { is_primary: true },  // Ambil format yang is_primary: true
          include: {
            requiredFiles: true,  // Mengambil required_files terkait dengan format
          },
        },
      },
    });

    if (!types) {
      return NextResponse.json({ message: "Tipe pengajuan tidak ditemukan" }, { status: 404 });
    }

    // Ambil daftar required_files dari format yang is_primary
    const requiredFiles = types.formats.flatMap((format) => format.requiredFiles);

    return NextResponse.json(requiredFiles);  // Mengembalikan daftar required files
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Terjadi kesalahan saat mengambil data." }, { status: 500 });
  }
}
