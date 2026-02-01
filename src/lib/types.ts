export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  studentId: string;
  class: string;
  rollNo: number;
  status: "Active" | "Inactive";
}

export interface Grade {
  id: number;
  studentId: number;
  studentName: string;
  subject: string;
  marks: number;
  grade: string;
  result: "Pass" | "Fail";
}

export interface Result {
  id: number;
  studentId: number;
  studentName: string;
  class: string;
  totalMarks: number;
  percentage: number;
  result: "Pass" | "Fail";
}

export interface Enrollment {
  id: number;
  studentId: number;
  studentName: string;
  rollNo: string;
  course: string;
  enrolledOn: string;
  status: "Active" | "Completed";
}

export interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  teacherId: string;
  subject: string;
  status: "Active" | "Inactive";
}

export interface ClassData {
  id: number;
  name: string;
  teacherName: string;
  studentCount: number;
  status: "Active" | "Inactive";
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  teacherName: string;
  status: "Active" | "Inactive";
}

export interface Attendance {
  id: number;
  studentName: string;
  date: string;
  status: "Present" | "Absent" | "Leave";
}

export interface Fee {
  id: number;
  studentName: string;
  amount: number;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue";
}