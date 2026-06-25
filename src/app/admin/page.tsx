"use client";

import { useEffect, useMemo, useState } from "react";

type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | string;

type LeaveRow = {
  id: string;
  user?: { name?: string };
  type: string;
  status: LeaveStatus;
  reason?: string;
  // May or may not exist in GET /api/leaves
  startDate?: string | null;
  endDate?: string | null;
};

function formatDate(value?: string | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString();
}

function calcTotalDays(from?: string | null, to?: string | null) {
  if (!from || !to) return null;

  const start = new Date(from);
  const end = new Date(to);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

  const startMidnight = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
  );
  const endMidnight = new Date(
    end.getFullYear(),
    end.getMonth(),
    end.getDate(),
  );

  const diffMs = endMidnight.getTime() - startMidnight.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(0, days);
}

function statusBadge(status: LeaveStatus) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";

  if (status === "PENDING") {
    return (
      <span
        className={`${base} border border-amber-200 bg-amber-50 text-amber-800`}
      >
        PENDING
      </span>
    );
  }

  if (status === "APPROVED") {
    return (
      <span
        className={`${base} border border-emerald-200 bg-emerald-50 text-emerald-800`}
      >
        APPROVED
      </span>
    );
  }

  if (status === "REJECTED") {
    return (
      <span className={`${base} border border-red-200 bg-red-50 text-red-800`}>
        REJECTED
      </span>
    );
  }

  return (
    <span className={`${base} border border-gray-200 bg-gray-50 text-gray-700`}>
      {String(status)}
    </span>
  );
}

