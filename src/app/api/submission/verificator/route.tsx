import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import prismadb from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  try {
    // Mendapatkan sesi pengguna yang sedang login
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    console.log(11);

    // Ambil semua submission yang dimiliki oleh mahasiswa yang sedang login
    const submissions = await prismadb.submission.findMany({
        where: {
          userId: Number(session.user.id) , // Mengambil submission berdasarkan userId dari sesi
        },
        include: {
          Verificator: {
            include: {
              User: true, // Menyertakan data User yang menjadi Verificator
            },
          },
        },
      });
      

    if (submissions.length === 0) {
      return NextResponse.json(
        { message: "No submissions found for this user" },
        { status: 404 },
      );
    }

    // Ambil semua Verificators terkait dengan submissions
    const verificators = submissions.flatMap(
      (submission) => submission.Verificator,
    );
    console.log(verificators);
    const serializedVerif = verificators.map((verifier) => ({
      ...verifier,
      id: verifier.id.toString(), // Mengubah BigInt ke string
      submissionId: verifier.submissionId
        ? verifier.submissionId.toString()
        : null, // Mengubah BigInt ke string
    }));

    if (verificators.length === 0) {
      return NextResponse.json(
        { message: "No verificators found for this user's submissions" },
        { status: 404 },
      );
    }

    return NextResponse.json(serializedVerif, { status: 200 }); // Mengembalikan daftar Verificator
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
