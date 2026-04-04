import type { DefaultSession, DefaultUser } from "next-auth";

type UserRole = "user" | "admin";

interface AuthProfileFields {
  id?: string;
  _id?: string;
  role?: UserRole;
  avatar?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  first_name?: string | null;
  last_name?: string | null;
}

declare module "next-auth" {
  interface User extends DefaultUser, AuthProfileFields {}

  interface Session extends AuthProfileFields {
    user: DefaultSession["user"] & AuthProfileFields;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends AuthProfileFields {}
}

declare module "@auth/core/jwt" {
  interface JWT extends AuthProfileFields {}
}

export {};
