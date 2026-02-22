import React, { useState } from "react";
import { School, Lock, Mail, User, Github, Chrome, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    // Add your registration logic here (e.g., API call)
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* LEFT SIDE: Form Content */}
      <div className="flex flex-col items-center justify-center bg-background p-6 md:p-10">
        <div className="w-full max-w-md space-y-6">
          
          {/* Branding Logo */}
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
              <CardTitle className="text-2xl font-black tracking-tight text-foreground">
                Create Account
              </CardTitle>
              <CardDescription className="text-sm font-medium text-muted-foreground">
                Register your institution to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                
                {/* Social Logins */}
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="rounded-xl border-input bg-card font-bold hover:bg-accent">
                    <Chrome className="mr-2 size-4 text-primary" />
                    Google
                  </Button>
                  <Button variant="outline" className="rounded-xl border-input bg-card font-bold hover:bg-accent">
                    <Github className="mr-2 size-4" />
                    GitHub
                  </Button>
                </div>

                {/* Styled Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground font-black tracking-widest">
                      Or join with email
                    </span>
                  </div>
                </div>

                {/* Register Form */}
                <form onSubmit={onSubmit}>
                  <div className="grid gap-4">
                    
                    {/* Full Name Field */}
                    <div className="grid gap-2">
                      <Label className="text-[11px] font-black uppercase tracking-widest text-foreground/60 ml-1">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="John Doe"
                          required
                          className="rounded-xl border-input bg-background pl-10 focus:ring-primary h-11"
                        />
                      </div>
                    </div>

                    {/* School Name Field */}
                    <div className="grid gap-2">
                      <Label className="text-[11px] font-black uppercase tracking-widest text-foreground/60 ml-1">
                        School Name
                      </Label>
                      <div className="relative">
                        <School className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Intellisoft Academy"
                          required
                          className="rounded-xl border-input bg-background pl-10 focus:ring-primary h-11"
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="grid gap-2">
                      <Label className="text-[11px] font-black uppercase tracking-widest text-foreground/60 ml-1">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="admin@school.com"
                          required
                          className="rounded-xl border-input bg-background pl-10 focus:ring-primary h-11"
                        />
                      </div>
                    </div>
                    
                    {/* Password Field */}
                    <div className="grid gap-2">
                      <Label className="text-[11px] font-black uppercase tracking-widest text-foreground/60 ml-1">
                        Create Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          required
                          className="rounded-xl border-input bg-background pl-10 focus:ring-primary h-11"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full rounded-xl bg-primary h-12 font-black text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all group"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Register"}
                      <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </form>
              </div>

              <div className="mt-6 text-center text-sm font-medium text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-black text-primary hover:underline">
                  Login here
                </Link>
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

      {/* RIGHT SIDE: Decorative Image */}
      <div className="relative hidden lg:block">
        <img
          src="https://plus.unsplash.com/premium_vector-1682299809818-99b511db60ce?q=80&w=1129&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Students on campus"
          className="absolute inset-0 h-full w-full object-cover brightness-[0.8] dark:brightness-[0.5]"
        />
        {/* Subtle emerald overlay to match your theme */}
        <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
      </div>
    </div>
  );
}