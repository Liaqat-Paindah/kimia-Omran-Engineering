import DashboardPageShell from "@/components/dashboard/dashboard-page-shell";
import ProjectFormPage from "@/components/dashboard/project-form-page";
import { getDashboardAccount, getDashboardProjectById } from "@/lib/dashboard-server";
import { projectToForm } from "@/lib/admin-dashboard";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [account, project] = await Promise.all([
    getDashboardAccount(),
    getDashboardProjectById(id),
  ]);

  return (
    <DashboardPageShell
      badge="Projects"
      title="Edit project"
      description="Update project content, replace its image, and keep the timeline and construction details current."
      account={account}
    >
      <ProjectFormPage
        mode="edit"
        initialProject={{ id: project.id, ...projectToForm(project) }}
      />
    </DashboardPageShell>
  );
}
