import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const session = await getServerSession(authOptions);

    // Validasi role
    if (!session || !["Admin", "Kaprodi"].includes(session.user.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { status, reason, assignedLecturers, action } = body;

    // Validasi ID
    if (!params.id || isNaN(Number(params.id))) {
      return NextResponse.json({ message: "Invalid title submission ID" }, { status: 400 });
    }

    if (!session.user.id || isNaN(Number(session.user.id))) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    // Logika untuk Revert
    if (action === "Revert") {
      await prismadb.assignedLecturer.deleteMany({
        where: { titleSubmissionId: Number(params.id) },
      });

      const revertedSubmission = await prismadb.titleSubmission.update({
        where: { id: Number(params.id) },
        data: {
          status: "Pending",
          reason: null,
        },
      });

      console.log("Creating activity log for revert...");
      await prismadb.activitySubmissionLog.create({
        data: {
          titleSubmissionId: Number(params.id),
          userId: Number(session.user.id),
          activity: "Status pengajuan dikembalikan ke Pending oleh Kaprodi/Admin, dosen pembimbing dihapus.",
        },
      });

      return NextResponse.json({ message: "Submission reverted to Pending and lecturers removed", revertedSubmission });
    }

    // Logika untuk Reject
    if (status === "Rejected") {
      await prismadb.assignedLecturer.deleteMany({
        where: { titleSubmissionId: Number(params.id) },
      });

      const updatedSubmission = await prismadb.titleSubmission.update({
        where: { id: Number(params.id) },
        data: {
          status: "Rejected",
          reason: reason || null,
        },
      });

      console.log("Creating activity log for rejection...");
      await prismadb.activitySubmissionLog.create({
        data: {
          titleSubmissionId: Number(params.id),
          userId: Number(session.user.id),
          activity: "Pengajuan judul ditolak oleh Kaprodi/Admin dan dosen pembimbing dihapus.",
        },
      });

      return NextResponse.json({ message: "Submission rejected and lecturers removed", updatedSubmission });
    }

    // Logika untuk Approve
    const updatedSubmission = await prismadb.titleSubmission.update({
      where: { id: Number(params.id) },
      data: {
        status,
        reason: reason || null,
        assignedLecturers: assignedLecturers
          ? {
              create: assignedLecturers.map((lecturer: { lecturerId: number; role: string }) => ({
                lecturerId: lecturer.lecturerId,
                role: lecturer.role,
                source: session.user.name || "Admin",
              })),
            }
          : undefined,
      },
    });

    console.log("Creating activity log for approval...");
    await prismadb.activitySubmissionLog.create({
      data: {
        titleSubmissionId: Number(params.id),
        userId: Number(session.user.id),
        activity:
          status === "Approved"
            ? "Pengajuan judul disetujui oleh Kaprodi/Admin."
            : "Pengajuan judul ditolak oleh Kaprodi/Admin.",
      },
    });

    return NextResponse.json({ message: "Submission status updated", updatedSubmission });
  } catch (error:any) {
    if (error.code === "P2003") {
      console.error("Foreign key constraint error:", error.meta);
      return NextResponse.json({ message: "Foreign key constraint failed", details: error.meta }, { status: 500 });
    }
    console.error("Error updating submission status:", JSON.stringify(error, null, 2));
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};
