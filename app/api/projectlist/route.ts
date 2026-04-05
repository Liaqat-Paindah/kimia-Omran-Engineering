import { NextResponse } from "next/server";
import { serializeProject } from "@/lib/admin-dashboard";
import { ConnectDB } from "@/lib/config";
import Project from "@/models/project";

export async function GET() {
  try {
    await ConnectDB();

    const projects = await Project.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      projects: projects.map((project) => serializeProject(project)),
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch projects",
      },
      { status: 500 }
    );
  }
}
