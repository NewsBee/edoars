import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createHash } from "crypto";
import { uploadFileToS3 } from "@/lib/s3Utils";


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

    // Ambil session pengguna (Admin) untuk memastikan akses
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

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

    const approvedFiles = submissions.reduce(
      (acc: number, submission) =>
        acc +
        submission.RequiredFiles.filter(
          (file: { status: string }) => file.status === "Approved",
        ).length,
      0,
    );
    const totalFiles = submissions.reduce(
      (acc: number, submission) => acc + submission.RequiredFiles.length,
      0,
    );
    console.log("Approved Files:", approvedFiles, "Total Files:", totalFiles);

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
        skillGroupId: String(submission.skillGroupId),
        skillGroup: submission.SkillGroup ? submission.SkillGroup : null,
        verificatorAverages,
        approvedFiles,
        totalFiles,
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

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  try {
    // Parse FormData from the incoming request
    const formData = await req.formData();

    // Get fields from the formData
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const typeId = formData.get("typeId") as string;

    // Validate the typeId (check if the type exists in the database)
    const type = await prismadb.type.findUnique({
      where: { id: BigInt(typeId) },
    });

    if (!type) {
      return NextResponse.json(
        { message: "Tipe pengajuan tidak ditemukan" },
        { status: 404 },
      );
    }

    // Create a new submission
    const newSubmission = await prismadb.submission.create({
      data: {
        title,
        description,
        userId: Number(session?.user.id), // Assuming the user ID is 1, update as needed
        typeId: BigInt(typeId), // Save typeId in submission
        status: "pending", // Default status
      },
    });
    console.log(newSubmission);

    // Handle file uploads (if any)
    const fileKeys: string[] = [];
    for (let [key, value] of formData.entries()) {
      console.log(key, value);

      if (
        key !== "title" &&
        key !== "topic" &&
        key !== "description" &&
        key !== "typeId"
      ) {
        if (value instanceof File) {
          const fileToUpload = value as File;

          // Upload the file to S3 and get the file URL
          const fileUrl = await uploadFileToS3(fileToUpload, BigInt(typeId));

          const requiredFileId = formData.get(`${key}_id`) as string;

          // Save the file URL in the SubmissionRequiredFile table
          const createSubmission = await prismadb.submissionRequiredFile.create(
            {
              data: {
                submissionId: newSubmission.id,
                file_url: fileUrl, // Store the file URL
                requiredFileId: BigInt(requiredFileId), // Assuming file required ID is provided
                status: "pending", // Default status for new file
              },
            },
          );
          console.log(createSubmission);
        }
      }
    }
    // Log the activity
    await prismadb.activitySubmissionLog.create({
      data: {
        submissionId: newSubmission.id,
        userId: Number(session?.user.id),
        activity: `Submission created with title: ${title}`,
      },
    });

    return NextResponse.json({
      message: "Submission berhasil dibuat",
      // submissionId: newSubmission.id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat membuat submission." },
      { status: 500 },
    );
  }
};

// export const POST = async (req: NextRequest) => {
//   try {
//     // Parse FormData from the incoming request
//     const formData = await req.formData();

//     // Get fields from the formData
//     const title = formData.get("title") as string;
//     const description = formData.get("description") as string;
//     const typeId = formData.get("typeId") as string;

//     // Validate the typeId (check if the type exists in the database)
//     const type = await prismadb.type.findUnique({
//       where: { id: BigInt(typeId) },
//     });

//     if (!type) {
//       return NextResponse.json(
//         { message: "Tipe pengajuan tidak ditemukan" },
//         { status: 404 },
//       );
//     }

//     // Create a new submission
//     const newSubmission = await prismadb.submission.create({
//       data: {
//         title,
//         description,
//         userId: Number(1),
//         typeId: BigInt(typeId), // Save typeId in submission
//         status: "pending", // Default status
//       },
//     });
//     console.log(newSubmission);

//     // Handle file uploads (if any)
//     const fileKeys: string[] = [];
//     for (let [key, value] of formData.entries()) {
//       // console.log(file)
//       if (
//         key !== "title" &&
//         key !== "topic" &&
//         key !== "description" &&
//         key !== "typeId"
//       ) {
//         if (value instanceof File) {
//           const fileToUpload = value as File;

//           // Upload the file to S3 and get the file URL
//           const fileUrl = await uploadFileToS3(fileToUpload, BigInt(typeId));

//           const requiredFileId = formData.get(`${key}_id`) as string;

//           // Save the file URL in the SubmissionRequiredFile table
//           const createSubmission = await prismadb.submissionRequiredFile.create({
//             data: {
//               submissionId: newSubmission.id,
//               file_url: fileUrl, // Store the file URL
//               requiredFileId: BigInt(requiredFileId), // Assuming file required ID is provided
//               status: "pending", // Default status for new file
//             },
//           });
//         // const fileToUpload = file[1] as File;
//         // if (fileToUpload) {
//         //   const fileUrl = await uploadFileToS3(fileToUpload, BigInt(typeId));
//         //   const requiredFileId = formData.get(`${fileKey}_id`) as string;
//         //   fileKeys.push(file[0]); // Keep track of the file key

//         //   // Save the file URL in the SubmissionRequiredFile table
//         //   const createSubmission = await prismadb.submissionRequiredFile.create(
//         //     {
//         //       data: {
//         //         submissionId: newSubmission.id,
//         //         file_url: fileUrl, // Store the file URL
//         //         requiredFileId: BigInt(1), // Assuming file required ID is provided (adjust accordingly)
//         //         status: "pending", // Default status for new file
//         //       },
//         //     },
//         //   );
//         //   console.log(createSubmission);
//         // }
//       }
//     }

//     return NextResponse.json({
//       message: "Submission berhasil dibuat",
//       submissionId: newSubmission.id,
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { message: "Terjadi kesalahan saat membuat submission." },
//       { status: 500 },
//     );
//   }
// };
