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

  const handleNewProject = () => {
    router.push("/dashboard/projects/new");
  };

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

      <section className="rounded-sm border border-slate-200/80 p-6 shadow-sm dark:border-slate-800">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">
              Project List
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
          <button
            type="button"
            onClick={handleNewProject}
            className="rounded-sm bg-[#00b3aa] px-4 py-2 text-sm font-semibold text-white hover:bg-[#009d94] focus:outline-none focus:ring-2 focus:ring-[#00b3aa] focus:ring-offset-2 dark:bg-[#009d94] dark:hover:bg-[#008a82] dark:focus:ring-[#009d94]"
          >
            Add Project
          </button>
        </div>

        <div className="mt-6 overflow-x-auto">
          {filteredProjects.length === 0 ? (
            <div className="rounded-sm border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              No projects found.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-900/70">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    Project
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    Location
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    Start Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    End Date
                  </th>
                  <th
                    scope="col"
                    className="relative px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950">
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        {project.image ? (
                          <div className="h-10 w-10 shrink-0">
                            <Image
                              src={project.image}
                              alt={project.name}
                              width={40}
                              height={40}
                              unoptimized
                              className="h-10 w-10 rounded-sm object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 shrink-0 rounded-sm bg-slate-100 dark:bg-slate-800"></div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {project.name}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {project.constructionType}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {project.location}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {formatDashboardDate(project.startDate)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {formatDashboardDate(project.endDate)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex gap-2">
                        <Button
                          asChild
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-sm"
                        >
                          <Link href={`/dashboard/projects/${project.id}/edit`}>
                            <Edit3 className="h-3 w-3 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="rounded-sm"
                          onClick={() => handleDelete(project.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
