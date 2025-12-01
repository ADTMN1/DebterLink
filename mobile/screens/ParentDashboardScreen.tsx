import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ScreenScrollView } from '../components/ScreenScrollView';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius, RoleColors, Colors } from '../constants/theme';
import { Feather } from '@expo/vector-icons';

export default function ParentDashboardScreen() {
  const themeResult = useTheme();
  const theme = (themeResult && themeResult.theme) ? themeResult.theme : Colors.light;
  const { user, logout } = useAuth();
  const [selectedChild, setSelectedChild] = useState(user?.children?.[0]);

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
            <ThemedText style={styles.appTitle}>ደብተርLink</ThemedText>
            <ThemedText style={[styles.appSubtitle, { color: theme.textSecondary }]}>
              Parent Dashboard
            </ThemedText>
          </View>
          <Pressable onPress={handleLogout} style={styles.logoutButton}>
            <Feather name="log-out" size={18} color={theme.error} />
          </Pressable>
        </View>

        <View style={styles.childSelector}>
          <ThemedText style={styles.selectorLabel}>Viewing:</ThemedText>
          <View style={styles.childButtons}>
            {user?.children?.map((child: { id: string; name: string }) => (
              <Pressable
                key={child.id}
                onPress={() => setSelectedChild(child)}
                style={({ pressed }: { pressed: boolean }) => [
                  styles.childButton,
                  {
                    backgroundColor: selectedChild?.id === child.id ? RoleColors.parent : theme.backgroundDefault,
                    borderColor: selectedChild?.id === child.id ? RoleColors.parent : theme.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <ThemedText style={[
                  styles.childButtonText,
                  { color: selectedChild?.id === child.id ? '#FFFFFF' : theme.text }
                ]}>
                  {child.name}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText style={styles.cardTitle}>Performance Overview</ThemedText>
          <View style={styles.performanceGrid}>
            <View style={[styles.performanceCard, { backgroundColor: RoleColors.parent + '20' }]}>
              <ThemedText style={styles.performanceNumber}>88%</ThemedText>
              <ThemedText style={[styles.performanceLabel, { color: theme.textSecondary }]}>
                Overall Grade
              </ThemedText>
            </View>
            <View style={[styles.performanceCard, { backgroundColor: theme.success + '20' }]}>
              <ThemedText style={styles.performanceNumber}>95%</ThemedText>
              <ThemedText style={[styles.performanceLabel, { color: theme.textSecondary }]}>
                Attendance
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText style={styles.cardTitle}>Recent Activity</ThemedText>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: theme.success }]}>
              <Feather name="check-circle" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.activityContent}>
              <ThemedText style={styles.activityTitle}>Assignment Submitted</ThemedText>
              <ThemedText style={[styles.activityTime, { color: theme.textSecondary }]}>
                Math Homework - 2 hours ago
              </ThemedText>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: RoleColors.parent }]}>
              <Feather name="calendar" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.activityContent}>
              <ThemedText style={styles.activityTitle}>Attendance Marked</ThemedText>
              <ThemedText style={[styles.activityTime, { color: theme.textSecondary }]}>
                Present - Today 8:00 AM
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText style={styles.cardTitle}>Behavior Alerts</ThemedText>
          <View style={[styles.alertCard, { backgroundColor: theme.success + '20' }]}>
            <Feather name="smile" size={24} color={theme.success} />
            <ThemedText style={styles.alertText}>
              Excellent behavior this week! Keep it up.
            </ThemedText>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText style={styles.cardTitle}>Quick Actions</ThemedText>
          <Pressable
            onPress={() => Alert.alert('Message', 'Open message composer (not implemented)')}
            style={({ pressed }: { pressed: boolean }) => [
              styles.actionButton,
              { backgroundColor: RoleColors.parent, opacity: pressed ? 0.8 : 1 }
            ]}
          >
            <Feather name="message-circle" size={20} color="#FFFFFF" />
            <ThemedText style={styles.actionButtonText}>Message Teacher</ThemedText>
            <Feather name="chevron-right" size={20} color="#FFFFFF" />
          </Pressable>
          <Pressable
            onPress={() => Alert.alert('Appeal', 'Open submit appeal screen (not implemented)')}
            style={({ pressed }: { pressed: boolean }) => [
              styles.actionButton,
              { backgroundColor: RoleColors.parent, opacity: pressed ? 0.8 : 1 }
            ]}
          >
            <Feather name="alert-circle" size={20} color="#FFFFFF" />
            <ThemedText style={styles.actionButtonText}>Submit Appeal</ThemedText>
            <Feather name="chevron-right" size={20} color="#FFFFFF" />
          </Pressable>
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
  childSelector: {
    marginBottom: Spacing.md,
    paddingTop: Spacing.sm,
  },
  selectorLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  childButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  childButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  childButtonText: {
    fontSize: 14,
    fontWeight: '700',
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
    gap: Spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  performanceNumber: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  performanceLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  activityContent: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  activityTime: {
    fontSize: 13,
    lineHeight: 18,
  },
  alertCard: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: RoleColors.parent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingTop: Spacing.xs,
  },
  topBarLeft: {
    flex: 1,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  appSubtitle: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: Spacing.xs,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EF444415',
  },
});
