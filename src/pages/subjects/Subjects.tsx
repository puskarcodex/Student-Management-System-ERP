"use client";

import { useState } from "react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import ManageSubjectDetails from "@/components/subjects/subjects-details";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Award, Plus } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Subject } from "@/lib/types";

const mockSubjects: Subject[] = [
  { id: 1, name: "Mathematics", code: "MATH101", teacherName: "Mr. Sharma", status: "Active" },
  { id: 2, name: "Physics", code: "PHYS101", teacherName: "Ms. Patel", status: "Active" },
  { id: 3, name: "Chemistry", code: "CHEM101", teacherName: "Mr. Singh", status: "Active" },
  { id: 4, name: "English", code: "ENG101", teacherName: "Ms. Kumar", status: "Inactive" },
];

const columns: ColumnDef<Subject>[] = [
  { accessorKey: "name", header: "Subject Name" },
  { accessorKey: "code", header: "Subject Code" },
  { accessorKey: "teacherName", header: "Teacher" },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => (
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        info.getValue() === "Active"
          ? "bg-emerald-500/10 text-emerald-600"
          : "bg-rose-500/10 text-rose-600"
      }`}>
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
    <div className="p-4 md:px-8 md:pt-2 md:pb-8 bg-muted/30 min-h-screen">
      <main className="space-y-8">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 ml-1 mt-2">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Subjects</h1>
            <p className="text-muted-foreground text-base font-medium mt-1">Manage subjects and assignments</p>
          </div>
          <Button
            onClick={() => { setSelectedSubject(null); setIsManage(true); }}
            className="rounded-2xl bg-primary px-6 py-6 h-auto font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Subject
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total Subjects" value={String(subjects.length)} icon={BookOpen} variant="green" />
          <StatCard title="Active Subjects" value={String(subjects.filter((s) => s.status === "Active").length)} icon={Users} variant="blue" />
          <StatCard title="Teachers" value="8" icon={Award} variant="purple" />
        </div>

        {/* Table Card */}
        <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-card">
          <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-bold tracking-tight">All Subjects</CardTitle>
            <div className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">
              Showing {subjects.length} Records
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
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

      <ManageSubjectDetails
        isOpen={isManage}
        onOpenChange={setIsManage}
        subject={selectedSubject}
      />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, variant }: { title: string; value: string; icon: LucideIcon; variant: "green" | "blue" | "amber" | "purple" }) {
  const styles = {
    green:  { bg: "bg-[oklch(0.6959_0.1491_162.4796)]/10 dark:bg-[oklch(0.6959_0.1491_162.4796)]/15", iconBg: "bg-[oklch(0.6959_0.1491_162.4796)]/20", iconColor: "text-[oklch(0.6959_0.1491_162.4796)]" },
    blue:   { bg: "bg-[oklch(0.6231_0.1880_259.8145)]/10 dark:bg-[oklch(0.6231_0.1880_259.8145)]/15", iconBg: "bg-[oklch(0.6231_0.1880_259.8145)]/20", iconColor: "text-[oklch(0.6231_0.1880_259.8145)]" },
    amber:  { bg: "bg-[oklch(0.7686_0.1647_70.0804)]/10 dark:bg-[oklch(0.7686_0.1647_70.0804)]/15",   iconBg: "bg-[oklch(0.7686_0.1647_70.0804)]/20",   iconColor: "text-[oklch(0.7686_0.1647_70.0804)]"   },
    purple: { bg: "bg-[oklch(0.6056_0.2189_292.7172)]/10 dark:bg-[oklch(0.6056_0.2189_292.7172)]/15", iconBg: "bg-[oklch(0.6056_0.2189_292.7172)]/20", iconColor: "text-[oklch(0.6056_0.2189_292.7172)]" },
  }[variant];

  return (
    <Card className={`rounded-[2.2rem] border-none shadow-sm p-7 transition-all hover:shadow-md group ${styles.bg}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">{title}</p>
          <p className="text-3xl font-black mt-1 tracking-tight text-foreground">{value}</p>
        </div>
        <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 group-hover:rotate-3 ${styles.iconBg}`}>
          <Icon className={`w-7 h-7 ${styles.iconColor}`} />
        </div>
      </div>
    </Card>
  );
}