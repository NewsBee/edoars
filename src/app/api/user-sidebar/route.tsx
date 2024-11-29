import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prismadb from "@/lib/prismadb";

export const GET = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prismadb.user.findUnique({
    where: { id: Number(session.user.id) },
    include: {
      TitleSubmission: {
        where: { status: "Approved" },
      },
    },
  });

  const role = session.user.role || "Mahasiswa";
  const hasTitle = (user?.TitleSubmission?.length || 0) > 0;

  return NextResponse.json({ role, hasTitle });
};
