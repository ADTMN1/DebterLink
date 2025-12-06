import { apiClient } from './api';

export interface ExamResult {
  studentName: string;
  score: number;
  grade: string;
}

export const resultsService = {
  getExamResults: async (grade: string, exam: string): Promise<ExamResult[]> => {
    return apiClient.get<ExamResult[]>(`/results?grade=${grade}&exam=${exam}`);
  },

  addExamResult: async (data: { grade: string; exam: string; results: ExamResult[] }): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/results', data);
  },
};
