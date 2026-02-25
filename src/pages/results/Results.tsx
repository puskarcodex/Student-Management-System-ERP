"use client";

import { useState, useEffect, useCallback } from "react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import ManageResultDetails from "@/components/results/results-details";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Percent, Award, Plus, Loader2 } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Result } from "@/lib/types";
import { resultsApi } from "@/lib/api";

const columns: ColumnDef<r>[] = [
  { accessorKey: "studentName", header: "Student Name" },
  { accessorKey: "studentId", header: "Student ID" },
  { accessorKey: "className", header: "Class" },
  { accessorKey: "totalMarks", header: "Total Marks" },
  { accessorKey: "percentage", header: "Percentage", cell: (info) => `${info.getValue()}%` },
  {
    accessorKey: "resultStatus",
    header: "Result",
    cell: (info) => (
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${info.getValue() === "Pass" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>
        {String(info.getValue())}
      </span>
    ),
  },
];

export default function Results() {
  const [isManage, setIsManage] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [mode, setMode] = useState<"add" | "edit" | "view">("add");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await resultsApi.getAll({ page: 1, limit: 100 });
      setResults(res.data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load results");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchResults(); }, [fetchResults]);

  const handleView = (result: Result) => {
    setSelectedResult(result);
    setMode("view");
    setIsManage(true);
  };

  const handleEdit = (result: Result) => {
    setSelectedResult(result);
    setMode("edit");
    setIsManage(true);
  };

  const handleDelete = async (result: Result) => {
    try {
      await resultsApi.delete(result.id);
      setResults((prev) => prev.filter((r) => r.id !== result.id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete result");
    }
  };

  const handleManageClose = (open: boolean) => {
    setIsManage(open);
    if (!open) fetchResults();
  };

  const avgPercentage =
    results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
      : 0;

  const topPercentage = results.length > 0 ? Math.max(...results.map((r) => r.percentage)) : 0;

  return (
    <div className="p-4 md:px-8 md:pt-2 md:pb-8 bg-muted/30 min-h-screen">
      <main className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 ml-1 mt-2">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Results</h1>
            <p className="text-muted-foreground text-base font-medium mt-1">Exam results & report cards</p>
          </div>
          <Button
            onClick={() => { setSelectedResult(null); setMode("add"); setIsManage(true); }}
            className="rounded-2xl bg-primary px-6 py-6 h-auto font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Result
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total Results" value={isLoading ? "..." : String(results.length)} icon={FileText} variant="green" />
          <StatCard title="Average Percentage" value={isLoading ? "..." : `${avgPercentage}%`} icon={Percent} variant="blue" />
          <StatCard title="Top Score" value={isLoading ? "..." : `${topPercentage}%`} icon={Award} variant="purple" />
        </div>

        <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-card">
          <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-bold tracking-tight">All Results</CardTitle>
            <div className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">
              Showing {results.length} Records
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Loading results...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <p className="text-sm font-bold text-rose-500">{error}</p>
                <Button variant="outline" onClick={fetchResults} className="rounded-xl">Retry</Button>
              </div>
            ) : (
              <GenericTable
                data={results}
                columns={columns}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchKeys={["studentName", "className"]}
              />
            )}
          </CardContent>
        </Card>
      </main>

      <ManageResultDetails
        isOpen={isManage}
        onOpenChange={handleManageClose}
        result={selectedResult}
        mode={mode}
      />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, variant }: { title: string; value: string; icon: LucideIcon; variant: "green" | "blue" | "amber" | "purple" }) {
  const styles = {
    green:  { bg: "bg-[oklch(0.6959_0.1491_162.4796)]/10 dark:bg-[oklch(0.6959_0.1491_162.4796)]/15", iconBg: "bg-[oklch(0.6959_0.1491_162.4796)]/20", iconColor: "text-[oklch(0.6959_0.1491_162.4796)]", text: "text-foreground" },
    blue:   { bg: "bg-[oklch(0.6231_0.1880_259.8145)]/10 dark:bg-[oklch(0.6231_0.1880_259.8145)]/15", iconBg: "bg-[oklch(0.6231_0.1880_259.8145)]/20", iconColor: "text-[oklch(0.6231_0.1880_259.8145)]", text: "text-foreground" },
    amber:  { bg: "bg-[oklch(0.7686_0.1647_70.0804)]/10 dark:bg-[oklch(0.7686_0.1647_70.0804)]/15",   iconBg: "bg-[oklch(0.7686_0.1647_70.0804)]/20",   iconColor: "text-[oklch(0.7686_0.1647_70.0804)]",   text: "text-foreground" },
    purple: { bg: "bg-[oklch(0.6056_0.2189_292.7172)]/10 dark:bg-[oklch(0.6056_0.2189_292.7172)]/15", iconBg: "bg-[oklch(0.6056_0.2189_292.7172)]/20", iconColor: "text-[oklch(0.6056_0.2189_292.7172)]", text: "text-foreground" },
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