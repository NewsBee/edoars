import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb"; // Prisma Client
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export const GET = async () => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    // Mengambil semua format dari tabel 'Format'
    const formats = await prismadb.format.findMany({
      include: {
        Type: true, // Mengambil informasi tipe pengajuan (opsional, jika dibutuhkan)
      },
    });

    // Jika data format tidak ditemukan
    if (!formats || formats.length === 0) {
      return NextResponse.json(
        { message: "Tidak ada data format yang ditemukan" },
        { status: 404 },
      );
    }

    // Mengembalikan data format
    return NextResponse.json({ formats }, { status: 200 });
  } catch (error) {
    console.error("Error fetching formats:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};
