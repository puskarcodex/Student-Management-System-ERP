"use client";

import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { Plus, Trash2, Receipt, RefreshCw, Star } from "lucide-react";
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
import { FEE_HEAD_OPTIONS, CLASS_OPTIONS } from "@/lib/dropdown-options";
import type { FeeBill, FeeStructure } from "@/lib/types";

const ALL_STUDENTS = [
  { id: 101, name: "Rahul Sharma", classId: "Class 5" },
  { id: 102, name: "Ananya Verma", classId: "Class 9" },
  { id: 103, name: "Priya Thapa", classId: "Class 5" },
  { id: 104, name: "Rohan Karki", classId: "Class 9" },
  { id: 105, name: "Sita Gurung", classId: "Class 5" },
];

const mockStructures: FeeStructure[] = [
  {
    id: 1,
    classId: "Class 5",
    className: "Class 5",
    recurringItems: [
      {
        id: 1,
        feeHead: "Tuition Fee",
        amount: 2500,
        feeType: "Recurring",
        frequency: "Monthly",
      },
      {
        id: 2,
        feeHead: "Exam Fee",
        amount: 500,
        feeType: "Recurring",
        frequency: "Quarterly",
      },
    ],
    oneTimeItems: [
      { id: 3, feeHead: "Tie Fee", amount: 200, feeType: "One-Time" },
      { id: 4, feeHead: "Belt Fee", amount: 150, feeType: "One-Time" },
    ],
    totalAmount: 3350,
    status: "Active",
  },
  {
    id: 2,
    classId: "Class 9",
    className: "Class 9",
    recurringItems: [
      {
        id: 5,
        feeHead: "Tuition Fee",
        amount: 4500,
        feeType: "Recurring",
        frequency: "Monthly",
      },
      {
        id: 6,
        feeHead: "Exam Fee",
        amount: 1000,
        feeType: "Recurring",
        frequency: "Quarterly",
      },
    ],
    oneTimeItems: [
      { id: 7, feeHead: "Admission Fee", amount: 1000, feeType: "One-Time" },
    ],
    totalAmount: 6500,
    status: "Active",
  },
];

const FREQUENCY_OPTIONS = ["Monthly", "Quarterly", "Yearly"] as const;

type FeeItemForm = {
  feeHead: string;
  amount: number;
  feeType: "Recurring" | "One-Time";
  frequency?: string;
};

type FormData = {
  classId: string;
  studentName: string;
  studentId: number;
  dueDate: string;
  paidAmount: number;
  status: "Paid" | "Partial" | "Pending" | "Overdue";
  feeItems: FeeItemForm[];
};

const schema = yup
  .object({
    classId: yup.string().required("Class is required"),
    studentName: yup.string().required("Student is required"),
    studentId: yup
      .number()
      .transform((v) => (isNaN(v) ? undefined : v))
      .required("Required"),
    dueDate: yup.string().required("Due date is required"),
    paidAmount: yup
      .number()
      .transform((v) => (isNaN(v) ? 0 : v))
      .min(0)
      .default(0),
    status: yup
      .string()
      .oneOf(["Paid", "Partial", "Pending", "Overdue"])
      .required(),
    feeItems: yup
      .array()
      .of(
        yup.object({
          feeHead: yup.string().required("Required"),
          amount: yup
            .number()
            .transform((v) => (isNaN(v) ? 0 : v))
            .required()
            .min(0),
          feeType: yup.string().oneOf(["Recurring", "One-Time"]).required(),
          frequency: yup.string().optional(),
        }),
      )
      .min(1, "Add at least one fee item"),
  })
  .required();

