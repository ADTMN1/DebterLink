import { z } from "zod";

// NOTE:
// For now this app uses in-memory storage only (no real database),
// so we define Zod schemas instead of full Drizzle table definitions.
// These shared types are used both on the server and client.

// ---------- Users ----------

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
});

export const insertUserSchema = userSchema.pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof userSchema>;

// ---------- Schools (Super Admin) ----------

export const schoolSchema = z.object({
  id: z.string(),
  name: z.string(),
  region: z.string(),
  students: z.number().int().nonnegative(),
  status: z.enum(["Active", "Maintenance"]),
});

export const insertSchoolSchema = schoolSchema.omit({ id: true });

export type School = z.infer<typeof schoolSchema>;
export type InsertSchool = z.infer<typeof insertSchoolSchema>;

// ---------- Attendance (Teacher) ----------

export const attendanceRecordSchema = z.object({
  id: z.string(),
  classId: z.string(),
  className: z.string(),
  date: z.string(), // ISO date string (YYYY-MM-DD)
  records: z.array(
    z.object({
      studentId: z.number().int(),
      name: z.string(),
      status: z.enum(["present", "absent", "late"]),
    }),
  ),
});

export const insertAttendanceRecordSchema = attendanceRecordSchema.omit({
  id: true,
});

export type AttendanceRecord = z.infer<typeof attendanceRecordSchema>;
export type InsertAttendanceRecord = z.infer<typeof insertAttendanceRecordSchema>;

// ---------- Admin User Management ----------

export const adminUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["Student", "Teacher", "Parent", "Director", "Admin", "Super Admin"]),
  status: z.enum(["Active", "Suspended"]),
});

export const insertAdminUserSchema = adminUserSchema.omit({ id: true });

export type AdminUser = z.infer<typeof adminUserSchema>;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;

// ---------- Behavior Records (Teacher) ----------

export const behaviorRecordSchema = z.object({
  id: z.string(),
  studentName: z.string(),
  type: z.enum(["positive", "negative"]),
  description: z.string(),
  recordedBy: z.string(),
  date: z.string(), // ISO date string (YYYY-MM-DD)
});

export const insertBehaviorRecordSchema = behaviorRecordSchema.omit({ id: true });

export type BehaviorRecord = z.infer<typeof behaviorRecordSchema>;
export type InsertBehaviorRecord = z.infer<typeof insertBehaviorRecordSchema>;

// ---------- Student Results (Teacher) ----------

export const studentResultSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  studentName: z.string(),
  subject: z.string(),
  assessmentType: z.enum(["assignment", "exam", "quiz", "mid", "final", "semester", "year"]),
  score: z.number().min(0),
  maxScore: z.number().min(1),
  grade: z.string().optional(),
  date: z.string(), // ISO date string (YYYY-MM-DD)
  recordedBy: z.string(),
  semester: z.string().optional(),
  academicYear: z.string().optional(),
});

export const insertStudentResultSchema = studentResultSchema.omit({ id: true });

export type StudentResult = z.infer<typeof studentResultSchema>;
export type InsertStudentResult = z.infer<typeof insertStudentResultSchema>;

// ---------- Classes (Director) ----------

export const classSchema = z.object({
  id: z.string(),
  name: z.string(), // e.g., "Grade 11A", "Grade 10B"
  grade: z.string(), // e.g., "11", "10"
  section: z.string(), // e.g., "A", "B"
  capacity: z.number().int().positive(),
  currentStudents: z.number().int().nonnegative().default(0),
  teacherId: z.string().optional(),
  teacherName: z.string().optional(),
  academicYear: z.string(),
  status: z.enum(["Active", "Inactive"]),
});

export const insertClassSchema = classSchema.omit({ id: true });

export type Class = z.infer<typeof classSchema>;
export type InsertClass = z.infer<typeof insertClassSchema>;

// ---------- Subject Assignments (Director) ----------

export const subjectAssignmentSchema = z.object({
  id: z.string(),
  teacherId: z.string(),
  teacherName: z.string(),
  subject: z.string(),
  classId: z.string().optional(),
  className: z.string().optional(),
  academicYear: z.string(),
});

export const insertSubjectAssignmentSchema = subjectAssignmentSchema.omit({ id: true });

export type SubjectAssignment = z.infer<typeof subjectAssignmentSchema>;
export type InsertSubjectAssignment = z.infer<typeof insertSubjectAssignmentSchema>;

// ---------- Timetable (Director) ----------

export const timetableEntrySchema = z.object({
  id: z.string(),
  classId: z.string(),
  className: z.string(),
  subject: z.string(),
  teacherId: z.string(),
  teacherName: z.string(),
  day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
  startTime: z.string(), // HH:MM format
  endTime: z.string(), // HH:MM format
  room: z.string().optional(),
  academicYear: z.string(),
});

export const insertTimetableEntrySchema = timetableEntrySchema.omit({ id: true });

export type TimetableEntry = z.infer<typeof timetableEntrySchema>;
export type InsertTimetableEntry = z.infer<typeof insertTimetableEntrySchema>;

// ---------- Exam Schedule (Director) ----------

export const examScheduleSchema = z.object({
  id: z.string(),
  title: z.string(),
  subject: z.string(),
  classId: z.string().optional(),
  className: z.string().optional(),
  examType: z.enum(["quiz", "mid", "final", "semester", "year"]),
  date: z.string(), // ISO date string (YYYY-MM-DD)
  startTime: z.string(), // HH:MM format
  endTime: z.string(), // HH:MM format
  room: z.string().optional(),
  academicYear: z.string(),
  createdBy: z.string(),
});

export const insertExamScheduleSchema = examScheduleSchema.omit({ id: true, createdBy: true });

export type ExamSchedule = z.infer<typeof examScheduleSchema>;
export type InsertExamSchedule = z.infer<typeof insertExamScheduleSchema>;

// ---------- Assignment Submissions (Student) ----------

export const assignmentSubmissionSchema = z.object({
  id: z.string(),
  assignmentId: z.string(),
  assignmentTitle: z.string().optional(),
  studentId: z.string(),
  studentName: z.string(),
  subject: z.string(),
  teacherId: z.string().optional(),
  teacherName: z.string().optional(),
  fileName: z.string().optional(),
  fileContentBase64: z.string().optional(),
  submittedAt: z.string(), // ISO
});

export const insertAssignmentSubmissionSchema = assignmentSubmissionSchema.omit({ id: true });

export type AssignmentSubmission = z.infer<typeof assignmentSubmissionSchema>;
export type InsertAssignmentSubmission = z.infer<typeof insertAssignmentSubmissionSchema>;
