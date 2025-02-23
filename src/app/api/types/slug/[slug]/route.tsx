import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Endpoint untuk mendapatkan typeId berdasarkan slug


export const GET = async (req: NextRequest,{ params }: { params: { slug: string } }) => {
    // const { slug } = req.query; // Ambil slug dari query parameter
  
    try {
      const type = await prismadb.type.findUnique({
        where: { slug: params.slug }, // Mencari berdasarkan slug
      });
      console.log(type)
  
      if (!type) {
        return NextResponse.json(
          { message: "Tipe pengajuan tidak ditemukan" },
          { status: 404 }
        );
      }
      const serializedValue = {
        ...type,
        id: type.id.toString(),
        // formatId: type.formatId.toString(),
      };
  
      return NextResponse.json({ typeId: type.id.toString() });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { message: "Terjadi kesalahan saat mengambil tipe pengajuan." },
        { status: 500 }
      );
    }
  };
  