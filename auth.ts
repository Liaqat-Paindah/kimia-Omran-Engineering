import "server-only";

import type { Adapter } from "@auth/core/adapters";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { randomBytes, randomUUID } from "node:crypto";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import client from "@/lib/mongoDB";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
    error: "/login",
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
        const userId = payload.user._id ?? payload.user.id;

        return {
          id: userId,
          _id: userId,
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
    async jwt({ token, user, session }) {
      if (user) {
        token._id = user._id;
        token.email = user.email ?? token.email;
        token.firstName = user.firstName ?? null;
        token.lastName = user.lastName ?? null;
        token.role = user.role ?? "user";
        token.avatar = user.avatar ?? null;
        token.name =
          [user.firstName, user.lastName].filter(Boolean).join(" ") ||
          token.name;
        token.picture = user.avatar ?? token.picture;
      }

      if (session) {
        token.email = session.email ?? token.email;
        token.firstName = session.firstName ?? token.firstName;
        token.lastName = session.lastName ?? token.lastName;
        token.role = session.role ?? token.role;
        token.avatar = session.avatar ?? token.avatar;
        token.name =
          [session.firstName, session.lastName]
            .filter(Boolean)
            .join(" ") || token.name;
        token.picture = session.avatar ?? token.picture;
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
        session.user.role = token.role ?? session.user.role ?? "user";
        session.user.avatar = token.avatar ?? null;
        session.user.name =
          [session.user.firstName, session.user.lastName]
            .filter(Boolean)
            .join(" ") || session.user.name;
        session.user.image = token.avatar ?? session.user.image ?? null;
      }

      return session;
    },
  },
});
