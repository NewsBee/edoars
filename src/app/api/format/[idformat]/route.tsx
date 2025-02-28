import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb"; // Prisma Client
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createHash } from "crypto";

export const DELETE = async (
  req: Request,
  { params }: { params: { idformat: string } },
) => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formatId = BigInt(params.idformat); // Get the formatId from the URL parameter

    console.log(formatId);

    // First, check if the format exists
    const existingFormat = await prismadb.format.findUnique({
      where: { id: formatId },
    });

    if (!existingFormat) {
      return NextResponse.json(
        { message: "Format not found" },
        { status: 404 },
      );
    }

    // Delete the format directly
    const deletedFormat = await prismadb.format.delete({
      where: { id: formatId },
    });

    // Convert all BigInt to string before sending in the response
    const serializeBigInt = (obj: any): any => {
      if (typeof obj === "bigint") {
        return obj.toString();
      }
      if (Array.isArray(obj)) {
        return obj.map(serializeBigInt);
      }
      if (obj && typeof obj === "object") {
        const result: any = {};
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            result[key] = serializeBigInt(obj[key]);
          }
        }
        return result;
      }
      return obj;
    };

    const response = {
      message: "Format successfully deleted",
      deletedFormat: serializeBigInt(deletedFormat), // Convert any BigInt fields to string
    };

    // Return success response with all BigInt converted to string
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting format:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
};

