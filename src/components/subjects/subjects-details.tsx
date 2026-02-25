"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { BookOpen, Loader2 } from "lucide-react";
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
import type { Subject } from "@/lib/types";
import { subjectsApi } from "@/lib/api";

interface ManageSubjectProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  subject?: Subject | null;
}

const schema = yup.object({
  name: yup.string().required("Subject name is required"),
  code: yup.string().required("Subject code is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function ManageSubjectDetails({
  isOpen,
  onOpenChange,
  subject,
}: ManageSubjectProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!isOpen) return;
    setSubmitError(null);
    if (subject) {
      reset({ name: subject.name, code: subject.code });
    } else {
      reset({ name: "", code: "" });
    }
  }, [isOpen, subject, reset]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (subject) {
        await subjectsApi.update(subject.id, { name: data.name, code: data.code, status: subject.status ?? "Active" });
      } else {
        await subjectsApi.create({ name: data.name, code: data.code, status: "Active" });
      }
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
        <SheetHeader className="p-8 bg-[oklch(0.6231_0.1880_259.8145)]/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[oklch(0.6231_0.1880_259.8145)]/20 rounded-xl">
              <BookOpen className="w-5 h-5 text-[oklch(0.6231_0.1880_259.8145)]" />
            </div>
            <SheetTitle className="text-2xl font-black tracking-tight text-foreground">
              {subject ? "Update Subject" : "Add Subject"}
            </SheetTitle>
          </div>
          <SheetDescription className="text-muted-foreground font-medium">
            {subject ? "Modify existing subject details" : "Create a new subject in the system"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form id="subject-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <FormSection title="Subject Details" icon={BookOpen}>
              <FormField label="Subject Name" error={errors.name?.message}>
                <Input
                  {...register("name")}
                  placeholder="e.g. Mathematics, Science"
                  className="rounded-xl border-muted-foreground/20"
                />
              </FormField>

              <FormField label="Subject Code" error={errors.code?.message}>
                <Input
                  {...register("code")}
                  placeholder="e.g. MATH101"
                  className="rounded-xl border-muted-foreground/20"
                />
              </FormField>
            </FormSection>

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
            form="subject-form"
            disabled={isSubmitting}
            className="rounded-xl bg-primary px-8 font-black shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {subject ? "Updating..." : "Adding..."}
              </span>
            ) : (
              subject ? "Update Subject" : "Add Subject"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function FormSection({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-[oklch(0.6231_0.1880_259.8145)]" />
        <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/40">{title}</h3>
      </div>
      <div className="grid grid-cols-1 gap-4">{children}</div>
    </div>
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