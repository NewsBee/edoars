import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb"; // Prisma Client
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createHash } from "crypto";
import { uploadFileToS3 } from "@/lib/s3Utils";

export const GET = async (
  req: Request,
  { params }: { params: { idtipe: string } },
) => {
  const session = await getServerSession(authOptions);

  // Pastikan hanya Admin yang bisa mengakses data format
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Ambil typeId dari parameter
    const typeId = Number(params.idtipe);

    // Query ke tabel Format berdasarkan typeId
    const formats = await prismadb.format.findMany({
      where: {
        typeId: typeId,
      },
      select: {
        id: true, // Ambil ID format
        name: true, // Ambil nama format
        is_primary: true, // Ambil status apakah format utama
        createdAt: true, // Ambil tanggal dibuatnya
      },
      orderBy: {
        createdAt: "asc", // Urutkan berdasarkan tanggal dibuatnya secara ascending
      },
    });

    // Jika data format tidak ditemukan
    if (!formats || formats.length === 0) {
      return NextResponse.json(
        { message: "Tidak ada data format yang ditemukan untuk tipe ini" },
        { status: 404 },
      );
    }

    // Fungsi untuk mengonversi BigInt menjadi string
    // Function to safely convert BigInt to string recursively
    const convertBigIntToString = (obj: unknown): unknown => {
      // Handle arrays by mapping each item through the function
      if (Array.isArray(obj)) {
        return obj.map((item) => convertBigIntToString(item)); // Return an array of Record<string, unknown>
      }

      // Handle objects: Check if the input is an object (excluding null)
      if (typeof obj === "object" && obj !== null) {
        const result: Record<string, unknown> = {}; // Use Record for object with string keys

        // Iterate over the keys in the object
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            // Safely access the property of the object using 'key'
            const value = obj[key as keyof typeof obj]; // Use 'keyof' to ensure proper indexing
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

    // Konversi BigInt menjadi string sebelum mengembalikan response
    const response = {
      formats: formats.map((format) => convertBigIntToString(format)),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching formats:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
};

export const POST = async (req: Request) => {
  const session = await getServerSession(authOptions);

  // Ensure that only admins can create formats
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Parsing body request as FormData
    const formData = await req.formData();

    const name = formData.get("name")?.toString() || "";
    const typeId = formData.get("typeId");
    const document_format_name = formData
      .get("document_format_name")
      ?.toString();
    const document_format_size = formData
      .get("document_format_size")
      ?.toString();
    const is_primary = formData.get("is_primary") === "true";
    const is_schedule_required =
      formData.get("is_schedule_required") === "true";
    const is_newtitle = formData.get("is_newtitle") === "true";
    const give_access_to_mahasiswa =
      formData.get("give_access_to_mahasiswa") === "true";
    const if_pass_then_give_access_type_id = formData
      .get("if_pass_then_give_access_type_id")
      ?.toString();
    const requires_pembimbing = formData.get("requires_pembimbing") === "true";
    const requires_penguji = formData.get("requires_penguji") === "true";
    const requires_skill_group =
      formData.get("requires_skill_group") === "true";
    const requires_academic_advisor =
      formData.get("requires_academic_advisor") === "true";
    const next_submission_uses_current_verif =
      formData.get("next_submission_uses_current_verif") === "true";

    // Logging the FormData object (checking if it contains the values)
    console.log(formData);
    console.log(name);
    console.log(typeId);
    console.log(requires_skill_group);
    // Handling required files and values
    const requiredFiles: any[] = [];
    const requiredValues: any[] = [];

    console.log(requiredFiles);

    if (!typeId) {
      return NextResponse.json(
        { message: "typeId is required" },
        { status: 400 },
      );
    }

    // Validasi: Memastikan `name`, `is_primary`, dan `give_access_to_mahasiswa` tidak kosong
    // typeof give_access_to_mahasiswa === "undefined" ||
    if (!name || typeof is_primary === "undefined") {
      return NextResponse.json(
        {
          message:
            "Please provide required fields: Name, Is Primary, and Give Access to Mahasiswa",
        },
        { status: 400 },
      );
    }

    // File handling for required files
    const fileColumns = formData.getAll("requiredFiles[]"); // This will give you all file columns if they exist
    fileColumns.forEach((column: any) => {
      const parsedColumn = JSON.parse(column); // Parse the JSON string into an object
      const { name, key, note } = parsedColumn;
      requiredFiles.push({
        name,
        key,
        note,
      });
    });
    console.log(fileColumns);

    // Handling required values
    const ratingColumns = formData.getAll("requiredValues[]"); // Similarly for rating columns
    ratingColumns.forEach((column: any) => {
      const parsedColumn = JSON.parse(column); // Parse the JSON string into an object
      const { name, key, note, weight } = parsedColumn;
      requiredValues.push({
        name,
        key,
        note,
        weight,
      });
    });
    console.log(ratingColumns);

    // Validating required fields
    // if (
    //   !name ||
    //   typeof is_primary === "undefined" ||
    //   typeof give_access_to_mahasiswa === "undefined"
    // ) {
    //   return NextResponse.json(
    //     {
    //       message:
    //         "Please provide required fields: Name, Is Primary, and Give Access to Mahasiswa",
    //     },
    //     { status: 400 },
    //   );
    // }

    // Check if format exists for this type
    const existingSubmission = await prismadb.format.findFirst({
      where: {
        name: name,
        typeId: BigInt(typeId.toString()),
      },
    });
    console.log(existingSubmission);
    if (existingSubmission) {
      return NextResponse.json(
        { message: "You already have an active format for this type" },
        { status: 400 },
      );
    }

    if (is_primary) {
      const existingPrimary = await prismadb.format.findFirst({
        where: {
          is_primary: true,
          typeId: BigInt(typeId.toString()),
        },
      });
      console.log(existingPrimary);
      if (existingPrimary) {
        return NextResponse.json(
          {
            message:
              "'Only one format can be primary. Please remove the primary flag from the existing format first.'",
          },
          { status: 404 },
        );
      }
    }

    if (give_access_to_mahasiswa && is_primary == true) {
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
        // await prismadb.studentTypeAccessPermission.create({
        //   data: {
        //     userId: student.id,
        //     typeId: BigInt(typeId.toString()), // This type corresponds to the format's type
        //   },
        // });
      }
    }

    console.log(if_pass_then_give_access_type_id);

    // Create the new format
    let newFormat = await prismadb.format.create({
      data: {
        name,
        typeId: BigInt(typeId.toString()), // Convert typeId to BigInt
        document_format_name,
        document_format_size,
        is_primary,
        is_schedule_required,
        is_newtitle_submission: is_newtitle,
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

    if (is_primary == true) {
      if (if_pass_then_give_access_type_id) {
        await prismadb.getTypeAccessPermission.create({
          data: {
            typeId: BigInt(typeId.toString()),
            accessTypeId: BigInt(if_pass_then_give_access_type_id.toString()),
            formatId: BigInt(newFormat.id.toString()),
          },
        });
      }
    }

    let documentFormat: string | null = null;
    const document_format = formData.get("document_format");
    console.log(document_format);
    if (document_format && document_format instanceof File) {
      documentFormat = await uploadFileToS3(document_format, newFormat.id);
    }

    // Update the format with the document format URL
    newFormat = await prismadb.format.update({
      where: { id: newFormat.id },
      data: {
        document_format: documentFormat,
      },
    });

    // Create Required Files if there are any
    console.log(requiredFiles);
    console.log(requiredValues);

    // Filter out empty required files
    const validRequiredFiles = requiredFiles.filter(
      (file) => file.name && file.key,
    );

    if (validRequiredFiles.length > 0) {
      let createdRequiredFiles = await Promise.all(
        validRequiredFiles.map((file: any) =>
          prismadb.requiredFile.create({
            data: {
              name: file.name,
              key: file.key,
              note: file.note,
              formatId: newFormat.id,
              // typeId: file.typeId,
            },
          }),
        ),
      );
      console.log(createdRequiredFiles);
    }

    // Filter out empty required values
    const validRequiredValues = requiredValues.filter(
      (value) => value.name && value.key,
    );

    if (validRequiredValues.length > 0) {
      let createdRequiredValues = await Promise.all(
        validRequiredValues.map((value: any) =>
          prismadb.requiredValue.create({
            data: {
              name: value.name,
              key: value.key,
              note: value.note,
              bobot: value.weight,
              formatId: newFormat.id,
            },
          }),
        ),
      );
      console.log(createdRequiredValues);
    }

    // Convert BigInt to string for the response
    const convertBigIntToString = (obj: unknown): unknown => {
      if (Array.isArray(obj)) {
        return obj.map((item) => convertBigIntToString(item));
      }
      if (typeof obj === "object" && obj !== null) {
        const result: Record<string, unknown> = {};
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const value = obj[key as keyof typeof obj];
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

    // Final response to client
    const response = {
      message: "Format created successfully",
      newFormat: convertBigIntToString(newFormat),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Error creating format:", error);
    return NextResponse.json(
      { message: "Error creating format", error: error.message },
      { status: 500 },
    );
  }
};

// export const POST = async (req: Request) => {
//   const session = await getServerSession(authOptions);

//   // Pastikan hanya Admin yang bisa membuat format
//   if (!session || session.user.role !== "Admin") {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     // Parsing body request menjadi JSON
//     const formData = await req.formData();
//     // Extract the form fields
//     const name = formData.get("name")?.toString() || "";
//     const typeId = formData.get("typeId");
//     const document_format_name = formData.get("document_format_name")?.toString();
//     const document_format_size = formData.get("document_format_size")?.toString();
//     const is_primary = formData.get("is_primary") === "true";
//     const is_schedule_required = formData.get("is_schedule_required") === "true";
//     const give_access_to_mahasiswa = formData.get("give_access_to_mahasiswa") === "true";
//     const if_pass_then_give_access_type_id = formData.get("if_pass_then_give_access_type_id")?.toString();
//     const requires_pembimbing = formData.get("requires_pembimbing") === "true";
//     const requires_penguji = formData.get("requires_penguji") === "true";
//     const requires_skill_group = formData.get("requires_skill_group") === "true";
//     const requires_academic_advisor = formData.get("requires_academic_advisor") === "true";
//     const next_submission_uses_current_verif = formData.get("next_submission_uses_current_verif") === "true";

//     // Handling required files and values
//     // const requiredFiles = [];
//     const requiredFiles: any[] = [];

//     // const requiredValues = [];
//     const requiredValues: any[] = [];

//      // File handling for required files
//      const fileColumns = formData.getAll("fileColumns"); // This will give you all file columns if they exist
//      fileColumns.forEach((column: any) => {
//        requiredFiles.push({
//          name: column[0],
//          key: column[1],
//          note: column[2],
//          typeId: column[3], // assuming you have a column for typeId
//        });
//      });

//      // Handling required values
//      const ratingColumns = formData.getAll("ratingColumns"); // Similarly for rating columns
//      ratingColumns.forEach((column: any) => {
//        requiredValues.push({
//          name: column[0],
//          key: column[1],
//          note: column[2],
//        });
//      });
//     // const requestData = await req.json();

//     // const {
//     //   name,
//     //   typeId,

//     //   document_format_name,
//     //   document_format_size,
//     //   is_primary,
//     //   is_schedule_required,
//     //   give_access_to_mahasiswa,
//     //   if_pass_then_give_access_type_id,
//     //   requires_pembimbing,
//     //   requires_penguji,
//     //   requires_skill_group,
//     //   requires_academic_advisor,
//     //   next_submission_uses_current_verif,
//     //   requiredFiles = [],
//     //   requiredValues = [],
//     // } = requestData;
//     // const document_format = requestData.get("document_format") as File | null;

//     // console.log(requiredFiles);
//     // console.log(requiredValues);
//     // console.log(typeof give_access_to_mahasiswa);
//     // console.log(name);
//     // console.log(is_primary);
//     // console.log(document_format);
//     // console.log(requestData);

//     // Validasi: Memastikan `name`, `is_primary`, dan `give_access_to_mahasiswa` tidak kosong
//     if (
//       !name ||
//       typeof is_primary === "undefined" ||
//       typeof give_access_to_mahasiswa === "undefined"
//     ) {
//       return NextResponse.json(
//         {
//           message:
//             "Please provide required fields: Name, Is Primary, and Give Access to Mahasiswa",
//         },
//         { status: 400 },
//       );
//     }

//     const existingSubmission = await prismadb.format.findFirst({
//       where: {
//         name: name,
//         typeId : BigInt(typeId)
//       },
//     });
//     if (existingSubmission) {
//       return NextResponse.json(
//         { message: "You already have an active format for this type" },
//         { status: 400 },
//       );
//     }

//     // Membuat format baru
//     let newFormat = await prismadb.format.create({
//       data: {
//         name,
//         typeId: BigInt(typeId), // Menyimpan BigInt di database
//         document_format_name,
//         document_format_size,
//         is_primary,
//         is_schedule_required,
//         give_access_to_mahasiswa,
//         if_pass_then_give_access_type_id: Number(
//           if_pass_then_give_access_type_id,
//         ),
//         requires_pembimbing,
//         requires_penguji,
//         requires_skill_group,
//         requires_academic_advisor,
//         next_submission_uses_current_verif,
//       },
//     });

//     const s3 = new S3Client({
//       region: process.env.S3_REGION,
//       endpoint: process.env.S3_ENDPOINT_URL,
//       credentials: {
//         accessKeyId: process.env.S3_ACCESS_KEY ?? "",
//         secretAccessKey: process.env.S3_SECRET_KEY ?? "",
//       },
//     });

//     // Fungsi bantu untuk upload ke S3 & kembalikan URL final
//     const uploadFileToS3 = async (
//       file: File,
//       formatId: bigint,
//     ): Promise<string> => {
//       // Convert File Web API → Buffer
//       const arrayBuffer = await file.arrayBuffer();
//       const fileBuffer = Buffer.from(arrayBuffer);

//       // Buat key: "formatId/nama-file.pdf"
//       const key = `${formatId}/${file.name}`;

//       // Kirim ke S3
//       await s3.send(
//         new PutObjectCommand({
//           Bucket: process.env.S3_BUCKET_NAME,
//           Key: key,
//           Body: fileBuffer,
//           ContentType: file.type,
//           ACL: "public-read",
//         }),
//       );

//       const bucketName = process.env.S3_BUCKET_NAME;
//       const region = process.env.S3_REGION;

//       const endpointUrl = process.env.S3_ENDPOINT_URL || "";
//       // Pastikan domain/host mengarah ke bucket, atau ke {bucketName}.{host}, dsb.

//       // Sederhana: "https://my-bucket.s3.amazonaws.com/ formatId/namaFile"
//       const fileUrl = `${endpointUrl.replace(/\/+$/, "")}/${bucketName}/formatdoukem/${key}`;

//       return fileUrl;
//     };

//     let documentFormat: string | null = null;
//     if(document_format){
//       documentFormat = await uploadFileToS3(document_format, newFormat.id)
//     }

//     // newFormat = await prismadb.format.update({
//     //   where: {id: newFormat.id},

//     // })
//     newFormat = await prismadb.format.update({
//       where: { id: newFormat.id },
//       data: {
//         document_format: documentFormat,
//       },
//     });

//     // Membuat RequiredFile dan RequiredValue terkait Format yang baru
//     const createdRequiredFiles = await Promise.all(
//       requiredFiles.map((file: any) =>
//         prismadb.requiredFile.create({
//           data: {
//             name: file.name,
//             key: file.key,
//             note: file.note,
//             formatId: newFormat.id,
//             typeId: BigInt(file.typeId), // Menyimpan BigInt di database
//             // isVerificatorCanEdit: file.isVerificatorCanEdit,
//             // isVerificatorCanView: file.isVerificatorCanView,
//           },
//         }),
//       ),
//     );

//     const createdRequiredValues = await Promise.all(
//       requiredValues.map((value: any) =>
//         prismadb.requiredValue.create({
//           data: {
//             name: value.name,
//             key: value.key,
//             note: value.note,
//             formatId: newFormat.id,
//           },
//         }),
//       ),
//     );

//     // Function to safely convert BigInt to string recursively
//     const convertBigIntToString = (obj: unknown): unknown => {
//       // Handle arrays by mapping each item through the function
//       if (Array.isArray(obj)) {
//         return obj.map((item) => convertBigIntToString(item)); // Return an array of Record<string, unknown>
//       }

//       // Handle objects: Check if the input is an object (excluding null)
//       if (typeof obj === "object" && obj !== null) {
//         const result: Record<string, unknown> = {}; // Use Record for object with string keys
//         // Iterate over the keys in the object
//         for (const key in obj) {
//           if (obj.hasOwnProperty(key)) {
//             // Safely access the property of the object using 'key'
//             const value = obj[key as keyof typeof obj]; // Use 'keyof' to ensure proper indexing
//             result[key] = convertBigIntToString(value); // Recursively convert the value
//           }
//         }
//         return result;
//       }

//       // Convert BigInt to string
//       if (typeof obj === "bigint") {
//         return obj.toString();
//       }

//       return obj; // Return the value as is if it's not BigInt, array, or object
//     };

//     // Convert all BigInt to string before sending the response
//     const response = {
//       newFormat: convertBigIntToString(newFormat),
//       createdRequiredFiles: createdRequiredFiles.map((file) =>
//         convertBigIntToString(file),
//       ),
//       createdRequiredValues: createdRequiredValues.map((value) =>
//         convertBigIntToString(value),
//       ),
//     };

//     console.log(response); // You can check this to see if the response is properly serialized

//     return NextResponse.json(response, { status: 201 });
//   } catch (error: any) {
//     console.error("Error creating format:", error);
//     return NextResponse.json(
//       { message: "Error creating format", error: error.message },
//       { status: 500 },
//     );
//   }
// };
