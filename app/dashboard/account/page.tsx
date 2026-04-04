import DashboardPageShell from "@/components/dashboard/dashboard-page-shell";
import AccountOverviewPage from "@/components/dashboard/account-overview-page";
import { getDashboardAccount } from "@/lib/dashboard-server";

export default async function DashboardAccountPage() {
  const account = await getDashboardAccount();

  return (
    <DashboardPageShell
      badge="Account"
      title="Account overview"
      description="Review your administrator profile, then open dedicated pages to update profile details or change the password."
      account={account}
    >
      <AccountOverviewPage account={account} />
    </DashboardPageShell>
  );
}
