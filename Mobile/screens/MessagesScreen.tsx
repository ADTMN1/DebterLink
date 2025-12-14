import { View, StyleSheet, Pressable, TextInput } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ScreenScrollView } from '../components/ScreenScrollView';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius, RoleColors } from '../constants/theme';
import { Feather } from '@expo/vector-icons';

export default function MessagesScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();

  const conversations = [
    {
      id: '1',
      name: 'Mr. Tadesse (Math Teacher)',
      role: 'teacher',
      lastMessage: 'Great progress on the last assignment!',
      time: '10 min ago',
      unread: 2,
    },
    {
      id: '2',
      name: 'Ms. Almaz (Class Teacher)',
      role: 'teacher',
      lastMessage: 'Parent-teacher meeting scheduled',
      time: '1 hour ago',
      unread: 0,
    },
    {
      id: '3',
      name: 'Tigist\'s Parent',
      role: 'parent',
      lastMessage: 'Thank you for the update',
      time: '2 hours ago',
      unread: 0,
    },
  ];

  const roleColor = user?.role ? RoleColors[user.role] : theme.info;

  return (
    <ScreenScrollView>
      <View style={styles.container}>
        <View style={[styles.searchContainer, { backgroundColor: theme.backgroundDefault }]}>
          <Feather name="search" size={20} color={theme.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search messages..."
            placeholderTextColor={theme.textTertiary}
          />
        </View>

        {conversations.map((conversation) => (
          <Pressable
            key={conversation.id}
            style={({ pressed }: { pressed: boolean }) => [
              styles.conversationCard,
              { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <View style={[styles.avatar, { backgroundColor: RoleColors[conversation.role as keyof typeof RoleColors] }]}>
              <ThemedText style={styles.avatarText}>
                {conversation.name.split(' ')[0][0]}{conversation.name.split(' ')[1]?.[0]}
              </ThemedText>
            </View>
            <View style={styles.conversationContent}>
              <View style={styles.conversationHeader}>
                <ThemedText style={styles.conversationName}>{conversation.name}</ThemedText>
                <ThemedText style={[styles.conversationTime, { color: theme.textTertiary }]}>
                  {conversation.time}
                </ThemedText>
              </View>
              <ThemedText
                style={[
                  styles.conversationMessage,
                  { color: conversation.unread > 0 ? theme.text : theme.textSecondary }
                ]}
                numberOfLines={1}
              >
                {conversation.lastMessage}
              </ThemedText>
            </View>
            {conversation.unread > 0 ? (
              <View style={[styles.unreadBadge, { backgroundColor: roleColor }]}>
                <ThemedText style={styles.unreadText}>{conversation.unread}</ThemedText>
              </View>
            ) : null}
          </Pressable>
        ))}

        <Pressable
          style={({ pressed }: { pressed: boolean }) => [
            styles.composeButton,
            { backgroundColor: roleColor, opacity: pressed ? 0.8 : 1 }
          ]}
        >
          <Feather name="plus" size={20} color="#FFFFFF" />
          <ThemedText style={styles.composeButtonText}>New Message</ThemedText>
        </Pressable>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  conversationCard: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  avatar: {
    width: Spacing.avatarMd,
    height: Spacing.avatarMd,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
  },
  conversationTime: {
    fontSize: 12,
  },
  conversationMessage: {
    fontSize: 14,
  },
  unreadBadge: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  composeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  composeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
