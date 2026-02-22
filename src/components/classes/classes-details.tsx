"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { BookOpen, Users } from "lucide-react";
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
import { TEACHER_OPTIONS, STATUS_OPTIONS } from "@/lib/dropdown-options";
import type { Class } from "@/lib/types";

interface ManageClassProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  classData?: Class | null;
}

const schema = yup.object({
  name: yup.string().required("Class name is required"),
  teacherName: yup.string().required("Teacher name is required"),
  studentCount: yup
    .number()
    .typeError("Must be a number")
    .required("Student count is required")
    .min(0),
  status: yup
    .string()
    .oneOf(["Active", "Inactive"])
    .required("Status is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageClassDetails({
  isOpen,
  onOpenChange,
  classData,
}: ManageClassProps) {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    register,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { status: "Active" },
  });

  useEffect(() => {
    if (!isOpen) return;
    if (classData) {
      reset({
        name: classData.name,
        teacherName: classData.teacherName,
        studentCount: classData.studentCount,
        status: classData.status,
      });
    } else {
      reset({ status: "Active", name: "", teacherName: "", studentCount: 0 });
    }
  }, [isOpen, classData, reset]);

  const onSubmit = (data: FormData) => {
    console.log(classData ? "Update Class:" : "Create Class:", {
      ...classData,
      ...data,
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg border-none shadow-2xl p-0 flex flex-col">
        <SheetHeader className="p-8 bg-[oklch(0.7686_0.1647_70.0804)]/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[oklch(0.7686_0.1647_70.0804)]/20 rounded-xl">
              <BookOpen className="w-5 h-5 text-[oklch(0.7686_0.1647_70.0804)]" />
            </div>
            <SheetTitle className="text-2xl font-black tracking-tight text-foreground">
              {classData ? "Update Class" : "Add Class"}
            </SheetTitle>
          </div>
          <SheetDescription className="text-muted-foreground font-medium">
            {classData
              ? "Modify existing class details"
              : "Create a new class in the system"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form
            id="class-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
          >
            {/* Class Details */}
            <FormSection title="Class Details" icon={BookOpen}>
              <FormField label="Class Name" error={errors.name?.message}>
                <Input
                  {...register("name")}
                  placeholder="e.g. 10A, Grade 5"
                  className="rounded-xl border-muted-foreground/20"
                />
              </FormField>

              <FormField label="Teacher" error={errors.teacherName?.message}>
                <Controller
                  name="teacherName"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="rounded-xl border-muted-foreground/20">
                        <SelectValue placeholder="Select teacher" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {TEACHER_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.label}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </FormSection>

            {/* Enrollment Details */}
            <FormSection title="Enrollment Details" icon={Users}>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Student Count"
                  error={errors.studentCount?.message}
                >
                  <Input
                    type="number"
                    {...register("studentCount")}
                    placeholder="0"
                    className="rounded-xl border-muted-foreground/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </FormField>

                <FormField label="Status" error={errors.status?.message}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="rounded-xl border-muted-foreground/20">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {STATUS_OPTIONS.map((opt) => (
                            <SelectItem
                              key={opt.value}
                              value={opt.value}
                              className={
                                opt.value === "Active"
                                  ? "text-emerald-600 font-bold"
                                  : "text-rose-600 font-bold"
                              }
                            >
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
              </div>
            </FormSection>
          </form>
        </div>

        <SheetFooter className="p-8 bg-card border-t flex flex-row items-center justify-end gap-3">
          <SheetClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl font-bold text-muted-foreground"
            >
              Cancel
            </Button>
          </SheetClose>
          <Button
            type="submit"
            form="class-form"
            className="rounded-xl bg-primary px-8 font-black shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
          >
            {classData ? "Update Class" : "Add Class"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function FormSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-[oklch(0.7686_0.1647_70.0804)]" />
        <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/40">
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-4">{children}</div>
    </div>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label className="text-[13px] font-bold text-foreground/70 ml-1">
        {label}
      </Label>
      {children}
      {error && (
        <p className="text-[11px] font-bold text-rose-500 ml-1">{error}</p>
      )}
    </div>
  );
}
