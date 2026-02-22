// lib/dropdown-options.ts
// Centralized dropdown options for maintaining data consistency
// Later: Replace static data with API calls

/* ================= DROPDOWN OPTION TYPE ================= */

export interface DropdownOption {
  value: string;
  label: string;
}

/* ================= MAJOR ENTITIES ================= */

// 1. CLASS/GRADE OPTIONS
export const CLASS_OPTIONS: DropdownOption[] = [
  { value: "Nursery", label: "Nursery" },
  { value: "LKG", label: "LKG" },
  { value: "UKG", label: "UKG" },
  { value: "Class 1", label: "Class 1" },
  { value: "Class 2", label: "Class 2" },
  { value: "Class 3", label: "Class 3" },
  { value: "Class 4", label: "Class 4" },
  { value: "Class 5", label: "Class 5" },
  { value: "Class 6", label: "Class 6" },
  { value: "Class 7", label: "Class 7" },
  { value: "Class 8", label: "Class 8" },
  { value: "Class 9", label: "Class 9" },
  { value: "Class 10", label: "Class 10" },
  { value: "Class 11", label: "Class 11" },
  { value: "Class 12", label: "Class 12" },
];

// 3. STUDENT OPTIONS (Will be fetched from backend later)
export const STUDENT_OPTIONS: DropdownOption[] = [
  { value: "1", label: "Ram Sharma - Class 5A" },
  { value: "2", label: "Sita Thapa - Class 6B" },
  { value: "3", label: "Hari Bahadur - Class 7A" },
  // Add more students or fetch from backend
];

// 4. TEACHER OPTIONS (Will be fetched from backend later)
export const TEACHER_OPTIONS: DropdownOption[] = [
  { value: "1", label: "Mr. Rajesh Kumar" },
  { value: "2", label: "Mrs. Anjali Sharma" },
  { value: "3", label: "Mr. Suresh Gautam" },
  // Add more teachers or fetch from backend
];

// 5. SUBJECT OPTIONS (Will be fetched from backend later)
export const SUBJECT_OPTIONS: DropdownOption[] = [
  { value: "math", label: "Mathematics" },
  { value: "english", label: "English" },
  { value: "nepali", label: "Nepali" },
  { value: "science", label: "Science" },
  { value: "social", label: "Social Studies" },
  { value: "computer", label: "Computer Science" },
  { value: "moral", label: "Moral Education" },
  { value: "health", label: "Health & Physical Education" },
  // Add more subjects or fetch from backend
];

// 6. FEE HEADS OPTIONS (Predefined - No manual typing allowed)
export const FEE_HEAD_OPTIONS: DropdownOption[] = [
  { value: "tuition", label: "Tuition Fee" },
  { value: "admission", label: "Admission Fee" },
  { value: "exam", label: "Exam Fee" },
  { value: "card", label: "ID Card Fee" },
  { value: "tie", label: "Tie Fee" },
  { value: "belt", label: "Belt Fee" },
  { value: "uniform", label: "Uniform Fee" },
  { value: "books", label: "Books Fee" },
  { value: "transport", label: "Transport Fee" },
  { value: "library", label: "Library Fee" },
  { value: "lab", label: "Laboratory Fee" },
  { value: "sports", label: "Sports Fee" },
  { value: "annual", label: "Annual Charges" },
  { value: "misc", label: "Miscellaneous Fee" },
];

// NEW: 7. STAFF OPTIONS (Will be fetched from backend later)
export const STAFF_OPTIONS: DropdownOption[] = [
  { value: "1", label: "Bimal Shrestha - Accountant" },
  { value: "2", label: "Kamala Rai - Librarian" },
  { value: "3", label: "Dinesh Karki - Security Guard" },
  // Add more staff or fetch from backend
];

/* ================= SECONDARY DROPDOWNS ================= */

// GENDER OPTIONS
export const GENDER_OPTIONS: DropdownOption[] = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

// STATUS OPTIONS
export const STATUS_OPTIONS: DropdownOption[] = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

// ATTENDANCE STATUS OPTIONS
export const ATTENDANCE_STATUS_OPTIONS: DropdownOption[] = [
  { value: "Present", label: "Present" },
  { value: "Absent", label: "Absent" },
  { value: "Leave", label: "Leave" },
];

