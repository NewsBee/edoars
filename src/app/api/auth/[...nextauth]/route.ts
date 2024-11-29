import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import prismadb from "@/lib/prismadb";

type User = {
  id: string;
  username: string;
  email?: string;
  name?: string;
  role: string;
  nim?: string;
  google_drive_folder_id?: string;
  status?: string;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prismadb),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60, // 12 hours
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const appKey = process.env.APP_KEY || "";
        const secretKey = process.env.SECRET_KEY || "";

        if (!appKey || !secretKey) {
          console.error("APP_KEY or SECRET_KEY is not defined");
          return null;
        }

        // Bypass untuk akun testing
        if (
          credentials.email === "testadmin@example.com" &&
          credentials.password === "admin123"
        ) {
          return {
            id: "4",
            username: "Test Admin",
            email: "testadmin@example.com",
            name: "Admin Testing",
            role: "Admin", // Berikan role Admin
          } as User;
        }

        if (
          credentials.email === "testkaprodi@example.com" &&
          credentials.password === "kaprodi123"
        ) {
          return {
            id: "9998",
            username: "Test Kaprodi",
            email: "testkaprodi@example.com",
            name: "Kaprodi Testing",
            role: "Kaprodi", // Berikan role Kaprodi
          } as User;
        }

        try {
          const response = await fetch(
            "https://api.sevimaplatform.com/siakadcloud/v1/user/login",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-App-Key": appKey,
                "X-Secret-Key": secretKey,
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          );

          const data = await response.json();

          if (!response.ok || !data.attributes) {
            console.error("Failed to login, status code:", response.status);
            console.error("Failed to login, status code:", response);
            return null;
          }

          const prisma = prismadb;

          // Sinkronkan data pengguna ke dalam database
          const upsertUser = await prisma.user.upsert({
            where: {
              external_user_id: data.attributes.user_id, // ID dari API eksternal
            },
            update: {
              name: data.attributes.nama,
              email: data.attributes.email,
              nim: data.attributes.role[0]?.nim || null,
              role: data.attributes.role[0]?.nama_role || "User",
              nama_satker: data.attributes.role[0]?.nama_satker || null,
              id_satker: data.attributes.role[0]?.id_satker || null,
              periode_masuk: data.attributes.role[0]?.periode_masuk || null,
              status: data.attributes.status_aktif || "1",
            },
            create: {
              external_user_id: data.attributes.user_id,
              name: data.attributes.nama,
              email: data.attributes.email,
              nim: data.attributes.role[0]?.nim || null,
              role: data.attributes.role[0]?.nama_role || "User",
              nama_satker: data.attributes.role[0]?.nama_satker || null,
              id_satker: data.attributes.role[0]?.id_satker || null,
              periode_masuk: data.attributes.role[0]?.periode_masuk || null,
              status: data.attributes.status_aktif || "1",
              google_drive_folder_id: null,
            },
          });

          const user: User = {
            id: upsertUser.id.toString(),
            username: upsertUser.name,
            email: upsertUser.email,
            name: upsertUser.name,
            role: upsertUser.role,
            nim: upsertUser.nim || undefined,
            google_drive_folder_id:
              upsertUser.google_drive_folder_id || undefined,
            status: upsertUser.status || "1",
          };

          return user;
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.nim = user.nim || undefined;
        token.google_drive_folder_id = user.google_drive_folder_id || undefined;
        token.status = user.status || "1";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          username: token.username as string,
          email: token.email as string,
          name: token.name as string,
          role: token.role as string,
          nim: token.nim,
          google_drive_folder_id: token.google_drive_folder_id,
          status: token.status,
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl; // Redirect to homepage after successful login
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

export default NextAuth(authOptions);

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
