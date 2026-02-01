"use client";

import { useState } from "react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import ManageSubjectDetails from "@/components/classes/subjects-details";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Award } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Subject } from "@/lib/types";

const mockSubjects: Subject[] = [
  {
    id: 1,
    name: "Mathematics",
    code: "MATH101",
    teacherName: "Mr. Sharma",
    status: "Active",
  },
  {
    id: 2,
    name: "Physics",
    code: "PHYS101",
    teacherName: "Ms. Patel",
    status: "Active",
  },
  {
    id: 3,
    name: "Chemistry",
    code: "CHEM101",
    teacherName: "Mr. Singh",
    status: "Active",
  },
  {
    id: 4,
    name: "English",
    code: "ENG101",
    teacherName: "Ms. Kumar",
    status: "Inactive",
  },
];

const columns: ColumnDef<Subject>[] = [
  {
    accessorKey: "name",
    header: "Subject Name",
  },
  {
    accessorKey: "code",
    header: "Subject Code",
  },
  {
    accessorKey: "teacherName",
    header: "Teacher",
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

export default function Subjects() {
  const [isManage, setIsManage] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const handleEdit = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsManage(true);
  };

  const handleDelete = (subject: Subject) => {
    setSubjects(subjects.filter((s) => s.id !== subject.id));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        {/* Top Action + Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-semibold">Subjects</h1>
          <div className="flex gap-2">
            <Button
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
              onClick={() => {
                setSelectedSubject(null);
                setIsManage(true);
              }}
            >
              <BookOpen className="w-5 h-5" />
              Add Subject
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Subjects"
            value={String(subjects.length)}
            icon={BookOpen}
            color="bg-blue-500/70 text-white"
          />
          <StatCard
            title="Active Subjects"
            value={String(subjects.filter((s) => s.status === "Active").length)}
            icon={Users}
            color="bg-green-500/70 text-white"
          />
          <StatCard
            title="Teachers"
            value="8"
            icon={Award}
            color="bg-purple-500/70 text-white"
          />
        </div>

        {/* Subjects Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <GenericTable
              data={subjects}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              searchKeys={["name", "code", "teacherName"]}
            />
          </CardContent>
        </Card>
      </main>

      {/* Manage Subject Modal */}
      <ManageSubjectDetails
        isOpen={isManage}
        onOpenChange={setIsManage}
        subject={selectedSubject}
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