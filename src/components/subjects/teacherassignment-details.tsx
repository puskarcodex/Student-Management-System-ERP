"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { BookOpen, User, Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet, SheetClose, SheetContent, SheetDescription,
  SheetFooter, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { Teacher } from "@/lib/types";
import { subjectAssignmentsApi } from "@/lib/api";

export interface SubjectAssignment {
  id: number;
  subjectName: string;
  subjectCode: string;
  className: string;
  teacherId: string;
  teacherName: string;
}

const CLASS_OPTIONS = [
  "Nursery","LKG","UKG",
  "Class 1","Class 2","Class 3","Class 4","Class 5",
  "Class 6","Class 7","Class 8","Class 9","Class 10",
  "Class 11","Class 12",
];

const SUBJECT_OPTIONS = [
  "Mathematics","Science","English","Nepali","Social Studies",
  "Computer Science","Physics","Chemistry","Biology","History",
  "Geography","Economics","Accountancy","Music","Physical Education",
];

type FormData = {
  subjectName: string;
  subjectCode: string;
  className: string;
  teacherId?: string;
};

const schema = yup.object({
  subjectName: yup.string().required("Subject name is required"),
  subjectCode: yup.string().required("Subject code is required"),
  className:   yup.string().required("Class is required"),
  teacherId:   yup.string().optional(),
}).required();

interface TeacherAssignmentDetailsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  subject?: SubjectAssignment | null;
  teachers: Teacher[];
}

export default function TeacherAssignmentDetails({
  isOpen,
  onOpenChange,
  subject,
  teachers,
}: TeacherAssignmentDetailsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError]   = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: { subjectName: "", subjectCode: "", className: "", teacherId: "" },
  });

  useEffect(() => {
    if (!isOpen) return;
    setSubmitError(null);
    if (subject) {
      reset({
        subjectName: subject.subjectName,
        subjectCode: subject.subjectCode,
        className:   subject.className,
        teacherId:   subject.teacherId || "",
      });
    } else {
      reset({ subjectName: "", subjectCode: "", className: "", teacherId: "" });
    }
  }, [isOpen, subject, reset]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const teacher = teachers.find((t) => String(t.id) === data.teacherId);
      const payload = {
        subjectName: data.subjectName,
        subjectCode: data.subjectCode.toUpperCase(),
        className:   data.className,
        teacherId:   data.teacherId ?? "",
        teacherName: teacher?.name ?? "",
      };
      if (subject) {
        await subjectAssignmentsApi.update(subject.id, payload);
      } else {
        await subjectAssignmentsApi.create(payload);
      }
      onOpenChange(false);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md border-none shadow-2xl p-0 flex flex-col">
        <SheetHeader className="p-8 bg-primary/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <SheetTitle className="text-2xl font-black tracking-tight text-foreground">
              {subject ? "Edit Assignment" : "Assign Teacher"}
            </SheetTitle>
          </div>
          <SheetDescription className="text-muted-foreground font-medium">
            {subject ? "Update subject and teacher assignment" : "Select a subject, class and assign a teacher"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form id="subject-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            <FormSection title="Subject Details" icon={BookOpen}>
              <FormField label="Subject Name" error={errors.subjectName?.message}>
                <Controller name="subjectName" control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="rounded-xl border-muted-foreground/20">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {SUBJECT_OPTIONS.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Subject Code" error={errors.subjectCode?.message}>
                  <Input
                    {...register("subjectCode")}
                    placeholder="e.g. MATH01"
                    className="rounded-xl border-muted-foreground/20 uppercase"
                  />
                </FormField>

                <FormField label="Class" error={errors.className?.message}>
                  <Controller name="className" control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="rounded-xl border-muted-foreground/20">
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {CLASS_OPTIONS.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
              </div>
            </FormSection>

            <FormSection title="Assign Teacher" icon={User}>
              <FormField label="Teacher" error={errors.teacherId?.message}>
                <Controller name="teacherId" control={control}
                  render={({ field }) => (
                    <Select value={field.value || "unassigned"} onValueChange={(v) => field.onChange(v === "unassigned" ? "" : v)}>
                      <SelectTrigger className="rounded-xl border-muted-foreground/20">
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
                  )}
                />
              </FormField>
              <p className="text-[11px] font-bold text-muted-foreground/40 ml-1">
                You can assign a teacher later from the assignment cards too
              </p>
            </FormSection>

            {submitError && (
              <p className="text-[11px] font-bold text-rose-500 text-center">{submitError}</p>
            )}
          </form>
        </div>

        <SheetFooter className="p-8 bg-card border-t flex flex-row items-center justify-end gap-3">
          <SheetClose asChild>
            <Button type="button" variant="ghost" className="rounded-xl font-bold text-muted-foreground" disabled={isSubmitting}>
              Cancel
            </Button>
          </SheetClose>
          <Button
            type="submit"
            form="subject-form"
            disabled={isSubmitting}
            className="rounded-xl bg-primary px-8 font-black shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {subject ? "Updating..." : "Assigning..."}
              </span>
            ) : (
              subject ? "Update Assignment" : "Assign Teacher"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function FormSection({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary/60" />
        <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/40">{title}</h3>
      </div>
      <div className="grid grid-cols-1 gap-4">{children}</div>
    </div>
  );
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label className="text-[13px] font-bold text-foreground/70 ml-1">{label}</Label>
      {children}
      {error && <p className="text-[11px] font-bold text-rose-500 ml-1">{error}</p>}
    </div>
  );
}