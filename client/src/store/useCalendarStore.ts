import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CalendarEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  type: 'holiday' | 'exam' | 'event' | 'meeting' | 'other';
  isPosted: boolean;
  createdAt: string;
  updatedAt: string;
};

type CalendarStore = {
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  postEvent: (id: string) => void;
  unpostEvent: (id: string) => void;
  getPostedEvents: () => CalendarEvent[];
};

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set, get) => ({
      events: [],
      
      addEvent: (event) => {
        const newEvent: CalendarEvent = {
          ...event,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ events: [...state.events, newEvent] }));
      },
      
      updateEvent: (id, updates) => {
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
          ),
        }));
      },
      
      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        }));
      },
      
      postEvent: (id) => {
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, isPosted: true, updatedAt: new Date().toISOString() } : e
          ),
        }));
      },
      
      unpostEvent: (id) => {
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, isPosted: false, updatedAt: new Date().toISOString() } : e
          ),
        }));
      },
      
      getPostedEvents: () => {
        return get().events.filter((e) => e.isPosted);
      },
    }),
    {
      name: 'calendar-storage',
    }
  )
);
