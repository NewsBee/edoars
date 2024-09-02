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
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password", placeholder: "Password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await prismadb.user.findUnique({
          where: {
            username: credentials.username,
          },
        }) as CustomUser | null;

        if (!user) {
          return null;
        }

        const passwordMatch = await compare(credentials.password, user.password);
        if (!passwordMatch) {
          return null;
        }

        // Include 'name' in the returned object
        return {
          id: user.id.toString(),
          username: user.username,
          email: user.email,
          name: user.name, // Ensure 'name' is included
          role: user.role,
        };
      },
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
      // Redirect to homepage after successful login
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

export default NextAuth(authOptions);

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
