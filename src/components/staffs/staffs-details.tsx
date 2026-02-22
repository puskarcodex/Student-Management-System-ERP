"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useRef } from "react";
import { Users, User, Camera } from "lucide-react";
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
import {
  GENDER_OPTIONS,
  STATUS_OPTIONS,
  STAFF_ROLE_OPTIONS,
  STAFF_DEPARTMENT_OPTIONS,
} from "@/lib/dropdown-options";
import type { Staff } from "@/lib/types";

type FormData = {
  name: string;
  email: string;
  phone: string;
  dob: string;
  staffId: string;
  role: string;
  department: string;
  gender?: string;
  status: "Active" | "Inactive";
};

const schema = yup.object({
  name:       yup.string().required("Name is required"),
  email:      yup.string().email("Invalid email").required("Email is required"),
  phone:      yup.string().required("Phone is required"),
  dob:        yup.string().required("Date of birth is required"),
  staffId:    yup.string().required("Staff ID is required"),
  role:       yup.string().required("Role is required"),
  department: yup.string().required("Department is required"),
  gender:     yup.string().optional(),
  status:     yup.string().oneOf(["Active", "Inactive"]).required(),
}).required();

interface StaffDetailsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  staff?: Staff | null;
  onSave?: (data: Staff) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyControl = any;

export default function StaffDetails({ isOpen, onOpenChange, staff, onSave }: StaffDetailsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    watch,
  } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: { status: "Active" },
  });

  const photoValue = watch("photo" as keyof FormData) as string | undefined;

  useEffect(() => {
    if (!isOpen) return;
    if (staff) {
      reset({
        name:       staff.name,
        email:      staff.email,
        phone:      staff.phone,
        dob:        staff.dob,
        staffId:    staff.staffId,
        role:       staff.role,
        department: staff.department,
        gender:     staff.gender,
        status:     staff.status,
      });
    } else {
      reset({
        name: "", email: "", phone: "", dob: "",
        staffId: "", role: "", department: "",
        gender: undefined, status: "Active",
      });
    }
  }, [isOpen, staff, reset]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue("photo" as any, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (data: FormData) => {
    const payload: Staff = {
      ...(staff ?? { id: Date.now() }),
      ...data,
      photo: (photoValue as string | undefined) ?? staff?.photo,
    };
    onSave?.(payload);
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg border-none shadow-2xl p-0 flex flex-col">
        <SheetHeader className="p-8 bg-[oklch(0.6231_0.1880_259.8145)]/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[oklch(0.6231_0.1880_259.8145)]/10 rounded-xl">
              <Users className="w-5 h-5 text-[oklch(0.6231_0.1880_259.8145)]" />
            </div>
            <SheetTitle className="text-2xl font-black tracking-tight text-foreground">
              {staff ? "Edit Staff" : "Add Staff"}
            </SheetTitle>
          </div>
          <SheetDescription className="text-muted-foreground font-medium">
            {staff ? "Update staff member details below" : "Fill in the details to add a new staff member"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form id="staff-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            {/* Photo Upload */}
            <div className="flex justify-center">
              <div className="relative">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-2xl bg-[oklch(0.6231_0.1880_259.8145)]/10 border-2 border-dashed border-[oklch(0.6231_0.1880_259.8145)]/30 flex items-center justify-center cursor-pointer hover:bg-[oklch(0.6231_0.1880_259.8145)]/15 transition-colors overflow-hidden"
                >
                  {photoValue ? (
                    <img src={photoValue} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-7 h-7 text-[oklch(0.6231_0.1880_259.8145)]/50" />
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </div>
            </div>

            {/* Personal Info */}
            <FormSection title="Personal Information" icon={User}>
              <FormField label="Full Name" error={errors.name?.message}>
                <Input {...register("name")} placeholder="Full name" className="rounded-xl border-muted-foreground/20" />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Gender" error={errors.gender?.message}>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="rounded-xl border-muted-foreground/20">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {GENDER_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>

                <NepaliDatePickerField<FormData>
                  name="dob"
                  control={control as AnyControl}
                  label="Date of Birth"
                  error={errors.dob?.message}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Email" error={errors.email?.message}>
                  <Input {...register("email")} type="email" placeholder="email@school.com" className="rounded-xl border-muted-foreground/20" />
                </FormField>
                <FormField label="Phone" error={errors.phone?.message}>
                  <Input {...register("phone")} placeholder="98XXXXXXXX" className="rounded-xl border-muted-foreground/20" />
                </FormField>
              </div>
            </FormSection>

            {/* Staff Details */}
            <FormSection title="Staff Details" icon={Users}>
              <FormField label="Staff ID" error={errors.staffId?.message}>
                <Input {...register("staffId")} placeholder="STF001" className="rounded-xl border-muted-foreground/20" />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Role" error={errors.role?.message}>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="rounded-xl border-muted-foreground/20">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {STAFF_ROLE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>

                <FormField label="Department" error={errors.department?.message}>
                  <Controller
                    name="department"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="rounded-xl border-muted-foreground/20">
                          <SelectValue placeholder="Select dept" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {STAFF_DEPARTMENT_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
              </div>

              <FormField label="Status" error={errors.status?.message}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="rounded-xl border-muted-foreground/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {STATUS_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}
                            className={opt.value === "Active" ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}
                          >{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </FormSection>

          </form>
        </div>

        <SheetFooter className="p-8 bg-card border-t flex flex-row items-center justify-end gap-3">
          <SheetClose asChild>
            <Button type="button" variant="ghost" className="rounded-xl font-bold text-muted-foreground">
              Cancel
            </Button>
          </SheetClose>
          <Button
            type="submit"
            form="staff-form"
            className="rounded-xl bg-primary px-8 font-black shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
          >
            {staff ? "Update Staff" : "Add Staff"}
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
        <Icon className="w-4 h-4 text-[oklch(0.6231_0.1880_259.8145)]/60" />
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