"use client";

import { useState, useEffect, useCallback } from "react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import ManageClassDetails from "@/components/classes/classes-details";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Award, Plus, Loader2 } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Class } from "@/lib/types";
import { classesApi } from "@/lib/api";

const columns: ColumnDef<Class>[] = [
  { accessorKey: "name", header: "Class Name" },
  { accessorKey: "teacherName", header: "Teacher" },
  { accessorKey: "studentCount", header: "Students" },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => (
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        info.getValue() === "Active"
          ? "bg-emerald-500/10 text-emerald-600"
          : "bg-rose-500/10 text-rose-600"
      }`}>
        {String(info.getValue())}
      </span>
    ),
  },
];

export default function Classes() {
  const [isManage, setIsManage] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await classesApi.getAll({ page: 1, limit: 100 });
      setClasses(res.data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load classes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchClasses(); }, [fetchClasses]);

  const handleEdit = (classData: Class) => {
    setSelectedClass(classData);
    setIsManage(true);
  };

  const handleDelete = async (classData: Class) => {
    try {
      await classesApi.delete(classData.id);
      setClasses((prev) => prev.filter((c) => c.id !== classData.id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete class");
    }
  };

  const handleManageClose = (open: boolean) => {
    setIsManage(open);
    if (!open) fetchClasses();
  };

  return (
    <div className="p-4 md:px-8 md:pt-2 md:pb-8 bg-muted/30 min-h-screen">
      <main className="space-y-8">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 ml-1 mt-2">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Classes</h1>
            <p className="text-muted-foreground text-base font-medium mt-1">Manage classes and records</p>
          </div>
          <Button
            onClick={() => { setSelectedClass(null); setIsManage(true); }}
            className="rounded-2xl bg-primary px-6 py-6 h-auto font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Class
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total Classes"  value={isLoading ? "..." : String(classes.length)} icon={BookOpen} variant="green" />
          <StatCard title="Total Students" value={isLoading ? "..." : String(classes.reduce((sum, c) => sum + c.studentCount, 0))} icon={Users} variant="blue" />
          <StatCard title="Active Classes" value={isLoading ? "..." : String(classes.filter((c) => c.status === "Active").length)} icon={Award} variant="amber" />
        </div>

        {/* Table Card */}
        <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-card">
          <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-bold tracking-tight">All Classes</CardTitle>
            <div className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">
              Showing {classes.length} Records
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Loading classes...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <p className="text-sm font-bold text-rose-500">{error}</p>
                <Button variant="outline" onClick={fetchClasses} className="rounded-xl">Retry</Button>
              </div>
            ) : (
              <GenericTable
                data={classes}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchKeys={["name", "teacherName"]}
              />
            )}
          </CardContent>
        </Card>
      </main>

      <ManageClassDetails
        isOpen={isManage}
        onOpenChange={handleManageClose}
        classData={selectedClass}
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