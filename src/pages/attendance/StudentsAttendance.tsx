"use client";

import { useState, useEffect, useCallback } from "react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, UserCheck, UserX, Clock, Plus, Loader2 } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Attendance } from "@/lib/types";
import ManageAttendanceDetails from "@/components/attendance/studentsattendance-details";
import { attendanceApi } from "@/lib/api";

const columns: ColumnDef<Attendance>[] = [
  {
    accessorKey: "name",
    header: "Student",
    cell: (info) => <span className="font-bold text-foreground">{String(info.getValue())}</span>,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: (info) => (
      <div className="flex items-center gap-2 text-muted-foreground/70">
        <Calendar className="w-3 h-3" />
        <span className="text-xs font-bold">{String(info.getValue())}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = String(info.getValue());
      const styles: Record<string, string> = {
        Present: "bg-emerald-500/10 text-emerald-600",
        Absent:  "bg-rose-500/10 text-rose-600",
        Leave:   "bg-[oklch(0.7686_0.1647_70.0804)]/10 text-[oklch(0.7686_0.1647_70.0804)]",
      };
      return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status] ?? ""}`}>
          {status}
        </span>
      );
    },
  },
];

export default function StudentsAttendance() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await attendanceApi.getByEntityType("Student", { page: 1, limit: 200 });
      setRecords(res.data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load attendance");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const presentCount = records.filter((r) => r.status === "Present").length;
  const absentCount  = records.filter((r) => r.status === "Absent").length;
  const leaveCount   = records.filter((r) => r.status === "Leave").length;

  const handleEdit = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setIsOpen(true);
  };

  const handleDelete = async (row: Attendance) => {
    try {
      await attendanceApi.delete(row.id);
      setRecords((prev) => prev.filter((r) => r.id !== row.id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) fetchRecords();
  };

  return (
    <div className="p-4 md:px-8 md:pt-2 md:pb-8 bg-muted/30 min-h-screen">
      <main className="space-y-8">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 ml-1 mt-2">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Students Attendance</h1>
            <p className="text-muted-foreground text-base font-medium mt-1">Track and record student attendance</p>
          </div>
          <Button
            onClick={() => { setSelectedAttendance(null); setIsOpen(true); }}
            className="rounded-2xl bg-primary px-6 py-6 h-auto font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all gap-2"
          >
            <Plus className="w-5 h-5" /> Mark Attendance
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Present" value={isLoading ? "..." : String(presentCount)} icon={UserCheck} variant="green"  />
          <StatCard title="Absent"  value={isLoading ? "..." : String(absentCount)}  icon={UserX}     variant="amber"  />
          <StatCard title="Leave"   value={isLoading ? "..." : String(leaveCount)}   icon={Clock}     variant="purple" />
        </div>

        <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-card">
          <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-bold tracking-tight">Attendance Records</CardTitle>
            <div className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">
              {records.length} Records
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Loading attendance...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <p className="text-sm font-bold text-rose-500">{error}</p>
                <Button variant="outline" onClick={fetchRecords} className="rounded-xl">Retry</Button>
              </div>
            ) : (
              <GenericTable
                data={records}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchKeys={["name", "status"]}
              />
            )}
          </CardContent>
        </Card>
      </main>

      <ManageAttendanceDetails
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        attendance={selectedAttendance}
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