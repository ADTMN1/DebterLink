import { View, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ScreenScrollView } from '../components/ScreenScrollView';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius, RoleColors, Colors } from '../constants/theme';
import { Feather } from '@expo/vector-icons';

export default function TeacherDashboardScreen() {
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
        <View style={styles.header}>
          <View style={styles.greeting}>
            <ThemedText style={styles.greetingText}>Good morning,</ThemedText>
            <ThemedText style={styles.nameText}>Teacher {user?.name || 'User'}</ThemedText>
          </View>
          <View style={styles.headerButtons}>
            <Pressable 
              style={styles.notificationButton}
              onPress={() => {
                Alert.alert('Notifications', 'Open notifications (not implemented)');
              }}
            >
              <Feather name="bell" size={22} color={theme.text} />
              <View style={[styles.notificationBadge, { backgroundColor: theme.error }]}>
                <ThemedText style={styles.notificationBadgeText}>3</ThemedText>
              </View>
            </Pressable>
            <Pressable onPress={handleLogout} style={styles.logoutButton}>
              <Feather name="log-out" size={18} color={theme.error} />
            </Pressable>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText style={styles.cardTitle}>Today's Schedule</ThemedText>
          <View style={styles.scheduleItem}>
            <View style={[styles.scheduleTime, { backgroundColor: RoleColors.teacher }]}>
              <ThemedText style={styles.timeText}>8:00 AM</ThemedText>
            </View>
            <View style={styles.scheduleDetails}>
              <ThemedText style={styles.scheduleClass}>Mathematics - Grade 10A</ThemedText>
              <ThemedText style={[styles.scheduleRoom, { color: theme.textSecondary }]}>Room 204</ThemedText>
            </View>
          </View>
          <View style={styles.scheduleItem}>
            <View style={[styles.scheduleTime, { backgroundColor: RoleColors.teacher }]}>
              <ThemedText style={styles.timeText}>10:00 AM</ThemedText>
            </View>
            <View style={styles.scheduleDetails}>
              <ThemedText style={styles.scheduleClass}>Physics - Grade 11B</ThemedText>
              <ThemedText style={[styles.scheduleRoom, { color: theme.textSecondary }]}>Room 308</ThemedText>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText style={styles.cardTitle}>Pending Assignments</ThemedText>
          <View style={styles.statGrid}>
            <View style={[styles.statCard, { backgroundColor: theme.warning + '20' }]}>
              <ThemedText style={styles.statNumber}>12</ThemedText>
              <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>To Grade</ThemedText>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.success + '20' }]}>
              <ThemedText style={styles.statNumber}>8</ThemedText>
              <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>Published</ThemedText>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText style={styles.cardTitle}>Recent Messages</ThemedText>
          <View style={styles.messageItem}>
            <View style={[styles.avatar, { backgroundColor: RoleColors.parent }]}>
              <ThemedText style={styles.avatarText}>AK</ThemedText>
            </View>
            <View style={styles.messageContent}>
              <ThemedText style={styles.messageName}>Almaz Kebede (Parent)</ThemedText>
              <ThemedText style={[styles.messagePreview, { color: theme.textSecondary }]}>
                Regarding student performance...
              </ThemedText>
            </View>
            <View style={[styles.badge, { backgroundColor: RoleColors.teacher }]}>
              <ThemedText style={styles.badgeText}>3</ThemedText>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText style={styles.cardTitle}>Quick Actions</ThemedText>
          <View style={styles.actionGrid}>
            <Pressable
              style={({ pressed }: { pressed: boolean }) => [
                styles.actionButton,
                { backgroundColor: RoleColors.teacher, opacity: pressed ? 0.8 : 1 }
              ]}
              onPress={() => {
                Alert.alert('Take Attendance', 'Opening attendance (not implemented)');
              }}
            >
              <Feather name="check-circle" size={24} color="#FFFFFF" />
              <ThemedText style={styles.actionText}>Take Attendance</ThemedText>
            </Pressable>
            <Pressable
              style={({ pressed }: { pressed: boolean }) => [
                styles.actionButton,
                { backgroundColor: RoleColors.teacher, opacity: pressed ? 0.8 : 1 }
              ]}
              onPress={() => {
                Alert.alert('Create Assignment', 'Taking you to assignment creation (not implemented)');
              }}
            >
              <Feather name="file-text" size={24} color="#FFFFFF" />
              <ThemedText style={styles.actionText}>Create Assignment</ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
    paddingTop: Spacing.xs,
  },
  greeting: {
    flex: 1,
    gap: Spacing.xs,
  },
  greetingText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
    letterSpacing: 0.3,
  },
  nameText: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 32,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EF444415',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
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
    marginTop: Spacing.xs,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    letterSpacing: -0.2,
  },
  scheduleItem: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  scheduleTime: {
    width: 75,
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: RoleColors.teacher,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  scheduleDetails: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
    paddingLeft: Spacing.xs,
  },
  scheduleClass: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  scheduleRoom: {
    fontSize: 13,
    lineHeight: 18,
  },
  statGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    gap: Spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
    paddingTop: Spacing.sm,
  },
  avatar: {
    width: Spacing.avatarMd,
    height: Spacing.avatarMd,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  messageContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  messageName: {
    fontSize: 16,
    fontWeight: '600',
  },
  messagePreview: {
    fontSize: 14,
    lineHeight: 20,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    gap: Spacing.sm,
    shadowColor: RoleColors.teacher,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
