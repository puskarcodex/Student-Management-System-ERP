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
import type { Enrollment } from "@/lib/types";

interface ManageEnrollmentProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  enrollment?: Enrollment | null;
}

const schema = yup.object({
  studentName: yup.string().required("Student name is required"),
  rollNo: yup.string().required("Roll No is required"),
  course: yup.string().required("Course is required"),
  enrolledOn: yup.string().required("Enrollment date is required"),
  status: yup.string().oneOf(["Active", "Completed"]).required("Status is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageEnrollmentDetails({
  isOpen,
  onOpenChange,
  enrollment,
}: ManageEnrollmentProps) {
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
      status: "Active",
    },
  });

  useEffect(() => {
    if (enrollment) {
      setValue("studentName", enrollment.studentName);
      setValue("rollNo", enrollment.rollNo);
      setValue("course", enrollment.course);
      setValue("enrolledOn", enrollment.enrolledOn);
      setValue("status", enrollment.status);
    } else {
      reset();
    }
  }, [enrollment, setValue, reset]);

  const onSubmit = (data: FormData) => {
    if (enrollment) {
      console.log("Update Enrollment:", { ...enrollment, ...data });
    } else {
      console.log("Create Enrollment:", data);
    }
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[30vw]">
        <SheetHeader>
          <SheetTitle>{enrollment ? "Edit Enrollment" : "Add Enrollment"}</SheetTitle>
          <SheetDescription>
            {enrollment
              ? "Update the enrollment details below."
              : "Fill in the enrollment details below."}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Section title="Enrollment Details">
              <FormField label="Student Name" error={errors.studentName?.message}>
                <Input {...register("studentName")} placeholder="Student name" />
              </FormField>

              <FormField label="Roll No" error={errors.rollNo?.message}>
                <Input {...register("rollNo")} placeholder="Roll No" />
              </FormField>

              <FormField label="Course/Class" error={errors.course?.message}>
                <Input {...register("course")} placeholder="Course" />
              </FormField>

              <FormField label="Enrolled On" error={errors.enrolledOn?.message}>
                <Input type="date" {...register("enrolledOn")} />
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
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </Section>

            <SheetFooter>
              <Button type="submit">
                {enrollment ? "Update" : "Save"} Enrollment
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