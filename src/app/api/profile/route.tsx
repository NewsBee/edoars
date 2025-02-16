import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

// Get User Profile API
export const GET = async (req: Request) => {
    const session = await getServerSession(authOptions);
  
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  
    try {
      const userId = parseInt(session.user.id); // Ensure userId is a number
  
      const userProfile = await prismadb.user.findUnique({
        where: { id: userId },
        select: {
          name: true,
          nim: true,
          nip: true,
          phone_number: true,
          profile_image: true,
          signature_image: true,
          role: true,
          email: true,
        },
      });
  
      if (!userProfile) {
        return new NextResponse("User not found", { status: 404 });
      }
  
      return new NextResponse(JSON.stringify(userProfile), { status: 200 });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return new NextResponse("Failed to fetch user profile", { status: 500 });
    }
  };
  
  // Update User Profile API
  export const PUT = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
  
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const userId = parseInt(session.user.id); // Ensure userId is a number
      const requestData = await req.json();
  
      const { name, phone_number, nim, nip, profile_image, signature_image } = requestData;
  
      const updatedUser = await prismadb.user.update({
        where: { id: userId }, // `id` is now properly a number
        data: {
          name,
          phone_number: phone_number || null,
          nim: nim || null, // If empty, set to null
          nip: nip || null, // If empty, set to null
          profile_image, // Updated profile image
          signature_image, // Updated signature image
        },
      });
  
      return NextResponse.json(
        { message: "User profile updated successfully", updatedUser },
        { status: 200 }
      );
    } catch (error: any) {
      console.error("Error updating user profile:", error);
      return NextResponse.json(
        { message: "Error updating user profile", error: error.message },
        { status: 500 }
      );
    }
  };
  