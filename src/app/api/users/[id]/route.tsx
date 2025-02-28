import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb"; // Prisma client
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prismadb from "@/lib/prismadb";
import bcrypt from "bcryptjs";


export const PUT = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = parseInt(params.id); // Convert user ID from params
    const requestData = await req.json();
    const {
      name,
      email,
      password,
      role,
      status,
      phone_number,
      nim,
      nip,
      selectedTypes, // This should be an array of typeIds as strings
    } = requestData;

    const newStatus = status === "Aktif" ? "1" : "0";
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("selectedTypes", selectedTypes);
    console.log("name", name);

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        password:hashedPassword,
        role,
        status: newStatus,
        phone_number: phone_number || null,
        nim: nim || null,
        nip: nip || null,
      },
    });

    // Step 1: Get the current StudentPermissions for the user
    const currentPermissions =
      await prisma.studentTypeAccessPermission.findMany({
        where: { userId },
      });

    // Step 2: Ensure that selectedTypes is an array of strings, not objects
    // Convert typeIds to BigInt for comparison
    // const selectedTypeIds = selectedTypes.map((type: any) => {
    //   // Ensure that we are safely converting to number or BigInt
    //   return BigInt(type); // Ensure the selectedTypeIds are BigInt, or use Number() if required
    // });

    const selectedTypeIds = selectedTypes.map((type: any) => {
      return BigInt(type.typeId); // Access the correct property before converting
    });

    // Step 3: Find the types that need to be added (newly checked types)
    const typesToAdd = selectedTypeIds.filter(
      (typeId: BigInt) =>
        !currentPermissions.some((perm) => perm.typeId === typeId),
    );

    // Step 4: Find the types that need to be removed (unchecked types)
    const typesToRemove = currentPermissions.filter(
      (perm) => !selectedTypeIds.includes(perm.typeId),
    );

    // Step 5: Add new permissions (unchecked types)
    const addPromises = typesToAdd.map(async (typeId: BigInt) => {
      await prisma.studentTypeAccessPermission.create({
        data: {
          userId,
          typeId: Number(typeId), // Convert to number for Prisma if needed
        },
      });
    });

    // Step 6: Remove unchecked permissions
    const removePromises = typesToRemove.map(async (perm) => {
      await prisma.studentTypeAccessPermission.delete({
        where: {
          id: perm.id, // Delete permission by its ID
        },
      });
    });

    // Execute both add and remove promises
    await Promise.all([...addPromises, ...removePromises]);

    // Step 7: Return response with updated user and permissions
    return NextResponse.json(
      { message: "User successfully updated", updatedUser },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Error updating user", error: error.message },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = parseInt(params.id);

    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      { message: "User successfully deleted", deletedUser },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Error deleting user", error: error.message },
      { status: 500 },
    );
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  // console.log(params.id);
  try {
    const { id } = params;

    // Find users by user ID
    const users = await prismadb.user.findMany({
      where: {
        id: parseInt(id), // Ensure the id is an integer
      },
      include: {
        StudentPermissions: true,
      },
    });

    // Function to safely convert BigInt to string recursively
    const convertBigIntToString = (obj: unknown): unknown => {
      // Handle arrays
      if (Array.isArray(obj)) {
        return obj.map((item) => convertBigIntToString(item));
      }

      // Handle objects (excluding null)
      if (typeof obj === "object" && obj !== null) {
        const result: Record<string, unknown> = {};
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const value = obj[key as keyof typeof obj];
            result[key] = convertBigIntToString(value);
          }
        }
        return result;
      }

      // Convert BigInt to string
      if (typeof obj === "bigint") {
        return obj.toString();
      }

      return obj; // Return the value as is if it's not BigInt, array, or object
    };

    // Convert all BigInt values in the users data to string
    const response = users.map((user) => convertBigIntToString(user));

    // If no users found, return a 404 response
    if (response.length === 0) {
      return new NextResponse("No users found for this id", { status: 404 });
    }

    // Return the users with BigInt values converted to string
    return new NextResponse(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new NextResponse("Failed to fetch users", { status: 500 });
  }
}
