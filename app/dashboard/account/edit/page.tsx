import DashboardPageShell from "@/components/dashboard/dashboard-page-shell";
import AccountDetailsFormPage from "@/components/dashboard/account-details-form-page";
import { getDashboardAccount } from "@/lib/dashboard-server";

export default async function EditDashboardAccountPage() {
  const account = await getDashboardAccount();

  return (
    <DashboardPageShell
      badge="Account"
      title="Edit account details"
      description="Update the administrator name, email address, and avatar reference on a dedicated profile page."
      account={account}
    >
      <AccountDetailsFormPage initialAccount={account} />
    </DashboardPageShell>
  );
}
