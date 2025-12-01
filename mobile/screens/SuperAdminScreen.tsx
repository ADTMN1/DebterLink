import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { ScreenScrollView } from '../components/ScreenScrollView';
import { ThemedText } from '../components/ThemedText';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthContext';
import { Feather } from '@expo/vector-icons';
import { BorderRadius, RoleColors, Spacing, Colors } from '../constants/theme';

const networkSnapshots = [
  { label: 'Schools Online', value: '42', trend: '+5 today', icon: 'wifi' },
  { label: 'Pending Requests', value: '18', trend: 'New onboarding', icon: 'clipboard' },
  { label: 'Incident Alerts', value: '6', trend: '3 critical', icon: 'alert-triangle' },
];

const governanceActions = [
  { label: 'Approve School', icon: 'check-circle', color: RoleColors.superAdmin },
  { label: 'Assign Director', icon: 'user-plus', color: RoleColors.director },
  { label: 'Dispatch Notice', icon: 'send', color: RoleColors.teacher },
];

export default function SuperAdminScreen() {
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
            <ThemedText style={styles.appTitle}>ደብተርLink</ThemedText>
            <ThemedText style={[styles.appSubtitle, { color: theme.textSecondary }]}>
              National Command
            </ThemedText>
          </View>
          <Pressable onPress={handleLogout} style={styles.logoutButton}>
            <Feather name="log-out" size={18} color={theme.error} />
          </Pressable>
        </View>

        <View style={[styles.hero, { backgroundColor: RoleColors.superAdmin + '12', borderColor: RoleColors.superAdmin + '33' }]}>
          <View style={styles.heroHeader}>
            <View style={styles.heroHeaderLeft}>
              <ThemedText style={styles.heroEyebrow}>National Control Room</ThemedText>
              <ThemedText style={styles.heroTitle}>
                Hello {user?.name || 'Leader'}
              </ThemedText>
            </View>
            <View style={[styles.badge, { backgroundColor: RoleColors.superAdmin }]}>
              <Feather name="shield" size={18} color="#FFFFFF" />
            </View>
          </View>
          <ThemedText style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
            Live visibility across every school cluster with smart escalations and readiness scores.
          </ThemedText>
          <View style={styles.heroMetrics}>
            <View style={styles.heroMetric}>
              <ThemedText style={styles.metricValue}>128</ThemedText>
              <ThemedText style={[styles.metricLabel, { color: theme.textSecondary }]}>Active Schools</ThemedText>
            </View>
            <View style={styles.divider} />
            <View style={styles.heroMetric}>
              <ThemedText style={styles.metricValue}>12.4K</ThemedText>
              <ThemedText style={[styles.metricLabel, { color: theme.textSecondary }]}>Learners</ThemedText>
            </View>
            <View style={styles.divider} />
            <View style={styles.heroMetric}>
              <ThemedText style={styles.metricValue}>98%</ThemedText>
              <ThemedText style={[styles.metricLabel, { color: theme.textSecondary }]}>Uptime</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.snapshotsRow}>
          {networkSnapshots.map((item) => (
            <View key={item.label} style={[styles.snapshotCard, { backgroundColor: theme.backgroundDefault }]}>
              <View style={[styles.snapshotIcon, { backgroundColor: RoleColors.superAdmin + '22' }]}>
                <Feather name={item.icon as any} size={18} color={RoleColors.superAdmin} />
              </View>
              <ThemedText style={styles.snapshotValue}>{item.value}</ThemedText>
              <ThemedText style={styles.snapshotLabel}>{item.label}</ThemedText>
              <ThemedText style={[styles.snapshotTrend, { color: theme.textSecondary }]}>
                {item.trend}
              </ThemedText>
            </View>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.cardTitle}>Network Health Map</ThemedText>
            <Pressable onPress={() => Alert.alert('View All', 'Show all network regions')} style={styles.linkRow}>
              <ThemedText style={[styles.linkText, { color: RoleColors.superAdmin }]}>View All</ThemedText>
              <Feather name="chevron-right" size={16} color={RoleColors.superAdmin} />
            </Pressable>
          </View>
          <View style={styles.healthGrid}>
            {['Addis Ababa', 'Oromia', 'Amhara', 'SNNPR'].map((region, index) => (
              <View key={region} style={[styles.healthCard, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary }]}>
                <View style={styles.healthHeader}>
                  <ThemedText style={styles.healthRegion}>{region}</ThemedText>
                  <View style={[
                    styles.statusPill,
                    { backgroundColor: index % 2 === 0 ? theme.success + '22' : theme.warning + '22' }
                  ]}>
                    <Feather
                      name={index % 2 === 0 ? 'trending-up' : 'alert-circle'}
                      size={12}
                      color={index % 2 === 0 ? theme.success : theme.warning}
                    />
                    <ThemedText style={[
                      styles.statusText,
                      { color: index % 2 === 0 ? theme.success : theme.warning }
                    ]}>
                      {index % 2 === 0 ? 'Stable' : 'Needs Support'}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={[styles.healthMetric, { color: theme.textSecondary }]}>
                  ATTENDANCE PULSE
                </ThemedText>
                <ThemedText style={styles.healthValue}>
                  {index % 2 === 0 ? '94%' : '78%'}
                </ThemedText>
                <View style={styles.sparkline}>
                  {[12, 30, 18, 40, 24].map((height, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.sparklineBar,
                        {
                          height: height * 0.8,
                          backgroundColor: idx === 4 ? RoleColors.superAdmin : theme.backgroundTertiary,
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionsRow}>
          {governanceActions.map((action) => (
            <Pressable key={action.label} onPress={() => Alert.alert(action.label)} style={({ pressed }) => [
              styles.actionCard,
              {
                backgroundColor: theme.backgroundDefault,
                borderColor: action.color + '55',
                opacity: pressed ? 0.8 : 1,
              },
            ]}>
              <View style={[styles.actionIcon, { backgroundColor: action.color + '22' }]}>
                <Feather name={action.icon as any} size={18} color={action.color} />
              </View>
              <ThemedText style={styles.actionLabel}>{action.label}</ThemedText>
              <ThemedText style={[styles.actionHint, { color: theme.textSecondary }]}>
                Tap to initiate
              </ThemedText>
            </Pressable>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.cardTitle}>Escalations Queue</ThemedText>
            <View style={[styles.badge, { backgroundColor: theme.error }]}>
              <ThemedText style={styles.badgeText}>4</ThemedText>
            </View>
          </View>
          {[
            { school: 'Selam Academy', issue: 'Connectivity outage', severity: 'Critical' },
            { school: 'Unity School', issue: 'Attendance dip', severity: 'High' },
            { school: 'Ethio STEM', issue: 'Behavior spike', severity: 'Medium' },
          ].map((item) => (
            <View key={item.school} style={styles.escalationRow}>
              <View style={styles.escalationMeta}>
                <ThemedText style={styles.escalationSchool}>{item.school}</ThemedText>
                <ThemedText style={[styles.escalationIssue, { color: theme.textSecondary }]}>
                  {item.issue}
                </ThemedText>
              </View>
              <View style={[
                styles.severityChip,
                {
                  borderColor:
                    item.severity === 'Critical'
                      ? theme.error
                      : item.severity === 'High'
                        ? theme.warning
                        : RoleColors.superAdmin,
                },
              ]}>
                <ThemedText style={[
                  styles.severityText,
                  {
                    color:
                      item.severity === 'Critical'
                        ? theme.error
                        : item.severity === 'High'
                          ? theme.warning
                          : RoleColors.superAdmin,
                  },
                ]}>
                  {item.severity}
                </ThemedText>
              </View>
              <Feather name="chevron-right" size={18} color={theme.textTertiary} />
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
    paddingTop: Spacing.sm,
    gap: Spacing.md,
    paddingBottom: Spacing.xxl,
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
    gap: Spacing.xs,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  appSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  hero: {
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginTop: Spacing.xs,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  heroHeaderLeft: {
    flex: 1,
    gap: Spacing.xs,
  },
  heroEyebrow: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '600',
    color: '#0F172A',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 30,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: Spacing.xs,
  },
  heroMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F033',
  },
  heroMetric: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: Spacing.xs,
  },
  metricLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: '#E2E8F0',
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  snapshotsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  snapshotCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 100,
  },
  snapshotIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  snapshotValue: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: Spacing.xs,
  },
  snapshotLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  snapshotTrend: {
    fontSize: 11,
    fontWeight: '500',
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
  },
  healthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  healthCard: {
    /* Use flexBasis + grow/shrink to make a reliable 2-column responsive layout
       across screen sizes. Using percentages for width alone can cause items to
       collapse to a single column on some narrow devices. */
    flexBasis: '48%',
    flexGrow: 0,
    flexShrink: 0,
    minWidth: 140,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    padding: Spacing.md,
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  healthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  healthRegion: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  healthMetric: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  healthValue: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginTop: Spacing.xs,
  },
  sparkline: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 32,
    marginTop: Spacing.xs,
  },
  sparklineBar: {
    width: 6,
    borderRadius: BorderRadius.sm,
    minHeight: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  actionCard: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 100,
    marginBottom: Spacing.md,
    alignSelf: 'flex-start',
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  actionHint: {
    fontSize: 11,
    fontWeight: '500',
  },
  escalationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB33',
  },
  escalationMeta: {
    flex: 1,
    gap: Spacing.xs,
  },
  escalationSchool: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  escalationIssue: {
    fontSize: 13,
    lineHeight: 18,
  },
  severityChip: {
    borderWidth: 1,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  escalationQueue: {
    gap: Spacing.sm,
  },
});

