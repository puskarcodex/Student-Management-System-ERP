"use client";

import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { User, Contact, GraduationCap, Camera, Trash2 } from "lucide-react";
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
import { NepaliDatePickerField } from "@/components/common/NepaliDatePicekrField";
import type { Student } from "@/lib/types";
import {
  CLASS_OPTIONS,
  GENDER_OPTIONS,
  STATUS_OPTIONS,
} from "@/lib/dropdown-options";

interface ManageStudentProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  student?: Student | null;
}

const schema = yup.object({
  name:      yup.string().required("Name is required"),
  email:     yup.string().email().required("Email is required"),
  phone:     yup.string().required("Phone is required"),
  dob:       yup.string().required("Date of birth is required"),
  studentId: yup.string().required("Student ID is required"),
  className: yup.string().required("Class is required"),
  rollNo:    yup.number().typeError("Roll No must be a number").required("Roll No is required"),
  gender:    yup.string().required("Gender is required"),
  status:    yup.string().oneOf(["Active", "Inactive"]).required("Status is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageStudentDetails({
  isOpen,
  onOpenChange,
  student,
}: ManageStudentProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { status: "Active" },
  });

  useEffect(() => {
    if (!isOpen) return;

    if (student) {
      reset({
        name:      student.name,
        email:     student.email,
        phone:     student.phone,
        dob:       student.dob,
        studentId: student.studentId,
        className: student.className,
        rollNo:    student.rollNo,
        gender:    student.gender ?? "",
        status:    student.status,
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImagePreview(student.photo ?? null);
    } else {
      reset({
        status:    "Active",
        name:      "",
        email:     "",
        phone:     "",
        dob:       "",
        studentId: "",
        className: "",
        rollNo:    0,
        gender:    "",
      });
      setImagePreview(null);
    }
  }, [isOpen, student, reset]);

  const handleOpenChange = (open: boolean) => {
    if (!open) setImagePreview(null);
    onOpenChange(open);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: FormData) => {
    const payload: Omit<Student, "id" | "createdAt" | "updatedAt"> = {
      ...data,
      photo: imagePreview ?? undefined,
    };
    console.log(student ? "Update Student:" : "Create Student:", payload);
    handleOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-lg border-none shadow-2xl p-0 flex flex-col">
        <SheetHeader className="p-8 bg-indigo-50/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <User className="w-5 h-5 text-indigo-600" />
            </div>
            <SheetTitle className="text-2xl font-black tracking-tight text-indigo-950">
              {student ? "Update Profile" : "New Enrollment"}
            </SheetTitle>
          </div>
          <SheetDescription className="text-indigo-900/60 font-medium">
            {student
              ? "Modify existing student records"
              : "Register a new student to the system"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form
            id="student-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
          >
            {/* Photo Upload */}
            <div className="flex flex-col items-center justify-center gap-4 py-2">
              <div className="relative group">
                <div className="size-24 rounded-[2.2rem] bg-indigo-100/50 border-2 border-dashed border-indigo-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-400">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-indigo-300" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-md border border-indigo-100 hover:bg-indigo-50 transition-colors"
                >
                  <Camera className="w-4 h-4 text-indigo-600" />
                </button>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute -top-2 -right-2 p-1.5 bg-rose-500 rounded-full shadow-md text-white hover:bg-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Student Photograph
              </span>
            </div>

            {/* Personal Information */}
            <FormSection title="Personal Information" icon={Contact}>
              <FormField label="Full Name" error={errors.name?.message}>
                <Input
                  {...register("name")}
                  placeholder="Full Name"
                  className="rounded-xl border-muted-foreground/20 focus:ring-indigo-500"
                />
              </FormField>

              <FormField label="Email Address" error={errors.email?.message}>
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="Email"
                  className="rounded-xl border-muted-foreground/20"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Phone Number" error={errors.phone?.message}>
                  <Input
                    {...register("phone")}
                    placeholder="Phone"
                    className="rounded-xl border-muted-foreground/20"
                  />
                </FormField>
                <div className="grid gap-2">
                  <NepaliDatePickerField
                    name="dob"
                    control={control}
                    label="Date of Birth (BS)"
                    error={errors.dob?.message}
                  />
                </div>
              </div>

              <FormField label="Gender" error={errors.gender?.message}>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="rounded-xl border-muted-foreground/20">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {GENDER_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </FormSection>

            {/* Academic Details */}
            <FormSection title="Academic Details" icon={GraduationCap}>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Student ID" error={errors.studentId?.message}>
                  <Input
                    {...register("studentId")}
                    placeholder="ID"
                    className="rounded-xl border-muted-foreground/20"
                  />
                </FormField>

                <FormField label="Class/Grade" error={errors.className?.message}>
                  <Controller
                    name="className"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="rounded-xl border-muted-foreground/20">
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl max-h-50">
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Roll Number" error={errors.rollNo?.message}>
                  <Input
                    type="number"
                    {...register("rollNo")}
                    placeholder="0"
                    className="rounded-xl border-muted-foreground/20"
                  />
                </FormField>

                <FormField label="Status" error={errors.status?.message}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
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
            form="student-form"
            className="rounded-xl bg-primary px-8 font-black shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
          >
            {student ? "Update Student" : "Register Student"}
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
        <Icon className="w-4 h-4 text-indigo-400" />
        <h3 className="text-sm font-black uppercase tracking-widest text-indigo-900/40">
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