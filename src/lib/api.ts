// src/lib/api.ts

import type {
  Student, Teacher, Staff, Result, Enrollment, Class, Subject,
  SubjectAssignment, Attendance, Fee, FeeStructure, FeeItem, FeeBill,
  Payroll, LeaveRequest, User,
  CreateStudentRequest, UpdateStudentRequest,
  CreateTeacherRequest, UpdateTeacherRequest,
  CreateStaffRequest, UpdateStaffRequest,
  CreateResultRequest, UpdateResultRequest,
  CreateEnrollmentRequest, UpdateEnrollmentRequest,
  CreateClassRequest, UpdateClassRequest,
  CreateSubjectRequest, UpdateSubjectRequest,
  CreateSubjectAssignmentRequest, UpdateSubjectAssignmentRequest,
  CreateAttendanceRequest, UpdateAttendanceRequest,
  CreateFeeStructureRequest, UpdateFeeStructureRequest,
  CreateFeeBillRequest, UpdateFeeBillRequest,
  CreatePayrollRequest, UpdatePayrollRequest,
  CreateLeaveRequest, UpdateLeaveRequest,
  StudentFilters, TeacherFilters, StaffFilters,
  AttendanceFilters, FeeFilters, PayrollFilters, LeaveFilters,
  ApiResponse, ApiListResponse, LoginRequest, AuthResponse,
  DashboardStats, MonthlyEnrollment, AttendanceOverview, RevenueData,
  StudentReport, AttendanceReport, FeeReport, PaginationParams,
} from "@/lib/types";

/* ================= BASE CONFIG ================= */

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5272/api";

/* ================= HTTP CLIENT ================= */

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // Handle empty responses (e.g. 204 No Content)
  const contentType = res.headers.get("content-type");
  const hasJson = contentType?.includes("application/json");
  const text = await res.text();
  const data = hasJson && text ? JSON.parse(text) : text ? { message: text } : {};

  if (!res.ok) {
    throw new Error(
      (data as Record<string, string>)?.error ??
      (data as Record<string, string>)?.message ??
      "Something went wrong"
    );
  }

  return data as T;
}

// Accepts any shape and flattens nested objects:
// { dateRange: { start, end } } → ?dateRange[start]=...&dateRange[end]=...
function buildQuery(params: Record<string, unknown>): string {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    if (typeof value === "object" && value !== null) {
      for (const [subKey, subVal] of Object.entries(value)) {
        if (subVal !== undefined && subVal !== "") {
          q.set(`${key}[${subKey}]`, String(subVal));
        }
      }
    } else {
      q.set(key, String(value));
    }
  }
  const str = q.toString();
  return str ? `?${str}` : "";
}

/* ================= AUTH ================= */

export const authApi = {
  login: (body: LoginRequest): Promise<ApiResponse<AuthResponse>> =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),

  register: (body: {
    username: string;
    email: string;
    password: string;
    role: string;
    referenceId?: number;
    referenceType?: string;
  }): Promise<ApiResponse<AuthResponse>> =>
    request("/auth/register", { method: "POST", body: JSON.stringify(body) }),

  logout: (): Promise<ApiResponse<null>> =>
    request("/auth/logout", { method: "POST" }),

  me: (): Promise<ApiResponse<User>> =>
    request("/auth/me"),

  changePassword: (body: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<null>> =>
    request("/auth/change-password", { method: "PATCH", body: JSON.stringify(body) }),

  updateProfile: (
    body: Partial<Pick<User, "name" | "email" | "phone" | "photo">>
  ): Promise<ApiResponse<User>> =>
    request("/auth/profile", { method: "PATCH", body: JSON.stringify(body) }),
};

/* ================= DASHBOARD ================= */

export const dashboardApi = {
  getStats: (): Promise<ApiResponse<DashboardStats>> =>
    request("/dashboard/stats"),

  getMonthlyEnrollments: (): Promise<ApiResponse<MonthlyEnrollment[]>> =>
    request("/dashboard/enrollments"),

  getAttendanceOverview: (): Promise<ApiResponse<AttendanceOverview>> =>
    request("/dashboard/attendance"),

  getRevenueData: (): Promise<ApiResponse<RevenueData[]>> =>
    request("/dashboard/revenue"),
};


/* ================= STUDENTS ================= */

// Backend returns "class" (reserved word), map it to "className" for frontend types
function mapStudent(s: Record<string, unknown>): Student {
  return {
    ...(s as unknown as Student),
    className: (s["class"] as string) ?? "",
  };
}

