import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// API untuk mengambil data pengajuan (submissions) berdasarkan tipe pengajuan
export const GET = async (req: NextRequest) => {
  try {
    // Mendapatkan query parameter untuk tipe pengajuan
    const url = new URL(req.url);
    const type = url.searchParams.get("type"); // Menangkap query parameter 'type'

    if (!type) {
      return NextResponse.json(
        { message: "Type parameter is required" },
        { status: 400 },
      );
    }

    // Menyaring berdasarkan tipe pengajuan jika ada, default ambil semua
    // const whereCondition = type ? { type: { slug: type } } : {};

    // const whereCondition = { type: { slug:  } };
    // Ambil session pengguna (Admin) untuk memastikan akses
    const session = await getServerSession(authOptions);

    // if (!session || session.user.role !== "Admin") {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // Ambil semua pengajuan berdasarkan tipe, termasuk informasi terkait
    const submissions = await prismadb.submission.findMany({
      where: {
        Type: {
          slug: type, // Filter berdasarkan 'slug' dari tabel 'type'
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        User: true, // Menyertakan informasi mahasiswa
        Type: true, // Menyertakan tipe pengajuan
        RequiredFiles: {
          include: {
            RequiredFile: true, // Menyertakan file yang dibutuhkan untuk pengajuan
          },
        },
        SubmissionRequiredValue: true, // Menyertakan nilai yang diperlukan untuk pengajuan
        SkillGroup: true, // Mengambil informasi kelompok keahlian yang relevan
        Verificator: {
          include: {
            User: true
          }
        }, // Mengambil data verifikator (dosen pembimbing atau penguji)
      },
    });
    console.log(submissions);

    const formattedSubmissions = submissions.map((submission) => ({
      id: String(submission.id),
      typeId: String(submission.typeId),
      userId: submission.userId,
      title: submission.title,
      description: submission.description,
      status: submission.status,
      jadwal: submission.jadwal,
      room: submission.room,
      recordUrl: submission.recordUrl,
      grade: submission.grade,
      gradeDescription: submission.gradeDescription,
      score: submission.score,
      gradeStatus: submission.gradeStatus,
      documentFormat: submission.documentFormat,
      academicYear: submission.academicYear,
      amountOfSks: submission.amountOfSks,
      ipkNow: submission.ipkNow,
      isReadByTataUsaha: submission.isReadByTataUsaha,
      isReadyToBeProcessed: submission.isReadyToBeProcessed,
      spotaSubmissionId: submission.spotaSubmissionId,
      semester: submission.semester,
      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt,
      skillGroupId: String(submission.skillGroupId),
      skillGroup: submission.SkillGroup?.name,
      User: {
        id: submission.User.id,
        external_user_id: submission.User.external_user_id,
        name: submission.User.name,
        email: submission.User.email,
        phone_number: submission.User.phone_number,
        nim: submission.User.nim,
        password: submission.User.password,
        nip: submission.User.nip,
        role: submission.User.role,
        nama_satker: submission.User.nama_satker,
        id_satker: submission.User.id_satker,
        periode_masuk: submission.User.periode_masuk,
        google_drive_folder_id: submission.User.google_drive_folder_id,
        status: submission.User.status,
        signature_image: submission.User.signature_image,
        profile_image: submission.User.profile_image,
        createdAt: submission.User.createdAt,
        updatedAt: submission.User.updatedAt,
        last_login: submission.User.last_login,
      },
      Type: {
        id: String(submission.Type.id),
        name: submission.Type.name,
        slug: submission.Type.slug,
        color: submission.Type.color,
        description: submission.Type.description,
        status: submission.Type.status,
        createdAt: submission.Type.createdAt,
        updatedAt: submission.Type.updatedAt,
      },
      // Menangani RequiredFiles yang berisi BigInt
    //   RequiredFiles: submission.RequiredFiles.map((file) => ({
    //     id: file.id.toString(), // Mengonversi BigInt menjadi string
    //     name: file.name,
    //     key: file.key,
    //     note: file.note,
    //     formatId: file.formatId.toString(), // Mengonversi BigInt menjadi string
    //     createdAt: file.createdAt,
    //     updatedAt: file.updatedAt,
    //   })),
      // Menangani SubmissionRequiredValue yang berisi BigInt
      SubmissionRequiredValue: submission.SubmissionRequiredValue.map(
        (value) => ({
          id: value.id.toString(), // Mengonversi BigInt menjadi string
          value: value.value,
          requiredValueId: value.requiredValueId.toString(), // Mengonversi BigInt menjadi string
          createdAt: value.createdAt,
          updatedAt: value.updatedAt,
        }),
      ),
      // Menangani SkillGroup yang berisi BigInt
      Verificator: submission.Verificator.map((verifier) => ({
        id: verifier.id.toString(), // Mengonversi BigInt menjadi string
        type: verifier.type,
        status: verifier.status,
        submissionId: verifier.submissionId
          ? verifier.submissionId.toString()
          : null,
        lecturerId: verifier.lecturerId,
        createdAt: verifier.createdAt,
        updatedAt: verifier.updatedAt,
        lecturerName: verifier.User ? verifier.User.name : null,
      })),
      // Verificator: submission.Verificator
    }));
    console.log(formattedSubmissions)

    return NextResponse.json({ formattedSubmissions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};
