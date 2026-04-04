import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AdminDashboard from "@/components/dashboard/admin-dashboard";
import { serializeAccount, serializeProject } from "@/lib/admin-dashboard";
import { ConnectDB } from "@/lib/config";
import Project from "@/models/project";
import User from "@/models/user";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?._id) {
    redirect("/login?callbackUrl=%2Fdashboard");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  await ConnectDB();

  const [projects, account] = await Promise.all([
    Project.find().sort({ createdAt: -1 }),
    User.findById(session.user._id),
  ]);

  const initialProjects = projects.map((project) => serializeProject(project));
  const initialAccount = serializeAccount(
    account ?? {
      id: session.user._id,
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      email: session.user.email,
      avatar: session.user.avatar,
      role: session.user.role,
    },
  );

  return (
    <AdminDashboard
      initialProjects={initialProjects}
      initialAccount={initialAccount}
    />
  );
}
