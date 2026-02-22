"use client";

import { useState } from "react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import ManageStudentDetails from "@/components/students/student-details";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, UserPlus, CalendarCheck } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Student } from "@/lib/types";

const mockStudents: Student[] = [
  { id: 1, name: "John Doe", email: "john@school.com", phone: "+1234567890", dob: "2000-01-15", studentId: "STU001", className: "10", rollNo: 23, status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@school.com", phone: "+9876543210", dob: "2000-05-20", studentId: "STU002", className: "9", rollNo: 12, status: "Inactive" },
];

const columns: ColumnDef<Student>[] = [
  { accessorKey: "studentId", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "className", header: "Class" },
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
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsManage(true);
  };

  const handleDelete = (student: Student) => {
    setStudents(students.filter((s) => s.id !== student.id));
  };

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
            value={String(students.length)}
            icon={Users}
            variant="blue"
          />
          <StatCard
            title="New Enrollments"
            value="45"
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
            <GenericTable
              data={students}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              searchKeys={["name", "studentId", "className"]}
            />
          </CardContent>
        </Card>
      </main>

      <ManageStudentDetails
        isOpen={isManage}
        onOpenChange={setIsManage}
        student={selectedStudent}
      />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, variant }: { title: string; value: string; icon: LucideIcon; variant: 'blue' | 'green' | 'amber' }) {
  // Sweet & Subtle Color Mapping
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