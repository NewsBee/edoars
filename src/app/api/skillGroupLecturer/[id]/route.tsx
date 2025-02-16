// app/api/skillGroupLecturer/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';  // Pastikan prisma sudah dikonfigurasi

// Fungsi untuk mengupdate SkillGroupLecturer berdasarkan ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { position, userId } = await request.json();

    // Validasi data
    if (!position  || !userId) {
      return new NextResponse("Position, skillGroupId, and userId are required", { status: 400 });
    }

    // Cari SkillGroupLecturer berdasarkan ID
    const existingSkillGroupLecturer = await prismadb.skillGroupLecturer.findUnique({
      where: {
        id: parseInt(id),  // Pastikan ID yang diterima adalah integer
      },
    });

    // Jika SkillGroupLecturer tidak ditemukan, kembalikan response 404
    if (!existingSkillGroupLecturer) {
      return new NextResponse("SkillGroupLecturer not found", { status: 404 });
    }

    // Update SkillGroupLecturer di database
    const updatedSkillGroupLecturer = await prismadb.skillGroupLecturer.update({
      where: {
        id: parseInt(id),  // Update berdasarkan ID
      },
      data: {
        position,
        userId: parseInt(userId),
      },
    });

    return new NextResponse(JSON.stringify(updatedSkillGroupLecturer), { status: 200 });
  } catch (error) {
    console.error("Error updating skill group lecturer:", error);
    return new NextResponse("Failed to update skill group lecturer", { status: 500 });
  }
}

// Fungsi untuk menghapus SkillGroupLecturer berdasarkan ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Cari SkillGroupLecturer berdasarkan ID
    const existingSkillGroupLecturer = await prismadb.skillGroupLecturer.findUnique({
      where: {
        id: parseInt(id),  // Pastikan ID yang diterima adalah integer
      },
    });

    // Jika SkillGroupLecturer tidak ditemukan, kembalikan response 404
    if (!existingSkillGroupLecturer) {
      return new NextResponse("SkillGroupLecturer not found", { status: 404 });
    }

    // Hapus SkillGroupLecturer dari database
    await prismadb.skillGroupLecturer.delete({
      where: {
        id: parseInt(id),  // Menghapus berdasarkan ID
      },
    });

    return new NextResponse("SkillGroupLecturer deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting skill group lecturer:", error);
    return new NextResponse("Failed to delete skill group lecturer", { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    // console.log(params.id)
    try {
      const { id } = params;
  
      // Cari SkillGroupLecturer berdasarkan SkillGroup ID
      const skillGroupLecturers = await prismadb.skillGroupLecturer.findMany({
        where: {
          skillGroupId: parseInt(id),  // Menggunakan skillGroupId yang diberikan
        },
        include: {
          SkillGroup: {
            select: { id: true, name: true },  // Menambahkan informasi SkillGroup terkait
          },
          User: {
            select: { id: true, name: true, email: true },  // Menambahkan informasi User terkait
          },
        },
      });
  
      // Jika tidak ditemukan, kembalikan response 404
    //   console.log(skillGroupLecturers)
      if (skillGroupLecturers.length === 0) {
        return new NextResponse("No SkillGroupLecturers found for this SkillGroup", { status: 404 });
      }
  
      return new NextResponse(JSON.stringify(skillGroupLecturers), { status: 200 });
    } catch (error) {
      console.error("Error fetching skill group lecturers:", error);
      return new NextResponse("Failed to fetch skill group lecturers", { status: 500 });
    }
  }