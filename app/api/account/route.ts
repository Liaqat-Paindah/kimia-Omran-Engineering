import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { serializeAccount } from "@/lib/admin-dashboard";
import { ConnectDB } from "@/lib/config";
import User from "@/models/user";

const accountSchema = z.object({
  firstName: z.string().trim().min(2, "First name is required."),
  lastName: z.string().trim().min(2, "Last name is required."),
  email: z.string().trim().email("A valid email is required."),
  avatar: z.string().trim().min(1, "Avatar image is required."),
});

async function requireAdmin() {
  const session = await auth();

  if (!session?.user?._id) {
    return {
      session: null,
      error: NextResponse.json(
        { message: "You must be signed in to continue." },
        { status: 401 },
      ),
    };
  }

  if (session.user.role !== "admin") {
    return {
      session: null,
      error: NextResponse.json(
        { message: "Administrator access is required." },
        { status: 403 },
      ),
    };
  }

  return { session, error: null };
}

export async function GET() {
  const { session, error } = await requireAdmin();

  if (error) {
    return error;
  }

  if (!session?.user?._id) {
    return NextResponse.json(
      { message: "You must be signed in to continue." },
      { status: 401 },
    );
  }

  await ConnectDB();

  const user = await User.findById(session.user._id);

  if (!user) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ account: serializeAccount(user) });
}

export async function PATCH(request: Request) {
  const { session, error } = await requireAdmin();

  if (error) {
    return error;
  }

  if (!session?.user?._id) {
    return NextResponse.json(
      { message: "You must be signed in to continue." },
      { status: 401 },
    );
  }

  await ConnectDB();

  const parsed = accountSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: parsed.error.issues[0]?.message ?? "Invalid account payload.",
      },
      { status: 400 },
    );
  }

  const existingUser = await User.findOne({
    email: parsed.data.email.toLowerCase(),
    _id: { $ne: session.user._id },
  });

  if (existingUser) {
    return NextResponse.json(
      { message: "That email address is already in use." },
      { status: 409 },
    );
  }

  const user = await User.findByIdAndUpdate(
    session.user._id,
    {
      ...parsed.data,
      email: parsed.data.email.toLowerCase(),
    },
    { new: true },
  );

  if (!user) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  return NextResponse.json({
    message: "Account details updated successfully.",
    account: serializeAccount(user),
  });
}
