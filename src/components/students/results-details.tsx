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
import type { Result } from "@/lib/types";

interface ManageResultProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  result?: Result | null;
}

const schema = yup.object({
  studentName: yup.string().required("Student name is required"),
  class: yup.string().required("Class is required"),
  totalMarks: yup.number().required("Total marks is required").min(0),
  percentage: yup.number().required("Percentage is required").min(0).max(100),
  result: yup.string().oneOf(["Pass", "Fail"]).required("Result is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageResultDetails({
  isOpen,
  onOpenChange,
  result,
}: ManageResultProps) {
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
    },
  });

  useEffect(() => {
    if (result) {
      setValue("studentName", result.studentName);
      setValue("class", result.class);
      setValue("totalMarks", result.totalMarks);
      setValue("percentage", result.percentage);
      setValue("result", result.result);
    } else {
      reset();
    }
  }, [result, setValue, reset]);

  const onSubmit = (data: FormData) => {
    if (result) {
      console.log("Update Result:", { ...result, ...data });
    } else {
      console.log("Create Result:", data);
    }
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[30vw]">
        <SheetHeader>
          <SheetTitle>{result ? "Edit Result" : "Add Result"}</SheetTitle>
          <SheetDescription>
            {result
              ? "Update the result details below."
              : "Fill in the result details below."}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Section title="Result Details">
              <FormField label="Student Name" error={errors.studentName?.message}>
                <Input {...register("studentName")} placeholder="Student name" />
              </FormField>

              <FormField label="Class" error={errors.class?.message}>
                <Input {...register("class")} placeholder="Class" />
              </FormField>

              <FormField label="Total Marks" error={errors.totalMarks?.message}>
                <Input type="number" {...register("totalMarks")} placeholder="Total marks" />
              </FormField>

              <FormField label="Percentage" error={errors.percentage?.message}>
                <Input
                  type="number"
                  step="0.01"
                  {...register("percentage")}
                  placeholder="Percentage (0-100)"
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
                {result ? "Update" : "Save"} Result
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