export const PUT = async (
  req: Request,
  { params }: { params: { idformat: string } },
) => {
  const session = await getServerSession(authOptions);

  // Ensure that only admins can update the format
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formatId = BigInt(params.idformat); // Get the formatId from the URL parameter

    // Parse request data
    // const requestData = await req.json();

    // const {
    //   name,
    //   typeId,
    //   document_format,
    //   document_format_name,
    //   document_format_size,
    //   is_primary,
    //   is_schedule_required,
    //   give_access_to_mahasiswa,
    //   if_pass_then_give_access_type_id,
    //   requires_pembimbing,
    //   requires_penguji,
    //   requires_skill_group,
    //   requires_academic_advisor,
    //   next_submission_uses_current_verif,
    //   requiredFiles = [],
    //   requiredValues = [],
    // } = requestData;
    // console.log(requestData);
    const formData = await req.formData();

    const name = formData.get("name")?.toString() || "";
    const typeId = formData.get("typeId") || "";
    const document_format_name = formData
      .get("document_format_name")
      ?.toString();
    const document_format_size = formData
      .get("document_format_size")
      ?.toString();
    const is_primary = formData.get("is_primary") === "true";
    const is_schedule_required =
      formData.get("is_schedule_required") === "true";
    const give_access_to_mahasiswa =
      formData.get("give_access_to_mahasiswa") === "true";
    const if_pass_then_give_access_type_id = formData
      .get("if_pass_then_give_access_type_id")
      ?.toString();
    const is_newtitle = formData.get("is_newtitle") === "true";
    const requires_pembimbing = formData.get("requires_pembimbing") === "true";
    const requires_penguji = formData.get("requires_penguji") === "true";
    const requires_skill_group =
      formData.get("requires_skill_group") === "true";
    const requires_academic_advisor =
      formData.get("requires_academic_advisor") === "true";
    const next_submission_uses_current_verif =
      formData.get("next_submission_uses_current_verif") === "true";

    // Validate input
    if (
      !name ||
      typeof is_primary === "undefined" ||
      typeof give_access_to_mahasiswa === "undefined"
    ) {
      return NextResponse.json(
        {
          message:
            "Please provide required fields: Name, Is Primary, and Give Access to Mahasiswa",
        },
        { status: 400 },
      );
    }

    if (!typeId) {
      return NextResponse.json(
        { message: "typeId is required" },
        { status: 400 },
      );
    }

    // Check if format exists
    const existingFormat = await prismadb.format.findUnique({
      where: { id: formatId },
    });

    if (!existingFormat) {
      return NextResponse.json(
        { message: "Format not found" },
        { status: 404 },
      );
    }

    if (if_pass_then_give_access_type_id) {
      if (is_primary) {
        const existingTypeAccess =
          await prismadb.getTypeAccessPermission.findFirst({
            where: {
              formatId: BigInt(formatId.toString()), // Menyesuaikan dengan formatId yang diberikan
            },
          });
        if (existingTypeAccess) {
          // Jika tidak ada, buat entri baru
          await prismadb.getTypeAccessPermission.update({
            where: {
              id: existingTypeAccess.id, // Menentukan entri yang akan diupdate berdasarkan ID yang ditemukan
            },
            data: {
              typeId: BigInt(typeId.toString()), // Update typeId
              accessTypeId: BigInt(if_pass_then_give_access_type_id.toString()), // Update accessTypeId
              formatId: BigInt(formatId.toString()), // Update formatId (meskipun formatId sudah ada, kita tetap update jika perlu)
            },
          });
          console.log("New GetTypeAccessPermission created.");
        }
      } else {
        await prismadb.getTypeAccessPermission.deleteMany({
          where: {
            formatId: BigInt(formatId.toString()), // Ensure it's for the correct typeId
          },
        });
      }
    } else {
      await prismadb.getTypeAccessPermission.deleteMany({
        where: {
          formatId: BigInt(formatId.toString()), // Ensure it's for the correct typeId
        },
      });
    }

    // Ensure that fields like `document_format` are handled correctly if undefined
    //const documentFormat = document_format || null; // Default to null if undefined

    // Convert `typeId` to BigInt (or Integer as needed)
    const typeIdBigInt = BigInt(typeId.toString()); // Convert to BigInt

    if (give_access_to_mahasiswa) {
      if (is_primary) {
        const students = await prismadb.user.findMany({
          where: { role: "Mahasiswa" }, // Only students
        });
        // For each student, create an access entry in student_type_access_permissions
        for (let student of students) {
          await prismadb.studentTypeAccessPermission.upsert({
            where: {
              userId_typeId: {
                userId: student.id,
                typeId: BigInt(typeId.toString()),
              },
            },
            update: {}, // Kosongkan jika tidak ingin mengubah apa pun
            create: {
              userId: student.id,
              typeId: BigInt(typeId.toString()),
            },
          });
        }
      } else {
        await prismadb.studentTypeAccessPermission.deleteMany({
          where: {
            typeId: BigInt(typeId.toString()), // Ensure it's for the correct typeId
          },
        });
      }
    } else if (give_access_to_mahasiswa == false) {
      await prismadb.studentTypeAccessPermission.deleteMany({
        where: {
          typeId: BigInt(typeId.toString()), // Ensure it's for the correct typeId
        },
      });
    }

    // Update the format
    let updatedFormat = await prismadb.format.update({
      where: { id: formatId },
      data: {
        name,
        typeId: typeIdBigInt, // Ensure this is BigInt
        // document_format: documentFormat,
        document_format_name,
        document_format_size: document_format_size || null, // Handle undefined or empty size
        is_primary,
        is_newtitle_submission: is_newtitle,
        is_schedule_required,
        give_access_to_mahasiswa,
        if_pass_then_give_access_type_id: Number(
          if_pass_then_give_access_type_id,
        ),
        requires_pembimbing,
        requires_penguji,
        requires_skill_group,
        requires_academic_advisor,
        next_submission_uses_current_verif,
      },
    });
    console.log(updatedFormat);

    const s3 = new S3Client({
      region: process.env.S3_REGION,
      endpoint: process.env.S3_ENDPOINT_URL,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY ?? "",
        secretAccessKey: process.env.S3_SECRET_KEY ?? "",
      },
    });

    // Function to upload files to S3 & return the URL
    const uploadFileToS3 = async (
      file: File,
      formatId: bigint,
    ): Promise<string> => {
      const arrayBuffer = await file.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);
      // Creating a timestamp for the file
      const timestamp = new Date().toISOString().replace(/[-:T.]/g, ""); // Clean timestamp for filename

      // Combine elements for hashing
      const hashInput = `${formatId}_${timestamp}_${file.name}`;

      const hash = createHash("sha256").update(hashInput).digest("hex");

      // Create a more secure, hashed file name
      const formattedFileName = `${formatId}_${timestamp}_${hash}`;

      // Define the S3 key (file path) with the new formatted name
      const key = `${formatId}/${formattedFileName}`;
      // const key = `${formatId}/${file.name}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key,
          Body: fileBuffer,
          ContentType: file.type,
          ACL: "public-read",
        }),
      );

      const fileUrl = `${process.env.S3_ENDPOINT_URL}/${process.env.S3_BUCKET_NAME}/${key}`;
      return fileUrl;
    };
    let documentFormat: string | null = null;
    const document_format = formData.get("document_format");
    console.log(document_format);
    if (is_primary) {
      const existingPrimary = await prismadb.format.findFirst({
        where: {
          is_primary: true,
          typeId: BigInt(typeId.toString()),
        },
      });
      console.log(existingFormat);
      console.log(existingFormat.id);
      console.log(formatId);

      if (existingPrimary && existingFormat.id != formatId) {
        return NextResponse.json(
          {
            message: "'Ada format lain yang sudah menjadi format utama'",
          },
          { status: 404 },
        );
      }
    }

    if (document_format && document_format instanceof File) {
      documentFormat = await uploadFileToS3(document_format, updatedFormat.id);
    }

    // Update the format with the document format URL
    updatedFormat = await prismadb.format.update({
      where: { id: updatedFormat.id },
      data: {
        document_format: documentFormat,
      },
    });

    // Convert all BigInt to string for the response
    const convertBigIntToString = (obj: unknown): unknown => {
      if (Array.isArray(obj)) {
        return obj.map((item) => convertBigIntToString(item));
      }

      if (typeof obj === "object" && obj !== null) {
        const result: Record<string, unknown> = {};
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const value = (obj as Record<string, unknown>)[key];
            result[key] = convertBigIntToString(value);
          }
        }
        return result;
      }

      if (typeof obj === "bigint") {
        return obj.toString();
      }

      return obj;
    };

    // Convert the data to be returned as response
    const response = {
      updatedFormat: convertBigIntToString(updatedFormat),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("Error updating format:", error);
    return NextResponse.json(
      { message: "Error updating format", error: error.message },
      { status: 500 },
    );
  }
};

