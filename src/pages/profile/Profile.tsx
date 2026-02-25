"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Camera, User, Lock, ShieldCheck, LogOut, Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authApi } from "@/lib/api";

interface StoredUser {
  email: string;
  name: string;
  role: string;
  photo?: string;
  phone?: string;
}

type InfoFormData = {
  name: string;
  email: string;
  phone?: string;
};

type PasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const infoSchema = yup.object({
  name:  yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().optional(),
}).required();

const passwordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword:     yup.string().min(6, "Min 6 characters").required("New password is required"),
  confirmPassword: yup.string()
    .required("Please confirm your password")
    .test("match", "Passwords do not match", function (value) {
      return value === this.parent.newPassword;
    }),
}).required();

const getStoredUser = (): StoredUser => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : { email: "", name: "Admin", role: "admin" };
  } catch {
    return { email: "", name: "Admin", role: "admin" };
  }
};

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

export default function ProfilePage() {
  const navigate     = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser]               = useState<StoredUser>(getStoredUser);
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(user.photo);
  const [infoSuccess, setInfoSuccess]   = useState(false);
  const [infoSaving, setInfoSaving]     = useState(false);
  const [infoError, setInfoError]       = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordSaving, setPasswordSaving]   = useState(false);
  const [passwordError, setPasswordError]     = useState("");

  // Load fresh profile from API on mount
  useEffect(() => {
    authApi.me().then((res) => {
      if (res.data) {
        const fresh: StoredUser = {
          name:  res.data.name,
          email: res.data.email,
          role:  res.data.role,
          phone: res.data.phone,
          photo: res.data.photo,
        };
        setUser(fresh);
        setPhotoPreview(res.data.photo);
        localStorage.setItem("user", JSON.stringify(fresh));
      }
    }).catch(() => {});
  }, []);

  const {
    register: registerInfo,
    handleSubmit: handleInfoSubmit,
    formState: { errors: infoErrors },
  } = useForm<InfoFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(infoSchema) as any,
    defaultValues: { name: user.name, email: user.email, phone: user.phone ?? "" },
  });

  const {
    register: registerPwd,
    handleSubmit: handlePwdSubmit,
    formState: { errors: pwdErrors },
    reset: resetPwd,
  } = useForm<PasswordFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(passwordSchema) as any,
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const result = reader.result as string;
      setPhotoPreview(result);
      try {
        await authApi.updateProfile({ photo: result });
        const updated = { ...user, photo: result };
        setUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));
      } catch { /* photo upload failed silently */ }
    };
    reader.readAsDataURL(file);
  };

  const onInfoSubmit = async (data: InfoFormData) => {
    setInfoSaving(true);
    setInfoError("");
    try {
      await authApi.updateProfile({ name: data.name, email: data.email, phone: data.phone });
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setInfoSuccess(true);
      setTimeout(() => setInfoSuccess(false), 3000);
    } catch (err: unknown) {
      setInfoError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setInfoSaving(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setPasswordSaving(true);
    setPasswordError("");
    try {
      await authApi.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      setPasswordSuccess(true);
      resetPwd();
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="p-4 md:px-8 md:pt-2 md:pb-8 bg-muted/30 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-8">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 ml-1 mt-2">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">My Profile</h1>
            <p className="text-muted-foreground text-base font-medium mt-1">Manage your personal information and security</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="rounded-2xl h-auto py-4 px-6 font-bold gap-2 border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>

        {/* Avatar Card */}
        <Card className="rounded-[2.5rem] border-none shadow-sm bg-card">
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative shrink-0">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/15 transition-colors overflow-hidden border-2 border-dashed border-primary/20"
                >
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-black text-primary">{getInitials(user.name)}</span>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-1.5 bg-primary rounded-xl shadow-lg shadow-primary/20 hover:scale-110 transition-transform"
                >
                  <Camera className="w-3.5 h-3.5 text-primary-foreground" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-black tracking-tight text-foreground">{user.name}</h2>
                <p className="text-sm font-bold text-muted-foreground mt-0.5">{user.email}</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary">{user.role}</span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600">Active</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Info */}
        <ProfileSection title="Personal Information" icon={User}>
          <form onSubmit={handleInfoSubmit(onInfoSubmit)} className="space-y-4">
            <FormField label="Full Name" error={infoErrors.name?.message}>
              <Input {...registerInfo("name")} placeholder="Your full name" className="rounded-xl border-muted-foreground/20" />
            </FormField>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Email Address" error={infoErrors.email?.message}>
                <Input {...registerInfo("email")} type="email" placeholder="you@school.com" className="rounded-xl border-muted-foreground/20" />
              </FormField>
              <FormField label="Phone Number" error={infoErrors.phone?.message}>
                <Input {...registerInfo("phone")} placeholder="98XXXXXXXX" className="rounded-xl border-muted-foreground/20" />
              </FormField>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              {infoError   && <p className="text-[11px] font-bold text-rose-500">{infoError}</p>}
              {infoSuccess && <p className="text-[11px] font-bold text-emerald-600">✓ Profile updated successfully</p>}
              <Button type="submit" disabled={infoSaving} className="rounded-xl bg-primary px-6 font-black shadow-lg shadow-primary/20">
                {infoSaving ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Saving...</span> : "Save Changes"}
              </Button>
            </div>
          </form>
        </ProfileSection>

        {/* Change Password */}
        <ProfileSection title="Change Password" icon={Lock}>
          <form onSubmit={handlePwdSubmit(onPasswordSubmit)} className="space-y-4">
            <FormField label="Current Password" error={pwdErrors.currentPassword?.message}>
              <Input {...registerPwd("currentPassword")} type="password" placeholder="••••••••" className="rounded-xl border-muted-foreground/20" />
            </FormField>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="New Password" error={pwdErrors.newPassword?.message}>
                <Input {...registerPwd("newPassword")} type="password" placeholder="••••••••" className="rounded-xl border-muted-foreground/20" />
              </FormField>
              <FormField label="Confirm Password" error={pwdErrors.confirmPassword?.message}>
                <Input {...registerPwd("confirmPassword")} type="password" placeholder="••••••••" className="rounded-xl border-muted-foreground/20" />
              </FormField>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              {passwordError   && <p className="text-[11px] font-bold text-rose-500">{passwordError}</p>}
              {passwordSuccess && <p className="text-[11px] font-bold text-emerald-600">✓ Password changed successfully</p>}
              <Button type="submit" disabled={passwordSaving} className="rounded-xl bg-primary px-6 font-black shadow-lg shadow-primary/20">
                {passwordSaving ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Updating...</span> : "Update Password"}
              </Button>
            </div>
          </form>
        </ProfileSection>

        {/* Account Info */}
        <ProfileSection title="Account Info" icon={ShieldCheck}>
          <div className="grid grid-cols-2 gap-3">
            <InfoTile label="Role"    value={user.role} />
            <InfoTile label="Account" value="School Admin" />
            <InfoTile label="Status"  value="Active" highlight="green" />
            <InfoTile label="Auth"    value="Local" />
          </div>
        </ProfileSection>

      </div>
    </div>
  );
}

function ProfileSection({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: React.ReactNode }) {
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

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label className="text-[13px] font-bold text-foreground/70 ml-1">{label}</Label>
      {children}
      {error && <p className="text-[11px] font-bold text-rose-500 ml-1">{error}</p>}
    </div>
  );
}

function InfoTile({ label, value, highlight }: { label: string; value: string; highlight?: "green" }) {
  return (
    <div className="bg-muted/30 rounded-xl p-3">
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1">{label}</p>
      <p className={`text-sm font-black ${highlight === "green" ? "text-emerald-600" : "text-foreground"}`}>{value}</p>
    </div>
  );
}