export default function AdminPage() {
  const [leaves, setLeaves] = useState<LeaveRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutatingId, setIsMutatingId] = useState<string | null>(null);

  async function loadLeaves() {
    const res = await fetch("/api/leaves");
    const data = (await res.json()) as LeaveRow[];
    setLeaves(data);
  }

  async function updateStatus(id: string, status: string) {
    setIsMutatingId(id);
    try {
      await fetch(`/api/leaves/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await loadLeaves();
    } finally {
      setIsMutatingId(null);
    }
  }

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        if (!isMounted) return;
        setIsLoading(true);
        await loadLeaves();
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const dateFieldsAvailable = useMemo(() => {
    return leaves.some((l) => l.startDate && l.endDate);
  }, [leaves]);

  const stats = useMemo(() => {
    return {
      total: leaves.length,
      pending: leaves.filter((l) => l.status === "PENDING").length,
      approved: leaves.filter((l) => l.status === "APPROVED").length,
      rejected: leaves.filter((l) => l.status === "REJECTED").length,
    };
  }, [leaves]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage employee leave requests
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="self-start rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 sm:self-auto"
          >
            Logout
          </button>
        </header>

        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <div className="text-sm font-semibold text-gray-700">
              Total Requests
            </div>
            <div className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              {stats.total}
            </div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <div className="text-sm font-semibold text-gray-700">
              Pending Requests
            </div>
            <div className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              {stats.pending}
            </div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <div className="text-sm font-semibold text-gray-700">
              Approved Requests
            </div>
            <div className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              {stats.approved}
            </div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <div className="text-sm font-semibold text-gray-700">
              Rejected Requests
            </div>
            <div className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              {stats.rejected}
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Leave Requests
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Review, approve, or reject employee requests.
              </p>
            </div>

            <div className="text-sm text-gray-600">
              {isLoading ? "Loading..." : `${leaves.length} request(s)`}
            </div>
          </div>

          {isLoading ? (
            <div className="mt-4 grid gap-3">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-16 animate-pulse rounded-xl bg-gray-100"
                />
              ))}
            </div>
          ) : leaves.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <div className="text-sm font-semibold text-gray-900">
                No leave requests available
              </div>
              <div className="mt-2 text-sm text-gray-600">
                There are currently no leave applications to manage.
              </div>
            </div>
          ) : (
            <div className="mt-4">
              {/* Desktop table */}
              <div className="hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] border-separate border-spacing-0">
                    <thead>
                      <tr className="text-left">
                        <th className="border-b border-gray-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Employee Name
                        </th>
                        <th className="border-b border-gray-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Leave Type
                        </th>
                        {dateFieldsAvailable ? (
                          <>
                            <th className="border-b border-gray-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Leave From
                            </th>
                            <th className="border-b border-gray-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Leave To
                            </th>
                            <th className="border-b border-gray-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Total Days
                            </th>
                          </>
                        ) : null}
                        <th className="border-b border-gray-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Status
                        </th>
                        <th className="border-b border-gray-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {leaves.map((leave) => {
                        const isPending = leave.status === "PENDING";

                        return (
                          <tr key={leave.id} className="hover:bg-gray-50">
                            <td className="border-b border-gray-100 px-4 py-3">
                              <div className="font-medium text-gray-900">
                                {leave.user?.name ?? "-"}
                              </div>

                              {leave.reason && (
                                <p
                                  className="mt-1 line-clamp-2 text-xs text-gray-500"
                                  title={leave.reason}
                                >
                                  {leave.reason}
                                </p>
                              )}
                            </td>
                            <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                              {leave.type}
                            </td>

                            {dateFieldsAvailable ? (
                              <>
                                <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                                  {formatDate(leave.startDate)}
                                </td>
                                <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                                  {formatDate(leave.endDate)}
                                </td>
                                <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                                  {calcTotalDays(
                                    leave.startDate,
                                    leave.endDate,
                                  ) ?? "-"}
                                </td>
                              </>
                            ) : null}

                            <td className="border-b border-gray-100 px-4 py-3">
                              {statusBadge(leave.status)}
                            </td>

                            <td className="border-b border-gray-100 px-4 py-3">
                              {isPending ? (
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                  <button
                                    type="button"
                                    disabled={isMutatingId === leave.id}
                                    onClick={() =>
                                      updateStatus(leave.id, "APPROVED")
                                    }
                                    className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    {isMutatingId === leave.id
                                      ? "Processing..."
                                      : "Approve"}
                                  </button>
                                  <button
                                    type="button"
                                    disabled={isMutatingId === leave.id}
                                    onClick={() =>
                                      updateStatus(leave.id, "REJECTED")
                                    }
                                    className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
                                  Processed
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden">
                <div className="grid gap-3">
                  {leaves.map((leave) => {
                    const isPending = leave.status === "PENDING";

                    return (
                      <div
                        key={leave.id}
                        className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {leave.user?.name ?? "-"}
                            </div>
                            <div className="mt-1 text-sm text-gray-600">
                              {leave.type}
                            </div>
                          </div>
                          <div>{statusBadge(leave.status)}</div>
                        </div>

                        {dateFieldsAvailable ? (
                          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                From
                              </div>
                              <div className="mt-1 font-medium text-gray-800">
                                {formatDate(leave.startDate)}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                To
                              </div>
                              <div className="mt-1 font-medium text-gray-800">
                                {formatDate(leave.endDate)}
                              </div>
                            </div>
                            <div className="col-span-2">
                              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Total Days
                              </div>
                              <div className="mt-1 font-medium text-gray-800">
                                {calcTotalDays(
                                  leave.startDate,
                                  leave.endDate,
                                ) ?? "-"}
                              </div>
                            </div>
                          </div>
                        ) : null}

                        {leave.reason && (
                          <div className="mt-4">
                            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Reason
                            </div>
                            <div className="mt-1 text-sm text-gray-700">
                              {leave.reason}
                            </div>
                          </div>
                        )}

                        <div className="mt-4">
                          {isPending ? (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                disabled={isMutatingId === leave.id}
                                onClick={() =>
                                  updateStatus(leave.id, "APPROVED")
                                }
                                className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {isMutatingId === leave.id
                                  ? "Processing..."
                                  : "Approve"}
                              </button>
                              <button
                                type="button"
                                disabled={isMutatingId === leave.id}
                                onClick={() =>
                                  updateStatus(leave.id, "REJECTED")
                                }
                                className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
                              Processed
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
