import { NextResponse } from "next/server";
import { z } from "zod";
import User from "@/models/user";
import { ConnectDB } from "@/lib/config";

const loginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    await ConnectDB();

    const parsedBody = loginSchema.safeParse(await req.json());

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid email and password are required",
        },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email: parsedBody.data.email });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found with this email",
        },
        { status: 401 },
      );
    }

    const isValidPassword = await user.comparePassword(parsedBody.data.password);

    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 },
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          _id: user._id.toString(),
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatar: user.avatar ?? null,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Login Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
