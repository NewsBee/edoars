import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export const GET = async () => {
  try {
    // Ambil semua dosen dengan kelompok keahlian dan jumlah bimbingan aktif
    const lecturers = await prismadb.user.findMany({
      where: {
        role: "Dosen",
        status: { in: ["1", "Aktif"] }, // Status aktif
      },
      include: {
        AssignedLecturers: {
          where: {
            submissionId: { not: null }, // Hanya bimbingan aktif
          },
        },
        SkillGroupLecturers: {
          include: { SkillGroup: true }, // Ambil data kelompok keahlian
        },
        Verificator:true
      },
    });

    console.log(lecturers)
    // Ambil semua skill group yang tersedia
    const skillGroups = await prismadb.skillGroup.findMany();

    // Format data dosen
    const formattedLecturers = lecturers.map((lecturer) => ({
      id: lecturer.id,
      name: lecturer.name,
      email: lecturer.email,
      skillGroup: lecturer.Verificator,
      activeBimbinganCount: lecturer.AssignedLecturers.length,
      skillGroups: lecturer.SkillGroupLecturers.map((sgl) => sgl.SkillGroup.name),
    }));

    console.log(formattedLecturers)
    // Format response
    return NextResponse.json(
      {
        lecturers: formattedLecturers,
        skillGroups: skillGroups.map((group) => ({
          id: group.id,
          name: group.name,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching lecturers or skill groups:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};
