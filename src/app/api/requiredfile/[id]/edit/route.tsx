import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prismadb from "@/lib/prismadb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { uploadFileToS3 } from "@/lib/s3Utils";

// EDIT requiredFile
export const PUT = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
  const session = await getServerSession(authOptions);
  if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  console.log(id);

  try {
    // Parse FormData from the incoming request
    const formData = await req.formData();

    const file = formData.get("file") as File;
    console.log(file);
    if (file) {
      // Upload the file to S3 and get the file URL
      const fileUrl = await uploadFileToS3(file, BigInt(id), "required_files");
      console.log(fileUrl)

      // Update the required file in the database
      const updatedFile = await prismadb.submissionRequiredFile.update({
        where: { id: Number(id) },
        data: {
          file_url: fileUrl, // Store the file URL
          status: "pending", // Default status for new file
        },
      });
      console.log(updatedFile);

    const serializedFile = {
      ...updatedFile,
      createdAt: updatedFile.createdAt.toISOString(),
      updatedAt: updatedFile.updatedAt.toISOString(),
      submissionId: updatedFile.submissionId?.toString() || "",
      requiredFileId: updatedFile.requiredFileId.toString(),
    };
      console.log(serializedFile);

      return NextResponse.json(serializedFile, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "File is required" },
        { status: 400 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating file" },
      { status: 500 },
    );
  }
};
