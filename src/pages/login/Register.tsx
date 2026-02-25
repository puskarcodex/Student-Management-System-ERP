import React, { useState } from "react";
import { School, Lock, Mail, User, ArrowRight, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authApi } from "@/lib/api";

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState("");
  const [role, setRole]           = useState("Admin");
  const navigate = useNavigate();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const form     = event.currentTarget;
    const username = (form.elements.namedItem("username") as HTMLInputElement).value;
    const email    = (form.elements.namedItem("email")    as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      // Register the account
      const res = await authApi.register({ username, email, password, role });

      // Auto-login: save token + user if returned directly
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify({
          email: res.data.user?.email ?? email,
          name:  res.data.user?.name  ?? username,
          role:  res.data.user?.role  ?? role,
          phone: res.data.user?.phone,
          photo: res.data.user?.photo,
        }));
        navigate("/dashboard");
      } else {
        // Backend registered but didn't return a token — redirect to login
        navigate("/login");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* LEFT SIDE */}
      <div className="flex flex-col items-center justify-center bg-background p-6 md:p-10">
        <div className="w-full max-w-md space-y-6">

          <div className="flex flex-col items-center gap-2 self-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <School className="size-7" />
            </div>
            <span className="text-xl font-black tracking-tighter text-foreground uppercase">
              EduSmart <span className="text-primary">SMS</span>
            </span>
          </div>

          <Card className="rounded-3xl border-none shadow-xl bg-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-black tracking-tight text-foreground">Create Account</CardTitle>
              <CardDescription className="text-sm font-medium text-muted-foreground">
                Register your institution to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit}>
                <div className="grid gap-4">

                  <div className="grid gap-2">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-foreground/60 ml-1">
                      Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        name="username"
                        type="text"
                        placeholder="johndoe"
                        required
                        className="rounded-xl border-input bg-background pl-10 h-11"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-foreground/60 ml-1">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        name="email"
                        type="email"
                        placeholder="admin@school.com"
                        required
                        className="rounded-xl border-input bg-background pl-10 h-11"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-foreground/60 ml-1">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        minLength={6}
                        className="rounded-xl border-input bg-background pl-10 h-11"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-foreground/60 ml-1">
                      Role
                    </Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger className="rounded-xl border-input h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Teacher">Teacher</SelectItem>
                        <SelectItem value="Staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {error && (
                    <p className="text-[11px] font-bold text-rose-500 text-center">{error}</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full rounded-xl bg-primary h-12 font-black text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all group"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Creating Account...
                      </span>
                    ) : (
                      <>
                        Register
                        <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-6 text-center text-sm font-medium text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-black text-primary hover:underline">Login here</Link>
              </div>
            </CardContent>
          </Card>

          <p className="px-8 text-center text-xs text-muted-foreground leading-relaxed">
            By registering, you agree to our{" "}
            <Link to="#" className="underline underline-offset-4 hover:text-primary transition-colors">Terms of Service</Link>{" "}
            and privacy protocols.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative hidden lg:block">
        <img
          src="https://plus.unsplash.com/premium_vector-1682299809818-99b511db60ce?q=80&w=1129&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Students on campus"
          className="absolute inset-0 h-full w-full object-cover brightness-[0.8] dark:brightness-[0.5]"
        />
        <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
      </div>
    </div>
  );
}