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
import { useEffect } from "react";
import type { Attendance } from "@/lib/types";
import { NepaliDatePickerField } from "@/components/common/NepaliDatePicekrField";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyControl = any;

const ALL_STAFF = [
  { id: 1, name: "Bimal Shrestha", role: "Accountant"     },
  { id: 2, name: "Kamala Rai",     role: "Librarian"      },
  { id: 3, name: "Dinesh Karki",   role: "Security Guard" },
  { id: 4, name: "Sunita Tamang",  role: "Receptionist"   },
];

interface ManageStaffAttendanceProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  attendance?: Attendance | null;
}

const schema = yup.object({
  staffName: yup.string().required("Staff member is required"),
  date:      yup.string().required("Date is required"),
  status:    yup.string().oneOf(["Present", "Absent", "Leave"]).required("Status is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageStaffAttendanceDetails({
  isOpen,
  onOpenChange,
  attendance,
}: ManageStaffAttendanceProps) {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { status: "Present", staffName: "", date: "" },
  });

  useEffect(() => {
    if (!isOpen) return;
    if (attendance) {
      reset({
        staffName: attendance.name,
        date: attendance.date,
        status: attendance.status,
      });
    } else {
      reset({ status: "Present", staffName: "", date: "" });
    }
  }, [isOpen, attendance, reset]);

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
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg border-none shadow-2xl p-0 flex flex-col">
        <SheetHeader className="p-8 bg-purple-50/50">
          <div className="flex items-center gap-3 mb-2">
            <SheetTitle className="text-2xl font-black tracking-tight text-purple-950">
              {attendance ? "Edit Attendance" : "Mark Attendance"}
            </SheetTitle>
          </div>
          <SheetDescription className="text-purple-900/60 font-medium">
            {attendance ? "Update the attendance record below." : "Select a staff member, date and status."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form id="staff-attendance-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            <FormField label="Staff Member" error={errors.staffName?.message}>
              <Controller
                name="staffName"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="rounded-xl border-muted-foreground/20">
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {ALL_STAFF.map((s) => (
                        <SelectItem key={s.id} value={s.name}>
                          <span>{s.name}</span>
                          <span className="text-muted-foreground/50 ml-1 text-xs">— {s.role}</span>
                        </SelectItem>
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
            form="staff-attendance-form"
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