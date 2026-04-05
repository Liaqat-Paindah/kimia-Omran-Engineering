"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

const colors = {
  primary: "#033a6d",
  quinary: "#00b3aa",
  gradient:
    "linear-gradient(135deg, #033a6d 0%, #005c75 25%, #007c8f 50%, #009996 75%, #00b3aa 100%)",
};

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: "Invalid email or password.",
  AccessDenied: "You do not have permission to sign in.",
  Configuration: "Authentication is not configured correctly.",
  Default: "Unable to sign in right now. Please try again.",
};

function getAuthErrorMessage(error: string | null) {
  if (!error) {
    return "";
  }

  return AUTH_ERROR_MESSAGES[error] ?? AUTH_ERROR_MESSAGES.Default;
}

export default function AdminLoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const queryError = searchParams.get("error");
  const activeAuthError = authError || getAuthErrorMessage(queryError);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError("");
    setIsLoading(true);

    const response = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
      redirectTo: searchParams.get("callbackUrl") ?? "/dashboard",
    });

    setIsLoading(false);

    if (!response?.ok) {
      setAuthError(getAuthErrorMessage(response?.error ?? "Default"));
      return;
    }

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email.trim());
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    router.push(searchParams.get("callbackUrl") ?? "/dashboard");
    router.refresh();
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,179,170,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,179,170,0.03)_1px,transparent_1px)] bg-size-[32px_32px]" />
      <div
        className="absolute top-16 left-8 h-72 w-72 rounded-sm blur-3xl"
        style={{ background: `${colors.primary}22` }}
      />
      <div
        className="absolute right-8 bottom-16 h-72 w-72 rounded-sm blur-3xl"
        style={{ background: `${colors.quinary}22` }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md rounded-sm border bg-white p-8 shadow-2xl dark:bg-[#011b2b]"
        style={{ borderColor: `${colors.quinary}20` }}
      >
        <div className="mb-6">
          <div
            className="inline-flex rounded-sm px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]"
            style={{
              background: `${colors.quinary}10`,
              color: colors.quinary,
            }}
          >
            Admin Portal
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Sign in to go directly to the admin dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            className="w-full rounded-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#00b3aa] dark:border-[#064e78] dark:bg-[#011b2b] dark:text-white"
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="w-full rounded-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#00b3aa] dark:border-[#064e78] dark:bg-[#011b2b] dark:text-white"
          />

          {activeAuthError ? (
            <p className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {activeAuthError}
            </p>
          ) : null}

          <div className="flex items-center justify-between gap-3 text-xs">
            <label className="flex cursor-pointer items-center gap-2 text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 rounded accent-[#00b3aa]"
              />
              Remember me
            </label>
            <Link
              href="/contact"
              className="font-semibold"
              style={{ color: colors.quinary }}
            >
              Need help?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-sm px-4 py-3 text-sm font-semibold text-white"
            style={{ background: colors.gradient }}
          >
            {isLoading ? "Signing in..." : "Go to dashboard"}
          </button>
        </form>
      </motion.div>
    </section>
  );
}
