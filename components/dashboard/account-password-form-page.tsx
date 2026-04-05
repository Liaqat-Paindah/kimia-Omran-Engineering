"use client";

import { useState } from "react";
import Link from "next/link";

import ToastStack, { type ToastItem } from "@/components/ui/toast-stack";
import { Button } from "@/components/ui/button";
import {
  createToastId,
  emptyPasswordForm,
  type DashboardPasswordForm,
} from "@/lib/admin-dashboard";

const inputClass =
  "w-full rounded-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#00b3aa] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

export default function AccountPasswordFormPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [passwordForm, setPasswordForm] =
    useState<DashboardPasswordForm>(emptyPasswordForm);
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
    setPasswordForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    const response = await fetch("/api/account/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passwordForm),
    });

    const payload = (await response.json()) as { message?: string };

    setIsSaving(false);

    if (!response.ok) {
      showToast({
        title: "Password update failed",
        description: payload.message ?? "Unable to update the password.",
        variant: "error",
      });
      return;
    }

    setPasswordForm(emptyPasswordForm);
    showToast({
      title: "Password updated",
      description: payload.message ?? "Password updated successfully.",
      variant: "success",
    });
  };

  return (
    <>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      <section className="rounded-sm border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Password
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">
              Change account password
            </h2>
          </div>
          <Button asChild type="button" variant="outline" className="rounded-sm px-4">
            <Link href="/dashboard/account">Back to account</Link>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            className={inputClass}
            type="password"
            name="currentPassword"
            value={passwordForm.currentPassword}
            onChange={handleChange}
            placeholder="Current password"
          />
          <input
            className={inputClass}
            type="password"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handleChange}
            placeholder="New password"
          />
          <input
            className={inputClass}
            type="password"
            name="confirmPassword"
            value={passwordForm.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
          />

          <Button
            type="submit"
            className="w-fit rounded-sm px-5 text-white"
            style={{ backgroundColor: "#033a6d" }}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Update password"}
          </Button>
        </form>
      </section>
    </>
  );
}
