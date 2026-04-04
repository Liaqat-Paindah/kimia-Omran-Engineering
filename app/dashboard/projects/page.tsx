import Link from "next/link";

import DashboardPageShell from "@/components/dashboard/dashboard-page-shell";
import ProjectListPage from "@/components/dashboard/project-list-page";
import { Button } from "@/components/ui/button";
import { getDashboardAccount, getDashboardProjects } from "@/lib/dashboard-server";

export default async function DashboardProjectsPage() {
  const [account, projects] = await Promise.all([
    getDashboardAccount(),
    getDashboardProjects(),
  ]);

  return (
    <DashboardPageShell
      badge="Projects"
      title="Project list"
      description="Browse current projects, search records, and open a dedicated page to create or edit project data."
      account={account}
      actions={
        <Button asChild type="button" className="rounded-sm text-white" style={{ backgroundColor: "#00b3aa" }}>
          <Link href="/dashboard/projects/new">New Project</Link>
        </Button>
      }
    >
      <ProjectListPage initialProjects={projects} />
    </DashboardPageShell>
  );
}
