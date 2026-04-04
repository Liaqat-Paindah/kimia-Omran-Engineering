"use client";

import { useDeferredValue, useState, useTransition } from "react";
import { Edit3, Search, ShieldCheck, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import type {
  DashboardAccount,
  DashboardProject,
} from "@/lib/admin-dashboard";
import { createProjectSlug } from "@/lib/admin-dashboard";
import SignOutButton from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";

type ProjectForm = {
  name: string;
  slug: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  location: string;
  constructionType: string;
};

const emptyProject: ProjectForm = {
  name: "",
  slug: "",
  description: "",
  image: "",
  startDate: "",
  endDate: "",
  location: "",
  constructionType: "",
};

const emptyPassword = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#00b3aa]";

export default function AdminDashboard({
  initialProjects,
  initialAccount,
}: {
  initialProjects: DashboardProject[];
  initialAccount: DashboardAccount;
}) {
  const router = useRouter();
  const { update } = useSession();
  const [isRefreshing, startTransition] = useTransition();
  const [projects, setProjects] = useState(initialProjects);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [projectForm, setProjectForm] = useState<ProjectForm>(emptyProject);
  const [projectMessage, setProjectMessage] = useState("");
  const [accountForm, setAccountForm] = useState(initialAccount);
  const [accountMessage, setAccountMessage] = useState("");
  const [passwordForm, setPasswordForm] = useState(emptyPassword);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isProjectSaving, setIsProjectSaving] = useState(false);
  const [isAccountSaving, setIsAccountSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const deferredSearch = useDeferredValue(search);

  const filteredProjects = !deferredSearch.trim()
    ? projects
    : projects.filter((project) =>
        [project.name, project.slug, project.location, project.constructionType]
          .join(" ")
          .toLowerCase()
          .includes(deferredSearch.trim().toLowerCase()),
      );

  const refreshDashboard = () => startTransition(() => router.refresh());

  const handleProjectChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setProjectForm((current) => ({
      ...current,
      [name]: name === "slug" ? createProjectSlug(value) : value,
    }));
  };

  const handleEdit = (project: DashboardProject) => {
    setEditingId(project.id);
    setProjectForm({
      name: project.name,
      slug: project.slug,
      description: project.description,
      image: project.image,
      startDate: project.startDate.slice(0, 10),
      endDate: project.endDate.slice(0, 10),
      location: project.location,
      constructionType: project.constructionType,
    });
    setProjectMessage("");
  };

  const handleAccountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAccountForm((current) => ({ ...current, [name]: value }));
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPasswordForm((current) => ({ ...current, [name]: value }));
  };

  const handleProjectSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProjectMessage("");
    setIsProjectSaving(true);
    const response = await fetch(editingId ? `/api/projects/${editingId}` : "/api/projects", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectForm),
    });
    const payload = (await response.json()) as { message?: string; project?: DashboardProject };
    setIsProjectSaving(false);
    if (!response.ok || !payload.project) return setProjectMessage(payload.message ?? "Unable to save the project.");
    const savedProject = payload.project;
    setProjects((current) =>
      editingId
        ? current.map((project) => (project.id === savedProject.id ? savedProject : project))
        : [savedProject, ...current],
    );
    setEditingId(null);
    setProjectForm(emptyProject);
    setProjectMessage(payload.message ?? "Project saved.");
    refreshDashboard();
  };

  const handleDelete = async (projectId: string) => {
    if (!window.confirm("Delete this project?")) return;
    const response = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
    const payload = (await response.json()) as { message?: string };
    if (!response.ok) return setProjectMessage(payload.message ?? "Unable to delete the project.");
    setProjects((current) => current.filter((project) => project.id !== projectId));
    if (editingId === projectId) {
      setEditingId(null);
      setProjectForm(emptyProject);
    }
    setProjectMessage(payload.message ?? "Project deleted.");
    refreshDashboard();
  };

  const handleAccountSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAccountMessage("");
    setIsAccountSaving(true);
    const response = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(accountForm),
    });
    const payload = (await response.json()) as { message?: string; account?: DashboardAccount };
    setIsAccountSaving(false);
    if (!response.ok || !payload.account) return setAccountMessage(payload.message ?? "Unable to update the account.");
    setAccountForm(payload.account);
    await update({
      email: payload.account.email,
      firstName: payload.account.firstName,
      lastName: payload.account.lastName,
      role: payload.account.role,
      avatar: payload.account.avatar,
    });
    setAccountMessage(payload.message ?? "Account updated.");
    refreshDashboard();
  };

  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordMessage("");
    setIsPasswordSaving(true);
    const response = await fetch("/api/account/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passwordForm),
    });
    const payload = (await response.json()) as { message?: string };
    setIsPasswordSaving(false);
    if (!response.ok) return setPasswordMessage(payload.message ?? "Unable to update the password.");
    setPasswordForm(emptyPassword);
    setPasswordMessage(payload.message ?? "Password updated.");
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#effaf7_0%,#f8fafc_45%,#eef4ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[2rem] bg-slate-950 px-6 py-8 text-white shadow-[0_30px_80px_rgba(3,58,109,0.28)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#00b3aa]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#00b3aa]"><ShieldCheck className="h-3.5 w-3.5" />Admin Dashboard</div>
              <h1 className="mt-4 text-3xl font-semibold md:text-5xl">Projects, account details, and security in one place.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">Create, edit, and delete project records while keeping the administrator profile and password current.</p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Signed in as</p>
              <p className="mt-2 text-xl font-semibold">{accountForm.firstName} {accountForm.lastName}</p>
              <p className="mt-1 text-sm text-slate-300">{accountForm.email}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#00b3aa]/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#00b3aa]">{accountForm.role}</span>
                <SignOutButton className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950" label="Sign Out" pendingLabel="Signing out..." redirectTo="/login" />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    {editingId ? "Edit Project" : "Add Project"}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                    Project editor
                  </h2>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="rounded-full px-4" onClick={() => setProjectForm((current) => ({ ...current, slug: createProjectSlug(current.slug || current.name) }))}>
                    Generate Slug
                  </Button>
                  {editingId ? (
                    <Button type="button" variant="outline" className="rounded-full px-4" onClick={() => { setEditingId(null); setProjectForm(emptyProject); }}>
                      Cancel
                    </Button>
                  ) : null}
                </div>
              </div>
              <form onSubmit={handleProjectSubmit} className="mt-6 grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <input className={inputClass} name="name" value={projectForm.name} onChange={handleProjectChange} placeholder="Project name" />
                  <input className={inputClass} name="slug" value={projectForm.slug} onChange={handleProjectChange} placeholder="project-slug" />
                </div>
                <textarea className={`${inputClass} min-h-32 resize-none`} name="description" value={projectForm.description} onChange={handleProjectChange} placeholder="Project description" />
                <div className="grid gap-4 md:grid-cols-2">
                  <input className={inputClass} name="image" value={projectForm.image} onChange={handleProjectChange} placeholder="Image URL" />
                  <input className={inputClass} name="location" value={projectForm.location} onChange={handleProjectChange} placeholder="Location" />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <input className={inputClass} type="date" name="startDate" value={projectForm.startDate} onChange={handleProjectChange} />
                  <input className={inputClass} type="date" name="endDate" value={projectForm.endDate} onChange={handleProjectChange} />
                  <input className={inputClass} name="constructionType" value={projectForm.constructionType} onChange={handleProjectChange} placeholder="Construction type" />
                </div>
                {projectMessage ? <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{projectMessage}</p> : null}
                <Button type="submit" className="w-fit rounded-full px-5 text-white" style={{ backgroundColor: "#033a6d" }} disabled={isProjectSaving}>
                  {isProjectSaving ? "Saving..." : editingId ? "Update project" : "Create project"}
                </Button>
              </form>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Project Listing</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">Manage project records</h2>
                </div>
                <label className="relative block w-full max-w-sm">
                  <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-sm text-slate-900 outline-none transition focus:border-[#00b3aa]" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects" />
                </label>
              </div>
              <div className="mt-6 space-y-4">
                {filteredProjects.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-600">
                    No projects found.
                  </div>
                ) : (
                  filteredProjects.map((project) => (
                    <article key={project.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-slate-950">{project.name}</h3>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{project.slug} / {project.constructionType}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button type="button" variant="outline" className="rounded-full px-4" onClick={() => handleEdit(project)}>
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button type="button" variant="destructive" className="rounded-full px-4" onClick={() => handleDelete(project.id)}>
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-7 text-slate-600">{project.description}</p>
                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700">{project.location}</div>
                        <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700">{new Date(project.startDate).toLocaleDateString()}</div>
                        <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700">{new Date(project.endDate).toLocaleDateString()}</div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Account Details</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Update user information</h2>
              <form onSubmit={handleAccountSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                  <input className={inputClass} name="firstName" value={accountForm.firstName} onChange={handleAccountChange} placeholder="First name" />
                  <input className={inputClass} name="lastName" value={accountForm.lastName} onChange={handleAccountChange} placeholder="Last name" />
                </div>
                <input className={inputClass} type="email" name="email" value={accountForm.email} onChange={handleAccountChange} placeholder="Email" />
                <input className={inputClass} name="avatar" value={accountForm.avatar} onChange={handleAccountChange} placeholder="Avatar image URL" />
                {accountMessage ? <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{accountMessage}</p> : null}
                <Button type="submit" className="w-full rounded-full text-white" style={{ backgroundColor: "#033a6d" }} disabled={isAccountSaving}>
                  {isAccountSaving ? "Saving account..." : "Save account changes"}
                </Button>
              </form>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Password</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Change password</h2>
              <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
                <input className={inputClass} type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} placeholder="Current password" />
                <input className={inputClass} type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} placeholder="New password" />
                <input className={inputClass} type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} placeholder="Confirm new password" />
                {passwordMessage ? <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{passwordMessage}</p> : null}
                <Button type="submit" className="w-full rounded-full text-white" style={{ backgroundColor: "#033a6d" }} disabled={isPasswordSaving}>
                  {isPasswordSaving ? "Updating password..." : "Update password"}
                </Button>
              </form>
            </div>

            <div className="rounded-[1.75rem] bg-slate-950 p-6 text-white shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Session</p>
              <h2 className="mt-2 text-2xl font-semibold">Protected access</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">Dashboard rendering, proxy redirects, and API routes all require an authenticated admin session.</p>
              <p className="mt-4 text-xs uppercase tracking-[0.22em] text-slate-400">{isRefreshing ? "Refreshing dashboard state..." : "Dashboard state is in sync."}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
