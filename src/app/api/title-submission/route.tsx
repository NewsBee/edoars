import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';


export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "Mahasiswa") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, topic, abstract } = body;

    if (!title || !abstract) {
      return NextResponse.json(
        { message: "Title and Abstract are required" },
        { status: 400 }
      );
    }

    // Cek apakah mahasiswa sudah memiliki pengajuan judul aktif
    const existingSubmission = await prismadb.titleSubmission.findFirst({
      where: {
        userId: Number(session.user.id),
        OR: [{ status: "Pending" }, { status: "Approved" }],
      },
    });

    if (existingSubmission) {
      return NextResponse.json(
        {
          message: "You already have an active or pending title submission",
        },
        { status: 400 }
      );
    }

    // Buat pengajuan baru terlebih dahulu
    const submission = await prismadb.titleSubmission.create({
      data: {
        userId: Number(session.user.id),
        title,
        topic: topic || null,
        abstract,
        status: "Pending",
      },
    });

    // Setelah pengajuan berhasil dibuat, catat log aktivitas
    await prismadb.activitySubmissionLog.create({
      data: {
        titleSubmissionId: submission.id, // Gunakan kolom titleSubmissionId
        userId: Number(session.user.id),
        activity: "Pengajuan baru dibuat oleh mahasiswa.",
      },
    });

    return NextResponse.json(
      { message: "Title submission created successfully", submission },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating title submission:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};


export const GET = async () => {
    try {
      // Dapatkan session pengguna
      const session = await getServerSession(authOptions);
  
      // Validasi peran pengguna
      if (!session || !["Admin", "Kaprodi"].includes(session.user.role)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
  
      // Ambil semua pengajuan judul
      const submissions = await prismadb.titleSubmission.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          assignedLecturers: {
            include: {
              User: true, // Ambil detail dosen dari tabel User
            },
          },
          User: true, // Ambil detail mahasiswa
        },
      });
  
      // Format data agar lebih mudah digunakan
      const formattedSubmissions = submissions.map((submission) => ({
        id: submission.id,
        user: {
          id: submission.User.id,
          name: submission.User.name,
          email: submission.User.email,
          nim: submission.User.nim,
        },
        title: submission.title,
        topic: submission.topic,
        abstract: submission.abstract,
        status: submission.status,
        reason: submission.reason,
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt,
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
      console.error("Error fetching all title submissions:", error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  };