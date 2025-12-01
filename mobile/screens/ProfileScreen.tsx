import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Alert, Modal } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ScreenScrollView } from '../components/ScreenScrollView';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius, RoleColors, Colors } from '../constants/theme';
import { useApp } from '../contexts/AppContext';
import { Feather } from '@expo/vector-icons';

export default function ProfileScreen() {
  const themeResult = useTheme();
  const theme = (themeResult && themeResult.theme) ? themeResult.theme : Colors.light;
  const { user, logout, language, setLanguage } = useAuth();
  const { themeMode, setThemeMode } = useApp();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const roleColor = user?.role ? RoleColors[user.role] : theme.info;

  const handleLogout = () => {
    logout().then(() => {
      console.log('Logout successful');
    }).catch((error) => {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    });
  };

  const confirmLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            // Do nothing on cancel
          },
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Call logout directly in the callback
            handleLogout();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const menuItems = [
    {
      id: '1',
      label: 'Edit Profile',
      icon: 'edit-3',
      color: roleColor,
      onPress: () => {},
    },
    {
      id: '2',
      label: 'Settings',
      icon: 'settings',
      color: theme.textSecondary,
      onPress: () => {},
    },
    {
      id: '3',
      label: 'Notifications',
      icon: 'bell',
      color: theme.textSecondary,
      onPress: () => {},
    },
    {
      id: '4',
      label: 'Help & Support',
      icon: 'help-circle',
      color: theme.textSecondary,
      onPress: () => {},
    },
    {
      id: '5',
      label: 'About',
      icon: 'info',
      color: theme.textSecondary,
      onPress: () => {},
    },
  ];

  return (
    <ScreenScrollView>
      <View style={styles.container}>
        <View style={[styles.profileHeader, { backgroundColor: theme.backgroundDefault }]}>
          <View style={[styles.avatar, { backgroundColor: roleColor }]}>
            <ThemedText style={styles.avatarText}>
              {user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'U'}
        </ThemedText>
      </View>
          <ThemedText style={styles.name}>{user?.name || 'User'}</ThemedText>
          <View style={[styles.roleBadge, { backgroundColor: roleColor + '20' }]}>
            <ThemedText style={[styles.roleText, { color: roleColor }]}>
              {user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'User'}
        </ThemedText>
      </View>
          {user?.schoolCode && (
            <ThemedText style={[styles.schoolCode, { color: theme.textSecondary }]}>
              School: {user.schoolCode}
        </ThemedText>
          )}
      </View>

        <View style={styles.languageSection}>
          <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            Language
        </ThemedText>
          <View style={styles.languageButtons}>
            {(['en', 'am', 'or'] as const).map((lang) => (
              <Pressable
                key={lang}
                onPress={() => setLanguage(lang)}
                style={({ pressed }) => [
                  styles.languageButton,
                  {
                    backgroundColor: language === lang ? roleColor : theme.backgroundDefault,
                    borderColor: language === lang ? roleColor : theme.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <ThemedText style={[
                  styles.languageButtonText,
                  { color: language === lang ? '#FFFFFF' : theme.text }
                ]}>
                  {lang === 'en' ? 'English' : lang === 'am' ? 'አማርኛ' : 'Oromiffa'}
        </ThemedText>
              </Pressable>
            ))}
      </View>

        <View style={styles.languageSection}>
          <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>Theme</ThemedText>
          <View style={styles.languageButtons}>
            {(['system', 'light', 'dark'] as const).map((mode) => (
              <Pressable
                key={mode}
                onPress={() => setThemeMode(mode)}
                style={({ pressed }) => [
                  styles.languageButton,
                  {
                    backgroundColor: themeMode === mode ? roleColor : theme.backgroundDefault,
                    borderColor: themeMode === mode ? roleColor : theme.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <ThemedText style={[styles.languageButtonText, { color: themeMode === mode ? '#FFFFFF' : theme.text }]}>
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

        <View style={[styles.menuCard, { backgroundColor: theme.backgroundDefault }]}>
          {menuItems.map((item) => (
            <Pressable
              key={item.id}
              onPress={item.onPress}
              style={({ pressed }) => [
                styles.menuItem,
                { opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                <Feather name={item.icon as any} size={20} color={item.color} />
      </View>
              <ThemedText style={styles.menuLabel}>{item.label}</ThemedText>
              <Feather name="chevron-right" size={20} color={theme.textTertiary} />
            </Pressable>
          ))}
      </View>

        <Pressable
          onPress={confirmLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            {
              backgroundColor: theme.error,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Feather name="log-out" size={20} color="#FFFFFF" />
          <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
        </Pressable>

        <View style={styles.versionInfo}>
          <ThemedText style={[styles.versionText, { color: theme.textTertiary }]}>
            ደብተርLink v1.0.0
        </ThemedText>
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
  profileHeader: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: Spacing.sm,
  },
  roleBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.xs,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '700',
  },
  schoolCode: {
    fontSize: 14,
    marginTop: Spacing.xs,
  },
  languageSection: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  languageButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  languageButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  menuCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    gap: Spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  versionInfo: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  versionText: {
    fontSize: 12,
  },
});
