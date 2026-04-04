import "server-only";

import type { Adapter } from "@auth/core/adapters";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { randomBytes, randomUUID } from "node:crypto";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import client from "@/lib/mongoDB";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
    generateSessionToken: () => {
      return randomUUID?.() ?? randomBytes(32).toString("hex");
    },
  },
  // The adapter currently resolves a nested copy of @auth/core in this repo.
  // Casting keeps the config aligned until dependencies are deduped.
  adapter: MongoDBAdapter(client) as Adapter,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "jsmith@Ayandaha.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          !credentials ||
          typeof credentials.email !== "string" ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }

        const authUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;

        if (!authUrl) {
          return null;
        }

        const response = await fetch(`${authUrl}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const payload = await response.json();

        if (!response.ok || !payload?.user) {
          return null;
        }

        const firstName = payload.user.firstName ?? "";
        const lastName = payload.user.lastName ?? "";
        const avatar = payload.user.avatar ?? null;

        return {
          id: payload.user._id,
          _id: payload.user._id,
          email: payload.user.email,
          firstName,
          lastName,
          role: payload.user.role,
          avatar,
          name: [firstName, lastName].filter(Boolean).join(" ") || null,
          image: avatar,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.email = user.email ?? token.email;
        token.firstName = user.firstName ?? null;
        token.lastName = user.lastName ?? null;
        token.avatar = user.avatar ?? null;
        token.name =
          [user.firstName, user.lastName].filter(Boolean).join(" ") ||
          token.name;
        token.picture = user.avatar ?? token.picture;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user._id = token._id;
        session.user.email = token.email ?? session.user.email ?? null;
        session.user.firstName =
          token.firstName ?? session.user.firstName ?? null;
        session.user.lastName = token.lastName ?? session.user.lastName ?? null;
        session.user.avatar = token.avatar ?? null;
      }

      return session;
    },
  },
});
