// lib/acl.ts
import prisma from "@/lib/prismadb";

export async function isVerificatorOfStudent(lecturerUserId: number, studentUserId: number) {
  // Cari baris Verificator yang dosennya = lecturerUserId DAN
  // terhubung ke TitleSubmission / Submission milik studentUserId
  const ver = await prisma.verificator.findFirst({
    where: {
      lecturerId: lecturerUserId,
      OR: [
        { titleSubmissionId: { not: null }, TitleSubmission: { userId: studentUserId } },
        { submissionId:      { not: null }, Submission:      { userId: studentUserId } },
      ],
      // opsional: filter status aktif tertentu jika kamu punya konsep "aktif"
    },
    select: { id: true },
  });
  return !!ver;
}
