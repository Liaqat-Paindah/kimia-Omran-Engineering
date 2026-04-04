"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import ToastStack, { type ToastItem } from "@/components/ui/toast-stack";
import { Button } from "@/components/ui/button";
import {
  createToastId,
  createProjectSlug,
  emptyProjectForm,
  type DashboardProject,
  type DashboardProjectForm,
} from "@/lib/admin-dashboard";

const inputClass =
  "w-full rounded-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#00b3aa] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

export default function ProjectFormPage({
  mode,
  initialProject,
}: {
  mode: "create" | "edit";
  initialProject?: DashboardProjectForm & { id?: string };
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [projectImageName, setProjectImageName] = useState("");
  const [projectForm, setProjectForm] = useState<DashboardProjectForm>(
    initialProject ?? emptyProjectForm,
  );
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (toast: Omit<ToastItem, "id">) => {
    const id = createToastId();
    setToasts((current) => [...current, { id, ...toast }]);
  };

  const dismissToast = (id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setProjectForm((current) => ({
      ...current,
      [name]: name === "slug" ? createProjectSlug(value) : value,
    }));
  };

  const handleProjectImageChange = (
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    const response = await fetch(
      mode === "edit" && initialProject?.id
        ? `/api/projects/${initialProject.id}`
        : "/api/projects",
      {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectForm),
      },
    );

    const payload = (await response.json()) as {
      message?: string;
      project?: DashboardProject;
    };

    setIsSaving(false);

    if (!response.ok || !payload.project) {
      showToast({
        title: mode === "edit" ? "Project update failed" : "Project creation failed",
        description: payload.message ?? "Unable to save the project.",
        variant: "error",
      });
      return;
    }

    showToast({
      title: mode === "edit" ? "Project updated" : "Project created",
      description: payload.message ?? "Project saved successfully.",
      variant: "success",
    });

    if (mode === "create") {
      setProjectForm(emptyProjectForm);
      setProjectImageName("");
      return;
    }

    router.refresh();
  };

  return (
    <>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      <section className="rounded-sm border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              {mode === "edit" ? "Edit Project" : "New Project"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">
              {mode === "edit" ? "Update project details" : "Create a new project"}
            </h2>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-sm px-4"
              onClick={() =>
                setProjectForm((current) => ({
                  ...current,
                  slug: createProjectSlug(current.slug || current.name),
                }))
              }
            >
              Generate Slug
            </Button>
            <Button asChild type="button" variant="outline" className="rounded-sm px-4">
              <Link href="/dashboard/projects">Back to list</Link>
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              className={inputClass}
              name="name"
              value={projectForm.name}
              onChange={handleChange}
              placeholder="Project name"
            />
            <input
              className={inputClass}
              name="slug"
              value={projectForm.slug}
              onChange={handleChange}
              placeholder="project-slug"
            />
          </div>

          <textarea
            className={`${inputClass} min-h-32 resize-none`}
            name="description"
            value={projectForm.description}
            onChange={handleChange}
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
                      onChange={handleProjectImageChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {projectImageName || "PNG, JPG, WEBP"}
                  </span>
                </div>
                {projectForm.image ? (
                  <Image
                    src={projectForm.image}
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
              onChange={handleChange}
              placeholder="Location"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <input
              className={inputClass}
              type="date"
              name="startDate"
              value={projectForm.startDate}
              onChange={handleChange}
            />
            <input
              className={inputClass}
              type="date"
              name="endDate"
              value={projectForm.endDate}
              onChange={handleChange}
            />
            <input
              className={inputClass}
              name="constructionType"
              value={projectForm.constructionType}
              onChange={handleChange}
              placeholder="Construction type"
            />
          </div>

          <Button
            type="submit"
            className="w-fit rounded-sm px-5 text-white"
            style={{ backgroundColor: "#033a6d" }}
            disabled={isSaving}
          >
            {isSaving
              ? "Saving..."
              : mode === "edit"
                ? "Update project"
                : "Create project"}
          </Button>
        </form>
      </section>
    </>
  );
}