export const studentsApi = {
  getAll: async (
    filters?: StudentFilters & PaginationParams
  ): Promise<ApiListResponse<Student>> => {
    const res = await request<ApiListResponse<Record<string, unknown>>>(
      `/students${buildQuery({ ...filters })}`
    );
    return {
      ...res,
      data: res.data?.map(mapStudent) ?? [],
    };
  },

  getById: async (id: number): Promise<ApiResponse<Student>> => {
    const res = await request<ApiResponse<Record<string, unknown>>>(
      `/students/${id}`
    );
    return {
      ...res,
      data: res.data ? mapStudent(res.data) : undefined,
    };
  },

  create: (body: CreateStudentRequest): Promise<ApiResponse<Student>> => {
    // Map "className" back to "class" for the backend
    const payload = { ...body, class: body.className };
    return request("/students", { method: "POST", body: JSON.stringify(payload) });
  },

  update: (id: number, body: UpdateStudentRequest): Promise<ApiResponse<Student>> => {
    const payload = { ...body, class: body.className };
    return request(`/students/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  },

  delete: (id: number): Promise<ApiResponse<null>> =>
    request(`/students/${id}`, { method: "DELETE" }),

  getReport: (): Promise<ApiResponse<StudentReport>> =>
    request("/students/report"),
};

/* ================= TEACHERS ================= */

export const teachersApi = {
  getAll: (
    filters?: TeacherFilters & PaginationParams
  ): Promise<ApiListResponse<Teacher>> =>
    request(`/teachers${buildQuery({ ...filters })}`),

  getById: (id: number): Promise<ApiResponse<Teacher>> =>
    request(`/teachers/${id}`),

  create: (body: CreateTeacherRequest): Promise<ApiResponse<Teacher>> =>
    request("/teachers", { method: "POST", body: JSON.stringify(body) }),

  update: (id: number, body: UpdateTeacherRequest): Promise<ApiResponse<Teacher>> =>
    request(`/teachers/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  delete: (id: number): Promise<ApiResponse<null>> =>
    request(`/teachers/${id}`, { method: "DELETE" }),
};

/* ================= STAFF ================= */

export const staffApi = {
  getAll: (
    filters?: StaffFilters & PaginationParams
  ): Promise<ApiListResponse<Staff>> =>
    request(`/staff${buildQuery({ ...filters })}`),

  getById: (id: number): Promise<ApiResponse<Staff>> =>
    request(`/staff/${id}`),

  create: (body: CreateStaffRequest): Promise<ApiResponse<Staff>> =>
    request("/staff", { method: "POST", body: JSON.stringify(body) }),

  update: (id: number, body: UpdateStaffRequest): Promise<ApiResponse<Staff>> =>
    request(`/staff/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  delete: (id: number): Promise<ApiResponse<null>> =>
    request(`/staff/${id}`, { method: "DELETE" }),
};

/* ================= CLASSES ================= */

export const classesApi = {
  getAll: (params?: PaginationParams): Promise<ApiListResponse<Class>> =>
    request(`/classes${buildQuery({ ...params })}`),

  getById: (id: number): Promise<ApiResponse<Class>> =>
    request(`/classes/${id}`),

  create: (body: CreateClassRequest): Promise<ApiResponse<Class>> =>
    request("/classes", { method: "POST", body: JSON.stringify(body) }),

  update: (id: number, body: UpdateClassRequest): Promise<ApiResponse<Class>> =>
    request(`/classes/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  delete: (id: number): Promise<ApiResponse<null>> =>
    request(`/classes/${id}`, { method: "DELETE" }),
};

/* ================= SUBJECTS ================= */

export const subjectsApi = {
  getAll: (params?: PaginationParams): Promise<ApiListResponse<Subject>> =>
    request(`/subjects${buildQuery({ ...params })}`),

  getById: (id: number): Promise<ApiResponse<Subject>> =>
    request(`/subjects/${id}`),

  create: (body: CreateSubjectRequest): Promise<ApiResponse<Subject>> =>
    request("/subjects", { method: "POST", body: JSON.stringify(body) }),

  update: (id: number, body: UpdateSubjectRequest): Promise<ApiResponse<Subject>> =>
    request(`/subjects/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  delete: (id: number): Promise<ApiResponse<null>> =>
    request(`/subjects/${id}`, { method: "DELETE" }),
};

/* ================= SUBJECT ASSIGNMENTS ================= */

export const subjectAssignmentsApi = {
  getAll: (params?: PaginationParams): Promise<ApiListResponse<SubjectAssignment>> =>
    request(`/subject-assignments${buildQuery({ ...params })}`),

  getById: (id: number): Promise<ApiResponse<SubjectAssignment>> =>
    request(`/subject-assignments/${id}`),

  create: (body: CreateSubjectAssignmentRequest): Promise<ApiResponse<SubjectAssignment>> =>
    request("/subject-assignments", { method: "POST", body: JSON.stringify(body) }),

  update: (
    id: number,
    body: UpdateSubjectAssignmentRequest
  ): Promise<ApiResponse<SubjectAssignment>> =>
    request(`/subject-assignments/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  delete: (id: number): Promise<ApiResponse<null>> =>
    request(`/subject-assignments/${id}`, { method: "DELETE" }),

  assignTeacher: (
    id: number,
    body: { teacherId: string; teacherName: string }
  ): Promise<ApiResponse<SubjectAssignment>> =>
    request(`/subject-assignments/${id}/assign`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
};

/* ================= RESULTS ================= */

export const resultsApi = {
  getAll: (params?: PaginationParams): Promise<ApiListResponse<Result>> =>
    request(`/results${buildQuery({ ...params })}`),

  getById: (id: number): Promise<ApiResponse<Result>> =>
    request(`/results/${id}`),

  getByStudent: (studentId: number): Promise<ApiListResponse<Result>> =>
    request(`/results/student/${studentId}`),

  create: (body: CreateResultRequest): Promise<ApiResponse<Result>> =>
    request("/results", { method: "POST", body: JSON.stringify(body) }),

  update: (id: number, body: UpdateResultRequest): Promise<ApiResponse<Result>> =>
    request(`/results/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  delete: (id: number): Promise<ApiResponse<null>> =>
    request(`/results/${id}`, { method: "DELETE" }),
};

/* ================= ENROLLMENTS ================= */

export const enrollmentsApi = {
  getAll: (params?: PaginationParams): Promise<ApiListResponse<Enrollment>> =>
    request(`/enrollments${buildQuery({ ...params })}`),

  getById: (id: number): Promise<ApiResponse<Enrollment>> =>
    request(`/enrollments/${id}`),

  create: (body: CreateEnrollmentRequest): Promise<ApiResponse<Enrollment>> =>
    request("/enrollments", { method: "POST", body: JSON.stringify(body) }),

  update: (id: number, body: UpdateEnrollmentRequest): Promise<ApiResponse<Enrollment>> =>
    request(`/enrollments/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  delete: (id: number): Promise<ApiResponse<null>> =>
    request(`/enrollments/${id}`, { method: "DELETE" }),
};

/* ================= ATTENDANCE ================= */

export const attendanceApi = {
  getAll: (
    filters?: AttendanceFilters & PaginationParams
  ): Promise<ApiListResponse<Attendance>> =>
    request(`/attendance${buildQuery({ ...filters })}`),

  getById: (id: number): Promise<ApiResponse<Attendance>> =>
    request(`/attendance/${id}`),

  getByEntityType: (
    entityType: "Student" | "Teacher" | "Staff",
    filters?: Omit<AttendanceFilters, "entityType"> & PaginationParams
  ): Promise<ApiListResponse<Attendance>> =>
    request(`/attendance${buildQuery({ entityType, ...filters })}`),

  create: (body: CreateAttendanceRequest): Promise<ApiResponse<Attendance>> =>
    request("/attendance", { method: "POST", body: JSON.stringify(body) }),

  update: (id: number, body: UpdateAttendanceRequest): Promise<ApiResponse<Attendance>> =>
    request(`/attendance/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  delete: (id: number): Promise<ApiResponse<null>> =>
    request(`/attendance/${id}`, { method: "DELETE" }),

  getReport: (
    filters?: AttendanceFilters
  ): Promise<ApiResponse<AttendanceReport[]>> =>
    request(`/attendance/report${buildQuery({ ...filters })}`),
};

/* ================= FEES ================= */

export const feesApi = {
  getAll: (
    filters?: FeeFilters & PaginationParams
  ): Promise<ApiListResponse<Fee>> =>
    request(`/fees${buildQuery({ ...filters })}`),

  getById: (id: number): Promise<ApiResponse<Fee>> =>
    request(`/fees/${id}`),

  getReport: (): Promise<ApiResponse<FeeReport>> =>
    request("/fees/report"),
};

/* ================= FEE STRUCTURE ================= */

export const feeStructureApi = {
  getAll: (params?: PaginationParams): Promise<ApiListResponse<FeeStructure>> =>
    request(`/feestructure${buildQuery({ ...params })}`),

  getById: (id: number): Promise<ApiResponse<FeeStructure>> =>
    request(`/feestructure/${id}`),

  getByClass: (classId: string): Promise<ApiResponse<FeeStructure>> =>
    request(`/feestructure/class/${encodeURIComponent(classId)}`),

  create: (body: CreateFeeStructureRequest): Promise<ApiResponse<FeeStructure>> =>
    request("/feestructure", { method: "POST", body: JSON.stringify(body) }),

  update: (id: number, body: UpdateFeeStructureRequest): Promise<ApiResponse<FeeStructure>> =>
    request(`/feestructure/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  delete: (id: number): Promise<ApiResponse<null>> =>
    request(`/feestructure/${id}`, { method: "DELETE" }),

  updateItems: (
    id: number,
    body: { classId: string; className: string; totalAmount: number; status: string; recurringItems: FeeItem[]; oneTimeItems: FeeItem[] }
  ): Promise<ApiResponse<FeeStructure>> =>
    request(`/feestructure/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
};

/* ================= FEE BILLS ================= */

export const feeBillsApi = {
  getAll: (
    filters?: FeeFilters & PaginationParams
  ): Promise<ApiListResponse<FeeBill>> =>
    request(`/feebill${buildQuery({ ...filters })}`),

  getById: (id: number): Promise<ApiResponse<FeeBill>> =>
    request(`/feebill/${id}`),

  getByStudent: (studentId: number): Promise<ApiListResponse<FeeBill>> =>
    request(`/feebill/student/${studentId}`),

  create: (body: CreateFeeBillRequest | Record<string, unknown>): Promise<ApiResponse<FeeBill>> =>
    request("/feebill", { method: "POST", body: JSON.stringify(body) }),

  update: (id: number, body: UpdateFeeBillRequest): Promise<ApiResponse<FeeBill>> =>
    request(`/feebill/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  delete: (id: number): Promise<ApiResponse<null>> =>
    request(`/feebill/${id}`, { method: "DELETE" }),

  recordPayment: (
    id: number,
    body: { paymentAmount: number }
  ): Promise<ApiResponse<FeeBill>> =>
    request(`/feebill/${id}/pay`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
};

/* ================= PAYROLL ================= */

export const payrollApi = {
  getAll: (
    filters?: PayrollFilters & PaginationParams
  ): Promise<ApiListResponse<Payroll>> =>
    request(`/payroll${buildQuery({ ...filters })}`),

  getById: (id: number): Promise<ApiResponse<Payroll>> =>
    request(`/payroll/${id}`),

  create: (body: CreatePayrollRequest): Promise<ApiResponse<Payroll>> =>
    request("/payroll", { method: "POST", body: JSON.stringify(body) }),

  update: (id: number, body: UpdatePayrollRequest): Promise<ApiResponse<Payroll>> =>
    request(`/payroll/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  delete: (id: number): Promise<ApiResponse<null>> =>
    request(`/payroll/${id}`, { method: "DELETE" }),

  markPaid: (
    id: number,
    body: { paymentDate: string }
  ): Promise<ApiResponse<Payroll>> =>
    request(`/payroll/${id}/pay`, { method: "PATCH", body: JSON.stringify(body) }),
};

/* ================= LEAVE REQUESTS ================= */

export const leaveApi = {
  getAll: (
    filters?: LeaveFilters & PaginationParams
  ): Promise<ApiListResponse<LeaveRequest>> =>
    request(`/leaverequest${buildQuery({ ...filters })}`),

  getById: (id: number): Promise<ApiResponse<LeaveRequest>> =>
    request(`/leaverequest/${id}`),

  create: (body: CreateLeaveRequest): Promise<ApiResponse<LeaveRequest>> =>
    request("/leaverequest", { method: "POST", body: JSON.stringify(body) }),

  update: (id: number, body: UpdateLeaveRequest): Promise<ApiResponse<LeaveRequest>> =>
    request(`/leaverequest/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  delete: (id: number): Promise<ApiResponse<null>> =>
    request(`/leaverequest/${id}`, { method: "DELETE" }),

  approve: (id: number, approvedBy: string): Promise<ApiResponse<LeaveRequest>> =>
    request(`/leaverequest/${id}/approve`, {
      method: "PATCH",
      body: JSON.stringify({ status: "Approved", approvedBy }),
    }),

  reject: (id: number): Promise<ApiResponse<LeaveRequest>> =>
    request(`/leaverequest/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ approvedBy: "" }),
    }),
};