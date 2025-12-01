import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ScreenScrollView } from '../components/ScreenScrollView';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius, RoleColors } from '../constants/theme';
import { Feather } from '@expo/vector-icons';

const ethiopianMonths = [
  'መስከረም', 'ጥቅምት', 'ሕዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት',
  'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜን'
];

const gregorianMonths = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CalendarScreen() {
  const { theme } = useTheme();
  const [selectedCalendar, setSelectedCalendar] = useState<'ethiopian' | 'gregorian'>('ethiopian');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const events = [
    {
      id: '1',
      title: 'Parent-Teacher Meeting',
      date: '15',
      month: 'መስከረም',
      time: '2:00 PM',
      type: 'meeting',
    },
    {
      id: '2',
      title: 'Midterm Exams',
      date: '20',
      month: 'መስከረም',
      time: '9:00 AM',
      type: 'exam',
    },
    {
      id: '3',
      title: 'Sports Day',
      date: '25',
      month: 'ጥቅምት',
      time: '8:00 AM',
      type: 'event',
    },
    {
      id: '4',
      title: 'Science Fair',
      date: '5',
      month: 'ሕዳር',
      time: '10:00 AM',
      type: 'event',
    },
  ];

  const daysOfWeek = selectedCalendar === 'ethiopian'
    ? ['እ', 'ሰ', 'ማ', 'ረ', 'ሐ', 'አ', 'ቅ']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const generateCalendarDays = () => {
    const days = [];
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return RoleColors.teacher;
      case 'exam': return theme.error;
      case 'event': return theme.success;
      default: return theme.info;
    }
  };

  return (
    <ScreenScrollView>
      <View style={styles.container}>
        <View style={styles.calendarSelector}>
          <Pressable
            onPress={() => setSelectedCalendar('ethiopian')}
            style={({ pressed }) => [
              styles.calendarButton,
              {
                backgroundColor: selectedCalendar === 'ethiopian' ? RoleColors.director : theme.backgroundDefault,
                borderColor: selectedCalendar === 'ethiopian' ? RoleColors.director : theme.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <ThemedText style={[
              styles.calendarButtonText,
              { color: selectedCalendar === 'ethiopian' ? '#FFFFFF' : theme.text }
            ]}>
              የኢትዮጵያ ዘመን
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setSelectedCalendar('gregorian')}
            style={({ pressed }) => [
              styles.calendarButton,
              {
                backgroundColor: selectedCalendar === 'gregorian' ? RoleColors.director : theme.backgroundDefault,
                borderColor: selectedCalendar === 'gregorian' ? RoleColors.director : theme.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <ThemedText style={[
              styles.calendarButtonText,
              { color: selectedCalendar === 'gregorian' ? '#FFFFFF' : theme.text }
            ]}>
              Gregorian
            </ThemedText>
          </Pressable>
        </View>

        <View style={[styles.calendarCard, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.calendarHeader}>
            <Pressable
              onPress={() => setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1)}
              style={styles.navButton}
            >
              <Feather name="chevron-left" size={24} color={theme.text} />
            </Pressable>
            <ThemedText style={styles.monthTitle}>
              {selectedCalendar === 'ethiopian'
                ? ethiopianMonths[currentMonth]
                : gregorianMonths[currentMonth]} {currentYear}
            </ThemedText>
            <Pressable
              onPress={() => setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1)}
              style={styles.navButton}
            >
              <Feather name="chevron-right" size={24} color={theme.text} />
            </Pressable>
          </View>

          <View style={styles.weekDaysRow}>
            {daysOfWeek.map((day, index) => (
              <View key={index} style={styles.weekDay}>
                <ThemedText style={[styles.weekDayText, { color: theme.textSecondary }]}>
                  {day}
                </ThemedText>
              </View>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {calendarDays.map((day, index) => {
              const hasEvent = events.some(e => e.date === day?.toString());
              const dayEvents = events.filter(e => e.date === day?.toString());

              return (
                <Pressable
                  key={index}
                  style={({ pressed }) => [
                    styles.calendarDay,
                    {
                      backgroundColor: hasEvent ? RoleColors.director + '15' : 'transparent',
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  {day ? (
                    <>
                      <ThemedText style={[
                        styles.dayNumber,
                        { color: hasEvent ? RoleColors.director : theme.text }
                      ]}>
                        {day}
                      </ThemedText>
                      {hasEvent && (
                        <View style={[styles.eventDot, { backgroundColor: RoleColors.director }]} />
                      )}
                    </>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={[styles.eventsCard, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.eventsHeader}>
            <ThemedText style={styles.eventsTitle}>Upcoming Events</ThemedText>
            <Pressable>
              <ThemedText style={[styles.seeAllText, { color: RoleColors.director }]}>
                See All
              </ThemedText>
            </Pressable>
          </View>

          {events.map((event) => (
            <View key={event.id} style={styles.eventItem}>
              <View style={[styles.eventDateBox, { backgroundColor: getEventTypeColor(event.type) + '20' }]}>
                <ThemedText style={[styles.eventDate, { color: getEventTypeColor(event.type) }]}>
                  {event.date}
                </ThemedText>
                <ThemedText style={[styles.eventMonth, { color: getEventTypeColor(event.type) }]}>
                  {event.month}
                </ThemedText>
              </View>
              <View style={styles.eventContent}>
                <ThemedText style={styles.eventTitle}>{event.title}</ThemedText>
                <View style={styles.eventMeta}>
                  <Feather name="clock" size={14} color={theme.textSecondary} />
                  <ThemedText style={[styles.eventTime, { color: theme.textSecondary }]}>
                    {event.time}
                  </ThemedText>
                </View>
              </View>
              <View style={[styles.eventTypeBadge, { backgroundColor: getEventTypeColor(event.type) + '20' }]}>
                <ThemedText style={[styles.eventTypeText, { color: getEventTypeColor(event.type) }]}>
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
    gap: Spacing.lg,
  },
  calendarSelector: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  calendarButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  calendarButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  calendarCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  navButton: {
    padding: Spacing.sm,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  calendarDay: {
    width: '13%',
    aspectRatio: 1,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  eventDot: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
  },
  eventsCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  eventsTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  eventDateBox: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  eventDate: {
    fontSize: 20,
    fontWeight: '700',
  },
  eventMonth: {
    fontSize: 11,
    fontWeight: '600',
  },
  eventContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  eventTime: {
    fontSize: 13,
  },
  eventTypeBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  eventTypeText: {
    fontSize: 11,
    fontWeight: '700',
  },
});


