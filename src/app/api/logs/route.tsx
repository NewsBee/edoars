import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // const { role } = req.query;

        const logs = await prismadb.activitySubmissionLog.findMany({
            // where: role ? { User: { role: role as string } } : {},
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                User: true,
                Submission: true,
                TitleSubmission: true,
            },
        });

        console.log(logs);
        
        const serializedLogs = logs.map(log => ({
            id: log.id,
            submissionId: log.submissionId ? log.submissionId.toString() : null,
            titleSubmissionId: log.titleSubmissionId ? log.titleSubmissionId.toString() : null,
            userId: log.userId,
            activity: log.activity,
            createdAt: log.createdAt,
            User: {
                id: log.User.id,
                external_user_id: log.User.external_user_id,
                name: log.User.name,
                email: log.User.email,
                phone_number: log.User.phone_number,
                nim: log.User.nim,
                role: log.User.role,
                nama_satker: log.User.nama_satker,
                id_satker: log.User.id_satker,
                periode_masuk: log.User.periode_masuk,
                status: log.User.status,
                createdAt: log.User.createdAt,
                updatedAt: log.User.updatedAt,
            },
            Submission: log.Submission ? {
                id: log.Submission.id.toString(),
                typeId: log.Submission.typeId.toString(),
                userId: log.Submission.userId,
                title: log.Submission.title,
                description: log.Submission.description,
                status: log.Submission.status,
                createdAt: log.Submission.createdAt,
                updatedAt: log.Submission.updatedAt,
            } : null,
            TitleSubmission: log.TitleSubmission ? {
                id: log.TitleSubmission.id,
                title: log.TitleSubmission.title,
                createdAt: log.TitleSubmission.createdAt,
                updatedAt: log.TitleSubmission.updatedAt,
            } : null,
        }));
        console.log(serializedLogs);

        return NextResponse.json(serializedLogs, { status: 200 });
        // return NextResponse.json(logs, { status: 200 });
    } catch (error) {
        console.error('Error fetching logs:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};
