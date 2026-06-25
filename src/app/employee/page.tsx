"use client";

import { useEffect, useMemo, useState } from "react";



type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

type LeaveRow = {
  id: string;
  type: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  remainingLeaves?: number | null;
};

type MeResponse = {
  id: string | undefined;
  role: string | undefined;
  name: string | undefined;
  leaveBalance: number | null;
};

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString();
}

function calcTotalDays(from: string, to: string) {
  const start = new Date(from);
  const end = new Date(to);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;

  const startMidnight = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );
  const endMidnight = new Date(
    end.getFullYear(),
    end.getMonth(),
    end.getDate()
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
      <span className={`${base} bg-amber-50 text-amber-800 border border-amber-200`}>
        PENDING
      </span>
    );
  }

  if (status === "APPROVED") {
    return (
      <span className={`${base} bg-emerald-50 text-emerald-800 border border-emerald-200`}>
        APPROVED
      </span>
    );
  }

  return (
    <span className={`${base} bg-red-50 text-red-800 border border-red-200`}>
      REJECTED
    </span>
  );
}

export default function EmployeePage() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [leaves, setLeaves] = useState<LeaveRow[]>([]);

  const [isApplying, setIsApplying] = useState(false);
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadAll() {
    const [meRes, leavesRes] = await Promise.all([
      fetch("/api/me"),
      fetch("/api/leaves"),
    ]);


    const meData: MeResponse = await meRes.json();
    const leavesData: LeaveRow[] = await leavesRes.json();

    setMe(meData);
    setLeaves(leavesData);
  }

  const remainingBalance = me?.leaveBalance ?? null;

  const totalDaysById = useMemo(() => {
    const map = new Map<string, number>();
    leaves.forEach((l) => {
      map.set(
        l.id,
        calcTotalDays(l.startDate, l.endDate)
      );
    });
    return map;
  }, [leaves]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      if (!isMounted) return;
      await loadAll().catch(() => {
        // keep UI stable
      });
    })();

    return () => {
      isMounted = false;
    };
  }, []);


  async function handleApplySubmit(e: React.FormEvent) {

    e.preventDefault();
    setError(null);

    if (!type || !startDate || !endDate || !reason) {
      setError("Please fill out all fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          startDate,
          endDate,
          reason,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.message ?? "Failed to submit leave.");
        return;
      }

      setIsApplying(false);
      setType("");
      setStartDate("");
      setEndDate("");
      setReason("");

      await loadAll();
    } catch {
      setError("Failed to submit leave.");
    } finally {
      setSubmitting(false);
    }
  }

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
              Employee Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {me?.name ? `Welcome, ${me.name}` : ""}
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

        <div className="grid gap-4 md:grid-cols-3">
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 md:col-span-1">
            <div className="text-sm font-semibold text-gray-700">
              Remaining Leave Balance
            </div>
            <div className="mt-3 flex items-end gap-3">
              <div className="text-4xl font-bold tracking-tight text-gray-900">
                {remainingBalance ?? "-"}
              </div>
              <div className="pb-1 text-sm text-gray-500">days</div>
            </div>

            <button
              type="button"
              onClick={() => setIsApplying((v) => !v)}
              className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              Apply Leave
            </button>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 md:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Leave Application
              </h2>
              <div className="text-xs text-gray-500">
                {isApplying ? "Enter request details" : ""}
              </div>
            </div>

            {isApplying ? (
              <form
                onSubmit={handleApplySubmit}
                className="mt-5 space-y-4"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <div className="mb-1 text-sm font-medium text-gray-700">
                      Leave Type
                    </div>
                    <select
                      value={type}
                      onChange={(e) =>
                        setType(e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select type</option>
                      <option value="SICK">SICK</option>
                      <option value="VACATION">VACATION</option>
                      <option value="PERSONAL">PERSONAL</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </label>

                  <label className="block">
                    <div className="mb-1 text-sm font-medium text-gray-700">
                      Leave From Date
                    </div>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) =>
                        setStartDate(e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </label>

                  <label className="block">
                    <div className="mb-1 text-sm font-medium text-gray-700">
                      Leave To Date
                    </div>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) =>
                        setEndDate(e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <div className="mb-1 text-sm font-medium text-gray-700">
                      Reason
                    </div>
                    <textarea
                      value={reason}
                      onChange={(e) =>
                        setReason(e.target.value)
                      }
                      rows={4}
                      className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Briefly explain the reason for your leave"
                    />
                  </label>
                </div>

                {error ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                    {error}
                  </div>
                ) : null}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setIsApplying(false)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
                Click <span className="font-semibold text-gray-900">Apply Leave</span> to open the form.
              </div>
            )}
          </section>
        </div>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Leave Requests
            </h2>
            <div className="text-xs text-gray-500">
              {leaves.length ? `${leaves.length} request(s)` : "No requests yet"}
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[800px] border-separate border-spacing-0">
              <thead>
                <tr className="text-left">
                  {[
                    "Type",
                    "Leave From",
                    "Leave To",
                    "Total Days",
                    "Status",
                    "Remaining Leaves",
                  ].map((h) => (
                    <th
                      key={h}
                      className="border-b border-gray-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr
                    key={leave.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="border-b border-gray-100 px-4 py-3 text-sm font-medium text-gray-900">
                      {leave.type}
                    </td>
                    <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                      {formatDate(leave.startDate)}
                    </td>
                    <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                      {formatDate(leave.endDate)}
                    </td>
                    <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                      {totalDaysById.get(leave.id) ?? 0}
                    </td>
                    <td className="border-b border-gray-100 px-4 py-3">
                      {statusBadge(leave.status)}
                    </td>
                    <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                      {remainingBalance ?? "-"}
                    </td>
                  </tr>
                ))}

                {!leaves.length ? (
                  <tr>
                    <td
                      className="px-4 py-10 text-center text-sm text-gray-500"
                      colSpan={6}
                    >
                      No leave requests found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

