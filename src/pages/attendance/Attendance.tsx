"use client";

import { useState } from "react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import ManageAttendanceDetails from "@/components/attendance/attendance-details";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Attendance } from "@/lib/types";

const mockAttendance: Attendance[] = [
  {
    id: 1,
    studentName: "John Doe",
    date: "2025-02-01",
    status: "Present",
  },
  {
    id: 2,
    studentName: "Jane Smith",
    date: "2025-02-01",
    status: "Absent",
  },
  {
    id: 3,
    studentName: "Rahul Sharma",
    date: "2025-02-01",
    status: "Leave",
  },
];

const columns: ColumnDef<Attendance>[] = [
  {
    accessorKey: "studentName",
    header: "Student Name",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = String(info.getValue());
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
            status === "Present"
              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
              : status === "Absent"
                ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
          }`}
        >
          {status === "Present" && <CheckCircle className="w-3 h-3" />}
          {status === "Absent" && <XCircle className="w-3 h-3" />}
          {status === "Leave" && <AlertCircle className="w-3 h-3" />}
          {status}
        </span>
      );
    },
  },
];

export default function Attendance() {
  const [isManage, setIsManage] = useState(false);
  const [attendanceData, setAttendanceData] = useState<Attendance[]>(mockAttendance);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);

  const handleEdit = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setIsManage(true);
  };

  const handleDelete = (attendance: Attendance) => {
    setAttendanceData(attendanceData.filter((a) => a.id !== attendance.id));
  };

  const presentCount = attendanceData.filter((a) => a.status === "Present").length;
  const absentCount = attendanceData.filter((a) => a.status === "Absent").length;
  const leaveCount = attendanceData.filter((a) => a.status === "Leave").length;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        {/* Top Action + Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-semibold">Attendance</h1>
          <div className="flex gap-2">
            <Button
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
              onClick={() => {
                setSelectedAttendance(null);
                setIsManage(true);
              }}
            >
              <CheckCircle className="w-5 h-5" />
              Mark Attendance
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Present"
            value={String(presentCount)}
            icon={CheckCircle}
            color="bg-green-500/70 text-white"
          />
          <StatCard
            title="Absent"
            value={String(absentCount)}
            icon={XCircle}
            color="bg-red-500/70 text-white"
          />
          <StatCard
            title="Leave"
            value={String(leaveCount)}
            icon={AlertCircle}
            color="bg-yellow-500/70 text-white"
          />
        </div>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            <GenericTable
              data={attendanceData}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              searchKeys={["studentName"]}
            />
          </CardContent>
        </Card>
      </main>

      {/* Manage Attendance Modal */}
      <ManageAttendanceDetails
        isOpen={isManage}
        onOpenChange={setIsManage}
        attendance={selectedAttendance}
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