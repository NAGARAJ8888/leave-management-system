"use client";

import { useEffect, useState } from "react";

export default function EmployeePage() {
  const [leaves, setLeaves] = useState([]);

  async function loadLeaves() {
    const res = await fetch("/api/leaves");
    const data = await res.json();
    setLeaves(data);
  }

  useEffect(() => {
    loadLeaves();
  }, []);

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold">
        My Leave Requests
      </h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Type</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {leaves.map((leave: any) => (
            <tr key={leave.id}>
              <td className="border p-2">
                {leave.type}
              </td>

              <td className="border p-2">
                {leave.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}