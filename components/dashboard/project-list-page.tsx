"use client";

import { useDeferredValue, useState, useTransition } from "react";
import { Edit3, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import ToastStack, { type ToastItem } from "@/components/ui/toast-stack";
import { Button } from "@/components/ui/button";
import {
  createToastId,
  formatDashboardDate,
  type DashboardProject,
} from "@/lib/admin-dashboard";

export default function ProjectListPage({
  initialProjects,
}: {
  initialProjects: DashboardProject[];
}) {
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState(initialProjects);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const deferredSearch = useDeferredValue(search);

  const filteredProjects = !deferredSearch.trim()
    ? projects
    : projects.filter((project) =>
        [
          project.name,
          project.slug,
          project.location,
          project.constructionType,
          project.description,
        ]
          .join(" ")
          .toLowerCase()
          .includes(deferredSearch.trim().toLowerCase()),
      );

  const showToast = (toast: Omit<ToastItem, "id">) => {
    const id = createToastId();
    setToasts((current) => [...current, { id, ...toast }]);
  };

  const dismissToast = (id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const refreshPage = () => startTransition(() => router.refresh());

  const handleDelete = (projectId: string) => {
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

        showToast({
          title: "Project deleted",
          description: payload.message ?? "Project deleted successfully.",
          variant: "success",
        });
        refreshPage();
      },
    });
  };

  return (
    <>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      <section className="rounded-sm border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Project Listing
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">
              Manage project records
            </h2>
          </div>

          <label className="relative block w-full max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              className="w-full rounded-sm border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-sm text-slate-900 outline-none transition focus:border-[#00b3aa] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects"
            />
          </label>
        </div>

        <div className="mt-6 space-y-4">
          {filteredProjects.length === 0 ? (
            <div className="rounded-sm border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              No projects found.
            </div>
          ) : (
            filteredProjects.map((project) => (
              <article
                key={project.id}
                className="rounded-sm border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/70"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950 dark:text-slate-50">
                      {project.name}
                    </h3>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      {project.slug} / {project.constructionType}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button asChild type="button" variant="outline" className="rounded-sm px-4">
                      <Link href={`/dashboard/projects/${project.id}/edit`}>
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      className="rounded-sm px-4"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>

                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.name}
                    width={1200}
                    height={640}
                    unoptimized
                    className="mt-4 h-44 w-full rounded-sm object-cover"
                  />
                ) : null}

                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {project.description}
                </p>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-sm bg-white px-4 py-3 text-sm text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                    {project.location}
                  </div>
                  <div className="rounded-sm bg-white px-4 py-3 text-sm text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                    {formatDashboardDate(project.startDate)}
                  </div>
                  <div className="rounded-sm bg-white px-4 py-3 text-sm text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                    {formatDashboardDate(project.endDate)}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {isRefreshing ? (
          <p className="mt-4 text-xs uppercase tracking-[0.22em] text-slate-400">
            Refreshing project list...
          </p>
        ) : null}
      </section>
    </>
  );
}
