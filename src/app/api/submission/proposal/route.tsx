// import { NextResponse } from "next/server";
// import prismadb from "@/lib/prismadb";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export const GET = async () => {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || session.user.role !== "Mahasiswa") {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     // Ambil pengajuan aktif mahasiswa dari tabel `submission`
//     const submission = await prismadb.submission.findFirst({
//       where: { userId: session.user.id },
//       include: {
//         User: true, // Detail mahasiswa
//         assignedLecturers: {
//           include: { User: true }, // Detail dosen pembimbing/penguji
//         },
//         requiredFiles: {
//           include: { RequiredFile: true }, // Detail file yang diunggah
//         },
//       },
//     });

//     if (!submission) {
//       return NextResponse.json(
//         { message: "No active submission found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       id: submission.id,
//       title: submission.title,
//       topic: submission.topic,
//       abstract: submission.description,
//       status: submission.status,
//       schedule: {
//         date: submission.jadwal || null,
//         room: submission.room || "Belum Ditentukan",
//       },
//       lecturers: submission.assignedLecturers.map((lecturer) => ({
//         id: lecturer.id,
//         role: lecturer.role,
//         name: lecturer.User.name || "Nama Dosen",
//         email: lecturer.User.email || "Email Dosen",
//         status: lecturer.status || "Pending",
//       })),
//       files: submission.requiredFiles.map((file) => ({
//         id: file.id,
//         fileType: file.RequiredFile.file_name,
//         fileUrl: file.file_url,
//         status: file.status,
//       })),
//     });
//   } catch (error) {
//     console.error("Error fetching submission:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// };
