import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch (err) {
    console.error("[auth/login] Failed to parse JSON body", { err });
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const { email, password } = (body ?? {}) as {
    email?: unknown;
    password?: unknown;
  };

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 }
    );
  }

  if (!email.trim() || !password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (!user.password) {
      console.error("[auth/login] User record missing password hash", {
        userId: user.id,
        email,
      });
      return NextResponse.json({ message: "Server error" }, { status: 500 });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const response = NextResponse.json({
      id: user.id,
      name: user.name,
      role: user.role,
    });

    response.cookies.set("userId", user.id, {
      httpOnly: true,
      path: "/",
    });

    response.cookies.set("userRole", user.role, {
      httpOnly: true,
      path: "/",
    });

    response.cookies.set("userName", user.name, {
      httpOnly: true,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[auth/login] Unexpected error", {
      err,
      email,
    });
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

