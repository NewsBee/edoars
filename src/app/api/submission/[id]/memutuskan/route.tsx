import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const { decision, recommendationDate, recommendationTitle } =
      await req.json();

    if (!id || !decision) {
      return NextResponse.json(
        { message: "Submission ID and decision are required" },
        { status: 400 },
      );
    }

    const submission = await prismadb.submission.findUnique({
      where: {
        id: BigInt(id),
      },
    });

    if (!submission) {
      return NextResponse.json(
        { message: "Submission not found" },
        { status: 404 },
      );
    }
    if (decision === "Diterima") {
      await prismadb.submission.update({
        where: {
          id: BigInt(id),
        },
        data: {
          status: "approved",
        },
      });
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
              formats: true,
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
      const newTypeId =
        submission.Type.formats[0]?.if_pass_then_give_access_type_id;

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

    await prismadb.submission.update({
      where: {
        id: BigInt(id),
      },
      data: {
        decision,
        requestJadwal:
          decision === "Diulang" ? new Date(recommendationDate) : null,
        recommendTitleChange: recommendationTitle || null,
      },
    });

    return NextResponse.json(
      { message: "Hasil keputusan berhasil disimpan" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error saving decision:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
