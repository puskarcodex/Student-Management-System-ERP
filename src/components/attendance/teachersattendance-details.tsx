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
import type { Attendance, Teacher } from "@/lib/types";
import { NepaliDatePickerField } from "@/components/common/NepaliDatePicekrField";
import { attendanceApi, teachersApi } from "@/lib/api";
import { Loader2 } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyControl = any;

interface ManageTeacherAttendanceProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  attendance?: Attendance | null;
}

const schema = yup.object({
  teacherName: yup.string().required("Teacher is required"),
  date:        yup.string().required("Date is required"),
  status:      yup.string().oneOf(["Present", "Absent", "Leave"]).required("Status is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageTeacherAttendanceDetails({
  isOpen,
  onOpenChange,
  attendance,
}: ManageTeacherAttendanceProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    teachersApi.getAll({ page: 1, limit: 500 }).then((res) => {
      setTeachers(res.data ?? []);
    }).catch(() => {});
  }, []);

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { status: "Present", teacherName: "", date: "" },
  });

  useEffect(() => {
    if (!isOpen) return;
    setSubmitError(null);
    if (attendance) {
      reset({ teacherName: attendance.name, date: attendance.date, status: attendance.status });
    } else {
      reset({ status: "Present", teacherName: "", date: "" });
    }
  }, [isOpen, attendance, reset]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const teacher = teachers.find((t) => t.name === data.teacherName);
      const payload = {
        entityType: "Teacher" as const,
        entityId: teacher?.id ?? 0,
        name: data.teacherName,
        date: data.date,
        status: data.status as "Present" | "Absent" | "Leave",
      };
      if (attendance) {
        await attendanceApi.update(attendance.id, payload);
      } else {
        await attendanceApi.create(payload);
      }
      reset();
      onOpenChange(false);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg border-none shadow-2xl p-0 flex flex-col">
        <SheetHeader className="p-8 bg-emerald-50/50">
          <div className="flex items-center gap-3 mb-2">
            <SheetTitle className="text-2xl font-black tracking-tight text-emerald-950">
              {attendance ? "Edit Attendance" : "Mark Attendance"}
            </SheetTitle>
          </div>
          <SheetDescription className="text-emerald-900/60 font-medium">
            {attendance ? "Update the attendance record below." : "Select a teacher, date and status."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form id="teacher-attendance-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">

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
                      {teachers.map((t) => (
                        <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
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
            form="teacher-attendance-form"
            disabled={isSubmitting}
            className="rounded-xl bg-primary px-8 font-black shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {attendance ? "Updating..." : "Saving..."}
              </span>
            ) : (
              attendance ? "Update Attendance" : "Save Attendance"
            )}
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