# 📚 School Management System — Frontend

## 🎯 Project Overview

A complete React TypeScript frontend for a School Management System with full CRUD operations, responsive design, and dark mode support.

| | |
|---|---|
| **Status** | ✅ Production Ready |
| **Tech Stack** | React 18 + TypeScript + Tailwind CSS + ShadCN UI |
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
│   │   ├── useTheme.tsx                 # Dark/light theme hook
│   │   └── NepaliDatePickerField.tsx    # BS date picker
│   ├── GenericTable/
│   │   └── generic-table.tsx            # Reusable table (search, sort, edit, delete)
│   ├── students/
│   │   ├── student-details.tsx          # Student create/edit form
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
│   │   ├── feestructure-details.tsx
│   │   └── collect-details.tsx
│   ├── hr/
│   │   ├── payroll-details.tsx
│   │   └── leave-details.tsx
│   ├── app-sidebar.tsx
│   ├── header.tsx                       # Header with dynamic breadcrumb
│   └── nav-main.tsx
├── pages/
│   ├── dashboard/
│   │   └── Dashboard.tsx
│   ├── students/
│   │   ├── Students.tsx
│   │   ├── Results.tsx
│   │  
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
│   │   ├── FeeStructure.tsx
│   │   └── CollectFee.tsx
│   ├── hr/
│   │   ├── Payroll.tsx
│   │   └── Leave.tsx
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── Profile.tsx
│   └── settings/
│       └── Settings.tsx
├── lib/
│   ├── types.ts                         # All TypeScript interfaces & request/response types
│   ├── api.ts                           # API service layer (ready for backend)
│   └── dropdown-options.ts             # Shared select/dropdown constants
├── App.tsx                              # Root with routing
├── main.tsx
└── index.css
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📋 Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | Dashboard | Stats, charts, overview |
| `/students` | Students | Full student CRUD |
| `/students/results` | Results | Exam results management |
| `/students/enrollments` | Enrollments | Course enrollment management |
| `/teachers` | Teachers | Teacher CRUD |
| `/staffs` | Staffs | Staff CRUD |
| `/staffs/roles` | Roles | Role management |
| `/classes` | Classes | Class management |
| `/classes/subjects` | Subjects | Subject management |
| `/classes/teacher-assignment` | Teacher Assignment | Assign teachers to subjects |
| `/attendance/students` | Student Attendance | Mark & track student attendance |
| `/attendance/teachers` | Teacher Attendance | Mark & track teacher attendance |
| `/attendance/staffs` | Staff Attendance | Mark & track staff attendance |
| `/fees/structure` | Fee Structure | Define fee structures per class |
| `/fees/collect` | Collect Fee | Bill & collect student fees |
| `/hr/payroll` | Payroll | Staff payroll management |
| `/hr/leave` | Leave | Leave request management |
| `/profile` | Profile | User profile & password change |
| `/settings` | Settings | App configuration |

---

## 🏗️ Architecture & Data Flow

### Component Pattern

```
Page (e.g. Students.tsx)
  ├── useState — local data, open/close modal
  ├── GenericTable — renders rows with edit/delete actions
  └── DetailSheet (e.g. student-details.tsx)
        ├── React Hook Form + Yup schema
        ├── Controller for Select/DatePicker fields
        └── onSubmit → console.log (replace with API call)
```

### Current Flow (Mock Data)

```typescript
// Page
const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);

const handleEdit   = (s: Student) => { setSelected(s); setIsOpen(true); };
const handleDelete = (s: Student) => setStudents(prev => prev.filter(x => x.id !== s.id));
```

### After API Integration

```typescript
// Page
const [students, setStudents] = useState<Student[]>([]);
const [loading, setLoading]   = useState(true);

useEffect(() => { fetchStudents(); }, []);

const fetchStudents = async () => {
  setLoading(true);
  const res = await studentsApi.getAll();
  setStudents(res.data);
  setLoading(false);
};

// Detail component onSubmit
const onSubmit = async (data: FormData) => {
  if (student) await studentsApi.update(student.id, data);
  else         await studentsApi.create(data);
  onSuccess(); // refresh parent list
  onOpenChange(false);
};
```

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

