// API untuk mendapatkan tipe yang dapat diakses oleh mahasiswa
import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  try {
    const userId = parseInt(session.user.id);
    // Ambil tipe yang dapat diakses oleh mahasiswa
    const accessibleTypes = await prismadb.studentTypeAccessPermission.findMany(
      {
        where: {
          userId: userId, // Filter berdasarkan mahasiswa
        },
        include: {
          Type: true, // Ambil data tipe pengajuan yang relevan
        },
      },
    );

    // Convert BigInt values to string before sending in the response
    const accessibleTypesSerialized = accessibleTypes.map((item) => ({
      ...item,
      Type: {
        ...item.Type,
        id: item.Type.id.toString(), // Convert BigInt to string for `id`
      },
      typeId: item.typeId.toString(), // Convert BigInt to string for `typeId`
    }));

    console.log(accessibleTypesSerialized)

    // Return daftar tipe pengajuan yang dapat diakses oleh mahasiswa
    return NextResponse.json(
      { accessibleTypes: accessibleTypesSerialized },
      { status: 200 },
    );
    // return NextResponse.json({ accessibleTypes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching accessible types:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};
