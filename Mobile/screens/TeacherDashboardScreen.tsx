import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ScreenScrollView } from '../components/ScreenScrollView';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import {
  Spacing,
  BorderRadius,
  Colors,
} from '../constants/theme';
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
} from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.xl * 3) / 2;

export default function TeacherDashboardScreen() {
  const { user, isLoading, error } = useAuth();
  const { theme } = useTheme();

  const stats = [
    {
      id: '1',
      title: 'Students',
      value: '156',
      icon: 'account-multiple',
      color: '#4CAF50',
      iconType: 'material-community',
      onPress: () => {},
    },
    {
      id: '2',
      title: 'Assignments',
      value: '24',
      icon: 'assignment',
      color: '#2196F3',
      iconType: 'material',
      onPress: () => {},
    },
    {
      id: '3',
      title: 'Attendance',
      value: '92%',
      icon: 'calendar-check',
      color: '#FF9800',
      iconType: 'material-community',
      onPress: () => {},
    },
    {
      id: '4',
      title: 'Messages',
      value: '5',
      icon: 'message-text',
      color: '#9C27B0',
      iconType: 'material-community',
      onPress: () => {},
    },
  ];

  const renderIcon = (
    iconType: string,
    icon: string,
    color: string,
    size: number
  ) => {
    switch (iconType) {
      case 'material':
        return <MaterialIcons name={icon as any} size={size} color={color} />;
      case 'material-community':
        return (
          <MaterialCommunityIcons
            name={icon as any}
            size={size}
            color={color}
          />
        );
      default:
        return <Ionicons name={icon as any} size={size} color={color} />;
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: theme.backgroundRoot },
        ]}
      >
        <ThemedText>Loading dashboard…</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: theme.backgroundRoot },
        ]}
      >
        <Ionicons
          name="warning-outline"
          size={48}
          color={theme.error}
        />
        <ThemedText style={styles.errorTitle}>
          Something went wrong
        </ThemedText>
        <ThemedText style={styles.errorMessage}>
          {error.message}
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Fixed Header */}
      <View
        style={[
          styles.header,
          { 
            // backgroundColor: theme.primary,
            // position: 'absolute',
            // top: 0,
            // left: 0,
            // right: 0,
            // zIndex: 1000,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: theme.primaryLight },
              ]}
            >
              <Feather
                name="user"
                size={28}
                color={theme.text}
              />
            </View>
            <View>
              <ThemedText style={[styles.welcome, { color: theme.text }]}>
                Welcome back
              </ThemedText>
              <ThemedText style={[styles.name, { color: theme.text }]}>
                {user?.name || 'Teacher'}
              </ThemedText>
            </View>
          </View>

          <TouchableOpacity style={styles.notification}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={theme.text}
            />
            <View
              style={[
                styles.notificationDot,
                { backgroundColor: theme.error },
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScreenScrollView
        contentContainerStyle={{
          paddingTop: 120, // Adjust this value based on your header height
          paddingBottom: Spacing.lg,
        }}
      >
        {/* STATS */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Overview
          </ThemedText>

          <View style={styles.grid}>
            {stats.map((stat) => (
              <TouchableOpacity
                key={stat.id}
                style={[
                  styles.statCard,
                  { backgroundColor: theme.backgroundSecondary },
                ]}
                onPress={stat.onPress}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.statIcon,
                    { backgroundColor: `${stat.color}22` },
                  ]}
                >
                  {renderIcon(stat.iconType, stat.icon, stat.color, 22)}
                </View>
                <ThemedText style={styles.statValue}>
                  {stat.value}
                </ThemedText>
                <ThemedText style={styles.statLabel}>
                  {stat.title}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScreenScrollView>
    </View>
  );
}

/* =======================
   STYLES
======================= */

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: Spacing.md,
  },

  errorMessage: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },

  header: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    // borderBottomLeftRadius: BorderRadius.xl,
    // borderBottomRightRadius: BorderRadius.xl,
    marginVertical: Spacing.lg,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },

  welcome: {
    fontSize: 13,
    opacity: 0.85,
  },

  name: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 2,
  },

  notification: {
    padding: Spacing.sm,
  },

  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  statCard: {
    width: CARD_WIDTH,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },

  statValue: {
    fontSize: 22,
    fontWeight: '700',
  },

  statLabel: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 2,
  },
});