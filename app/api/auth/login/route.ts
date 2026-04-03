import { NextResponse } from "next/server";
import User from "@/models/user";
import { ConnectDB } from "@/lib/config";

export async function POST(req: Request) {
  try {
    await ConnectDB();
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found with this email",
        },
        { status: 401 },
      );
    }

    const isValidPassword = await user.comparePassword(password);

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
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
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
