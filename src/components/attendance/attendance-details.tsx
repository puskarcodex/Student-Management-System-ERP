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
import { Separator } from "@/components/ui/separator";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import type { Attendance } from "@/lib/types";

interface ManageAttendanceProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  attendance?: Attendance | null;
}

const schema = yup.object({
  studentName: yup.string().required("Student name is required"),
  date: yup.string().required("Date is required"),
  status: yup.string().oneOf(["Present", "Absent", "Leave"]).required("Status is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageAttendanceDetails({
  isOpen,
  onOpenChange,
  attendance,
}: ManageAttendanceProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      status: "Present",
    },
  });

  useEffect(() => {
    if (attendance) {
      setValue("studentName", attendance.studentName);
      setValue("date", attendance.date);
      setValue("status", attendance.status);
    } else {
      reset();
    }
  }, [attendance, setValue, reset]);

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
      <SheetContent className="min-w-[30vw]">
        <SheetHeader>
          <SheetTitle>{attendance ? "Edit Attendance" : "Add Attendance"}</SheetTitle>
          <SheetDescription>
            {attendance
              ? "Update the attendance record below."
              : "Fill in the attendance record below."}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Section title="Attendance Details">
              <FormField label="Student Name" error={errors.studentName?.message}>
                <Input {...register("studentName")} placeholder="Student name" />
              </FormField>

              <FormField label="Date" error={errors.date?.message}>
                <Input type="date" {...register("date")} />
              </FormField>

              <FormField label="Status" error={errors.status?.message}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Present">Present</SelectItem>
                        <SelectItem value="Absent">Absent</SelectItem>
                        <SelectItem value="Leave">Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </Section>

            <SheetFooter>
              <Button type="submit">
                {attendance ? "Update" : "Save"} Attendance
              </Button>
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
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
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}