// app/api/skillGroup/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb"; // Pastikan prisma sudah dikonfigurasi
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// Fungsi untuk menghapus SkillGroup berdasarkan ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    // Cari SkillGroup berdasarkan ID
    const skillGroup = await prismadb.skillGroup.findUnique({
      where: {
        id: parseInt(id), // Pastikan ID yang diterima adalah integer
      },
    });

    // Jika SkillGroup tidak ditemukan, kembalikan response 404
    if (!skillGroup) {
      return new NextResponse("SkillGroup not found", { status: 404 });
    }

    // Hapus SkillGroup dari database
    await prismadb.skillGroup.delete({
      where: {
        id: parseInt(id), // Menghapus berdasarkan ID
      },
    });

    return new NextResponse("SkillGroup deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting skill group:", error);
    return new NextResponse("Failed to delete skill group", { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = params;
    const { name, status } = await request.json();

    // Validasi input
    if (!name || !status) {
      return new NextResponse("Name and status are required", { status: 400 });
    }

    // Cari SkillGroup berdasarkan ID
    const existingSkillGroup = await prismadb.skillGroup.findUnique({
      where: {
        id: parseInt(id), // Pastikan ID yang diterima adalah integer
      },
    });

    // Jika SkillGroup tidak ditemukan, kembalikan response 404
    if (!existingSkillGroup) {
      return new NextResponse("SkillGroup not found", { status: 404 });
    }

    // Update SkillGroup di database
    const updatedSkillGroup = await prismadb.skillGroup.update({
      where: {
        id: parseInt(id), // Update berdasarkan ID
      },
      data: {
        name, // Update name jika ada perubahan
        status, // Update status jika ada perubahan
      },
    });

    // Return response dengan data SkillGroup yang sudah diperbarui
    return new NextResponse(JSON.stringify(updatedSkillGroup), { status: 200 });
  } catch (error) {
    console.error("Error updating skill group:", error);
    return new NextResponse("Failed to update skill group", { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    // Cari SkillGroup berdasarkan ID
    const skillGroup = await prismadb.skillGroup.findUnique({
      where: {
        id: parseInt(id), // Pastikan ID yang diterima adalah integer
      },
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

    // Jika tidak ditemukan, kembalikan not found
    if (!skillGroup) {
      return new NextResponse("SkillGroup not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(skillGroup), { status: 200 });
  } catch (error) {
    console.error("Error fetching skill group by ID:", error);
    return new NextResponse("Failed to fetch skill group", { status: 500 });
  }
}
