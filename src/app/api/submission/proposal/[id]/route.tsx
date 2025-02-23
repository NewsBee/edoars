// import prismadb from "@/lib/prismadb";
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export const GET = async (req: Request, { params }: { params: { id: string } }) => {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || session.user.role !== "Mahasiswa") {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const userId = Number(params.id);

//     // Fetch submission with title and required fields
//     const submission = await prismadb.submission.findFirst({
//       where: {
//         userId: userId,
//         Type: { slug: "proposal" },
//       },
//       include: {
//         AssignedLecturers: {
//           include: {
//             User: true,
//           },
//         },
//         RequiredFiles: {
//           include: {
//             RequiredFile: true,
//           },
//         },
//       },
//     });

//     if (!submission) {
//       return NextResponse.json({ message: "Submission not found" }, { status: 404 });
//     }

//     // Extract Pembimbing and Penguji data
//     const pembimbing = submission.AssignedLecturers.filter(
//       (lecturer) => lecturer.role.includes("Pembimbing")
//     ).map((lecturer) => ({
//       name: lecturer.User.name,
//       role: lecturer.role,
//     }));

//     const penguji = submission.AssignedLecturers.filter(
//       (lecturer) => lecturer.role.includes("Penguji")
//     ).map((lecturer) => ({
//       name: lecturer.User.name,
//       role: lecturer.role,
//     }));

//     // Extract Required Files
//     const files = submission.RequiredFiles.map((file) => ({
//       file_name: file.RequiredFile?.file_name || "Unknown file",
//       status: file.status || "Pending",
//       file_url: file.file_url || null,
//     }));

//     return NextResponse.json(
//       {
//         message: "Submission data retrieved successfully",
//         data: {
//           id: submission.id,
//           title: submission.title,
//           skripsi_title: submission.TitleSubmission?.title || "Judul belum ditentukan",
//           status: submission.status,
//           pembimbing,
//           penguji,
//           jadwal_sidang: submission.jadwal ? submission.jadwal.toISOString() : null,
//           files,
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       console.error("Error fetching submission:", error.message);
//       return NextResponse.json(
//         { message: "Internal server error", error: error.message },
//         { status: 500 }
//       );
//     } else {
//       console.error("Unknown error:", error);
//       return NextResponse.json(
//         { message: "Internal server error", error: "Unknown error" },
//         { status: 500 }
//       );
//     }
//   }
// };
