import { apiClient } from './api';

export interface Grade {
  name: string;
  score: number;
  max: number;
  date: string;
}

export interface SubjectGrades {
  assignments: Grade[];
  quizzes: Grade[];
  midterm: { score: number; max: number; date: string } | null;
  final: { score: number; max: number; date: string } | null;
  average: number;
}

export interface GradesData {
  [subject: string]: SubjectGrades;
}

export interface GradesResponse {
  semester1: GradesData;
  semester2: GradesData;
}

export const gradesService = {
  // Get grades for a student
  getStudentGrades: async (studentId: string, year: string): Promise<GradesResponse> => {
    return apiClient.get<GradesResponse>(`/grades/student/${studentId}?year=${year}`);
  },

  // Get grades for parent's children
  getChildGrades: async (childId: string, year: string): Promise<GradesResponse> => {
    return apiClient.get<GradesResponse>(`/grades/child/${childId}?year=${year}`);
  },

  // Get parent's children list
  getParentChildren: async (): Promise<Array<{ id: string; name: string; grade: string }>> => {
    return apiClient.get<Array<{ id: string; name: string; grade: string }>>('/grades/children');
  },
};
