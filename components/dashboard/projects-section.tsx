"use client";

import Image from "next/image";
import { Edit3, ImagePlus, Search, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  formatDashboardDate,
  type DashboardProject,
  type DashboardProjectForm,
} from "@/lib/admin-dashboard";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#00b3aa]";

export default function ProjectsSection({
  projects,
  search,
  editingId,
  projectForm,
  isProjectSaving,
  projectImagePreview,
  projectImageName,
  onSearchChange,
  onProjectChange,
  onProjectImageChange,
  onProjectSubmit,
  onGenerateSlug,
  onResetEditor,
  onEdit,
  onDelete,
}: {
  projects: DashboardProject[];
  search: string;
  editingId: string | null;
  projectForm: DashboardProjectForm;
  isProjectSaving: boolean;
  projectImagePreview: string;
  projectImageName: string;
  onSearchChange: (value: string) => void;
  onProjectChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onProjectImageChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void | Promise<void>;
  onProjectSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onGenerateSlug: () => void;
  onResetEditor: () => void;
  onEdit: (project: DashboardProject) => void;
  onDelete: (projectId: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-sm border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              {editingId ? "Edit Project" : "Add Project"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">
              Project editor
            </h2>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-sm px-4"
              onClick={onGenerateSlug}
            >
              Generate Slug
            </Button>
            {editingId ? (
              <Button
                type="button"
                variant="outline"
                className="rounded-sm px-4"
                onClick={onResetEditor}
              >
                Cancel
              </Button>
            ) : null}
          </div>
        </div>

        <form onSubmit={onProjectSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              className={inputClass}
              name="name"
              value={projectForm.name}
              onChange={onProjectChange}
              placeholder="Project name"
            />
            <input
              className={inputClass}
              name="slug"
              value={projectForm.slug}
              onChange={onProjectChange}
              placeholder="project-slug"
            />
          </div>
          <textarea
            className={`${inputClass} min-h-32 resize-none`}
            name="description"
            value={projectForm.description}
            onChange={onProjectChange}
            placeholder="Project description"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Project Image
              </span>
              <div className="rounded-sm border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-sm bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-slate-100 dark:text-slate-950">
                    <ImagePlus className="h-4 w-4" />
                    Attach image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onProjectImageChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {projectImageName || "PNG, JPG, WEBP"}
                  </span>
                </div>
                {projectImagePreview ? (
                  <Image
                    src={projectImagePreview}
                    alt="Project preview"
                    width={1200}
                    height={480}
                    unoptimized
                    className="mt-4 h-36 w-full rounded-sm object-cover"
                  />
                ) : null}
              </div>
            </label>
            <input
              className={inputClass}
              name="location"
              value={projectForm.location}
              onChange={onProjectChange}
              placeholder="Location"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <input
              className={inputClass}
              type="date"
              name="startDate"
              value={projectForm.startDate}
              onChange={onProjectChange}
            />
            <input
              className={inputClass}
              type="date"
              name="endDate"
              value={projectForm.endDate}
              onChange={onProjectChange}
            />
            <input
              className={inputClass}
              name="constructionType"
              value={projectForm.constructionType}
              onChange={onProjectChange}
              placeholder="Construction type"
            />
          </div>
          <Button
            type="submit"
            className="w-fit rounded-sm px-5 text-white"
            style={{ backgroundColor: "#033a6d" }}
            disabled={isProjectSaving}
          >
            {isProjectSaving
              ? "Saving..."
              : editingId
                ? "Update project"
                : "Create project"}
          </Button>
        </form>
      </div>

      <div className="rounded-sm border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
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
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search projects"
            />
          </label>
        </div>

        <div className="mt-6 space-y-4">
          {projects.length === 0 ? (
            <div className="rounded-sm border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              No projects found.
            </div>
          ) : (
            projects.map((project) => (
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
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-sm px-4"
                      onClick={() => onEdit(project)}
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      className="rounded-sm px-4"
                      onClick={() => onDelete(project.id)}
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
      </div>
    </div>
  );
}
