import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

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

    // Ambil session pengguna (Admin) untuk memastikan akses
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "Dosen") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Cari record Type berdasarkan slug termasuk relasi formats
    const typeData = await prismadb.type.findUnique({
      where: { slug: type },
      include: { formats: true },
    });

    if (!typeData || !typeData.formats || typeData.formats.length === 0) {
      return NextResponse.json(
        { message: "Type or formats not found" },
        { status: 404 },
      );
    }

    // Hitung total required file untuk format yang isPrimary saja
    const totalRequiredFiles = await prismadb.requiredFile.count({
      where: {
        formatId: {
          in: typeData.formats
            .filter((format) => format.is_primary)
            .map((format) => format.id),
        },
      },
    });

    console.log("Total Required Files:", totalRequiredFiles);

    // Ambil semua pengajuan berdasarkan tipe, termasuk informasi terkait
    const submissions = await prismadb.submission.findMany({
      where: {
        Type: {
          slug: type, // Filter berdasarkan 'slug' dari tabel 'type'
        },
        Verificator: {
          some: {
            lecturerId: Number(session.user.id), // Filter berdasarkan 'lecturerId' dari tabel 'verificator'
          },
        },
        // isReadyToBeProcessed: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        User: true, // Menyertakan informasi mahasiswa
        Type: {
          include: {
            formats: {
              where: {
                is_primary: true,
              },
            },
          },
        },
        RequiredFiles: {
          include: {
            RequiredFile: true, // Menyertakan file yang dibutuhkan untuk pengajuan
          },
        },
        SubmissionRequiredValue: {
          include: {
            verificator: {
              include: {
                User: true,
              },
            },
          },
        }, // Menyertakan nilai yang diperlukan untuk pengajuan
        SkillGroup: true, // Mengambil informasi kelompok keahlian yang relevan
        Verificator: {
          include: {
            User: true,
          },
        }, // Mengambil data verifikator (dosen pembimbing atau penguji)
      },
    });
    console.log("Submissions:", submissions);

    const verificatorScores = submissions.reduce(
      (
        acc: {
          [key: string]: {
            total: number;
            count: number;
            name: string;
            note: string;
          };
        },
        val,
      ) => {
        if (val.SubmissionRequiredValue.length > 0) {
          const verificatorIdStr = val.Verificator[0].id.toString();
          if (!acc[verificatorIdStr]) {
            acc[verificatorIdStr] = {
              total: 0,
              count: 0,
              name: val.Verificator[0].User.name,
              note: val.Verificator[0].note ?? "",
            };
          }
          acc[verificatorIdStr].total += parseFloat(
            val.SubmissionRequiredValue[0].value,
          );
          acc[verificatorIdStr].count += 1;
        }
        return acc;
      },
      {} as {
        [key: string]: {
          total: number;
          count: number;
          name: string;
          note: string;
        };
      },
    );

    const verificatorAverages = Object.keys(verificatorScores).map((key) => ({
      verificatorId: key,
      average: verificatorScores[key].total / verificatorScores[key].count,
      name: verificatorScores[key].name,
      note: verificatorScores[key].note,
    }));
    console.log("Verificator Averages:", verificatorAverages);

    // const approvedFiles = submissions.reduce(
    //   (acc: number, submission) =>
    //     acc +
    //     submission.RequiredFiles.filter(
    //       (file: { status: string }) => file.status === "approved",
    //     ).length,
    //   0,
    // );
    const totalFiles = submissions.reduce(
      (acc: number, submission) => acc + submission.RequiredFiles.length,
      0,
    );
    console.log("Total Files:", totalFiles);

    const formattedSubmissions = submissions.map((submission) => {
      return {
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
        decision: submission.decision,
        skillGroupId: String(submission.skillGroupId),
        skillGroup: submission.SkillGroup ? submission.SkillGroup : null,
        verificatorAverages,
        approvedFiles: submission.RequiredFiles.filter(
          (file: { status: string }) => file.status === "approved",
        ).length,
        totalFiles: totalFiles,
        RequiredFiles: submission.RequiredFiles.map((file: any) => ({
          id: file.id.toString(),
          titleSubmissionId: file.titleSubmissionId,
          submissionId: file.submissionId.toString(),
          requiredFileId: file.requiredFileId.toString(),
          file_url: file.file_url,
          status: file.status,
          createdAt: file.createdAt,
          updatedAt: file.updatedAt,
          RequiredFile: {
            id: file.RequiredFile.id.toString(),
            name: file.RequiredFile.name,
            key: file.RequiredFile.key,
            note: file.RequiredFile.note,
            formatId: file.RequiredFile.formatId.toString(),
            isVerificatorCanEdit: file.RequiredFile.isVerificatorCanEdit,
            isVerificatorCanView: file.RequiredFile.isVerificatorCanView,
            createdAt: file.RequiredFile.createdAt,
            updatedAt: file.RequiredFile.updatedAt,
          },
        })),
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
          formats: submission.Type.formats.map((format: any) => ({
            id: String(format.id),
            typeId: String(format.typeId),
            name: format.name,
            document_format: format.document_format,
            document_format_name: format.document_format_name,
            document_format_size: format.document_format_size,
            is_primary: format.is_primary,
            is_schedule_required: format.is_schedule_required,
            is_newtitle_submission: format.is_newtitle_submission,
            give_access_to_mahasiswa: format.give_access_to_mahasiswa,
            if_pass_then_give_access_type_id:
              format.if_pass_then_give_access_type_id,
            requires_pembimbing: format.requires_pembimbing,
            requires_penguji: format.requires_penguji,
            requires_skill_group: format.requires_skill_group,
            requires_academic_advisor: format.requires_academic_advisor,
            next_submission_uses_current_verif:
              format.next_submission_uses_current_verif,
            createdAt: format.createdAt,
            updatedAt: format.updatedAt,
            status: format.status,
          })),
        },
        SubmissionRequiredValue: submission.SubmissionRequiredValue.map(
          (value) => ({
            id: value.id.toString(), // Mengonversi BigInt menjadi string
            value: value.value,
            requiredValueId: value.requiredValueId.toString(), // Mengonversi BigInt menjadi string
            createdAt: value.createdAt,
            updatedAt: value.updatedAt,
          }),
        ),
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
      };
    });
    console.log("Formatted Submissions:", formattedSubmissions);

    return NextResponse.json({ formattedSubmissions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};
