import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prismadb from "@/lib/prismadb";
import { User as CustomUser } from "../../../../types/dbScheme"; // Make sure this includes 'name' field

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
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password", placeholder: "Password" },
      },
      async authorize(credentials, req) {
        // const { rememberMe } = req.body;

        
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
      
        const appKey = process.env.APP_KEY || "";
        const secretKey = process.env.SECRET_KEY || "";
      
        if (!appKey || !secretKey) {
          console.error("APP_KEY or SECRET_KEY is not defined");
          return null;
        }
      
        try {
          const response = await fetch("https://api.sevimaplatform.com/siakadcloud/v1/user/login", {
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
          });
      
          const data = await response.json();
          console.log("API Response:", data);  // Tambahkan log untuk response
      
          if (!response.ok || !data.attributes) {
            console.error("Failed to login, status code:", response.status);
            return null;
          }
      
          const user = {
            id: data.attributes.user_id.toString(),
            username: data.attributes.nama,
            email: data.attributes.email,
            name: data.attributes.nama,
            role: data.attributes.role[0]?.nama_role || "User",
          };
      
          return user;
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.name = user.name; // Include 'name' in token
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          username: token.username as string,
          email: token.email as string,
          name: token.name as string, // Include 'name' in session
          role: token.role as string,
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
