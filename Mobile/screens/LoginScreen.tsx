import React, { useState } from 'react';
import { View, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { Button } from '../components/Button';
import { ScreenKeyboardAwareScrollView } from '../components/ScreenKeyboardAwareScrollView';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius, Colors } from '../constants/theme';
import { Feather } from '@expo/vector-icons';

export default function LoginScreen() {
  const themeResult = useTheme();
  const theme = themeResult?.theme || Colors.light;
  const { login, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!email.trim()) {
      setError('Please enter your email');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (!password.trim()) {
      setError('Please enter your password');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    return true;
  };

  const handleLogin = async () => {
    setError('');
    
    if (!validateForm()) {
      return;
    }

    try {
      await login(email.trim(), password.trim());
      // Navigation will be handled by the auth state change
    } catch (err) {
      // Error is already handled in AuthContext
      console.error('Login error:', err);
    }
  };

  const clearErrorOnChange = (setter: React.Dispatch<React.SetStateAction<string>>) => {
    return (text: string) => {
      setter(text);
      setError('');
    };
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenKeyboardAwareScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Welcome Back</ThemedText>
            <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
              Sign in to access your dashboard
            </ThemedText>
          </View>

          <View style={styles.form}>
            {/* Email Field */}
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Email Address</ThemedText>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.backgroundDefault, 
                  color: theme.text, 
                  borderColor: error.includes('email') ? theme.error : theme.border 
                }]}
                placeholder="Enter your email"
                placeholderTextColor={theme.textTertiary}
                value={email}
                onChangeText={clearErrorOnChange(setEmail)}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                editable={!isLoading}
                returnKeyType="next"
                blurOnSubmit={false}
              />
            </View>

            {/* Password Field */}
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Password</ThemedText>
              <View style={[
                styles.passwordContainer, 
                { 
                  backgroundColor: theme.backgroundDefault, 
                  borderColor: error.includes('password') ? theme.error : theme.border 
                }
              ]}>
                <TextInput
                  style={[styles.passwordInput, { color: theme.text }]}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.textTertiary}
                  value={password}
                  onChangeText={clearErrorOnChange(setPassword)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <Pressable 
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  hitSlop={10}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <Feather
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={isLoading ? theme.textTertiary : theme.textSecondary}
                  />
                </Pressable>
              </View>
              {password.length > 0 && password.length < 6 && (
                <ThemedText style={[styles.hint, { color: theme.warning }]}>
                  Password should be at least 6 characters
                </ThemedText>
              )}
            </View>

            {/* Forgot Password Link */}
            <Pressable 
              style={styles.forgotPassword}
              onPress={() => {/* Navigate to forgot password screen */}}
              disabled={isLoading}
              hitSlop={10}
            >
              <ThemedText style={[styles.forgotPasswordText, { color: theme.primary }]}>
                Forgot Password?
              </ThemedText>
            </Pressable>

            {/* Error Display */}
            {error ? (
              <View style={[
                styles.errorContainer, 
                { 
                  backgroundColor: `${theme.error}20`, 
                  borderColor: theme.error 
                }
              ]}>
                <Feather name="alert-circle" size={18} color={theme.error} />
                <ThemedText style={[styles.errorText, { color: theme.error }]}>
                  {error}
                </ThemedText>
              </View>
            ) : null}

            {/* Login Button */}
            <View style={styles.buttonContainer}>
              <Button
                onPress={handleLogin}
                disabled={!email || !password || isLoading || password.length < 6}
                loading={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </View>
            

            {/* Demo Accounts Hint */}
            <View style={styles.demoHintContainer}>
              <ThemedText style={[styles.demoHintText, { color: theme.textTertiary }]}>
                Demo accounts:{' '}
              </ThemedText>
              <ThemedText style={[styles.demoHintText, { color: theme.textTertiary }]}>
                teacher@school.com / student@school.com / parent@school.com
              </ThemedText>
              <ThemedText style={[styles.demoHintText, { color: theme.textTertiary }]}>
                Password: password123
              </ThemedText>
            </View>
          </View>
        </View>
        
      </ScreenKeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  hint: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -Spacing.sm,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
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
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  demoHintContainer: {
    marginTop: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  demoHintText: {
    fontSize: 12,
    textAlign: 'center',
  },
});