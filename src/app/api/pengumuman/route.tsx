import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { uploadFileToS3 } from "@/lib/s3Utils";

export const GET = async () => {
  console.log(1);
  try {
    const announcements = await prismadb.announcement.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
    console.log(announcements);
    const serializedAnnouncement = announcements.map((announcement) => ({
      ...announcement,
      id: announcement.id.toString(), // Mengubah BigInt ke string
    }));
    return NextResponse.json({ serializedAnnouncement });
  } catch (error) {
    console.error("Failed to fetch announcements:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 },
    );
  }
};

export async function POST(req: Request) {
  // const body = await req.json();
  const session = await getServerSession(authOptions);
  console.log("tes")

  if (session && session.user.role !== "Mahasiswa") {
    // const { judul, description, lampiran } = body;
    const formData = await req.formData();
    console.log(formData)

    // Get fields from the formData
    const judul = formData.get("judul") as string;
    const description = formData.get("description") as string;
    const statusString = formData.get("status") as string; // Retrieve as string
    let lampiranUrl: string | null = null;
    const lampiran = formData.get("lampiran");

    // If 'status' is a string, convert it to a boolean (e.g., "true" => true, "false" => false)
    const status = statusString === "true"; // You can handle this as needed

    console.log(status);
    console.log(statusString);
    console.log(judul);
    console.log(description);

    try {
      // Convert session.user.id to number if it's a string
    

      let newAnnouncement = await prismadb.announcement.create({
        data: {
          judul,
          description, // Konten dalam format HTML
          status,
          // createdAt: new Date(postDate),
        },
      });

      console.log(newAnnouncement)

      console.log(lampiran)
      if (lampiran instanceof File) {
        // Now TypeScript knows that 'lampiran' is a File object
        lampiranUrl = await uploadFileToS3(lampiran, newAnnouncement.id, "pengumuman");
        console.log(lampiranUrl); // Use the URL returned by uploadFileToS3
      }

      if (lampiranUrl) {
        newAnnouncement = await prismadb.announcement.update({
          where: { id: newAnnouncement.id },
          data: {
            fileLampiran: lampiranUrl,
          },
        });
      }

      return NextResponse.json({ massge:"Berhasil menambahkan pengumuman"  }, { status: 201 });
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { error: "Gagal membuat pengumuman" },
        { status: 500 },
      );
    }
  } else {
    return NextResponse.json({ error: "Terlarang" }, { status: 403 });
  }
}
