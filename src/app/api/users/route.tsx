import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb"; // Prisma client
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

export const POST = async (req: Request) => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const requestData = await req.json();
    const {
      name,
      email,
      password,
      role,
      status,
      phone_number,
      nim,
      nip,
      selectedTypes,
    } = requestData;

    // console.log(name)
    // console.log(email)
    // console.log(password)
    // console.log(role)
    // console.log(status)
    // console.log(phone_number)
    // console.log(nim)
    // console.log(nip)
    const newStatus = status === "Aktif" ? "1" : "0";
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        status: newStatus,
        phone_number: phone_number || null,
        nim: nim || null, // Jika nim kosong, set null
        nip: nip || null, // Jika nip kosong, set null
      },
    });
    console.log(selectedTypes)
    // Menyimpan hak akses untuk mahasiswa
    if (selectedTypes && selectedTypes.length > 0) {
        await Promise.all(
          selectedTypes.map(async (typeId: string) => {
            const typeIdBigInt = BigInt(typeId);  // Convert the string typeId to BigInt
            await prisma.studentTypeAccessPermission.create({
              data: {
                userId: newUser.id,
                typeId: typeIdBigInt,  // Pass BigInt to prisma
              },
            });
          })
        );
      }

    return NextResponse.json(
      { message: "User successfully created", newUser },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Error creating user", error: error.message },
      { status: 500 },
    );
  }
};

export const GET = async (req: Request) => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get query params if any
    const searchParams = new URL(req.url).searchParams;
    const role = searchParams.get("role"); // For filtering user by role

    const users = await prisma.user.findMany({
      where: role ? { role } : undefined, // Filter users by role
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Error fetching users", error: error.message },
      { status: 500 },
    );
  }
};
