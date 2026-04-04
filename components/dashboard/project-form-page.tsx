"use client";

import { useState } from "react";
import { ImagePlus, X } from "lucide-react";
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
  "w-full rounded-sm border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-[#00b3aa] focus:ring-1 focus:ring-[#00b3aa] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-[#00b3aa]";
const labelClass = "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300";
const sectionClass = "rounded-sm border border-slate-200 dark:border-slate-800 p-6";

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
        description: "Please attach a valid image file (PNG, JPG, WEBP).",
        variant: "error",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast({
        title: "File too large",
        description: "Image size should not exceed 5MB.",
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
        description: `${file.name} has been added successfully.`,
        variant: "success",
      });
    };

    reader.onerror = () => {
      showToast({
        title: "Image upload failed",
        description: "The selected file could not be processed. Please try again.",
        variant: "error",
      });
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleRemoveImage = () => {
    setProjectForm((current) => ({
      ...current,
      image: "",
    }));
    setProjectImageName("");
    showToast({
      title: "Image removed",
      description: "Project image has been removed.",
    });
  };

  const validateForm = (): boolean => {
    if (!projectForm.name.trim()) {
      showToast({
        title: "Validation error",
        description: "Project name is required.",
        variant: "error",
      });
      return false;
    }

    if (!projectForm.slug.trim()) {
      showToast({
        title: "Validation error",
        description: "Project slug is required.",
        variant: "error",
      });
      return false;
    }

    if (!projectForm.description.trim()) {
      showToast({
        title: "Validation error",
        description: "Project description is required.",
        variant: "error",
      });
      return false;
    }

    if (!projectForm.location.trim()) {
      showToast({
        title: "Validation error",
        description: "Project location is required.",
        variant: "error",
      });
      return false;
    }

    if (!projectForm.startDate) {
      showToast({
        title: "Validation error",
        description: "Start date is required.",
        variant: "error",
      });
      return false;
    }

    if (!projectForm.endDate) {
      showToast({
        title: "Validation error",
        description: "End date is required.",
        variant: "error",
      });
      return false;
    }

    if (new Date(projectForm.endDate) < new Date(projectForm.startDate)) {
      showToast({
        title: "Validation error",
        description: "End date cannot be earlier than start date.",
        variant: "error",
      });
      return false;
    }

    if (!projectForm.constructionType.trim()) {
      showToast({
        title: "Validation error",
        description: "Construction type is required.",
        variant: "error",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

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
        title: mode === "edit" ? "Update failed" : "Creation failed",
        description: payload.message ?? "Unable to save the project. Please try again.",
        variant: "error",
      });
      return;
    }

    showToast({
      title: mode === "edit" ? "Project updated" : "Project created",
      description: payload.message ?? `Project ${mode === "edit" ? "updated" : "created"} successfully.`,
      variant: "success",
    });

    if (mode === "create") {
      setProjectForm(emptyProjectForm);
      setProjectImageName("");
      return;
    }

    router.refresh();
    router.push("/dashboard/projects");
  };

  const handleGenerateSlug = () => {
    const generatedSlug = createProjectSlug(projectForm.slug || projectForm.name);
    setProjectForm((current) => ({
      ...current,
      slug: generatedSlug,
    }));
    showToast({
      title: "Slug generated",
      description: `Slug has been generated: ${generatedSlug}`,
      variant: "success",
    });
  };

  return (
    <>
      <ToastStack toasts={toasts} z-9999 onDismiss={dismissToast} />

      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Link href="/dashboard/projects" className="hover:text-[#00b3aa] transition-colors">
              Projects
            </Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-100">
              {mode === "edit" ? "Edit Project" : "New Project"}
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">
            {mode === "edit" ? "Edit Project" : "Create New Project"}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {mode === "edit"
              ? "Update the project details below."
              : "Fill in the form below to create a new project."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className={sectionClass}>
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  className={inputClass}
                  name="name"
                  value={projectForm.name}
                  onChange={handleChange}
                  placeholder="e.g., Modern Office Tower"
                  required
                />
              </div>

              <div>
                <label htmlFor="slug" className={labelClass}>
                  Project Slug <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    id="slug"
                    className={`${inputClass} flex-1`}
                    name="slug"
                    value={projectForm.slug}
                    onChange={handleChange}
                    placeholder="e.g., modern-office-tower"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerateSlug}
                    className="whitespace-nowrap rounded-sm py-5 px-4 text-sm"
                  >
                    Generate Slug
                  </Button>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  URL-friendly identifier. Use lowercase letters, numbers, and hyphens.
                </p>
              </div>

              <div>
                <label htmlFor="description" className={labelClass}>
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  className={`${inputClass} min-h-32 resize-y`}
                  name="description"
                  value={projectForm.description}
                  onChange={handleChange}
                  placeholder="Provide a detailed description of the project..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Location & Details Section */}
          <div className={sectionClass}>
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Location & Details
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="location" className={labelClass}>
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  id="location"
                  className={inputClass}
                  name="location"
                  value={projectForm.location}
                  onChange={handleChange}
                  placeholder="e.g., New York, NY"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="startDate" className={labelClass}>
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="startDate"
                    className={inputClass}
                    type="date"
                    name="startDate"
                    value={projectForm.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className={labelClass}>
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="endDate"
                    className={inputClass}
                    type="date"
                    name="endDate"
                    value={projectForm.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="constructionType" className={labelClass}>
                  Construction Type <span className="text-red-500">*</span>
                </label>
                <input
                  id="constructionType"
                  className={inputClass}
                  name="constructionType"
                  value={projectForm.constructionType}
                  onChange={handleChange}
                  placeholder="e.g., Commercial, Residential, Industrial"
                  required
                />
              </div>
            </div>
          </div>

          {/* Project Image Section */}
          <div className={sectionClass}>
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Project Image
            </h2>
            <div>
              <label className={labelClass}>Project Image (Optional)</label>
              <div className="rounded-sm border-2 border-dashed border-slate-300 bg-slate-50 p-6 transition-colors hover:border-[#00b3aa] dark:border-slate-700 dark:bg-slate-900">
                {!projectForm.image ? (
                  <div className="text-center">
                    <label className="inline-flex cursor-pointer flex-col items-center gap-2">
                      <div className="rounded-sm bg-slate-200 p-3 dark:bg-slate-800">
                        <ImagePlus className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Click to upload
                      </span>
                      <span className="text-xs text-slate-500">
                        PNG, JPG, WEBP (max. 5MB)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProjectImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute top-2 right-2 z-10">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleRemoveImage}
                        className="rounded-sm p-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Image
                      src={projectForm.image}
                      alt="Project preview"
                      width={1200}
                      height={480}
                      unoptimized
                      className="mx-auto max-h-80 w-auto rounded-sm object-contain"
                    />
                    <p className="mt-2 text-center text-sm text-slate-500">
                      {projectImageName || "Image uploaded"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSaving}
              className="rounded-sm bg-[#00b3aa] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#009d94] focus:outline-none focus:ring-2 focus:ring-[#00b3aa] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving
                ? "Saving..."
                : mode === "edit"
                ? "Update Project"
                : "Create Project"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/projects")}
              className="rounded-sm px-6 py-2.5"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}