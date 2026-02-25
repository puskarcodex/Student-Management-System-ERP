"use client";

import { useState, useEffect, useCallback } from "react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import LeaveDetails from "@/components/hr&payroll/leave-details";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle, Plus, Calendar, Loader2 } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { LeaveRequest } from "@/lib/types";
import { leaveApi } from "@/lib/api";

const columns: ColumnDef<LeaveRequest>[] = [
  {
    accessorKey: "employeeName",
    header: "Employee",
    cell: (info) => (
      <div className="flex flex-col">
        <span className="font-bold text-foreground">{String(info.getValue())}</span>
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
          {info.row.original.employeeType}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "leaveType",
    header: "Leave Type",
    cell: (info) => <span className="text-sm font-bold text-muted-foreground">{String(info.getValue())}</span>,
  },
  {
    accessorKey: "fromDate",
    header: "From",
    cell: (info) => (
      <div className="flex items-center gap-1.5 text-muted-foreground/70">
        <Calendar className="w-3 h-3" />
        <span className="text-xs font-bold">{String(info.getValue())}</span>
      </div>
    ),
  },
  {
    accessorKey: "toDate",
    header: "To",
    cell: (info) => (
      <div className="flex items-center gap-1.5 text-muted-foreground/70">
        <Calendar className="w-3 h-3" />
        <span className="text-xs font-bold">{String(info.getValue())}</span>
      </div>
    ),
  },
  {
    accessorKey: "totalDays",
    header: "Days",
    cell: (info) => <span className="font-black text-foreground">{String(info.getValue())}d</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = String(info.getValue());
      const styles: Record<string, string> = {
        Pending:  "bg-[oklch(0.7686_0.1647_70.0804)]/10 text-[oklch(0.7686_0.1647_70.0804)]",
        Approved: "bg-emerald-500/10 text-emerald-600",
        Rejected: "bg-rose-500/10 text-rose-600",
      };
      return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status] ?? ""}`}>
          {status}
        </span>
      );
    },
  },
];

export default function LeavePage() {
  const [leaves, setLeaves]   = useState<LeaveRequest[]>([]);
  const [selected, setSelected] = useState<LeaveRequest | null>(null);
  const [isOpen, setIsOpen]   = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetchLeaves = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await leaveApi.getAll({ page: 1, limit: 200 });
      setLeaves(res.data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load leave requests");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeaves(); }, [fetchLeaves]);

  const pendingCount  = leaves.filter((l) => l.status === "Pending").length;
  const approvedCount = leaves.filter((l) => l.status === "Approved").length;
  const rejectedCount = leaves.filter((l) => l.status === "Rejected").length;

  const handleEdit = (row: LeaveRequest) => { setSelected(row); setIsOpen(true); };
  const handleView = (row: LeaveRequest) => { setSelected(row); setIsOpen(true); };

  const handleDelete = async (row: LeaveRequest) => {
    try {
      await leaveApi.delete(row.id);
      setLeaves((prev) => prev.filter((l) => l.id !== row.id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) fetchLeaves();
  };

  return (
    <div className="p-4 md:px-8 md:pt-2 md:pb-8 bg-muted/30 min-h-screen">
      <main className="space-y-8">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 ml-1 mt-2">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Leave Requests</h1>
            <p className="text-muted-foreground text-base font-medium mt-1">Review and manage employee leave applications</p>
          </div>
          <Button
            onClick={() => { setSelected(null); setIsOpen(true); }}
            className="rounded-2xl bg-primary px-6 py-6 h-auto font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all gap-2"
          >
            <Plus className="w-5 h-5" /> New Request
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Pending"  value={isLoading ? "..." : String(pendingCount)}  icon={Clock}       variant="amber"  />
          <StatCard title="Approved" value={isLoading ? "..." : String(approvedCount)} icon={CheckCircle} variant="green"  />
          <StatCard title="Rejected" value={isLoading ? "..." : String(rejectedCount)} icon={XCircle}     variant="purple" />
        </div>

        <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-card">
          <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-bold tracking-tight">Leave Applications</CardTitle>
            <div className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">Showing {leaves.length} Records</div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Loading leave requests...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <p className="text-sm font-bold text-rose-500">{error}</p>
                <Button variant="outline" onClick={fetchLeaves} className="rounded-xl">Retry</Button>
              </div>
            ) : (
              <GenericTable
                data={leaves}
                columns={columns}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchKeys={["employeeName", "leaveType", "status"]}
              />
            )}
          </CardContent>
        </Card>
      </main>

      <LeaveDetails
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        leave={selected}
      />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, variant }: { title: string; value: string; icon: LucideIcon; variant: "green" | "blue" | "amber" | "purple" }) {
  const styles = {
    green:  { bg: "bg-[oklch(0.6959_0.1491_162.4796)]/10 dark:bg-[oklch(0.6959_0.1491_162.4796)]/15", iconBg: "bg-[oklch(0.6959_0.1491_162.4796)]/20", iconColor: "text-[oklch(0.6959_0.1491_162.4796)]" },
    blue:   { bg: "bg-[oklch(0.6231_0.1880_259.8145)]/10 dark:bg-[oklch(0.6231_0.1880_259.8145)]/15", iconBg: "bg-[oklch(0.6231_0.1880_259.8145)]/20", iconColor: "text-[oklch(0.6231_0.1880_259.8145)]" },
    amber:  { bg: "bg-[oklch(0.7686_0.1647_70.0804)]/10 dark:bg-[oklch(0.7686_0.1647_70.0804)]/15",   iconBg: "bg-[oklch(0.7686_0.1647_70.0804)]/20",   iconColor: "text-[oklch(0.7686_0.1647_70.0804)]"   },
    purple: { bg: "bg-[oklch(0.6056_0.2189_292.7172)]/10 dark:bg-[oklch(0.6056_0.2189_292.7172)]/15", iconBg: "bg-[oklch(0.6056_0.2189_292.7172)]/20", iconColor: "text-[oklch(0.6056_0.2189_292.7172)]" },
  }[variant];
  return (
    <Card className={`rounded-[2.2rem] border-none shadow-sm p-7 transition-all hover:shadow-md group ${styles.bg}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">{title}</p>
          <p className="text-3xl font-black mt-1 tracking-tight text-foreground">{value}</p>
        </div>
        <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 group-hover:rotate-3 ${styles.iconBg}`}>
          <Icon className={`w-7 h-7 ${styles.iconColor}`} />
        </div>
      </div>
    </Card>
  );
}