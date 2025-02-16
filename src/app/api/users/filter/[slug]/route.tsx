import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb"; // Prisma client
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export const GET = async (req: Request, { params }: { params: { slug: string } }) => {
//     const session = await getServerSession(authOptions);

//     if (!session || session.user.role !== "Admin") {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }
//     console.log("HALO")

//     try {
//       const role = params.slug; // Mengambil slug dari params dan menggunakannya sebagai role filter

//       const users = await prisma.user.findMany({
//         where: role ? { role } : undefined, // Filter users by role (slug)
//       });

//       return NextResponse.json({ users }, { status: 200 });
//     } catch (error: any) {
//       console.error("Error fetching users:", error);
//       return NextResponse.json(
//         { message: "Error fetching users", error: error.message },
//         { status: 500 }
//       );
//     }
//   };

// /api/users/[slug].ts
export const GET = async (
  req: Request,
  { params }: { params: { slug: string } },
) => {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const role = params.slug;

    // Pastikan role yang diminta valid
    if (!role) {
      return new NextResponse("Role is required", { status: 400 });
    }

    const users = await prisma.user.findMany({
      where: { role }, // Filter users by role
    });

    return NextResponse.json({ users }); // Mengembalikan data dalam format JSON
  } catch (error) {
    console.error("Error fetching users:", error);
    return new NextResponse("Failed to fetch users", { status: 500 });
  }
};
