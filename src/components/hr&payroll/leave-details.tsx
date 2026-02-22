"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { CalendarDays, User, CheckCircle, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import type { LeaveRequest } from "@/lib/types";

const ALL_EMPLOYEES = [
  { id: 101, name: "Sita Rai",       type: "Teacher" as const },
  { id: 102, name: "Ram Thapa",      type: "Staff"   as const },
  { id: 103, name: "Priya Shrestha", type: "Teacher" as const },
  { id: 104, name: "Bikash Karki",   type: "Staff"   as const },
  { id: 201, name: "Asmita Gurung",  type: "Teacher" as const },
  { id: 202, name: "Dipak Magar",    type: "Staff"   as const },
];

const LEAVE_TYPES = ["Sick", "Casual", "Annual", "Unpaid", "Maternity", "Paternity"] as const;

type FormData = {
  employeeType: "Teacher" | "Staff";
  employeeId: number;
  employeeName: string;
  leaveType: "Sick" | "Casual" | "Annual" | "Unpaid" | "Maternity" | "Paternity";
  fromDate: string;
  toDate: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  approvedBy?: string;
};

const schema = yup.object({
  employeeType: yup.string().oneOf(["Teacher", "Staff"]).required("Required"),
  employeeId:   yup.number().transform((v) => (isNaN(v) ? undefined : v)).required("Required"),
  employeeName: yup.string().required("Employee is required"),
  leaveType:    yup.string().oneOf(["Sick", "Casual", "Annual", "Unpaid", "Maternity", "Paternity"]).required("Leave type is required"),
  fromDate:     yup.string().required("From date is required"),
  toDate:       yup.string().required("To date is required"),
  reason:       yup.string().required("Reason is required").min(5, "Please provide more detail"),
  status:       yup.string().oneOf(["Pending", "Approved", "Rejected"]).required(),
  approvedBy:   yup.string().optional(),
}).required();

interface LeaveDetailsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  leave?: LeaveRequest | null;
  onSave?: (data: LeaveRequest) => void;
  onCreate?: (data: Omit<LeaveRequest, "id">) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyControl = any;

// Calculate total days between two date strings
const calcDays = (from: string, to: string): number => {
  if (!from || !to) return 0;
  const diff = new Date(to).getTime() - new Date(from).getTime();
  if (isNaN(diff) || diff < 0) return 0;
  return Math.round(diff / (1000 * 60 * 60 * 24)) + 1;
};

