// src/lib/types.ts

/* ================= ENTITY INTERFACES ================= */

export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  studentId: string;
  className: string;        // FIX #9: renamed from 'class' (reserved keyword) — update Student pages
  rollNo: number;
  gender?: string;
  photo?: string;
  status: "Active" | "Inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface Result {
  id: number;
  studentId: number;
  studentName: string;
  className: string;        // FIX #9: renamed from 'class' (reserved keyword) — update Result pages
  totalMarks: number;
  percentage: number;
  result: "Pass" | "Fail";
  createdAt?: string;
  updatedAt?: string;
}

export interface Enrollment {
  id: number;
  studentId: number;
  studentName: string;
  rollNo: string;
  enrolledOn: string;
  status: "Active" | "Completed";
  createdAt?: string;
  updatedAt?: string;
}

export interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  teacherId: string;
  subject: string;
  gender?: string;
  photo?: string;
  status: "Active" | "Inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface Staff {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  staffId: string;
  role: string;
  department: string;
  gender?: string;
  photo?: string;
  status: "Active" | "Inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface Class {
  id: number;
  name: string;
  teacherId?: number;
  teacherName: string;
  studentCount: number;
  status: "Active" | "Inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  teacherId?: number;       // number (optional)
  teacherName?: string;     // FIX #12: made optional — subjects-details form doesn't capture it
  classId?: string;         // FIX #6: kept as string to match page usage ("Class 5" style)
  className?: string;       // FIX #11: added to align with SubjectAssignment usage in pages
  status: "Active" | "Inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface Attendance {
  id: number;
  name: string;             // FIX #1: renamed from 'studentName' — used for Student/Teacher/Staff
  entityType: "Student" | "Teacher" | "Staff"; // FIX #3: added to differentiate record type
  entityId?: number;        // FIX #1: renamed from 'studentId' — generic reference
  classId?: string;         // FIX #2: changed from number to string — matches form usage ("Class 5")
  date: string;
  status: "Present" | "Absent" | "Leave";
  createdAt?: string;
  updatedAt?: string;
}

export interface Fee {
  id: number;
  studentName: string;
  studentId?: number;
  amount: number;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue";
  createdAt?: string;
  updatedAt?: string;
}

export interface FeeStructure {
  id: number;
  classId: string;          // string — matches page usage ("Class 5")
  className: string;
  recurringItems: FeeItem[];
  oneTimeItems: FeeItem[];
  totalAmount: number;
  status: "Active" | "Inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface FeeItem {
  id?: number;              // FIX #5: made optional — forms build items without IDs before submit
  feeHead: string;
  amount: number;
  feeType: "Recurring" | "One-Time";
  frequency?: "Monthly" | "Quarterly" | "Yearly"; // FIX #7: kept as proper union (not string)
  description?: string;
}

export interface FeeBill {
  id: number;
  studentId: number;
  studentName: string;
  classId: string;
  className: string;
  billDate: string;         // FIX #4: kept required — must be added to collect-details form
  dueDate: string;
  feeItems: FeeItem[];
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: "Paid" | "Partial" | "Pending" | "Overdue";
  createdAt?: string;
  updatedAt?: string;
}

export interface Payroll {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeType: "Teacher" | "Staff";
  month: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  paymentDate?: string;
  status: "Paid" | "Pending" | "On Hold";
  createdAt?: string;
  updatedAt?: string;
}

export interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeType: "Teacher" | "Staff";
  leaveType: "Sick" | "Casual" | "Annual" | "Unpaid" | "Maternity" | "Paternity";
  fromDate: string;
  toDate: string;
  totalDays: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  approvedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

/* ================= SUBJECT ASSIGNMENT ================= */

// FIX #11: Promoted SubjectAssignment from a local page type to a shared type.
// teacherId is string here because the pages use string IDs from dropdowns.
// When connecting to a real API, teacherId should become number and map accordingly.
export interface SubjectAssignment {
  id: number;
  subjectName: string;
  subjectCode: string;
  className: string;
  teacherId: string;
  teacherName: string;
}

/* ================= AUTH TYPES ================= */

export interface User {
  id: number;
  email: string;
  name: string;
  role: "admin" | "teacher" | "staff";
  status: "Active" | "Inactive";
  phone?: string;           // FIX #14: added optional phone to align with StoredUser in profile page
  photo?: string;           // FIX #14: added optional photo to align with StoredUser in profile page
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

/* ================= API RESPONSE TYPES ================= */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: string[];
}

