import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export const GET = async () => {
  try {
    // Ambil semua dosen dengan menghitung jumlah bimbingan aktif mereka
    const lecturers = await prismadb.user.findMany({
      where: {
        role: "Dosen",
        status: "1", // Status aktif
      },
      include: {
        AssignedLecturers: true, // Ambil semua bimbingan dosen
      },
    });

    // Format data untuk menghitung jumlah bimbingan aktif secara manual
    const formattedLecturers = lecturers.map((lecturer) => ({
      id: lecturer.id,
      name: lecturer.name,
      email: lecturer.email,
      activeBimbinganCount: lecturer.AssignedLecturers.filter(
        (assignment) => assignment.submissionId !== null // Hanya hitung bimbingan aktif
      ).length,
    }));

    return NextResponse.json({ lecturers: formattedLecturers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching lecturers:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};
