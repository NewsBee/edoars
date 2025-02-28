import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import prismadb from "@/lib/prismadb";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const { verificatorId, values } = await req.json();

    if (!id || !verificatorId || !values) {
      return NextResponse.json(
        { message: "Submission ID, Verificator ID, and values are required" },
        { status: 400 },
      );
    }
    console.log(values);
    console.log(verificatorId);
    const verificator = await prismadb.verificator.findUnique({
      where: {
        id: verificatorId,
      },
    });
    console.log(verificator);

    if (!verificator) {
      throw new Error(`Verificator with ID ${verificatorId} does not exist.`);
    }
    let totalScore = 0;
    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const [requiredValueId, value] of Object.entries(values)) {
      if (requiredValueId === "verificatorNote") {
        continue;
      }
      console.log(requiredValueId, value);
      const requiredValue = await prismadb.requiredValue.findUnique({
        where: {
          id: BigInt(requiredValueId),
        },
      });
      const weight = requiredValue?.bobot;
      const parsedValue = typeof value === "string" ? parseFloat(value) : 0;
      const weightValue = weight ?? 0;
      totalScore += parsedValue;
      totalWeightedScore += parsedValue * weightValue;
      totalWeight += weightValue;
      const submissionValue = await prismadb.submissionRequiredValue.create({
        data: {
          value: String(value),
          requiredValueId: BigInt(requiredValueId),
          verificatorId: BigInt(verificatorId),
          submissionId: BigInt(id),
        },
      });
      console.log(submissionValue);
    }

    let averageScore = totalWeightedScore / totalWeight;

    // if (verificator.type === "Pembimbing") {
    //   averageScore *= 0.35;
    // } else if (verificator.type === "Penguji") {
    //   averageScore *= 0.15;
    // }
    await prismadb.verificator.update({
      where: {
        id: verificatorId,
      },
      data: {
        totalScore: totalScore,
        averageScore: averageScore,
      },
    });

    const submission = await prismadb.submission.findUnique({
      where: {
        id: BigInt(id),
      },
    });

    if (!submission) {
      throw new Error(`Submission with ID ${id} does not exist.`);
    }
    let currentScore = parseFloat(submission.score ?? "0");

    let finalScore = averageScore;
    if (verificator.type === "Pembimbing") {
      finalScore *= 0.35;
    } else if (verificator.type === "Penguji") {
      finalScore *= 0.15;
    }
    finalScore += currentScore;

    await prismadb.submission.update({
      where: {
        id: BigInt(id),
      },
      data: {
        score: String(finalScore),
      },
    });

    const verificatorNote = values.verificatorNote;
    if (verificatorNote) {
      // Save the verificatorNote to the database or handle it as needed
      await prismadb.verificator.update({
        where: {
          id: verificatorId,
        },
        data: {
          note: verificatorNote,
        },
      });
      console.log("Verificator Note:", verificatorNote);
    }

    return NextResponse.json(
      { message: "Penilaian berhasil disimpan" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error saving penilaian:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
