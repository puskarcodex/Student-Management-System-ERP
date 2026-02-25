import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, FileText, GraduationCap, Briefcase, School, BookOpen,
  ClipboardCheck, Wallet, UserCheck, Settings, User,
  ArrowUpRight, CalendarDays, TrendingUp, Loader2,
} from "lucide-react";
import { dashboardApi } from "@/lib/api";
import type { DashboardStats } from "@/lib/types";

type Module = {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  path: string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats]       = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getStats()
      .then((res) => { if (res.data) setStats(res.data); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const modules: Module[] = [
    { title: "Students",   description: "All Students & Admission",  icon: Users,         color: "text-blue-500 bg-blue-500/10",    path: "/students"          },
    { title: "Results",    description: "Exam & Report Cards",        icon: FileText,      color: "text-orange-500 bg-orange-500/10", path: "/results"           },
    { title: "Teachers",   description: "List & Assignments",         icon: GraduationCap, color: "text-purple-500 bg-purple-500/10", path: "/teachers"          },
    { title: "Staff",      description: "Staff List & Roles",         icon: Briefcase,     color: "text-emerald-500 bg-emerald-500/10", path: "/staff"           },
    { title: "Classes",    description: "List & Management",          icon: School,        color: "text-pink-500 bg-pink-500/10",    path: "/classes"           },
    { title: "Subjects",   description: "List & Assignments",         icon: BookOpen,      color: "text-indigo-500 bg-indigo-500/10", path: "/subjects"         },
    { title: "Attendance", description: "Student & Staff",            icon: ClipboardCheck,color: "text-green-500 bg-green-500/10",  path: "/attendance"        },
    { title: "Fees",       description: "Setup & Records",            icon: Wallet,        color: "text-amber-500 bg-amber-500/10",  path: "/fees"              },
    { title: "HR & Payroll",description: "Payroll & Leave",           icon: UserCheck,     color: "text-red-500 bg-red-500/10",      path: "/hr-payroll/payroll"},
    { title: "Profile",    description: "User Profile",               icon: User,          color: "text-slate-500 bg-slate-500/10",  path: "/profile"           },
    { title: "Settings",   description: "System Settings",            icon: Settings,      color: "text-zinc-500 bg-zinc-500/10",    path: "/settings"          },
  ];

  const totalStudents  = stats?.totalStudents  ?? 0;
  const totalStaff     = (stats?.totalTeachers ?? 0) + (stats?.totalStaff ?? 0);
  const activeClasses  = stats?.activeClasses  ?? stats?.totalClasses ?? 0;

  return (
    <div className="p-4 md:px-8 md:pt-2 md:pb-8 bg-transparent">
      <div className="mb-6 ml-1 mt-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Overview</h1>
        <p className="text-muted-foreground text-base font-medium mt-1">Making school management easier</p>
      </div>

      {/* Top Stats Row */}
      <div className="grid gap-6 mb-10 sm:grid-cols-1 md:grid-cols-3">
        {/* Total Students */}
        <div className="bg-card p-7 rounded-[2.2rem] shadow-sm flex items-center justify-between border-none transition-all hover:shadow-md">
          <div>
            <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">Total Students</p>
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mt-2" />
            ) : (
              <h2 className="text-3xl font-black mt-1">{totalStudents.toLocaleString()}</h2>
            )}
            <div className="flex items-center gap-1 text-emerald-500 text-[11px] font-bold mt-2 bg-emerald-500/10 w-fit px-2.5 py-1 rounded-full">
              <TrendingUp className="size-3" /> Active
            </div>
          </div>
          <div className="size-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
            <Users className="size-7" />
          </div>
        </div>

        {/* Active Staff */}
        <div className="bg-card p-7 rounded-[2.2rem] shadow-sm flex items-center justify-between border-none transition-all hover:shadow-md">
          <div>
            <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">Active Staff</p>
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mt-2" />
            ) : (
              <h2 className="text-3xl font-black mt-1">{totalStaff.toLocaleString()}</h2>
            )}
            <p className="text-xs text-muted-foreground font-medium mt-2">Teachers & Staff</p>
          </div>
          <div className="size-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500">
            <GraduationCap className="size-7" />
          </div>
        </div>

        {/* Highlight Card */}
        <div className="bg-primary p-7 rounded-[2.2rem] shadow-xl shadow-primary/20 flex flex-col justify-center text-primary-foreground relative overflow-hidden group transition-all hover:scale-[1.02]">
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Active Classes</p>
            {isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin opacity-70 mt-1" />
            ) : (
              <h2 className="text-5xl font-black tracking-tighter">{String(activeClasses).padStart(2, "0")}</h2>
            )}
            <p className="font-bold text-lg mt-1 leading-tight">Classes currently<br />configured</p>
          </div>
          <div className="absolute -right-6 -bottom-6 size-36 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700" />
          <div className="absolute top-6 right-8 opacity-20">
            <CalendarDays className="size-16" />
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {modules.map((module, index) => {
          const Icon = module.icon;
          return (
            <div
              key={index}
              onClick={() => navigate(module.path)}
              className="group relative cursor-pointer rounded-[2rem] bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5 border-none"
            >
              <div className="absolute top-5 right-6 text-muted-foreground/10 group-hover:text-primary transition-all">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <div className={`w-14 h-14 rounded-2xl ${module.color} flex items-center justify-center transition-all duration-500 group-hover:scale-110`}>
                <Icon className="w-7 h-7" />
              </div>
              <div className="mt-5">
                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{module.title}</h3>
                <p className="text-muted-foreground mt-1 text-xs font-medium leading-snug">{module.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}