"use client";

import { useState, useEffect, useCallback } from "react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import StaffDetails from "@/components/staffs/staffs-details";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, UserX, Plus, Loader2 } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Staff } from "@/lib/types";
import { staffApi } from "@/lib/api";

const columns: ColumnDef<Staff>[] = [
  {
    accessorKey: "name",
    header: "Staff Member",
    cell: (info) => {
      const staff = info.row.original;
      const initials = staff.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
      return (
        <div className="flex items-center gap-3">
          {staff.photo ? (
            <img src={staff.photo} alt={staff.name} className="w-9 h-9 rounded-xl object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-[oklch(0.6231_0.1880_259.8145)]/10 flex items-center justify-center text-[11px] font-black text-[oklch(0.6231_0.1880_259.8145)]">
              {initials}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-bold text-foreground">{staff.name}</span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">{staff.staffId}</span>
          </div>
        </div>
      );
    },
  },
  { accessorKey: "role",       header: "Role",       cell: (info) => <span className="text-sm font-bold text-muted-foreground">{String(info.getValue())}</span> },
  { accessorKey: "department", header: "Department", cell: (info) => <span className="text-sm font-medium text-muted-foreground">{String(info.getValue())}</span> },
  { accessorKey: "phone",      header: "Phone",      cell: (info) => <span className="text-sm font-medium text-muted-foreground">{String(info.getValue())}</span> },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = String(info.getValue());
      return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
          status === "Active"
            ? "bg-emerald-500/10 text-emerald-600"
            : "bg-rose-500/10 text-rose-600"
        }`}>
          {status}
        </span>
      );
    },
  },
];

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selected, setSelected] = useState<Staff | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStaff = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await staffApi.getAll({ page: 1, limit: 100 });
      setStaff(res.data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load staff");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  const totalStaff    = staff.length;
  const activeStaff   = staff.filter((s) => s.status === "Active").length;
  const inactiveStaff = staff.filter((s) => s.status === "Inactive").length;

  const handleEdit   = (row: Staff) => { setSelected(row); setIsOpen(true); };
  const handleDelete = async (row: Staff) => {
    try {
      await staffApi.delete(row.id);
      setStaff((prev) => prev.filter((s) => s.id !== row.id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete staff");
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) fetchStaff();
  };

  return (
    <div className="p-4 md:px-8 md:pt-2 md:pb-8 bg-muted/30 min-h-screen">
      <main className="space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 ml-1 mt-2">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Staff</h1>
            <p className="text-muted-foreground text-base font-medium mt-1">Manage non-teaching staff members</p>
          </div>
          <Button
            onClick={() => { setSelected(null); setIsOpen(true); }}
            className="rounded-2xl bg-primary px-6 py-6 h-auto font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Staff
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total Staff"    value={isLoading ? "..." : String(totalStaff)}    icon={Users}     variant="blue"   />
          <StatCard title="Active"         value={isLoading ? "..." : String(activeStaff)}   icon={UserCheck} variant="green"  />
          <StatCard title="Inactive"       value={isLoading ? "..." : String(inactiveStaff)} icon={UserX}     variant="amber"  />
        </div>

        {/* Table */}
        <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-card">
          <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-bold tracking-tight">Staff Directory</CardTitle>
            <div className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">
              Showing {staff.length} Members
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Loading staff...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <p className="text-sm font-bold text-rose-500">{error}</p>
                <Button variant="outline" onClick={fetchStaff} className="rounded-xl">Retry</Button>
              </div>
            ) : (
              <GenericTable
                data={staff}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchKeys={["name", "role", "department", "status"]}
              />
            )}
          </CardContent>
        </Card>
      </main>

      <StaffDetails
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        staff={selected}
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