import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView, TextInput, Alert } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ScreenScrollView } from '../components/ScreenScrollView';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius, RoleColors } from '../constants/theme';
import { Feather } from '@expo/vector-icons';

export default function BehaviorAppealsScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'complaints' | 'behavior' | 'submit'>('complaints');
  const [complaintType, setComplaintType] = useState('');
  const [complaintSubject, setComplaintSubject] = useState('');
  const [complaintDescription, setComplaintDescription] = useState('');

  const complaints = [
    {
      id: '1',
      type: 'Academic',
      subject: 'Grade Dispute - Mathematics',
      status: 'pending',
      date: '2 days ago',
      priority: 'high',
    },
    {
      id: '2',
      type: 'Behavior',
      subject: 'Classroom Incident',
      status: 'reviewed',
      date: '1 week ago',
      priority: 'medium',
    },
    {
      id: '3',
      type: 'Administrative',
      subject: 'Schedule Conflict',
      status: 'resolved',
      date: '2 weeks ago',
      priority: 'low',
    },
  ];

  const behaviorLogs = [
    {
      id: '1',
      student: 'Abebe Bekele',
      type: 'Positive',
      description: 'Excellent participation in class discussion',
      date: 'Today',
      teacher: 'Mr. Tadesse',
    },
    {
      id: '2',
      student: 'Tigist Alemu',
      type: 'Warning',
      description: 'Late submission of assignments',
      date: 'Yesterday',
      teacher: 'Ms. Almaz',
    },
    {
      id: '3',
      student: 'Dawit Tadesse',
      type: 'Positive',
      description: 'Helped classmates with homework',
      date: '3 days ago',
      teacher: 'Mr. Tadesse',
    },
  ];

  const roleColor = user?.role ? RoleColors[user.role] : theme.info;

  return (
    <ScreenScrollView>
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <Pressable
            onPress={() => setActiveTab('complaints')}
            style={({ pressed }) => [
              styles.tab,
              {
                backgroundColor: activeTab === 'complaints' ? roleColor : theme.backgroundDefault,
                borderColor: activeTab === 'complaints' ? roleColor : theme.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <ThemedText style={[
              styles.tabText,
              { color: activeTab === 'complaints' ? '#FFFFFF' : theme.text }
            ]}>
              Complaints
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('behavior')}
            style={({ pressed }) => [
              styles.tab,
              {
                backgroundColor: activeTab === 'behavior' ? roleColor : theme.backgroundDefault,
                borderColor: activeTab === 'behavior' ? roleColor : theme.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <ThemedText style={[
              styles.tabText,
              { color: activeTab === 'behavior' ? '#FFFFFF' : theme.text }
            ]}>
              Behavior Logs
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('submit')}
            style={({ pressed }) => [
              styles.tab,
              {
                backgroundColor: activeTab === 'submit' ? roleColor : theme.backgroundDefault,
                borderColor: activeTab === 'submit' ? roleColor : theme.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <ThemedText style={[
              styles.tabText,
              { color: activeTab === 'submit' ? '#FFFFFF' : theme.text }
            ]}>
              Submit Appeal
            </ThemedText>
          </Pressable>
        </View>

        {activeTab === 'complaints' && (
          <View style={styles.content}>
            {complaints.map((complaint) => (
              <View
                key={complaint.id}
                style={[styles.complaintCard, { backgroundColor: theme.backgroundDefault }]}
              >
                <View style={styles.complaintHeader}>
                  <View style={[styles.typeBadge, { backgroundColor: roleColor + '20' }]}>
                    <ThemedText style={[styles.typeText, { color: roleColor }]}>
                      {complaint.type}
                    </ThemedText>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        complaint.status === 'resolved' ? theme.success + '20' :
                        complaint.status === 'reviewed' ? theme.warning + '20' :
                        theme.error + '20',
                    },
                  ]}>
                    <ThemedText style={[
                      styles.statusText,
                      {
                        color:
                          complaint.status === 'resolved' ? theme.success :
                          complaint.status === 'reviewed' ? theme.warning :
                          theme.error,
                      },
                    ]}>
                      {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.complaintSubject}>{complaint.subject}</ThemedText>
                <View style={styles.complaintFooter}>
                  <ThemedText style={[styles.complaintDate, { color: theme.textSecondary }]}>
                    {complaint.date}
                  </ThemedText>
                  <View style={[
                    styles.priorityBadge,
                    {
                      backgroundColor:
                        complaint.priority === 'high' ? theme.error + '20' :
                        complaint.priority === 'medium' ? theme.warning + '20' :
                        theme.success + '20',
                    },
                  ]}>
                    <ThemedText style={[
                      styles.priorityText,
                      {
                        color:
                          complaint.priority === 'high' ? theme.error :
                          complaint.priority === 'medium' ? theme.warning :
                          theme.success,
                      },
                    ]}>
                      {complaint.priority.toUpperCase()}
                    </ThemedText>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'behavior' && (
          <View style={styles.content}>
            {behaviorLogs.map((log) => (
              <View
                key={log.id}
                style={[styles.behaviorCard, { backgroundColor: theme.backgroundDefault }]}
              >
                <View style={styles.behaviorHeader}>
                  <View style={[styles.studentAvatar, { backgroundColor: roleColor }]}>
                    <ThemedText style={styles.avatarText}>
                      {log.student.split(' ').map((n) => n[0]).join('')}
                    </ThemedText>
                  </View>
                  <View style={styles.behaviorInfo}>
                    <ThemedText style={styles.studentName}>{log.student}</ThemedText>
                    <ThemedText style={[styles.teacherName, { color: theme.textSecondary }]}>
                      {log.teacher}
                    </ThemedText>
                  </View>
                  <View style={[
                    styles.behaviorTypeBadge,
                    {
                      backgroundColor:
                        log.type === 'Positive' ? theme.success + '20' :
                        log.type === 'Warning' ? theme.warning + '20' :
                        theme.error + '20',
                    },
                  ]}>
                    <Feather
                      name={log.type === 'Positive' ? 'smile' : 'alert-triangle'}
                      size={16}
                      color={log.type === 'Positive' ? theme.success : theme.warning}
                    />
                    <ThemedText style={[
                      styles.behaviorTypeText,
                      {
                        color:
                          log.type === 'Positive' ? theme.success :
                          log.type === 'Warning' ? theme.warning :
                          theme.error,
                      },
                    ]}>
                      {log.type}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={[styles.behaviorDescription, { color: theme.textSecondary }]}>
                  {log.description}
                </ThemedText>
                <ThemedText style={[styles.behaviorDate, { color: theme.textTertiary }]}>
                  {log.date}
                </ThemedText>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'submit' && (
          <View style={styles.content}>
            <View style={[styles.formCard, { backgroundColor: theme.backgroundDefault }]}>
              <ThemedText style={styles.formTitle}>Submit New Appeal</ThemedText>

              <View style={styles.formGroup}>
                <ThemedText style={styles.label}>Appeal Type</ThemedText>
                <View style={styles.typeOptions}>
                  {['Academic', 'Behavior', 'Administrative'].map((type) => (
                    <Pressable
                      key={type}
                      onPress={() => setComplaintType(type)}
                      style={({ pressed }) => [
                        styles.typeOption,
                        {
                          backgroundColor: complaintType === type ? roleColor : theme.backgroundSecondary,
                          borderColor: complaintType === type ? roleColor : theme.border,
                          opacity: pressed ? 0.8 : 1,
                        },
                      ]}
                    >
                      <ThemedText style={[
                        styles.typeOptionText,
                        { color: complaintType === type ? '#FFFFFF' : theme.text }
                      ]}>
                        {type}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <ThemedText style={styles.label}>Subject</ThemedText>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.backgroundSecondary, color: theme.text, borderColor: theme.border }]}
                  placeholder="Enter subject"
                  placeholderTextColor={theme.textTertiary}
                  value={complaintSubject}
                  onChangeText={setComplaintSubject}
                />
              </View>

              <View style={styles.formGroup}>
                <ThemedText style={styles.label}>Description</ThemedText>
                <TextInput
                  style={[styles.textArea, { backgroundColor: theme.backgroundSecondary, color: theme.text, borderColor: theme.border }]}
                  placeholder="Describe your appeal in detail..."
                  placeholderTextColor={theme.textTertiary}
                  value={complaintDescription}
                  onChangeText={setComplaintDescription}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.submitButton,
                  {
                    backgroundColor: roleColor,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                onPress={() => {
                  // Basic validation and submission simulation
                  if (!complaintType) {
                    Alert.alert('Missing type', 'Select an appeal type.');
                    return;
                  }

                  if (!complaintSubject.trim()) {
                    Alert.alert('Missing subject', 'Enter an appeal subject.');
                    return;
                  }

                  if (!complaintDescription.trim()) {
                    Alert.alert('Missing description', 'Describe the appeal.');
                    return;
                  }

                  // Simulate submit
                  Alert.alert('Appeal submitted', 'Your appeal was submitted successfully.');
                  // Reset form
                  setComplaintType('');
                  setComplaintSubject('');
                  setComplaintDescription('');
                  setActiveTab('complaints');
                }}
              >
                <Feather name="send" size={18} color="#FFFFFF" />
                <ThemedText style={styles.submitButtonText}>Submit Appeal</ThemedText>
              </Pressable>
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
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    alignItems: 'center',
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
  complaintCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  complaintSubject: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  complaintFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  complaintDate: {
    fontSize: 13,
  },
  priorityBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  behaviorCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  behaviorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  studentAvatar: {
    width: 48,
    height: 48,
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
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  behaviorInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
  },
  teacherName: {
    fontSize: 13,
  },
  behaviorTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  behaviorTypeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  behaviorDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: Spacing.xs,
  },
  behaviorDate: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  formCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  formGroup: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  typeOptions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  typeOption: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    alignItems: 'center',
  },
  typeOptionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginTop: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});


