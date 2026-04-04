import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { createProjectSlug, serializeProject } from "@/lib/admin-dashboard";
import { ConnectDB } from "@/lib/config";
import Project from "@/models/project";

const projectSchema = z
  .object({
    name: z.string().trim().min(2, "Project name is required."),
    slug: z.string().trim().optional().default(""),
    description: z.string().trim().min(10, "Description is required."),
    image: z.string().trim().min(1, "Image is required."),
    startDate: z.string().trim().min(1, "Start date is required."),
    endDate: z.string().trim().min(1, "End date is required."),
    location: z.string().trim().min(2, "Location is required."),
    constructionType: z
      .string()
      .trim()
      .min(2, "Construction type is required."),
  })
  .superRefine((value, ctx) => {
    if (Number.isNaN(new Date(value.startDate).getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startDate"],
        message: "Start date is invalid.",
      });
    }

    if (Number.isNaN(new Date(value.endDate).getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date is invalid.",
      });
    }

    if (new Date(value.endDate) < new Date(value.startDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date must be after the start date.",
      });
    }
  });

async function requireAdmin() {
  const session = await auth();

  if (!session?.user?._id) {
    return NextResponse.json(
      { message: "You must be signed in to continue." },
      { status: 401 },
    );
  }

  if (session.user.role !== "admin") {
    return NextResponse.json(
      { message: "Administrator access is required." },
      { status: 403 },
    );
  }

  return null;
}

async function readProjectId(context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return {
      id: null,
      error: NextResponse.json(
        { message: "Invalid project id." },
        { status: 400 },
      ),
    };
  }

  return { id, error: null };
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const authorizationError = await requireAdmin();

  if (authorizationError) {
    return authorizationError;
  }

  const { id, error } = await readProjectId(context);

  if (error) {
    return error;
  }

  if (!id) {
    return NextResponse.json(
      { message: "Invalid project id." },
      { status: 400 },
    );
  }

  await ConnectDB();

  const parsed = projectSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: parsed.error.issues[0]?.message ?? "Invalid project payload.",
      },
      { status: 400 },
    );
  }

  const normalizedSlug = createProjectSlug(parsed.data.slug || parsed.data.name);

  if (!normalizedSlug) {
    return NextResponse.json(
      { message: "A valid slug could not be generated." },
      { status: 400 },
    );
  }

  const existingProject = await Project.findOne({
    slug: normalizedSlug,
    _id: { $ne: id },
  });

  if (existingProject) {
    return NextResponse.json(
      { message: "That slug is already in use." },
      { status: 409 },
    );
  }

  const project = await Project.findByIdAndUpdate(
    id,
    {
      ...parsed.data,
      slug: normalizedSlug,
      startDate: new Date(parsed.data.startDate),
      endDate: new Date(parsed.data.endDate),
    },
    { new: true },
  );

  if (!project) {
    return NextResponse.json(
      { message: "Project not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    message: "Project updated successfully.",
    project: serializeProject(project),
  });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const authorizationError = await requireAdmin();

  if (authorizationError) {
    return authorizationError;
  }

  const { id, error } = await readProjectId(context);

  if (error) {
    return error;
  }

  if (!id) {
    return NextResponse.json(
      { message: "Invalid project id." },
      { status: 400 },
    );
  }

  await ConnectDB();

  const project = await Project.findByIdAndDelete(id);

  if (!project) {
    return NextResponse.json(
      { message: "Project not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({ message: "Project deleted successfully." });
}
