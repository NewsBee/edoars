import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';


export const GET = async () => {
  try {
    const announcements = await prismadb.announcement.findMany({
      orderBy: {
        postDate: 'desc',
      },
    });
    return NextResponse.json({ announcements });
  } catch (error) {
    console.error('Failed to fetch announcements:', error);
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
  }
};


export async function POST(req: Request) {
    const body = await req.json();
    const session = await getServerSession(authOptions);

    if (session && session.user.role === 'ADMIN') {
        const { title, content, postDate } = body;

        try {
            // Convert session.user.id to number if it's a string
            const postedById = typeof session.user.id === 'string' ? parseInt(session.user.id) : session.user.id;

            const newAnnouncement = await prismadb.announcement.create({
                data: {
                    title,
                    content, // Konten dalam format HTML
                    postDate: new Date(postDate),
                    postedById, // Use the converted postedById
                },
            });
            return NextResponse.json({ newAnnouncement }, { status: 201 });
        } catch (error) {
            console.log(error)
            return NextResponse.json({ error: 'Gagal membuat pengumuman' }, { status: 500 });
        }
    } else {
        return NextResponse.json({ error: 'Terlarang' }, { status: 403 });
    }
};
  