import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TimetableData = {
  id: string;
  grade: string;
  section: string;
  academicYear: string;
  periods: { id: number; time: string }[];
  schedule: {
    day: string;
    periods: {
      periodId: number;
      time: string;
      subject: string;
      teacherId: string;
      teacherName: string;
    }[];
  }[];
  isPosted: boolean;
  createdAt: string;
  updatedAt: string;
};

type TimetableStore = {
  timetables: TimetableData[];
  addTimetable: (timetable: Omit<TimetableData, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTimetable: (id: string, timetable: Partial<TimetableData>) => void;
  deleteTimetable: (id: string) => void;
  postTimetable: (id: string) => void;
  unpostTimetable: (id: string) => void;
  getPostedTimetables: () => TimetableData[];
  getTimetableByGradeSection: (grade: string, section: string) => TimetableData | undefined;
};

export const useTimetableStore = create<TimetableStore>()(
  persist(
    (set, get) => ({
      timetables: [],
      
      addTimetable: (timetable) => {
        const newTimetable: TimetableData = {
          ...timetable,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ timetables: [...state.timetables, newTimetable] }));
      },
      
      updateTimetable: (id, updates) => {
        set((state) => ({
          timetables: state.timetables.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        }));
      },
      
      deleteTimetable: (id) => {
        set((state) => ({
          timetables: state.timetables.filter((t) => t.id !== id),
        }));
      },
      
      postTimetable: (id) => {
        set((state) => ({
          timetables: state.timetables.map((t) =>
            t.id === id ? { ...t, isPosted: true, updatedAt: new Date().toISOString() } : t
          ),
        }));
      },
      
      unpostTimetable: (id) => {
        set((state) => ({
          timetables: state.timetables.map((t) =>
            t.id === id ? { ...t, isPosted: false, updatedAt: new Date().toISOString() } : t
          ),
        }));
      },
      
      getPostedTimetables: () => {
        return get().timetables.filter((t) => t.isPosted);
      },
      
      getTimetableByGradeSection: (grade, section) => {
        return get().timetables.find(
          (t) => t.grade === grade && t.section === section && t.isPosted
        );
      },
    }),
    {
      name: 'timetable-storage',
    }
  )
);
