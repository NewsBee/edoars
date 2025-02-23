import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prismadb from "@/lib/prismadb";
import { authOptions } from "../auth/[...nextauth]/route";

// GET List of Lecturers
export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  // if (!session) {
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  // }

  try {
    const lecturers = await prismadb.user.findMany({
      where: {
        role: "Dosen",
        status: { in: ["1", "Aktif"] }, // Status aktif
      },
      include: {
        SkillGroupLecturers: {
          include: {
            SkillGroup: true,
          },
        },
      },
    });
    console.log(lecturers);

    const formattedLecturers = lecturers.map((lecturer) => ({
      id: lecturer.id,
      name: lecturer.name,
      email: lecturer.email,
      nip: lecturer.nip,
      skillGroups: lecturer.SkillGroupLecturers.map((sgl) => sgl.SkillGroup),
    }));

    return NextResponse.json({ lecturers: formattedLecturers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching lecturers:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};