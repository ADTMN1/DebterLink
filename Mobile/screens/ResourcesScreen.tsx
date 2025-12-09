import React, { useState } from 'react';
import { View, StyleSheet, Pressable, TextInput, Modal, Alert } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ScreenScrollView } from '../components/ScreenScrollView';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius, RoleColors } from '../constants/theme';
import { Feather } from '@expo/vector-icons';

export default function ResourcesScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();

  const categories = [
    { id: '1', name: 'Lecture Notes', icon: 'book-open', count: 24 },
    { id: '2', name: 'Past Papers', icon: 'file-text', count: 15 },
    { id: '3', name: 'Video Lessons', icon: 'video', count: 8 },
    { id: '4', name: 'Study Guides', icon: 'bookmark', count: 12 },
  ];

  const recentResources = [
    {
      id: '1',
      title: 'Mathematics - Algebra Review',
      type: 'PDF',
      size: '2.4 MB',
      date: 'Today',
    },
    {
      id: '2',
      title: 'Physics - Motion and Forces',
      type: 'PDF',
      size: '1.8 MB',
      date: 'Yesterday',
    },
    {
      id: '3',
      title: 'Chemistry Lab Procedures',
      type: 'Video',
      size: '45 MB',
      date: '2 days ago',
    },
  ];

  const roleColor = user?.role ? RoleColors[user.role] : theme.info;
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [resourceAttachments, setResourceAttachments] = useState<Array<{id:string; name:string; type: 'photo'|'pdf'; size:string;}>>([]);
  const [nextIdx, setNextIdx] = useState(1);

  return (
    <ScreenScrollView>
      <View style={styles.container}>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => Alert.alert(category.name)}
              style={({ pressed }: { pressed: boolean }) => [
                styles.categoryCard,
                { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <View style={[styles.categoryIcon, { backgroundColor: roleColor }]}>
                <Feather name={category.icon as any} size={24} color="#FFFFFF" />
              </View>
              <ThemedText style={styles.categoryName}>{category.name}</ThemedText>
              <ThemedText style={[styles.categoryCount, { color: theme.textSecondary }]}>
                {category.count} items
              </ThemedText>
            </Pressable>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Recently Accessed</ThemedText>
            <Pressable>
              <ThemedText style={[styles.seeAll, { color: roleColor }]}>See All</ThemedText>
            </Pressable>
          </View>

          {user?.role === 'teacher' ? (
            <View style={styles.resourcesGrid}>
              {recentResources.map((resource) => (
                <Pressable
                  key={resource.id}
                  style={({ pressed }: { pressed: boolean }) => [
                    styles.resourceCard,
                    { backgroundColor: theme.backgroundSecondary, opacity: pressed ? 0.7 : 1 }
                  ]}
                >
                  <View style={[styles.resourceIcon, { backgroundColor: roleColor + '20' }]}>
                    <Feather
                      name={resource.type === 'PDF' ? 'file-text' : 'video'}
                      size={24}
                      color={roleColor}
                    />
                  </View>
                  <View style={styles.resourceContent}>
                    <ThemedText style={styles.resourceTitle} numberOfLines={2}>
                      {resource.title}
                    </ThemedText>
                    <ThemedText style={[styles.resourceInfo, { color: theme.textSecondary }]}>
                      {resource.type} • {resource.size}
                    </ThemedText>
                    <View style={styles.resourceFooter}>
                      <ThemedText style={[styles.resourceDate, { color: theme.textTertiary }]}>
                        {resource.date}
                      </ThemedText>
                      <Pressable>
                        <Feather name="download" size={16} color={roleColor} />
                      </Pressable>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          ) : (
            <>
              {recentResources.map((resource) => (
                <Pressable
                  key={resource.id}
                  onPress={() => Alert.alert(resource.title)}
                  style={({ pressed }: { pressed: boolean }) => [
                    styles.resourceItem,
                    { opacity: pressed ? 0.7 : 1 }
                  ]}
                >
                  <View style={[styles.resourceIcon, { backgroundColor: roleColor + '20' }]}>
                    <Feather
                      name={resource.type === 'PDF' ? 'file-text' : 'video'}
                      size={20}
                      color={roleColor}
                    />
                  </View>
                  <View style={styles.resourceContent}>
                    <ThemedText style={styles.resourceTitle}>{resource.title}</ThemedText>
                    <View style={styles.resourceMeta}>
                      <ThemedText style={[styles.resourceInfo, { color: theme.textSecondary }]}>
                        {resource.type} • {resource.size}
                      </ThemedText>
                      <ThemedText style={[styles.resourceDate, { color: theme.textTertiary }]}>
                        {resource.date}
                      </ThemedText>
                    </View>
                  </View>
                  <Feather name="download" size={20} color={theme.textTertiary} />
                </Pressable>
              ))}
            </>
          )}
        </View>

        {user?.role === 'teacher' ? (
          <>
            <Pressable
              onPress={() => setShowUploadModal(true)}
              style={({ pressed }: { pressed: boolean }) => [
                styles.uploadButton,
                { backgroundColor: roleColor, opacity: pressed ? 0.8 : 1 }
              ]}
            >
              <Feather name="upload" size={20} color="#FFFFFF" />
              <ThemedText style={styles.uploadButtonText}>Upload Resource</ThemedText>
            </Pressable>

            <Modal
              visible={showUploadModal}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setShowUploadModal(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: theme.backgroundRoot }] }>
                  <View style={styles.modalHeader}>
                    <ThemedText style={styles.modalTitle}>Upload Resource</ThemedText>
                    <Pressable onPress={() => setShowUploadModal(false)}>
                      <Feather name="x" size={24} color={theme.text} />
                    </Pressable>
                  </View>

                  <View style={styles.uploadOptions}>
                    <Pressable
                      style={({ pressed }) => [styles.uploadOption, { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.8 : 1 }] }
                      onPress={() => {
                        const id = Date.now().toString();
                        const name = `Photo ${nextIdx}`;
                        setResourceAttachments(prev => [...prev, { id, name, type: 'photo', size: '1.0 MB' }]);
                        setNextIdx(n => n + 1);
                        Alert.alert('Photo taken', `${name} added to uploads`);
                      }}
                    >
                      <Feather name="camera" size={32} color={roleColor} />
                      <ThemedText style={styles.uploadOptionText}>Take Photo</ThemedText>
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => [styles.uploadOption, { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.8 : 1 }] }
                      onPress={() => {
                        const id = Date.now().toString();
                        const name = `Photo ${nextIdx}`;
                        setResourceAttachments(prev => [...prev, { id, name, type: 'photo', size: '850 KB' }]);
                        setNextIdx(n => n + 1);
                        Alert.alert('Selected', `${name} added to uploads`);
                      }}
                    >
                      <Feather name="image" size={32} color={roleColor} />
                      <ThemedText style={styles.uploadOptionText}>Choose Photo</ThemedText>
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => [styles.uploadOption, { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.8 : 1 }] }
                      onPress={() => {
                        const id = Date.now().toString();
                        const name = `Document ${nextIdx}.pdf`;
                        setResourceAttachments(prev => [...prev, { id, name, type: 'pdf', size: '512 KB' }]);
                        setNextIdx(n => n + 1);
                        Alert.alert('Uploaded', `${name} added to uploads`);
                      }}
                    >
                      <Feather name="file-text" size={32} color={roleColor} />
                      <ThemedText style={styles.uploadOptionText}>Upload PDF</ThemedText>
                    </Pressable>
                  </View>

                  {resourceAttachments.length > 0 && (
                    <View style={styles.attachmentsList}>
                      <ThemedText style={styles.attachmentsTitle}>Uploads:</ThemedText>
                      {resourceAttachments.map((a) => (
                        <View key={a.id} style={[styles.attachmentItem, { backgroundColor: theme.backgroundDefault }] }>
                          <Feather name={a.type === 'photo' ? 'image' : 'file-text'} size={18} color={roleColor} />
                          <ThemedText style={styles.attachmentName}>{a.name}</ThemedText>
                          <ThemedText style={[styles.attachmentSize, { color: theme.textSecondary }]}>{a.size}</ThemedText>
                          <Pressable onPress={() => setResourceAttachments(prev => prev.filter(x => x.id !== a.id))}>
                            <Feather name="x" size={18} color={theme.error} />
                          </Pressable>
                        </View>
                      ))}
                    </View>
                  )}

                  <Pressable
                    style={({ pressed }) => [styles.submitButton, { backgroundColor: roleColor, opacity: pressed ? 0.8 : 1 }] }
                    onPress={() => {
                      if (resourceAttachments.length === 0) {
                        Alert.alert('No files', 'Please attach at least one resource to upload.');
                        return;
                      }

                      Alert.alert('Uploaded', `Uploaded ${resourceAttachments.length} file(s)`);
                      setResourceAttachments([]);
                      setShowUploadModal(false);
                    }}
                  >
                    <Feather name="send" size={18} color="#FFFFFF" />
                    <ThemedText style={styles.submitButtonText}>Upload</ThemedText>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </>
        ) : null}
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.xxl,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  categoryCount: {
    fontSize: 12,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  resourcesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  resourceCard: {
    width: '48%',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  resourceIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  resourceContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: Spacing.xs,
  },
  resourceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  resourceInfo: {
    fontSize: 12,
    fontWeight: '500',
  },
  resourceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  resourceDate: {
    fontSize: 11,
    fontWeight: '500',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
