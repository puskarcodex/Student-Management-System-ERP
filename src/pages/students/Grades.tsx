"use client";

import { useState } from "react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import ManageGradeDetails from "@/components/students/grades-details";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpenCheck, Percent, Award } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Grade } from "@/lib/types";

const mockGrades: Grade[] = [
  {
    id: 1,
    studentId: 1,
    studentName: "Rahul Sharma",
    subject: "Mathematics",
    marks: 88,
    grade: "A",
    result: "Pass",
  },
  {
    id: 2,
    studentId: 2,
    studentName: "Ananya Verma",
    subject: "Physics",
    marks: 42,
    grade: "D",
    result: "Fail",
  },
];

const columns: ColumnDef<Grade>[] = [
  {
    accessorKey: "studentName",
    header: "Student Name",
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "marks",
    header: "Marks",
  },
  {
    accessorKey: "grade",
    header: "Grade",
  },
  {
    accessorKey: "result",
    header: "Result",
    cell: (info) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          info.getValue() === "Pass"
            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
        }`}
      >
        {String(info.getValue())}
      </span>
    ),
  },
];

export default function Grades() {
  const [isManage, setIsManage] = useState(false);
  const [grades, setGrades] = useState<Grade[]>(mockGrades);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  const handleEdit = (grade: Grade) => {
    setSelectedGrade(grade);
    setIsManage(true);
  };

  const handleDelete = (grade: Grade) => {
    setGrades(grades.filter((g) => g.id !== grade.id));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        {/* Top Action + Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-semibold">Grades</h1>
          <div className="flex gap-2">
            <Button
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
              onClick={() => {
                setSelectedGrade(null);
                setIsManage(true);
              }}
            >
              <Award className="w-5 h-5" />
              Add Grade
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Records"
            value={String(grades.length)}
            icon={BookOpenCheck}
            color="bg-blue-500/70 text-white"
          />
          <StatCard
            title="Average Score"
            value="76%"
            icon={Percent}
            color="bg-green-500/70 text-white"
          />
          <StatCard
            title="Top Grades"
            value="A+"
            icon={Award}
            color="bg-pink-500/70 text-white"
          />
        </div>

        {/* Grades Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <GenericTable
              data={grades}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              searchKeys={["studentName", "subject"]}
            />
          </CardContent>
        </Card>
      </main>

      {/* Manage Grade Modal */}
      <ManageGradeDetails
        isOpen={isManage}
        onOpenChange={setIsManage}
        grade={selectedGrade}
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