import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import Header from "@/components/header";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Dashboard from "@/pages/dashboard/Dashboard";
import Students from "@/pages/students/Students";
import Teachers from "@/pages/teachers/Teachers";
import Staffs from "@/pages/staff/Staffs";
import Roles from "@/pages/staff/StaffsRoles";
import Results from "@/pages/results/Results";
import Classes from "@/pages/classes/Classes";
import Subjects from "@/pages/subjects/Subjects";
import TeacherAssignment from "@/pages/subjects/TeacherAssignment";
import StudentsAttendance from "@/pages/attendance/StudentsAttendance";
import TeachersAttendance from "@/pages/attendance/TeachersAttendance";
import StaffAttendance    from "@/pages/attendance/StaffsAttendance";
import Fees from "@/pages/fees/Fees";
import Collect from "@/pages/fees/collect";
import Payroll from "@/pages/hr&payroll/payroll";
import Profile from "@/pages/profile/Profile";
import Leave from "@/pages/hr&payroll/leave";
import Records from "@/pages/fees/Records";
import Settings from "@/pages/settings/Settings";
import Login from "@/pages/login/Login";
import Register from "@/pages/login/Register";


// ==============================
// 🔐 APP LAYOUT (SIDEBAR + HEADER)
// ==============================
function AppLayout() {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />

      <SidebarInset className="bg-background">
        <Header />
        <main className="flex-1 bg-background overflow-y-auto">
          <div className="mx-auto max-w-400">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

// ==============================
// 🚀 ROOT ROUTER
// ==============================
export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default: redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>

            <Route path="/dashboard"                             element={<Dashboard />} />
            <Route path="/students"                              element={<Students />} />
            <Route path="/teachers"                              element={<Teachers />} />
            <Route path="/staff"                                 element={<Staffs />} />
            <Route path="/staff/roles"                           element={<Roles />} />
            <Route path="/classes"                               element={<Classes />} />
            <Route path="/subjects"                              element={<Subjects />} />
            <Route path="/subjects/teacher-assignment"           element={<TeacherAssignment />} />
            <Route path="/attendance"                            element={<StudentsAttendance />} />
            <Route path="/attendance/teachersattendance"         element={<TeachersAttendance />} />
            <Route path="/attendance/staffattendance"            element={<StaffAttendance />} />
            <Route path="/fees"                                  element={<Fees />} />
            <Route path="/fees/collect"                          element={<Collect />} />
            <Route path="/fees/records"                          element={<Records />} />
            <Route path="/hr-payroll/leave"                      element={<Leave />} />
            <Route path="/hr-payroll/payroll"                    element={<Payroll />} />
            <Route path="/profile"                               element={<Profile />} />
            <Route path="/results"                               element={<Results />} />
            <Route path="/settings"                              element={<Settings />} />

          </Route>
        </Route>

        <Route path="*" element={<h1 className="p-6">404 | Page Not Found</h1>} />

      </Routes>
    </BrowserRouter>
  );
}