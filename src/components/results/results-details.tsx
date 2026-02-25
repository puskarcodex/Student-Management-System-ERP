"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FileText, User, GraduationCap, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Result, Student } from "@/lib/types";
import { resultsApi, studentsApi } from "@/lib/api";
import {
  CLASS_OPTIONS,
  RESULT_OPTIONS,
} from "@/lib/dropdown-options";

interface ManageResultProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  result?: Result | null;
  mode?: "add" | "edit" | "view";
}

const schema = yup.object({
  studentId: yup.number().typeError("Student is required").required("Student is required"),
  studentName: yup.string().required("Student name is required"),
  class: yup.string().required("Class is required"),
  totalMarks: yup.number().typeError("Total marks must be a number").required("Total marks is required").min(0),
  percentage: yup.number().typeError("Percentage must be a number").required("Percentage is required").min(0).max(100),
  result: yup.string().oneOf(["Pass", "Fail"]).required("Result is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageResultDetails({
  isOpen,
  onOpenChange,
  result,
  mode = "add",
}: ManageResultProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    studentsApi.getAll({ page: 1, limit: 500 }).then((res) => {
      setStudents(res.data ?? []);
    }).catch(() => {});
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { result: "Pass" },
  });

  useEffect(() => {
    if (!isOpen) return;
    if (result) {
      reset({
        studentId: result.studentId,
        studentName: result.studentName,
        class: result.className,
        totalMarks: result.totalMarks,
        percentage: result.percentage,
        result: result.resultStatus,
      });
    } else {
      reset({
        result: "Pass",
        studentId: undefined,
        studentName: "",
        class: "",
        totalMarks: undefined,
        percentage: undefined,
      });
    }
  }, [isOpen, result, reset]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        studentId: data.studentId,
        studentName: data.studentName,
        className: data.class,
        totalMarks: data.totalMarks,
        percentage: data.percentage,
        result: data.result as "Pass" | "Fail",
      };
      if (result) {
        await resultsApi.update(result.id, payload);
      } else {
        await resultsApi.create(payload);
      }
      reset();
      onOpenChange(false);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPassed = result?.resultStatus === "Pass";

  const headerBg =
    mode === "view"
      ? isPassed
        ? "bg-emerald-50/80"
        : "bg-rose-50/80"
      : "bg-orange-50/50";

  const headerIconBg =
    mode === "view"
      ? isPassed
        ? "bg-emerald-100"
        : "bg-rose-100"
      : "bg-orange-100";

  const headerIconColor =
    mode === "view"
      ? isPassed
        ? "text-emerald-600"
        : "text-rose-600"
      : "text-orange-600";

  const headerTitleColor =
    mode === "view"
      ? isPassed
        ? "text-emerald-950"
        : "text-rose-950"
      : "text-orange-950";

  const headerDescColor =
    mode === "view"
      ? isPassed
        ? "text-emerald-900/60"
        : "text-rose-900/60"
      : "text-orange-900/60";

  const title =
    mode === "view" ? "Report Card" : mode === "edit" ? "Edit Result" : "Add Result";

  const description =
    mode === "view"
      ? "Academic result summary"
      : mode === "edit"
      ? "Modify existing result record"
      : "Enter exam result details for a student";

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg border-none shadow-2xl p-0 flex flex-col">

        <SheetHeader className={`p-8 ${headerBg}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-xl ${headerIconBg}`}>
              <FileText className={`w-5 h-5 ${headerIconColor}`} />
            </div>
            <SheetTitle className={`text-2xl font-black tracking-tight ${headerTitleColor}`}>
              {title}
            </SheetTitle>
          </div>
          <SheetDescription className={`font-medium ${headerDescColor}`}>
            {description}
          </SheetDescription>

          {mode === "view" && result && (
            <div className="mt-3 flex items-center gap-2">
              {isPassed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600" />
              )}
              <span
                className={`text-sm font-bold px-3 py-1 rounded-full ${
                  isPassed
                    ? "bg-emerald-500/20 text-emerald-700"
                    : "bg-rose-500/20 text-rose-700"
                }`}
              >
                {result.result}
              </span>
            </div>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">

          {/* VIEW MODE — Report Card */}
          {mode === "view" && result ? (
            <div className="space-y-8">
              <ReportSection title="Student Info" icon={User}>
                <ReportRow label="Student Name" value={result.studentName} />
                <ReportRow label="Student ID" value={String(result.studentId)} />
                <ReportRow label="Class / Grade" value={`Class ${result.className}`} />
              </ReportSection>

              <div className="border-t border-muted-foreground/10" />

              <ReportSection title="Exam Details" icon={GraduationCap}>
                <ReportRow label="Total Marks" value={String(result.totalMarks)} />
                <ReportRow label="Percentage" value={`${result.percentage}%`} />
              </ReportSection>
            </div>
          ) : (
            /* ADD / EDIT MODE — Form */
            <form id="result-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">

              <FormSection title="Student" icon={User}>
                <FormField label="Class / Grade" error={errors.class?.message}>
                  <Controller
                    name="class"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="rounded-xl border-muted-foreground/20">
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl max-h-56">
                          {CLASS_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>

                <FormField label="Select Student" error={errors.studentId?.message}>
                  <Controller
                    name="studentId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(val) => {
                          field.onChange(Number(val));
                          const found = students.find((s) => s.id === Number(val));
                          if (found) setValue("studentName", found.name);
                        }}
                      >
                        <SelectTrigger className="rounded-xl border-muted-foreground/20">
                          <SelectValue placeholder="Select student" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {students.map((s) => (
                            <SelectItem key={s.id} value={String(s.id)}>
                              {s.name} - {s.studentId}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
              </FormSection>

              <FormSection title="Exam Details" icon={GraduationCap}>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Total Marks" error={errors.totalMarks?.message}>
                    <Input
                      type="number"
                      {...register("totalMarks")}
                      placeholder="e.g. 500"
                      className="rounded-xl border-muted-foreground/20"
                    />
                  </FormField>
                  <FormField label="Percentage (%)" error={errors.percentage?.message}>
                    <Input
                      type="number"
                      step="0.01"
                      {...register("percentage")}
                      placeholder="0 - 100"
                      className="rounded-xl border-muted-foreground/20"
                    />
                  </FormField>
                </div>

                <FormField label="Result" error={errors.result?.message}>
                  <Controller
                    name="result"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="rounded-xl border-muted-foreground/20">
                          <SelectValue placeholder="Select result" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {RESULT_OPTIONS.map((opt) => (
                            <SelectItem
                              key={opt.value}
                              value={opt.value}
                              className={opt.value === "Pass" ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}
                            >
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
              </FormSection>

              {submitError && (
                <p className="text-[11px] font-bold text-rose-500 text-center">{submitError}</p>
              )}
            </form>
          )}
        </div>

        <SheetFooter className="p-8 bg-card border-t flex flex-row items-center justify-end gap-3">
          <SheetClose asChild>
            <Button type="button" variant="ghost" className="rounded-xl font-bold text-muted-foreground">
              {mode === "view" ? "Close" : "Cancel"}
            </Button>
          </SheetClose>
          {mode !== "view" && (
            <Button
              type="submit"
              form="result-form"
              disabled={isSubmitting}
              className="rounded-xl bg-primary px-8 font-black shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {mode === "edit" ? "Updating..." : "Saving..."}
                </span>
              ) : (
                mode === "edit" ? "Update Result" : "Save Result"
              )}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function ReportSection({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-muted-foreground/50" />
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/50">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function ReportRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-muted-foreground/10 last:border-0">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  );
}

function FormSection({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-orange-400" />
        <h3 className="text-sm font-black uppercase tracking-widest text-orange-900/40">{title}</h3>
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