interface ManageFeeProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  bill?: FeeBill | null;
  structures?: FeeStructure[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyControl = any;

export default function ManageFeeDetails({
  isOpen,
  onOpenChange,
  bill,
  structures = mockStructures,
}: ManageFeeProps) {
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
      status: "Pending",
      paidAmount: 0,
      feeItems: [
        { feeHead: "", amount: 0, feeType: "Recurring", frequency: "Monthly" },
      ],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: control as AnyControl,
    name: "feeItems",
  });

  // useWatch is memoization-safe unlike watch()
  const watchedItems = useWatch({ control, name: "feeItems" }) as FeeItemForm[];
  const watchedPaid = useWatch({ control, name: "paidAmount" });
  const watchedClass = useWatch({ control, name: "classId" });

  // Derived — no setState, no useEffect needed
  const filteredStudents = ALL_STUDENTS.filter(
    (s) => s.classId === watchedClass,
  );
  const totalAmount = (watchedItems ?? []).reduce(
    (sum, item) => sum + (Number(item?.amount) || 0),
    0,
  );
  const balance = totalAmount - (Number(watchedPaid) || 0);

  const handleClassChange = (classId: string) => {
    setValue("classId", classId);
    setValue("studentName", "");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue("studentId", 0 as any);
    const structure = structures.find((s) => s.classId === classId);
    if (structure) {
      replace([
        ...structure.recurringItems.map((i) => ({
          feeHead: i.feeHead,
          amount: i.amount,
          feeType: "Recurring" as const,
          frequency: i.frequency ?? "Monthly",
        })),
        ...structure.oneTimeItems.map((i) => ({
          feeHead: i.feeHead,
          amount: i.amount,
          feeType: "One-Time" as const,
          frequency: undefined,
        })),
      ]);
    } else {
      replace([
        { feeHead: "", amount: 0, feeType: "Recurring", frequency: "Monthly" },
      ]);
    }
  };

  const handleStudentChange = (name: string) => {
    setValue("studentName", name);
    const student = ALL_STUDENTS.find((s) => s.name === name);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (student) setValue("studentId", student.id as any);
  };

  useEffect(() => {
    if (!isOpen) return;
    if (bill) {
      reset({
        classId: bill.classId,
        studentName: bill.studentName,
        studentId: bill.studentId,
        dueDate: bill.dueDate,
        paidAmount: bill.paidAmount,
        status: bill.status,
        feeItems: bill.feeItems.map((i) => ({
          feeHead: i.feeHead,
          amount: i.amount,
          feeType: (i.feeType ?? "Recurring") as "Recurring" | "One-Time",
          frequency: i.frequency,
        })),
      });
    } else {
      reset({
        classId: "",
        studentName: "",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        studentId: 0 as any,
        dueDate: "",
        paidAmount: 0,
        status: "Pending",
        feeItems: [
          {
            feeHead: "",
            amount: 0,
            feeType: "Recurring",
            frequency: "Monthly",
          },
        ],
      });
    }
  }, [isOpen, bill, reset]);

  const onSubmit = (data: FormData) => {
    console.log("Submitted:", { ...data, totalAmount, balance });
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg border-none shadow-2xl p-0 flex flex-col">
        <SheetHeader className="p-8 bg-primary/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Receipt className="w-5 h-5 text-primary" />
            </div>
            <SheetTitle className="text-2xl font-black tracking-tight text-foreground">
              {bill ? "Edit Invoice" : "Generate Bill"}
            </SheetTitle>
          </div>
          <SheetDescription className="text-muted-foreground font-medium">
            {bill
              ? "Update the invoice details below"
              : "Select a class first — students and fees load automatically"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form
            id="fee-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
          >
            {/* Step 1: Class first, then Student */}
            <FormSection title="Select Class & Student" icon={Receipt}>
              <FormField label="Class" error={errors.classId?.message}>
                <Controller
                  name="classId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={handleClassChange}
                    >
                      <SelectTrigger className="rounded-xl border-muted-foreground/20">
                        <SelectValue placeholder="Select class first" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {CLASS_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {watchedClass &&
                  structures.find((s) => s.classId === watchedClass) && (
                    <p className="text-[11px] font-bold text-primary ml-1">
                      ✓ Fee structure loaded automatically
                    </p>
                  )}
                {watchedClass &&
                  !structures.find((s) => s.classId === watchedClass) && (
                    <p className="text-[11px] font-bold text-rose-500 ml-1">
                      ⚠ No fee structure configured for this class
                    </p>
                  )}
              </FormField>

              <FormField label="Student" error={errors.studentName?.message}>
                <Controller
                  name="studentName"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={handleStudentChange}
                      disabled={!watchedClass}
                    >
                      <SelectTrigger className="rounded-xl border-muted-foreground/20 disabled:opacity-50">
                        <SelectValue
                          placeholder={
                            !watchedClass
                              ? "Select class first"
                              : "Select student"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {filteredStudents.length === 0 ? (
                          <div className="px-4 py-3 text-xs text-muted-foreground font-bold">
                            No students in this class
                          </div>
                        ) : (
                          filteredStudents.map((s) => (
                            <SelectItem key={s.id} value={s.name}>
                              {s.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <NepaliDatePickerField<FormData>
                name="dueDate"
                control={control as AnyControl}
                label="Due Date"
                error={errors.dueDate?.message}
              />
            </FormSection>

            {/* Step 2: Fee Breakdown */}
            <FormSection title="Fee Breakdown" icon={RefreshCw}>
              {/* Recurring */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 flex items-center gap-1">
                    <RefreshCw className="w-2.5 h-2.5" /> Recurring
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      append({
                        feeHead: "",
                        amount: 0,
                        feeType: "Recurring",
                        frequency: "Monthly",
                      })
                    }
                    className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 hover:opacity-70 transition-opacity"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
                {fields.map((field, index) => {
                  if (watchedItems?.[index]?.feeType !== "Recurring")
                    return null;
                  return (
                    <div key={field.id} className="flex gap-2 items-center">
                      <Controller
                        name={
                          `feeItems.${index}.feeHead` as "feeItems.0.feeHead"
                        }
                        control={control}
                        render={({ field: f }) => (
                          <Select value={f.value} onValueChange={f.onChange}>
                            <SelectTrigger className="rounded-xl flex-1 text-sm">
                              <SelectValue placeholder="Fee Head" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              {FEE_HEAD_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.label}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <Controller
                        name={
                          `feeItems.${index}.frequency` as "feeItems.0.frequency"
                        }
                        control={control}
                        render={({ field: f }) => (
                          <Select
                            value={f.value ?? "Monthly"}
                            onValueChange={f.onChange}
                          >
                            <SelectTrigger className="rounded-xl w-28 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              {FREQUENCY_OPTIONS.map((freq) => (
                                <SelectItem key={freq} value={freq}>
                                  {freq}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <Input
                        type="number"
                        {...register(
                          `feeItems.${index}.amount` as "feeItems.0.amount",
                        )}
                        placeholder="Rs."
                        className="rounded-xl w-24 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2 rounded-xl text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* One-Time */}
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 flex items-center gap-1">
                    <Star className="w-2.5 h-2.5" /> One-Time
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      append({ feeHead: "", amount: 0, feeType: "One-Time" })
                    }
                    className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 hover:opacity-70 transition-opacity"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
                {fields.map((field, index) => {
                  if (watchedItems?.[index]?.feeType !== "One-Time")
                    return null;
                  return (
                    <div key={field.id} className="flex gap-2 items-center">
                      <Controller
                        name={
                          `feeItems.${index}.feeHead` as "feeItems.0.feeHead"
                        }
                        control={control}
                        render={({ field: f }) => (
                          <Select value={f.value} onValueChange={f.onChange}>
                            <SelectTrigger className="rounded-xl flex-1 text-sm">
                              <SelectValue placeholder="Fee Head" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              {FEE_HEAD_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.label}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <Input
                        type="number"
                        {...register(
                          `feeItems.${index}.amount` as "feeItems.0.amount",
                        )}
                        placeholder="Rs."
                        className="rounded-xl w-24 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2 rounded-xl text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </FormSection>

            {/* Step 3: Payment Summary */}
            <FormSection title="Payment Summary" icon={Star}>
              <div className="bg-muted/40 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/50">
                    Grand Total
                  </span>
                  <span className="text-2xl font-black text-foreground">
                    Rs. {totalAmount.toLocaleString()}
                  </span>
                </div>

                <FormField label="Amount Paid Now" error={undefined}>
                  <Input
                    type="number"
                    {...register("paidAmount")}
                    placeholder="0"
                    className="rounded-xl border-muted-foreground/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </FormField>

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <span className="font-black text-sm">Balance Due</span>
                  <span
                    className={`text-xl font-black ${balance > 0 ? "text-rose-600" : "text-emerald-600"}`}
                  >
                    Rs. {balance.toLocaleString()}
                  </span>
                </div>

                <FormField
                  label="Payment Status"
                  error={errors.status?.message}
                >
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="rounded-xl border-muted-foreground/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {(
                            ["Pending", "Partial", "Paid", "Overdue"] as const
                          ).map((s) => (
                            <SelectItem
                              key={s}
                              value={s}
                              className={
                                s === "Paid"
                                  ? "text-emerald-600 font-bold"
                                  : s === "Overdue"
                                    ? "text-rose-600 font-bold"
                                    : s === "Partial"
                                      ? "text-blue-600 font-bold"
                                      : "text-amber-600 font-bold"
                              }
                            >
                              {s}
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
            form="fee-form"
            className="rounded-xl bg-primary px-8 font-black shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
          >
            {bill ? "Update Invoice" : "Confirm & Generate Bill"}
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
        <Icon className="w-4 h-4 text-primary/60" />
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
