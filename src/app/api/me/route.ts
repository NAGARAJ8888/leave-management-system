import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();

  return NextResponse.json({
    id: cookieStore.get("userId")?.value,
    role: cookieStore.get("userRole")?.value,
    name: cookieStore.get("userName")?.value,
  });
}