export interface ApiListResponse<T> {
  success: boolean;
  data?: T[];
  message?: string;
  error?: string;
  details?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  details?: string[];
  code?: string;
}

/* ================= PAGINATION TYPES ================= */

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/* ================= FILTER TYPES ================= */

export interface StudentFilters {
  status?: "Active" | "Inactive";
  className?: string;       // FIX #9: renamed from 'class'
  section?: string;
  gender?: string;
  search?: string;
}

export interface TeacherFilters {
  status?: "Active" | "Inactive";
  subject?: string;
  search?: string;
}

export interface StaffFilters {
  status?: "Active" | "Inactive";
  role?: string;
  department?: string;
  search?: string;
}

export interface AttendanceFilters {
  startDate?: string;
  endDate?: string;
  entityId?: number;        // FIX #1: renamed from 'studentId'
  entityType?: "Student" | "Teacher" | "Staff"; // FIX #3: added
  classId?: string;         // FIX #2: changed from number to string
  status?: "Present" | "Absent" | "Leave";
}

export interface FeeFilters {
  status?: "Paid" | "Pending" | "Overdue";
  studentId?: number;
  classId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface PayrollFilters {
  status?: "Paid" | "Pending" | "On Hold";
  employeeType?: "Teacher" | "Staff";
  month?: string;
  search?: string;
}

export interface LeaveFilters {
  status?: "Pending" | "Approved" | "Rejected";
  employeeType?: "Teacher" | "Staff";
  leaveType?: string;
  search?: string;
}

/* ================= FORM REQUEST TYPES ================= */

export type CreateStudentRequest = Omit<Student, "id" | "createdAt" | "updatedAt">;
export type UpdateStudentRequest = Partial<Omit<Student, "id" | "createdAt" | "updatedAt">>;

export type CreateTeacherRequest = Omit<Teacher, "id" | "createdAt" | "updatedAt">;
export type UpdateTeacherRequest = Partial<Omit<Teacher, "id" | "createdAt" | "updatedAt">>;

export type CreateStaffRequest = Omit<Staff, "id" | "createdAt" | "updatedAt">;
export type UpdateStaffRequest = Partial<Omit<Staff, "id" | "createdAt" | "updatedAt">>;

export type CreateResultRequest = Omit<Result, "id" | "createdAt" | "updatedAt">;
export type UpdateResultRequest = Partial<Omit<Result, "id" | "createdAt" | "updatedAt">>;

export type CreateEnrollmentRequest = Omit<Enrollment, "id" | "createdAt" | "updatedAt">;
export type UpdateEnrollmentRequest = Partial<Omit<Enrollment, "id" | "createdAt" | "updatedAt">>;

export type CreateClassRequest = Omit<Class, "id" | "createdAt" | "updatedAt">;
export type UpdateClassRequest = Partial<Omit<Class, "id" | "createdAt" | "updatedAt">>;

export type CreateSubjectRequest = Omit<Subject, "id" | "createdAt" | "updatedAt">;
export type UpdateSubjectRequest = Partial<Omit<Subject, "id" | "createdAt" | "updatedAt">>;

export type CreateAttendanceRequest = Omit<Attendance, "id" | "createdAt" | "updatedAt">;
export type UpdateAttendanceRequest = Partial<Omit<Attendance, "id" | "createdAt" | "updatedAt">>;

export type CreateFeeRequest = Omit<Fee, "id" | "createdAt" | "updatedAt">;
export type UpdateFeeRequest = Partial<Omit<Fee, "id" | "createdAt" | "updatedAt">>;

export type CreateFeeStructureRequest = Omit<FeeStructure, "id" | "createdAt" | "updatedAt">;
export type UpdateFeeStructureRequest = Partial<Omit<FeeStructure, "id" | "createdAt" | "updatedAt">>;

export type CreateFeeBillRequest = Omit<FeeBill, "id" | "createdAt" | "updatedAt">;
export type UpdateFeeBillRequest = Partial<Omit<FeeBill, "id" | "createdAt" | "updatedAt">>;

export type CreatePayrollRequest = Omit<Payroll, "id" | "createdAt" | "updatedAt">;
export type UpdatePayrollRequest = Partial<Omit<Payroll, "id" | "createdAt" | "updatedAt">>;

export type CreateLeaveRequest = Omit<LeaveRequest, "id" | "createdAt" | "updatedAt">;
export type UpdateLeaveRequest = Partial<Omit<LeaveRequest, "id" | "createdAt" | "updatedAt">>;

export type CreateSubjectAssignmentRequest = Omit<SubjectAssignment, "id">;
export type UpdateSubjectAssignmentRequest = Partial<Omit<SubjectAssignment, "id">>;

/* ================= DASHBOARD TYPES ================= */

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  todayAttendance: number;
  pendingFees: number;
}

