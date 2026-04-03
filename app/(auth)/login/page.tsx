import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LoginPageClient from "@/components/auth/login-page-client";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return <LoginPageClient />;
}
