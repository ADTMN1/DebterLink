import React, { useState } from 'react';
import { View, StyleSheet, Pressable, TextInput, Modal, Alert } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ScreenScrollView } from '../components/ScreenScrollView';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius, RoleColors } from '../constants/theme';
import { Feather } from '@expo/vector-icons';

interface Attachment {
  id: string;
  name: string;
  type: 'photo' | 'pdf';
  size: string;
}

export default function AssignmentsScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [nextAttachmentIndex, setNextAttachmentIndex] = useState(1);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);

  const assignments = [
    {
      id: '1',
      title: 'Math Homework - Chapter 5',
      subject: 'Mathematics',
      dueDate: '2 days',
      status: 'pending',
      points: 50,
    },
    {
      id: '2',
      title: 'Physics Lab Report',
      subject: 'Physics',
      dueDate: '5 days',
      status: 'pending',
      points: 100,
    },
    {
      id: '3',
      title: 'English Essay',
      subject: 'English',
      dueDate: 'Completed',
      status: 'submitted',
      grade: 'A',
    },
  ];

  const roleColor = user?.role ? RoleColors[user.role] : theme.info;

  return (
    <ScreenScrollView>
      <View style={styles.container}>
        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.statsRow}>
            <View style={[styles.statItem, { backgroundColor: roleColor + '20' }]}>
              <ThemedText style={styles.statNumber}>5</ThemedText>
              <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>Active</ThemedText>
            </View>
            <View style={[styles.statItem, { backgroundColor: theme.success + '20' }]}>
              <ThemedText style={styles.statNumber}>12</ThemedText>
              <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>Completed</ThemedText>
            </View>
            <View style={[styles.statItem, { backgroundColor: theme.warning + '20' }]}>
              <ThemedText style={styles.statNumber}>2</ThemedText>
              <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>Overdue</ThemedText>
            </View>
          </View>
        </View>

        {assignments.map((assignment) => (
          <Pressable
            onPress={() => {
              // For students open upload modal to submit for this assignment.
              if (user?.role !== 'teacher') {
                setSelectedAssignment(assignment.id);
                setShowUploadModal(true);
              } else {
                Alert.alert('Open assignment', `${assignment.title} (teacher view)`);
              }
            }}
            key={assignment.id}
            style={({ pressed }: { pressed: boolean }) => [
              styles.assignmentCard,
              { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <View style={styles.assignmentHeader}>
              <View style={[styles.subjectBadge, { backgroundColor: roleColor }]}>
                <Feather name="book" size={16} color="#FFFFFF" />
              </View>
              <View style={styles.assignmentInfo}>
                <ThemedText style={styles.assignmentTitle}>{assignment.title}</ThemedText>
                <ThemedText style={[styles.assignmentSubject, { color: theme.textSecondary }]}>
                  {assignment.subject}
                </ThemedText>
              </View>
              {assignment.status === 'submitted' ? (
                <View style={[styles.gradeBadge, { backgroundColor: theme.success }]}>
                  <ThemedText style={styles.gradeText}>{assignment.grade}</ThemedText>
                </View>
              ) : (
                <Feather name="chevron-right" size={20} color={theme.textTertiary} />
              )}
            </View>

            <View style={styles.assignmentFooter}>
              <View style={styles.footerItem}>
                <Feather name="clock" size={14} color={assignment.dueDate.includes('days') ? theme.warning : theme.success} />
                <ThemedText style={[
                  styles.footerText,
                  { color: assignment.dueDate.includes('days') ? theme.warning : theme.success }
                ]}>
                  {assignment.dueDate.includes('days') ? `Due in ${assignment.dueDate}` : assignment.dueDate}
                </ThemedText>
              </View>
              {assignment.points ? (
                <View style={styles.footerItem}>
                  <Feather name="award" size={14} color={theme.textSecondary} />
                  <ThemedText style={[styles.footerText, { color: theme.textSecondary }]}>
                    {assignment.points} points
                  </ThemedText>
                </View>
              ) : null}
            </View>
          </Pressable>
        ))}

        {user?.role === 'teacher' ? (
          <Pressable
            onPress={() => Alert.alert('Create', 'Create assignment — not implemented yet')}
            style={({ pressed }: { pressed: boolean }) => [
              styles.createButton,
              { backgroundColor: roleColor, opacity: pressed ? 0.8 : 1 }
            ]}
          >
            <Feather name="plus" size={20} color="#FFFFFF" />
            <ThemedText style={styles.createButtonText}>Create Assignment</ThemedText>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              setSelectedAssignment('1');
              setShowUploadModal(true);
            }}
            style={({ pressed }: { pressed: boolean }) => [
              styles.uploadButton,
              { backgroundColor: roleColor, opacity: pressed ? 0.8 : 1 }
            ]}
          >
            <Feather name="upload" size={20} color="#FFFFFF" />
            <ThemedText style={styles.uploadButtonText}>Upload Submission</ThemedText>
          </Pressable>
        )}

        <Modal
          visible={showUploadModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowUploadModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.backgroundRoot }]}>
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalTitle}>Upload Submission</ThemedText>
                <Pressable onPress={() => setShowUploadModal(false)}>
                  <Feather name="x" size={24} color={theme.text} />
                </Pressable>
              </View>

              <View style={styles.uploadOptions}>
                <Pressable
                  style={({ pressed }) => [
                    styles.uploadOption,
                    { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.8 : 1 }
                  ]}
                  onPress={() => {
                    // Simulate taking a photo and adding to attachments
                    const id = Date.now().toString();
                    const name = `Camera Photo ${nextAttachmentIndex}`;
                    setAttachments((prev) => [...prev, { id, name, type: 'photo', size: '1.2 MB' }]);
                    setNextAttachmentIndex((n) => n + 1);
                    Alert.alert('Photo taken', `${name} added to attachments`);
                  }}
                >
                  <Feather name="camera" size={32} color={roleColor} />
                  <ThemedText style={styles.uploadOptionText}>Take Photo</ThemedText>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.uploadOption,
                    { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.8 : 1 }
                  ]}
                  onPress={() => {
                    const id = Date.now().toString();
                    const name = `Selected Photo ${nextAttachmentIndex}`;
                    setAttachments((prev) => [...prev, { id, name, type: 'photo', size: '900 KB' }]);
                    setNextAttachmentIndex((n) => n + 1);
                    Alert.alert('Photo selected', `${name} added to attachments`);
                  }}
                >
                  <Feather name="image" size={32} color={roleColor} />
                  <ThemedText style={styles.uploadOptionText}>Choose Photo</ThemedText>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.uploadOption,
                    { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.8 : 1 }
                  ]}
                  onPress={() => {
                    const id = Date.now().toString();
                    const name = `Document ${nextAttachmentIndex}.pdf`;
                    setAttachments((prev) => [...prev, { id, name, type: 'pdf', size: '420 KB' }]);
                    setNextAttachmentIndex((n) => n + 1);
                    Alert.alert('PDF uploaded', `${name} added to attachments`);
                  }}
                >
                  <Feather name="file-text" size={32} color={roleColor} />
                  <ThemedText style={styles.uploadOptionText}>Upload PDF</ThemedText>
                </Pressable>
              </View>

              {attachments.length > 0 && (
                <View style={styles.attachmentsList}>
                  <ThemedText style={styles.attachmentsTitle}>Attachments:</ThemedText>
                  {attachments.map((attachment) => (
                    <View key={attachment.id} style={[styles.attachmentItem, { backgroundColor: theme.backgroundDefault }]}>
                      <Feather
                        name={attachment.type === 'photo' ? 'image' : 'file-text'}
                        size={20}
                        color={roleColor}
                      />
                      <ThemedText style={styles.attachmentName}>{attachment.name}</ThemedText>
                      <ThemedText style={[styles.attachmentSize, { color: theme.textSecondary }]}>
                        {attachment.size}
                      </ThemedText>
                      <Pressable onPress={() => setAttachments(attachments.filter(a => a.id !== attachment.id))}>
                        <Feather name="x" size={18} color={theme.error} />
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}

              <Pressable
                style={({ pressed }) => [
                  styles.submitButton,
                  { backgroundColor: roleColor, opacity: pressed ? 0.8 : 1 }
                ]}
                onPress={() => {
                  if (!selectedAssignment) {
                    Alert.alert('No assignment selected', 'Please select an assignment first.');
                    return;
                  }

                  if (attachments.length === 0) {
                    Alert.alert('No attachments', 'Please attach at least one file before submitting.');
                    return;
                  }

                  // Simulate upload/submission flow
                  Alert.alert('Submitted', `Submitted ${attachments.length} attachment(s) for assignment ${selectedAssignment}`);
                  setAttachments([]);
                  setShowUploadModal(false);
                }}
              >
                <Feather name="send" size={18} color="#FFFFFF" />
                <ThemedText style={styles.submitButtonText}>Submit Assignment</ThemedText>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statItem: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
  },
  assignmentCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  assignmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  subjectBadge: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  assignmentSubject: {
    fontSize: 14,
  },
  gradeBadge: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  assignmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  footerText: {
    fontSize: 12,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  uploadOptions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  uploadOption: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  uploadOptionText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  attachmentsList: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  attachmentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  attachmentName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  attachmentSize: {
    fontSize: 12,
  },
  submitButton: {
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
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
