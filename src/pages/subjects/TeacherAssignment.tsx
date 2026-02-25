"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { BookOpen, UserCheck, UserX, Check, RotateCcw, Plus, Pencil, Trash2 } from "lucide-react";
import { type LucideIcon } from "lucide-react";

import TeacherAssignmentDetails, {
  type SubjectAssignment,
} from "@/components/subjects/teacherassignment-details";
import type { Teacher } from "@/lib/types";
import { subjectAssignmentsApi, teachersApi } from "@/lib/api";

const SUBJECT_COLORS = [
  { bg: "bg-[oklch(0.6959_0.1491_162.4796)]/10", text: "text-[oklch(0.6959_0.1491_162.4796)]" },
  { bg: "bg-[oklch(0.6231_0.1880_259.8145)]/10", text: "text-[oklch(0.6231_0.1880_259.8145)]" },
  { bg: "bg-[oklch(0.7686_0.1647_70.0804)]/10",  text: "text-[oklch(0.7686_0.1647_70.0804)]"  },
  { bg: "bg-[oklch(0.6056_0.2189_292.7172)]/10", text: "text-[oklch(0.6056_0.2189_292.7172)]" },
];

export default function TeacherAssignmentPage() {
  const [subjects, setSubjects] = useState<SubjectAssignment[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [pending, setPending]   = useState<Record<number, string>>({});
  const [saved, setSaved]       = useState<Record<number, boolean>>({});
  const [selected, setSelected] = useState<SubjectAssignment | null>(null);
  const [isOpen, setIsOpen]     = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [assignRes, teacherRes] = await Promise.all([
        subjectAssignmentsApi.getAll({ page: 1, limit: 200 }),
        teachersApi.getAll({ page: 1, limit: 500 }),
      ]);
      setSubjects(assignRes.data ?? []);
      setTeachers(teacherRes.data ?? []);
    } catch {
      // silently fail
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, [fetchData]);

  const totalSubjects   = subjects.length;
  const assignedCount   = subjects.filter((s) => s.teacherId !== "").length;
  const unassignedCount = subjects.filter((s) => s.teacherId === "").length;
  const hasPending      = Object.keys(pending).length > 0;

  const grouped = subjects.reduce<Record<string, SubjectAssignment[]>>((acc, s) => {
    if (!acc[s.className]) acc[s.className] = [];
    acc[s.className].push(s);
    return acc;
  }, {});

  // ---- Inline dropdown assignment ----
  const handleSelect = (subjectId: number, teacherId: string) => {
    setPending((prev) => ({ ...prev, [subjectId]: teacherId }));
    setSaved((prev) => ({ ...prev, [subjectId]: false }));
  };

  const handleSave = async (subjectId: number) => {
    const newTeacherId = pending[subjectId];
    if (newTeacherId === undefined) return;
    const teacher = teachers.find((t) => String(t.id) === newTeacherId);
    try {
      await subjectAssignmentsApi.assignTeacher(subjectId, {
        teacherId: newTeacherId,
        teacherName: teacher?.name ?? "",
      });
      setSubjects((prev) => prev.map((s) =>
        s.id === subjectId ? { ...s, teacherId: newTeacherId, teacherName: teacher?.name ?? "" } : s
      ));
      setPending((prev) => { const n = { ...prev }; delete n[subjectId]; return n; });
      setSaved((prev) => ({ ...prev, [subjectId]: true }));
      setTimeout(() => setSaved((prev) => ({ ...prev, [subjectId]: false })), 2000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to save");
    }
  };

  const handleReset = (subjectId: number) => {
    setPending((prev) => { const n = { ...prev }; delete n[subjectId]; return n; });
  };

  const handleSaveAll = async () => {
    try {
      await Promise.all(
        Object.entries(pending).map(([id, teacherId]) => {
          const teacher = teachers.find((t) => String(t.id) === teacherId);
          return subjectAssignmentsApi.assignTeacher(Number(id), {
            teacherId,
            teacherName: teacher?.name ?? "",
          });
        })
      );
      const updated = subjects.map((s) => {
        if (pending[s.id] === undefined) return s;
        const teacher = teachers.find((t) => String(t.id) === pending[s.id]);
        return { ...s, teacherId: pending[s.id], teacherName: teacher?.name ?? "" };
      });
      setSubjects(updated);
      setPending({});
      const allSaved = Object.fromEntries(updated.map((s) => [s.id, true]));
      setSaved(allSaved);
      setTimeout(() => setSaved({}), 2000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to save all");
    }
  };

  // ---- Sheet open/close ----
  const handleEdit = (s: SubjectAssignment) => { setSelected(s); setIsOpen(true); };
  const handleAdd  = () => { setSelected(null); setIsOpen(true); };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) fetchData(); // refresh after sheet closes
  };

  const handleDelete = async (id: number) => {
    try {
      await subjectAssignmentsApi.delete(id);
      setSubjects((prev) => prev.filter((s) => s.id !== id));
      setPending((prev) => { const n = { ...prev }; delete n[id]; return n; });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  return (
    <div className="p-4 md:px-8 md:pt-2 md:pb-8 bg-muted/30 min-h-screen">
      <main className="space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 ml-1 mt-2">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Teacher Assignment</h1>
            <p className="text-muted-foreground text-base font-medium mt-1">Assign a teacher to each subject</p>
          </div>
          <div className="flex gap-3">
            {hasPending && (
              <Button
                onClick={handleSaveAll}
                variant="outline"
                className="rounded-2xl px-6 py-6 h-auto font-bold gap-2 border-2"
              >
                <Check className="w-5 h-5" />
                Save All ({Object.keys(pending).length})
              </Button>
            )}
            <Button
              onClick={handleAdd}
              className="rounded-2xl bg-primary px-6 py-6 h-auto font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all gap-2"
            >
              <Plus className="w-5 h-5" />
              Assign Teacher
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total Subjects"  value={String(totalSubjects)}   icon={BookOpen}  variant="blue"   />
          <StatCard title="Assigned"        value={String(assignedCount)}   icon={UserCheck} variant="green"  />
          <StatCard title="Unassigned"      value={String(unassignedCount)} icon={UserX}     variant="amber"  />
        </div>

        {/* Grouped by class */}
        {Object.entries(grouped).map(([className, classSubjects]) => (
          <Card key={className} className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-card">
            <CardHeader className="px-8 pt-8 pb-4 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg font-black tracking-tight">{className}</CardTitle>
              <span className="text-xs font-bold text-muted-foreground/40 uppercase tracking-widest">
                {classSubjects.filter((s) => s.teacherId !== "").length}/{classSubjects.length} Assigned
              </span>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {classSubjects.map((subject, idx) => {
                  const color      = SUBJECT_COLORS[idx % SUBJECT_COLORS.length];
                  const isPending  = pending[subject.id] !== undefined;
                  const isSaved    = saved[subject.id];
                  const currentVal = isPending ? pending[subject.id] : subject.teacherId;
                  const isAssigned = subject.teacherId !== "" && !isPending;

                  return (
                    <div
                      key={subject.id}
                      className={`group relative flex flex-col gap-4 p-5 rounded-2xl border transition-all ${
                        isSaved   ? "border-emerald-300 bg-emerald-500/5" :
                        isPending ? "border-primary/30 bg-primary/5"      :
                                    "border-border/40 bg-muted/30 hover:bg-muted/50"
                      }`}
                    >
                      {isSaved && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}

                      {!isPending && !isSaved && (
                        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(subject)}
                            className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(subject.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-muted-foreground hover:text-rose-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl ${color.bg} shrink-0`}>
                          <BookOpen className={`w-4 h-4 ${color.text}`} />
                        </div>
                        <div>
                          <p className="font-black text-foreground tracking-tight leading-tight pr-12">{subject.subjectName}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mt-0.5">{subject.subjectCode}</p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Assigned Teacher</p>
                        <Select
                          value={currentVal || "unassigned"}
                          onValueChange={(v) => handleSelect(subject.id, v === "unassigned" ? "" : v)}
                        >
                          <SelectTrigger className={`rounded-xl h-9 text-sm border ${
                            isAssigned
                              ? "border-emerald-200 bg-emerald-500/5 text-emerald-700 font-bold"
                              : "border-muted-foreground/20"
                          }`}>
                            <SelectValue placeholder="Select teacher" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="unassigned" className="text-muted-foreground/50 font-medium">
                              — Unassigned —
                            </SelectItem>
                            {teachers.map((t) => (
                              <SelectItem key={t.id} value={String(t.id)} className="font-medium">{t.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {isPending && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSave(subject.id)}
                            className="flex-1 rounded-xl h-8 text-xs font-black bg-primary shadow-sm shadow-primary/20"
                          >
                            <Check className="w-3 h-3 mr-1" /> Save
                          </Button>
                          <button
                            onClick={() => handleReset(subject.id)}
                            className="p-2 rounded-xl bg-muted/60 hover:bg-muted text-muted-foreground transition-colors"
                            title="Reset"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}

        {Object.keys(grouped).length === 0 && (
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-card">
            <CardContent className="flex flex-col items-center justify-center py-20 gap-3">
              <BookOpen className="w-10 h-10 text-muted-foreground/30" />
              <p className="text-sm font-bold text-muted-foreground">No subject assignments yet</p>
              <Button onClick={handleAdd} className="rounded-xl mt-2">Add First Assignment</Button>
            </CardContent>
          </Card>
        )}
      </main>

      <TeacherAssignmentDetails
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        subject={selected}
        teachers={teachers}
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