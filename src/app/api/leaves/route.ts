import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();

  const role = cookieStore.get("userRole")?.value;
  const userId = cookieStore.get("userId")?.value;

  const leaves = await prisma.leave.findMany({
    where:
      role === "ADMIN"
        ? {}
        : { userId: userId ?? "" },

    include: {
      user: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(leaves);
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();

  const role = cookieStore.get("userRole")?.value;
  const userId = cookieStore.get("userId")?.value;

  if (role !== "EMPLOYEE") {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  if (!userId) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { type, startDate, endDate, reason } =
    await req.json();

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (!type || !reason || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return NextResponse.json(
      { message: "Invalid input" },
      { status: 400 }
    );
  }

  if (start > end) {
    return NextResponse.json(
      { message: "Invalid date range" },
      { status: 400 }
    );
  }

  const leave = await prisma.leave.create({
    data: {
      userId,
      type,
      reason,
      startDate: start,
      endDate: end,
      status: "PENDING",
    },
    include: {
      user: true,
    },
  });

  return NextResponse.json(leave, { status: 201 });
}

