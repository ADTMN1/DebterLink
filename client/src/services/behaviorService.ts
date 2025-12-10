import { apiClient } from './api';

export interface BehaviorIncident {
  studentName: string;
  incidentType: string;
  date: string;
  remarks: string;
}

export const behaviorService = {
  getBehaviorIncidents: async (grade: string, section: string, startDate: string, endDate: string): Promise<BehaviorIncident[]> => {
    return apiClient.get<BehaviorIncident[]>(`/behavior?grade=${grade}&section=${section}&startDate=${startDate}&endDate=${endDate}`);
  },

  addBehaviorIncident: async (data: BehaviorIncident): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/behavior', data);
  },
};
