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
import type { ClassData } from "@/lib/types";

interface ManageClassProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  classData?: ClassData | null;
}

const schema = yup.object({
  name: yup.string().required("Class name is required"),
  teacherName: yup.string().required("Teacher name is required"),
  studentCount: yup.number().required("Student count is required").min(0),
  status: yup.string().oneOf(["Active", "Inactive"]).required("Status is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageClassDetails({
  isOpen,
  onOpenChange,
  classData,
}: ManageClassProps) {
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
    if (classData) {
      setValue("name", classData.name);
      setValue("teacherName", classData.teacherName);
      setValue("studentCount", classData.studentCount);
      setValue("status", classData.status);
    } else {
      reset();
    }
  }, [classData, setValue, reset]);

  const onSubmit = (data: FormData) => {
    if (classData) {
      console.log("Update Class:", { ...classData, ...data });
    } else {
      console.log("Create Class:", data);
    }
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[30vw]">
        <SheetHeader>
          <SheetTitle>{classData ? "Edit Class" : "Add Class"}</SheetTitle>
          <SheetDescription>
            {classData
              ? "Update the class details below."
              : "Fill in the class details below."}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Section title="Class Details">
              <FormField label="Class Name" error={errors.name?.message}>
                <Input {...register("name")} placeholder="Class name (e.g., 10th A)" />
              </FormField>

              <FormField label="Teacher Name" error={errors.teacherName?.message}>
                <Input {...register("teacherName")} placeholder="Teacher name" />
              </FormField>

              <FormField label="Student Count" error={errors.studentCount?.message}>
                <Input type="number" {...register("studentCount")} placeholder="Number of students" />
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
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </Section>

            <SheetFooter>
              <Button type="submit">
                {classData ? "Update" : "Save"} Class
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