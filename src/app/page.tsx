export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
            LM
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Leave Management</div>
            <div className="text-xs text-gray-500">System</div>
          </div>
        </div>

        <a
          href="/login"
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
        >
          Login
        </a>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-10">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Manage employee leave requests with clarity.
              </h1>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Employees can apply for leave and track status. Admins can review and approve requests.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  Sign in to continue
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-700">
                    1
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Apply Leave</div>
                    <div className="text-sm text-gray-600">Choose type and date range. Submit a request.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-50 text-sm font-bold text-green-700">
                    2
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Track Status</div>
                    <div className="text-sm text-gray-600">See PENDING, APPROVED, or REJECTED results.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-sm font-bold text-amber-700">
                    3
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Admin Review</div>
                    <div className="text-sm text-gray-600">Approve requests to update leave balance.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* System Features Section */}
        <section className="border-t border-gray-200 bg-white py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">System Features</h2>
              <p className="mt-2 text-sm text-gray-600">
                Key capabilities available for employees and administrators.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">Apply Leave</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                    Submit leave requests
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                    Select leave dates
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                    Add leave reason
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-700">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">Track Status</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                    View pending requests
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                    View approved requests
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                    View rejected requests
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">Admin Review</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                    Review all requests
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                    Approve leave requests
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                    Reject leave requests
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">Leave Balance</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                    View remaining balance
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                    Automatic balance updates
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                    Leave tracking
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack Section */}
        <section className="border-t border-gray-200 py-12">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-8 text-center">
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Technology Stack</h2>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: 'Next.js', color: 'bg-gray-900 text-white' },
                { name: 'TypeScript', color: 'bg-blue-100 text-blue-800' },
                { name: 'Prisma', color: 'bg-teal-100 text-teal-800' },
                { name: 'SQLite', color: 'bg-orange-100 text-orange-800' },
                { name: 'Tailwind CSS', color: 'bg-cyan-100 text-cyan-800' },
              ].map((tech) => (
                <span
                  key={tech.name}
                  className={`rounded-lg px-4 py-2 text-sm font-medium ${tech.color}`}
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <div className="font-semibold text-gray-900">Leave Management System</div>
              <div className="text-xs text-gray-500">Manage employee leave requests efficiently.</div>
            </div>
            <div className="text-xs text-gray-500">
              © {new Date().getFullYear()} Leave Management System
            </div>
          </div>
          <div className="mt-3 text-center text-xs text-gray-400">
            Built with Next.js, TypeScript, Prisma and Tailwind CSS
          </div>
        </div>
      </footer>
    </div>
  );
}

