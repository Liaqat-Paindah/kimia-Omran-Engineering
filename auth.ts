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

        const userId = String(payload.user._id ?? payload.user.id ?? "");
        const firstName =
          payload.user.first_name ?? payload.user.firstName ?? null;
        const lastName =
          payload.user.last_name ?? payload.user.lastName ?? null;
        const avatar = payload.user.avatar ?? payload.user.image ?? null;
        const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

        return {
          id: userId,
          _id: userId,
          email: payload.user.email,
          firstName,
          lastName,
          first_name: firstName,
          last_name: lastName,
          role: payload.user.role ?? "user",
          avatar,
          image: avatar,
          name: fullName || (payload.user.email ?? null),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session }) {
      if (user) {
        const userId = user.id ?? user._id ?? token.sub ?? undefined;
        const firstName = user.first_name ?? user.firstName ?? null;
        const lastName = user.last_name ?? user.lastName ?? null;
        const avatar = user.avatar ?? user.image ?? null;

        token.id = userId;
        token.sub = userId;
        token._id = user._id ?? userId;
        token.email = user.email ?? token.email;
        token.firstName = firstName;
        token.lastName = lastName;
        token.first_name = firstName;
        token.last_name = lastName;
        token.role = user.role ?? "user";
        token.avatar = avatar;
        token.name = [firstName, lastName].filter(Boolean).join(" ") || token.name;
        token.picture = avatar ?? token.picture;
      }

      if (session) {
        const firstName =
          session.first_name ??
          session.user?.first_name ??
          session.firstName ??
          session.user?.firstName ??
          token.firstName ??
          token.first_name ??
          null;
        const lastName =
          session.last_name ??
          session.user?.last_name ??
          session.lastName ??
          session.user?.lastName ??
          token.lastName ??
          token.last_name ??
          null;
        const avatar =
          session.avatar ??
          session.user?.avatar ??
          session.user?.image ??
          token.avatar ??
          null;

        token.email = session.email ?? session.user?.email ?? token.email;
        token.firstName = firstName;
        token.lastName = lastName;
        token.first_name = firstName;
        token.last_name = lastName;
        token.role = session.role ?? session.user?.role ?? token.role;
        token.avatar = avatar;
        token.name = [firstName, lastName].filter(Boolean).join(" ") || token.name;
        token.picture = avatar ?? token.picture;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        const firstName = token.first_name ?? token.firstName ?? null;
        const lastName = token.last_name ?? token.lastName ?? null;

        session.user.id = token.id ?? token.sub ?? session.user.id;
        session.user._id = token._id;
        session.user.email = token.email ?? session.user.email ?? null;
        session.firstName = firstName;
        session.lastName = lastName;
        session.first_name = firstName;
        session.last_name = lastName;
        session.avatar = token.avatar ?? null;
        session.role = token.role ?? "user";
        session.user.firstName = firstName;
        session.user.lastName = lastName;
        session.user.first_name = firstName;
        session.user.last_name = lastName;
        session.user.role = token.role ?? session.user.role ?? "user";
        session.user.avatar = token.avatar ?? null;
        session.user.image = token.avatar ?? session.user.image ?? null;
        session.user.name =
          [firstName, lastName].filter(Boolean).join(" ") || session.user.name;
      }

      return session;
    },
  },
});
