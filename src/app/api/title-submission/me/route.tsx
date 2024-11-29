import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';



export const GET = async () => {
    try {
      const session = await getServerSession(authOptions);
  
      if (!session || session.user.role !== "Mahasiswa") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
  
      // Ambil semua pengajuan mahasiswa berdasarkan user ID
      const submissions = await prismadb.titleSubmission.findMany({
        where: {
          userId: Number(session.user.id),
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          assignedLecturers: {
            include: {
              User: true, // Ambil detail dosen dari tabel User
            },
          },
        },
      });
  
      // Format data agar lebih mudah digunakan
      const formattedSubmissions = submissions.map((submission) => ({
        ...submission,
        lecturers: submission.assignedLecturers.map((lecturer) => ({
          id: lecturer.User.id,
          name: lecturer.User.name,
          email: lecturer.User.email,
          role: lecturer.role, // Pembimbing 1 atau Pembimbing 2
        })),
      }));

      console.log(formattedSubmissions)
  
      return NextResponse.json({ submissions: formattedSubmissions }, { status: 200 });
    } catch (error) {
      console.error("Error fetching title submissions:", error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  };
  