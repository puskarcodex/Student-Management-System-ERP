"use client";

import { useState } from "react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import ManageClassDetails from "@/components/classes/classes-details";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Award } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { ClassData } from "@/lib/types";

const mockClasses: ClassData[] = [
  {
    id: 1,
    name: "10th A",
    teacherName: "Mr. Sharma",
    studentCount: 45,
    status: "Active",
  },
  {
    id: 2,
    name: "9th B",
    teacherName: "Ms. Patel",
    studentCount: 42,
    status: "Active",
  },
  {
    id: 3,
    name: "8th C",
    teacherName: "Mr. Singh",
    studentCount: 38,
    status: "Inactive",
  },
];

const columns: ColumnDef<ClassData>[] = [
  {
    accessorKey: "name",
    header: "Class Name",
  },
  {
    accessorKey: "teacherName",
    header: "Teacher",
  },
  {
    accessorKey: "studentCount",
    header: "Students",
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

export default function Classes() {
  const [isManage, setIsManage] = useState(false);
  const [classes, setClasses] = useState<ClassData[]>(mockClasses);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);

  const handleEdit = (classData: ClassData) => {
    setSelectedClass(classData);
    setIsManage(true);
  };

  const handleDelete = (classData: ClassData) => {
    setClasses(classes.filter((c) => c.id !== classData.id));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        {/* Top Action + Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-semibold">Classes</h1>
          <div className="flex gap-2">
            <Button
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
              onClick={() => {
                setSelectedClass(null);
                setIsManage(true);
              }}
            >
              <BookOpen className="w-5 h-5" />
              Add Class
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Classes"
            value={String(classes.length)}
            icon={BookOpen}
            color="bg-blue-500/70 text-white"
          />
          <StatCard
            title="Total Students"
            value={String(classes.reduce((sum, c) => sum + c.studentCount, 0))}
            icon={Users}
            color="bg-green-500/70 text-white"
          />
          <StatCard
            title="Active Classes"
            value={String(classes.filter((c) => c.status === "Active").length)}
            icon={Award}
            color="bg-purple-500/70 text-white"
          />
        </div>

        {/* Classes Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <GenericTable
              data={classes}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              searchKeys={["name", "teacherName"]}
            />
          </CardContent>
        </Card>
      </main>

      {/* Manage Class Modal */}
      <ManageClassDetails
        isOpen={isManage}
        onOpenChange={setIsManage}
        classData={selectedClass}
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