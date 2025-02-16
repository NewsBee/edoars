import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function POST(request:any) {
  try {
    // 1. Baca data dari body (JSON)
    const { fileName, fileType } = await request.json();

    // 2. Inisialisasi S3Client
    const s3Client = new S3Client({
        region: process.env.S3_REGION ?? "us-east-1",
        endpoint: process.env.S3_ENDPOINT_URL ?? "",
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY ?? "",
          secretAccessKey: process.env.S3_SECRET_KEY ?? "",
        },
      });

    // 3. Buat perintah PUT ke object S3
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,        // nama file di bucket
      ContentType: fileType // tipe konten (opsional tapi disarankan)
      // ACL: "private"      // default "private"
      // ACL: "public-read"  // jika ingin bisa diakses publik
    });

    // 4. Dapatkan pre-signed URL, durasi 1 jam (3600 detik)
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    // 5. Kembalikan URL ke client
    return NextResponse.json({ url: signedUrl }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error generating pre-signed URL" },
      { status: 500 }
    );
  }
}
