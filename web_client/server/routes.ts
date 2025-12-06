import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertSchoolSchema,
  insertAttendanceRecordSchema,
  insertAdminUserSchema,
  insertBehaviorRecordSchema,
  insertStudentResultSchema,
  insertClassSchema,
  insertSubjectAssignmentSchema,
  insertTimetableEntrySchema,
  insertExamScheduleSchema,
  insertAssignmentSubmissionSchema,
} from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // All API routes are prefixed with /api

  // ---------- Schools (Super Admin) ----------

  app.get("/api/schools", async (_req: Request, res: Response) => {
    const schools = await storage.listSchools();
    res.json(schools);
  });

  app.post("/api/schools", async (req: Request, res: Response, next) => {
    try {
      const data = insertSchoolSchema.parse(req.body);
      const created = await storage.createSchool(data);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  });

  // ---------- Attendance (Teacher) ----------

  app.get("/api/attendance", async (req: Request, res: Response) => {
    const { classId, date } = req.query as { classId?: string; date?: string };

    if (!classId || !date) {
      return res
        .status(400)
        .json({ message: "classId and date query params are required" });
    }

    const record = await storage.listAttendanceByClassAndDate(classId, date);
    if (!record) {
      return res.status(404).json({ message: "No attendance found" });
    }

    res.json(record);
  });

  app.post("/api/attendance", async (req: Request, res: Response, next) => {
    try {
      const data = insertAttendanceRecordSchema.parse(req.body);
      const saved = await storage.saveAttendance(data);
      res.status(201).json(saved);
    } catch (err) {
      next(err);
    }
  });

  // ---------- Admin User Management ----------

  app.get("/api/admin/users", async (_req: Request, res: Response) => {
    const users = await storage.listAdminUsers();
    res.json(users);
  });

  app.post("/api/admin/users", async (req: Request, res: Response, next) => {
    try {
      console.log('Received user creation request:', req.body);
      const data = insertAdminUserSchema.parse(req.body);
      console.log('Parsed data:', data);
      const created = await storage.createAdminUser(data);
      console.log('User created:', created);
      res.status(201).json(created);
    } catch (err: any) {
      console.error('Error creating user:', err);
      if (err.name === 'ZodError') {
        return res.status(400).json({ 
          message: 'Validation error', 
          errors: err.errors 
        });
      }
      next(err);
    }
  });

  // ---------- Behavior Records (Teacher) ----------

  app.get("/api/behavior", async (_req: Request, res: Response) => {
    const records = await storage.listBehaviorRecords();
    res.json(records);
  });

  app.post("/api/behavior", async (req: Request, res: Response, next) => {
    try {
      const data = insertBehaviorRecordSchema.parse(req.body);
      const created = await storage.createBehaviorRecord(data);
      res.status(201).json(created);
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ 
          message: 'Validation error', 
          errors: err.errors 
        });
      }
      next(err);
    }
  });

  // ---------- Student Results (Teacher) ----------

  app.get("/api/student-results", async (req: Request, res: Response) => {
    const { studentId, subject, assessmentType } = req.query as { 
      studentId?: string; 
      subject?: string; 
      assessmentType?: string;
    };
    const results = await storage.listStudentResults({ studentId, subject, assessmentType });
    res.json(results);
  });

  app.post("/api/student-results", async (req: Request, res: Response, next) => {
    try {
      const data = insertStudentResultSchema.parse(req.body);
      const created = await storage.createStudentResult(data);
      res.status(201).json(created);
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ 
          message: 'Validation error', 
          errors: err.errors 
        });
      }
      next(err);
    }
  });

  // ---------- Classes (Director) ----------

  app.get("/api/classes", async (_req: Request, res: Response) => {
    const classes = await storage.listClasses();
    res.json(classes);
  });

  app.post("/api/classes", async (req: Request, res: Response, next) => {
    try {
      const data = insertClassSchema.parse(req.body);
      const created = await storage.createClass(data);
      res.status(201).json(created);
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ 
          message: 'Validation error', 
          errors: err.errors 
        });
      }
      next(err);
    }
  });

  app.patch("/api/classes/:id", async (req: Request, res: Response, next) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = await storage.updateClass(id, updates);
      res.json(updated);
    } catch (err: any) {
      if (err.message === 'Class not found') {
        return res.status(404).json({ message: err.message });
      }
      next(err);
    }
  });

  app.delete("/api/classes/:id", async (req: Request, res: Response, next) => {
    try {
      const { id } = req.params;
      await storage.deleteClass(id);
      res.status(204).send();
    } catch (err: any) {
      if (err.message === 'Class not found') {
        return res.status(404).json({ message: err.message });
      }
      next(err);
    }
  });

  app.post("/api/classes/:id/assign-teacher", async (req: Request, res: Response, next) => {
    try {
      const { id } = req.params;
      const { teacherId, teacherName } = req.body;
      if (!teacherId || !teacherName) {
        return res.status(400).json({ message: 'teacherId and teacherName are required' });
      }
      const updated = await storage.assignTeacherToClass(id, teacherId, teacherName);
      res.json(updated);
    } catch (err: any) {
      if (err.message === 'Class not found') {
        return res.status(404).json({ message: err.message });
      }
      next(err);
    }
  });

  // ---------- Subject Assignments (Director) ----------

  app.get("/api/subject-assignments", async (req: Request, res: Response) => {
    const { teacherId, subject, classId } = req.query as { 
      teacherId?: string; 
      subject?: string; 
      classId?: string;
    };
    const assignments = await storage.listSubjectAssignments({ teacherId, subject, classId });
    res.json(assignments);
  });

  app.post("/api/subject-assignments", async (req: Request, res: Response, next) => {
    try {
      const data = insertSubjectAssignmentSchema.parse(req.body);
      const created = await storage.createSubjectAssignment(data);
      res.status(201).json(created);
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ 
          message: 'Validation error', 
          errors: err.errors 
        });
      }
      next(err);
    }
  });

  app.delete("/api/subject-assignments/:id", async (req: Request, res: Response, next) => {
    try {
      const { id } = req.params;
      await storage.deleteSubjectAssignment(id);
      res.status(204).send();
    } catch (err: any) {
      if (err.message === 'Subject assignment not found') {
        return res.status(404).json({ message: err.message });
      }
      next(err);
    }
  });

  // ---------- Timetable (Director) ----------

  app.get("/api/timetable", async (req: Request, res: Response) => {
    const { classId, day, teacherId } = req.query as { 
      classId?: string; 
      day?: string; 
      teacherId?: string;
    };
    const entries = await storage.listTimetableEntries({ classId, day, teacherId });
    res.json(entries);
  });

  app.post("/api/timetable", async (req: Request, res: Response, next) => {
    try {
      const data = insertTimetableEntrySchema.parse(req.body);
      const created = await storage.createTimetableEntry(data);
      res.status(201).json(created);
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ 
          message: 'Validation error', 
          errors: err.errors 
        });
      }
      next(err);
    }
  });

  app.patch("/api/timetable/:id", async (req: Request, res: Response, next) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = await storage.updateTimetableEntry(id, updates);
      res.json(updated);
    } catch (err: any) {
      if (err.message === 'Timetable entry not found') {
        return res.status(404).json({ message: err.message });
      }
      next(err);
    }
  });

  app.delete("/api/timetable/:id", async (req: Request, res: Response, next) => {
    try {
      const { id } = req.params;
      await storage.deleteTimetableEntry(id);
      res.status(204).send();
    } catch (err: any) {
      if (err.message === 'Timetable entry not found') {
        return res.status(404).json({ message: err.message });
      }
      next(err);
    }
  });

  // ---------- Exam Schedule (Director) ----------

  app.get("/api/exam-schedules", async (req: Request, res: Response) => {
    const { classId, subject, examType } = req.query as { 
      classId?: string; 
      subject?: string; 
      examType?: string;
    };
    const schedules = await storage.listExamSchedules({ classId, subject, examType });
    res.json(schedules);
  });

  app.post("/api/exam-schedules", async (req: Request, res: Response, next) => {
    try {
      const data = insertExamScheduleSchema.parse(req.body);
      const created = await storage.createExamSchedule(data);
      res.status(201).json(created);
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ 
          message: 'Validation error', 
          errors: err.errors 
        });
      }
      next(err);
    }
  });

  app.patch("/api/exam-schedules/:id", async (req: Request, res: Response, next) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = await storage.updateExamSchedule(id, updates);
      res.json(updated);
    } catch (err: any) {
      if (err.message === 'Exam schedule not found') {
        return res.status(404).json({ message: err.message });
      }
      next(err);
    }
  });

  app.delete("/api/exam-schedules/:id", async (req: Request, res: Response, next) => {
    try {
      const { id } = req.params;
      await storage.deleteExamSchedule(id);
      res.status(204).send();
    } catch (err: any) {
      if (err.message === 'Exam schedule not found') {
        return res.status(404).json({ message: err.message });
      }
      next(err);
    }
  });

  // ---------- Assignment Submissions (Student) ----------

  app.get("/api/assignment-submissions", async (req: Request, res: Response) => {
    const { studentId, assignmentId, teacherId, subject } = req.query as { studentId?: string; assignmentId?: string; teacherId?: string; subject?: string };
    const subs = await storage.listAssignmentSubmissions({ studentId, assignmentId, teacherId, subject });
    res.json(subs);
  });

  app.post("/api/assignment-submissions", async (req: Request, res: Response, next) => {
    try {
      const data = insertAssignmentSubmissionSchema.parse(req.body);
      const created = await storage.createAssignmentSubmission(data);
      res.status(201).json(created);
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ message: 'Validation error', errors: err.errors });
      }
      next(err);
    }
  });

  return httpServer;
}
