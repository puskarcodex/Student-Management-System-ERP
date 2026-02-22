"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  Wallet,
  Settings,
  School,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Admin",
    email: "admin@school.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Nice School",
      logo: School,
      plan: "School Admin",
    },
  ],
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Students", url: "/students", icon: Users },
    { title: "Results", url: "/results", icon: ClipboardCheck },
    { title: "Teachers", url: "/teachers", icon: GraduationCap },
    { title: "Staff", url: "/staff", icon: Users },
    { title: "Classes", url: "/classes", icon: BookOpen },
    { title: "Subjects", url: "/subjects", icon: BookOpen },
    { title: "Attendance", url: "/attendance", icon: ClipboardCheck },
    { title: "Fees", url: "/fees", icon: Wallet },
    { title: "HR & Payroll", url: "/hr-payroll/payroll", icon: Users },
    { title: "Profile", url: "/profile", icon: Users },
    { title: "Settings", url: "/settings", icon: Settings },
  ],
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <>
      <style>{`
        .sidebar-scrollbar::-webkit-scrollbar { width: 5px; }
        .sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 10px;
        }
      `}</style>

      {/* Changed variant to "inset" and removed borders to match reference */}
      <Sidebar collapsible="icon" variant="inset" className="border-none bg-background" {...props}>
        <SidebarHeader className="p-4">
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>

        <SidebarContent className="sidebar-scrollbar px-2">
          <NavMain items={data.navMain} />
        </SidebarContent>

        <SidebarFooter className="p-4">
          <div className="rounded-[1.5rem] bg-secondary/50 p-1">
             <NavUser user={data.user} />
          </div>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
    </>
  )
}