"use client";

import { useState } from "react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import ManageTeacherDetails from "@/components/teachers/teachers-details";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Award } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Teacher } from "@/lib/types";

const mockTeachers: Teacher[] = [
  {
    id: 1,
    name: "Mr. Sharma",
    email: "sharma@school.com",
    phone: "+1234567890",
    dob: "1980-05-15",
    teacherId: "TCH001",
    subject: "Mathematics",
    status: "Active",
  },
  {
    id: 2,
    name: "Ms. Patel",
    email: "patel@school.com",
    phone: "+9876543210",
    dob: "1985-08-20",
    teacherId: "TCH002",
    subject: "English",
    status: "Active",
  },
];

const columns: ColumnDef<Teacher>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "phone",
    header: "Phone",
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

export default function Teachers() {
  const [isManage, setIsManage] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const handleEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsManage(true);
  };

  const handleDelete = (teacher: Teacher) => {
    setTeachers(teachers.filter((t) => t.id !== teacher.id));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        {/* Top Action + Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-semibold">Teachers</h1>
          <div className="flex gap-2">
            <Button
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
              onClick={() => {
                setSelectedTeacher(null);
                setIsManage(true);
              }}
            >
              <Award className="w-5 h-5" />
              Add Teacher
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Teachers"
            value={String(teachers.length)}
            icon={Users}
            color="bg-blue-500/70 text-white"
          />
          <StatCard
            title="Active Teachers"
            value={String(teachers.filter((t) => t.status === "Active").length)}
            icon={BookOpen}
            color="bg-green-500/70 text-white"
          />
          <StatCard
            title="Subjects Offered"
            value="12"
            icon={Award}
            color="bg-purple-500/70 text-white"
          />
        </div>

        {/* Teachers Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <GenericTable
              data={teachers}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              searchKeys={["name", "email", "subject"]}
            />
          </CardContent>
        </Card>
      </main>

      {/* Manage Teacher Modal */}
      <ManageTeacherDetails
        isOpen={isManage}
        onOpenChange={setIsManage}
        teacher={selectedTeacher}
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