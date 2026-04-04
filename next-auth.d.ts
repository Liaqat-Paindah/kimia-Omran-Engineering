import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    firstName?: string | null;
    lastName?: string | null;
    role?: "user" | "admin";
    avatar?: string | null;
  }

  interface Session {
    user: DefaultSession["user"] & {
      _id?: string;
      firstName?: string | null;
      lastName?: string | null;
      role?: "user" | "admin";
      avatar?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    firstName?: string | null;
    lastName?: string | null;
    role?: "user" | "admin";
    avatar?: string | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    _id?: string;
    firstName?: string | null;
    lastName?: string | null;
    role?: "user" | "admin";
    avatar?: string | null;
  }
}
