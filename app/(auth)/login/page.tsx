import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminLoginPageClient from "@/components/admin-login-page-client";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return <AdminLoginPageClient />;
}
