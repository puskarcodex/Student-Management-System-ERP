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
  {
    id: 1,
    name: "John Doe",
    email: "john@school.com",
    phone: "+1234567890",
    dob: "2000-01-15",
    studentId: "STU001",
    class: "10th A",
    rollNo: 23,
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@school.com",
    phone: "+9876543210",
    dob: "2000-05-20",
    studentId: "STU002",
    class: "9th B",
    rollNo: 12,
    status: "Inactive",
  },
];

const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "studentId",
    header: "Student ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "dob",
    header: "Date of Birth",
  },
  {
    accessorKey: "class",
    header: "Class",
  },
  {
    accessorKey: "rollNo",
    header: "Roll No",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          info.getValue() === "Active"
            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
        }`}
      >
        {String(info.getValue())}
      </span>
    ),
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
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        {/* Top Action + Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-semibold">Students</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
              onClick={() => {
                setSelectedStudent(null);
                setIsManage(true);
              }}
            >
              <UserPlus className="w-5 h-5" />
              Add Student
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Students"
            value={String(students.length)}
            icon={Users}
            color="bg-blue-500/70 text-white"
          />
          <StatCard
            title="New Enrollments"
            value="45"
            icon={UserPlus}
            color="bg-green-500/70 text-white"
          />
          <StatCard
            title="Average Attendance"
            value="92%"
            icon={CalendarCheck}
            color="bg-yellow-500/70 text-white"
          />
        </div>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Students</CardTitle>
          </CardHeader>
          <CardContent>
            <GenericTable
              data={students}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              searchKeys={["name", "email", "class"]}
            />
          </CardContent>
        </Card>
      </main>

      {/* Manage Student Modal */}
      <ManageStudentDetails
        isOpen={isManage}
        onOpenChange={setIsManage}
        student={selectedStudent}
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color?: string;
}

function StatCard({ title, value, icon: Icon, color = "bg-white" }: StatCardProps) {
  return (
    <Card className={`rounded-lg shadow-lg p-0 overflow-hidden ${color}`}>
      <div className="flex items-center justify-between p-6 h-full">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-white/20">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
}