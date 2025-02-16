import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export const GET = async () => {
  try {
    // Ambil semua dosen dengan kelompok keahlian dan jumlah bimbingan aktif
    const lecturers = await prismadb.user.findMany({
      where: {
        role: "Dosen",
        status: { in: ["1", "Aktif"] }, // Status aktif
      }
    });

    // Ambil semua skill group yang tersedia
    const skillGroups = await prismadb.skillGroup.findMany();

    // Format data dosen
    const formattedLecturers = lecturers.map((lecturer) => ({
      id: lecturer.id,
      name: lecturer.name,
      email: lecturer.email,

    }));

    console.log(formattedLecturers)

    // Format response
    return NextResponse.json(
      {
        lecturers: formattedLecturers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching lecturers or skill groups:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};
