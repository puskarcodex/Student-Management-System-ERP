"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { Wallet, User, Calculator } from "lucide-react";
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
import type { Payroll } from "@/lib/types";

// Mock employees — replace with real data from API later
const ALL_EMPLOYEES = [
  { id: 101, name: "Sita Rai",       type: "Teacher" as const },
  { id: 102, name: "Ram Thapa",      type: "Staff"   as const },
  { id: 103, name: "Priya Shrestha", type: "Teacher" as const },
  { id: 104, name: "Bikash Karki",   type: "Staff"   as const },
  { id: 201, name: "Asmita Gurung",  type: "Teacher" as const },
  { id: 202, name: "Dipak Magar",    type: "Staff"   as const },
];

const MONTH_OPTIONS = [
  "2024-01","2024-02","2024-03","2024-04","2024-05","2024-06",
  "2024-07","2024-08","2024-09","2024-10","2024-11","2024-12",
];

type FormData = {
  employeeType: "Teacher" | "Staff";
  employeeId: number;
  employeeName: string;
  month: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  paymentDate?: string;
  status: "Paid" | "Pending" | "On Hold";
};

const schema = yup.object({
  employeeType: yup.string().oneOf(["Teacher", "Staff"]).required("Employee type is required"),
  employeeId:   yup.number().transform((v) => (isNaN(v) ? undefined : v)).required("Required"),
  employeeName: yup.string().required("Employee is required"),
  month:        yup.string().required("Month is required"),
  basicSalary:  yup.number().transform((v) => (isNaN(v) ? 0 : v)).required().min(0),
  allowances:   yup.number().transform((v) => (isNaN(v) ? 0 : v)).min(0).default(0),
  deductions:   yup.number().transform((v) => (isNaN(v) ? 0 : v)).min(0).default(0),
  paymentDate:  yup.string().optional(),
  status:       yup.string().oneOf(["Paid", "Pending", "On Hold"]).required(),
}).required();

interface PayrollDetailsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  payroll?: Payroll | null;
  onSave?: (data: Payroll) => void;
  onCreate?: (data: Omit<Payroll, "id">) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyControl = any;

export default function PayrollDetails({
  isOpen,
  onOpenChange,
  payroll,
  onSave,
  onCreate,
}: PayrollDetailsProps) {
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
      allowances: 0,
      deductions: 0,
      basicSalary: 0,
    },
  });

  const watchedType       = useWatch({ control, name: "employeeType" });
  const watchedBasic      = useWatch({ control, name: "basicSalary" });
  const watchedAllowances = useWatch({ control, name: "allowances" });
  const watchedDeductions = useWatch({ control, name: "deductions" });

  // Derived — no useState needed
  const filteredEmployees = ALL_EMPLOYEES.filter((e) => e.type === watchedType);
  const netSalary = (Number(watchedBasic) || 0) + (Number(watchedAllowances) || 0) - (Number(watchedDeductions) || 0);

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
    if (payroll) {
      reset({
        employeeType: payroll.employeeType,
        employeeId:   payroll.employeeId,
        employeeName: payroll.employeeName,
        month:        payroll.month,
        basicSalary:  payroll.basicSalary,
        allowances:   payroll.allowances,
        deductions:   payroll.deductions,
        paymentDate:  payroll.paymentDate,
        status:       payroll.status,
      });
    } else {
      reset({
        employeeType: "Teacher",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        employeeId: 0 as any,
        employeeName: "", month: "",
        basicSalary: 0, allowances: 0, deductions: 0,
        paymentDate: "", status: "Pending",
      });
    }
  }, [isOpen, payroll, reset]);

  const onSubmit = (data: FormData) => {
    const payload = { ...data, netSalary };
    if (payroll) {
      onSave?.({ ...payload, id: payroll.id });
    } else {
      onCreate?.(payload);
    }
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg border-none shadow-2xl p-0 flex flex-col">
        <SheetHeader className="p-8 bg-primary/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <SheetTitle className="text-2xl font-black tracking-tight text-foreground">
              {payroll ? "Edit Payroll" : "Add Payroll"}
            </SheetTitle>
          </div>
          <SheetDescription className="text-muted-foreground font-medium">
            {payroll ? "Update salary details below" : "Select employee type first — names load automatically"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form id="payroll-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">

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
                    <Select value={field.value} onValueChange={handleEmployeeChange}>
                      <SelectTrigger className="rounded-xl border-muted-foreground/20">
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

              <FormField label="Month" error={errors.month?.message}>
                <Controller
                  name="month"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="rounded-xl border-muted-foreground/20">
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {MONTH_OPTIONS.map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </FormSection>

            {/* Salary Breakdown */}
            <FormSection title="Salary Breakdown" icon={Calculator}>
              <FormField label="Basic Salary" error={errors.basicSalary?.message}>
                <Input
                  type="number"
                  {...register("basicSalary")}
                  placeholder="0"
                  className="rounded-xl border-muted-foreground/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Allowances" error={errors.allowances?.message}>
                  <Input
                    type="number"
                    {...register("allowances")}
                    placeholder="0"
                    className="rounded-xl border-muted-foreground/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </FormField>
                <FormField label="Deductions" error={errors.deductions?.message}>
                  <Input
                    type="number"
                    {...register("deductions")}
                    placeholder="0"
                    className="rounded-xl border-muted-foreground/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </FormField>
              </div>

              {/* Live Net Salary */}
              <div className={`flex items-center justify-between p-4 rounded-2xl ${netSalary >= 0 ? "bg-emerald-500/5" : "bg-rose-500/5"}`}>
                <span className="text-sm font-black uppercase tracking-widest text-muted-foreground/50">Net Salary</span>
                <span className={`text-2xl font-black ${netSalary >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  Rs. {netSalary.toLocaleString()}
                </span>
              </div>
            </FormSection>

            {/* Payment */}
            <FormSection title="Payment" icon={Wallet}>
              <NepaliDatePickerField<FormData>
                name="paymentDate"
                control={control as AnyControl}
                label="Payment Date"
                error={errors.paymentDate?.message}
              />

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
                        {(["Pending", "Paid", "On Hold"] as const).map((s) => (
                          <SelectItem key={s} value={s}
                            className={
                              s === "Paid"     ? "text-emerald-600 font-bold" :
                              s === "On Hold"  ? "text-purple-600 font-bold"  :
                                                 "text-amber-600 font-bold"
                            }
                          >{s}</SelectItem>
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
            form="payroll-form"
            className="rounded-xl bg-primary px-8 font-black shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
          >
            {payroll ? "Update Payroll" : "Save Payroll"}
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