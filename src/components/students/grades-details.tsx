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
import type { Grade } from "@/lib/types";

interface ManageGradeProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  grade?: Grade | null;
}

const schema = yup.object({
  studentName: yup.string().required("Student name is required"),
  subject: yup.string().required("Subject is required"),
  marks: yup.number().required("Marks is required").min(0).max(100),
  grade: yup.string().required("Grade is required"),
  result: yup.string().oneOf(["Pass", "Fail"]).required("Result is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageGradeDetails({
  isOpen,
  onOpenChange,
  grade,
}: ManageGradeProps) {
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
      result: "Pass",
      grade: "A",
    },
  });

  useEffect(() => {
    if (grade) {
      setValue("studentName", grade.studentName);
      setValue("subject", grade.subject);
      setValue("marks", grade.marks);
      setValue("grade", grade.grade);
      setValue("result", grade.result);
    } else {
      reset();
    }
  }, [grade, setValue, reset]);

  const onSubmit = (data: FormData) => {
    if (grade) {
      console.log("Update Grade:", { ...grade, ...data });
    } else {
      console.log("Create Grade:", data);
    }
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[30vw]">
        <SheetHeader>
          <SheetTitle>{grade ? "Edit Grade" : "Add Grade"}</SheetTitle>
          <SheetDescription>
            {grade
              ? "Update the grade details below."
              : "Fill in the grade details below."}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Section title="Grade Details">
              <FormField label="Student Name" error={errors.studentName?.message}>
                <Input {...register("studentName")} placeholder="Student name" />
              </FormField>

              <FormField label="Subject" error={errors.subject?.message}>
                <Input {...register("subject")} placeholder="Subject" />
              </FormField>

              <FormField label="Marks" error={errors.marks?.message}>
                <Input type="number" {...register("marks")} placeholder="Marks (0-100)" />
              </FormField>

              <FormField label="Grade" error={errors.grade?.message}>
                <Controller
                  name="grade"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        <SelectItem value="D">D</SelectItem>
                        <SelectItem value="F">F</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Result" error={errors.result?.message}>
                <Controller
                  name="result"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select result" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pass">Pass</SelectItem>
                        <SelectItem value="Fail">Fail</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </Section>

            <SheetFooter>
              <Button type="submit">
                {grade ? "Update" : "Save"} Grade
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