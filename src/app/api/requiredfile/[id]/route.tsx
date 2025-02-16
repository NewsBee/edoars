import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prismadb from "@/lib/prismadb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// UPDATE requiredFile
export const PUT = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const fileId = BigInt(params.id);
    const body = await req.json();
    // body mis. { name, key, note, formatId, typeId }

    const { name, key, note, formatId } = body;
    console.log(body)
    
    const existingFile = await prismadb.requiredFile.findUnique({
        where: { id: fileId },
    });
    console.log(existingFile)
    if (!existingFile) {
      return NextResponse.json(
        { message: "RequiredFile not found" },
        { status: 404 },
      );
    }

    const updatedFile = await prismadb.requiredFile.update({
      where: { id: fileId },
      data: {
        name: name || existingFile.name,
        key: key || existingFile.key,
        note: note || existingFile.note,
        formatId:  formatId ? BigInt(formatId.toString()) : existingFile.formatId,
      },
    });

    const serializedValue = {
        ...updatedFile,
        id: updatedFile.id.toString(),
        formatId: updatedFile.formatId.toString(),
      };

    return NextResponse.json(serializedValue, { status: 200 });
  } catch (error: any) {
    console.error("Error updating requiredFile:", error);
    return NextResponse.json(
      { message: "Error updating requiredFile", error: error.message },
      { status: 500 },
    );
  }
};

// DELETE requiredFile
export const DELETE = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const fileId = BigInt(params.id);

    const existingFile = await prismadb.requiredFile.findUnique({
      where: { id: fileId },
    });
    if (!existingFile) {
      return NextResponse.json(
        { message: "RequiredFile not found" },
        { status: 404 },
      );
    }

    await prismadb.requiredFile.delete({
      where: { id: fileId },
    });

    return NextResponse.json(
      { message: "RequiredFile deleted" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error deleting requiredFile:", error);
    return NextResponse.json(
      { message: "Error deleting requiredFile", error: error.message },
      { status: 500 },
    );
  }
};

export const GET = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
  console.log(params.id);
  try {
    const values = await prismadb.requiredFile.findMany({
      where: {
        formatId: BigInt(params.id.toString()),
      },
    });
    console.log(values)
    // console.log(values);
    // Mengonversi hasilnya sebelum mengembalikan respons
    const serializedValues = values.map((value) => ({
      ...value,
      id: value.id.toString(),
      formatId: value.formatId.toString(), // Mengonversi formatId menjadi string
    }));
    return NextResponse.json(serializedValues, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching requiredValues:", error);
    return NextResponse.json(
      { message: "Error fetching requiredValues", error: error.message },
      { status: 500 },
    );
  }
};
