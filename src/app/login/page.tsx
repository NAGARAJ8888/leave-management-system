"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!res.ok) {
        const data = await res
          .json()
          .catch(() => ({ message: "Invalid credentials" }));
        setErrorMessage(data?.message ?? "Invalid credentials");
        return;
      }

      const data = await res.json();

      if (data.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/employee");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <div className="text-sm font-semibold tracking-wide text-gray-900">
          Leave Management System
        </div>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
        >
          Home
        </button>
      </header>

      <main className="mx-auto flex max-w-6xl items-center justify-center px-4 pb-14 pt-10">
        <section className="w-full max-w-md">
          <form
            onSubmit={handleLogin}
            className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
          >
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Welcome Back
              </h1>
              <p className="text-sm text-gray-600">
                Sign in to access your dashboard
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block">
                <div className="mb-1 text-sm font-medium text-gray-700">
                  Email
                </div>
                <input
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  inputMode="email"
                />
              </label>

              <label className="block">
                <div className="mb-1 text-sm font-medium text-gray-700">
                  Password
                </div>
                <input
                  type="password"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </label>

              {errorMessage ? (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
                >
                  {errorMessage}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Signing In..." : "Login"}
              </button>
            </div>
          </form>

          <div className="mt-4 rounded-xl bg-gray-50 p-5 ring-1 ring-gray-200">
            <div className="text-sm font-semibold text-gray-800">
              Demo Credentials
            </div>
            <div className="mt-3 space-y-3 text-sm text-gray-700">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Admin
                </div>
                <div className="mt-1 font-mono text-gray-800">
                  [admin@test.com]
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Employee
                </div>
                <div className="mt-1 font-mono text-gray-800">
                  [employee@test.com]
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Password
                </div>
                <div className="mt-1 font-mono text-gray-800">
                  password123
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

