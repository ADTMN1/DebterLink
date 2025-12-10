import { View, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ScreenScrollView } from '../components/ScreenScrollView';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius, RoleColors, Colors } from '../constants/theme';
import { Feather } from '@expo/vector-icons';

export default function StudentDashboardScreen() {
  const themeResult = useTheme();
  const theme = (themeResult && themeResult.theme) ? themeResult.theme : Colors.light;
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout().catch((error) => {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScreenScrollView>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <ThemedText style={styles.greetingText}>Welcome back,</ThemedText>
            <ThemedText style={styles.nameText}>{user?.name}</ThemedText>
          </View>
          <Pressable onPress={handleLogout} style={styles.logoutButton}>
            <Feather name="log-out" size={18} color={theme.error} />
          </Pressable>
        </View>

        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText style={styles.cardTitle}>Performance Overview</ThemedText>
          <View style={styles.performanceGrid}>
            <View style={[styles.performanceCard, { backgroundColor: RoleColors.student + '20' }]}>
              <Feather name="trending-up" size={24} color={RoleColors.student} />
              <ThemedText style={styles.performanceNumber}>85%</ThemedText>
              <ThemedText style={[styles.performanceLabel, { color: theme.textSecondary }]}>
                Overall Grade
              </ThemedText>
            </View>
            <View style={[styles.performanceCard, { backgroundColor: theme.success + '20' }]}>
              <Feather name="check-circle" size={24} color={theme.success} />
              <ThemedText style={styles.performanceNumber}>92%</ThemedText>
              <ThemedText style={[styles.performanceLabel, { color: theme.textSecondary }]}>
                Attendance
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText style={styles.cardTitle}>Upcoming Assignments</ThemedText>
          <View style={styles.assignmentItem}>
            <View style={[styles.assignmentIcon, { backgroundColor: RoleColors.student }]}>
              <Feather name="file-text" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.assignmentContent}>
              <ThemedText style={styles.assignmentTitle}>Math Homework - Chapter 5</ThemedText>
              <View style={styles.assignmentMeta}>
                <Feather name="clock" size={14} color={theme.warning} />
                <ThemedText style={[styles.assignmentDue, { color: theme.warning }]}>
                  Due in 2 days
                </ThemedText>
              </View>
            </View>
          </View>
          <View style={styles.assignmentItem}>
            <View style={[styles.assignmentIcon, { backgroundColor: RoleColors.student }]}>
              <Feather name="file-text" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.assignmentContent}>
              <ThemedText style={styles.assignmentTitle}>Physics Lab Report</ThemedText>
              <View style={styles.assignmentMeta}>
                <Feather name="clock" size={14} color={theme.textSecondary} />
                <ThemedText style={[styles.assignmentDue, { color: theme.textSecondary }]}>
                  Due in 5 days
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText style={styles.cardTitle}>Latest Grades</ThemedText>
          <View style={styles.gradeItem}>
            <View style={styles.gradeSubject}>
              <ThemedText style={styles.gradeSubjectName}>Mathematics</ThemedText>
              <ThemedText style={[styles.gradeDate, { color: theme.textSecondary }]}>
                Yesterday
              </ThemedText>
            </View>
            <View style={[styles.gradeScore, { backgroundColor: theme.success + '20' }]}>
              <ThemedText style={[styles.gradeScoreText, { color: theme.success }]}>A</ThemedText>
            </View>
          </View>
          <View style={styles.gradeItem}>
            <View style={styles.gradeSubject}>
              <ThemedText style={styles.gradeSubjectName}>Physics</ThemedText>
              <ThemedText style={[styles.gradeDate, { color: theme.textSecondary }]}>
                2 days ago
              </ThemedText>
            </View>
            <View style={[styles.gradeScore, { backgroundColor: RoleColors.student + '20' }]}>
              <ThemedText style={[styles.gradeScoreText, { color: RoleColors.student }]}>B+</ThemedText>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText style={styles.cardTitle}>Resources</ThemedText>
          <View style={styles.resourceGrid}>
            {['Notes', 'Past Papers', 'Videos'].map((resource) => (
              <View key={resource} style={[styles.resourceCard, { backgroundColor: RoleColors.student }]}>
                <Feather name="book" size={24} color="#FFFFFF" />
                <ThemedText style={styles.resourceText}>{resource}</ThemedText>
              </View>
            ))}
          </View>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingTop: Spacing.sm,
  },
  topBarLeft: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: Spacing.xs,
  },
  nameText: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EF444415',
  },
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing.xs,
    letterSpacing: -0.3,
  },
  performanceGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  performanceCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  performanceNumber: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  performanceLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  assignmentItem: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  assignmentIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: RoleColors.student,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  assignmentContent: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  assignmentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  assignmentDue: {
    fontSize: 13,
    fontWeight: '500',
  },
  gradeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  gradeSubject: {
    flex: 1,
    gap: Spacing.xs,
  },
  gradeSubjectName: {
    fontSize: 16,
    fontWeight: '600',
  },
  gradeDate: {
    fontSize: 13,
  },
  gradeScore: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    minWidth: 60,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  gradeScoreText: {
    fontSize: 18,
    fontWeight: '700',
  },
  resourceGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resourceCard: {
    flex: 1,
    minWidth: 88,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    gap: Spacing.sm,
    shadowColor: RoleColors.student,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  resourceText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
