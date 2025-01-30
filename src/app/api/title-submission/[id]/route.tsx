import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export const PUT = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
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
        { status: 400 },
      );
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
        { status: 404 },
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
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating title submission:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};

export const GET = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Debug params
    console.log("Received params:", params);

    // Validasi params.id
    if (!params.id || isNaN(Number(params.id))) {
      return NextResponse.json(
        { message: "Invalid or missing ID parameter" },
        { status: 400 }
      );
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
        requiredFiles: {
          include: {
            RequiredFile: true, // Detail tipe file
          },
        },
      },
    });

    // Debug hasil query
    console.log("Title Submission Query Result:", titleSubmission);

    if (!titleSubmission) {
      return NextResponse.json(
        { message: "Submission not found" },
        { status: 404 },
      );
    }

    const files = titleSubmission.requiredFiles.map((file) => ({
      fileType: file.RequiredFile.file_name,
      fileUrl: file.file_url,
      status: file.status,
    }));

    // Ambil log aktivitas terkait
    const activityLogs = await prismadb.activitySubmissionLog.findMany({
      where: { titleSubmissionId: Number(params.id) },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      id: titleSubmission.id,
      userId: titleSubmission.userId,
      title: titleSubmission.title,
      topic: titleSubmission.topic,
      abstract: titleSubmission.abstract,
      status: titleSubmission.status,
      reason: titleSubmission.reason,
      createdAt: titleSubmission.createdAt,
      updatedAt: titleSubmission.updatedAt,
      User: titleSubmission.User,
      assignedLecturers: titleSubmission.assignedLecturers.map((lecturer) => ({
        id: lecturer.id,
        titleSubmissionId: lecturer.titleSubmissionId,
        submissionId: lecturer.submissionId,
        lecturerId: lecturer.lecturerId,
        role: lecturer.role,
        source: lecturer.source,
        createdAt: lecturer.createdAt,
        updatedAt: lecturer.updatedAt,
        User: lecturer.User,
      })),
      requiredFiles: titleSubmission.requiredFiles.map((file) => ({
        id: file.id,
        titleSubmissionId: file.titleSubmissionId,
        submissionId: file.submissionId,
        requiredFileId: file.requiredFileId,
        file_url: file.file_url,
        status: file.status,
        createdAt: file.createdAt,
        updatedAt: file.updatedAt,
        RequiredFile: file.RequiredFile,
      })),
      activityLogs,
    });
  } catch (error) {
    console.error("Error fetching title submission:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};

