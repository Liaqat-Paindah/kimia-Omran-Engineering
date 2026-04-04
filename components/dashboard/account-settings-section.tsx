"use client";

import { Button } from "@/components/ui/button";
import type {
  DashboardAccount,
  DashboardPasswordForm,
} from "@/lib/admin-dashboard";

const inputClass =
  "w-full rounded-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#00b3aa] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

export default function AccountSettingsSection({
  accountForm,
  passwordForm,
  isAccountSaving,
  isPasswordSaving,
  isRefreshing,
  onAccountChange,
  onPasswordChange,
  onAccountSubmit,
  onPasswordSubmit,
}: {
  accountForm: DashboardAccount;
  passwordForm: DashboardPasswordForm;
  isAccountSaving: boolean;
  isPasswordSaving: boolean;
  isRefreshing: boolean;
  onAccountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAccountSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onPasswordSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-sm border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
          Account Details
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">
          Update user information
        </h2>
        <form onSubmit={onAccountSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              className={inputClass}
              name="firstName"
              value={accountForm.firstName}
              onChange={onAccountChange}
              placeholder="First name"
            />
            <input
              className={inputClass}
              name="lastName"
              value={accountForm.lastName}
              onChange={onAccountChange}
              placeholder="Last name"
            />
          </div>
          <input
            className={inputClass}
            type="email"
            name="email"
            value={accountForm.email}
            onChange={onAccountChange}
            placeholder="Email"
          />
          <input
            className={inputClass}
            name="avatar"
            value={accountForm.avatar}
            onChange={onAccountChange}
            placeholder="Avatar image URL"
          />
          <Button
            type="submit"
            className="w-full rounded-sm text-white"
            style={{ backgroundColor: "#033a6d" }}
            disabled={isAccountSaving}
          >
            {isAccountSaving ? "Saving account..." : "Save account changes"}
          </Button>
        </form>
      </div>

      <div className="rounded-sm border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
          Password
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">
          Change password
        </h2>
        <form onSubmit={onPasswordSubmit} className="mt-6 space-y-4">
          <input
            className={inputClass}
            type="password"
            name="currentPassword"
            value={passwordForm.currentPassword}
            onChange={onPasswordChange}
            placeholder="Current password"
          />
          <input
            className={inputClass}
            type="password"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={onPasswordChange}
            placeholder="New password"
          />
          <input
            className={inputClass}
            type="password"
            name="confirmPassword"
            value={passwordForm.confirmPassword}
            onChange={onPasswordChange}
            placeholder="Confirm new password"
          />
          <Button
            type="submit"
            className="w-full rounded-sm text-white"
            style={{ backgroundColor: "#033a6d" }}
            disabled={isPasswordSaving}
          >
            {isPasswordSaving ? "Updating password..." : "Update password"}
          </Button>
        </form>
      </div>

      <div className="rounded-sm bg-slate-950 p-6 text-white shadow-sm dark:border dark:border-slate-800 dark:bg-slate-950">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
          Session
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Protected access</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          Dashboard rendering, proxy redirects, and API routes all require an
          authenticated admin session.
        </p>
        <p className="mt-4 text-xs uppercase tracking-[0.22em] text-slate-400">
          {isRefreshing
            ? "Refreshing dashboard state..."
            : "Dashboard state is in sync."}
        </p>
      </div>
    </div>
  );
}
