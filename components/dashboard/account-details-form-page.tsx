"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import ToastStack, { type ToastItem } from "@/components/ui/toast-stack";
import { Button } from "@/components/ui/button";
import { createToastId, type DashboardAccount } from "@/lib/admin-dashboard";

const inputClass =
  "w-full rounded-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#00b3aa] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

export default function AccountDetailsFormPage({
  initialAccount,
}: {
  initialAccount: DashboardAccount;
}) {
  const router = useRouter();
  const { update } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [accountForm, setAccountForm] = useState(initialAccount);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (toast: Omit<ToastItem, "id">) => {
    const id = createToastId();
    setToasts((current) => [...current, { id, ...toast }]);
  };

  const dismissToast = (id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAccountForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    const response = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(accountForm),
    });

    const payload = (await response.json()) as {
      message?: string;
      account?: DashboardAccount;
    };

    setIsSaving(false);

    if (!response.ok || !payload.account) {
      showToast({
        title: "Account update failed",
        description: payload.message ?? "Unable to update the account.",
        variant: "error",
      });
      return;
    }

    setAccountForm(payload.account);

    await update({
      email: payload.account.email,
      first_name: payload.account.first_name,
      last_name: payload.account.last_name,
      role: payload.account.role,
      avatar: payload.account.avatar,
    });

    showToast({
      title: "Account updated",
      description: payload.message ?? "Account updated successfully.",
      variant: "success",
    });

    router.refresh();
  };

  return (
    <>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      <section className="rounded-sm border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Account Details
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">
              Update account information
            </h2>
          </div>
          <Button asChild type="button" variant="outline" className="rounded-sm px-4">
            <Link href="/dashboard/account">Back to account</Link>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              className={inputClass}
              name="first_name"
              value={accountForm.first_name}
              onChange={handleChange}
              placeholder="First name"
            />
            <input
              className={inputClass}
              name="last_name"
              value={accountForm.last_name}
              onChange={handleChange}
              placeholder="Last name"
            />
          </div>
          <input
            className={inputClass}
            type="email"
            name="email"
            value={accountForm.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            className={inputClass}
            name="avatar"
            value={accountForm.avatar}
            onChange={handleChange}
            placeholder="Avatar image URL"
          />

          <Button
            type="submit"
            className="w-fit rounded-sm px-5 text-white"
            style={{ backgroundColor: "#033a6d" }}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save account changes"}
          </Button>
        </form>
      </section>
    </>
  );
}
