import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "ID parameter is required" },
        { status: 400 },
      );
    }

    const submission = await prismadb.submission.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        User: true,
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
            RequiredFile: true,
          },
        },
        SubmissionRequiredValue: {
          include: {
            requiredValue: true,
            verificator: {
              include: {
                User: true,
              },
            },
          },
        },
        SkillGroup: true,
        Verificator: {
          include: {
            User: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { message: "Submission not found" },
        { status: 404 },
      );
    }

    const requiredFiles = await prismadb.requiredFile.findMany({
      where: {
        formatId: submission.Type.formats[0].id,
      },
      include: {
        SubmissionRequiredFiles: true,
      },
    });
    const requiredValues = await prismadb.requiredValue.findMany({
      where: {
        formatId: submission.Type.formats[0].id,
      },
    });

    console.log(requiredValues);
    console.log(submission);

    const verificatorScores = submission.SubmissionRequiredValue.reduce(
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
        if (val.value !== null) {
          const verificatorIdStr = val.verificatorId.toString();
          const weight = val.requiredValue.bobot ?? 1; // Default 1 jika bobot null
          if (!acc[verificatorIdStr]) {
            acc[verificatorIdStr] = {
              total: 0,
              count: 0,
              name: val.verificator.User.name,
              note: val.verificator.note ?? "",
            };
          }
          acc[verificatorIdStr].total += parseFloat(val.value) * weight;
          acc[verificatorIdStr].count += weight;
        }
        return acc;
      },
      {},
    );

    const verificatorAverages = Object.keys(verificatorScores).map((key) => ({
      verificatorId: key,
      average: verificatorScores[key].total / verificatorScores[key].count,
      name: verificatorScores[key].name,
      note: verificatorScores[key].note,
    }));
    console.log("Verificator Averages:", verificatorAverages);

    const approvedFiles = submission.RequiredFiles.filter(
      (file: { status: string }) => file.status === "approved",
    ).length;
    const totalFiles = submission.RequiredFiles.length;
    console.log("Approved Files:", approvedFiles, "Total Files:", totalFiles);

    const skillGroups = await prismadb.skillGroup.findMany({
      where: {
        status: "Aktif",
      },
    });
    console.log(skillGroups);
    const requiredFilesFormatted = requiredFiles.map((file: any) => ({
      id: file.id.toString(),
      name: file.name,
      key: file.key,
      note: file.note,
      formatId: file.formatId.toString(),
      isVerificatorCanEdit: file.isVerificatorCanEdit,
      isVerificatorCanView: file.isVerificatorCanView,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    }));
    console.log(requiredFilesFormatted);
    const formattedSubmission = {
      id: String(submission.id),
      typeId: String(submission.typeId),
      userId: submission.userId,
      title: submission.title,
      description: submission.description,
      status: submission.status,
      jadwal: submission.jadwal,
      requestJadwal: submission.requestJadwal,
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
      recommendTitleChange: submission.recommendTitleChange,
      decision: submission.decision,
      semester: submission.semester,
      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt,
      skillGroupId: String(submission.skillGroupId),
      skillGroup: submission.SkillGroup?.name,
      verificatorAverages,
      approvedFiles,
      totalFiles,
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
      RequiredValues: requiredValues.map((value: any) => ({
        id: value.id.toString(),
        name: value.name,
        note: value.note,
        bobot: value.bobot,
        formatId: value.formatId.toString(),
        createdAt: value.createdAt,
        updatedAt: value.updatedAt,
      })),
      SubmissionRequiredValue: submission.SubmissionRequiredValue.map(
        (value: any) => ({
          id: value.id.toString(),
          value: value.value,
          note: value.note,
          requiredValueId: value.requiredValueId.toString(),
          verificatorId: value.verificatorId.toString(),
          createdAt: value.createdAt,
          updatedAt: value.updatedAt,
        }),
      ),
      Verificator: submission.Verificator.map((verifier: any) => ({
        id: verifier.id.toString(),
        type: verifier.type,
        status: verifier.status,
        note: verifier.note,
        totalScore: verifier.totalScore,
        averageScore: verifier.averageScore,
        submissionId: verifier.submissionId
          ? verifier.submissionId.toString()
          : null,
        lecturerId: verifier.lecturerId,
        createdAt: verifier.createdAt,
        updatedAt: verifier.updatedAt,
        lecturerName: verifier.User ? verifier.User.name : null,
      })),
      skillGroups: skillGroups.map((group: any) => ({
        id: group.id.toString(),
        name: group.name,
      })),
      requiredFilesFormatted,
    };
    console.log(formattedSubmission);

    return NextResponse.json(
      { formattedSubmission, requiredFilesFormatted },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching submission:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await req.json();
    console.log(body);

    if (!id) {
      return NextResponse.json(
        { message: "ID parameter is required" },
        { status: 400 },
      );
    }

    const { verificatorId, verificatorStatus } = body;

    if (verificatorId && verificatorStatus) {
      if (session.user.role !== "Dosen") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }

      const updatedVerificator = await prismadb.verificator.update({
        where: {
          id: BigInt(verificatorId),
        },
        data: {
          status: verificatorStatus,
        },
      });

      console.log(updatedVerificator);
    }

    if (body.status === "approved") {
      const submission = await prismadb.submission.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          RequiredFiles: true,
          Verificator: {
            include: {
              User: true,
            },
          },
          Type: {
            include: {
              formats: {
                where: {
                  is_primary: true,
                },
              },
            },
          },
        },
      });

      if (!submission) {
        return NextResponse.json(
          { message: "Submission not found" },
          { status: 404 },
        );
      }
      console.log(submission);
      console.log(submission.Type.formats[0].if_pass_then_give_access_type_id);

      const approvedFiles = submission.RequiredFiles.filter(
        (file: { status: string }) => file.status === "approved",
      ).length;
      const totalFiles = submission.RequiredFiles.length;

      if (approvedFiles !== totalFiles) {
        return NextResponse.json(
          { message: "Not all required files are approved" },
          { status: 400 },
        );
      }
      // Cek apakah ada if_pass_then_give_access_type_id
      const newTypeId =
        submission.Type.formats[0]?.if_pass_then_give_access_type_id;
      console.log(newTypeId);
      if (newTypeId) {
        // Cek apakah sudah ada entri di StudentTypeAccessPermission
        const existingPermission =
          await prismadb.studentTypeAccessPermission.findFirst({
            where: {
              userId: submission.userId,
              typeId: BigInt(newTypeId),
            },
          });

        if (!existingPermission) {
          // 1) Buat entri di StudentTypeAccessPermission
          const studentType = await prismadb.studentTypeAccessPermission.create(
            {
              data: {
                userId: submission.userId,
                typeId: BigInt(newTypeId),
              },
            },
          );
          console.log(studentType);
        }

        // Cek apakah sudah ada submission baru dengan typeId yang sama
        const existingNewSubmission = await prismadb.submission.findFirst({
          where: {
            userId: submission.userId,
            typeId: BigInt(newTypeId),
          },
        });

        if (!existingNewSubmission) {
          // 2) Buat submission baru
          const newSubmission = await prismadb.submission.create({
            data: {
              typeId: BigInt(newTypeId),
              userId: submission.userId,
              title: submission.title,
              description: submission.description,
              academicYear: submission.academicYear,
              amountOfSks: submission.amountOfSks,
              ipkNow: submission.ipkNow,
              skillGroupId: submission.skillGroupId,
              status: "pending", // Biarkan default saja
            },
          });
          console.log(newSubmission);

          // 3) Salin Verificator
          for (const v of submission.Verificator) {
            await prismadb.verificator.create({
              data: {
                type: v.type,
                status: "pending", // atau biarkan sesuai kebutuhan
                lecturerId: v.lecturerId,
                submissionId: BigInt(newSubmission.id.toString()),
                note: v.note,
              },
            });
          }
        }
      }
    }
    console.log(body.semester);
    const updatedSubmission = await prismadb.submission.update({
      where: {
        id: BigInt(id),
      },
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        jadwal: body.jadwal ? new Date(body.jadwal) : null,
        room: body.room,
        academicYear: body.academicYear,
        amountOfSks: body.amountOfSks,
        ipkNow: body.ipkNow,
        semester: body.semester,
        skillGroupId: body.skillGroupId ? parseInt(body.skillGroupId) : null,
      },
    });

    console.log(updatedSubmission);
    const serializedSubmission = {
      ...updatedSubmission,
      id: updatedSubmission.id.toString(),
      typeId: updatedSubmission.typeId.toString(),
      skillGroupId: updatedSubmission.skillGroupId?.toString(),
    };

    return NextResponse.json({ serializedSubmission }, { status: 200 });
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "ID parameter is required" },
        { status: 400 },
      );
    }

    const submission = await prismadb.submission.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!submission) {
      return NextResponse.json(
        { message: "Submission not found" },
        { status: 404 },
      );
    }

    await prismadb.submission.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json(
      { message: "Submission deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};