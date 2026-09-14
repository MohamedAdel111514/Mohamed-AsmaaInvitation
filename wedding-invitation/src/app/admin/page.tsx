
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Guest, GuestStats, AttendanceStatus } from "@/types/guest";

const PAGE_SIZE = 20;

const STATUS_LABEL: Record<AttendanceStatus, string> = {
  confirmed: "Confirmed",
  pending: "Pending",
  cancelled: "Cancelled",
};

const WA_LABEL: Record<string, string> = {
  sent: "Sent",
  pending: "Pending",
  failed: "Failed",
};

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
      <p className="text-2xl">{icon}</p>
      <p className="mt-2 font-display text-3xl text-ink">{value}</p>
      <p className="text-sm text-ink/60">{label}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<GuestStats | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    const res = await fetch("/api/admin/stats");
    if (res.ok) setStats(await res.json());
  }, []);

  const loadGuests = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(PAGE_SIZE),
      sort,
      status: statusFilter,
    });
    if (search.trim()) params.set("search", search.trim());

    const res = await fetch(`/api/admin/guests?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setGuests(data.guests);
      setTotal(data.total);
    } else {
      setError("Failed to load guests.");
    }
    setLoading(false);
  }, [page, sort, statusFilter, search]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadGuests();
  }, [loadGuests]);

  async function handleStatusChange(id: string, status: AttendanceStatus) {
    setBusyId(id);
    const res = await fetch(`/api/admin/guests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attendance_status: status }),
    });
    if (res.ok) {
      await Promise.all([loadGuests(), loadStats()]);
    }
    setBusyId(null);
  }

  async function handleRetryWhatsApp(id: string) {
    setBusyId(id);
    await fetch(`/api/admin/guests/${id}/retry-whatsapp`, { method: "POST" });
    await Promise.all([loadGuests(), loadStats()]);
    setBusyId(null);
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    const res = await fetch(`/api/admin/guests/${id}`, { method: "DELETE" });
    if (res.ok) {
      await Promise.all([loadGuests(), loadStats()]);
    }
    setBusyId(null);
    setConfirmDeleteId(null);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-ivory px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-3xl text-ink">Guest Dashboard</h1>
          <button
            onClick={handleLogout}
            className="rounded-full border border-ink/20 px-4 py-2 text-sm text-ink/70 hover:bg-ink hover:text-ivory"
          >
            Log out
          </button>
        </div>

        {stats && (
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Total Guests" value={stats.total} icon="👥" />
            <StatCard label="Confirmed" value={stats.confirmed} icon="✅" />
            <StatCard label="Today" value={stats.today} icon="📅" />
            <StatCard label="WhatsApp Failed" value={stats.whatsappFailed} icon="⚠️" />
          </div>
        )}

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search by name or phone…"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="min-w-[220px] flex-1 rounded-lg border border-ink/15 px-4 py-2.5 outline-none focus:border-sage"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
            className="rounded-lg border border-ink/15 px-3 py-2.5 outline-none focus:border-sage"
          >
            <option value="all">All statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
            className="rounded-lg border border-ink/15 px-3 py-2.5 outline-none focus:border-sage"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
          <a
            href="/api/admin/guests/export"
            className="rounded-full bg-ink px-5 py-2.5 text-sm text-ivory hover:bg-sage"
          >
            Export Guests (CSV)
          </a>
        </div>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-ink/60">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Registered</th>
                <th className="px-4 py-3">WhatsApp</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-ink/50">
                    Loading guests…
                  </td>
                </tr>
              ) : guests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-ink/50">
                    No guests found.
                  </td>
                </tr>
              ) : (
                guests.map((g, i) => (
                  <tr key={g.id} className="border-b border-ink/5 last:border-0">
                    <td className="px-4 py-3 text-ink/50">{(page - 1) * PAGE_SIZE + i + 1}</td>
                    <td className="px-4 py-3 text-ink">{g.name}</td>
                    <td className="px-4 py-3 text-ink/80">{g.phone}</td>
                    <td className="px-4 py-3">
                      <select
                        value={g.attendance_status}
                        disabled={busyId === g.id}
                        onChange={(e) =>
                          handleStatusChange(g.id, e.target.value as AttendanceStatus)
                        }
                        className="rounded-md border border-ink/15 px-2 py-1 text-xs outline-none"
                      >
                        <option value="confirmed">{STATUS_LABEL.confirmed}</option>
                        <option value="pending">{STATUS_LABEL.pending}</option>
                        <option value="cancelled">{STATUS_LABEL.cancelled}</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-ink/70">
                      {new Date(g.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          g.whatsapp_status === "sent"
                            ? "text-green-700"
                            : g.whatsapp_status === "failed"
                            ? "text-red-600"
                            : "text-ink/50"
                        }
                      >
                        {WA_LABEL[g.whatsapp_status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {g.whatsapp_status === "failed" && (
                          <button
                            onClick={() => handleRetryWhatsApp(g.id)}
                            disabled={busyId === g.id}
                            className="rounded-md border border-sage px-2.5 py-1 text-xs text-sage hover:bg-sage hover:text-ivory disabled:opacity-50"
                          >
                            Retry WhatsApp
                          </button>
                        )}
                        <button
                          onClick={() => setConfirmDeleteId(g.id)}
                          disabled={busyId === g.id}
                          className="rounded-md border border-red-300 px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-full border border-ink/20 px-4 py-1.5 text-sm disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-ink/60">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-full border border-ink/20 px-4 py-1.5 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
            <h3 className="mb-2 font-display text-xl text-ink">Delete this guest?</h3>
            <p className="mb-6 text-sm text-ink/60">
              This will permanently remove the guest record. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="rounded-full border border-ink/20 px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="rounded-full bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
