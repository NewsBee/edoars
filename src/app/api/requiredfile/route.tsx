import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prismadb from "@/lib/prismadb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// CREATE requiredFile, or READ all
export const POST = async (req: Request) => {
  // Pastikan role Admin (opsional, sesuai kebutuhan)
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    // body mis. { name, key, note, formatId, typeId }

    const { name, key, note, formatId } = body;
    console.log(body);
    if (!name || !key || !formatId) {
      return NextResponse.json(
        { message: "Missing required fields: name, key" },
        { status: 400 },
      );
    }

    // Create the requiredFile
    const newFile = await prismadb.requiredFile.create({
      data: {
        name,
        key,
        note: note || "",
        formatId: BigInt(formatId.toString()),
        // typeId: typeId ? BigInt(typeId.toString()) : undefined,
      },
    });

    // const serializedValues = newFile.map((value: any) => ({
    //   ...value,
    //   id: value.id.toString(),
    //   formatId: value.formatId.toString(), // Mengonversi formatId menjadi string
    // }));
    const serializedValue = {
        ...newFile,
        id: newFile.id.toString(),
        formatId: newFile.formatId.toString(),
      };
    console.log(newFile);

    return NextResponse.json(serializedValue, { status: 201 });
  } catch (error: any) {
    console.error("Error creating requiredFile:", error);
    return NextResponse.json(
      { message: "Error creating requiredFile", error: error.message },
      { status: 500 },
    );
  }
};

// GET – optional: to read all requiredFiles if needed
export const GET = async (req: Request) => {
  // Optionally you can check for user session or role
  try {
    const files = await prismadb.requiredFile.findMany({});
    return NextResponse.json(files, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching requiredFiles:", error);
    return NextResponse.json(
      { message: "Error fetching requiredFiles", error: error.message },
      { status: 500 },
    );
  }
};
