import DashboardPageShell from "@/components/dashboard/dashboard-page-shell";
import ProjectFormPage from "@/components/dashboard/project-form-page";
import { getDashboardAccount } from "@/lib/dashboard-server";

export default async function NewProjectPage() {
  const account = await getDashboardAccount();

  return (
    <DashboardPageShell
      badge="Projects"
      title="New project"
      description="Create a project record with dates, construction type, location, and an attached image."
      account={account}
    >
      <ProjectFormPage mode="create" />
    </DashboardPageShell>
  );
}
