import React, { useState } from 'react';
import { View, StyleSheet, Pressable, TextInput } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { Button } from '../components/Button';
import { ScreenKeyboardAwareScrollView } from '../components/ScreenKeyboardAwareScrollView';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius, RoleColors, Colors } from '../constants/theme';
import { Feather } from '@expo/vector-icons';

export default function LoginScreen() {
  const themeResult = useTheme();
  const theme = (themeResult && themeResult.theme) ? themeResult.theme : Colors.light;
  const { login } = useAuth();
  const [schoolCode, setSchoolCode] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roles: Array<{ role: UserRole; label: string; icon: string }> = [
    { role: 'teacher', label: 'Teacher', icon: 'book-open' },
    { role: 'student', label: 'Student', icon: 'user' },
    { role: 'parent', label: 'Parent', icon: 'users' },
    { role: 'director', label: 'Director', icon: 'award' },
    { role: 'admin', label: 'Administrator', icon: 'settings' },
    { role: 'superAdmin', label: 'Super Admin', icon: 'shield' },
  ];

  const handleLogin = async () => {
    setError('');
    
    if (!schoolCode.trim()) {
      setError('Please enter school code');
      return;
    }
    
    if (!selectedRole) {
      setError('Please select your role');
      return;
    }
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      try {
        login(selectedRole, name.trim(), schoolCode.trim());
        setIsLoading(false);
      } catch (err) {
        setError('Login failed. Please try again.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <ScreenKeyboardAwareScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Welcome Back</ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            Sign in to continue
          </ThemedText>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>School Code</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: theme.backgroundDefault, color: theme.text, borderColor: theme.border }]}
              placeholder="Enter school code"
              placeholderTextColor={theme.textTertiary}
              value={schoolCode}
              onChangeText={setSchoolCode}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Select Role</ThemedText>
            <View style={styles.roleGrid}>
              {roles.map((roleItem) => (
                <Pressable
                  key={roleItem.role}
                  onPress={() => setSelectedRole(roleItem.role)}
                  style={({ pressed }) => [
                    styles.roleCard,
                    {
                      backgroundColor: selectedRole === roleItem.role ? RoleColors[roleItem.role] : theme.backgroundDefault,
                      borderColor: selectedRole === roleItem.role ? RoleColors[roleItem.role] : theme.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Feather
                    name={roleItem.icon as any}
                    size={24}
                    color={selectedRole === roleItem.role ? '#FFFFFF' : theme.text}
                  />
                  <ThemedText style={[
                    styles.roleLabel,
                    { color: selectedRole === roleItem.role ? '#FFFFFF' : theme.text }
                  ]}>
                    {roleItem.label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Full Name</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: theme.backgroundDefault, color: theme.text, borderColor: theme.border }]}
              placeholder="Enter your full name"
              placeholderTextColor={theme.textTertiary}
              value={name}
              onChangeText={(text) => {
                setName(text);
                setError('');
              }}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Password</ThemedText>
            <View style={[styles.passwordContainer, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
              <TextInput
                style={[styles.passwordInput, { color: theme.text }]}
                placeholder="Enter your password"
                placeholderTextColor={theme.textTertiary}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError('');
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Feather
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={theme.textTertiary}
                />
              </Pressable>
            </View>
          </View>

          {error ? (
            <View style={[styles.errorContainer, { backgroundColor: theme.error + '20', borderColor: theme.error }]}>
              <Feather name="alert-circle" size={18} color={theme.error} />
              <ThemedText style={[styles.errorText, { color: theme.error }]}>
                {error}
              </ThemedText>
            </View>
          ) : null}

          <View style={styles.buttonContainer}>
            <Button
              onPress={handleLogin}
              disabled={!schoolCode || !selectedRole || !name || !password || isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </View>
        </View>
      </View>
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xxl,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    gap: Spacing.lg,
  },
  inputContainer: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  roleCard: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    alignItems: 'center',
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginTop: Spacing.sm,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: Spacing.xl,
  },
});
