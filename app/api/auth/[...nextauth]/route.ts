import { randomBytes, randomUUID } from "crypto";
import NextAuth from "next-auth";
import client from "@/lib/mongoDB";
import CredentialsProvider from "next-auth/providers/credentials";

import { MongoDBAdapter } from "@auth/mongodb-adapter";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
    generateSessionToken: () => {
      return randomUUID?.() ?? randomBytes(32).toString("hex");
    },
  },
  adapter: MongoDBAdapter(client),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "admin@kimiaOmran.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "******",
        },
      },
      async authorize(credentials) {
        if (
          credentials === null ||
          !credentials.email ||
          !credentials.password
        ) {
          return null;
        }

        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
        const user = await res.json();
        if (res.ok && user?.user) {
          return {
            _id: user.user._id,
            email: user.user.email,
            first_name: user.user.first_name,
            last_name: user.user.last_name,
            phone: user.user.phone,
            role: user.user.role,
            avatar: user.user.avatar,
          };
        }
        return null;
      },
    }),
  ],
});

export const { GET, POST } = handlers;
