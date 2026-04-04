import type { ReactNode } from "react";

import SignOutButton from "@/components/sign-out-button";
import type { DashboardAccount } from "@/lib/admin-dashboard";

export default function DashboardPageShell({
  badge,
  title,
  description,
  account,
  actions,
  children,
}: {
  badge: string;
  title: string;
  description: string;
  account: DashboardAccount;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#effaf7_0%,#f8fafc_45%,#eef4ff_100%)] px-4 py-8 dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_45%,#111827_100%)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-sm bg-slate-950 px-6 py-8 text-white shadow-[0_30px_80px_rgba(3,58,109,0.28)] dark:border dark:border-slate-800">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-sm bg-[#00b3aa]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#00b3aa]">
                {badge}
              </div>
              <h1 className="mt-4 text-3xl font-semibold md:text-5xl">
                {title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                {description}
              </p>
              {actions ? <div className="mt-5 flex flex-wrap gap-3">{actions}</div> : null}
            </div>

            <div className="rounded-sm border border-white/10 bg-white/6 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                Signed in as
              </p>
              <p className="mt-2 text-xl font-semibold">
                {account.firstName} {account.lastName}
              </p>
              <p className="mt-1 text-sm text-slate-300">{account.email}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="rounded-sm bg-[#00b3aa]/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#00b3aa]">
                  {account.role}
                </span>
                <SignOutButton
                  className="inline-flex rounded-sm bg-white px-4 py-2 text-sm font-semibold text-slate-950"
                  label="Sign Out"
                  pendingLabel="Signing out..."
                  redirectTo="/login"
                />
              </div>
            </div>
          </div>
        </section>

        {children}
      </div>
    </main>
  );
}
