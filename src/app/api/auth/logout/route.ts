import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
  });

  ["userId", "userRole", "userName"].forEach(
    (cookie) => {
      response.cookies.set(cookie, "", {
        expires: new Date(0),
        path: "/",
      });
    }
  );

  return response;
}