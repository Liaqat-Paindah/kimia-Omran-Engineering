export type DashboardProject = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  location: string;
  constructionType: string;
  createdAt: string;
  updatedAt: string;
};

export type DashboardAccount = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  role: string;
};

export type DashboardSection = "projects" | "account";

export type DashboardProjectForm = {
  name: string;
  slug: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  location: string;
  constructionType: string;
};

export type DashboardPasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export function createProjectSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function getDateInputValue(value: string) {
  return value.slice(0, 10);
}

export function formatDashboardDate(value: string) {
  const isoDate = getDateInputValue(value);
  const [year, month, day] = isoDate.split("-");

  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

export function serializeProject(project: {
  _id?: { toString(): string };
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  location?: string;
  constructionType?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}) {
  return {
    id: project._id?.toString() ?? project.id ?? "",
    name: project.name ?? "",
    slug: project.slug ?? "",
    description: project.description ?? "",
    image: project.image ?? "",
    startDate: new Date(project.startDate ?? Date.now()).toISOString(),
    endDate: new Date(project.endDate ?? Date.now()).toISOString(),
    location: project.location ?? "",
    constructionType: project.constructionType ?? "",
    createdAt: new Date(project.createdAt ?? Date.now()).toISOString(),
    updatedAt: new Date(project.updatedAt ?? Date.now()).toISOString(),
  } satisfies DashboardProject;
}

export function serializeAccount(user: {
  _id?: { toString(): string };
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  avatar?: string | null;
  role?: string | null;
}) {
  return {
    id: user._id?.toString() ?? user.id ?? "",
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    email: user.email ?? "",
    avatar: user.avatar ?? "",
    role: user.role ?? "user",
  } satisfies DashboardAccount;
}
