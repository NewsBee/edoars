// app/api/skillGroup/route.ts
import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb"; // Pastikan prisma sudah dikonfigurasi
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// Fungsi untuk mendapatkan semua Skill Groups beserta Lecturer-nya
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "Admin") {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }
  try {
    // Ambil semua SkillGroup beserta Lecturer-nya
    const skillGroups = await prismadb.skillGroup.findMany({
      include: {
        Lecturers: {
          include: {
            User: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return new NextResponse(JSON.stringify(skillGroups), { status: 200 });
  } catch (error) {
    console.error("Error fetching skill groups:", error);
    return new NextResponse("Failed to fetch skill groups", { status: 500 });
  }
}

// app/api/skillGroup/route.ts (tambahkan POST untuk menambah SkillGroup)
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { name, status } = await request.json();

    // Validasi data
    if (!name || !status) {
      return new NextResponse("Name and status are required", { status: 400 });
    }

    // Insert data SkillGroup baru
    const newSkillGroup = await prismadb.skillGroup.create({
      data: {
        name,
        status,
      },
    });

    return new NextResponse(JSON.stringify(newSkillGroup), { status: 201 });
  } catch (error) {
    console.error("Error creating skill group:", error);
    return new NextResponse("Failed to create skill group", { status: 500 });
  }
}
