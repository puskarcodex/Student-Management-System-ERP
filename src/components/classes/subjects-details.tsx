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
import type { Subject } from "@/lib/types";

interface ManageSubjectProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  subject?: Subject | null;
}

const schema = yup.object({
  name: yup.string().required("Subject name is required"),
  code: yup.string().required("Subject code is required"),
  teacherName: yup.string().required("Teacher name is required"),
  status: yup.string().oneOf(["Active", "Inactive"]).required("Status is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageSubjectDetails({
  isOpen,
  onOpenChange,
  subject,
}: ManageSubjectProps) {
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
    if (subject) {
      setValue("name", subject.name);
      setValue("code", subject.code);
      setValue("teacherName", subject.teacherName);
      setValue("status", subject.status);
    } else {
      reset();
    }
  }, [subject, setValue, reset]);

  const onSubmit = (data: FormData) => {
    if (subject) {
      console.log("Update Subject:", { ...subject, ...data });
    } else {
      console.log("Create Subject:", data);
    }
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[30vw]">
        <SheetHeader>
          <SheetTitle>{subject ? "Edit Subject" : "Add Subject"}</SheetTitle>
          <SheetDescription>
            {subject
              ? "Update the subject details below."
              : "Fill in the subject details below."}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Section title="Subject Details">
              <FormField label="Subject Name" error={errors.name?.message}>
                <Input {...register("name")} placeholder="Subject name" />
              </FormField>

              <FormField label="Subject Code" error={errors.code?.message}>
                <Input {...register("code")} placeholder="Subject code (e.g., MATH101)" />
              </FormField>

              <FormField label="Teacher Name" error={errors.teacherName?.message}>
                <Input {...register("teacherName")} placeholder="Teacher name" />
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
                {subject ? "Update" : "Save"} Subject
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