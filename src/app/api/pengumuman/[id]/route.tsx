import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { uploadFileToS3 } from '@/lib/s3Utils';

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
        const announcement = await prismadb.announcement.findUnique({
            where: { id: parseInt(id) },
        });

        if (!announcement) {
            return NextResponse.json({ message: 'Pengumuman tidak ditemukan' }, { status: 404 });
        }
        console.log(announcement)
        const serializedAnnouncement = {
            ...announcement,
            id: announcement.id.toString(),
        };

        return NextResponse.json({ serializedAnnouncement });
    } catch (error) {
        console.error('Error fetching announcement:', error);
        return NextResponse.json({ message: 'Gagal mengambil data pengumuman' }, { status: 500 });
    }
};

export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
    const session = await getServerSession(authOptions);
    const { id } = params;

    if (session && session.user.role !== "Mahasiswa") {
        const formData = await req.formData();
        console.log(formData);

        const judul = formData.get("judul") as string;
        const description = formData.get("description") as string;
        const statusString = formData.get("status") as string;
        let lampiranUrl: string | null = null;
        const lampiran = formData.get("lampiran");

        const status = statusString === "true";

        console.log(status);
        console.log(statusString);
        console.log(judul);
        console.log(description);

        try {
            let updatedAnnouncement = await prismadb.announcement.update({
                where: { id: BigInt(id) },
                data: {
                    judul,
                    description,
                    status,
                },
            });

            console.log(updatedAnnouncement);

            if (lampiran instanceof File) {
                lampiranUrl = await uploadFileToS3(lampiran, updatedAnnouncement.id, "pengumuman");
                console.log(lampiranUrl);

                updatedAnnouncement = await prismadb.announcement.update({
                    where: { id: updatedAnnouncement.id },
                    data: {
                        fileLampiran: lampiranUrl,
                    },
                });
            }

            return NextResponse.json({ message: "Pengumuman berhasil diperbarui" }, { status: 200 });
        } catch (error) {
            console.error("Failed to update announcement:", error);
            return NextResponse.json({ message: "Gagal memperbarui pengumuman" }, { status: 500 });
        }
    } else {
        return NextResponse.json({ error: "Terlarang" }, { status: 403 });
    }
};




export const DELETE = async (req: Request, context: { params: { id: string } }) => {
    const id = BigInt(context.params.id);

    const session = await getServerSession(authOptions);

    if (!id) {
        return NextResponse.json({ message: "Invalid announcement ID" }, { status: 400 });
    }

    
    if (session && session.user.role !== 'Mahasiswa') {
        try {
            console.log("sas")
            // Check if the announcement exists
            const announcement = await prismadb.announcement.findUnique({
                where: {
                    id: id,
                },
            });

            if (!announcement) {
                return NextResponse.json({ message: "Announcement not found" }, { status: 404 });
            }

            // Delete the announcement
            await prismadb.announcement.delete({
                where: {
                    id: id,
                },
            });

            return NextResponse.json({ message: "Announcement deleted successfully" }, { status: 200 });
        } catch (error) {
            console.error('Error deleting announcement:', error);
            return NextResponse.json({ message: "Failed to delete announcement" }, { status: 500 });
        }
    } else {
        return NextResponse.json({ error: 'Terlarang' }, { status: 403 });
    }
};