export default function LeaveDetails({
  isOpen,
  onOpenChange,
  leave,
  onSave,
  onCreate,
}: LeaveDetailsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: {
      employeeType: "Teacher",
      status: "Pending",
    },
  });

  const watchedType     = useWatch({ control, name: "employeeType" });
  const watchedFrom     = useWatch({ control, name: "fromDate" });
  const watchedTo       = useWatch({ control, name: "toDate" });
  const watchedStatus   = useWatch({ control, name: "status" });

  const filteredEmployees = ALL_EMPLOYEES.filter((e) => e.type === watchedType);
  const totalDays = calcDays(watchedFrom, watchedTo);

  const handleEmployeeTypeChange = (type: "Teacher" | "Staff") => {
    setValue("employeeType", type);
    setValue("employeeName", "");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue("employeeId", 0 as any);
  };

  const handleEmployeeChange = (name: string) => {
    setValue("employeeName", name);
    const emp = ALL_EMPLOYEES.find((e) => e.name === name);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (emp) setValue("employeeId", emp.id as any);
  };

  useEffect(() => {
    if (!isOpen) return;
    if (leave) {
      reset({
        employeeType: leave.employeeType,
        employeeId:   leave.employeeId,
        employeeName: leave.employeeName,
        leaveType:    leave.leaveType,
        fromDate:     leave.fromDate,
        toDate:       leave.toDate,
        reason:       leave.reason,
        status:       leave.status,
        approvedBy:   leave.approvedBy,
      });
    } else {
      reset({
        employeeType: "Teacher",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        employeeId: 0 as any,
        employeeName: "", leaveType: undefined,
        fromDate: "", toDate: "", reason: "",
        status: "Pending", approvedBy: "",
      });
    }
  }, [isOpen, leave, reset]);

  const onSubmit = (data: FormData) => {
    const payload = { ...data, totalDays };
    if (leave) {
      onSave?.({ ...payload, id: leave.id });
    } else {
      onCreate?.(payload);
    }
    onOpenChange(false);
  };

  // Quick approve/reject without full form submit
  const handleQuickAction = (status: "Approved" | "Rejected") => {
    if (!leave) return;
    onSave?.({ ...leave, status, approvedBy: status === "Approved" ? "Admin" : undefined });
    onOpenChange(false);
  };

  const isPending = watchedStatus === "Pending" || leave?.status === "Pending";

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg border-none shadow-2xl p-0 flex flex-col">
        <SheetHeader className="p-8 bg-primary/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <CalendarDays className="w-5 h-5 text-primary" />
            </div>
            <SheetTitle className="text-2xl font-black tracking-tight text-foreground">
              {leave ? "Leave Request" : "New Leave Request"}
            </SheetTitle>
          </div>
          <SheetDescription className="text-muted-foreground font-medium">
            {leave ? "Review and update this leave application" : "Select employee type first — names load automatically"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form id="leave-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            {/* Employee */}
            <FormSection title="Employee" icon={User}>
              <FormField label="Employee Type" error={errors.employeeType?.message}>
                <Controller
                  name="employeeType"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={(v) => handleEmployeeTypeChange(v as "Teacher" | "Staff")}>
                      <SelectTrigger className="rounded-xl border-muted-foreground/20">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="Teacher">Teacher</SelectItem>
                        <SelectItem value="Staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Employee" error={errors.employeeName?.message}>
                <Controller
                  name="employeeName"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={handleEmployeeChange} disabled={!watchedType}>
                      <SelectTrigger className="rounded-xl border-muted-foreground/20 disabled:opacity-50">
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {filteredEmployees.map((e) => (
                          <SelectItem key={e.id} value={e.name}>{e.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Leave Type" error={errors.leaveType?.message}>
                <Controller
                  name="leaveType"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="rounded-xl border-muted-foreground/20">
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {LEAVE_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </FormSection>

            {/* Dates */}
            <FormSection title="Leave Period" icon={CalendarDays}>
              <div className="grid grid-cols-2 gap-4">
                <NepaliDatePickerField<FormData>
                  name="fromDate"
                  control={control as AnyControl}
                  label="From Date"
                  error={errors.fromDate?.message}
                />
                <NepaliDatePickerField<FormData>
                  name="toDate"
                  control={control as AnyControl}
                  label="To Date"
                  error={errors.toDate?.message}
                />
              </div>

              {/* Live total days */}
              {totalDays > 0 && (
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl">
                  <span className="text-sm font-black uppercase tracking-widest text-muted-foreground/50">Total Days</span>
                  <span className="text-2xl font-black text-primary">{totalDays}d</span>
                </div>
              )}

              <FormField label="Reason" error={errors.reason?.message}>
                <Textarea
                  {...register("reason")}
                  placeholder="Briefly describe the reason for leave..."
                  className="rounded-xl border-muted-foreground/20 resize-none min-h-[80px]"
                />
              </FormField>
            </FormSection>

            {/* Status */}
            <FormSection title="Status" icon={CheckCircle}>
              <FormField label="Current Status" error={errors.status?.message}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="rounded-xl border-muted-foreground/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {(["Pending", "Approved", "Rejected"] as const).map((s) => (
                          <SelectItem key={s} value={s}
                            className={
                              s === "Approved" ? "text-emerald-600 font-bold" :
                              s === "Rejected" ? "text-rose-600 font-bold"    :
                                                 "text-amber-600 font-bold"
                            }
                          >{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              {watchedStatus === "Approved" && (
                <FormField label="Approved By" error={errors.approvedBy?.message}>
                  <Input
                    {...register("approvedBy")}
                    placeholder="Admin name"
                    className="rounded-xl border-muted-foreground/20"
                  />
                </FormField>
              )}
            </FormSection>

          </form>
        </div>

        <SheetFooter className="p-8 bg-card border-t flex flex-row items-center justify-end gap-3 flex-wrap">
          <SheetClose asChild>
            <Button type="button" variant="ghost" className="rounded-xl font-bold text-muted-foreground">
              Cancel
            </Button>
          </SheetClose>

          {/* Quick Approve / Reject for existing pending leaves */}
          {leave && isPending && (
            <>
              <Button
                type="button"
                onClick={() => handleQuickAction("Rejected")}
                variant="outline"
                className="rounded-xl font-bold gap-2 border-rose-200 text-rose-600 hover:bg-rose-50"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </Button>
              <Button
                type="button"
                onClick={() => handleQuickAction("Approved")}
                className="rounded-xl font-bold gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </Button>
            </>
          )}

          <Button
            type="submit"
            form="leave-form"
            className="rounded-xl bg-primary px-8 font-black shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
          >
            {leave ? "Update Request" : "Submit Request"}
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