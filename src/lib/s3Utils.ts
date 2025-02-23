import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { createHash } from "crypto";

const s3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT_URL,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY ?? "",
    secretAccessKey: process.env.S3_SECRET_KEY ?? "",
  },
});

// Function to upload files to S3 & return the URL
export const uploadFileToS3 = async (
  file: File,
  id: bigint,
  folderPath: string = "", // Parameter opsional untuk folder, default ke folder root
): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);

  // Creating a timestamp for the file
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, ""); // Clean timestamp for filename

  // Combine elements for hashing
  const hashInput = `${id}_${timestamp}_${file.name}`;
  const hash = createHash("sha256").update(hashInput).digest("hex");

  // Create a more secure, hashed file name
  const formattedFileName = `${id}_${timestamp}_${hash}`;

  // If folderPath is provided, include it in the S3 key
  const key = folderPath
    ? `${folderPath}/${id}/${formattedFileName}`
    : `${id}/${formattedFileName}`;

  // Check if the file already exists in S3
  try {
    await s3.send(
      new HeadObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: key }),
    );
    // If no error is thrown, the file exists, so we append a unique identifier
    const uniqueKey = `${key}_${Date.now()}`;
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: uniqueKey,
        Body: fileBuffer,
        ContentType: file.type,
        ACL: "public-read",
      }),
    );
    // Construct the file URL
    const fileUrl = `${process.env.S3_ENDPOINT_URL}/${process.env.S3_BUCKET_NAME}/${uniqueKey}`;
    return fileUrl;
  } catch (error) {
    if ((error as { name: string }).name === "NotFound") {
      // If the file does not exist, proceed with the original key
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key,
          Body: fileBuffer,
          ContentType: file.type,
          ACL: "public-read",
        }),
      );
      // Construct the file URL
      const fileUrl = `${process.env.S3_ENDPOINT_URL}/${process.env.S3_BUCKET_NAME}/${key}`;
      return fileUrl;
    } else {
      throw error;
    }
  }
};
