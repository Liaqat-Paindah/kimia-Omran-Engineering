import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { DashboardAccount } from "@/lib/admin-dashboard";

function getInitials(account: DashboardAccount) {
  const initials = `${account.firstName[0] ?? ""}${account.lastName[0] ?? ""}`.trim();
  return initials || "AD";
}

export default function AccountOverviewPage({
  account,
}: {
  account: DashboardAccount;
}) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-sm border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
          Account Information
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">
          Review current administrator details
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-sm bg-slate-50 px-4 py-4 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              First Name
            </p>
            <p className="mt-2 text-sm text-slate-900 dark:text-slate-100">
              {account.firstName || "Not provided"}
            </p>
          </div>
          <div className="rounded-sm bg-slate-50 px-4 py-4 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Last Name
            </p>
            <p className="mt-2 text-sm text-slate-900 dark:text-slate-100">
              {account.lastName || "Not provided"}
            </p>
          </div>
          <div className="rounded-sm bg-slate-50 px-4 py-4 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Email
            </p>
            <p className="mt-2 text-sm text-slate-900 dark:text-slate-100">
              {account.email}
            </p>
          </div>
          <div className="rounded-sm bg-slate-50 px-4 py-4 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Role
            </p>
            <p className="mt-2 text-sm text-slate-900 dark:text-slate-100">
              {account.role}
            </p>
          </div>
          <div className="rounded-sm bg-slate-50 px-4 py-4 dark:bg-slate-900 md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Avatar
            </p>
            <p className="mt-2 break-all text-sm text-slate-900 dark:text-slate-100">
              {account.avatar || "No avatar image configured"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-sm border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-4">
            {account.avatar ? (
              <Image
                src={account.avatar}
                alt={`${account.firstName} ${account.lastName}`}
                width={80}
                height={80}
                unoptimized
                className="h-20 w-20 rounded-sm object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-sm bg-slate-950 text-2xl font-semibold text-white dark:bg-slate-100 dark:text-slate-950">
                {getInitials(account)}
              </div>
            )}

            <div>
              <p className="text-lg font-semibold text-slate-950 dark:text-slate-50">
                {account.firstName} {account.lastName}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {account.email}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
            Account Actions
          </p>
          <div className="mt-4 grid gap-3">
            <Button asChild type="button" className="rounded-sm text-white" style={{ backgroundColor: "#033a6d" }}>
              <Link href="/dashboard/account/edit">Edit account details</Link>
            </Button>
            <Button asChild type="button" variant="outline" className="rounded-sm">
              <Link href="/dashboard/account/password">Change password</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
