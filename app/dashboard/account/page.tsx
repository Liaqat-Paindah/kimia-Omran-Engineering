export const dynamic = "force-dynamic";

import DashboardPageShell from "@/components/dashboard/dashboard-page-shell";
import AccountOverviewPage from "@/components/dashboard/account-overview-page";
import { getDashboardAccount } from "@/lib/dashboard-server";

export default async function DashboardAccountPage() {
  const account = await getDashboardAccount();

  return (
    <DashboardPageShell
      account={account}
    >
      <AccountOverviewPage account={account} />
    </DashboardPageShell>
  );
}
