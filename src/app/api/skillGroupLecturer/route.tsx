// app/api/skillGroupLecturer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';  // Pastikan prisma sudah dikonfigurasi

// Fungsi untuk mendapatkan semua SkillGroupLecturer
export async function GET(request: NextRequest) {
  try {
    // Ambil semua SkillGroupLecturer beserta User dan SkillGroup
    const skillGroupLecturers = await prismadb.skillGroupLecturer.findMany({
      include: {
        SkillGroup: {
          select: { id: true, name: true }
        },
        User: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return new NextResponse(JSON.stringify(skillGroupLecturers), { status: 200 });
  } catch (error) {
    console.error("Error fetching skill group lecturers:", error);
    return new NextResponse("Failed to fetch skill group lecturers", { status: 500 });
  }
}

// Fungsi untuk menambahkan SkillGroupLecturer baru
export async function POST(request: NextRequest) {
  try {
    const { position, skillGroupId, userId } = await request.json();

    // Validasi data
    if (!position || !skillGroupId || !userId) {
      return new NextResponse("Position, skillGroupId, and userId are required", { status: 400 });
    }
    console.log(position)
    console.log(skillGroupId)
    console.log(userId)

    // Tambahkan SkillGroupLecturer baru
    const newSkillGroupLecturer = await prismadb.skillGroupLecturer.create({
      data: {
        position,
        skillGroupId:parseInt(skillGroupId),
        userId:parseInt(userId),
      }
    });

    return new NextResponse(JSON.stringify(newSkillGroupLecturer), { status: 201 });
  } catch (error) {
    console.error("Error creating skill group lecturer:", error);
    return new NextResponse("Failed to create skill group lecturer", { status: 500 });
  }
}
