"use client";

import { useState, useRef } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  School,
  GraduationCap,
  Camera,
  Plus,
  Trash2,
  Check,
  MapPin,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ---- Types ----
interface AcademicTerm {
  name: string;
  startDate: string;
  endDate: string;
}

type SchoolFormData = {
  schoolName: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  estYear?: string;
};

type AcademicFormData = {
  currentYear: string;
  startMonth: string;
  terms: AcademicTerm[];
};

// ---- Schemas ----
const schoolSchema = yup.object({
  schoolName: yup.string().required("School name is required"),
  address:    yup.string().required("Address is required"),
  phone:      yup.string().required("Phone is required"),
  email:      yup.string().email("Invalid email").required("Email is required"),
  website:    yup.string().optional(),
  estYear:    yup.string().optional(),
}).required();

const academicSchema = yup.object({
  currentYear: yup.string().required("Academic year is required"),
  startMonth:  yup.string().required("Start month is required"),
  terms: yup.array().of(
    yup.object({
      name:      yup.string().required("Term name required"),
      startDate: yup.string().required("Start date required"),
      endDate:   yup.string().required("End date required"),
    })
  ).min(1, "At least one term is required"),
}).required();

// ---- Stored helpers ----
const LS_SCHOOL   = "settings_school";
const LS_ACADEMIC = "settings_academic";

const getStored = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
};

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const YEAR_OPTIONS = ["2079-80","2080-81","2081-82","2082-83","2083-84"];

