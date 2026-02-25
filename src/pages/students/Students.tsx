"use client";

import { useState, useEffect, useCallback } from "react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import ManageStudentDetails from "@/components/students/student-details";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, UserPlus, CalendarCheck, Loader2 } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Student } from "@/lib/types";
import { studentsApi } from "@/lib/api";

const columns: ColumnDef<Student>[] = [
  { accessorKey: "studentId", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "class", header: "Class" },
  { accessorKey: "rollNo", header: "Roll" },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = String(info.getValue());
      return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
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

export default function Students() {
  const [isManage, setIsManage] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchStudents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await studentsApi.getAll({ page: 1, limit: 100 });
      setStudents(response.data ?? []);
      setTotal(response.pagination?.total ?? response.data?.length ?? 0);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load students";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsManage(true);
  };

  const handleDelete = async (student: Student) => {
    try {
      await studentsApi.delete(student.id);
      setStudents((prev) => prev.filter((s) => s.id !== student.id));
      setTotal((prev) => prev - 1);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete student";
      alert(message);
    }
  };

  const handleManageClose = (open: boolean) => {
    setIsManage(open);
    if (!open) {
      // Refresh list after add/edit
      fetchStudents();
    }
  };

  const activeCount = students.filter((s) => s.status === "Active").length;

  return (
    <div className="p-4 md:px-8 md:pt-2 md:pb-8 bg-muted/30 min-h-screen">
      <main className="space-y-8">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 ml-1 mt-2">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Students</h1>
            <p className="text-muted-foreground text-base font-medium mt-1">Manage enrollments and student records</p>
          </div>
          <Button
            onClick={() => {
              setSelectedStudent(null);
              setIsManage(true);
            }}
            className="rounded-2xl bg-primary px-6 py-6 h-auto font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Add New Student
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Students"
            value={isLoading ? "..." : String(total)}
            icon={Users}
            variant="blue"
          />
          <StatCard
            title="Active Students"
            value={isLoading ? "..." : String(activeCount)}
            icon={UserPlus}
            variant="green"
          />
          <StatCard
            title="Attendance"
            value="92%"
            icon={CalendarCheck}
            variant="amber"
          />
        </div>

        {/* Table Card */}
        <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-card">
          <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-bold tracking-tight">Student Directory</CardTitle>
            <div className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">
              Showing {students.length} Records
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Loading students...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <p className="text-sm font-bold text-rose-500">{error}</p>
                <Button variant="outline" onClick={fetchStudents} className="rounded-xl">
                  Retry
                </Button>
              </div>
            ) : (
              <GenericTable
                data={students}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchKeys={["name", "studentId", "className"]}
              />
            )}
          </CardContent>
        </Card>
      </main>

      <ManageStudentDetails
        isOpen={isManage}
        onOpenChange={handleManageClose}
        student={selectedStudent}
      />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, variant }: { title: string; value: string; icon: LucideIcon; variant: 'blue' | 'green' | 'amber' }) {
  const styles = {
    blue: {
      bg: "bg-indigo-50",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      text: "text-indigo-900"
    },
    green: {
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      text: "text-emerald-900"
    },
    amber: {
      bg: "bg-amber-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      text: "text-amber-900"
    }
  }[variant];

  return (
    <Card className={`rounded-[2.2rem] border-none shadow-sm p-7 transition-all hover:shadow-md group ${styles.bg}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">{title}</p>
          <p className={`text-3xl font-black mt-1 tracking-tight ${styles.text}`}>{value}</p>
        </div>
        <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 group-hover:rotate-3 ${styles.iconBg}`}>
          <Icon className={`w-7 h-7 ${styles.iconColor}`} />
        </div>
      </div>
    </Card>
  );
}