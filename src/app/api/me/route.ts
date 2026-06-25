import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const cookieStore = await cookies();

  const id = cookieStore.get("userId")?.value;
  const role = cookieStore.get("userRole")?.value;
  const name = cookieStore.get("userName")?.value;

  const user = id
    ? await prisma.user.findUnique({
        where: { id },
        select: { leaveBalance: true },
      })
    : null;

  return NextResponse.json({
    id,
    role,
    name,
    leaveBalance: user?.leaveBalance ?? null,
  });
}

