import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import prismadb from "@/lib/prismadb";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const POST = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  const { requestJadwal,isReadyToBeProcessed } = await req.json();
  console.log("saas")

  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  if (!isReadyToBeProcessed) {
    return new Response(
      JSON.stringify({ error: "Data ini harus diisi" }),
      { status: 400 },
    );
  }
  console.log(isReadyToBeProcessed)

  try {
    const updateData: any = { isReadyToBeProcessed: isReadyToBeProcessed };
    console.log(updateData)
    if (requestJadwal) {
      updateData.requestJadwal = new Date(requestJadwal);
    }

    const submission = await prismadb.submission.update({
      where: {
        id: BigInt(id),
        userId: Number(session.user.id),
      },
      data: updateData,
    });
    console.log(submission);
    const serializedSubmission = {
        ...submission,
        id: submission.id.toString(),
        typeId: submission.typeId.toString(),
        userId: submission.userId.toString(),
    };

    return new Response(JSON.stringify(serializedSubmission), { status: 200 });
  } catch (error) {
    console.error("Error updating submission:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};
