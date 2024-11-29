import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "Mahasiswa") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, topic, abstract } = body;

    if (!title || !abstract) {
      return NextResponse.json({ message: "Title and Abstract are required" }, { status: 400 });
    }

    // Cek apakah pengajuan tersebut milik mahasiswa ini
    const submission = await prismadb.titleSubmission.findUnique({
      where: {
        id: Number(params.id),
      },
    });

    // Konversi session.user.id ke number sebelum dibandingkan
    if (!submission || submission.userId !== Number(session.user.id)) {
      return NextResponse.json(
        { message: "Submission not found or access denied" },
        { status: 404 }
      );
    }

    // Update pengajuan judul
    const updatedSubmission = await prismadb.titleSubmission.update({
      where: {
        id: Number(params.id),
      },
      data: {
        title,
        topic: topic || null,
        abstract,
        status: "Pending", 
      },
    });

    return NextResponse.json(
      {
        message: "Title submission updated successfully",
        updatedSubmission,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating title submission:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session in API:", session);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Ambil detail pengajuan judul berdasarkan ID
    const titleSubmission = await prismadb.titleSubmission.findUnique({
      where: { id: Number(params.id) },
      include: {
        User: true, // Detail mahasiswa
        assignedLecturers: {
          include: {
            User: true, // Detail dosen pembimbing
          },
        },
      },
    });

    if (!titleSubmission) {
      return NextResponse.json({ message: "Submission not found" }, { status: 404 });
    }

    // Ambil log aktivitas terkait
    const activityLogs = await prismadb.activitySubmissionLog.findMany({
      where: { titleSubmissionId: Number(params.id) },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ titleSubmission, activityLogs });
  } catch (error) {
    console.error("Error fetching title submission:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};
