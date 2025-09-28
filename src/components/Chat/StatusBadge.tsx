// components/ui/StatusBadge.tsx
import React from "react";

export default function StatusBadge({ status }: { status: string }) {
  const m: Record<string, string> = {
    PENDING: "bg-gray-200 text-gray-800",
    APPROVED: "bg-emerald-100 text-emerald-700",
    REVISION: "bg-amber-100 text-amber-700",
    CANCELED: "bg-slate-200 text-slate-700",
  };
  const cls = m[status] || "bg-gray-100 text-gray-700";
  return (
    <span className={`inline-block rounded px-2 py-1 text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}
