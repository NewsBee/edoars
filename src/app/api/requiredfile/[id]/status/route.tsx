import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prismadb from "@/lib/prismadb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// UPDATE requiredFile
export const PUT = async (
    req: Request,
    { params }: { params: { id: string } },
) => {
    console.log(params.id)
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "Admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    if (!status || (status !== "approved" && status !== "rejected")) {
        return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    try {
        const updatedFile = await prismadb.submissionRequiredFile.update({
            where: { id: Number(id) },
            data: { status },
        });
        console.log(updatedFile)
        const serializedFile = {
            ...updatedFile,
            submissionId: updatedFile.submissionId ? updatedFile.submissionId.toString() : null,
            requiredFileId: updatedFile.requiredFileId.toString(),
            createdAt: updatedFile.createdAt.toISOString(),
            updatedAt: updatedFile.updatedAt.toISOString(),
        };

        return NextResponse.json(serializedFile, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error updating status" }, { status: 500 });
    }
};