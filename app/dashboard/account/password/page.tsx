import DashboardPageShell from "@/components/dashboard/dashboard-page-shell";
import AccountPasswordFormPage from "@/components/dashboard/account-password-form-page";
import { getDashboardAccount } from "@/lib/dashboard-server";

export default async function DashboardAccountPasswordPage() {
  const account = await getDashboardAccount();

  return (
    <DashboardPageShell
      account={account}
    >
      <AccountPasswordFormPage />
    </DashboardPageShell>
  );
}
