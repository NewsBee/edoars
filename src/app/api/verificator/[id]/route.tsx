import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prismadb from "@/lib/prismadb";

// GET Verificator by ID
export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "ID parameter is required" },
        { status: 400 },
      );
    }

    const verificator = await prismadb.verificator.findUnique({
      where: {
        id: BigInt(id),
      },
      include: {
        User: true,
        Submission: true,
      },
    });
    console.log(verificator);
    if (!verificator) {
      return NextResponse.json(
        { message: "Verificator not found" },
        { status: 404 },
      );
    }

    const serializedVerificator = {
      ...verificator,
      id: verificator.id.toString(),
      submissionId: verificator.submissionId?.toString() || null,
      User: {
        ...verificator.User,
      },
      Submission: {
        ...verificator.Submission,
        id: verificator.Submission
          ? verificator.Submission.id.toString()
          : null,
        typeId: verificator.Submission
          ? verificator.Submission.typeId.toString()
          : null,
      },
    };

    return NextResponse.json({ serializedVerificator }, { status: 200 });
  } catch (error) {
    console.error("Error fetching verificator:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};

// PUT (Update) Verificator by ID
export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role === "Mahasiswa") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "ID parameter is required" },
        { status: 400 },
      );
    }

    const existingVerificator = await prismadb.verificator.findFirst({
        where: {
            lecturerId: Number(body.lecturerId),
            submissionId: body.submissionId ? BigInt(body.submissionId) : null,
        },
    });

    if (existingVerificator) {
        return NextResponse.json(
            { message: "Lecturer is already a verificator for this submission" },
            { status: 400 },
        );
    }

    const updatedVerificator = await prismadb.verificator.update({
      where: {
        id: BigInt(id),
      },
      data: {
        // type: body.type,
        // status: body.status,
        lecturerId: Number(body.lecturerId),
        // submissionId: body.submissionId ? BigInt(body.submissionId) : null,
      },
    });
    console.log(updatedVerificator);
    const serializedUpdatedVerificator = {
      ...updatedVerificator,
      id: updatedVerificator.id.toString(),
      submissionId: updatedVerificator.submissionId?.toString() || null,
    };

    return NextResponse.json({ serializedUpdatedVerificator }, { status: 200 });
  } catch (error) {
    console.error("Error updating verificator:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};

// DELETE Verificator by ID
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role === "Mahasiswa") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "ID parameter is required" },
        { status: 400 },
      );
    }

    await prismadb.verificator.delete({
      where: {
        id: BigInt(id),
      },
    });

    return NextResponse.json(
      { message: "Verificator deleted" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting verificator:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};
