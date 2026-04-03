import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import User from "@/models/user";
import { ConnectDB } from "@/lib/config";

const credentialsSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(6),
});

function getStringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function getNullableStringValue(value: unknown) {
  return typeof value === "string" ? value : null;
}

const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "admin@kimiaomran.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "******",
        },
      },
      async authorize(credentials) {
        const parsedCredentials = credentialsSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        await ConnectDB();

        const user = await User.findOne({
          email: parsedCredentials.data.email,
        });

        if (!user) {
          return null;
        }

        const isValidPassword = await user.comparePassword(
          parsedCredentials.data.password,
        );

        if (!isValidPassword) {
          return null;
        }

        const firstName = user.firstName?.trim() ?? "";
        const lastName = user.lastName?.trim() ?? "";
        const fullName = [firstName, lastName].filter(Boolean).join(" ");

        return {
          id: user._id.toString(),
          email: user.email,
          name: fullName || user.email,
          image: user.avatar ?? null,
          firstName,
          lastName,
          role: user.role ?? "user",
          avatar: user.avatar ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.avatar = user.avatar;
        token.name = user.name;
        token.picture = user.image;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const firstName = getStringValue(token.firstName);
        const lastName = getStringValue(token.lastName);

        session.user.id = getStringValue(token.id);
        session.user.role = getStringValue(token.role, "user");
        session.user.firstName = firstName;
        session.user.lastName = lastName;
        session.user.avatar = getNullableStringValue(token.avatar);
        session.user.name =
          getStringValue(token.name) ||
          [firstName, lastName].filter(Boolean).join(" ") ||
          session.user.email ??
          "User";
        session.user.image = getNullableStringValue(token.picture);
      }

      return session;
    },
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);
