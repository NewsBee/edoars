import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export const GET = async (req: Request, { params }: { params: { id: string } }) => {
    try {
      const session = await getServerSession(authOptions);
  
      const userId = Number(params.id);
  
      // Fetch Submission with RequiredFiles and AssignedLecturers (Pembimbing & Penguji)
      const submission = await prismadb.submission.findFirst({
        where: {
          userId: userId,
          Type: { slug: "proposal" }, // Mengambil pengajuan sidang proposal
        },
        include: {
          AssignedLecturers: {
            include: {
              User: true, // Menyertakan informasi dosen pembimbing dan penguji
            },
          },
          RequiredFiles: {
            include: {
              RequiredFile: true, // Menyertakan informasi file yang diperlukan
            },
          },
        },
      });
  
      if (!submission) {
        return NextResponse.json({ message: "Submission not found" }, { status: 404 });
      }
  
      // Format data untuk dikirimkan
      const pembimbing = submission.AssignedLecturers.filter(
        (lecturer: any) => lecturer.role === "Pembimbing"
      ).map((lecturer: any) => ({
        name: lecturer.User.name,
        email: lecturer.User.email,
      }));
  
      const penguji = submission.AssignedLecturers.filter(
        (lecturer: any) => lecturer.role === "Penguji"
      ).map((lecturer: any) => ({
        name: lecturer.User.name,
        email: lecturer.User.email,
      }));
  
      // Pastikan RequiredFiles dan RequiredFile ada dan terisi
      const files = submission.RequiredFiles?.map((file: any) => ({
        file_name: file.RequiredFile?.file_name || "Unknown file", // Cek apakah RequiredFile ada
        status: file.status || "Pending", // Cek apakah status ada
        file_url: file.file_url || null, // Cek apakah file_url ada
      })) || [];
  
      return NextResponse.json({
        message: "Submission data retrieved successfully",
        data: {
          id: submission.id,
          title: submission.title,
          status: submission.status,
          pembimbing,
          penguji,
          jadwal_sidang: submission.jadwal ? submission.jadwal.toISOString() : null,
          files,
        },
      }, { status: 200 });
  
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching submission:", error.message);
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
      } else {
        console.error("Unknown error:", error);
        return NextResponse.json({ message: "Internal server error", error: "Unknown error" }, { status: 500 });
      }
    }
  };
  