// FEE STATUS OPTIONS
export const FEE_STATUS_OPTIONS: DropdownOption[] = [
  { value: "Paid", label: "Paid" },
  { value: "Pending", label: "Pending" },
  { value: "Overdue", label: "Overdue" },
];

// RESULT OPTIONS
export const RESULT_OPTIONS: DropdownOption[] = [
  { value: "Pass", label: "Pass" },
  { value: "Fail", label: "Fail" },
];

// NEW: STAFF ROLE OPTIONS
export const STAFF_ROLE_OPTIONS: DropdownOption[] = [
  { value: "Accountant", label: "Accountant" },
  { value: "Librarian", label: "Librarian" },
  { value: "Security Guard", label: "Security Guard" },
  { value: "Cleaner", label: "Cleaner" },
  { value: "Peon", label: "Peon" },
  { value: "Driver", label: "Driver" },
  { value: "Cook", label: "Cook" },
  { value: "Receptionist", label: "Receptionist" },
  { value: "IT Support", label: "IT Support" },
  { value: "Counselor", label: "Counselor" },
  { value: "Other", label: "Other" },
];

// NEW: STAFF DEPARTMENT OPTIONS
export const STAFF_DEPARTMENT_OPTIONS: DropdownOption[] = [
  { value: "Administration", label: "Administration" },
  { value: "Finance", label: "Finance" },
  { value: "Library", label: "Library" },
  { value: "Security", label: "Security" },
  { value: "Housekeeping", label: "Housekeeping" },
  { value: "Transport", label: "Transport" },
  { value: "Kitchen", label: "Kitchen" },
  { value: "IT", label: "IT" },
  { value: "Counseling", label: "Counseling" },
  { value: "Other", label: "Other" },
];

// NEW: EMPLOYEE TYPE OPTIONS (used in Payroll & Leave)
export const EMPLOYEE_TYPE_OPTIONS: DropdownOption[] = [
  { value: "Teacher", label: "Teacher" },
  { value: "Staff", label: "Staff" },
];

// NEW: PAYROLL STATUS OPTIONS
export const PAYROLL_STATUS_OPTIONS: DropdownOption[] = [
  { value: "Paid", label: "Paid" },
  { value: "Pending", label: "Pending" },
  { value: "On Hold", label: "On Hold" },
];

// NEW: LEAVE TYPE OPTIONS
export const LEAVE_TYPE_OPTIONS: DropdownOption[] = [
  { value: "Sick", label: "Sick Leave" },
  { value: "Casual", label: "Casual Leave" },
  { value: "Annual", label: "Annual Leave" },
  { value: "Unpaid", label: "Unpaid Leave" },
  { value: "Maternity", label: "Maternity Leave" },
  { value: "Paternity", label: "Paternity Leave" },
];

// NEW: LEAVE STATUS OPTIONS
export const LEAVE_STATUS_OPTIONS: DropdownOption[] = [
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
];

/* ================= GROUPED EXPORT ================= */

export const DROPDOWN_OPTIONS = {
  // Major Entities
  classes: CLASS_OPTIONS,
  students: STUDENT_OPTIONS,
  teachers: TEACHER_OPTIONS,
  subjects: SUBJECT_OPTIONS,
  feeHeads: FEE_HEAD_OPTIONS,
  staff: STAFF_OPTIONS,           // NEW

  // Secondary Options
  genders: GENDER_OPTIONS,
  status: STATUS_OPTIONS,
  attendanceStatus: ATTENDANCE_STATUS_OPTIONS,
  feeStatus: FEE_STATUS_OPTIONS,
  results: RESULT_OPTIONS,

  // NEW: Staff / HR Options
  staffRoles: STAFF_ROLE_OPTIONS,
  staffDepartments: STAFF_DEPARTMENT_OPTIONS,
  employeeTypes: EMPLOYEE_TYPE_OPTIONS,
  payrollStatus: PAYROLL_STATUS_OPTIONS,
  leaveTypes: LEAVE_TYPE_OPTIONS,
  leaveStatus: LEAVE_STATUS_OPTIONS,
};