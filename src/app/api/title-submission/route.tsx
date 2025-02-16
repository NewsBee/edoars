import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createHash } from "crypto";

export const POST = async (req: Request) => {
  try {
    // 1. Pastikan user sudah login (role: Mahasiswa)
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "Mahasiswa") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Ambil data form (termasuk file) dari request
    const formData = await req.formData();
    const title = formData.get("title")?.toString();
    const topic = formData.get("topic")?.toString() || null;
    const abstract = formData.get("abstract")?.toString() || null;

    // File yang di-upload (bertipe `File` bawaan Web API)
    const lirsFile = formData.get("lirs") as File | null;
    const toeflFile = formData.get("toefl") as File | null;
    const proposalFile = formData.get("proposal") as File | null;

    if (!title || !abstract) {
      return NextResponse.json(
        { message: "Title and Abstract are required" },
        { status: 400 },
      );
    }

    // 3. Cek apakah user sudah punya submission Pending / Approved
    const existingSubmission = await prismadb.titleSubmission.findFirst({
      where: {
        userId: Number(session.user.id),
        OR: [{ status: "Pending" }, { status: "Approved" }],
      },
    });
    if (existingSubmission) {
      return NextResponse.json(
        { message: "You already have an active or pending title submission" },
        { status: 400 },
      );
    }

    // 4. Buat record submission baru (untuk dapatkan ID)
    let newSubmission = await prismadb.titleSubmission.create({
      data: {
        userId: Number(session.user.id),
        title,
        topic,
        abstract,
        status: "Pending",
      },
    });

    console.log(process.env.S3_ENDPOINT_URL);
    console.log(process.env.S3_REGION);
    console.log(process.env.S3_ACCESS_KEY);
    console.log(process.env.S3_SECRET_KEY);
    // 5. Siapkan S3 Client (pakai credentials dari .env)
    const s3 = new S3Client({
      region: process.env.S3_REGION,
      endpoint: process.env.S3_ENDPOINT_URL,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY ?? "",
        secretAccessKey: process.env.S3_SECRET_KEY ?? "",
      },
    });

    // Fungsi bantu untuk upload ke S3 & kembalikan URL final
    const uploadFileToS3 = async (
      file: File,
      submissionId: number,
    ): Promise<string> => {
      // Convert File Web API → Buffer
      const arrayBuffer = await file.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);

      // Buat key: "submissionId/nama-file.pdf"
      const timestamp = new Date().toISOString().replace(/[-:T.]/g, ""); // Clean timestamp for filename

      // Combine elements for hashing
      const hashInput = `${submissionId}_${timestamp}_${file.name}`;
      // const key = `${submissionId}/${file.name}`;

      // Generate SHA-256 hash of the combined input string
      const hash = createHash("sha256").update(hashInput).digest("hex");

      // Create a more secure, hashed file name
      const formattedFileName = `${submissionId}_${timestamp}_${hash}`;
      const key = `${submissionId}/${formattedFileName}`;
      // Kirim ke S3
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key,
          Body: fileBuffer,
          ContentType: file.type, // misal "application/pdf"
          ACL: "public-read", // jika ingin file dapat diakses publik
        }),
      );

      // Bangun URL final (AWS default style):
      // "https://{BUCKET}.s3.{REGION}.amazonaws.com/submissionId/fileName"
      // atau jika S3-compatible, sesuaikan pola domainnya
      const bucketName = process.env.S3_BUCKET_NAME;
      const region = process.env.S3_REGION;
      // Jika AWS standar:
      // const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

      // Jika pakai endpoint custom (S3-compatible, dll.):
      // misal: "https://nyc3.digitaloceanspaces.com"
      //  => "https://my-bucket.nyc3.digitaloceanspaces.com/submissionId/..."
      // Tergantung kebijakan naming bucket & endpoint

      // Contoh generik (kalau endpoint = https://something):
      const endpointUrl = process.env.S3_ENDPOINT_URL || "";
      // Pastikan domain/host mengarah ke bucket, atau ke {bucketName}.{host}, dsb.

      // Sederhana: "https://my-bucket.s3.amazonaws.com/ submissionId/namaFile"
      const fileUrl = `${endpointUrl.replace(/\/+$/, "")}/${bucketName}/${key}`;

      return fileUrl;
    };

    // 6. Upload file ke S3 (jika file memang ada)
    let lirsUrl: string | null = null;
    let toeflUrl: string | null = null;
    let proposalUrl: string | null = null;

    if (lirsFile) {
      lirsUrl = await uploadFileToS3(lirsFile, newSubmission.id);
    }
    if (toeflFile) {
      toeflUrl = await uploadFileToS3(toeflFile, newSubmission.id);
    }
    if (proposalFile) {
      proposalUrl = await uploadFileToS3(proposalFile, newSubmission.id);
    }

    // 7. Update submission dengan URL file yang di‐upload
    newSubmission = await prismadb.titleSubmission.update({
      where: { id: newSubmission.id },
      data: {
        lirs: lirsUrl,
        toefl: toeflUrl,
        proposal: proposalUrl,
      },
    });

    // 8. Log aktivitas
    await prismadb.activitySubmissionLog.create({
      data: {
        titleSubmissionId: newSubmission.id,
        userId: Number(session.user.id),
        activity: "Pengajuan judul baru dibuat & file diupload ke S3.",
      },
    });

    // 9. Kembalikan respons
    return NextResponse.json(
      {
        message: "Title submission created and files uploaded to S3",
        submission: newSubmission,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating title submission:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};

// export const POST = async (req: Request) => {
//   try {
//     const session = await getServerSession(authOptions);

//     // Pastikan user sudah login dan role-nya Mahasiswa
//     if (!session || session.user.role !== "Mahasiswa") {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const formData = await req.formData();
//     const title = formData.get("title")?.toString();
//     const topic = formData.get("topic")?.toString() || null;
//     const abstract = formData.get("abstract")?.toString();
//     const lirsFile = formData.get("lirs") as File | null;
//     const toeflFile = formData.get("toefl") as File | null;
//     const proposalFile = formData.get("proposal") as File | null;

//     if (!title || !abstract) {
//       return NextResponse.json(
//         { message: "Title and Abstract are required" },
//         { status: 400 }
//       );
//     }

//     // Cek apakah mahasiswa sudah memiliki pengajuan aktif
//     const existingSubmission = await prismadb.titleSubmission.findFirst({
//       where: {
//         userId: Number(session.user.id),
//         OR: [{ status: "Pending" }, { status: "Approved" }],
//       },
//     });

//     if (existingSubmission) {
//       return NextResponse.json(
//         { message: "You already have an active or pending title submission" },
//         { status: 400 }
//       );
//     }

//     const generateUrl = (filename: string) =>
//       `https://dummy.storage/${submission.id}/${filename}`;
//     // Simpan data pengajuan ke database
//     const submission = await prismadb.titleSubmission.create({
//       data: {
//         userId: Number(session.user.id),
//         title,
//         topic,
//         abstract,
//         status: "Pending",
//         //lirs= url
//         //toefl= url
//         //proposal= url
//       },
//     });

//     // Log aktivitas pengajuan
//     await prismadb.activitySubmissionLog.create({
//       data: {
//         titleSubmissionId: submission.id,
//         userId: Number(session.user.id),
//         activity: "Pengajuan judul baru dibuat.",
//       },
//     });

//     const s3 = new S3Client({
//       region: process.env.S3_REGION,
//       endpoint: process.env.S3_ENDPOINT_URL,
//       credentials: {
//         accessKeyId: process.env.S3_ACCESS_KEY ?? "",
//         secretAccessKey: process.env.S3_SECRET_KEY ?? "",
//       },
//     });
//     // Fungsi bantu untuk upload ke S3 & kembalikan URL final
//     async function uploadFileToS3(file: File, submissionId: number) {
//       // Convert File Web API → Buffer
//       const arrayBuffer = await file.arrayBuffer();
//       const fileBuffer = Buffer.from(arrayBuffer);

//       // Buat key: "submissionId/nama-file.pdf"
//       const key = `${submissionId}/${file.name}`;

//       // Kirim ke S3
//       await s3.send(
//         new PutObjectCommand({
//           Bucket: process.env.S3_BUCKET_NAME,
//           Key: key,
//           Body: fileBuffer,
//           ContentType: file.type, // misal "application/pdf"
//           ACL: "public-read",     // jika ingin file dapat diakses publik
//         }),
//       );

//       // Bangun URL final (AWS default style):
//       // "https://{BUCKET}.s3.{REGION}.amazonaws.com/submissionId/fileName"
//       // atau jika S3-compatible, sesuaikan pola domainnya
//       const bucketName = process.env.S3_BUCKET_NAME;
//       const region = process.env.S3_REGION;
//       // Jika AWS standar:
//       // const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

//       // Jika pakai endpoint custom (S3-compatible, dll.):
//       // misal: "https://nyc3.digitaloceanspaces.com"
//       //  => "https://my-bucket.nyc3.digitaloceanspaces.com/submissionId/..."
//       // Tergantung kebijakan naming bucket & endpoint

//       // Contoh generik (kalau endpoint = https://something):
//       const endpointUrl = process.env.S3_ENDPOINT_URL || "";
//       // Pastikan domain/host mengarah ke bucket, atau ke {bucketName}.{host}, dsb.

//       // Sederhana: "https://my-bucket.s3.amazonaws.com/ submissionId/namaFile"
//       const fileUrl = `${endpointUrl.replace(/\/+$/, "")}/${bucketName}/${key}`;

//       return fileUrl;
//     }

//     return NextResponse.json(
//       { message: "Title submission created successfully", submission },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating title submission:", error);
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//   }
// };

export const GET = async () => {
  try {
    // Dapatkan session pengguna
    const session = await getServerSession(authOptions);

    // Validasi peran pengguna
    if (!session || !["Admin", "Kaprodi"].includes(session.user.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Ambil semua pengajuan judul
    const submissions = await prismadb.titleSubmission.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        assignedLecturers: {
          include: {
            User: true, // Ambil detail dosen dari tabel User
          },
        },
        User: true, // Ambil detail mahasiswa
      },
    });

    // Format data agar lebih mudah digunakan
    const formattedSubmissions = submissions.map((submission) => ({
      id: submission.id,
      user: {
        id: submission.User.id,
        name: submission.User.name,
        email: submission.User.email,
        nim: submission.User.nim,
      },
      title: submission.title,
      topic: submission.topic,
      abstract: submission.abstract,
      status: submission.status,
      reason: submission.reason,
      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt,
      lecturers: submission.assignedLecturers.map((lecturer) => ({
        id: lecturer.User.id,
        name: lecturer.User.name,
        email: lecturer.User.email,
        role: lecturer.role, // Pembimbing 1 atau Pembimbing 2
      })),
    }));

    console.log(formattedSubmissions);

    return NextResponse.json(
      { submissions: formattedSubmissions },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching all title submissions:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};
