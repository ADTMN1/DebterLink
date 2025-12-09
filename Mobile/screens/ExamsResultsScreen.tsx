import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ScreenScrollView } from '../components/ScreenScrollView';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius, RoleColors } from '../constants/theme';
import { Feather } from '@expo/vector-icons';

export default function ExamsResultsScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'results' | 'exams' | 'performance'>('results');

  const results = [
    {
      id: '1',
      subject: 'Mathematics',
      exam: 'Midterm Exam',
      grade: 'A',
      score: 92,
      maxScore: 100,
      date: '2 weeks ago',
      status: 'published',
    },
    {
      id: '2',
      subject: 'Physics',
      exam: 'Midterm Exam',
      grade: 'B+',
      score: 87,
      maxScore: 100,
      date: '2 weeks ago',
      status: 'published',
    },
    {
      id: '3',
      subject: 'Chemistry',
      exam: 'Quiz 3',
      grade: 'A-',
      score: 90,
      maxScore: 100,
      date: '1 week ago',
      status: 'published',
    },
    {
      id: '4',
      subject: 'English',
      exam: 'Essay Assignment',
      grade: 'B',
      score: 82,
      maxScore: 100,
      date: '3 days ago',
      status: 'published',
    },
  ];

  const upcomingExams = [
    {
      id: '1',
      subject: 'Mathematics',
      exam: 'Final Exam',
      date: 'Dec 15, 2024',
      time: '9:00 AM',
      duration: '2 hours',
      room: 'Room 204',
    },
    {
      id: '2',
      subject: 'Physics',
      exam: 'Final Exam',
      date: 'Dec 17, 2024',
      time: '9:00 AM',
      duration: '2 hours',
      room: 'Room 308',
    },
    {
      id: '3',
      subject: 'Chemistry',
      exam: 'Final Exam',
      date: 'Dec 19, 2024',
      time: '9:00 AM',
      duration: '2 hours',
      room: 'Room 204',
    },
  ];

  const performanceData = [
    { subject: 'Math', score: 92, trend: 'up' },
    { subject: 'Physics', score: 87, trend: 'up' },
    { subject: 'Chemistry', score: 90, trend: 'stable' },
    { subject: 'English', score: 82, trend: 'down' },
    { subject: 'Biology', score: 88, trend: 'up' },
  ];

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return theme.success;
    if (grade.startsWith('B')) return RoleColors.student;
    if (grade.startsWith('C')) return theme.warning;
    return theme.error;
  };

  const roleColor = user?.role ? RoleColors[user.role] : theme.info;

  return (
    <ScreenScrollView>
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <Pressable
            onPress={() => setActiveTab('results')}
            style={({ pressed }) => [
              styles.tab,
              {
                backgroundColor: activeTab === 'results' ? roleColor : theme.backgroundDefault,
                borderColor: activeTab === 'results' ? roleColor : theme.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Feather
              name="award"
              size={16}
              color={activeTab === 'results' ? '#FFFFFF' : theme.text}
            />
            <ThemedText style={[
              styles.tabText,
              { color: activeTab === 'results' ? '#FFFFFF' : theme.text }
            ]}>
              Results
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('exams')}
            style={({ pressed }) => [
              styles.tab,
              {
                backgroundColor: activeTab === 'exams' ? roleColor : theme.backgroundDefault,
                borderColor: activeTab === 'exams' ? roleColor : theme.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Feather
              name="calendar"
              size={16}
              color={activeTab === 'exams' ? '#FFFFFF' : theme.text}
            />
            <ThemedText style={[
              styles.tabText,
              { color: activeTab === 'exams' ? '#FFFFFF' : theme.text }
            ]}>
              Upcoming
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('performance')}
            style={({ pressed }) => [
              styles.tab,
              {
                backgroundColor: activeTab === 'performance' ? roleColor : theme.backgroundDefault,
                borderColor: activeTab === 'performance' ? roleColor : theme.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Feather
              name="trending-up"
              size={16}
              color={activeTab === 'performance' ? '#FFFFFF' : theme.text}
            />
            <ThemedText style={[
              styles.tabText,
              { color: activeTab === 'performance' ? '#FFFFFF' : theme.text }
            ]}>
              Performance
            </ThemedText>
          </Pressable>
        </View>

        {activeTab === 'results' && (
          <View style={styles.content}>
            <View style={[styles.summaryCard, { backgroundColor: theme.backgroundDefault }]}>
              <ThemedText style={styles.summaryTitle}>Overall Performance</ThemedText>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <ThemedText style={styles.summaryValue}>87.75%</ThemedText>
                  <ThemedText style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                    Average Score
                  </ThemedText>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <ThemedText style={styles.summaryValue}>B+</ThemedText>
                  <ThemedText style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                    Overall Grade
                  </ThemedText>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <ThemedText style={styles.summaryValue}>4</ThemedText>
                  <ThemedText style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                    Exams Taken
                  </ThemedText>
                </View>
              </View>
            </View>

            {results.map((result) => (
              <View
                key={result.id}
                style={[styles.resultCard, { backgroundColor: theme.backgroundDefault }]}
              >
                <View style={styles.resultHeader}>
                  <View style={[styles.subjectBadge, { backgroundColor: roleColor + '20' }]}>
                    <Feather name="book" size={18} color={roleColor} />
                    <ThemedText style={[styles.subjectText, { color: roleColor }]}>
                      {result.subject}
                    </ThemedText>
                  </View>
                  <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(result.grade) + '20' }]}>
                    <ThemedText style={[styles.gradeText, { color: getGradeColor(result.grade) }]}>
                      {result.grade}
                    </ThemedText>
                  </View>
                </View>

                <ThemedText style={styles.examName}>{result.exam}</ThemedText>

                <View style={styles.scoreContainer}>
                  <View style={styles.scoreBar}>
                    <View style={[
                      styles.scoreFill,
                      {
                        width: `${result.score}%`,
                        backgroundColor: getGradeColor(result.grade),
                      },
                    ]} />
                  </View>
                  <View style={styles.scoreTextRow}>
                    <ThemedText style={[styles.scoreText, { color: getGradeColor(result.grade) }]}>
                      {result.score} / {result.maxScore}
                    </ThemedText>
                    <ThemedText style={[styles.scorePercent, { color: theme.textSecondary }]}>
                      {result.score}%
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.resultFooter}>
                  <View style={styles.footerItem}>
                    <Feather name="calendar" size={14} color={theme.textSecondary} />
                    <ThemedText style={[styles.footerText, { color: theme.textSecondary }]}>
                      {result.date}
                    </ThemedText>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: theme.success + '20' }]}>
                    <Feather name="check-circle" size={12} color={theme.success} />
                    <ThemedText style={[styles.statusText, { color: theme.success }]}>
                      Published
                    </ThemedText>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'exams' && (
          <View style={styles.content}>
            {upcomingExams.map((exam) => (
              <View
                key={exam.id}
                style={[styles.examCard, { backgroundColor: theme.backgroundDefault }]}
              >
                <View style={styles.examHeader}>
                  <View style={[styles.examSubjectBadge, { backgroundColor: roleColor }]}>
                    <Feather name="file-text" size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.examInfo}>
                    <ThemedText style={styles.examSubject}>{exam.subject}</ThemedText>
                    <ThemedText style={[styles.examType, { color: theme.textSecondary }]}>
                      {exam.exam}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.examDetails}>
                  <View style={styles.examDetailItem}>
                    <Feather name="calendar" size={16} color={theme.textSecondary} />
                    <ThemedText style={[styles.examDetailText, { color: theme.textSecondary }]}>
                      {exam.date}
                    </ThemedText>
                  </View>
                  <View style={styles.examDetailItem}>
                    <Feather name="clock" size={16} color={theme.textSecondary} />
                    <ThemedText style={[styles.examDetailText, { color: theme.textSecondary }]}>
                      {exam.time} • {exam.duration}
                    </ThemedText>
                  </View>
                  <View style={styles.examDetailItem}>
                    <Feather name="map-pin" size={16} color={theme.textSecondary} />
                    <ThemedText style={[styles.examDetailText, { color: theme.textSecondary }]}>
                      {exam.room}
                    </ThemedText>
                  </View>
                </View>

                <Pressable style={({ pressed }) => [
                  styles.examButton,
                  {
                    backgroundColor: roleColor,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}>
                  <Feather name="book-open" size={16} color="#FFFFFF" />
                  <ThemedText style={styles.examButtonText}>View Study Materials</ThemedText>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'performance' && (
          <View style={styles.content}>
            <View style={[styles.performanceCard, { backgroundColor: theme.backgroundDefault }]}>
              <ThemedText style={styles.performanceTitle}>Subject Performance Chart</ThemedText>
              <View style={styles.chartContainer}>
                {performanceData.map((item, index) => (
                  <View key={index} style={styles.chartItem}>
                    <View style={styles.chartBarContainer}>
                      <View style={[
                        styles.chartBar,
                        {
                          height: `${item.score}%`,
                          backgroundColor: item.trend === 'up' ? theme.success :
                            item.trend === 'down' ? theme.error : theme.warning,
                        },
                      ]} />
                    </View>
                    <ThemedText style={[styles.chartLabel, { color: theme.textSecondary }]}>
                      {item.subject}
                    </ThemedText>
                    <ThemedText style={styles.chartScore}>{item.score}%</ThemedText>
                    <Feather
                      name={item.trend === 'up' ? 'trending-up' : item.trend === 'down' ? 'trending-down' : 'minus'}
                      size={14}
                      color={item.trend === 'up' ? theme.success : item.trend === 'down' ? theme.error : theme.warning}
                    />
                  </View>
                ))}
              </View>
            </View>

            <View style={[styles.trendCard, { backgroundColor: theme.backgroundDefault }]}>
              <ThemedText style={styles.trendTitle}>Performance Trends</ThemedText>
              {performanceData.map((item, index) => (
                <View key={index} style={styles.trendItem}>
                  <View style={styles.trendInfo}>
                    <ThemedText style={styles.trendSubject}>{item.subject}</ThemedText>
                    <ThemedText style={[styles.trendScore, { color: theme.textSecondary }]}>
                      {item.score}%
                    </ThemedText>
                  </View>
                  <View style={[
                    styles.trendBadge,
                    {
                      backgroundColor: item.trend === 'up' ? theme.success + '20' :
                        item.trend === 'down' ? theme.error + '20' : theme.warning + '20',
                    },
                  ]}>
                    <Feather
                      name={item.trend === 'up' ? 'trending-up' : item.trend === 'down' ? 'trending-down' : 'minus'}
                      size={14}
                      color={item.trend === 'up' ? theme.success : item.trend === 'down' ? theme.error : theme.warning}
                    />
                    <ThemedText style={[
                      styles.trendText,
                      {
                        color: item.trend === 'up' ? theme.success :
                          item.trend === 'down' ? theme.error : theme.warning,
                      },
                    ]}>
                      {item.trend.charAt(0).toUpperCase() + item.trend.slice(1)}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
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
  tabContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    gap: Spacing.md,
  },
  summaryCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  resultCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  subjectText: {
    fontSize: 13,
    fontWeight: '700',
  },
  gradeBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    minWidth: 50,
    alignItems: 'center',
  },
  gradeText: {
    fontSize: 18,
    fontWeight: '700',
  },
  examName: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  scoreContainer: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  scoreBar: {
    height: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  scoreTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '700',
  },
  scorePercent: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  footerText: {
    fontSize: 13,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  examCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  examHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  examSubjectBadge: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  examInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  examSubject: {
    fontSize: 18,
    fontWeight: '700',
  },
  examType: {
    fontSize: 14,
  },
  examDetails: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  examDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  examDetailText: {
    fontSize: 14,
  },
  examButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  examButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  performanceCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  performanceTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
    gap: Spacing.sm,
  },
  chartItem: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  chartBarContainer: {
    width: '100%',
    height: 150,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  chartBar: {
    width: '80%',
    borderRadius: BorderRadius.md,
    minHeight: 20,
  },
  chartLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  chartScore: {
    fontSize: 12,
    fontWeight: '700',
  },
  trendCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  trendTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  trendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  trendInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  trendSubject: {
    fontSize: 16,
    fontWeight: '600',
  },
  trendScore: {
    fontSize: 14,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '700',
  },
});


