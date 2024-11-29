import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    role: string;
    email?: string;
    name?: string;
    nim?: string;
    google_drive_folder_id?: string;
    status?: string;
  }

  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
      email?: string;
      name?: string;
      nim?: string;
      google_drive_folder_id?: string;
      status?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: string;
    email?: string;
    name?: string;
    nim?: string;
    google_drive_folder_id?: string;
    status?: string;
  }
}
