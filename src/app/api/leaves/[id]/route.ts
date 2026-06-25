import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await params;

  const { status } = await req.json();

  const existingLeave =
    await prisma.leave.findUnique({
      where: { id },
    });

  if (!existingLeave) {
    return NextResponse.json(
      { message: "Leave not found" },
      { status: 404 }
    );
  }

  if (
    status === "APPROVED" &&
    existingLeave.status === "PENDING"
  ) {
    const startDate = new Date(existingLeave.startDate);
    const endDate = new Date(existingLeave.endDate);

    // Normalize to midnight local time to avoid DST/timezone issues
    const startMidnight = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );
    const endMidnight = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );

    const totalDays =
      Math.floor(
        (endMidnight.getTime() - startMidnight.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    await prisma.user.update({
      where: {
        id: existingLeave.userId,
      },
      data: {
        leaveBalance: {
          decrement: totalDays,
        },
      },
    });
  }

  const leave =
    await prisma.leave.update({
      where: { id },
      data: { status },
    });

  return NextResponse.json(leave);
}