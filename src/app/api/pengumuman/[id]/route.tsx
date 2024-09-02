import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
        const announcement = await prismadb.announcement.findUnique({
            where: { id: parseInt(id) },
        });

        if (!announcement) {
            return NextResponse.json({ message: 'Pengumuman tidak ditemukan' }, { status: 404 });
        }

        return NextResponse.json({ announcement });
    } catch (error) {
        console.error('Error fetching announcement:', error);
        return NextResponse.json({ message: 'Gagal mengambil data pengumuman' }, { status: 500 });
    }
};

export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  const { title, content, postDate } = await req.json();
  try {
    const updatedAnnouncement = await prismadb.announcement.update({
      where: { id: parseInt(params.id) },
      data: { title, content, postDate: new Date(postDate) },
    });

    return NextResponse.json({ announcement: updatedAnnouncement });
  } catch (error) {
    console.error("Failed to update announcement:", error);
    return NextResponse.json({ message: "Gagal memperbarui pengumuman" }, { status: 500 });
  }
};



export const DELETE = async (req: Request, context: { params: { id: number } }) => {
    const id = context.params.id;

    const session = await getServerSession(authOptions);

    if (!id || Array.isArray(id)) {
        return NextResponse.json({ message: "Invalid announcement ID" }, { status: 400 });
    }

    if (session && session.user.role === 'ADMIN') {
        try {
            // Check if the announcement exists
            const announcement = await prismadb.announcement.findUnique({
                where: {
                    id: Number(id),
                },
            });

            if (!announcement) {
                return NextResponse.json({ message: "Announcement not found" }, { status: 404 });
                // return res.status(404).json({ error: 'Announcement not found' });
            }

            // Delete the announcement
            await prismadb.announcement.delete({
                where: {
                    id: Number(id),
                },
            });

            return NextResponse.json({ message: "Announcement deleted successfully" }, { status: 200 });
        } catch (error) {
            console.error('Error deleting announcement:', error);
            return NextResponse.json({ message: "Failed to delete announcement" }, { status: 500 });
            // return res.status(500).json({ error: 'Failed to delete announcement' });
        }
    } else {
        return NextResponse.json({ error: 'Terlarang' }, { status: 403 });
    }

};
