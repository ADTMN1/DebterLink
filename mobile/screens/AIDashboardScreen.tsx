import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ScreenScrollView } from '../components/ScreenScrollView';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius, RoleColors } from '../constants/theme';
import { Feather } from '@expo/vector-icons';

export default function AIDashboardScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'risk' | 'advice'>('risk');

  const atRiskStudents = [
    {
      id: '1',
      name: 'Dawit Tadesse',
      riskLevel: 'high',
      riskScore: 85,
      factors: ['Low attendance', 'Declining grades', 'Missing assignments'],
      trend: 'increasing',
    },
    {
      id: '2',
      name: 'Sara Hailu',
      riskLevel: 'medium',
      riskScore: 62,
      factors: ['Late submissions', 'Low participation'],
      trend: 'stable',
    },
    {
      id: '3',
      name: 'Yohannes Girma',
      riskLevel: 'low',
      riskScore: 25,
      factors: ['Occasional absences'],
      trend: 'decreasing',
    },
  ];

  const parentAdvice = [
    {
      id: '1',
      category: 'Academic Performance',
      title: 'Support Math Learning at Home',
      description: 'Your child shows interest in mathematics. Consider providing additional practice problems and celebrating small achievements.',
      priority: 'high',
      actionItems: [
        'Review homework together 3 times per week',
        'Use educational apps for practice',
        'Schedule regular check-ins with teacher',
      ],
    },
    {
      id: '2',
      category: 'Attendance',
      title: 'Improve Punctuality',
      description: 'Regular attendance is crucial. Help establish a morning routine to ensure timely arrival.',
      priority: 'medium',
      actionItems: [
        'Set consistent bedtime',
        'Prepare school materials the night before',
        'Leave home 15 minutes earlier',
      ],
    },
    {
      id: '3',
      category: 'Social Development',
      title: 'Encourage Peer Interaction',
      description: 'Your child benefits from group activities. Encourage participation in school clubs and group projects.',
      priority: 'low',
      actionItems: [
        'Discuss school friendships',
        'Attend school events together',
        'Support extracurricular activities',
      ],
    },
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return theme.error;
      case 'medium': return theme.warning;
      case 'low': return theme.success;
      default: return theme.info;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return theme.error;
      case 'medium': return theme.warning;
      case 'low': return theme.success;
      default: return theme.info;
    }
  };

  const roleColor = user?.role ? RoleColors[user.role] : theme.info;

  return (
    <ScreenScrollView>
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <Pressable
            onPress={() => setActiveView('risk')}
            style={({ pressed }) => [
              styles.tab,
              {
                backgroundColor: activeView === 'risk' ? roleColor : theme.backgroundDefault,
                borderColor: activeView === 'risk' ? roleColor : theme.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Feather
              name="alert-triangle"
              size={18}
              color={activeView === 'risk' ? '#FFFFFF' : theme.text}
            />
            <ThemedText style={[
              styles.tabText,
              { color: activeView === 'risk' ? '#FFFFFF' : theme.text }
            ]}>
              Risk Analysis
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setActiveView('advice')}
            style={({ pressed }) => [
              styles.tab,
              {
                backgroundColor: activeView === 'advice' ? roleColor : theme.backgroundDefault,
                borderColor: activeView === 'advice' ? roleColor : theme.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Feather
              /* name typing varies by icon lib versions — cast safely to avoid type errors */
              name={"lightbulb" as any}
              size={18}
              color={activeView === 'advice' ? '#FFFFFF' : theme.text}
            />
            <ThemedText style={[
              styles.tabText,
              { color: activeView === 'advice' ? '#FFFFFF' : theme.text }
            ]}>
              Parent Advice
            </ThemedText>
          </Pressable>
        </View>

        {activeView === 'risk' && (
          <View style={styles.content}>
            <View style={[styles.summaryCard, { backgroundColor: theme.backgroundDefault }]}>
              <ThemedText style={styles.summaryTitle}>At-Risk Students Overview</ThemedText>
              <View style={styles.summaryStats}>
                <View style={[styles.summaryStat, { backgroundColor: theme.error + '20' }]}>
                  <ThemedText style={[styles.summaryNumber, { color: theme.error }]}>3</ThemedText>
                  <ThemedText style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                    High Risk
                  </ThemedText>
                </View>
                <View style={[styles.summaryStat, { backgroundColor: theme.warning + '20' }]}>
                  <ThemedText style={[styles.summaryNumber, { color: theme.warning }]}>5</ThemedText>
                  <ThemedText style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                    Medium Risk
                  </ThemedText>
                </View>
                <View style={[styles.summaryStat, { backgroundColor: theme.success + '20' }]}>
                  <ThemedText style={[styles.summaryNumber, { color: theme.success }]}>42</ThemedText>
                  <ThemedText style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                    Low Risk
                  </ThemedText>
                </View>
              </View>
            </View>

            {atRiskStudents.map((student) => (
              <View
                key={student.id}
                style={[styles.riskCard, { backgroundColor: theme.backgroundDefault }]}
              >
                <View style={styles.riskHeader}>
                  <View style={[styles.studentAvatar, { backgroundColor: getRiskColor(student.riskLevel) }]}>
                    <ThemedText style={styles.avatarText}>
                      {student.name.split(' ').map((n) => n[0]).join('')}
                    </ThemedText>
                  </View>
                  <View style={styles.studentInfo}>
                    <ThemedText style={styles.studentName}>{student.name}</ThemedText>
                    <View style={styles.riskBadgeRow}>
                      <View style={[
                        styles.riskBadge,
                        { backgroundColor: getRiskColor(student.riskLevel) + '20' }
                      ]}>
                        <ThemedText style={[
                          styles.riskBadgeText,
                          { color: getRiskColor(student.riskLevel) }
                        ]}>
                          {student.riskLevel.toUpperCase()} RISK
                        </ThemedText>
                      </View>
                      <View style={styles.trendBadge}>
                        <Feather
                          name={student.trend === 'increasing' ? 'trending-up' : student.trend === 'decreasing' ? 'trending-down' : 'minus'}
                          size={14}
                          color={student.trend === 'increasing' ? theme.error : student.trend === 'decreasing' ? theme.success : theme.warning}
                        />
                        <ThemedText style={[
                          styles.trendText,
                          {
                            color: student.trend === 'increasing' ? theme.error :
                              student.trend === 'decreasing' ? theme.success : theme.warning
                          }
                        ]}>
                          {student.trend.charAt(0).toUpperCase() + student.trend.slice(1)}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.riskScoreContainer}>
                  <ThemedText style={[styles.riskScoreLabel, { color: theme.textSecondary }]}>
                    Risk Score
                  </ThemedText>
                  <View style={styles.riskScoreBar}>
                    <View style={[
                      styles.riskScoreFill,
                      {
                        width: `${student.riskScore}%`,
                        backgroundColor: getRiskColor(student.riskLevel),
                      },
                    ]} />
                  </View>
                  <ThemedText style={[styles.riskScoreValue, { color: getRiskColor(student.riskLevel) }]}>
                    {student.riskScore}%
                  </ThemedText>
                </View>

                <View style={styles.factorsContainer}>
                  <ThemedText style={[styles.factorsTitle, { color: theme.textSecondary }]}>
                    Risk Factors:
                  </ThemedText>
                  {student.factors.map((factor, index) => (
                    <View key={index} style={styles.factorItem}>
                      <Feather name="alert-circle" size={14} color={getRiskColor(student.riskLevel)} />
                      <ThemedText style={styles.factorText}>{factor}</ThemedText>
                    </View>
                  ))}
                </View>

                <Pressable style={({ pressed }) => [
                  styles.actionButton,
                  {
                    backgroundColor: getRiskColor(student.riskLevel),
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}>
                  <Feather name="eye" size={16} color="#FFFFFF" />
                  <ThemedText style={styles.actionButtonText}>View Intervention Plan</ThemedText>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {activeView === 'advice' && (
          <View style={styles.content}>
            {parentAdvice.map((advice) => (
              <View
                key={advice.id}
                style={[styles.adviceCard, { backgroundColor: theme.backgroundDefault }]}
              >
                <View style={styles.adviceHeader}>
                  <View style={[styles.categoryBadge, { backgroundColor: getPriorityColor(advice.priority) + '20' }]}>
                    <ThemedText style={[styles.categoryText, { color: getPriorityColor(advice.priority) }]}>
                      {advice.category}
                    </ThemedText>
                  </View>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(advice.priority) + '20' }]}>
                    <ThemedText style={[styles.priorityText, { color: getPriorityColor(advice.priority) }]}>
                      {advice.priority.toUpperCase()} PRIORITY
                    </ThemedText>
                  </View>
                </View>

                <ThemedText style={styles.adviceTitle}>{advice.title}</ThemedText>
                <ThemedText style={[styles.adviceDescription, { color: theme.textSecondary }]}>
                  {advice.description}
                </ThemedText>

                <View style={styles.actionItemsContainer}>
                  <ThemedText style={[styles.actionItemsTitle, { color: theme.textSecondary }]}>
                    Recommended Actions:
                  </ThemedText>
                  {advice.actionItems.map((item, index) => (
                    <View key={index} style={styles.actionItem}>
                      <View style={[styles.actionItemIcon, { backgroundColor: getPriorityColor(advice.priority) + '20' }]}>
                        <Feather name="check" size={14} color={getPriorityColor(advice.priority)} />
                      </View>
                      <ThemedText style={styles.actionItemText}>{item}</ThemedText>
                    </View>
                  ))}
                </View>

                <Pressable style={({ pressed }) => [
                  styles.adviceButton,
                  {
                    backgroundColor: getPriorityColor(advice.priority),
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}>
                  <Feather name="book-open" size={16} color="#FFFFFF" />
                  <ThemedText style={styles.adviceButtonText}>Learn More</ThemedText>
                </Pressable>
              </View>
            ))}
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
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
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
  summaryStats: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  summaryStat: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: '700',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  riskCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  studentAvatar: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  studentInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '700',
  },
  riskBadgeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  riskBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  riskBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
  },
  riskScoreContainer: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  riskScoreLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  riskScoreBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  riskScoreFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  riskScoreValue: {
    fontSize: 14,
    fontWeight: '700',
    alignSelf: 'flex-end',
  },
  factorsContainer: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  factorsTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  factorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  factorText: {
    fontSize: 14,
    flex: 1,
  },
  actionButton: {
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
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  adviceCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  adviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
  },
  priorityBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  adviceTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  adviceDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: Spacing.xs,
  },
  actionItemsContainer: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  actionItemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  actionItemIcon: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionItemText: {
    fontSize: 14,
    flex: 1,
  },
  adviceButton: {
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
  adviceButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});


