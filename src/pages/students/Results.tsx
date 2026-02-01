"use client";

import { useState } from "react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import ManageResultDetails from "@/components/students/results-details";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Percent, Award } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Result } from "@/lib/types";

const mockResults: Result[] = [
  {
    id: 1,
    studentId: 1,
    studentName: "Rahul Sharma",
    class: "10th A",
    totalMarks: 440,
    percentage: 88,
    result: "Pass",
  },
  {
    id: 2,
    studentId: 2,
    studentName: "Ananya Verma",
    class: "9th B",
    totalMarks: 215,
    percentage: 43,
    result: "Fail",
  },
];

const columns: ColumnDef<Result>[] = [
  {
    accessorKey: "studentName",
    header: "Student Name",
  },
  {
    accessorKey: "class",
    header: "Class",
  },
  {
    accessorKey: "totalMarks",
    header: "Total Marks",
  },
  {
    accessorKey: "percentage",
    header: "Percentage",
    cell: (info) => `${info.getValue()}%`,
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

export default function Results() {
  const [isManage, setIsManage] = useState(false);
  const [results, setResults] = useState<Result[]>(mockResults);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);

  const handleEdit = (result: Result) => {
    setSelectedResult(result);
    setIsManage(true);
  };

  const handleDelete = (result: Result) => {
    setResults(results.filter((r) => r.id !== result.id));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        {/* Top Action + Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-semibold">Results</h1>
          <div className="flex gap-2">
            <Button
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
              onClick={() => {
                setSelectedResult(null);
                setIsManage(true);
              }}
            >
              <FileText className="w-5 h-5" />
              Add Result
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Results"
            value={String(results.length)}
            icon={FileText}
            color="bg-blue-500/70 text-white"
          />
          <StatCard
            title="Average Percentage"
            value="74%"
            icon={Percent}
            color="bg-green-500/70 text-white"
          />
          <StatCard
            title="Top Performer"
            value="A+"
            icon={Award}
            color="bg-purple-500/70 text-white"
          />
        </div>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Results</CardTitle>
          </CardHeader>
          <CardContent>
            <GenericTable
              data={results}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              searchKeys={["studentName", "class"]}
            />
          </CardContent>
        </Card>
      </main>

      {/* Manage Result Modal */}
      <ManageResultDetails
        isOpen={isManage}
        onOpenChange={setIsManage}
        result={selectedResult}
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