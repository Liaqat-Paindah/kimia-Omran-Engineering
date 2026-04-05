import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { ConnectDB } from "@/lib/config";
import User from "@/models/user";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required."),
    newPassword: z.string().min(6, "New password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Please confirm the new password."),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "The new password confirmation does not match.",
  })
  .refine((value) => value.currentPassword !== value.newPassword, {
    path: ["newPassword"],
    message: "Choose a different password from the current one.",
  });

export async function PATCH(request: Request) {
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

  await ConnectDB();

  const parsed = passwordSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      {
        message:
          parsed.error.issues[0]?.message ?? "Invalid password change payload.",
      },
      { status: 400 },
    );
  }

  const user = await User.findById(session.user._id);

  if (!user) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  const isValidPassword = await user.comparePassword(parsed.data.currentPassword);

  if (!isValidPassword) {
    return NextResponse.json(
      { message: "The current password you entered is incorrect." },
      { status: 400 },
    );
  }

  user.password = parsed.data.newPassword;
  await user.save();

  return NextResponse.json({
    message: "Password updated successfully.",
  });
}
