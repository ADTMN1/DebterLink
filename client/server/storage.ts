import {
  type User,
  type InsertUser,
  type School,
  type InsertSchool,
  type AttendanceRecord,
  type InsertAttendanceRecord,
  type AdminUser,
  type InsertAdminUser,
  type BehaviorRecord,
  type InsertBehaviorRecord,
  type StudentResult,
  type InsertStudentResult,
  type Class,
  type InsertClass,
  type SubjectAssignment,
  type InsertSubjectAssignment,
  type TimetableEntry,
  type InsertTimetableEntry,
  type ExamSchedule,
  type InsertExamSchedule,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Schools (Super Admin)
  listSchools(): Promise<School[]>;
  createSchool(school: InsertSchool): Promise<School>;

  // Attendance (Teacher)
  saveAttendance(record: InsertAttendanceRecord): Promise<AttendanceRecord>;
  listAttendanceByClassAndDate(
    classId: string,
    date: string,
  ): Promise<AttendanceRecord | undefined>;

  // Admin User Management
  listAdminUsers(): Promise<AdminUser[]>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;

  // Behavior Records (Teacher)
  listBehaviorRecords(): Promise<BehaviorRecord[]>;
  createBehaviorRecord(record: InsertBehaviorRecord): Promise<BehaviorRecord>;

  // Student Results (Teacher)
  listStudentResults(filters?: { studentId?: string; subject?: string; assessmentType?: string }): Promise<StudentResult[]>;
  createStudentResult(result: InsertStudentResult): Promise<StudentResult>;

  // Classes (Director)
  listClasses(): Promise<Class[]>;
  createClass(classData: InsertClass): Promise<Class>;
  updateClass(id: string, updates: Partial<InsertClass>): Promise<Class>;
  deleteClass(id: string): Promise<void>;
  assignTeacherToClass(classId: string, teacherId: string, teacherName: string): Promise<Class>;

  // Subject Assignments (Director)
  listSubjectAssignments(filters?: { teacherId?: string; subject?: string; classId?: string }): Promise<SubjectAssignment[]>;
  createSubjectAssignment(assignment: InsertSubjectAssignment): Promise<SubjectAssignment>;
  deleteSubjectAssignment(id: string): Promise<void>;

  // Timetable (Director)
  listTimetableEntries(filters?: { classId?: string; day?: string; teacherId?: string }): Promise<TimetableEntry[]>;
  createTimetableEntry(entry: InsertTimetableEntry): Promise<TimetableEntry>;
  updateTimetableEntry(id: string, updates: Partial<InsertTimetableEntry>): Promise<TimetableEntry>;
  deleteTimetableEntry(id: string): Promise<void>;

  // Exam Schedule (Director)
  listExamSchedules(filters?: { classId?: string; subject?: string; examType?: string }): Promise<ExamSchedule[]>;
  createExamSchedule(schedule: InsertExamSchedule): Promise<ExamSchedule>;
  updateExamSchedule(id: string, updates: Partial<InsertExamSchedule>): Promise<ExamSchedule>;
  deleteExamSchedule(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private schools: Map<string, School>;
  private attendance: Map<string, AttendanceRecord>;
  private adminUsers: Map<string, AdminUser>;
  private behaviorRecords: Map<string, BehaviorRecord>;
  private studentResults: Map<string, StudentResult>;
  private classes: Map<string, Class>;
  private subjectAssignments: Map<string, SubjectAssignment>;
  private timetableEntries: Map<string, TimetableEntry>;
  private examSchedules: Map<string, ExamSchedule>;
  private assignmentSubmissions: Map<string, import("@shared/schema").AssignmentSubmission>;

  constructor() {
    this.users = new Map();
    this.schools = new Map();
    this.attendance = new Map();
    this.adminUsers = new Map();
    this.behaviorRecords = new Map();
    this.studentResults = new Map();
    this.classes = new Map();
    this.subjectAssignments = new Map();
    this.timetableEntries = new Map();
    this.examSchedules = new Map();
    this.assignmentSubmissions = new Map();
    
    // Initialize with some default admin users
    this.adminUsers.set('1', {
      id: '1',
      name: 'Abebe Kebede',
      username: 'student',
      email: 'abebe@school.com',
      password: '123456',
      role: 'Student',
      status: 'Active',
    });
    this.adminUsers.set('2', {
      id: '2',
      name: 'Tigist Alemu',
      username: 'teacher',
      email: 'tigist@school.com',
      password: '123456',
      role: 'Teacher',
      status: 'Active',
    });
    this.adminUsers.set('3', {
      id: '3',
      name: 'Dr. Yohannes',
      username: 'director',
      email: 'director@school.com',
      password: '123456',
      role: 'Director',
      status: 'Active',
    });
    this.adminUsers.set('4', {
      id: '4',
      name: 'Kebede Tesfaye',
      username: 'parent',
      email: 'parent@school.com',
      password: '123456',
      role: 'Parent',
      status: 'Suspended',
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // ---------- Schools ----------

  async listSchools(): Promise<School[]> {
    return Array.from(this.schools.values());
  }

  async createSchool(insertSchool: InsertSchool): Promise<School> {
    const id = randomUUID();
    const school: School = { ...insertSchool, id };
    this.schools.set(id, school);
    return school;
  }

  // ---------- Attendance ----------

  async saveAttendance(
    insertAttendance: InsertAttendanceRecord,
  ): Promise<AttendanceRecord> {
    const id = randomUUID();
    const record: AttendanceRecord = { ...insertAttendance, id };

    // Use composite key classId+date so each class/day has one record
    const key = `${record.classId}:${record.date}`;
    this.attendance.set(key, record);
    return record;
  }

  async listAttendanceByClassAndDate(
    classId: string,
    date: string,
  ): Promise<AttendanceRecord | undefined> {
    const key = `${classId}:${date}`;
    return this.attendance.get(key);
  }

  // ---------- Admin User Management ----------

  async listAdminUsers(): Promise<AdminUser[]> {
    return Array.from(this.adminUsers.values());
  }

  async createAdminUser(insertUser: InsertAdminUser): Promise<AdminUser> {
    const id = randomUUID();
    const user: AdminUser = { ...insertUser, id };
    this.adminUsers.set(id, user);
    return user;
  }

  // ---------- Behavior Records ----------

  async listBehaviorRecords(): Promise<BehaviorRecord[]> {
    return Array.from(this.behaviorRecords.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async createBehaviorRecord(insertRecord: InsertBehaviorRecord): Promise<BehaviorRecord> {
    const id = randomUUID();
    const record: BehaviorRecord = { ...insertRecord, id };
    this.behaviorRecords.set(id, record);
    return record;
  }

  // ---------- Student Results ----------

  async listStudentResults(filters?: { studentId?: string; subject?: string; assessmentType?: string }): Promise<StudentResult[]> {
    let results = Array.from(this.studentResults.values());
    
    if (filters) {
      if (filters.studentId) {
        results = results.filter(r => r.studentId === filters.studentId);
      }
      if (filters.subject) {
        results = results.filter(r => r.subject === filters.subject);
      }
      if (filters.assessmentType) {
        results = results.filter(r => r.assessmentType === filters.assessmentType);
      }
    }
    
    return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createStudentResult(insertResult: InsertStudentResult): Promise<StudentResult> {
    const id = randomUUID();
    
    // Calculate grade based on percentage
    const percentage = (insertResult.score / insertResult.maxScore) * 100;
    let grade: string;
    if (percentage >= 90) grade = 'A';
    else if (percentage >= 80) grade = 'B';
    else if (percentage >= 70) grade = 'C';
    else if (percentage >= 60) grade = 'D';
    else grade = 'F';
    
    const result: StudentResult = { 
      ...insertResult, 
      id,
      grade,
    };
    this.studentResults.set(id, result);
    return result;
  }

  // ---------- Classes ----------

  async listClasses(): Promise<Class[]> {
    return Array.from(this.classes.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  }

  async createClass(classData: InsertClass): Promise<Class> {
    const id = randomUUID();
    const newClass: Class = { ...classData, id };
    this.classes.set(id, newClass);
    return newClass;
  }

  async updateClass(id: string, updates: Partial<InsertClass>): Promise<Class> {
    const existing = this.classes.get(id);
    if (!existing) throw new Error('Class not found');
    const updated: Class = { ...existing, ...updates };
    this.classes.set(id, updated);
    return updated;
  }

  async deleteClass(id: string): Promise<void> {
    if (!this.classes.has(id)) throw new Error('Class not found');
    this.classes.delete(id);
  }

  async assignTeacherToClass(classId: string, teacherId: string, teacherName: string): Promise<Class> {
    const existing = this.classes.get(classId);
    if (!existing) throw new Error('Class not found');
    const updated: Class = { ...existing, teacherId, teacherName };
    this.classes.set(classId, updated);
    return updated;
  }

  // ---------- Subject Assignments ----------

  async listSubjectAssignments(filters?: { teacherId?: string; subject?: string; classId?: string }): Promise<SubjectAssignment[]> {
    let assignments = Array.from(this.subjectAssignments.values());
    
    if (filters) {
      if (filters.teacherId) {
        assignments = assignments.filter(a => a.teacherId === filters.teacherId);
      }
      if (filters.subject) {
        assignments = assignments.filter(a => a.subject === filters.subject);
      }
      if (filters.classId) {
        assignments = assignments.filter(a => a.classId === filters.classId);
      }
    }
    
    return assignments;
  }

  async createSubjectAssignment(assignment: InsertSubjectAssignment): Promise<SubjectAssignment> {
    const id = randomUUID();
    const newAssignment: SubjectAssignment = { ...assignment, id };
    this.subjectAssignments.set(id, newAssignment);
    return newAssignment;
  }

  async deleteSubjectAssignment(id: string): Promise<void> {
    if (!this.subjectAssignments.has(id)) throw new Error('Subject assignment not found');
    this.subjectAssignments.delete(id);
  }

  // ---------- Timetable ----------

  async listTimetableEntries(filters?: { classId?: string; day?: string; teacherId?: string }): Promise<TimetableEntry[]> {
    let entries = Array.from(this.timetableEntries.values());
    
    if (filters) {
      if (filters.classId) {
        entries = entries.filter(e => e.classId === filters.classId);
      }
      if (filters.day) {
        entries = entries.filter(e => e.day === filters.day);
      }
      if (filters.teacherId) {
        entries = entries.filter(e => e.teacherId === filters.teacherId);
      }
    }
    
    return entries.sort((a, b) => {
      const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
      if (dayDiff !== 0) return dayDiff;
      return a.startTime.localeCompare(b.startTime);
    });
  }

  async createTimetableEntry(entry: InsertTimetableEntry): Promise<TimetableEntry> {
    const id = randomUUID();
    const newEntry: TimetableEntry = { ...entry, id };
    this.timetableEntries.set(id, newEntry);
    return newEntry;
  }

  async updateTimetableEntry(id: string, updates: Partial<InsertTimetableEntry>): Promise<TimetableEntry> {
    const existing = this.timetableEntries.get(id);
    if (!existing) throw new Error('Timetable entry not found');
    const updated: TimetableEntry = { ...existing, ...updates };
    this.timetableEntries.set(id, updated);
    return updated;
  }

  async deleteTimetableEntry(id: string): Promise<void> {
    if (!this.timetableEntries.has(id)) throw new Error('Timetable entry not found');
    this.timetableEntries.delete(id);
  }

  // ---------- Exam Schedule ----------

  async listExamSchedules(filters?: { classId?: string; subject?: string; examType?: string }): Promise<ExamSchedule[]> {
    let schedules = Array.from(this.examSchedules.values());
    
    if (filters) {
      if (filters.classId) {
        schedules = schedules.filter(s => s.classId === filters.classId);
      }
      if (filters.subject) {
        schedules = schedules.filter(s => s.subject === filters.subject);
      }
      if (filters.examType) {
        schedules = schedules.filter(s => s.examType === filters.examType);
      }
    }
    
    return schedules.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async createExamSchedule(schedule: InsertExamSchedule): Promise<ExamSchedule> {
    const id = randomUUID();
    const newSchedule: ExamSchedule = { ...schedule, id, createdBy: 'Director' };
    this.examSchedules.set(id, newSchedule);
    return newSchedule;
  }

  // ---------- Assignment Submissions (Student) ----------

  async listAssignmentSubmissions(filters?: { studentId?: string; assignmentId?: string; teacherId?: string; subject?: string }): Promise<import("@shared/schema").AssignmentSubmission[]> {
    let subs = Array.from(this.assignmentSubmissions.values());
    if (filters) {
      if (filters.studentId) subs = subs.filter(s => s.studentId === filters.studentId);
      if (filters.assignmentId) subs = subs.filter(s => s.assignmentId === filters.assignmentId);
      if (filters.teacherId) subs = subs.filter(s => s.teacherId === filters.teacherId);
      if (filters.subject) subs = subs.filter(s => s.subject === filters.subject);
    }
    return subs.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  async createAssignmentSubmission(sub: import("@shared/schema").InsertAssignmentSubmission): Promise<import("@shared/schema").AssignmentSubmission> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const created: import("@shared/schema").AssignmentSubmission = { ...sub, id, submittedAt: now } as any;
    this.assignmentSubmissions.set(id, created);
    return created;
  }

  async updateExamSchedule(id: string, updates: Partial<InsertExamSchedule>): Promise<ExamSchedule> {
    const existing = this.examSchedules.get(id);
    if (!existing) throw new Error('Exam schedule not found');
    const updated: ExamSchedule = { ...existing, ...updates };
    this.examSchedules.set(id, updated);
    return updated;
  }

  async deleteExamSchedule(id: string): Promise<void> {
    if (!this.examSchedules.has(id)) throw new Error('Exam schedule not found');
    this.examSchedules.delete(id);
  }
}

export const storage = new MemStorage();
