import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { serializeAccount, serializeProject } from "@/lib/admin-dashboard";
import { ConnectDB } from "@/lib/config";
import Project from "@/models/project";
import User from "@/models/user";

export async function requireAdminSession() {
  const session = await auth();

  if (!session?.user?._id) {
    redirect("/login?callbackUrl=%2Fdashboard%2Fprojects");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  await ConnectDB();

  return session;
}

export async function getDashboardAccount() {
  const session = await requireAdminSession();
  const normalizedEmail = session.user.email?.toLowerCase() ?? "";
  const account =
    (normalizedEmail
      ? await User.findOne({ email: normalizedEmail }).lean()
      : null) ??
    (session.user._id ? await User.findById(session.user._id).lean() : null);

  const sessionFirstName =
    session.user.first_name ??
    session.user.firstName ??
    session.user.name?.split(" ").filter(Boolean)[0] ??
    "";
  const sessionLastName =
    session.user.last_name ??
    session.user.lastName ??
    session.user.name?.split(" ").filter(Boolean).slice(1).join(" ") ??
    "";

  return serializeAccount(
    account ?? {
      id: session.user._id,
      first_name: sessionFirstName,
      last_name: sessionLastName,
      email: session.user.email,
      avatar: session.user.avatar,
      role: session.user.role,
    },
  );
}

export async function getDashboardProjects() {
  await requireAdminSession();
  const projects = await Project.find().sort({ createdAt: -1 });

  return projects.map((project) => serializeProject(project));
}

export async function getDashboardProjectById(id: string) {
  await requireAdminSession();
  const project = await Project.findById(id);

  if (!project) {
    redirect("/dashboard/projects");
  }

  return serializeProject(project);
}
