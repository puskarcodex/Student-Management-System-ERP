import { Button } from "@/components/ui/button";
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
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import type { Attendance } from "@/lib/types";
import { NepaliDatePickerField } from "@/components/common/NepaliDatePicekrField";
import { CLASS_OPTIONS } from "@/lib/dropdown-options";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyControl = any;

const ALL_STUDENTS = [
  { id: 1, name: "Rahul Sharma",  classId: "Class 5" },
  { id: 2, name: "Ananya Verma",  classId: "Class 5" },
  { id: 3, name: "Rohan Karki",   classId: "Class 5" },
  { id: 4, name: "Sita Thapa",    classId: "Class 9" },
  { id: 5, name: "Hari Bahadur",  classId: "Class 9" },
];

interface ManageAttendanceProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  attendance?: Attendance | null;
}

const schema = yup.object({
  classId:     yup.string().required("Class is required"),
  studentName: yup.string().required("Student is required"),
  date:        yup.string().required("Date is required"),
  status:      yup.string().oneOf(["Present", "Absent", "Leave"]).required("Status is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageAttendanceDetails({
  isOpen,
  onOpenChange,
  attendance,
}: ManageAttendanceProps) {
  const [selectedClass, setSelectedClass] = useState("");

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { status: "Present", classId: "", studentName: "", date: "" },
  });

  const filteredStudents = ALL_STUDENTS.filter((s) => s.classId === selectedClass);

  useEffect(() => {
    if (!isOpen) return;
    if (attendance) {
      reset({
        classId: "",
        studentName: attendance.name,
        date: attendance.date,
        status: attendance.status,
      });
    } else {
      reset({ status: "Present", classId: "", studentName: "", date: "" });
    }
  }, [isOpen, attendance, reset]);

  const handleOpenChange = (open: boolean) => {
    if (!open) setSelectedClass("");
    onOpenChange(open);
  };

  const handleClassChange = (val: string) => {
    setSelectedClass(val);
    setValue("classId", val);
    setValue("studentName", "");
  };

  const onSubmit = (data: FormData) => {
    if (attendance) {
      console.log("Update Attendance:", { ...attendance, ...data });
    } else {
      console.log("Create Attendance:", data);
    }
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-lg border-none shadow-2xl p-0 flex flex-col">
        <SheetHeader className="p-8 bg-blue-50/50">
          <div className="flex items-center gap-3 mb-2">
            <SheetTitle className="text-2xl font-black tracking-tight text-blue-950">
              {attendance ? "Edit Attendance" : "Mark Attendance"}
            </SheetTitle>
          </div>
          <SheetDescription className="text-blue-900/60 font-medium">
            {attendance ? "Update the attendance record below." : "Select class first — students load automatically."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form id="attendance-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            <FormField label="Class" error={errors.classId?.message}>
              <Select onValueChange={handleClassChange} value={selectedClass}>
                <SelectTrigger className="rounded-xl border-muted-foreground/20">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {CLASS_OPTIONS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Student" error={errors.studentName?.message}>
              <Controller
                name="studentName"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!selectedClass}
                  >
                    <SelectTrigger className="rounded-xl border-muted-foreground/20 disabled:opacity-50">
                      <SelectValue placeholder={selectedClass ? "Select student" : "Select class first"} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {filteredStudents.map((s) => (
                        <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <NepaliDatePickerField<FormData>
              name="date"
              control={control as AnyControl}
              label="Date (BS)"
              error={errors.date?.message}
            />

            <FormField label="Status" error={errors.status?.message}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="rounded-xl border-muted-foreground/20">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Present" className="text-emerald-600 font-bold">Present</SelectItem>
                      <SelectItem value="Absent"  className="text-rose-600 font-bold">Absent</SelectItem>
                      <SelectItem value="Leave"   className="text-amber-600 font-bold">Leave</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

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
            form="attendance-form"
            className="rounded-xl bg-primary px-8 font-black shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
          >
            {attendance ? "Update Attendance" : "Save Attendance"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
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