export default function SettingsPage() {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logo, setLogo]               = useState<string | undefined>(() => getStored<string | undefined>(LS_SCHOOL + "_logo", undefined));
  const [schoolSuccess, setSchoolSuccess]     = useState(false);
  const [academicSuccess, setAcademicSuccess] = useState(false);

  // ---- School Form ----
  const {
    register: regSchool,
    handleSubmit: handleSchool,
    formState: { errors: schoolErrors },
  } = useForm<SchoolFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schoolSchema) as any,
    defaultValues: getStored<SchoolFormData>(LS_SCHOOL, {
      schoolName: "EduSmart School",
      address:    "Kathmandu, Nepal",
      phone:      "01-4XXXXXX",
      email:      "info@school.com",
      website:    "",
      estYear:    "2050",
    }),
  });

  const onSchoolSubmit = (data: SchoolFormData) => {
    localStorage.setItem(LS_SCHOOL, JSON.stringify(data));
    setSchoolSuccess(true);
    setTimeout(() => setSchoolSuccess(false), 3000);
  };

  // ---- Academic Form ----
  const {
    register: regAcademic,
    handleSubmit: handleAcademic,
    control: academicControl,
    formState: { errors: academicErrors },
  } = useForm<AcademicFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(academicSchema) as any,
    defaultValues: getStored<AcademicFormData>(LS_ACADEMIC, {
      currentYear: "2081-82",
      startMonth:  "April",
      terms: [
        { name: "First Term",  startDate: "2081-01-01", endDate: "2081-04-30" },
        { name: "Second Term", startDate: "2081-05-01", endDate: "2081-08-31" },
        { name: "Third Term",  startDate: "2081-09-01", endDate: "2081-12-31" },
      ],
    }),
  });

  const { fields: termFields, append: appendTerm, remove: removeTerm } = useFieldArray({
    control: academicControl,
    name: "terms",
  });

  const onAcademicSubmit = (data: AcademicFormData) => {
    localStorage.setItem(LS_ACADEMIC, JSON.stringify(data));
    setAcademicSuccess(true);
    setTimeout(() => setAcademicSuccess(false), 3000);
  };

  // ---- Logo upload ----
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setLogo(result);
      localStorage.setItem(LS_SCHOOL + "_logo", result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4 md:px-8 md:pt-2 md:pb-8 bg-muted/30 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <div className="ml-1 mt-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground text-base font-medium mt-1">Configure your school and academic preferences</p>
        </div>

        {/* ── School Information ── */}
        <SettingsSection title="School Information" icon={School}>
          <form onSubmit={handleSchool(onSchoolSubmit)} className="space-y-5">

            {/* Logo Upload */}
            <div className="flex items-center gap-5">
              <div
                onClick={() => logoInputRef.current?.click()}
                className="w-20 h-20 rounded-2xl bg-primary/10 border-2 border-dashed border-primary/20 flex items-center justify-center cursor-pointer hover:bg-primary/15 transition-colors overflow-hidden shrink-0"
              >
                {logo ? (
                  <img src={logo} alt="School Logo" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-7 h-7 text-primary/40" />
                )}
              </div>
              <div>
                <p className="text-sm font-black text-foreground">School Logo</p>
                <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Click to upload — PNG or JPG recommended</p>
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="mt-2 text-[11px] font-black text-primary hover:underline"
                >
                  {logo ? "Change Logo" : "Upload Logo"}
                </button>
              </div>
              <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
            </div>

            <div className="h-px bg-border/40" />

            <FormField label="School Name" error={schoolErrors.schoolName?.message} icon={School}>
              <Input {...regSchool("schoolName")} placeholder="EduSmart School" className="rounded-xl border-muted-foreground/20" />
            </FormField>

            <FormField label="Address" error={schoolErrors.address?.message} icon={MapPin}>
              <Input {...regSchool("address")} placeholder="Kathmandu, Nepal" className="rounded-xl border-muted-foreground/20" />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Phone" error={schoolErrors.phone?.message} icon={Phone}>
                <Input {...regSchool("phone")} placeholder="01-4XXXXXX" className="rounded-xl border-muted-foreground/20" />
              </FormField>
              <FormField label="Email" error={schoolErrors.email?.message} icon={Mail}>
                <Input {...regSchool("email")} type="email" placeholder="info@school.com" className="rounded-xl border-muted-foreground/20" />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Website" error={schoolErrors.website?.message} icon={Globe}>
                <Input {...regSchool("website")} placeholder="www.school.com" className="rounded-xl border-muted-foreground/20" />
              </FormField>
              <FormField label="Established Year" error={schoolErrors.estYear?.message}>
                <Input {...regSchool("estYear")} placeholder="2050" className="rounded-xl border-muted-foreground/20" />
              </FormField>
            </div>

            <SaveRow success={schoolSuccess} label="Save School Info" />
          </form>
        </SettingsSection>

        {/* ── Academic Year ── */}
        <SettingsSection title="Academic Year" icon={GraduationCap}>
          <form onSubmit={handleAcademic(onAcademicSubmit)} className="space-y-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Current Academic Year" error={academicErrors.currentYear?.message}>
                <Controller
                  name="currentYear"
                  control={academicControl}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="rounded-xl border-muted-foreground/20">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {YEAR_OPTIONS.map((y) => (
                          <SelectItem key={y} value={y}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Academic Start Month" error={academicErrors.startMonth?.message}>
                <Controller
                  name="startMonth"
                  control={academicControl}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="rounded-xl border-muted-foreground/20">
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {MONTHS.map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </div>

            {/* Terms */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/40">Terms / Semesters</p>
                <button
                  type="button"
                  onClick={() => appendTerm({ name: "", startDate: "", endDate: "" })}
                  className="flex items-center gap-1 text-[11px] font-black text-primary hover:underline"
                >
                  <Plus className="w-3 h-3" /> Add Term
                </button>
              </div>

              {termFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-start p-4 bg-muted/40 rounded-2xl">
                  <div className="grid gap-1.5">
                    <Label className="text-[11px] font-black text-muted-foreground/50 uppercase tracking-wider">Term Name</Label>
                    <Input
                      {...regAcademic(`terms.${index}.name`)}
                      placeholder="First Term"
                      className="rounded-xl border-muted-foreground/20 h-9 text-sm"
                    />
                    {academicErrors.terms?.[index]?.name && (
                      <p className="text-[10px] font-bold text-rose-500">{academicErrors.terms[index]?.name?.message}</p>
                    )}
                  </div>

                  <div className="grid gap-1.5">
                    <Label className="text-[11px] font-black text-muted-foreground/50 uppercase tracking-wider">Start Date</Label>
                    <Input
                      {...regAcademic(`terms.${index}.startDate`)}
                      placeholder="2081-01-01"
                      className="rounded-xl border-muted-foreground/20 h-9 text-sm"
                    />
                    {academicErrors.terms?.[index]?.startDate && (
                      <p className="text-[10px] font-bold text-rose-500">{academicErrors.terms[index]?.startDate?.message}</p>
                    )}
                  </div>

                  <div className="grid gap-1.5">
                    <Label className="text-[11px] font-black text-muted-foreground/50 uppercase tracking-wider">End Date</Label>
                    <Input
                      {...regAcademic(`terms.${index}.endDate`)}
                      placeholder="2081-04-30"
                      className="rounded-xl border-muted-foreground/20 h-9 text-sm"
                    />
                    {academicErrors.terms?.[index]?.endDate && (
                      <p className="text-[10px] font-bold text-rose-500">{academicErrors.terms[index]?.endDate?.message}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeTerm(index)}
                    disabled={termFields.length === 1}
                    className="mt-6 p-2 rounded-xl hover:bg-rose-50 text-muted-foreground/40 hover:text-rose-500 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <SaveRow success={academicSuccess} label="Save Academic Settings" />
          </form>
        </SettingsSection>

      </div>
    </div>
  );
}

// ---- Sub-components ----

function SettingsSection({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: React.ReactNode }) {
  return (
    <Card className="rounded-[2.5rem] border-none shadow-sm bg-card">
      <CardHeader className="px-8 pt-8 pb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary/60" />
          <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/40">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-8 pb-8 pt-4">{children}</CardContent>
    </Card>
  );
}

function FormField({
  label, error, icon: Icon, children,
}: {
  label: string; error?: string; icon?: LucideIcon; children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label className="text-[13px] font-bold text-foreground/70 ml-1 flex items-center gap-1.5">
        {Icon && <Icon className="w-3 h-3 text-muted-foreground/40" />}
        {label}
      </Label>
      {children}
      {error && <p className="text-[11px] font-bold text-rose-500 ml-1">{error}</p>}
    </div>
  );
}

function SaveRow({ success, label }: { success: boolean; label: string }) {
  return (
    <div className="flex items-center justify-end gap-3 pt-2">
      {success && (
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
          <Check className="w-3 h-3" /> Saved successfully
        </span>
      )}
      <Button type="submit" className="rounded-xl bg-primary px-6 font-black shadow-lg shadow-primary/20 hover:shadow-xl transition-all">
        {label}
      </Button>
    </div>
  );
}