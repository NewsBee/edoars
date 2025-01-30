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

    const titleSubmissionId = Number(params.id);

    // Logika untuk Revert
    if (action === "Revert") {
      await prismadb.assignedLecturer.deleteMany({
        where: { titleSubmissionId },
      });

      const revertedSubmission = await prismadb.titleSubmission.update({
        where: { id: titleSubmissionId },
        data: {
          status: "Pending",
          reason: null,
        },
      });

      // Tandai pengajuan di tabel Submission sebagai Invalid
      await prismadb.submission.updateMany({
        where: { relatedTitleId: titleSubmissionId },
        data: {
          status: "Invalid",
        },
      });

      // Simpan log di ApprovalLog
      await prismadb.approvalLog.create({
        data: {
          userId: Number(session.user.id),
          titleSubmissionId,
          action: "Reverted",
          reason: "Pengajuan dikembalikan ke Pending.",
        },
      });

      console.log("Creating activity log for revert...");
      await prismadb.activitySubmissionLog.create({
        data: {
          titleSubmissionId,
          userId: Number(session.user.id),
          activity: "Status pengajuan dikembalikan ke Pending oleh Kaprodi/Admin, dosen pembimbing dihapus, dan submission ditandai sebagai Invalid.",
        },
      });

      return NextResponse.json({
        message: "Submission reverted to Pending and lecturers removed. Related submissions marked as Invalid.",
        revertedSubmission,
      });
    }

    // Logika untuk Reject
    if (status === "Rejected") {
      await prismadb.assignedLecturer.deleteMany({
        where: { titleSubmissionId },
      });

      const updatedSubmission = await prismadb.titleSubmission.update({
        where: { id: titleSubmissionId },
        data: {
          status: "Rejected",
          reason: reason || null,
        },
      });

      // Tandai pengajuan di tabel Submission sebagai Invalid
      await prismadb.submission.updateMany({
        where: { relatedTitleId: titleSubmissionId },
        data: {
          status: "Invalid",
        },
      });

      // Simpan log di ApprovalLog
      await prismadb.approvalLog.create({
        data: {
          userId: Number(session.user.id),
          titleSubmissionId,
          action: "Rejected",
          reason: reason || "Tidak ada alasan yang diberikan.",
        },
      });

      console.log("Creating activity log for rejection...");
      await prismadb.activitySubmissionLog.create({
        data: {
          titleSubmissionId,
          userId: Number(session.user.id),
          activity: "Pengajuan judul ditolak oleh Kaprodi/Admin, dosen pembimbing dihapus, dan submission ditandai sebagai Invalid.",
        },
      });

      return NextResponse.json({
        message: "Submission rejected and lecturers removed. Related submissions marked as Invalid.",
        updatedSubmission,
      });
    }

    // Logika untuk Approve
    const updatedSubmission = await prismadb.titleSubmission.update({
      where: { id: titleSubmissionId },
      data: {
        status,
        reason: reason || null,
        // Validasi Assigned Lecturers sebelum membuatnya
        assignedLecturers: assignedLecturers
          ? {
              create: (() => {
                const lecturerIds = assignedLecturers.map((lecturer: { lecturerId: number }) => lecturer.lecturerId);
                const uniqueLecturerIds = new Set(lecturerIds);
    
                // Validasi: Apakah terdapat dosen pembimbing duplikat
                if (lecturerIds.length !== uniqueLecturerIds.size) {
                  throw new Error("Dosen pembimbing tidak boleh sama untuk pengajuan ini.");
                }
    
                // Kembalikan data yang valid
                return assignedLecturers.map((lecturer: { lecturerId: number; role: string }) => ({
                  lecturerId: lecturer.lecturerId,
                  role: lecturer.role,
                  source: session.user.name || "Admin",
                }));
              })(),
            }
          : undefined,
      },
    });

    // Buat record di tabel `Submission` jika disetujui
    if (status === "Approved") {
      const newSubmission = await prismadb.submission.create({
        data: {
          userId: updatedSubmission.userId,
          typeId: 1, // ID untuk tipe pengajuan (misalnya "Proposal")
          relatedTitleId: updatedSubmission.id,
          title: updatedSubmission.title,
          description: updatedSubmission.abstract || null, // Menggunakan abstrak dari pengajuan judul jika ada
          status: "Pending",
          createdAt: new Date(),
        },
      });

      // Simpan log di ApprovalLog
      await prismadb.approvalLog.create({
        data: {
          userId: Number(session.user.id),
          titleSubmissionId,
          submissionId: newSubmission.id,
          action: "Approved",
          reason: "Pengajuan disetujui oleh Kaprodi/Admin.",
        },
      });

      console.log("Submission created:", newSubmission);
    }

    console.log("Creating activity log for approval...");
    await prismadb.activitySubmissionLog.create({
      data: {
        titleSubmissionId,
        userId: Number(session.user.id),
        activity:
          status === "Approved"
            ? "Pengajuan judul disetujui oleh Kaprodi/Admin."
            : "Pengajuan judul ditolak oleh Kaprodi/Admin.",
      },
    });

    return NextResponse.json({ message: "Submission status updated", updatedSubmission });
  } catch (error: any) {
    if (error.code === "P2003") {
      console.error("Foreign key constraint error:", error.meta);
      return NextResponse.json({ message: "Foreign key constraint failed", details: error.meta }, { status: 500 });
    }
    console.error("Error updating submission status:", JSON.stringify(error, null, 2));
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};
