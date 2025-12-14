import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ScreenScrollView } from '../components/ScreenScrollView';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthContext';
import { Spacing, BorderRadius, RoleColors } from '../constants/theme';
import { Feather } from '@expo/vector-icons';

interface Student {
  id: string;
  name: string;
  status: 'present' | 'absent' | 'late';
}

export default function AttendanceScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [date] = useState(new Date().toLocaleDateString());
  const [isOffline, setIsOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Abebe Bekele', status: 'present' },
    { id: '2', name: 'Tigist Alemu', status: 'present' },
    { id: '3', name: 'Dawit Tadesse', status: 'absent' },
    { id: '4', name: 'Sara Hailu', status: 'late' },
    { id: '5', name: 'Yohannes Girma', status: 'present' },
  ]);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setIsOffline(false);
    }, 2000);
  };

  const toggleStatus = (id: string) => {
    setStudents(students.map((student: Student) => {
      if (student.id === id) {
        const statuses: Array<'present' | 'absent' | 'late'> = ['present', 'absent', 'late'];
        const currentIndex = statuses.indexOf(student.status);
        const nextStatus = statuses[(currentIndex + 1) % statuses.length];
        return { ...student, status: nextStatus };
      }
      return student;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return theme.success;
      case 'absent': return theme.error;
      case 'late': return theme.warning;
      default: return theme.textTertiary;
    }
  };

  const stats = {
    present: students.filter((s: Student) => s.status === 'present').length,
    absent: students.filter((s: Student) => s.status === 'absent').length,
    late: students.filter((s: Student) => s.status === 'late').length,
  };

  const roleColor = user?.role ? RoleColors[user.role] : RoleColors.teacher;

  return (
    <ScreenScrollView>
      <View style={styles.container}>
        {isOffline && (
          <View style={[styles.offlineBanner, { backgroundColor: theme.warning + '20', borderColor: theme.warning }]}>
            <Feather name="wifi-off" size={18} color={theme.warning} />
            <ThemedText style={[styles.offlineText, { color: theme.warning }]}>
              Offline Mode - Changes will sync when online
            </ThemedText>
          </View>
        )}

        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <ThemedText style={styles.cardTitle}>Class: Grade 10A - Mathematics</ThemedText>
              <ThemedText style={[styles.cardSubtitle, { color: theme.textSecondary }]}>{date}</ThemedText>
            </View>
            <View style={styles.cardHeaderRight}>
              {isSyncing ? (
                <View style={styles.syncIndicator}>
                  <Feather name="refresh-cw" size={18} color={roleColor} />
                  <ThemedText style={[styles.syncText, { color: roleColor }]}>Syncing...</ThemedText>
                </View>
              ) : (
                <Pressable onPress={handleSync} style={styles.syncButton}>
                  <Feather name="refresh-cw" size={18} color={roleColor} />
                </Pressable>
              )}
            </View>
          </View>
        </View>

        {user?.role === 'teacher' && (
          <Pressable
            onPress={() => setShowQRScanner(!showQRScanner)}
            style={({ pressed }) => [
              styles.qrButton,
              {
                backgroundColor: showQRScanner ? theme.success : roleColor,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            {/* cast name to any to avoid strict icon union typing issues */}
            <Feather name={(showQRScanner ? "x" : "qr-code") as any} size={20} color="#FFFFFF" />
            <ThemedText style={styles.qrButtonText}>
              {showQRScanner ? 'Close QR Scanner' : 'Scan QR Code'}
            </ThemedText>
          </Pressable>
        )}

        {showQRScanner && (
          <View style={[styles.qrScannerCard, { backgroundColor: theme.backgroundDefault }]}>
            <ThemedText style={styles.qrScannerTitle}>QR Code Scanner</ThemedText>
            <View style={[styles.qrPlaceholder, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
              <Feather name={"qr-code" as any} size={64} color={theme.textTertiary} />
              <ThemedText style={[styles.qrPlaceholderText, { color: theme.textSecondary }]}>
                Point camera at student QR code
              </ThemedText>
            </View>
            <ThemedText style={[styles.qrHint, { color: theme.textSecondary }]}>
              Students can generate their QR code from their profile
            </ThemedText>
          </View>
        )}

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: theme.success + '20' }]}>
            <ThemedText style={[styles.statNumber, { color: theme.success }]}>{stats.present}</ThemedText>
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>Present</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.error + '20' }]}>
            <ThemedText style={[styles.statNumber, { color: theme.error }]}>{stats.absent}</ThemedText>
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>Absent</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.warning + '20' }]}>
            <ThemedText style={[styles.statNumber, { color: theme.warning }]}>{stats.late}</ThemedText>
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>Late</ThemedText>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText style={styles.cardTitle}>Students</ThemedText>
          {students.map((student: Student) => (
            <Pressable
              key={student.id}
              onPress={() => toggleStatus(student.id)}
              style={({ pressed }: { pressed: boolean }) => [
                styles.studentItem,
                { opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <View style={[styles.studentAvatar, { backgroundColor: getStatusColor(student.status) }]}>
                <ThemedText style={styles.avatarText}>
                  {student.name.split(' ').map((n: string) => n[0]).join('')}
                </ThemedText>
              </View>
              <View style={styles.studentContent}>
                <ThemedText style={styles.studentName}>{student.name}</ThemedText>
                <ThemedText style={[styles.studentStatus, { color: theme.textSecondary }]}>
                  Tap to change status
                </ThemedText>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(student.status) + '20' }]}>
                <ThemedText style={[styles.statusText, { color: getStatusColor(student.status) }]}>
                  {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                </ThemedText>
              </View>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            {
              backgroundColor: roleColor,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Feather name={isOffline ? "save" : "check"} size={20} color="#FFFFFF" />
          <ThemedText style={styles.saveButtonText}>
            {isOffline ? 'Save (Offline)' : 'Save Attendance'}
          </ThemedText>
          {isOffline && (
            <View style={[styles.offlineDot, { backgroundColor: theme.warning }]} />
          )}
        </Pressable>
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
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  offlineText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardHeaderLeft: {
    flex: 1,
  },
  cardHeaderRight: {
    alignItems: 'flex-end',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    fontSize: 14,
  },
  syncIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  syncText: {
    fontSize: 12,
    fontWeight: '600',
  },
  syncButton: {
    padding: Spacing.sm,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  qrButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  qrScannerCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  qrScannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  qrPlaceholder: {
    height: 250,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  qrPlaceholderText: {
    fontSize: 14,
    fontWeight: '600',
  },
  qrHint: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  statsGrid: {
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  studentAvatar: {
    width: Spacing.avatarMd,
    height: Spacing.avatarMd,
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
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  studentContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
  },
  studentStatus: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    position: 'relative',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  offlineDot: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 12,
    height: 12,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
