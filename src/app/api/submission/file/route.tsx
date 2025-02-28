import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prismadb from "@/lib/prismadb";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createHash } from "crypto";
import { uploadFileToS3 } from "@/lib/s3Utils";


export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Parse FormData from the incoming request
    const formData = await req.formData();

    // Get fields from the formData
    const submissionId = formData.get("submissionId") as string;
    const requiredFileId = formData.get("requiredFileId") as string;

    if (!submissionId || !requiredFileId) {
      return NextResponse.json(
        { message: "submissionId and requiredFileId are required" },
        { status: 400 },
      );
    }

    // Handle file uploads
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "File is required" },
        { status: 400 },
      );
    }

    // Upload the file to S3 and get the file URL
    const fileUrl = await uploadFileToS3(file, BigInt(submissionId));

    // Save the file URL in the SubmissionRequiredFile table
    const createSubmissionFile = await prismadb.submissionRequiredFile.create({
      data: {
        submissionId: BigInt(submissionId),
        file_url: fileUrl, // Store the file URL
        requiredFileId: BigInt(requiredFileId), // Assuming file required ID is provided
        status: "pending", // Default status for new file
      },
    });
    console.log(createSubmissionFile);
    // Serialize the response data
    const serializedData = {
      ...createSubmissionFile,
      submissionId: createSubmissionFile.submissionId ? createSubmissionFile.submissionId.toString() : "",
      requiredFileId: createSubmissionFile.requiredFileId.toString(),
    };
    return NextResponse.json({
      message: "File uploaded successfully",
      submissionFile: serializedData,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error uploading file" },
      { status: 500 },
    );
  }
};