import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prismadb from "@/lib/prismadb";
// import client from '../../../../../wabot/bot.js';
// console.log(client); 

// POST (Create) Verificator
export const POST = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role === "Mahasiswa") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    try {
        const body = await req.json();

        // Check if the lecturer is already a verificator for the same submission
        const existingVerificator = await prismadb.verificator.findFirst({
            where: {
                lecturerId: Number(body.lecturerId),
                submissionId: body.submissionId ? BigInt(body.submissionId) : null,
            },
        });

        if (existingVerificator) {
            return NextResponse.json(
                { message: "Lecturer is already a verificator for this submission" },
                { status: 400 },
            );
        }

        const newVerificator = await prismadb.verificator.create({
            data: {
                type: body.type,
                lecturerId: Number(body.lecturerId),
                submissionId: body.submissionId ? BigInt(body.submissionId) : null,
            },
        });
        console.log(newVerificator);
        const lecturer = await prismadb.user.findUnique({
            where: { id: newVerificator.lecturerId },
        });
        console.log(lecturer);

        // if (lecturer && lecturer.phone_number) {
        //   const message = `Hello ${lecturer.name}, you have been added as a verificator.`;
        //   console.log("Sending WhatsApp message...");

        //   // Send WhatsApp message
        //   const sendMessage = await client.sendMessage(`whatsapp:${lecturer.phone_number}`, message);
        //   console.log(sendMessage)
        //   console.log("WhatsApp message sent successfully");
        // }

        return NextResponse.json(
            { message: "Verificator created successfully", lecturer, type: newVerificator.type },
            { status: 201 },
        );
    } catch (error) {
        console.error("Error creating verificator:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 },
        );
    }
};
