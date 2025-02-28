import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prismadb from "@/lib/prismadb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// UPDATE requiredValue
export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const valueId = BigInt(params.id);
    const body = await req.json();
    // { name, key, note, formatId }

    const { name, key, note, formatId, bobot } = body;
    console.log(body)
    console.log(valueId)
    
    const existingValue = await prismadb.requiredValue.findUnique({
        where: { id: valueId },
    });
    console.log(existingValue)
    if (!existingValue) {
      return NextResponse.json({ message: "RequiredValue not found" }, { status: 404 });
    }

    const updatedValue = await prismadb.requiredValue.update({
      where: { id: valueId },
      data: {
        name: name || existingValue.name,
        key: key || existingValue.key,
        note: note || existingValue.note,
        bobot: bobot || existingValue.bobot,
        formatId: formatId ? BigInt(formatId) : existingValue.formatId,
      },
    });

    const serializedValue = {
        ...updatedValue,
        id: updatedValue.id.toString(),
        formatId: updatedValue.formatId.toString(),
      };

    return NextResponse.json(serializedValue, { status: 200 });
  } catch (error: any) {
    console.error("Error updating requiredValue:", error);
    return NextResponse.json(
      { message: "Error updating requiredValue", error: error.message },
      { status: 500 }
    );
  }
};

// DELETE requiredValue
export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const valueId = BigInt(params.id);

    const existingValue = await prismadb.requiredValue.findUnique({
      where: { id: valueId },
    });
    if (!existingValue) {
      return NextResponse.json({ message: "RequiredValue not found" }, { status: 404 });
    }

    await prismadb.requiredValue.delete({
      where: { id: valueId },
    });

    return NextResponse.json({ message: "RequiredValue deleted" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting requiredValue:", error);
    return NextResponse.json(
      { message: "Error deleting requiredValue", error: error.message },
      { status: 500 }
    );
  }
};


export const GET = async (req: Request, { params }: { params: { id: string } }) => {
    try {
      const values = await prismadb.requiredValue.findMany({
        where: {
            formatId : BigInt(params.id.toString())
        }
      });
      const serializedValues = values.map((value) => ({
        ...value,
        id: value.id.toString(),
        formatId: value.formatId.toString(), // Mengonversi formatId menjadi string
      }));
      console.log(serializedValues)
      return NextResponse.json(serializedValues, { status: 200 });
    } catch (error: any) {
      console.error("Error fetching requiredValues:", error);
      return NextResponse.json(
        { message: "Error fetching requiredValues", error: error.message },
        { status: 500 }
      );
    }
  };
  