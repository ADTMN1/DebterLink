import { apiClient } from './api';

export interface AttendanceRecord {
  studentName: string;
  status: 'Present' | 'Absent' | 'Late';
  remarks: string;
}

export const attendanceService = {
  getAttendance: async (grade: string, section: string, date: string): Promise<AttendanceRecord[]> => {
    return apiClient.get<AttendanceRecord[]>(`/attendance?grade=${grade}&section=${section}&date=${date}`);
  },

  markAttendance: async (data: { grade: string; section: string; date: string; records: AttendanceRecord[] }): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/attendance', data);
  },
};