export interface MonthlyEnrollment {
  month: string;
  enrollments: number;
}

export interface AttendanceOverview {
  present: number;
  absent: number;
  leave: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
}

/* ================= REPORT TYPES ================= */

export interface StudentReport {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  byClass: Record<string, number>;
  bySection?: Record<string, number>;
  byGender?: Record<string, number>;
}

export interface AttendanceReport {
  date: string;
  totalPresent: number;
  totalAbsent: number;
  totalLeave: number;
  percentage: number;
}

export interface FeeReport {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  paymentPercentage: number;
  byClass?: Record<string, number>;
}

/* ================= ERROR TYPES ================= */

export class ApiError extends Error {
  public readonly name = "ApiError";

  constructor(
    public readonly statusCode: number,
    public readonly errorCode: string,
    message: string,
    public readonly details?: string[]
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface RequestConfig {
  method: HttpMethod;
  headers?: Record<string, string>;
  data?: Record<string, unknown>;
  params?: Record<string, unknown>;
  timeout?: number;
}

/* ================= UTILITY TYPES ================= */

export type EntityType =
  | Student
  | Teacher
  | Staff
  | Result
  | Enrollment
  | Class
  | Subject
  | SubjectAssignment
  | Attendance
  | Fee
  | FeeStructure
  | FeeBill
  | Payroll
  | LeaveRequest;

export type AllFilters =
  | StudentFilters
  | TeacherFilters
  | StaffFilters
  | AttendanceFilters
  | FeeFilters
  | PayrollFilters
  | LeaveFilters;

export type AllRequests =
  | CreateStudentRequest
  | CreateTeacherRequest
  | CreateStaffRequest
  | CreateResultRequest
  | CreateEnrollmentRequest
  | CreateClassRequest
  | CreateSubjectRequest
  | CreateSubjectAssignmentRequest
  | CreateAttendanceRequest
  | CreateFeeRequest
  | CreateFeeStructureRequest
  | CreateFeeBillRequest
  | CreatePayrollRequest
  | CreateLeaveRequest;

/* ================= CONSTANTS ================= */

export const STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
} as const;

export const RESULT = {
  PASS: "Pass",
  FAIL: "Fail",
} as const;

export const ATTENDANCE_STATUS = {
  PRESENT: "Present",
  ABSENT: "Absent",
  LEAVE: "Leave",
} as const;

export const ENTITY_TYPE = {
  STUDENT: "Student",
  TEACHER: "Teacher",
  STAFF: "Staff",
} as const;

export const FEE_STATUS = {
  PAID: "Paid",
  PENDING: "Pending",
  OVERDUE: "Overdue",
  PARTIAL: "Partial",
} as const;

export const ENROLLMENT_STATUS = {
  ACTIVE: "Active",
  COMPLETED: "Completed",
} as const;

export const FEE_TYPE = {
  RECURRING: "Recurring",
  ONE_TIME: "One-Time",
} as const;

export const FEE_FREQUENCY = {
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  YEARLY: "Yearly",
} as const;

export const PAYROLL_STATUS = {
  PAID: "Paid",
  PENDING: "Pending",
  ON_HOLD: "On Hold",
} as const;

export const LEAVE_TYPE = {
  SICK: "Sick",
  CASUAL: "Casual",
  ANNUAL: "Annual",
  UNPAID: "Unpaid",
  MATERNITY: "Maternity",
  PATERNITY: "Paternity",
} as const;

export const LEAVE_STATUS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
} as const;

/* ================= FORM STATE TYPES ================= */

export interface FormState<T = Record<string, unknown>> {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  data?: T;
}

export interface TableState<F = AllFilters> {
  data: EntityType[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationResponse;
  filters: F;
}

/* ================= MODAL TYPES ================= */

export interface ModalState<D = EntityType> {
  isOpen: boolean;
  mode: "create" | "edit" | "view";
  data?: D;
}

/* ================= NOTIFICATION TYPES ================= */

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}