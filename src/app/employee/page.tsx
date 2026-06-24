"use client";

import { useRouter } from "next/navigation";

export default function EmployeePage() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login");
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">
        Employee Dashboard
      </h1>

      <button
        onClick={logout}
        className="mt-4 rounded bg-red-500 px-4 py-2 text-white"
      >
        Logout
      </button>
    </div>
  );
}