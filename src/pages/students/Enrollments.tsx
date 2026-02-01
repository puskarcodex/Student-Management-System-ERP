"use client";

import { useState } from "react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import ManageEnrollmentDetails from "@/components/students/enrollments-details";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ClipboardList, UserCheck, UserPlus } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Enrollment } from "@/lib/types";

const mockEnrollments: Enrollment[] = [
  {
    id: 1,
    studentId: 1,
    studentName: "Rahul Sharma",
    rollNo: "CSE102",
    course: "B.Tech CSE",
    enrolledOn: "2025-01-12",
    status: "Active",
  },
  {
    id: 2,
    studentId: 2,
    studentName: "Ananya Verma",
    rollNo: "ECE054",
    course: "B.Tech ECE",
    enrolledOn: "2024-12-05",
    status: "Completed",
  },
];

const columns: ColumnDef<Enrollment>[] = [
  {
    accessorKey: "studentName",
    header: "Student Name",
  },
  {
    accessorKey: "rollNo",
    header: "Roll No",
  },
  {
    accessorKey: "course",
    header: "Course",
  },
  {
    accessorKey: "enrolledOn",
    header: "Enrolled On",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          info.getValue() === "Active"
            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
        }`}
      >
        {String(info.getValue())}
      </span>
    ),
  },
];

export default function Enrollments() {
  const [isManage, setIsManage] = useState(false);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(mockEnrollments);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);

  const handleEdit = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsManage(true);
  };

  const handleDelete = (enrollment: Enrollment) => {
    setEnrollments(enrollments.filter((e) => e.id !== enrollment.id));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        {/* Top Action + Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-semibold">Enrollments</h1>
          <div className="flex gap-2">
            <Button
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
              onClick={() => {
                setSelectedEnrollment(null);
                setIsManage(true);
              }}
            >
              <UserPlus className="w-5 h-5" />
              Add Enrollment
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Enrollments"
            value={String(enrollments.length)}
            icon={ClipboardList}
            color="bg-blue-500/70 text-white"
          />
          <StatCard
            title="Active Enrollments"
            value={String(enrollments.filter((e) => e.status === "Active").length)}
            icon={UserCheck}
            color="bg-green-500/70 text-white"
          />
          <StatCard
            title="New This Month"
            value="60"
            icon={UserPlus}
            color="bg-purple-500/70 text-white"
          />
        </div>

        {/* Enrollments Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <GenericTable
              data={enrollments}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              searchKeys={["studentName", "course"]}
            />
          </CardContent>
        </Card>
      </main>

      {/* Manage Enrollment Modal */}
      <ManageEnrollmentDetails
        isOpen={isManage}
        onOpenChange={setIsManage}
        enrollment={selectedEnrollment}
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