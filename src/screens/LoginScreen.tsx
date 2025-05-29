import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants';
import { UserCredentials } from '../types';
import { AuthService } from '../services/AuthService';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const authService = AuthService.getInstance();

  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const savedCredentials = await authService.getSavedCredentials();
      if (savedCredentials) {
        setEmployeeId(savedCredentials.employeeId || '');
        setRememberMe(savedCredentials.rememberMe || false);
      }
    } catch (error) {
      console.error('Error loading saved credentials:', error);
    }
  };

  const handleLogin = async () => {
    if (!employeeId.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both Employee ID and password');
      return;
    }

    setLoading(true);

    try {
      const credentials: UserCredentials = {
        employeeId: employeeId.trim(),
        password: password.trim(),
        rememberMe,
      };

      const result = await authService.login(credentials);

      if (result.success) {
        // Successful login (unlikely with current SAML implementation)
        onLoginSuccess();
      } else if (result.requiresMFA) {
        // SAML/2FA required
        Alert.alert(
          'Authentication Required',
          'This corporate portal uses SAML Single Sign-On with 2-Factor Authentication. This advanced enterprise security system is not yet supported in the mobile app.\n\nFor now, you can view the demo schedule to see how the app works.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'View Demo',
              onPress: () => onLoginSuccess(),
            },
          ],
        );
      } else {
        // Login failed
        Alert.alert(
          'Login Failed',
          result.error || 'Unable to authenticate. Please check your credentials and try again.',
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoMode = () => {
    Alert.alert(
      'Demo Mode',
      'This will show you how the app works with real corporate schedule data, but without requiring authentication.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => onLoginSuccess(),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>GoTime Schedule</Text>
            <Text style={styles.subtitle}>Employee Schedule Access</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Employee ID</Text>
              <TextInput
                style={styles.input}
                value={employeeId}
                onChangeText={setEmployeeId}
                placeholder="Enter your employee ID"
                placeholderTextColor={COLORS.textSecondary}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="numeric"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.textSecondary}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="go"
                onSubmitEditing={handleLogin}
              />
            </View>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Remember Employee ID</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Authenticating...' : 'Login'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.demoButton}
              onPress={handleDemoMode}
            >
              <Text style={styles.demoButtonText}>View Demo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.info}>
            <Text style={styles.infoTitle}>Authentication Notice</Text>
            <Text style={styles.infoText}>
              • Corporate portals use SAML Single Sign-On with 2-Factor Authentication
            </Text>
            <Text style={styles.infoText}>
              • SMS verification is required for security
            </Text>
            <Text style={styles.infoText}>
              • This enterprise security system is not yet fully supported
            </Text>
            <Text style={styles.infoText}>
              • Use the demo to see how the app works with real schedule data
            </Text>
          </View>

          {Platform.OS === 'web' && (
            <View style={styles.webNotice}>
              <Text style={styles.webNoticeTitle}>Web Platform Notice</Text>
              <Text style={styles.webNoticeText}>
                Authentication is not supported on the web platform due to CORS restrictions. 
                Please use the mobile app for full functionality.
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  form: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    fontWeight: '500',
  },
  input: {
    ...TYPOGRAPHY.body,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    color: COLORS.text,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 4,
    marginRight: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  loginButtonDisabled: {
    backgroundColor: COLORS.textSecondary,
  },
  loginButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    fontWeight: '600',
  },
  demoButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  demoButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: '600',
  },
  info: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    ...TYPOGRAPHY.h5,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  infoText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    lineHeight: 18,
  },
  webNotice: {
    backgroundColor: COLORS.warningLight,
    borderRadius: 8,
    padding: SPACING.md,
  },
  webNoticeTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.warning,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  webNoticeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text,
    lineHeight: 18,
  },
}); 