## 🔌 API Layer (`src/lib/api.ts`)

All endpoints are pre-built and typed. Set your backend URL in `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Available API namespaces:

| Export | Covers |
|--------|--------|
| `authApi` | login, logout, me, changePassword, updateProfile |
| `dashboardApi` | stats, enrollments, attendance overview, revenue |
| `studentsApi` | CRUD + report |
| `teachersApi` | CRUD |
| `staffApi` | CRUD |
| `classesApi` | CRUD |
| `subjectsApi` | CRUD |
| `subjectAssignmentsApi` | CRUD + assignTeacher |
| `resultsApi` | CRUD + getByStudent |
| `enrollmentsApi` | CRUD |
| `attendanceApi` | CRUD + getByEntityType + report |
| `feesApi` | getAll + report |
| `feeStructureApi` | CRUD + getByClass + updateItems |
| `feeBillsApi` | CRUD + getByStudent + recordPayment |
| `payrollApi` | CRUD + markPaid |
| `leaveApi` | CRUD + approve + reject |

### Query Parameter Flattening

`buildQuery` automatically flattens nested filter objects:

```typescript
// { dateRange: { start: "2024-01-01", end: "2024-12-31" } }
// → ?dateRange[start]=2024-01-01&dateRange[end]=2024-12-31
```

---

## 📐 Type System (`src/lib/types.ts`)

Key changes from v1 — **breaking renames**:

| Old | New | Reason |
|-----|-----|--------|
| `Student.class` | `Student.className` | `class` is a JS reserved word |
| `Result.class` | `Result.className` | same |
| `Attendance.studentName` | `Attendance.name` | used for Teacher/Staff too |
| `Attendance.studentId` | `Attendance.entityId` | generic across entity types |
| — | `Attendance.entityType` | `"Student" \| "Teacher" \| "Staff"` (required) |

Every entity has matching `Create*Request`, `Update*Request`, and filter types exported from `types.ts`.

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

## ✅ Backend Integration Checklist

For each page + detail component pair:

**Page:**
- [ ] Remove `MOCK_*` array
- [ ] Add `loading` + `error` state
- [ ] Add `useEffect` → `fetchData()`
- [ ] Update `handleDelete` to call API
- [ ] Pass `onSuccess={fetchData}` to detail component
- [ ] Add loading/error UI

**Detail component:**
- [ ] Update `onSubmit` to call `create` or `update`
- [ ] Add `onSuccess` to props
- [ ] Wrap in try/catch with error feedback

**Modules to update (in order):**
1. Students + student-details
2. Teachers + teacher-details
3. Staffs + staffs-details
4. Classes + classes-details
5. Subjects + subjects-details
6. Teacher Assignment + teacherassignment-details
7. Results + results-details
8. Enrollments + enrollments-details
9. Student/Teacher/Staff Attendance + their detail components
10. Fee Structure + feestructure-details
11. Collect Fee + collect-details
12. Payroll + payroll-details
13. Leave + leave-details
14. Dashboard (read-only, just fetch stats)

---

## 🐛 Common Issues

| Problem | Fix |
|---------|-----|
| Port in use | `npm run dev -- --port 3000` |
| Module not found | `rm -rf node_modules && npm install` |
| Type errors | Run `npm run build` and read the output |
| `undefined` in table | Check `accessorKey` matches field name in data |
| Select not populating | Must use `Controller`, not `register` |

---

## 🎯 Project Status

| Area | Status |
|------|--------|
| All pages & routes | ✅ Complete |
| CRUD with mock data | ✅ Complete |
| TypeScript types | ✅ Complete |
| API service layer | ✅ Complete |
| Form validation | ✅ Complete |
| Responsive design | ✅ Complete |
| Dark/light theme | ✅ Complete |
| Backend integration | ⏳ Pending |

---

**Version**: 2.0.0 | **Last Updated**: February 2026