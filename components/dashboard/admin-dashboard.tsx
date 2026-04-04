"use client";

import { useDeferredValue, useState, useTransition } from "react";
import { ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import SignOutButton from "@/components/sign-out-button";
import AccountSettingsSection from "@/components/dashboard/account-settings-section";
import ProjectsSection from "@/components/dashboard/projects-section";
import ToastStack, { type ToastItem } from "@/components/ui/toast-stack";
import {
  createToastId,
  createProjectSlug,
  getDateInputValue,
  type DashboardAccount,
  type DashboardPasswordForm,
  type DashboardProject,
  type DashboardProjectForm,
  type DashboardSection,
} from "@/lib/admin-dashboard";

const emptyProject: DashboardProjectForm = {
  name: "",
  slug: "",
  description: "",
  image: "",
  startDate: "",
  endDate: "",
  location: "",
  constructionType: "",
};

const emptyPassword: DashboardPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function AdminDashboard({
  initialProjects,
  initialAccount,
}: {
  initialProjects: DashboardProject[];
  initialAccount: DashboardAccount;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { update } = useSession();
  const [isRefreshing, startTransition] = useTransition();
  const [projects, setProjects] = useState(initialProjects);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [projectForm, setProjectForm] =
    useState<DashboardProjectForm>(emptyProject);
  const [projectImageName, setProjectImageName] = useState("");
  const [accountForm, setAccountForm] = useState(initialAccount);
  const [passwordForm, setPasswordForm] =
    useState<DashboardPasswordForm>(emptyPassword);
  const [isProjectSaving, setIsProjectSaving] = useState(false);
  const [isAccountSaving, setIsAccountSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const deferredSearch = useDeferredValue(search);
  const activeSection: DashboardSection =
    searchParams.get("tab") === "account" ? "account" : "projects";

  const filteredProjects = !deferredSearch.trim()
    ? projects
    : projects.filter((project) =>
        [project.name, project.slug, project.location, project.constructionType]
          .join(" ")
          .toLowerCase()
          .includes(deferredSearch.trim().toLowerCase()),
      );

  const refreshDashboard = () => startTransition(() => router.refresh());

  const setActiveSection = (section: DashboardSection) => {
    const params = new URLSearchParams(searchParams.toString());

    if (section === "projects") {
      params.delete("tab");
    } else {
      params.set("tab", section);
    }

    const query = params.toString();
    router.replace(query ? `/dashboard?${query}` : "/dashboard", {
      scroll: false,
    });
  };

  const showToast = (toast: Omit<ToastItem, "id">) => {
    const id = createToastId();
    setToasts((current) => [...current, { id, ...toast }]);
  };

  const dismissToast = (id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const resetProjectEditor = () => {
    setEditingId(null);
    setProjectForm(emptyProject);
    setProjectImageName("");
  };

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
    setActiveSection("projects");
    setEditingId(project.id);
    setProjectForm({
      name: project.name,
      slug: project.slug,
      description: project.description,
      image: project.image,
      startDate: getDateInputValue(project.startDate),
      endDate: getDateInputValue(project.endDate),
      location: project.location,
      constructionType: project.constructionType,
    });
    setProjectImageName("");
  };

  const handleAccountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setAccountForm((current) => ({ ...current, [name]: value }));
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setPasswordForm((current) => ({ ...current, [name]: value }));
  };

  const handleProjectSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsProjectSaving(true);

    const response = await fetch(
      editingId ? `/api/projects/${editingId}` : "/api/projects",
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectForm),
      },
    );

    const payload = (await response.json()) as {
      message?: string;
      project?: DashboardProject;
    };

    setIsProjectSaving(false);

    if (!response.ok || !payload.project) {
      showToast({
        title: "Project update failed",
        description: payload.message ?? "Unable to save the project.",
        variant: "error",
      });
      return;
    }

    const savedProject = payload.project;

    setProjects((current) =>
      editingId
        ? current.map((project) =>
            project.id === savedProject.id ? savedProject : project,
          )
        : [savedProject, ...current],
    );

    resetProjectEditor();
    showToast({
      title: editingId ? "Project updated" : "Project created",
      description: payload.message ?? "Project saved.",
      variant: "success",
    });
    refreshDashboard();
  };

  const handleDelete = async (projectId: string) => {
    showToast({
      title: "Delete this project?",
      description: "This action permanently removes the project record.",
      variant: "warning",
      actionLabel: "Delete",
      persistent: true,
      onAction: async () => {
        const response = await fetch(`/api/projects/${projectId}`, {
          method: "DELETE",
        });

        const payload = (await response.json()) as { message?: string };

        if (!response.ok) {
          showToast({
            title: "Delete failed",
            description: payload.message ?? "Unable to delete the project.",
            variant: "error",
          });
          return;
        }

        setProjects((current) =>
          current.filter((project) => project.id !== projectId),
        );

        if (editingId === projectId) {
          resetProjectEditor();
        }

        showToast({
          title: "Project deleted",
          description: payload.message ?? "Project deleted.",
          variant: "success",
        });
        refreshDashboard();
      },
    });
  };

  const handleAccountSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsAccountSaving(true);

    const response = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(accountForm),
    });

    const payload = (await response.json()) as {
      message?: string;
      account?: DashboardAccount;
    };

    setIsAccountSaving(false);

    if (!response.ok || !payload.account) {
      showToast({
        title: "Account update failed",
        description: payload.message ?? "Unable to update the account.",
        variant: "error",
      });
      return;
    }

    setAccountForm(payload.account);

    await update({
      email: payload.account.email,
      firstName: payload.account.firstName,
      lastName: payload.account.lastName,
      role: payload.account.role,
      avatar: payload.account.avatar,
    });

    showToast({
      title: "Account updated",
      description: payload.message ?? "Account updated.",
      variant: "success",
    });
    refreshDashboard();
  };

  const handlePasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsPasswordSaving(true);

    const response = await fetch("/api/account/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passwordForm),
    });

    const payload = (await response.json()) as { message?: string };

    setIsPasswordSaving(false);

    if (!response.ok) {
      showToast({
        title: "Password update failed",
        description: payload.message ?? "Unable to update the password.",
        variant: "error",
      });
      return;
    }

    setPasswordForm(emptyPassword);
    showToast({
      title: "Password updated",
      description: payload.message ?? "Password updated.",
      variant: "success",
    });
  };

  const handleProjectImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      showToast({
        title: "Unsupported file",
        description: "Please attach a valid image file.",
        variant: "error",
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";

      setProjectForm((current) => ({
        ...current,
        image: result,
      }));
      setProjectImageName(file.name);
      showToast({
        title: "Image attached",
        description: `${file.name} is ready to be saved with the project.`,
        variant: "success",
      });
    };

    reader.onerror = () => {
      showToast({
        title: "Image upload failed",
        description: "The selected file could not be processed.",
        variant: "error",
      });
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#effaf7_0%,#f8fafc_45%,#eef4ff_100%)] px-4 py-8 dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_45%,#111827_100%)] sm:px-6 lg:px-8">
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-sm bg-slate-950 px-6 py-8 text-white shadow-[0_30px_80px_rgba(3,58,109,0.28)] dark:border dark:border-slate-800">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-sm bg-[#00b3aa]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#00b3aa]">
                <ShieldCheck className="h-3.5 w-3.5" />
                Admin Dashboard
              </div>
              <h1 className="mt-4 text-3xl font-semibold md:text-5xl">
                Projects, account details, and security in one place.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Create, edit, and delete project records while keeping the
                administrator profile and password current.
              </p>
            </div>

            <div className="rounded-sm border border-white/10 bg-white/6 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                Signed in as
              </p>
              <p className="mt-2 text-xl font-semibold">
                {accountForm.firstName} {accountForm.lastName}
              </p>
              <p className="mt-1 text-sm text-slate-300">{accountForm.email}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="rounded-sm bg-[#00b3aa]/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#00b3aa]">
                  {accountForm.role}
                </span>
                <SignOutButton
                  className="inline-flex rounded-sm bg-white px-4 py-2 text-sm font-semibold text-slate-950"
                  label="Sign Out"
                  pendingLabel="Signing out..."
                  redirectTo="/login"
                />
              </div>
            </div>
          </div>
        </section>

        {activeSection === "projects" ? (
          <ProjectsSection
            projects={filteredProjects}
            search={search}
            editingId={editingId}
            projectForm={projectForm}
            isProjectSaving={isProjectSaving}
            projectImagePreview={projectForm.image}
            projectImageName={projectImageName}
            onSearchChange={setSearch}
            onProjectChange={handleProjectChange}
            onProjectImageChange={handleProjectImageChange}
            onProjectSubmit={handleProjectSubmit}
            onGenerateSlug={() =>
              setProjectForm((current) => ({
                ...current,
                slug: createProjectSlug(current.slug || current.name),
              }))
            }
            onResetEditor={resetProjectEditor}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <AccountSettingsSection
            accountForm={accountForm}
            passwordForm={passwordForm}
            isAccountSaving={isAccountSaving}
            isPasswordSaving={isPasswordSaving}
            isRefreshing={isRefreshing}
            onAccountChange={handleAccountChange}
            onPasswordChange={handlePasswordChange}
            onAccountSubmit={handleAccountSubmit}
            onPasswordSubmit={handlePasswordSubmit}
          />
        )}
      </div>
    </main>
  );
}
