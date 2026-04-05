import type { ReactNode } from "react";

import type { DashboardAccount } from "@/lib/admin-dashboard";

export default function DashboardPageShell({
  children,
}: {
  account: DashboardAccount;
  children: ReactNode;
}) {
  return (
    <main className=" sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {children}
      </div>
    </main>
  );
}