export const GET = async (
  req: Request,
  { params }: { params: { idformat: string } },
) => {
  const session = await getServerSession(authOptions);

  // Ensure only admins can view the format details
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formatId = BigInt(params.idformat); // Get the formatId from the URL parameter

    // Fetch the format data by ID
    const format = await prismadb.format.findUnique({
      where: { id: formatId },
      include: {
        requiredFiles: true, // Include the required files related to the format
        requiredValues: true, // Include the required values related to the format
      },
    });

    if (!format) {
      return NextResponse.json(
        { message: "Format not found" },
        { status: 404 },
      );
    }

    // Function to convert BigInt to string for serialization purposes
    // Function to safely convert BigInt to string recursively
    const convertBigIntToString = (obj: unknown): unknown => {
      // Handle arrays by mapping each item through the function
      if (Array.isArray(obj)) {
        return obj.map((item) => convertBigIntToString(item));
      }

      // Handle objects: Check if the input is an object (excluding null)
      if (typeof obj === "object" && obj !== null) {
        const result: Record<string, unknown> = {}; // Use Record for object with string keys

        // Iterate over the keys in the object
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            // Ensure that obj[key] is treated as an any type
            const value = (obj as Record<string, unknown>)[key]; // Cast object to Record<string, unknown>
            result[key] = convertBigIntToString(value); // Recursively convert the value
          }
        }
        return result;
      }

      // Convert BigInt to string
      if (typeof obj === "bigint") {
        return obj.toString();
      }

      return obj; // Return the value as is if it's not BigInt, array, or object
    };

    // Prepare the response by converting BigInt values to strings
    const response = convertBigIntToString(format);

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching format:", error);
    return NextResponse.json(
      { message: "Error fetching format", error: error.message },
      { status: 500 },
    );
  }
};
