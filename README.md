# 📚 School Management System — Frontend

## 🎯 Project Overview

A complete React TypeScript frontend for a School Management System with full CRUD operations, real backend API integration, responsive design, and dark mode support.

| | |
|---|---|
| **Status** | ✅ Production Ready |
| **Tech Stack** | React 18 + TypeScript + Tailwind CSS + ShadCN UI |
| **Backend** | .NET 10 Web API (http://localhost:5272) |
| **Routing** | React Router v6 |
| **Forms** | React Hook Form + Yup Validation |
| **State** | React Hooks |
| **Tables** | TanStack Table v8 |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                              # ShadCN UI primitives
│   ├── common/
│   │   └── NepaliDatePickerField.tsx    # BS date picker
│   ├── GenericTable/
│   │   └── generic-table.tsx            # Reusable table (search, sort, edit, delete)
│   ├── students/
│   │   ├── student-details.tsx
│   │   ├── results-details.tsx
│   │   └── enrollments-details.tsx
│   ├── teachers/
│   │   └── teacher-details.tsx
│   ├── staffs/
│   │   ├── staffs-details.tsx
│   │   └── roles-details.tsx
│   ├── classes/
│   │   ├── classes-details.tsx
│   │   ├── subjects-details.tsx
│   │   └── teacherassignment-details.tsx
│   ├── attendance/
│   │   ├── studentsattendance-details.tsx
│   │   ├── teachersattendance-details.tsx
│   │   └── staffsattendance-details.tsx
│   ├── fees/
│   │   ├── collect-details.tsx
│   │   └── records-details.tsx
│   ├── hr&payroll/
│   │   ├── payroll-details.tsx
│   │   └── leave-details.tsx
│   ├── app-sidebar.tsx
│   ├── header.tsx
│   └── nav-main.tsx
├── pages/
│   ├── dashboard/
│   │   └── Dashboard.tsx
│   ├── students/
│   │   ├── Students.tsx
│   │   ├── Results.tsx
│   │   └── Enrollments.tsx
│   ├── teachers/
│   │   └── Teachers.tsx
│   ├── staffs/
│   │   ├── Staffs.tsx
│   │   └── Roles.tsx
│   ├── classes/
│   │   ├── Classes.tsx
│   │   ├── Subjects.tsx
│   │   └── TeacherAssignment.tsx
│   ├── attendance/
│   │   ├── StudentsAttendance.tsx
│   │   ├── TeachersAttendance.tsx
│   │   └── StaffsAttendance.tsx
│   ├── fees/
│   │   ├── FeeSetup.tsx
│   │   ├── FeeBilling.tsx
│   │   └── FeeRecords.tsx
│   ├── hr&payroll/
│   │   ├── PayrollPage.tsx
│   │   └── LeavePage.tsx
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── ProfilePage.tsx
│   └── settings/
│       └── SettingsPage.tsx
├── lib/
│   ├── types.ts                         # All TypeScript interfaces & request/response types
│   ├── api.ts                           # API service layer (fully connected to backend)
│   └── dropdown-options.ts             # Shared select/dropdown constants
├── App.tsx                              # Root with routing (/ redirects to /login)
├── main.tsx
└── index.css
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- .NET 10 SDK (for backend)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:5173
```

### Environment Setup

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5272/api
```

### Backend

```bash
# From backend project root
dotnet run
# → http://localhost:5272
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📋 Pages & Routes

| Route | Page | Status |
|-------|------|--------|
| `/login` | Login | ✅ Connected |
| `/register` | Register | ✅ Connected |
| `/dashboard` | Dashboard | ✅ Connected |
| `/students` | Students | ✅ Connected |
| `/students/results` | Results | ✅ Connected |
| `/students/enrollments` | Enrollments | ✅ Connected |
| `/teachers` | Teachers | ✅ Connected |
| `/staffs` | Staffs | ✅ Connected |
| `/staffs/roles` | Roles | ✅ Connected |
| `/classes` | Classes | ✅ Connected |
| `/classes/subjects` | Subjects | ✅ Connected |
| `/classes/teacher-assignment` | Teacher Assignment | ✅ Connected |
| `/attendance/students` | Student Attendance | ✅ Connected |
| `/attendance/teachers` | Teacher Attendance | ✅ Connected |
| `/attendance/staffs` | Staff Attendance | ✅ Connected |
| `/fees/setup` | Fee Setup | ✅ Connected |
| `/fees/billing` | Collect Fees | ✅ Connected |
| `/fees/records` | Fee Records | ✅ Connected |
| `/hr/payroll` | Payroll | ✅ Connected |
| `/hr/leave` | Leave Requests | ✅ Connected |
| `/profile` | Profile | ✅ Connected |
| `/settings` | Settings | ⚙️ localStorage only (no backend endpoints) |

---

## 🔌 API Integration

All modules are fully connected to the .NET 10 backend. No mock data remains except the Settings page which is intentionally localStorage-based.

### Backend Route Map

| Frontend API | Backend Controller | Route |
|---|---|---|
| `authApi` | `AuthController` | `api/auth` |
| `dashboardApi` | `DashboardController` | `api/dashboard` |
| `studentsApi` | `StudentController` | `api/student` |
| `teachersApi` | `TeacherController` | `api/teacher` |
| `staffApi` | `StaffController` | `api/staff` |
| `classesApi` | `ClassController` | `api/class` |
| `subjectsApi` | `SubjectController` | `api/subject` |
| `subjectAssignmentsApi` | `SubjectAssignmentController` | `api/subjectassignment` |
| `resultsApi` | `ResultController` | `api/result` |
| `enrollmentsApi` | `EnrollmentController` | `api/enrollment` |
| `attendanceApi` | `AttendanceController` | `api/attendance` |
| `feeStructureApi` | `FeeStructureController` | `api/feestructure` |
| `feeBillsApi` | `FeeBillController` | `api/feebill` |
| `payrollApi` | `PayrollController` | `api/payroll` |
| `leaveApi` | `LeaveRequestController` | `api/leaverequest` |

### Authentication

JWT tokens are stored in `localStorage` and automatically attached to every request via the `Authorization: Bearer <token>` header. The root `/` route redirects to `/login`. Protected routes redirect unauthenticated users to `/login`.

---

## 🏗️ Architecture & Data Flow

### Component Pattern

```
Page (e.g. Students.tsx)
  ├── useState — records, loading, error, selected, isOpen
  ├── useCallback — fetchData()
  ├── useEffect — calls fetchData() on mount
  ├── GenericTable — renders rows with view/edit/delete actions
  └── DetailSheet (e.g. student-details.tsx)
        ├── React Hook Form + Yup schema
        ├── Controller for Select/DatePicker fields
        └── onSubmit → API create/update → onOpenChange(false)
```

### Data Flow

```typescript
// Page
const fetchData = useCallback(async () => {
  setIsLoading(true);
  setError(null);
  try {
    const res = await studentsApi.getAll({ page: 1, limit: 200 });
    setStudents(res.data ?? []);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to load");
  } finally {
    setIsLoading(false);
  }
}, []);

// Sheet closes → triggers refresh
const handleOpenChange = (open: boolean) => {
  setIsOpen(open);
  if (!open) fetchData();
};

// Detail component onSubmit
const onSubmit = async (data: FormData) => {
  if (record) await api.update(record.id, data);
  else        await api.create(data);
  onOpenChange(false); // triggers parent refresh
};
```

---

## 💰 Fee Module Notes

The fee module has three pages with specific backend mapping:

- **Fee Setup** (`/fees/setup`) — Manages `FeeStructure` entities with nested `FeeItems`. The backend returns `feeItems` as a flat array which the frontend splits into `recurringItems` and `oneTimeItems` for display.
- **Collect Fees** (`/fees/billing`) — Creates `FeeBill` records via `POST /api/feebill`. Fee structure auto-loads when a class is selected.
- **Fee Records** (`/fees/records`) — Lists all bills with payment recording via `PATCH /api/feebill/{id}/pay`.

---

## 📝 Form Validation Pattern

All forms use **React Hook Form** + **Yup**. Select fields use `Controller`:

```typescript
const schema = yup.object({
  name:   yup.string().required("Name is required"),
  status: yup.string().oneOf(["Active", "Inactive"]).required(),
});

// Plain input
<Input {...register("name")} />

// Select (must use Controller)
<Controller
  name="status"
  control={control}
  render={({ field }) => (
    <Select value={field.value} onValueChange={field.onChange}>
      ...
    </Select>
  )}
/>
```

---

## 📐 Type System (`src/lib/types.ts`)

Key field renames from original design:

| Old | New | Reason |
|-----|-----|--------|
| `Student.class` | `Student.className` | `class` is a JS reserved word |
| `Result.class` | `Result.className` | same |
| `Attendance.studentName` | `Attendance.name` | used for Teacher/Staff too |
| `Attendance.studentId` | `Attendance.entityId` | generic across entity types |
| — | `Attendance.entityType` | `"Student" \| "Teacher" \| "Staff"` (required) |

---

## 🌓 Theme Support

```typescript
const { theme, toggleTheme } = useTheme();
// Saved to localStorage, persists across sessions
```

---

## 🎨 Styling

- **Framework**: Tailwind CSS v4 + CSS variables
- **Components**: ShadCN UI
- **Colors**: OKLCH color space for perceptually uniform palette
- **Responsive**: `sm: 640px` / `md: 768px` / `lg: 1024px`

---

## 📦 Key Dependencies

```json
{
  "react": "^18",
  "react-router-dom": "^6",
  "react-hook-form": "latest",
  "@hookform/resolvers": "latest",
  "yup": "latest",
  "@tanstack/react-table": "^8",
  "recharts": "latest",
  "lucide-react": "latest",
  "tailwindcss": "^4",
  "shadcn-ui": "latest"
}
```

---

## 🐛 Common Issues

| Problem | Fix |
|---------|-----|
| Port in use | `npm run dev -- --port 3000` |
| Module not found | `rm -rf node_modules && npm install` |
| Type errors | Run `npm run build` and read the output |
| `undefined` in table | Check `accessorKey` matches field name in data |
| Select not populating | Must use `Controller`, not `register` |
| CORS error | Backend must allow `http://localhost:5173` in CORS config |
| 401 Unauthorized | Token expired — log out and log back in |
| 404 on API call | Check `VITE_API_URL` in `.env` matches backend port |
| Fee structure not loading in billing | Backend `GetPagedAsync` must `.Include(f => f.FeeItems)` |

---

## ✅ Integration Status

| Module | Pages | API Connected |
|--------|-------|---------------|
| Auth | Login, Register | ✅ |
| Dashboard | Dashboard | ✅ |
| Students | Students, Results, Enrollments | ✅ |
| Teachers | Teachers | ✅ |
| Staff | Staffs, Roles | ✅ |
| Classes | Classes, Subjects, Teacher Assignment | ✅ |
| Attendance | Students, Teachers, Staff | ✅ |
| Fees | Fee Setup, Collect Fees, Fee Records | ✅ |
| HR & Payroll | Payroll, Leave Requests | ✅ |
| Profile | Profile | ✅ |
| Settings | Settings | ⚙️ localStorage only |

---

**Version**: 3.0.0 | **Last Updated**: February 2026