
import DashboardPageShell from "@/components/dashboard/dashboard-page-shell";
import ProjectListPage from "@/components/dashboard/project-list-page";
import { getDashboardAccount, getDashboardProjects } from "@/lib/dashboard-server";

export default async function DashboardProjectsPage() {
  const [account, projects] = await Promise.all([
    getDashboardAccount(),
    getDashboardProjects(),
  ]);

  return (
    <DashboardPageShell
      account={account}
    
    >
      <ProjectListPage initialProjects={projects} />
    </DashboardPageShell>
  );
}
