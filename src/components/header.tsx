import { useLocation, useNavigate } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const breadcrumbMap: Record<string, { parent?: string; current: string }> = {
  "/dashboard": { current: "Dashboard" },
  "/students": { current: "All Students" },
  "/results": { current: "Exam Results" },
  "/results/report-cards": { parent: "Results", current: "Report Cards" },
  "/teachers": { current: "Teacher List" },
  "/teachers/subject-assignment": {
    parent: "Teachers",
    current: "Subject Assignment",
  },
  "/staff": { current: "Staff List" },
  "/staff/roles": { parent: "Staff", current: "Staff Roles" },
  "/classes": { current: "Class List" },
  "/classes/sections": { parent: "Classes", current: "Section Management" },
  "/subjects": { current: "Subject List" },
  "/subjects/teacher-assignment": {
    parent: "Subjects",
    current: "Teacher Assignment",
  },
  "/attendance": { current: "Students Attendance" },
  "/attendance/teachersattendance": {
    parent: "Attendance",
    current: "Teachers Attendance",
  },
  "/attendance/staffattendance": {
    parent: "Attendance",
    current: "Staffs Attendance",
  },
  "/fees": { current: "Fee Setup" },
  "/fees/collect": { parent: "Fees", current: "Collect Fees" },
  "/fees/records": { parent: "Fees", current: "Fee Records" },
  "/hr-payroll/payroll": { parent: "HR & Payroll", current: "Payroll" },
  "/hr-payroll/leave": { parent: "HR & Payroll", current: "Leave" },
  // "/hr-payroll/salary": { parent: "HR & Payroll", current: "Salary Structure" },
  "/profile": { current: "Profile" },
  "/settings": { current: "Settings" },
  "/settings/school": { parent: "Settings", current: "School Information" },
  "/settings/academic": { parent: "Settings", current: "Academic Year" },
  "/settings/system": { parent: "Settings", current: "System Preferences" },
};

const featureMap: Record<string, { label: string; path: string }[]> = {
  "/attendance": [
    { label: "Students Attendance", path: "/attendance" },
    { label: "Teachers Attendance", path: "/attendance/teachersattendance" },
    { label: "Staffs Attendance", path: "/attendance/staffattendance" },
  ],
  "/staff": [
    { label: "Staff List", path: "/staff" },
    { label: "Roles", path: "/staff/roles" },
  ],
  "/subjects": [
    { label: "Subjects", path: "/subjects" },
    { label: "Teacher Assignment", path: "/subjects/teacher-assignment" },
  ],
  "/fees": [
    { label: "Fees Setup", path: "/fees" },
    { label: "Collect", path: "/fees/collect" },
    { label: "Records", path: "/fees/records" },
  ],
  "/hr-payroll": [
    { label: "Payroll", path: "/hr-payroll/payroll" },
    { label: "Leave", path: "/hr-payroll/leave" },
  ],
};

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const breadcrumb = breadcrumbMap[location.pathname] || { current: "Page" };
  const currentModule = Object.keys(featureMap).find((key) =>
    location.pathname.startsWith(key),
  );
  const features = currentModule ? featureMap[currentModule] : [];

  return (
    <header className="sticky top-0 z-30 w-full bg-background/60 backdrop-blur-xl border-none">
      {/* Main Header Row - Reduced Height from h-16 to h-14 */}
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="hover:bg-accent rounded-xl scale-90" />
          <div className="h-4 w-px bg-border/40 mx-1" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumb.parent && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/40 hover:text-foreground transition-colors cursor-pointer">
                      {breadcrumb.parent}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="opacity-20 scale-75" />
                </>
              )}
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm font-bold text-foreground/80 tracking-tight">
                  {breadcrumb.current}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-4 flex-1 justify-end max-w-2xl">
          <div className="relative hidden md:flex items-center w-full max-w-xs group">
            <Search className="absolute left-3 w-3.5 h-3.5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Quick search..."
              className="h-9 pl-9 pr-4 bg-muted/40 border-none rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl relative hover:bg-muted/50"
            >
              <Bell className="w-4 h-4 text-muted-foreground/70" />
              <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-primary rounded-full border-2 border-background" />
            </Button>

            <div className="flex items-center gap-3 ml-1 pl-3 border-l border-border/30">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold leading-none">Admin User</p>
                <p className="text-[9px] text-muted-foreground/60 font-black uppercase mt-0.5">
                  School Admin
                </p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/5 flex items-center justify-center font-bold text-primary text-[10px]">
                AD
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Sub-Navigation - Tightened Spacing */}
      {features.length > 0 && (
        <div className="flex gap-6 px-10 pb-2 pt-0 mt-[-4px]">
          {features.map((feature: { label: string; path: string }) => (
            <button
              key={feature.path}
              onClick={() => navigate(feature.path)}
              className={`text-[11px] font-bold uppercase tracking-widest transition-all relative py-1 ${
                location.pathname === feature.path
                  ? "text-primary after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-full after:bg-primary after:rounded-full"
                  : "text-muted-foreground/40 hover:text-primary"
              }`}
            >
              {feature.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
