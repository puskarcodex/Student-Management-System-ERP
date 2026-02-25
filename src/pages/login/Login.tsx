import React, { useState } from "react";
import { GraduationCap, Lock, Mail, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authApi } from "@/lib/api";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const form     = event.currentTarget;
    const email    = (form.elements.namedItem("email")    as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const res = await authApi.login({ email, password });
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify({
          email: res.data.user?.email ?? email,
          name:  res.data.user?.name  ?? "Admin",
          role:  res.data.user?.role  ?? "admin",
          phone: res.data.user?.phone,
          photo: res.data.user?.photo,
        }));
      }
      navigate("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* LEFT SIDE */}
      <div className="flex flex-col items-center justify-center bg-background p-6 md:p-10">
        <div className="w-full max-w-sm space-y-6">

          <div className="flex flex-col items-center gap-2 self-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <GraduationCap className="size-7" />
            </div>
            <span className="text-xl font-black tracking-tighter text-foreground uppercase">
              EduSmart <span className="text-primary">SMS</span>
            </span>
          </div>

          <Card className="rounded-3xl border-none shadow-xl bg-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-black tracking-tight text-foreground">Welcome back</CardTitle>
              <CardDescription className="text-sm font-medium text-muted-foreground">
                Login with your institution credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-foreground/60 ml-1">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        className="rounded-xl border-input bg-background pl-10 h-11"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-[11px] font-black uppercase tracking-widest text-foreground/60 ml-1">
                        Password
                      </Label>
                      <Link to="#" className="text-[11px] font-black text-primary hover:underline uppercase tracking-wider">
                        Forgot?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        className="rounded-xl border-input bg-background pl-10 h-11"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-[11px] font-bold text-rose-500 text-center">{error}</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full rounded-xl bg-primary h-12 font-black text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
                      </span>
                    ) : (
                      "Login to Dashboard"
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-6 text-center text-sm font-medium text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="font-black text-primary hover:underline">Sign up</Link>
              </div>
            </CardContent>
          </Card>

          <p className="px-8 text-center text-xs text-muted-foreground leading-relaxed">
            By clicking login, you agree to our{" "}
            <Link to="#" className="underline underline-offset-4 hover:text-primary transition-colors">Terms</Link>{" "}
            and{" "}
            <Link to="#" className="underline underline-offset-4 hover:text-primary transition-colors">Privacy</Link>.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative hidden lg:block">
        <img
          src="https://plus.unsplash.com/premium_vector-1726230490432-b3df6dcc23a2?q=80&w=1121&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Campus"
          className="absolute inset-0 h-full w-full object-cover brightness-[0.8] dark:brightness-[0.5]"
        />
        <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
      </div>
    </div>
  );
}