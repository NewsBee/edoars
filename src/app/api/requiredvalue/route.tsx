import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prismadb from "@/lib/prismadb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// CREATE requiredValue
export const POST = async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    // { name, key, note, formatId }

    const { name, key, note, formatId } = body;
    if (!name || !key) {
      return NextResponse.json(
        { message: "Missing required fields: name, key" },
        { status: 400 }
      );
    }

    const newFile = await prismadb.requiredValue.create({
        data: {
          name,
          key,
          note: note || "",
          formatId: BigInt(formatId.toString()),
          // typeId: typeId ? BigInt(typeId.toString()) : undefined,
        },
      });

      const serializedValue = {
          ...newFile,
          id: newFile.id.toString(),
          formatId: newFile.formatId.toString(),
        };

    return NextResponse.json(serializedValue, { status: 201 });
  } catch (error: any) {
    console.error("Error creating requiredValue:", error);
    return NextResponse.json(
      { message: "Error creating requiredValue", error: error.message },
      { status: 500 }
    );
  }
};

// GET (read all) if needed
export const GET = async () => {
  try {
    const values = await prismadb.requiredValue.findMany({});
    return NextResponse.json(values, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching requiredValues:", error);
    return NextResponse.json(
      { message: "Error fetching requiredValues", error: error.message },
      { status: 500 }
    );
  }
};
