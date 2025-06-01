import React, { useState, useEffect, useRef } from 'react';
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
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import * as Clipboard from 'expo-clipboard';
import { COLORS, TYPOGRAPHY, SPACING, APP_CONFIG } from '../constants';
import { UserCredentials } from '../types';
import { AuthService } from '../services/AuthService';
import { ScheduleService } from '../services/ScheduleService';

// eslint-disable-next-line no-undef
const packageJson = require('../../package.json');

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

type AuthStep = 'CREDENTIALS' | 'MFA_CODE' | 'SAML_REDIRECT' | 'WEBVIEW_AUTH';

// TypeScript interfaces for iframe objects
interface IframeInfo {
  index: number;
  src: string;
  id: string;
  name: string;
  url?: string;
  title?: string;
  html?: string;
  textContent?: string;
  accessible: boolean;
  visible: boolean;
  error?: string;
}

interface IframeAnalysisItem {
  accessible: boolean;
  isCognosTarget: boolean;
  src: string;
  iframeTitle?: string;
  cognosScore?: number;
  index: number;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<AuthStep>('CREDENTIALS');
  const [authSessionData, setAuthSessionData] = useState<Record<string, unknown> | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [hasStoredSchedules, setHasStoredSchedules] = useState(false);

  const authService = AuthService.getInstance();
  const scheduleService = ScheduleService.getInstance();
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    loadSavedCredentials();
  }, []);

  // Check for stored schedules on component mount
  useEffect(() => {
    checkStoredSchedules();
  }, []);

  const checkStoredSchedules = async () => {
    try {
      const stats = await scheduleService.getStorageStats();
      setHasStoredSchedules(stats.totalSchedules > 0);
    } catch (error) {
      console.error('Error checking stored schedules:', error);
      setHasStoredSchedules(false);
    }
  };

  const toggleOfflineStorage = async () => {
    try {
      if (hasStoredSchedules) {
        // Clear stored schedules
        console.log('🗑️ [UI] Clearing offline storage...');
        await scheduleService.clearAllWeeklySchedules();
        
        Alert.alert(
          'Offline Storage Cleared ✅',
          'All stored schedules have been removed.\n\nThe app will now use demo schedules.',
          [{ text: 'OK' }],
        );
        
        setHasStoredSchedules(false);
      } else {
        // Test offline storage
        console.log('🧪 [UI] Testing offline storage...');
        const { testOfflineStorage } = await import('../test-utils/offlineTest');
        
        await testOfflineStorage();
        
        Alert.alert(
          'Offline Storage Test ✅',
          'Offline storage test completed successfully!\n\n• Created 3 test schedules\n• Saved to local storage\n• Retrieved schedules\n• Verified storage stats\n\nTap "My Schedule" to see stored schedules.',
          [{ text: 'Great!' }],
        );
        
        setHasStoredSchedules(true);
      }
    } catch (error) {
      console.error('❌ [UI] Offline storage toggle failed:', error);
      Alert.alert(
        'Operation Failed ❌',
        `Failed: ${(error as Error).message}\n\nCheck console logs for more details.`,
        [{ text: 'OK' }],
      );
    }
  };

  const loadSavedCredentials = async () => {
    try {
      const saved = await authService.getSavedCredentials();
      if (saved?.employeeId) {
        setEmployeeId(saved.employeeId);
        setRememberMe(true);
      }
    } catch (error) {
      console.log('No saved credentials found:', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const handleLogin = async () => {
    if (!employeeId.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both Employee ID and Password');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const credentials: UserCredentials = {
        employeeId: employeeId.trim(),
        password: password.trim(),
        rememberMe,
      };

      console.log('🚀 [UI] Starting authentication flow...');
      console.log('👤 [UI] Employee ID:', employeeId.substring(0, 3) + '***');
      
      const result = await authService.login(credentials);

      if (result.success) {
        console.log('✅ [UI] Authentication successful - navigating to main app');
        onLoginSuccess();
      } else if (result.requiresMFA) {
        console.log('🔐 [UI] MFA required - switching to code input screen');
        setCurrentStep('MFA_CODE');
        setErrorMessage('Please enter the verification code sent to your phone');
      } else if (result.errorType === 'SAML_REQUIRED') {
        console.log('🔄 [UI] SAML authentication required - showing SAML instructions');
        setCurrentStep('SAML_REDIRECT');
        setErrorMessage(result.error || 'SAML authentication required');
      } else {
        console.log('❌ [UI] Authentication failed:', result.errorType || 'Unknown');
        setErrorMessage(result.error || 'Authentication failed');
        
        // Handle specific error types
        if (result.errorType === 'CAPTCHA_REQUIRED') {
          Alert.alert(
            'Authentication Blocked',
            'The server detected automated behavior and requires manual verification. Please:\n\n1. Open your browser\n2. Go to ess.costco.com\n3. Complete the login process manually\n4. Return here and try again\n\nThis helps establish a trusted session.',
            [{ text: 'OK' }],
          );
        } else if (result.errorType === 'RATE_LIMITED' && result.retryAfter) {
          const retrySeconds = Math.round(result.retryAfter / 1000);
          Alert.alert(
            'Rate Limited',
            `Please wait ${retrySeconds} seconds before trying again.`,
            [{ text: 'OK' }],
          );
        }
      }
    } catch (error) {
      console.error('💥 [UI] Login exception:', error);
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMFAVerification = async () => {
    if (!mfaCode.trim() || mfaCode.length < 4) {
      Alert.alert('Error', 'Please enter a valid verification code');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      console.log('🔐 [UI] Starting MFA verification...');
      console.log('📱 [UI] Code length:', mfaCode.length);
      
      const result = await authService.verifyMFACode(mfaCode.trim(), authSessionData || undefined);

      if (result.success) {
        console.log('✅ [UI] MFA verification successful - navigating to main app');
        onLoginSuccess();
      } else {
        console.log('❌ [UI] MFA verification failed:', result.errorType || 'Unknown');
        setErrorMessage(result.error || 'Invalid verification code');
        
        if (result.errorType === 'RATE_LIMITED' && result.retryAfter) {
          const retrySeconds = Math.round(result.retryAfter / 1000);
          Alert.alert(
            'Rate Limited',
            `Please wait ${retrySeconds} seconds before trying again.`,
            [{ text: 'OK' }],
          );
        }
      }
    } catch (error) {
      console.error('💥 [UI] MFA verification exception:', error);
      setErrorMessage('Network error during verification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToCredentials = () => {
    setCurrentStep('CREDENTIALS');
    setMfaCode('');
    setErrorMessage(null);
    setShowPassword(false);
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

  const handleWebViewAuth = () => {
    Alert.alert(
      'In-App Authentication',
      'This will open the login page within the app, allowing us to capture session cookies for automatic schedule sync.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => {
            // Switch to WebView authentication mode
            setCurrentStep('WEBVIEW_AUTH' as AuthStep);
          },
        },
      ],
    );
  };

  const handleFillCredentials = () => {
    if (!webViewRef.current) {
      Alert.alert('Error', 'WebView not available. Please ensure you are on the WebView screen.');
      return;
    }

    const fillCredentialsScript = `
    (function() {
      try {
        console.log('🔑 [CREDENTIALS] Starting smart credential fill...');
        
        const employeeId = '${employeeId}';
        const password = '${password}';
        
        if (!employeeId || !password) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'credentials_filled',
            success: false,
            error: 'Employee ID and password must be set in the app first'
          }));
          return;
        }
        
        // Detect which login form we're dealing with
        const pageContent = document.body.textContent || document.body.innerText || '';
        const pageTitle = document.title || '';
        const currentURL = window.location.href || '';
        
        // More specific detection for the SECOND login form that needs enhanced validation
        const isCostcoExtSecondForm = pageContent.includes('Log in with your COSTCOEXT ID') || 
                                     (pageContent.includes('User ID') && pageContent.includes('Password') && 
                                      (pageContent.includes('COSTCOEXT') || currentURL.includes('costco'))) ||
                                     document.querySelector('input[placeholder*="User ID"]') ||
                                     document.querySelector('label[for*="userid"]');
        
        // This is NOT the enhanced form if it's just basic employee/password without COSTCOEXT context
        const isFirstStandardForm = pageContent.includes('Employee') && 
                                   !pageContent.includes('COSTCOEXT') && 
                                   !pageContent.includes('User ID');
        
        console.log('🔑 [CREDENTIALS] Form detection:');
        console.log('  - Page title:', pageTitle);
        console.log('  - Is COSTCOEXT second form (needs enhanced):', isCostcoExtSecondForm);
        console.log('  - Is first standard form (simple):', isFirstStandardForm);
        console.log('  - Content includes "Log in with your COSTCOEXT ID":', pageContent.includes('Log in with your COSTCOEXT ID'));
        console.log('  - Content includes "User ID":', pageContent.includes('User ID'));
        console.log('  - URL contains costco:', currentURL.includes('costco'));
        
        console.log('🔑 [CREDENTIALS] Looking for login fields...');
        
        // Enhanced selectors for login forms
        const usernameSelectors = [
          'input[name="username"]',
          'input[name="employeeId"]',
          'input[name="employee_id"]', 
          'input[name="userid"]',
          'input[name="user"]',
          'input[name="uid"]',
          'input[name="login"]',
          'input[name="userID"]',
          'input[name="User_ID"]',
          'input[type="text"]',
          'input[id*="username"]',
          'input[id*="employee"]',
          'input[id*="user"]',
          'input[id*="login"]',
          'input[placeholder*="User"]',
          'input[placeholder*="Employee"]',
          'input[placeholder*="ID"]'
        ];
        
        const passwordSelectors = [
          'input[name="password"]',
          'input[name="passwd"]',
          'input[name="pwd"]',
          'input[name="pass"]',
          'input[name="Password"]',
          'input[type="password"]',
          'input[id*="password"]',
          'input[id*="passwd"]',
          'input[id*="pwd"]',
          'input[placeholder*="Password"]',
          'input[placeholder*="password"]'
        ];
        
        let usernameField = null;
        let passwordField = null;
        
        // Find username field
        for (const selector of usernameSelectors) {
          const field = document.querySelector(selector);
          if (field && field.offsetParent !== null) {
            console.log('🔑 [CREDENTIALS] Found username field:', selector);
            usernameField = field;
            break;
          }
        }
        
        // Find password field
        for (const selector of passwordSelectors) {
          const field = document.querySelector(selector);
          if (field && field.offsetParent !== null) {
            console.log('🔑 [CREDENTIALS] Found password field:', selector);
            passwordField = field;
            break;
          }
        }
        
        console.log('🔑 [CREDENTIALS] Field search results:');
        console.log('  - Username field found:', !!usernameField);
        console.log('  - Password field found:', !!passwordField);
        
        // Simplified filling function for basic forms
        function fillFieldSimplified(field, value, fieldType) {
          if (!field) return false;
          
          console.log('🔑 [CREDENTIALS] Filling', fieldType, 'with simplified approach...');
          
          field.value = '';
          field.focus();
          field.value = value;
          
          field.dispatchEvent(new Event('input', { bubbles: true }));
          field.dispatchEvent(new Event('change', { bubbles: true }));
          
          if (field._valueTracker) {
            field._valueTracker.setValue('');
          }
          
          setTimeout(() => {
            field.blur();
            console.log('✅ [CREDENTIALS] Simplified fill complete for', fieldType);
          }, 100);
          
          return true;
        }
        
        // Enhanced filling function for CostCOEXT forms that need complex validation
        function fillFieldEnhanced(field, value, fieldType) {
          if (!field) return false;
          
          console.log('🔑 [CREDENTIALS] Filling', fieldType, 'with enhanced validation triggering...');
          
          // Debugging: Check initial field state
          function logFieldState(stage) {
            console.log('🔍 [DEBUG]', stage, 'field state for', fieldType, ':');
            console.log('  - Value:', field.value);
            console.log('  - Validity valid:', field.validity ? field.validity.valid : 'no validity');
            console.log('  - Validity valueMissing:', field.validity ? field.validity.valueMissing : 'no validity');
            console.log('  - Required:', field.required);
            console.log('  - Disabled:', field.disabled);
            console.log('  - ReadOnly:', field.readOnly);
            console.log('  - aria-invalid:', field.getAttribute('aria-invalid'));
            console.log('  - aria-required:', field.getAttribute('aria-required'));
            console.log('  - Class list:', field.className);
            console.log('  - Has error class:', field.classList.contains('error') || field.classList.contains('invalid') || field.classList.contains('ng-invalid'));
            
            // Check for validation error elements nearby
            const parent = field.parentElement;
            if (parent) {
              const errorElements = parent.querySelectorAll('.error, .invalid, .validation-error, [role="alert"]');
              console.log('  - Error elements in parent:', errorElements.length);
              if (errorElements.length > 0) {
                Array.from(errorElements).forEach((el, idx) => {
                  console.log('    * Error element', idx, ':', el.textContent.trim());
                });
              }
            }
          }
          
          // Log initial state
          logFieldState('INITIAL');
          
          // Clear and focus
          field.value = '';
          field.focus();
          
          // Initial events
          field.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
          field.dispatchEvent(new Event('click', { bubbles: true }));
          
          // Log after focus
          logFieldState('AFTER_FOCUS');
          
          // Drop in the full value
          console.log('🔑 [CREDENTIALS] Setting full value for', fieldType);
          field.value = value;
          field.dispatchEvent(new Event('input', { bubbles: true }));
          
          // Log after value set
          logFieldState('AFTER_VALUE_SET');
          
          // Now do the simple delete-and-retype of last character for validation
          setTimeout(() => {
            console.log('🔑 [CREDENTIALS] Performing delete-retype of last character for', fieldType);
            
            const originalValue = field.value;
            const lastChar = originalValue.slice(-1);
            const withoutLastChar = originalValue.slice(0, -1);
            
            console.log('🔑 [CREDENTIALS] Original value:', originalValue);
            console.log('🔑 [CREDENTIALS] Last character to delete/retype:', lastChar);
            
            // Position cursor at the end
            field.setSelectionRange(originalValue.length, originalValue.length);
            
            // Delete the last character
            field.dispatchEvent(new KeyboardEvent('keydown', { 
              key: 'Backspace',
              code: 'Backspace',
              keyCode: 8,
              which: 8,
              bubbles: true,
              cancelable: true
            }));
            
            // Actually remove the character
            field.value = withoutLastChar;
            field.setSelectionRange(withoutLastChar.length, withoutLastChar.length);
            
            // Input event for deletion
            field.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            
            field.dispatchEvent(new KeyboardEvent('keyup', { 
              key: 'Backspace',
              code: 'Backspace',
              keyCode: 8,
              which: 8,
              bubbles: true,
              cancelable: true
            }));
            
            // Log after deletion
            logFieldState('AFTER_DELETION');
            
            // Wait a moment, then retype the last character
            setTimeout(() => {
              console.log('🔑 [CREDENTIALS] Retyping last character:', lastChar);
              
              // Simulate keydown for the character
              field.dispatchEvent(new KeyboardEvent('keydown', { 
                key: lastChar,
                code: lastChar === ' ' ? 'Space' : 'Key' + lastChar.toUpperCase(),
                keyCode: lastChar.charCodeAt(0),
                which: lastChar.charCodeAt(0),
                bubbles: true,
                cancelable: true
              }));
              
              // Add the character back
              field.value = originalValue;
              field.setSelectionRange(originalValue.length, originalValue.length);
              
              // Input event for addition
              field.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
              
              field.dispatchEvent(new KeyboardEvent('keyup', { 
                key: lastChar,
                code: lastChar === ' ' ? 'Space' : 'Key' + lastChar.toUpperCase(),
                keyCode: lastChar.charCodeAt(0),
                which: lastChar.charCodeAt(0),
                bubbles: true,
                cancelable: true
              }));
              
              // Log after retyping
              logFieldState('AFTER_RETYPING');
              
              // Final validation events
              setTimeout(() => {
                // Change event
                field.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
                
                // React compatibility
                if (field._valueTracker) {
                  field._valueTracker.setValue('');
                }
                
                // Log after change event
                logFieldState('AFTER_CHANGE_EVENT');
                
                // Tab away simulation
                field.dispatchEvent(new KeyboardEvent('keydown', { 
                  key: 'Tab',
                  code: 'Tab',
                  keyCode: 9,
                  which: 9,
                  bubbles: true,
                  cancelable: true
                }));
                
                // Blur events
                field.dispatchEvent(new Event('blur', { bubbles: true }));
                field.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
                
                // Final state check
                setTimeout(() => {
                  logFieldState('FINAL');
                  
                  // If field still appears invalid, try alternative validation triggers
                  const isStillInvalid = field.classList.contains('error') || 
                                        field.classList.contains('invalid') || 
                                        field.classList.contains('ng-invalid') ||
                                        field.getAttribute('aria-invalid') === 'true';
                  
                  if (isStillInvalid) {
                    console.log('⚠️ [CREDENTIALS] Field still appears invalid, trying alternative triggers...');
                    
                    // Alternative 1: Try triggering validation methods directly
                    try {
                      if (field.checkValidity && typeof field.checkValidity === 'function') {
                        console.log('🔄 [ALT-1] Calling field.checkValidity()...');
                        field.checkValidity();
                      }
                      
                      if (field.reportValidity && typeof field.reportValidity === 'function') {
                        console.log('🔄 [ALT-1] Calling field.reportValidity()...');
                        field.reportValidity();
                      }
                    } catch (e) {
                      console.log('⚠️ [ALT-1] Validation method call failed:', e.message);
                    }
                    
                    // Alternative 2: Try form-level validation
                    try {
                      const form = field.closest('form');
                      if (form && form.checkValidity && typeof form.checkValidity === 'function') {
                        console.log('🔄 [ALT-2] Calling form.checkValidity()...');
                        form.checkValidity();
                      }
                    } catch (e) {
                      console.log('⚠️ [ALT-2] Form validation call failed:', e.message);
                    }
                    
                    // Alternative 3: Try custom validation events
                    console.log('🔄 [ALT-3] Trying custom validation events...');
                    field.dispatchEvent(new Event('validate', { bubbles: true }));
                    field.dispatchEvent(new Event('validation', { bubbles: true }));
                    field.dispatchEvent(new Event('check', { bubbles: true }));
                    
                    // Alternative 4: Try different focus/blur patterns
                    setTimeout(() => {
                      console.log('🔄 [ALT-4] Trying alternative focus/blur pattern...');
                      field.focus();
                      setTimeout(() => {
                        field.blur();
                        setTimeout(() => {
                          field.focus();
                          setTimeout(() => {
                            field.blur();
                            
                            // Final final check
                            setTimeout(() => {
                              logFieldState('AFTER_ALTERNATIVES');
                            }, 300);
                          }, 100);
                        }, 100);
                      }, 100);
                    }, 200);
                  }
                  
                  console.log('✅ [CREDENTIALS] Enhanced fill complete for', fieldType);
                  console.log('🔑 [CREDENTIALS] Final field value:', field.value);
                  console.log('🔑 [CREDENTIALS] Field appears valid:', !field.classList.contains('error') && field.getAttribute('aria-invalid') !== 'true');
                }, 200);
              }, 150);
            }, 150);
          }, 300);
          
          return true;
        }
        
        // Choose the appropriate filling strategy
        const fillStrategy = isCostcoExtSecondForm ? fillFieldEnhanced : fillFieldSimplified;
        const strategyName = isCostcoExtSecondForm ? 'enhanced (CostCOEXT)' : 'simplified';
        
        console.log('🔑 [CREDENTIALS] Using', strategyName, 'filling strategy');
        
        let usernameFound = false;
        let passwordFound = false;
        
        // Fill username
        if (usernameField) {
          usernameFound = fillStrategy(usernameField, employeeId, 'username');
        }
        
        // Fill password after a delay
        const delayTime = isCostcoExtSecondForm ? 1000 : 300; // Reasonable delay for simple enhanced strategy
        setTimeout(() => {
          if (passwordField) {
            passwordFound = fillStrategy(passwordField, password, 'password');
          }
          
          // Final validation after both fields are filled
          const finalDelayTime = isCostcoExtSecondForm ? 1200 : 500; // Allow time for validation to complete
          setTimeout(() => {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'credentials_filled',
              success: usernameFound && passwordFound,
              usernameFound: usernameFound,
              passwordFound: passwordFound,
              strategy: strategyName,
              isCostcoExtSecondForm: isCostcoExtSecondForm,
              message: \`\${strategyName} credential fill completed\`,
              error: (!usernameFound || !passwordFound) ? 'Some fields could not be found or filled' : null
            }));
          }, finalDelayTime);
        }, delayTime);
        
      } catch (error) {
        console.log('❌ [CREDENTIALS] Error:', error);
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'credentials_filled',
          success: false,
          error: error.message,
          smart: true
        }));
      }
    })();
    `;

    webViewRef.current.injectJavaScript(fillCredentialsScript);
  };

  const renderCredentialsStep = () => (
    <>
      <Text style={styles.title}>Corporate Schedule Login</Text>
      <Text style={styles.subtitle}>
        Connect to your corporate employee portal to view your schedule
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Employee ID</Text>
        <TextInput
          style={styles.input}
          value={employeeId}
          onChangeText={setEmployeeId}
          placeholder="Enter your employee ID"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="default"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.passwordToggleText}>
              {showPassword ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        </View>
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

      {errorMessage && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.loginButton, isLoading && styles.disabledButton]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.loginButtonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.demoButton} onPress={handleDemoMode}>
        <Text style={styles.demoButtonText}>📱 Demo Mode</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.demoButton, { borderColor: COLORS.success }]} 
        onPress={() => onLoginSuccess()}
      >
        <Text style={[styles.demoButtonText, { color: COLORS.success }]}>
          📅 My Schedule
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.demoButton, { borderColor: COLORS.info }]} 
        onPress={handleWebViewAuth}
      >
        <Text style={[styles.demoButtonText, { color: COLORS.info }]}>
          Authenticate in App (WebView)
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.demoButton, { 
          borderColor: hasStoredSchedules ? COLORS.error : COLORS.warning, 
          marginTop: SPACING.sm, 
        }]} 
        onPress={toggleOfflineStorage}
      >
        <Text style={[styles.demoButtonText, { 
          color: hasStoredSchedules ? COLORS.error : COLORS.warning, 
        }]}>
          {hasStoredSchedules ? '🗑️ Clear Offline Storage' : '🧪 Test Offline Storage'}
        </Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          This app connects to your corporate employee portal. Authentication uses your existing company credentials with enhanced security.
        </Text>
      </View>

      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToCredentials}>
          <Text style={styles.backButtonText}>← Back to Login Options</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionTextInline}>v{packageJson.version}</Text>
      </View>
    </>
  );

  const renderMFAStep = () => (
    <>
      <Text style={styles.title}>Verification Code</Text>
      <Text style={styles.subtitle}>
        Enter the verification code sent to your registered phone number
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Verification Code</Text>
        <TextInput
          style={styles.input}
          value={mfaCode}
          onChangeText={setMfaCode}
          placeholder="Enter 6-digit code"
          keyboardType="number-pad"
          maxLength={8}
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
        />
      </View>

      {errorMessage && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.loginButton, isLoading && styles.disabledButton]}
        onPress={handleMFAVerification}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.loginButtonText}>Verify Code</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={handleBackToCredentials}>
        <Text style={styles.backButtonText}>← Back to Login</Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Check your phone for a text message with your verification code. It may take a few moments to arrive.
        </Text>
      </View>
    </>
  );

  const renderSAMLStep = () => (
    <>
      <Text style={styles.title}>Authentication Required</Text>
      <Text style={styles.subtitle}>
        SAML Single Sign-On authentication detected
      </Text>

      {errorMessage && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      <View style={styles.samlInstructions}>
        <Text style={styles.instructionTitle}>Next Steps:</Text>
        <Text style={styles.instructionText}>
          1. Complete authentication in your browser
        </Text>
        <Text style={styles.instructionText}>
          2. Wait for SMS verification code
        </Text>
        <Text style={styles.instructionText}>
          3. Return here to enter the code
        </Text>
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => setCurrentStep('MFA_CODE')}
      >
        <Text style={styles.loginButtonText}>I've Completed Browser Auth</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.demoButton, { borderColor: COLORS.primary }]}
        onPress={async () => {
          try {
            const url = APP_CONFIG.PORTAL_URLS.BASE;
            await Linking.openURL(url);
            console.log('✅ [UI] Opened browser from SAML screen:', url);
          } catch (error) {
            console.error('❌ [UI] Error opening browser from SAML screen:', error);
            Alert.alert('Error', 'Please manually open ess.costco.com in your browser');
          }
        }}
      >
        <Text style={styles.demoButtonText}>Open ESS Portal in Browser</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={handleBackToCredentials}>
        <Text style={styles.backButtonText}>← Back to Login</Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          This corporate portal uses advanced SAML Single Sign-On with 2-Factor Authentication for security.
        </Text>
      </View>
    </>
  );

  const renderWebViewStep = () => (
    <View style={styles.webViewScreenContainer}>
      <View style={styles.webViewContentContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: APP_CONFIG.PORTAL_URLS.BASE }}
          onNavigationStateChange={(navState) => {
            console.log('🌐 [WEBVIEW] === NAVIGATION EVENT ===');
            console.log('🌐 [WEBVIEW] URL:', navState.url);
            console.log('🌐 [WEBVIEW] Title:', navState.title);
            console.log('🌐 [WEBVIEW] Loading:', navState.loading);
            console.log('🌐 [WEBVIEW] Can go back:', navState.canGoBack);
            console.log('🌐 [WEBVIEW] Can go forward:', navState.canGoForward);
            
            // Detailed URL analysis for different page types
            if (navState.url.includes('bireport.costco.com')) {
              console.log('📊 [WEBVIEW] 🎯 COGNOS BI SYSTEM detected');
              if (navState.url.includes('/bi/v1/disp')) {
                console.log('📊 [WEBVIEW] 🎯 Cognos Viewer/Dispatcher page');
              }
              if (navState.url.includes('promptAction')) {
                console.log('📊 [WEBVIEW] 🎯 Prompt action detected in URL');
              }
            } else if (navState.url.includes('ess.costco.com')) {
              console.log('🏢 [WEBVIEW] 🎯 ESS PORTAL detected');
            } else if (navState.url.includes('sso.costco.com') || navState.url.includes('pingone')) {
              console.log('🔐 [WEBVIEW] 🎯 SSO/AUTHENTICATION detected');
            } else if (navState.url.includes('auth') || navState.url.includes('login')) {
              console.log('🔐 [WEBVIEW] 🎯 AUTHENTICATION page detected');
            }
            
            // Check for specific problematic redirects
            if (navState.title && navState.title.toLowerCase().includes('employee')) {
              console.log('⚠️ [WEBVIEW] 🚨 EMPLOYEE-related page detected in title');
            }
            if (navState.url.includes('error') || navState.url.includes('unauthorized')) {
              console.log('❌ [WEBVIEW] 🚨 ERROR/UNAUTHORIZED page detected');
            }
            
            console.log('🌐 [WEBVIEW] === END NAVIGATION EVENT ===');
          }}
          onLoadStart={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.log('🚀 [WEBVIEW] Load started');
            console.log('🚀 [WEBVIEW] URL:', nativeEvent.url);
            console.log('🚀 [WEBVIEW] Title:', nativeEvent.title);
          }}
          onLoadEnd={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.log('✅ [WEBVIEW] === LOAD END ===');
            console.log('✅ [WEBVIEW] URL:', nativeEvent.url);
            console.log('✅ [WEBVIEW] Title:', nativeEvent.title);
            
            // Inject page analysis script after page loads
            if (webViewRef.current) {
              const pageAnalysisScript = `
                (function() {
                  try {
                    console.log('🔍 [PAGE-ANALYSIS] === AUTO PAGE ANALYSIS ===');
                    console.log('🔍 [PAGE-ANALYSIS] URL:', window.location.href);
                    console.log('🔍 [PAGE-ANALYSIS] Title:', document.title);
                    console.log('🔍 [PAGE-ANALYSIS] Document ready state:', document.readyState);
                    
                    // Check for Employee Number prompts
                    const bodyText = document.body.textContent || document.body.innerText || '';
                    const hasEmployeePrompt = bodyText.includes('Employee Number') || 
                                            bodyText.includes('Provide a value') ||
                                            bodyText.includes('employee number') ||
                                            bodyText.includes('Employee ID required');
                    
                    if (hasEmployeePrompt) {
                      console.log('🚨 [PAGE-ANALYSIS] EMPLOYEE NUMBER PROMPT DETECTED!');
                      console.log('🚨 [PAGE-ANALYSIS] Page content (first 1000 chars):');
                      console.log(bodyText.substring(0, 1000));
                      
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'employee_prompt_detected',
                        url: window.location.href,
                        title: document.title,
                        contentPreview: bodyText.substring(0, 2000),
                        timestamp: new Date().toISOString()
                      }));
                      return;
                    }
                    
                    // Check for Cognos elements
                    const isCognosPage = document.title.includes('Cognos') || 
                                       document.title.includes('Schedule') ||
                                       bodyText.includes('IBM Cognos Viewer') ||
                                       document.querySelector('script[src*="cognos"]');
                    
                    if (isCognosPage) {
                      console.log('📊 [PAGE-ANALYSIS] COGNOS PAGE DETECTED');
                      
                      // Check for parameter page vs results page
                      const hasWeekEndDate = bodyText.includes('Week End Date');
                      const hasRunButton = document.querySelector('button[onclick*="promptAction"]') || 
                                         document.querySelector('button[id*="next"]');
                      const hasScheduleData = bodyText.includes('Total Hours') || 
                                            bodyText.includes('Employee #') ||
                                            bodyText.includes('Schedule Detail');
                      
                      console.log('📊 [PAGE-ANALYSIS] Cognos page type analysis:');
                      console.log('  - Has Week End Date:', hasWeekEndDate);
                      console.log('  - Has Run Button:', !!hasRunButton);
                      console.log('  - Has Schedule Data:', hasScheduleData);
                      
                      if (hasWeekEndDate && hasRunButton) {
                        console.log('📊 [PAGE-ANALYSIS] 🎯 PARAMETER PAGE detected');
                      } else if (hasScheduleData) {
                        console.log('📊 [PAGE-ANALYSIS] 🎯 RESULTS PAGE detected');
                      }
                    }
                    
                    // Iframe analysis
                    const iframes = document.querySelectorAll('iframe');
                    console.log('🖼️ [PAGE-ANALYSIS] Found', iframes.length, 'iframes');
                    
                    for (let i = 0; i < iframes.length; i++) {
                      const iframe = iframes[i];
                      console.log('🖼️ [PAGE-ANALYSIS] Iframe', i, ':');
                      console.log('  - Src:', iframe.src);
                      console.log('  - ID:', iframe.id);
                      console.log('  - Name:', iframe.name);
                      
                      try {
                        if (iframe.contentDocument) {
                          const iframeContent = iframe.contentDocument.body.textContent || '';
                          const iframeTitle = iframe.contentDocument.title;
                          
                          console.log('  - Accessible: YES');
                          console.log('  - Title:', iframeTitle);
                          console.log('  - Content length:', iframeContent.length);
                          
                          // Check for employee prompts in iframe
                          const hasIframeEmployeePrompt = iframeContent.includes('Employee Number') || 
                                                         iframeContent.includes('Provide a value') ||
                                                         iframeContent.includes('employee number');
                          
                          if (hasIframeEmployeePrompt) {
                            console.log('🚨 [PAGE-ANALYSIS] EMPLOYEE PROMPT IN IFRAME', i);
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                              type: 'employee_prompt_in_iframe',
                              iframeIndex: i,
                              iframeSrc: iframe.src,
                              iframeTitle: iframeTitle,
                              url: window.location.href,
                              contentPreview: iframeContent.substring(0, 2000),
                              timestamp: new Date().toISOString()
                            }));
                          }
                          
                          // Check for Cognos parameter interface in iframe
                          const hasCognosInterface = iframeContent.includes('Week End Date') && 
                                                   iframeTitle.includes('Cognos') &&
                                                   iframe.contentDocument.querySelector('[id*="PRMT_SV_"]');
                          
                          if (hasCognosInterface) {
                            console.log('✅ [PAGE-ANALYSIS] COGNOS PARAMETER INTERFACE found in iframe', i);
                            
                            // Detailed analysis of parameter elements
                            const weekDropdown = iframe.contentDocument.querySelector('select[id*="PRMT_SV_"][id*="_NS_"]');
                            const runButton = iframe.contentDocument.querySelector('button[id*="next"][id*="_NS_"]');
                            
                            console.log('  - Week dropdown found:', !!weekDropdown);
                            console.log('  - Run button found:', !!runButton);
                            
                            if (weekDropdown) {
                              console.log('  - Week dropdown ID:', weekDropdown.id);
                              console.log('  - Week dropdown options:', weekDropdown.options.length);
                            }
                            if (runButton) {
                              console.log('  - Run button ID:', runButton.id);
                              console.log('  - Run button disabled:', runButton.disabled);
                            }
                          }
                        } else {
                          console.log('  - Accessible: NO (cross-origin or not loaded)');
                        }
                      } catch (e) {
                        console.log('  - Accessible: NO (error:', e.message, ')');
                      }
                    }
                    
                    console.log('🔍 [PAGE-ANALYSIS] === END AUTO PAGE ANALYSIS ===');
                    
                  } catch (error) {
                    console.error('❌ [PAGE-ANALYSIS] Analysis error:', error);
                  }
                })();
              `;
              
              // Delay injection to ensure page is fully loaded
              global.setTimeout(() => {
                webViewRef.current?.injectJavaScript(pageAnalysisScript);
              }, 1000);
            }
          }}
          onMessage={async (event) => {
            try {
              const messageData = event.nativeEvent.data;
              console.log('📨 [WEBVIEW] Message received:', messageData);
              
              // Try to parse as JSON for structured messages
              try {
                const parsedMessage = JSON.parse(messageData);
                console.log('📨 [WEBVIEW] Parsed message:', parsedMessage);
                
                if (parsedMessage.type === 'manual_extraction') {
                  console.log('🍪 [WEBVIEW] Manual cookie extraction successful!');
                  console.log('📍 [WEBVIEW] URL:', parsedMessage.url);
                  console.log('🍪 [WEBVIEW] Cookies length:', parsedMessage.cookies?.length || 0);
                  
                  if (parsedMessage.cookies && parsedMessage.cookies.length > 0) {
                    // Store the session cookies
                    await authService.storeWebViewSession(parsedMessage.cookies, {
                      url: parsedMessage.url,
                      title: parsedMessage.title,
                      timestamp: parsedMessage.timestamp,
                    });
                    
                    Alert.alert(
                      'Cookies Extracted! 🍪',
                      `Successfully captured session cookies from: ${parsedMessage.url}\n\nCookie data: ${parsedMessage.cookies.length} characters`,
                      [
                        {
                          text: 'Test Session',
                          onPress: async () => {
                            const hasAccess = await authService.testAuthenticatedAccess();
                            if (hasAccess) {
                              Alert.alert(
                                'Session Working! ✅',
                                'Ready to extract schedule data!',
                                [{ text: 'Continue', onPress: () => onLoginSuccess() }],
                              );
                            } else {
                              Alert.alert('Session Test Failed', 'Could not verify access with extracted cookies.');
                            }
                          },
                        },
                        { text: 'OK' },
                      ],
                    );
                  } else {
                    Alert.alert('No Cookies', 'No cookies found on this page. Make sure you are logged in.');
                  }
                } else if (parsedMessage.type === 'schedule_html') {
                  console.log('📄 [WEBVIEW] Received schedule HTML for parsing');
                  console.log('📍 [WEBVIEW] URL of HTML:', parsedMessage.url);
                  console.log('📋 [WEBVIEW] Title of HTML:', parsedMessage.title);
                  
                  if (parsedMessage.html && parsedMessage.html.length > 0) {
                    const scheduleService = ScheduleService.getInstance();
                    const realSchedule = await scheduleService.parseAndSaveRealSchedule(parsedMessage.html);
                    
                    if (realSchedule) {
                      Alert.alert(
                        'Real Schedule Found! 🎉',
                        `Successfully parsed and saved your real schedule data!\n\nWeek: ${realSchedule.weekStart} - ${realSchedule.weekEnd}\nTotal Hours: ${realSchedule.totalHours}\nEmployee: ${realSchedule.employee.name}`,
                        [
                          { text: 'View Schedule', onPress: () => onLoginSuccess() },
                        ],
                      );
                    } else {
                      // Parsing failed - offer to copy HTML for debugging
                      Alert.alert(
                        'Parsing Failed - Debug Options',
                        'Could not parse schedule data. Would you like to log the HTML content for debugging?',
                        [
                          { 
                            text: 'Log HTML Details', 
                            onPress: () => {
                              console.log('🔍 [DEBUG] Full HTML content for debugging:');
                              console.log('URL:', parsedMessage.url);
                              console.log('Title:', parsedMessage.title);
                              console.log('HTML Length:', parsedMessage.html.length);
                              console.log('HTML Content (first 3000 chars):', parsedMessage.html.substring(0, 3000));
                              console.log('HTML Content (middle section):', parsedMessage.html.substring(Math.floor(parsedMessage.html.length / 2) - 1500, Math.floor(parsedMessage.html.length / 2) + 1500));
                              console.log('HTML Content (last 3000 chars):', parsedMessage.html.substring(Math.max(0, parsedMessage.html.length - 3000)));
                              
                              // Also try to find specific patterns we're looking for
                              console.log('🔍 [DEBUG] Pattern analysis:');
                              console.log('Contains "Name":', parsedMessage.html.includes('Name'));
                              console.log('Contains "Employee #":', parsedMessage.html.includes('Employee #'));
                              console.log('Contains "Location":', parsedMessage.html.includes('Location'));
                              console.log('Contains "Department":', parsedMessage.html.includes('Department'));
                              console.log('Contains "Weekly Schedule":', parsedMessage.html.includes('Weekly Schedule'));
                              
                              Alert.alert('HTML Logged', 'Check the console/logs for detailed HTML content and pattern analysis.');
                            },
                          },
                          { 
                            text: 'Copy to Clipboard', 
                            onPress: async () => {
                              try {
                                await Clipboard.setStringAsync(parsedMessage.html);
                                Alert.alert('HTML Copied', 'The HTML content has been copied to your clipboard for debugging.');
                              } catch (error) {
                                console.error('Failed to copy HTML:', error);
                                // Fallback: just log it
                                console.log('🔍 [DEBUG] Full HTML content (clipboard failed):');
                                console.log(parsedMessage.html);
                                Alert.alert('Copy Failed', 'Could not copy to clipboard, but HTML has been logged to console.');
                              }
                            },
                          },
                          { text: 'Cancel' },
                        ],
                      );
                    }
                  } else {
                    Alert.alert('No HTML Content', 'The WebView returned empty HTML. Please ensure the page is loaded correctly.');
                  }
                } else if (parsedMessage.type === 'schedule_html_error') {
                  console.error('❌ [WEBVIEW] HTML extraction error from script:', parsedMessage.error);
                  Alert.alert('HTML Extraction Error', `Error getting page content: ${parsedMessage.error}`);
                } else if (parsedMessage.type === 'enhanced_schedule_html') {
                  console.log('🔍 [WEBVIEW] Enhanced schedule extraction results:');
                  console.log('📍 [WEBVIEW] URL:', parsedMessage.url);
                  console.log('📋 [WEBVIEW] Title:', parsedMessage.title);
                  console.log('🖼️ [WEBVIEW] Found in iframe:', parsedMessage.foundInIframe);
                  console.log('📊 [WEBVIEW] Iframe count:', parsedMessage.iframeCount);
                  console.log('✅ [WEBVIEW] Has schedule content:', parsedMessage.hasScheduleContent);
                  console.log('📏 [WEBVIEW] Main HTML length:', parsedMessage.mainHtmlLength);
                  console.log('📏 [WEBVIEW] Schedule HTML length:', parsedMessage.scheduleHtmlLength);
                  
                  if (parsedMessage.html && parsedMessage.html.length > 0) {
                    if (parsedMessage.hasScheduleContent) {
                      console.log('🎯 [WEBVIEW] Found specific schedule content, attempting to parse...');
                      const scheduleService = ScheduleService.getInstance();
                      const realSchedule = await scheduleService.parseAndSaveRealSchedule(parsedMessage.html);
                      
                      if (realSchedule) {
                        Alert.alert(
                          'Real Schedule Found! 🎉',
                          `Successfully parsed and saved your real schedule data!\n\nWeek: ${realSchedule.weekStart} - ${realSchedule.weekEnd}\nTotal Hours: ${realSchedule.totalHours}\nEmployee: ${realSchedule.employee.name}\n\nSource: ${parsedMessage.foundInIframe ? 'iframe' : 'main document'}`,
                          [
                            { text: 'View Schedule', onPress: () => onLoginSuccess() },
                          ],
                        );
                      } else {
                        Alert.alert(
                          'Parsing Failed - Enhanced Debug',
                          `Found potential schedule content but parsing failed.\n\nSource: ${parsedMessage.foundInIframe ? 'iframe' : 'main document'}\nContent length: ${parsedMessage.scheduleHtmlLength}\n\nWould you like to debug the content?`,
                          [
                            { 
                              text: 'Debug Content', 
                              onPress: () => {
                                console.log('🔍 [DEBUG] Enhanced extraction debug info:');
                                console.log('Found in iframe:', parsedMessage.foundInIframe);
                                console.log('Iframe count:', parsedMessage.iframeCount);
                                console.log('Schedule content length:', parsedMessage.scheduleHtmlLength);
                                console.log('Schedule HTML (first 3000 chars):', parsedMessage.html.substring(0, 3000));
                                console.log('Schedule HTML (middle section 1):', parsedMessage.html.substring(Math.floor(parsedMessage.html.length * 0.25), Math.floor(parsedMessage.html.length * 0.25) + 3000));
                                console.log('Schedule HTML (middle section 2):', parsedMessage.html.substring(Math.floor(parsedMessage.html.length * 0.5), Math.floor(parsedMessage.html.length * 0.5) + 3000));
                                console.log('Schedule HTML (middle section 3):', parsedMessage.html.substring(Math.floor(parsedMessage.html.length * 0.75), Math.floor(parsedMessage.html.length * 0.75) + 3000));
                                console.log('Schedule HTML (last 3000 chars):', parsedMessage.html.substring(Math.max(0, parsedMessage.html.length - 3000)));
                                
                                // Enhanced pattern analysis
                                console.log('🔍 [DEBUG] Enhanced pattern analysis:');
                                console.log('Contains "Weekly Schedule":', parsedMessage.html.includes('Weekly Schedule'));
                                console.log('Contains "Employee #":', parsedMessage.html.includes('Employee #'));
                                console.log('Contains "Total Hours":', parsedMessage.html.includes('Total Hours'));
                                console.log('Contains "Schedule Detail":', parsedMessage.html.includes('Schedule Detail'));
                                console.log('Contains "LUCAS":', parsedMessage.html.includes('LUCAS'));
                                console.log('Contains "ALBERS":', parsedMessage.html.includes('ALBERS'));
                                console.log('Contains "6570527":', parsedMessage.html.includes('6570527'));
                                
                                // Find specific positions of key data
                                const lucasPos = parsedMessage.html.indexOf('LUCAS');
                                const employeePos = parsedMessage.html.indexOf('Employee #');
                                const schedulePos = parsedMessage.html.indexOf('Weekly Schedule');
                                
                                console.log('🔍 [DEBUG] Key data positions:');
                                console.log('LUCAS position:', lucasPos);
                                console.log('Employee # position:', employeePos);
                                console.log('Weekly Schedule position:', schedulePos);
                                
                                if (lucasPos > 0) {
                                  console.log('Context around LUCAS:', parsedMessage.html.substring(Math.max(0, lucasPos - 500), lucasPos + 500));
                                }
                                if (employeePos > 0) {
                                  console.log('Context around Employee #:', parsedMessage.html.substring(Math.max(0, employeePos - 500), employeePos + 500));
                                }
                                
                                Alert.alert('Debug Complete', 'Check console for detailed analysis of the extracted content.');
                              },
                            },
                            { text: 'Cancel' },
                          ],
                        );
                      }
                    } else {
                      Alert.alert(
                        'No Schedule Content Found',
                        `Searched ${parsedMessage.iframeCount} iframes and main document but no schedule-specific content was found.\n\nThis might mean:\n1. The schedule hasn't loaded yet\n2. It's in a cross-origin iframe we can't access\n3. It's loaded dynamically via AJAX\n\nTry waiting for the page to fully load or navigate to the actual schedule report.`,
                        [{ text: 'OK' }],
                      );
                    }
                  } else {
                    Alert.alert('No Content', 'No HTML content was extracted.');
                  }
                } else if (parsedMessage.type === 'delayed_schedule_html') {
                  console.log('⏳ [WEBVIEW] Delayed schedule search results:');
                  console.log('📍 [WEBVIEW] URL:', parsedMessage.url);
                  console.log('🔍 [WEBVIEW] Searched elements:', parsedMessage.searchedElements);
                  console.log('✅ [WEBVIEW] Has schedule content:', parsedMessage.hasScheduleContent);
                  
                  if (parsedMessage.hasScheduleContent && parsedMessage.html) {
                    console.log('🎯 [WEBVIEW] Found schedule content after waiting, attempting to parse...');
                    const scheduleService = ScheduleService.getInstance();
                    const realSchedule = await scheduleService.parseAndSaveRealSchedule(parsedMessage.html);
                    
                    if (realSchedule) {
                      Alert.alert(
                        'Schedule Found After Waiting! 🎉',
                        `Successfully found and parsed schedule data after waiting for dynamic content!\n\nWeek: ${realSchedule.weekStart} - ${realSchedule.weekEnd}\nTotal Hours: ${realSchedule.totalHours}\nEmployee: ${realSchedule.employee.name}`,
                        [
                          { text: 'View Schedule', onPress: () => onLoginSuccess() },
                        ],
                      );
                    } else {
                      Alert.alert(
                        'Still No Luck',
                        'Found potential schedule content after waiting, but parsing still failed. The content structure might be different than expected.',
                        [
                          { 
                            text: 'Debug This Content', 
                            onPress: () => {
                              console.log('🔍 [DEBUG] Delayed search content debug:');
                              console.log('Content length:', parsedMessage.html.length);
                              console.log('Content preview:', parsedMessage.html.substring(0, 2000));
                              Alert.alert('Debug Complete', 'Check console for content details.');
                            },
                          },
                          { text: 'OK' },
                        ],
                      );
                    }
                  } else {
                    Alert.alert(
                      'No Schedule Content Found',
                      `Even after waiting for dynamic content, no schedule data was found.\n\nSearched ${parsedMessage.searchedElements} elements and ${parsedMessage.iframeCount} iframes.\n\nThe schedule might be:\n1. In a cross-origin iframe\n2. Loaded via a different mechanism\n3. Not yet available on this page`,
                      [{ text: 'OK' }],
                    );
                  }
                } else if (parsedMessage.type === 'extraction_error') {
                  console.error('❌ [WEBVIEW] Extraction error:', parsedMessage.error);
                  Alert.alert('Extraction Error', parsedMessage.error);
                } else if (parsedMessage.type === 'credentials_filled') {
                  console.log('🔑 [WEBVIEW] Credentials fill result:', parsedMessage);
                  if (parsedMessage.success) {
                    Alert.alert(
                      'Credentials Filled! 🔑',
                      `Successfully filled login fields:\n\n${parsedMessage.usernameFound ? '✅ Username/Employee ID' : '❌ Username field not found'}\n${parsedMessage.passwordFound ? '✅ Password' : '❌ Password field not found'}\n\nYou can now proceed with login on the webpage.`,
                      [{ text: 'OK' }],
                    );
                  } else {
                    Alert.alert(
                      'Could Not Fill Credentials',
                      `Unable to automatically fill login fields: ${parsedMessage.error}\n\nThis might happen if:\n• The page hasn't fully loaded\n• The login form uses non-standard field names\n• The fields are in an iframe\n\nYou can manually enter your credentials in the webpage.`,
                      [{ text: 'OK' }],
                    );
                  }
                } else if (parsedMessage.type === 'multiple_schedules_extracted') {
                  console.log('📅 [WEBVIEW] Multiple schedules extracted:', parsedMessage);
                  const { schedules, totalWeeks } = parsedMessage;
                  
                  if (schedules && schedules.length > 0) {
                    console.log(`📅 [WEBVIEW] Processing ${schedules.length} schedules...`);
                    
                    let successCount = 0;
                    let failCount = 0;
                    const scheduleService = ScheduleService.getInstance();
                    
                    // Process each schedule
                    for (let i = 0; i < schedules.length; i++) {
                      const schedule = schedules[i];
                      console.log(`📅 [WEBVIEW] Processing schedule ${schedule.weekNumber}: ${schedule.weekText}`);
                      
                      try {
                        const parsedSchedule = await scheduleService.parseAndSaveRealSchedule(
                          schedule.html,
                        );
                        
                        if (parsedSchedule) {
                          successCount++;
                          console.log(`✅ [WEBVIEW] Successfully parsed schedule ${schedule.weekNumber}`);
                        } else {
                          failCount++;
                          console.log(`❌ [WEBVIEW] Failed to parse schedule ${schedule.weekNumber}`);
                        }
                      } catch (error) {
                        failCount++;
                        console.error(`❌ [WEBVIEW] Error parsing schedule ${schedule.weekNumber}:`, error);
                      }
                    }
                    
                    // Show results
                    Alert.alert(
                      'Multi-Week Extraction Complete! 📅',
                      `Successfully processed ${totalWeeks} weeks:\n\n✅ Successfully parsed: ${successCount} schedules\n${failCount > 0 ? `❌ Failed to parse: ${failCount} schedules\n` : ''}\nAll available schedule data has been saved to the app.`,
                      [
                        { 
                          text: 'View My Schedule', 
                          onPress: () => onLoginSuccess(), 
                        },
                        { text: 'Stay Here', style: 'cancel' },
                      ],
                    );
                  } else {
                    Alert.alert(
                      'No Schedules Found',
                      `Attempted to extract ${totalWeeks} weeks but no schedule data was found. The page might not have loaded properly or the schedule format may have changed.`,
                      [{ text: 'OK' }],
                    );
                  }
                } else if (parsedMessage.type === 'week1_success') {
                  console.log('✅ [WEBVIEW] Week 1 test successful:', parsedMessage);
                  const scheduleService = ScheduleService.getInstance();
                  
                  try {
                    const parsedSchedule = await scheduleService.parseAndSaveRealSchedule(parsedMessage.html);
                    
                    if (parsedSchedule) {
                      Alert.alert(
                        'Week 1 Success! 🎉',
                        `Successfully loaded and parsed Week 1 schedule!\n\nSelected Week: ${parsedMessage.selectedWeek}\nChecks Required: ${parsedMessage.checksRequired}\nEmployee: ${parsedSchedule.employee.name}\nTotal Hours: ${parsedSchedule.totalHours}\n\nThe dropdown selection and run button clicking is working correctly!`,
                        [
                          { text: 'View Schedule', onPress: () => onLoginSuccess() },
                          { text: 'Continue Testing', style: 'cancel' },
                        ],
                      );
                    } else {
                      Alert.alert(
                        'Week 1 Loaded But Parse Failed',
                        `Week 1 schedule loaded successfully (${parsedMessage.checksRequired} checks), but parsing failed.\n\nSelected Week: ${parsedMessage.selectedWeek}\nURL: ${parsedMessage.url}\n\nThe dropdown and button interaction is working, but the schedule format might be different than expected.`,
                        [
                          { 
                            text: 'Debug Content', 
                            onPress: () => {
                              console.log('🔍 [DEBUG] Week 1 content for debugging:');
                              console.log('Selected Week:', parsedMessage.selectedWeek);
                              console.log('URL:', parsedMessage.url);
                              console.log('Title:', parsedMessage.title);
                              console.log('HTML Length:', parsedMessage.html.length);
                              console.log('HTML Preview:', parsedMessage.html.substring(0, 2000));
                              Alert.alert('Debug Complete', 'Check console for Week 1 content details.');
                            },
                          },
                          { text: 'OK' },
                        ],
                      );
                    }
                  } catch (error) {
                    console.error('❌ [WEBVIEW] Error processing Week 1 schedule:', error);
                    Alert.alert(
                      'Week 1 Processing Error',
                      `Week 1 loaded but processing failed: ${error instanceof Error ? error.message : 'Unknown error'}\n\nSelected Week: ${parsedMessage.selectedWeek}`,
                      [{ text: 'OK' }],
                    );
                  }
                } else if (parsedMessage.type === 'week1_timeout') {
                  console.log('⚠️ [WEBVIEW] Week 1 test timeout:', parsedMessage);
                  Alert.alert(
                    'Week 1 Timeout ⏰',
                    `Week 1 test timed out after ${parsedMessage.checksAttempted} checks.\n\nSelected Week: ${parsedMessage.selectedWeek}\nStuck on Parameter Page: ${parsedMessage.stuckOnParameterPage ? 'Yes' : 'No'}\nURL: ${parsedMessage.url}\n\n${parsedMessage.stuckOnParameterPage ? 'The run button click may not be working properly.' : 'The page may be loading slowly or the schedule format changed.'}`,
                    [
                      { 
                        text: 'Debug Content', 
                        onPress: () => {
                          console.log('🔍 [DEBUG] Week 1 timeout debugging:');
                          console.log('Selected Week:', parsedMessage.selectedWeek);
                          console.log('Checks Attempted:', parsedMessage.checksAttempted);
                          console.log('Stuck on Parameter Page:', parsedMessage.stuckOnParameterPage);
                          console.log('URL:', parsedMessage.url);
                          console.log('Title:', parsedMessage.title);
                          console.log('Final Content Length:', parsedMessage.html.length);
                          console.log('Final Content Preview:', parsedMessage.html.substring(0, 2000));
                          Alert.alert('Debug Complete', 'Check console for Week 1 timeout details.');
                        },
                      },
                      { text: 'OK' },
                    ],
                  );
                } else if (parsedMessage.type === 'week1_error') {
                  console.log('❌ [WEBVIEW] Week 1 test error:', parsedMessage);
                  Alert.alert(
                    'Week 1 Test Error ❌',
                    `Week 1 test failed: ${parsedMessage.error}\n\nThis helps us identify what's not working in the dropdown selection process.`,
                    [{ text: 'OK' }],
                  );
                } else if (parsedMessage.type === 'week1_iframe_success') {
                  console.log('✅ [WEBVIEW] Week 1 iframe success:', parsedMessage);
                  const scheduleService = ScheduleService.getInstance();
                  
                  try {
                    const parsedSchedule = await scheduleService.parseAndSaveRealSchedule(parsedMessage.html);
                    
                    if (parsedSchedule) {
                      Alert.alert(
                        'Week 1 Iframe Success! 🎉',
                        `Successfully loaded and parsed Week 1 schedule from iframe!\n\nSelected Week: ${parsedMessage.selectedWeek}\nChecks Required: ${parsedMessage.checksRequired}\nEmployee: ${parsedSchedule.employee.name}\nTotal Hours: ${parsedSchedule.totalHours}\n\nThe iframe dropdown selection and run button clicking is working correctly!`,
                        [
                          { text: 'View Schedule', onPress: () => onLoginSuccess() },
                          { text: 'Continue Testing', style: 'cancel' },
                        ],
                      );
                    } else {
                      Alert.alert(
                        'Week 1 Iframe Loaded But Parse Failed',
                        `Week 1 schedule loaded successfully from iframe (${parsedMessage.checksRequired} checks), but parsing failed.\n\nSelected Week: ${parsedMessage.selectedWeek}\nMain URL: ${parsedMessage.url}\nIframe URL: ${parsedMessage.iframeUrl}\n\nThe iframe dropdown and button interaction is working!`,
                        [
                          { 
                            text: 'Debug Content', 
                            onPress: () => {
                              console.log('🔍 [DEBUG] Week 1 iframe content for debugging:');
                              console.log('Selected Week:', parsedMessage.selectedWeek);
                              console.log('Main URL:', parsedMessage.url);
                              console.log('Iframe URL:', parsedMessage.iframeUrl);
                              console.log('Main Title:', parsedMessage.title);
                              console.log('Iframe Title:', parsedMessage.iframeTitle);
                              console.log('HTML Length:', parsedMessage.html.length);
                              console.log('HTML Preview:', parsedMessage.html.substring(0, 2000));
                              Alert.alert('Debug Complete', 'Check console for Week 1 iframe content details.');
                            },
                          },
                          { text: 'OK' },
                        ],
                      );
                    }
                  } catch (error) {
                    console.error('❌ [WEBVIEW] Error processing Week 1 iframe schedule:', error);
                    Alert.alert(
                      'Week 1 Iframe Processing Error',
                      `Week 1 loaded from iframe but processing failed: ${error instanceof Error ? error.message : 'Unknown error'}\n\nSelected Week: ${parsedMessage.selectedWeek}`,
                      [{ text: 'OK' }],
                    );
                  }
                } else if (parsedMessage.type === 'week1_iframe_timeout') {
                  console.log('⚠️ [WEBVIEW] Week 1 iframe timeout:', parsedMessage);
                  Alert.alert(
                    'Week 1 Iframe Timeout ⏰',
                    `Week 1 test timed out in iframe after ${parsedMessage.checksAttempted} checks.\n\nSelected Week: ${parsedMessage.selectedWeek}\nStuck on Parameter Page: ${parsedMessage.stuckOnParameterPage ? 'Yes' : 'No'}\nMain URL: ${parsedMessage.url}\nIframe URL: ${parsedMessage.iframeUrl}\n\n${parsedMessage.stuckOnParameterPage ? 'The run button click in iframe may not be working properly.' : 'The iframe page may be loading slowly or the schedule format changed.'}`,
                    [
                      { 
                        text: 'Debug Content', 
                        onPress: () => {
                          console.log('🔍 [DEBUG] Week 1 iframe timeout debugging:');
                          console.log('Selected Week:', parsedMessage.selectedWeek);
                          console.log('Checks Attempted:', parsedMessage.checksAttempted);
                          console.log('Stuck on Parameter Page:', parsedMessage.stuckOnParameterPage);
                          console.log('Main URL:', parsedMessage.url);
                          console.log('Iframe URL:', parsedMessage.iframeUrl);
                          console.log('Main Title:', parsedMessage.title);
                          console.log('Iframe Title:', parsedMessage.iframeTitle);
                          console.log('Final Content Length:', parsedMessage.html.length);
                          console.log('Final Content Preview:', parsedMessage.html.substring(0, 2000));
                          Alert.alert('Debug Complete', 'Check console for Week 1 iframe timeout details.');
                        },
                      },
                      { text: 'OK' },
                    ],
                  );
                } else if (parsedMessage.type === 'week1_iframe_error') {
                  console.log('❌ [WEBVIEW] Week 1 iframe error:', parsedMessage);
                  Alert.alert(
                    'Week 1 Iframe Error ❌',
                    `Week 1 iframe test failed: ${parsedMessage.error}\n\nThis helps us identify what's not working in the iframe dropdown selection process.`,
                    [{ text: 'OK' }],
                  );
                } else if (parsedMessage.type === 'page_diagnostic') {
                  console.log('🔍 [WEBVIEW] Page diagnostic results:', parsedMessage);
                  Alert.alert(
                    'Page Diagnostics Results 🔍',
                    'Current Page Analysis:\n\n' +
                    `URL: ${parsedMessage.url.substring(0, 50)}...\n` +
                    `Title: ${parsedMessage.title}\n` +
                    `Content Length: ${parsedMessage.contentLength}\n` +
                    `Select Elements: ${parsedMessage.selectCount}\n` +
                    `Button Elements: ${parsedMessage.buttonCount}\n` +
                    `Iframe Elements: ${parsedMessage.iframeCount}\n\n` +
                    'Key Content:\n' +
                    `• Weekly Schedule: ${parsedMessage.hasWeeklySchedule ? '✅' : '❌'}\n` +
                    `• Week End Date: ${parsedMessage.hasWeekEndDate ? '✅' : '❌'}\n` +
                    `• Cognos: ${parsedMessage.hasCognos ? '✅' : '❌'}\n\n` +
                    `Page State: ${parsedMessage.readyState}\n\n` +
                    `${parsedMessage.selectCount === 0 ? 'No dropdowns found - you may need to navigate to the schedule selection page.' : 'Dropdowns found - check console for details.'}`,
                    [
                      { 
                        text: 'View Content Preview', 
                        onPress: () => {
                          console.log('🔍 [DEBUG] Page content preview:');
                          console.log('URL:', parsedMessage.url);
                          console.log('Title:', parsedMessage.title);
                          console.log('Content Preview (1000 chars):');
                          console.log(parsedMessage.contentPreview);
                          Alert.alert('Content Preview', 'Check console for full content preview.');
                        },
                      },
                      { text: 'OK' },
                    ],
                  );
                } else if (parsedMessage.type === 'enhanced_diagnostic_started') {
                  console.log('🔍 [WEBVIEW] Enhanced diagnostic started:', parsedMessage);
                  Alert.alert(
                    'Enhanced Diagnostics Started 🔍',
                    `Enhanced analysis initiated for: ${parsedMessage.title}\n\n` +
                    `Initial dropdown detection: ${parsedMessage.initialDropdowns} elements\n\n` +
                    `${parsedMessage.message}\n\n` +
                    'Complete results will be available in 3-4 seconds. Check console for detailed progress.',
                    [{ text: 'OK' }],
                  );
                } else if (parsedMessage.type === 'enhanced_diagnostic_complete') {
                  console.log('🔍 [WEBVIEW] Enhanced diagnostic complete:', parsedMessage);
                  const delayed = parsedMessage.detectionResults?.delayed || {};
                  
                  Alert.alert(
                    'Enhanced Diagnostics Complete 🔍',
                    'Comprehensive Dropdown Analysis Results:\n\n' +
                    '📊 DETECTION SUMMARY:\n' +
                    `• Total Dropdowns Found: ${parsedMessage.totalDropdowns}\n` +
                    `• Standard HTML <select>: ${delayed.standardSelects || 0}\n` +
                    `• ARIA Comboboxes: ${delayed.roleComboboxes || 0}\n` +
                    `• Custom Dropdowns: ${delayed.customDropdowns || 0}\n` +
                    `• Iframe Dropdowns: ${parsedMessage.iframeDropdowns || 0}\n\n` +
                    '🔍 CONTEXT ANALYSIS:\n' +
                    `• "Week End Date" elements: ${parsedMessage.weekEndDateElements}\n` +
                    `• "Weekly Schedule" elements: ${parsedMessage.weeklyScheduleElements}\n` +
                    `• Iframe count: ${parsedMessage.iframeCount}\n\n` +
                    '🔧 TECHNICAL INFO:\n' +
                    `• WebView Environment: ${parsedMessage.isWebView ? '✅' : '❌'}\n` +
                    `• Framework Detection: ${Object.keys(parsedMessage.frameworks || {}).filter(fw => parsedMessage.frameworks[fw]).join(', ') || 'None'}\n\n` +
                    `💡 RECOMMENDATION:\n${parsedMessage.recommendations}`,
                    [
                      { 
                        text: 'View Frameworks', 
                        onPress: () => {
                          const frameworks = parsedMessage.frameworks || {};
                          const frameworkInfo = Object.keys(frameworks).map(fw => `${fw.toUpperCase()}: ${frameworks[fw] ? '✅' : '❌'}`).join('\n');
                          Alert.alert('Framework Detection', frameworkInfo);
                        },
                      },
                      { 
                        text: 'View Detection Details', 
                        onPress: () => {
                          console.log('🔍 [DEBUG] Enhanced diagnostic details:');
                          console.log('Full results:', parsedMessage);
                          Alert.alert('Detection Details', 'Check console for complete detection breakdown including timing analysis, iframe inspection, and framework-specific findings.');
                        },
                      },
                      { text: 'OK' },
                    ],
                  );
                } else if (parsedMessage.type === 'enhanced_diagnostic_error') {
                  console.log('❌ [WEBVIEW] Enhanced diagnostic error:', parsedMessage);
                  Alert.alert(
                    'Enhanced Diagnostic Error ❌',
                    `Error during comprehensive dropdown analysis:\n\n${parsedMessage.error}\n\nThis may indicate JavaScript restrictions or page loading issues.`,
                    [
                      { 
                        text: 'View Error Details', 
                        onPress: () => {
                          console.log('❌ [DEBUG] Enhanced diagnostic error details:');
                          console.log('Error:', parsedMessage.error);
                          console.log('Stack:', parsedMessage.stack);
                          Alert.alert('Error Details', 'Check console for full error stack trace.');
                        },
                      },
                      { text: 'OK' },
                    ],
                  );
                } else if (parsedMessage.type === 'diagnostic_error') {
                  console.log('❌ [WEBVIEW] Diagnostic error:', parsedMessage);
                  Alert.alert(
                    'Diagnostic Error ❌',
                    `Error running page diagnostics: ${parsedMessage.error}`,
                    [{ text: 'OK' }],
                  );
                } else if (parsedMessage.type === 'navigation_attempted') {
                  console.log('🔄 [WEBVIEW] Navigation attempted:', parsedMessage);
                  Alert.alert(
                    'Navigation Attempted 🔄',
                    `Attempting to navigate from current page.\n\nMethod: ${parsedMessage.method}\n${parsedMessage.toUrl ? `Target: ${parsedMessage.toUrl.substring(0, 50)}...` : ''}`,
                    [{ text: 'OK' }],
                  );
                } else if (parsedMessage.type === 'navigation_failed') {
                  console.log('❌ [WEBVIEW] Navigation failed:', parsedMessage);
                  Alert.alert(
                    'Navigation Failed ❌',
                    `Could not find a way to navigate to the parameter page.\n\nReason: ${parsedMessage.error}\n\nTry manually navigating to the schedule parameter page in the WebView.`,
                    [{ text: 'OK' }],
                  );
                } else if (parsedMessage.type === 'navigation_error') {
                  console.log('❌ [WEBVIEW] Navigation error:', parsedMessage);
                  Alert.alert(
                    'Navigation Error ❌',
                    `Error during navigation attempt: ${parsedMessage.error}\n\nThe application may have blocked the navigation for security reasons.`,
                    [{ text: 'OK' }],
                  );
                } else if (parsedMessage.type === 'parameter_url_generated') {
                  console.log('📋 [WEBVIEW] Parameter URL generated:', parsedMessage);
                  Alert.alert(
                    'Parameter Page URL 📋',
                    'Current page: Viewer (showing results)\\nParameter page: Available for manual navigation\\n\\nYou can manually navigate to the parameter page by copying this URL to your browser or using the WebView address bar.',
                    [
                      { 
                        text: 'Copy URL', 
                        onPress: async () => {
                          try {
                            await Clipboard.setStringAsync(parsedMessage.parameterUrl);
                            Alert.alert('URL Copied', 'Parameter page URL copied to clipboard!');
                          } catch (error) {
                            console.error('Failed to copy URL:', error);
                            Alert.alert('Copy Failed', `Could not copy URL. Manual URL:\n\n${parsedMessage.parameterUrl}`);
                          }
                        },
                      },
                      { text: 'OK' },
                    ],
                  );
                } else if (parsedMessage.type === 'parameter_url_error') {
                  console.log('❌ [WEBVIEW] Parameter URL error:', parsedMessage);
                  Alert.alert(
                    'Cannot Generate Parameter URL ❌',
                    `${parsedMessage.error}\n\nCurrent page perspective: ${parsedMessage.perspective || 'unknown'}\n\nYou need to be on a Cognos viewer page to generate the parameter page URL.`,
                    [{ text: 'OK' }],
                  );
                } else if (parsedMessage.type === 'html_document_dump') {
                  console.log('📄 [WEBVIEW] HTML document dump received:', parsedMessage);
                  const { mainDocument, iframes, iframeCount } = parsedMessage;
                  
                  console.log('📄 [WEBVIEW] === COMPLETE HTML DOCUMENT DUMP ===');
                  console.log('📍 [WEBVIEW] URL:', parsedMessage.url);
                  console.log('📋 [WEBVIEW] Title:', parsedMessage.title);
                  console.log('📏 [WEBVIEW] Main document HTML length:', mainDocument.htmlLength);
                  console.log('📏 [WEBVIEW] Main document text length:', mainDocument.textLength);
                  console.log('🖼️ [WEBVIEW] Total iframes:', iframeCount);
                  console.log('⏰ [WEBVIEW] Timestamp:', parsedMessage.timestamp);
                  
                  console.log('');
                  console.log('📄 [WEBVIEW] === MAIN DOCUMENT HTML ===');
                  console.log('Full HTML length:', mainDocument.html.length, 'characters');
                  console.log('HTML content (first 5000 chars):');
                  console.log(mainDocument.html.substring(0, 5000));
                  console.log('');
                  console.log('HTML content (chars 5001-10000):');
                  console.log(mainDocument.html.substring(5000, 10000));
                  console.log('');
                  console.log('HTML content (chars 10001-15000):');
                  console.log(mainDocument.html.substring(10000, 15000));
                  console.log('');
                  console.log('HTML content (last 5000 chars):');
                  console.log(mainDocument.html.substring(Math.max(0, mainDocument.html.length - 5000)));
                  
                  // Log iframe details
                  if (iframes && iframes.length > 0) {
                    console.log('');
                    console.log('🖼️ [WEBVIEW] === IFRAME DETAILS ===');
                    iframes.forEach((iframe: IframeInfo, index: number) => {
                      console.log(`📄 [WEBVIEW] Iframe ${index}:`);
                      console.log('  - Index:', iframe.index);
                      console.log('  - Src:', iframe.src);
                      console.log('  - ID:', iframe.id);
                      console.log('  - Name:', iframe.name);
                      console.log('  - Accessible:', iframe.accessible);
                      console.log('  - Visible:', iframe.visible);
                      
                      if (iframe.accessible && iframe.html) {
                        console.log('  - URL:', iframe.url);
                        console.log('  - Title:', iframe.title);
                        console.log('  - HTML length:', iframe.html.length);
                        console.log('  - Text length:', iframe.textContent?.length);
                        console.log('');
                        console.log(`📄 [WEBVIEW] Iframe ${index} HTML (first 3000 chars):`);
                        console.log(iframe.html.substring(0, 3000));
                        console.log('');
                        console.log(`📄 [WEBVIEW] Iframe ${index} HTML (chars 3001-6000):`);
                        console.log(iframe.html.substring(3000, 6000));
                        console.log('');
                        console.log(`📄 [WEBVIEW] Iframe ${index} HTML (last 3000 chars):`);
                        console.log(iframe.html.substring(Math.max(0, iframe.html.length - 3000)));
                      } else {
                        console.log('  - Error:', iframe.error || 'Not accessible');
                      }
                      console.log('');
                    });
                  }
                  
                  Alert.alert(
                    'HTML Dump Complete 📄',
                    'Successfully dumped complete HTML document!\n\n' +
                    'Main Document:\n' +
                    `• HTML: ${mainDocument.htmlLength.toLocaleString()} characters\n` +
                    `• Text: ${mainDocument.textLength.toLocaleString()} characters\n\n` +
                    `Iframes: ${iframeCount} found\n` +
                    `• Accessible: ${iframes.filter((f: IframeInfo) => f.accessible).length}\n` +
                    `• Cross-origin/blocked: ${iframes.filter((f: IframeInfo) => !f.accessible).length}\n\n` +
                    'Check console for complete HTML content and iframe details.',
                    [
                      { 
                        text: 'Copy Main HTML', 
                        onPress: async () => {
                          try {
                            await Clipboard.setStringAsync(mainDocument.html);
                            Alert.alert('Copied!', 'Main document HTML copied to clipboard.');
                          } catch (_error) {
                            console.error('Failed to copy main HTML:', _error);
                            Alert.alert('Copy Failed', 'Could not copy to clipboard.');
                          }
                        },
                      },
                      { 
                        text: 'Copy Iframe HTML', 
                        onPress: async () => {
                          const accessibleIframes = iframes.filter((f: IframeInfo) => f.accessible && f.html);
                          if (accessibleIframes.length > 0) {
                            const iframeHtml = accessibleIframes.map((f: IframeInfo) => 
                              `=== IFRAME ${f.index} (${f.url}) ===\n${f.html}\n\n`,
                            ).join('');
                            try {
                              await Clipboard.setStringAsync(iframeHtml);
                              Alert.alert('Copied!', `${accessibleIframes.length} iframe HTML(s) copied to clipboard.`);
                            } catch (_error) {
                              console.error('Failed to copy iframe HTML:', _error);
                              Alert.alert('Copy Failed', 'Could not copy iframe HTML to clipboard.');
                            }
                          } else {
                            Alert.alert('No Iframe HTML', 'No accessible iframe HTML to copy.');
                          }
                        },
                      },
                      { text: 'OK' },
                    ],
                  );
                } else if (parsedMessage.type === 'html_dump_error') {
                  console.log('❌ [WEBVIEW] HTML dump error:', parsedMessage);
                  Alert.alert(
                    'HTML Dump Error ❌',
                    `Error dumping HTML document: ${parsedMessage.error}`,
                    [{ text: 'OK' }],
                  );
                } else if (parsedMessage.type === 'schedule_navigation_error') {
                  console.log('❌ [WEBVIEW] Schedule navigation error:', parsedMessage);
                  Alert.alert(
                    'Navigation Error ❌',
                    `${parsedMessage.error}\n\n${parsedMessage.weekNumber ? `Week: ${parsedMessage.weekNumber} (${parsedMessage.weekText})` : ''}`,
                    [{ text: 'OK' }],
                  );
                } else if (parsedMessage.type === 'schedule_week_loaded') {
                  console.log('📅 [WEBVIEW] Week loaded:', parsedMessage);
                  const { weekNumber, weekText, totalWeeks, contentLength } = parsedMessage;
                  console.log(`📅 [WEBVIEW] Loaded week ${weekNumber}/${totalWeeks}: ${weekText} (${contentLength} chars)`);
                } else if (parsedMessage.type === 'schedule_navigation_complete') {
                  console.log('🎉 [WEBVIEW] Navigation complete:', parsedMessage);
                  Alert.alert(
                    'Navigation Complete! 🎉',
                    `Successfully navigated through all ${parsedMessage.weeksProcessed} weeks.\n\n${parsedMessage.message}`,
                    [{ text: 'Great!' }],
                  );
                } else if (parsedMessage.type === 'employee_prompt_detected') {
                  console.log('🚨 [WEBVIEW] Employee Number prompt detected:', parsedMessage);
                  Alert.alert(
                    'Employee Number Prompt Detected! 🚨',
                    `The page is asking for employee number input.\n\nURL: ${parsedMessage.url}\nTitle: ${parsedMessage.title}\n\nThis suggests you may have been redirected to a different authentication flow or parameter page than expected.\n\nContent preview:\n${parsedMessage.contentPreview.substring(0, 200)}...`,
                    [
                      { 
                        text: 'View Full Content', 
                        onPress: () => {
                          console.log('🚨 [DEBUG] Full employee prompt page content:');
                          console.log('URL:', parsedMessage.url);
                          console.log('Title:', parsedMessage.title);
                          console.log('Full content preview:');
                          console.log(parsedMessage.contentPreview);
                          Alert.alert('Content Logged', 'Check console for full page content.');
                        },
                      },
                      { text: 'OK' },
                    ],
                  );
                } else if (parsedMessage.type === 'employee_prompt_in_iframe') {
                  console.log('🚨 [WEBVIEW] Employee prompt in iframe detected:', parsedMessage);
                  Alert.alert(
                    'Employee Prompt in Iframe! 🚨',
                    `An iframe contains an employee number prompt.\n\nIframe ${parsedMessage.iframeIndex}: ${parsedMessage.iframeSrc}\nIframe Title: ${parsedMessage.iframeTitle}\n\nThis may indicate the Cognos interface is prompting for additional employee information.`,
                    [
                      { 
                        text: 'Debug Iframe', 
                        onPress: () => {
                          console.log('🚨 [DEBUG] Iframe employee prompt details:');
                          console.log('Iframe Index:', parsedMessage.iframeIndex);
                          console.log('Iframe Src:', parsedMessage.iframeSrc);
                          console.log('Iframe Title:', parsedMessage.iframeTitle);
                          console.log('Main URL:', parsedMessage.url);
                          console.log('Iframe content preview:');
                          console.log(parsedMessage.contentPreview);
                          Alert.alert('Iframe Debug Complete', 'Check console for iframe details.');
                        },
                      },
                      { text: 'OK' },
                    ],
                  );
                } else if (parsedMessage.type === 'enhanced_load_debug') {
                  console.log('🔄 [WEBVIEW] Enhanced load debug:', parsedMessage.step, parsedMessage);
                  
                  if (parsedMessage.step === 'initialization') {
                    Alert.alert(
                      'Enhanced Debug Started 🔄',
                      `Debug script initialization successful!\n\nEnvironment:\n• URL: ${parsedMessage.environment.url.substring(0, 50)}...\n• Title: ${parsedMessage.environment.title}\n• Ready State: ${parsedMessage.environment.readyState}\n• WebView Context: ${parsedMessage.environment.hasReactNativeWebView ? '✅' : '❌'}\n\nCheck console for detailed progress...`,
                      [{ text: 'OK' }],
                    );
                  } else if (parsedMessage.step === 'iframe_analysis_complete') {
                    const { iframeAnalysis, summary } = parsedMessage;
                    Alert.alert(
                      'Iframe Analysis Complete 🖼️',
                      'Iframe Analysis Results:\n\n' +
                      '📊 SUMMARY:\n' +
                      `• Total iframes found: ${summary.totalIframes}\n` +
                      `• Accessible iframes: ${summary.accessibleIframes}\n` +
                      `• Cognos targets found: ${summary.cognosTargets}\n\n` +
                      '🔍 DETAILED ANALYSIS:\n' +
                      iframeAnalysis.map((iframe: IframeAnalysisItem, idx: number) => 
                        `Iframe ${idx}: ${iframe.accessible ? '✅' : '❌'} ${iframe.isCognosTarget ? '🎯' : ''}\n` +
                        `  • Src: ${iframe.src.substring(0, 30)}...\n` +
                        `  • Title: ${iframe.iframeTitle || '(no title)'}\n` +
                        `  • Cognos Score: ${iframe.cognosScore || 0}/8`,
                      ).join('\n\n'),
                      [
                        { 
                          text: 'View Details', 
                          onPress: () => {
                            console.log('🔍 [DEBUG] Complete iframe analysis:');
                            iframeAnalysis.forEach((iframe: IframeAnalysisItem) => {
                              console.log(`Iframe ${iframe.index}:`, iframe);
                            });
                            Alert.alert('Details Logged', 'Check console for complete iframe analysis.');
                          },
                        },
                        { text: 'OK' },
                      ],
                    );
                  } else if (parsedMessage.step === 'element_search_complete') {
                    const { foundElements } = parsedMessage;
                    Alert.alert(
                      'Element Search Complete 🔍',
                      'Element Search Results:\n\n' +
                      '📝 FOUND ELEMENTS:\n' +
                      `• Week Dropdowns: ${foundElements.weekDropdown ? foundElements.weekDropdown.length : 0}\n` +
                      `• Run Buttons: ${foundElements.runButton ? foundElements.runButton.length : 0}\n\n` +
                      '🔧 ELEMENT DETAILS:\n' +
                      Object.keys(foundElements).map(elementType => {
                        const elements = foundElements[elementType];
                        if (!elements || elements.length === 0) return `${elementType}: None found`;
                        const primary = elements[0];
                        return `${elementType}: ${elements.length} found\n` +
                               `  • Primary ID: ${primary.id}\n` +
                               `  • Visible: ${primary.visible ? '✅' : '❌'}\n` +
                               `  • Options: ${primary.optionsCount || 'N/A'}`;
                      }).join('\n\n'),
                      [
                        { 
                          text: 'View All Elements', 
                          onPress: () => {
                            console.log('🔍 [DEBUG] Complete element search results:');
                            console.log('Found elements:', foundElements);
                            console.log('Search strategies used:', parsedMessage.elementSearchStrategies);
                            Alert.alert('Elements Logged', 'Check console for complete element search details.');
                          },
                        },
                        { text: 'OK' },
                      ],
                    );
                  } else if (parsedMessage.step === 'verification_complete') {
                    const { verificationResults, allElementsFound, readyForNavigation } = parsedMessage;
                    Alert.alert(
                      `Verification ${readyForNavigation ? 'SUCCESS ✅' : 'INCOMPLETE ⚠️'}`,
                      'Element Verification Results:\n\n' +
                      '📋 WEEK DROPDOWN:\n' +
                      `• Found: ${verificationResults.weekDropdown.found ? '✅' : '❌'}\n` +
                      `• ID: ${verificationResults.weekDropdown.id || 'N/A'}\n` +
                      `• Options: ${verificationResults.weekDropdown.optionsCount}\n` +
                      `• Visible: ${verificationResults.weekDropdown.visible ? '✅' : '❌'}\n\n` +
                      '🔘 RUN BUTTON:\n' +
                      `• Found: ${verificationResults.runButton.found ? '✅' : '❌'}\n` +
                      `• ID: ${verificationResults.runButton.id || 'N/A'}\n` +
                      `• Text: ${verificationResults.runButton.text || 'N/A'}\n` +
                      `• Visible: ${verificationResults.runButton.visible ? '✅' : '❌'}\n` +
                      `• Disabled: ${verificationResults.runButton.disabled ? '❌' : '✅'}\n\n` +
                      '🎯 FINAL STATUS:\n' +
                      `• All Elements: ${allElementsFound ? '✅' : '❌'}\n` +
                      `• Ready for Navigation: ${readyForNavigation ? '✅' : '❌'}\n\n` +
                      `${parsedMessage.message}`,
                      (() => {
                        const buttons = [];
                        if (readyForNavigation) {
                          buttons.push({
                            text: 'Start Navigation!',
                            onPress: () => {
                              Alert.alert('Navigation Ready', 'All required elements found and verified! The interface is ready for automatic schedule navigation.');
                            },
                          });
                        }
                        buttons.push({ text: 'OK' });
                        return buttons;
                      })(),
                    );
                  } else if (parsedMessage.type === 'cognos_iframe_not_found') {
                    Alert.alert(
                      'Cognos Iframe Not Found ❌',
                      'Could not locate a suitable Cognos iframe for schedule interaction.\n\n' +
                      'This might happen if:\n' +
                      '• You\'re not on the schedule parameter page\n' +
                      '• The iframe content is cross-origin blocked\n' +
                      '• The Cognos interface has changed\n\n' +
                      'Current page appears to be showing schedule results rather than the parameter selection interface.',
                      [
                        { 
                          text: 'View Analysis', 
                          onPress: () => {
                            console.log('🔍 [DEBUG] Iframe analysis when no Cognos iframe found:');
                            console.log('Analysis:', parsedMessage.analysis);
                            Alert.alert('Analysis Logged', 'Check console for detailed iframe analysis.');
                          },
                        },
                        { text: 'OK' },
                      ],
                    );
                  } else if (parsedMessage.type === 'fatal_error') {
                    Alert.alert(
                      'Debug Script Error ❌',
                      `Fatal error in enhanced debug script:\n\n${parsedMessage.error}\n\nThis indicates a JavaScript execution problem in the WebView.`,
                      [
                        { 
                          text: 'View Stack', 
                          onPress: () => {
                            console.log('❌ [DEBUG] Fatal error details:');
                            console.log('Error:', parsedMessage.error);
                            console.log('Stack:', parsedMessage.stack);
                            Alert.alert('Error Details', 'Check console for full error stack trace.');
                          },
                        },
                        { text: 'OK' },
                      ],
                    );
                  }
                } else if (parsedMessage.type === 'test_run_success') {
                  console.log('✅ [WEBVIEW] Test run successful:', parsedMessage);
                  Alert.alert(
                    'Test Run Success! ✅',
                    `Successfully selected and ran the first week!\n\nSelected Week: ${parsedMessage.selectedWeek}\nWeek Value: ${parsedMessage.weekValue}\n\nRun Button Found:\n• ID: ${parsedMessage.runButtonId || 'Unknown'}\n• Text: "${parsedMessage.runButtonText || 'Unknown'}"\n\n${parsedMessage.message}`,
                    [{ text: 'Great!' }],
                  );
                } else if (parsedMessage.type === 'test_run_error') {
                  console.log('❌ [WEBVIEW] Test run error:', parsedMessage);
                  Alert.alert(
                    'Test Run Error ❌',
                    `Test run failed: ${parsedMessage.error}\n\n${parsedMessage.selectedWeek ? `Selected Week: ${parsedMessage.selectedWeek}\n\n` : 'No week was selected\n\n'}${parsedMessage.runButtonId ? `Run Button Found:\n• ID: ${parsedMessage.runButtonId}\n• Text: "${parsedMessage.runButtonText || 'Unknown'}"` : 'No run button details available'}`,
                    [{ text: 'OK' }],
                  );
                } else if (parsedMessage.type === 'next_2_weeks_error') {
                  console.log('❌ [WEBVIEW] Load next 2 weeks error:', parsedMessage);
                  Alert.alert(
                    'Load Next 2 Weeks Error ❌',
                    `Failed to load next 2 weeks: ${parsedMessage.error}`,
                    [{ text: 'OK' }],
                  );
                } else if (parsedMessage.type === 'next_2_weeks_week_loaded') {
                  console.log('📅 [WEBVIEW] Week loaded in next 2 weeks sequence:', parsedMessage);
                  Alert.alert(
                    'Week Loaded! 📅',
                    `Successfully loaded week ${parsedMessage.weekNumber}!\n\nWeek: ${parsedMessage.weekText}\nValue: ${parsedMessage.weekValue}`,
                    [{ text: 'OK' }],
                  );
                } else if (parsedMessage.type === 'next_2_weeks_complete') {
                  console.log('✅ [WEBVIEW] Load next 2 weeks complete:', parsedMessage);
                  Alert.alert(
                    'All Weeks Loaded! ✅',
                    `${parsedMessage.message}\n\nAll 3 weeks have been successfully loaded and are now available in your schedule view.`,
                    [{ text: 'Excellent!' }],
                  );
                } else if (parsedMessage.type === 'next_2_weeks_complete') {
                  console.log('✅ [WEBVIEW] Load next 2 weeks completed:', parsedMessage);
                  Alert.alert(
                    'Load Next 2 Weeks Complete ✅',
                    `Successfully loaded all 3 weeks: ${parsedMessage.message}`,
                    [{ text: 'OK' }],
                  );
                } else if (parsedMessage.type === 'next_2_weeks_week_loaded') {
                  console.log('📅 [WEBVIEW] Week loaded:', parsedMessage);
                  // Just log, don't show alert for individual weeks
                } else if (parsedMessage.type === 'cookie_data') {
                  console.log('🍪 [WEBVIEW] Cookie data received:', parsedMessage);
                  Alert.alert(
                    'Cookie Data Received 🍪',
                    `Successfully received cookie data from: ${parsedMessage.url}\n\nCookie data: ${parsedMessage.cookies?.length || 0} characters`,
                    [{ text: 'OK' }],
                  );
                }
              } catch (parseError) {
                console.log('📨 [WEBVIEW] Failed to parse message as JSON:', parseError instanceof Error ? parseError.message : 'Unknown parse error');
                console.log('📨 [WEBVIEW] Simple message:', messageData);
              }
            } catch (error) {
              console.error('❌ [WEBVIEW] Message handling error:', error);
            }
          }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('❌ [WEBVIEW] Error:', nativeEvent);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('🌐 [WEBVIEW] HTTP Error:', nativeEvent.statusCode, nativeEvent.description);
          }}
          onLoadProgress={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.log('📊 [WEBVIEW] Load progress:', Math.round(nativeEvent.progress * 100) + '%');
          }}
          style={styles.webView}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          thirdPartyCookiesEnabled={true}
          sharedCookiesEnabled={true}
          hideKeyboardAccessoryView={Platform.OS === 'ios'}
          keyboardDisplayRequiresUserAction={false}
          nestedScrollEnabled={false}
          mixedContentMode='compatibility'
          renderLoading={() => (
            <View style={styles.webViewLoading}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.webViewLoadingText}>Loading authentication page...</Text>
            </View>
          )}
        />
      </View>

      <View style={styles.webViewBottomControls}>
        <TouchableOpacity 
          style={[styles.demoButton, { borderColor: COLORS.info, marginBottom: SPACING.md }]} 
          onPress={handleFillCredentials}
        >
          <Text style={[styles.demoButtonText, { color: COLORS.info }]}>
            🔑 Fill Login Credentials
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.demoButton, { borderColor: COLORS.primary, marginBottom: SPACING.md }]} 
          onPress={async () => {
            console.log('🧪 [UI] Test Run - Selecting first week and clicking run...');
            if (!webViewRef.current) {
              Alert.alert('Error', 'WebView not ready'); 
              return;
            }
            try {
              const testRunScript = `
              (function() { 
                try { 
                  console.log('🧪 [TEST-RUN] Starting test run - first week selection and run...');
                  
                  // Find the Cognos iframe
                  let cognosIframe = null;
                  let cognosDoc = null;
                  
                  const allIframes = document.querySelectorAll('iframe');
                  console.log('🧪 [TEST-RUN] Found', allIframes.length, 'iframes to check');
                  
                  for (let i = 0; i < allIframes.length; i++) {
                    const iframe = allIframes[i];
                    try {
                      if (iframe.contentDocument && iframe.contentWindow) {
                        const iframeContent = iframe.contentDocument.documentElement.outerHTML;
                        
                        // Look for Cognos-specific elements
                        if (iframeContent.includes('Week End Date') && 
                            iframeContent.includes('IBM Cognos Viewer') &&
                            iframeContent.includes('PRMT_SV_')) {
                          console.log('✅ [TEST-RUN] Found Cognos schedule interface in iframe', i);
                          cognosIframe = iframe;
                          cognosDoc = iframe.contentDocument;
                          break;
                        }
                      }
                    } catch (e) {
                      console.log('❌ [TEST-RUN] Cannot access iframe', i, ':', e.message);
                    }
                  }
                  
                  if (!cognosIframe || !cognosDoc) {
                    console.log('❌ [TEST-RUN] Cognos iframe not found!');
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'test_run_error',
                      error: 'Cognos iframe not found. Found ' + allIframes.length + ' iframes total.'
                    }));
                    return;
                  }
                  
                  // Find the Week End Date dropdown with more specific targeting
                  console.log('🧪 [TEST-RUN] Searching for Week End Date dropdown...');
                  
                  // Look specifically for the Week End Date dropdown by checking for date-like options
                  let weekDropdown = null;
                  const allSelects = cognosDoc.querySelectorAll('select');
                  console.log('🧪 [TEST-RUN] Found', allSelects.length, 'select elements, checking each one...');
                  
                  for (let i = 0; i < allSelects.length; i++) {
                    const select = allSelects[i];
                    console.log('🧪 [TEST-RUN] Checking select', i, ':', {
                      id: select.id,
                      name: select.name,
                      optionsCount: select.options.length,
                      firstOptionValue: select.options.length > 0 ? select.options[0].value : 'none',
                      firstOptionText: select.options.length > 0 ? select.options[0].text : 'none'
                    });
                    
                    // Check if this select has date-like options (Week End Date)
                    if (select.options.length > 0) {
                      const firstOption = select.options[0];
                      const hasDateOptions = firstOption.value.includes('2025-') || 
                                           firstOption.text.includes('2025-') ||
                                           firstOption.value.includes('T00:00:00');
                      
                      // Also check for the associated hidden input with p_EndDate
                      const hasEndDateInput = cognosDoc.querySelector('input[name="p_EndDate"]') !== null;
                      
                      console.log('🧪 [TEST-RUN] Select analysis:', {
                        hasDateOptions: hasDateOptions,
                        hasEndDateInput: hasEndDateInput,
                        selectId: select.id
                      });
                      
                      if (hasDateOptions && hasEndDateInput) {
                        console.log('✅ [TEST-RUN] Found Week End Date dropdown:', select.id);
                        weekDropdown = select;
                        break;
                      }
                    }
                  }
                  
                  // Fallback to original selectors if specific search didn't work
                  if (!weekDropdown) {
                    console.log('🧪 [TEST-RUN] Using fallback selectors for Week dropdown...');
                    weekDropdown = cognosDoc.querySelector('select[id*="PRMT_SV_"][id*="_NS_"]') ||
                                 cognosDoc.querySelector('select.clsSelectControl') ||
                                 cognosDoc.querySelector('select[role="listbox"]');
                  }
                  
                  if (!weekDropdown) {
                    console.log('❌ [TEST-RUN] Week End Date dropdown not found after enhanced search!');
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'test_run_error',
                      error: 'Week End Date dropdown not found in Cognos iframe'
                    }));
                    return;
                  }
                  
                  // Find the run button with more specific targeting to avoid arrows/icons
                  console.log('🧪 [TEST-RUN] Searching for Run button...');
                  const runButtons = cognosDoc.querySelectorAll('button');
                  let runButton = null;
                  
                  // Look for the actual Run button by checking text content and avoiding arrows
                  for (let btn of runButtons) {
                    const btnText = (btn.textContent || '').trim().toLowerCase();
                    const btnId = btn.id || '';
                    const btnClass = btn.className || '';
                    
                    console.log('🧪 [TEST-RUN] Checking button:', {
                      text: btnText,
                      id: btnId,
                      class: btnClass,
                      tagName: btn.tagName
                    });
                    
                    // Look for the actual Run button (not arrows or other UI elements)
                    if (btnText === 'run' || 
                        btnId.includes('next') && btnId.includes('_NS_') ||
                        btnClass.includes('bp')) {
                      console.log('✅ [TEST-RUN] Found potential Run button:', btn.id);
                      runButton = btn;
                      break;
                    }
                  }
                  
                  // Fallback to original selectors if specific search didn't work
                  if (!runButton) {
                    console.log('🧪 [TEST-RUN] Using fallback selectors for Run button...');
                    runButton = cognosDoc.querySelector('button[id*="next"][id*="_NS_"]') ||
                               cognosDoc.querySelector('button.bp') ||
                               cognosDoc.querySelector('button[onclick*="promptAction"]') ||
                               cognosDoc.querySelector('input[type="submit"]');
                  }
                                   
                  if (!runButton) {
                    console.log('❌ [TEST-RUN] Run button not found!');
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'test_run_error',
                      error: 'Run button not found in Cognos iframe'
                    }));
                    return;
                  }
                  
                  console.log('🧪 [TEST-RUN] Found elements:');
                  console.log('  - Week dropdown ID:', weekDropdown.id);
                  console.log('  - Week dropdown tagName:', weekDropdown.tagName);
                  console.log('  - Week dropdown options:', weekDropdown.options.length);
                  console.log('  - Run button ID:', runButton.id);
                  console.log('  - Run button text:', (runButton.textContent || '').trim());
                  console.log('  - Run button tagName:', runButton.tagName);
                  console.log('  - Run button class:', runButton.className);
                  
                  if (weekDropdown.options.length === 0) {
                    console.log('❌ [TEST-RUN] No week options available!');
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'test_run_error',
                      error: 'No week options available in dropdown'
                    }));
                    return;
                  }
                  
                  // Check if dropdown is in an invalid state and try to clear it
                  const isInvalid = weekDropdown.getAttribute('aria-invalid') === 'true';
                  console.log('🧪 [TEST-RUN] Dropdown validation state - invalid:', isInvalid);
                  
                  if (isInvalid) {
                    console.log('🧪 [TEST-RUN] Dropdown is in invalid state, attempting to clear validation...');
                    weekDropdown.setAttribute('aria-invalid', 'false');
                    
                    // Also try to clear any error styling
                    const container = weekDropdown.closest('.clsTextWidgetParseError');
                    if (container) {
                      container.classList.remove('clsTextWidgetParseError');
                      console.log('🧪 [TEST-RUN] Removed error styling from container');
                    }
                  }
                  
                  // Select the first week (index 0) - this should NOT trigger clicking
                  const firstOption = weekDropdown.options[0];
                  const weekText = firstOption.text;
                  const weekValue = firstOption.value;
                  
                  console.log('🧪 [TEST-RUN] Selecting first week (programmatically, no click):', weekText);
                  console.log('🧪 [TEST-RUN] Week value:', weekValue);
                  
                  // Actually interact with the dropdown UI instead of just setting values
                  console.log('🧪 [TEST-RUN] Opening dropdown for interactive selection...');
                  
                  // First, focus the dropdown to ensure it's active
                  weekDropdown.focus();
                  
                  // Click the dropdown to open it (this should open the options list)
                  console.log('🧪 [TEST-RUN] Clicking dropdown to open options...');
                  weekDropdown.click();
                  
                  // Also try mouse events in case click alone doesn't work
                  weekDropdown.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                  weekDropdown.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                  
                  // Wait a moment for dropdown to open, then select first option
                  setTimeout(() => {
                    console.log('🧪 [TEST-RUN] Dropdown should be open, now selecting first option...');
                    
                    // Method 1: Try selecting the first option directly
                    if (weekDropdown.options.length > 0) {
                      const firstOption = weekDropdown.options[0];
                      console.log('🧪 [TEST-RUN] Selecting option:', firstOption.text, 'with value:', firstOption.value);
                      
                      // Select the option
                      weekDropdown.selectedIndex = 0;
                      weekDropdown.value = firstOption.value;
                      
                      // Mark the option as selected in the DOM
                      firstOption.selected = true;
                      
                      // Trigger all the events that a real user interaction would
                      weekDropdown.dispatchEvent(new Event('focus', { bubbles: true }));
                      weekDropdown.dispatchEvent(new Event('change', { bubbles: true }));
                      weekDropdown.dispatchEvent(new Event('input', { bubbles: true }));
                      
                      // Use Enter key to commit the selection and close dropdown
                      weekDropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, which: 13, bubbles: true }));
                      weekDropdown.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', keyCode: 13, which: 13, bubbles: true }));
                      
                      // Blur to close dropdown
                      weekDropdown.blur();
                      weekDropdown.dispatchEvent(new Event('blur', { bubbles: true }));
                      
                      // Click away from dropdown to ensure it closes
                      const body = cognosDoc.body;
                      if (body) {
                        body.click();
                      }
                      
                      console.log('🧪 [TEST-RUN] Interactive selection complete, dropdown value now:', weekDropdown.value);
                      console.log('🧪 [TEST-RUN] Selected index:', weekDropdown.selectedIndex);
                      console.log('🧪 [TEST-RUN] First option selected status:', firstOption.selected);
                      
                      // Verify the selection actually took
                      setTimeout(() => {
                        console.log('🧪 [TEST-RUN] Verification - dropdown value after delay:', weekDropdown.value);
                        console.log('🧪 [TEST-RUN] Verification - selected index after delay:', weekDropdown.selectedIndex);
                        console.log('🧪 [TEST-RUN] Verification - dropdown appears closed:', !weekDropdown.matches(':focus'));
                      }, 200);
                    }
                    
                    console.log('🧪 [TEST-RUN] Week selected, now enabling run button if needed...');
                    
                    // Enable the run button if disabled
                    if (runButton.disabled) {
                      runButton.disabled = false;
                      console.log('🧪 [TEST-RUN] Enabled run button');
                    }
                    
                    // Wait a moment longer, then click ONLY the run button
                    setTimeout(() => {
                      console.log('🧪 [TEST-RUN] About to click the Run button...');
                      console.log('🧪 [TEST-RUN] Run button details before click:');
                      console.log('  - ID:', runButton.id);
                      console.log('  - Text:', (runButton.textContent || '').trim());
                      console.log('  - Tag:', runButton.tagName);
                      console.log('  - Disabled:', runButton.disabled);
                      console.log('  - Visible:', runButton.offsetParent !== null);
                      console.log('  - Button rect:', runButton.getBoundingClientRect());
                      
                      try {
                        // Multiple approaches to ensure the Run button actually gets clicked
                        console.log('🧪 [TEST-RUN] Method 1: Direct click...');
                        runButton.click();
                        
                        console.log('🧪 [TEST-RUN] Method 2: Mouse events...');
                        runButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
                        runButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
                        runButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
                        
                        console.log('🧪 [TEST-RUN] Method 3: Focus and keyboard...');
                        runButton.focus();
                        runButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, which: 13, bubbles: true }));
                        runButton.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', keyCode: 13, which: 13, bubbles: true }));
                        
                        console.log('✅ [TEST-RUN] All run button click methods attempted!');
                        
                        // Verify something happened (page might change, button might become disabled, etc.)
                        setTimeout(() => {
                          console.log('🧪 [TEST-RUN] Post-click verification:');
                          console.log('  - Button still exists:', !!cognosDoc.getElementById(runButton.id));
                          console.log('  - Button still enabled:', !runButton.disabled);
                          console.log('  - Page title:', cognosDoc.title);
                          console.log('  - Current URL:', cognosDoc.location ? cognosDoc.location.href : 'unknown');
                        }, 1000);
                        
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                          type: 'test_run_success',
                          selectedWeek: weekText,
                          weekValue: weekValue,
                          runButtonId: runButton.id,
                          runButtonText: (runButton.textContent || '').trim(),
                          message: 'Successfully selected first week interactively and attempted multiple run button click methods'
                        }));
                        
                      } catch (clickError) {
                        console.log('❌ [TEST-RUN] Error clicking run button:', clickError);
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                          type: 'test_run_error',
                          error: 'Failed to click run button: ' + clickError.message,
                          selectedWeek: weekText,
                          runButtonId: runButton.id,
                          runButtonText: (runButton.textContent || '').trim()
                        }));
                      }
                    }, 2000); // 2 second delay after dropdown selection
                    
                  }, 500); // 0.5 second delay to let dropdown open
                  
                } catch (error) {
                  console.log('❌ [TEST-RUN] Script error:', error);
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'test_run_error',
                    error: error.message,
                    stack: error.stack
                  }));
                }
              })();`;
              
              webViewRef.current.injectJavaScript(testRunScript);
            } catch (error) {
              console.error('❌ [UI] Test run error:', error);
              Alert.alert('Test Run Error', 'Error running test: ' + (error as Error).message);
            }
          }}
        >
          <Text style={[styles.demoButtonText, { color: COLORS.primary }]}>
            🧪 Test Run
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.demoButton, { borderColor: COLORS.warning, marginBottom: SPACING.md }]} 
          onPress={async () => {
            console.log('📅 [UI] Load Next 2 Weeks - Selecting weeks 2 and 3...');
            if (!webViewRef.current) {
              Alert.alert('Error', 'WebView not ready'); 
              return;
            }
            try {
              const loadNext2WeeksScript = `
              (function() { 
                try { 
                  console.log('📅 [NEXT-2-WEEKS] Starting load next 2 weeks...');
                  
                  // Find the Cognos iframe with more robust detection
                  let cognosIframe = null;
                  let cognosDoc = null;
                  
                  const allIframes = document.querySelectorAll('iframe');
                  console.log('📅 [NEXT-2-WEEKS] Found', allIframes.length, 'iframes to check');
                  
                  for (let i = 0; i < allIframes.length; i++) {
                    const iframe = allIframes[i];
                    console.log('📅 [NEXT-2-WEEKS] Checking iframe', i, ':', {
                      src: iframe.src ? iframe.src.substring(0, 100) + '...' : 'no src',
                      id: iframe.id,
                      name: iframe.name
                    });
                    
                    try {
                      if (iframe.contentDocument && iframe.contentWindow) {
                        const iframeContent = iframe.contentDocument.documentElement.outerHTML;
                        console.log('📅 [NEXT-2-WEEKS] Iframe', i, 'content length:', iframeContent.length);
                        
                        // More flexible Cognos detection - check for any of these indicators
                        const hasCognosTitle = iframeContent.includes('IBM Cognos Viewer') || 
                                             iframeContent.includes('Schedule - IBM Cognos');
                        const hasWeekElements = iframeContent.includes('Week End Date') || 
                                              iframeContent.includes('Please choose an End of Week') ||
                                              iframeContent.includes('PRMT_SV_');
                        const hasScheduleElements = iframeContent.includes('Weekly Schedule') ||
                                                   iframeContent.includes('finishN') ||
                                                   iframeContent.includes('2025-06-');
                        
                        console.log('📅 [NEXT-2-WEEKS] Iframe', i, 'detection results:', {
                          hasCognosTitle: hasCognosTitle,
                          hasWeekElements: hasWeekElements,
                          hasScheduleElements: hasScheduleElements,
                          contentPreview: iframeContent.substring(0, 200)
                        });
                        
                        // More lenient detection - any 2 of 3 indicators
                        const cognosScore = (hasCognosTitle ? 1 : 0) + (hasWeekElements ? 1 : 0) + (hasScheduleElements ? 1 : 0);
                        if (cognosScore >= 2) {
                          console.log('✅ [NEXT-2-WEEKS] Found Cognos schedule interface in iframe', i, 'with score', cognosScore);
                          cognosIframe = iframe;
                          cognosDoc = iframe.contentDocument;
                          break;
                        } else {
                          console.log('📅 [NEXT-2-WEEKS] Iframe', i, 'score too low:', cognosScore);
                        }
                      } else {
                        console.log('📅 [NEXT-2-WEEKS] Iframe', i, 'content not accessible');
                      }
                    } catch (e) {
                      console.log('❌ [NEXT-2-WEEKS] Cannot access iframe', i, ':', e.message);
                    }
                  }
                  
                  if (!cognosIframe || !cognosDoc) {
                    console.log('❌ [NEXT-2-WEEKS] Cognos iframe not found after enhanced search!');
                    console.log('📅 [NEXT-2-WEEKS] Available iframes summary:');
                    for (let i = 0; i < allIframes.length; i++) {
                      const iframe = allIframes[i];
                      try {
                        const accessible = iframe.contentDocument ? 'accessible' : 'blocked';
                        const src = iframe.src ? iframe.src.substring(0, 50) + '...' : 'no src';
                        console.log('  - Iframe', i, ':', accessible, '-', src);
                      } catch (e) {
                        console.log('  - Iframe', i, ': error -', e.message);
                      }
                    }
                    
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'next_2_weeks_error',
                      error: 'Cognos iframe not found. Found ' + allIframes.length + ' iframes total.'
                    }));
                    return;
                  }
                  
                  // Find the Week End Date dropdown with enhanced search
                  let weekDropdown = null;
                  
                  // Method 1: Look for selects with date options
                  const allSelects = cognosDoc.querySelectorAll('select');
                  console.log('📅 [NEXT-2-WEEKS] Found', allSelects.length, 'select elements, checking each one...');
                  
                  for (let i = 0; i < allSelects.length; i++) {
                    const select = allSelects[i];
                    console.log('📅 [NEXT-2-WEEKS] Checking select', i, ':', {
                      id: select.id,
                      name: select.name,
                      optionsCount: select.options.length,
                      firstOptionValue: select.options.length > 0 ? select.options[0].value : 'none',
                      firstOptionText: select.options.length > 0 ? select.options[0].text : 'none'
                    });
                    
                    if (select.options.length > 0) {
                      const firstOption = select.options[0];
                      const hasDateOptions = firstOption.value.includes('2025-') || 
                                           firstOption.text.includes('2025-') ||
                                           firstOption.value.includes('T00:00:00');
                      
                      if (hasDateOptions) {
                        console.log('✅ [NEXT-2-WEEKS] Found Week End Date dropdown:', select.id);
                        weekDropdown = select;
                        break;
                      }
                    }
                  }
                  
                  // Method 2: Fallback selectors
                  if (!weekDropdown) {
                    console.log('📅 [NEXT-2-WEEKS] Using fallback selectors for Week dropdown...');
                    weekDropdown = cognosDoc.querySelector('select[id*="PRMT_SV_"]') ||
                                 cognosDoc.querySelector('select.clsSelectControl') ||
                                 cognosDoc.querySelector('select[role="listbox"]') ||
                                 cognosDoc.querySelector('select');
                                 
                    if (weekDropdown) {
                      console.log('📅 [NEXT-2-WEEKS] Found dropdown via fallback:', weekDropdown.id);
                    }
                  }
                  
                  if (!weekDropdown) {
                    console.log('❌ [NEXT-2-WEEKS] Week End Date dropdown not found!');
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'next_2_weeks_error',
                      error: 'Week End Date dropdown not found in Cognos iframe'
                    }));
                    return;
                  }
                  
                  // Find the run button with enhanced search
                  let runButton = null;
                  
                  // Method 1: Look for buttons with "finish" and "_NS_" in ID
                  const allButtons = cognosDoc.querySelectorAll('button');
                  console.log('📅 [NEXT-2-WEEKS] Found', allButtons.length, 'button elements, checking each one...');
                  
                  for (let i = 0; i < allButtons.length; i++) {
                    const btn = allButtons[i];
                    const btnText = (btn.textContent || '').trim().toLowerCase();
                    const btnId = btn.id || '';
                    
                    console.log('📅 [NEXT-2-WEEKS] Checking button', i, ':', {
                      text: btnText,
                      id: btnId,
                      className: btn.className
                    });
                    
                    // Look for the finish/run button
                    if (btnText === 'run' || 
                        btnId.includes('finish') && btnId.includes('_NS_') ||
                        btn.className.includes('bp')) {
                      console.log('✅ [NEXT-2-WEEKS] Found Run button:', btnId);
                      runButton = btn;
                      break;
                    }
                  }
                  
                  // Method 2: Fallback selectors
                  if (!runButton) {
                    console.log('📅 [NEXT-2-WEEKS] Using fallback selectors for Run button...');
                    runButton = cognosDoc.querySelector('button[id*="finish"]') ||
                               cognosDoc.querySelector('button.bp') ||
                               cognosDoc.querySelector('button[onclick*="promptAction"]') ||
                               cognosDoc.querySelector('button');
                               
                    if (runButton) {
                      console.log('📅 [NEXT-2-WEEKS] Found button via fallback:', runButton.id);
                    }
                  }
                                   
                  if (!runButton) {
                    console.log('❌ [NEXT-2-WEEKS] Run button not found!');
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'next_2_weeks_error',
                      error: 'Run button not found in Cognos iframe'
                    }));
                    return;
                  }
                  
                  console.log('📅 [NEXT-2-WEEKS] Found elements:');
                  console.log('  - Week dropdown ID:', weekDropdown.id);
                  console.log('  - Week dropdown options:', weekDropdown.options.length);
                  console.log('  - Run button ID:', runButton.id);
                  
                  if (weekDropdown.options.length < 3) {
                    console.log('❌ [NEXT-2-WEEKS] Not enough week options available! Found:', weekDropdown.options.length);
                    console.log('📅 [NEXT-2-WEEKS] Available options:');
                    for (let i = 0; i < weekDropdown.options.length; i++) {
                      console.log('  -', i, ':', weekDropdown.options[i].text, '=', weekDropdown.options[i].value);
                    }
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'next_2_weeks_error',
                      error: 'Not enough week options available. Need at least 3, found: ' + weekDropdown.options.length
                    }));
                    return;
                  }
                  
                  // Function to select a week and run it
                  function selectAndRunWeek(weekIndex, callback) {
                    const option = weekDropdown.options[weekIndex];
                    const weekText = option.text;
                    const weekValue = option.value;
                    
                    console.log('📅 [NEXT-2-WEEKS] Selecting week', weekIndex + 1, ':', weekText);
                    
                    // Select the week
                    weekDropdown.selectedIndex = weekIndex;
                    weekDropdown.value = weekValue;
                    option.selected = true;
                    
                    // Trigger events
                    weekDropdown.dispatchEvent(new Event('focus', { bubbles: true }));
                    weekDropdown.dispatchEvent(new Event('change', { bubbles: true }));
                    weekDropdown.dispatchEvent(new Event('input', { bubbles: true }));
                    weekDropdown.dispatchEvent(new Event('blur', { bubbles: true }));
                    
                    // Enable run button if needed
                    if (runButton.disabled) {
                      runButton.disabled = false;
                    }
                    
                    // Wait a bit, then click run
                    setTimeout(() => {
                      console.log('📅 [NEXT-2-WEEKS] Clicking run for week', weekIndex + 1, ':', weekText);
                      
                      // Click the run button
                      runButton.click();
                      runButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                      
                      // Wait for the page to load the new schedule
                      setTimeout(() => {
                        console.log('✅ [NEXT-2-WEEKS] Week', weekIndex + 1, 'loaded:', weekText);
                        
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                          type: 'next_2_weeks_week_loaded',
                          weekNumber: weekIndex + 1,
                          weekText: weekText,
                          weekValue: weekValue
                        }));
                        
                        if (callback) callback();
                      }, 3000); // Wait 3 seconds for page to load
                    }, 1000); // Wait 1 second after selection
                  }
                  
                  // Load weeks 1, 2, and 3 (indices 0, 1, 2)
                  console.log('📅 [LOAD-3] Starting to load all 3 weeks (1, 2, and 3)...');
                  
                  selectAndRunWeek(0, () => {
                    // After week 1 is loaded, load week 2
                    selectAndRunWeek(1, () => {
                      // After week 2 is loaded, load week 3
                      selectAndRunWeek(2, () => {
                        console.log('✅ [LOAD-3] All 3 weeks have been loaded!');
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                          type: 'load_3_schedules_complete',
                          message: 'Successfully loaded all 3 schedules (weeks 1, 2, and 3)!'
                        }));
                      });
                    });
                  });
                  
                } catch (error) {
                  console.log('❌ [LOAD-3] Script error:', error);
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'load_3_schedules_error',
                    error: error.message,
                    stack: error.stack
                  }));
                }
              })();`;
              
              await webViewRef.current.injectJavaScript(loadNext2WeeksScript);
            } catch (error) {
              console.error('❌ [UI] Error running Load Next 2 Weeks script:', error);
              Alert.alert('Error', 'Failed to run Load Next 2 Weeks script');
            }
          }}
        >
          <Text style={[styles.demoButtonText, { color: COLORS.warning }]}>
            📅 Load 3 schedules
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.demoButton, { 
            borderColor: hasStoredSchedules ? COLORS.error : COLORS.warning, 
            marginBottom: SPACING.md, 
          }]} 
          onPress={toggleOfflineStorage}
        >
          <Text style={[styles.demoButtonText, { 
            color: hasStoredSchedules ? COLORS.error : COLORS.warning, 
          }]}>
            {hasStoredSchedules ? '🗑️ Clear Offline Storage' : '🧪 Test Offline Storage'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.demoButton, { borderColor: COLORS.success, marginBottom: SPACING.md }]} 
          onPress={async () => {
            console.log('🧪 [UI] Load 3 Schedules with Import - Navigation + Parsing...');
            if (!webViewRef.current) {
              Alert.alert('Error', 'WebView not available. Please ensure you are on the WebView screen.');
              return;
            }
            try {
              const getHtmlScript = `
              (function() { 
                try { 
                  console.log('📅 [LOAD-IMPORT] Starting Load 3 Schedules with Import...');
                  console.log('📅 [LOAD-IMPORT] This combines navigation from Load 3 schedules + import functionality');
                  
                  // Find the Cognos iframe with enhanced search (same as Load 3 schedules)
                  let cognosIframe = null;
                  let cognosDoc = null;
                  
                  const allIframes = document.querySelectorAll('iframe');
                  console.log('📅 [LOAD-IMPORT] Found', allIframes.length, 'iframes to check');
                  
                  for (let i = 0; i < allIframes.length; i++) {
                    const iframe = allIframes[i];
                    console.log('📅 [LOAD-IMPORT] Checking iframe', i, ':', {
                      src: iframe.src ? iframe.src.substring(0, 100) + '...' : 'no src',
                      id: iframe.id,
                      name: iframe.name
                    });
                    
                    try {
                      if (iframe.contentDocument && iframe.contentWindow) {
                        const iframeContent = iframe.contentDocument.documentElement.outerHTML;
                        console.log('📅 [LOAD-IMPORT] Iframe', i, 'content length:', iframeContent.length);
                        
                        // More flexible Cognos detection (same as Load 3 schedules)
                        const hasCognosTitle = iframeContent.includes('IBM Cognos Viewer') || 
                                             iframeContent.includes('Schedule - IBM Cognos');
                        const hasWeekElements = iframeContent.includes('Week End Date') || 
                                              iframeContent.includes('Please choose an End of Week') ||
                                              iframeContent.includes('PRMT_SV_');
                        const hasScheduleElements = iframeContent.includes('Weekly Schedule') ||
                                                   iframeContent.includes('finishN') ||
                                                   iframeContent.includes('2025-06-');
                        
                        console.log('📅 [LOAD-IMPORT] Iframe', i, 'detection results:', {
                          hasCognosTitle: hasCognosTitle,
                          hasWeekElements: hasWeekElements,
                          hasScheduleElements: hasScheduleElements,
                          contentPreview: iframeContent.substring(0, 200)
                        });
                        
                        // More lenient detection - any 2 of 3 indicators
                        const cognosScore = (hasCognosTitle ? 1 : 0) + (hasWeekElements ? 1 : 0) + (hasScheduleElements ? 1 : 0);
                        if (cognosScore >= 2) {
                          console.log('✅ [LOAD-IMPORT] Found Cognos schedule interface in iframe', i, 'with score', cognosScore);
                          cognosIframe = iframe;
                          cognosDoc = iframe.contentDocument;
                          break;
                        } else {
                          console.log('📅 [LOAD-IMPORT] Iframe', i, 'score too low:', cognosScore);
                        }
                      } else {
                        console.log('📅 [LOAD-IMPORT] Iframe', i, 'content not accessible');
                      }
                    } catch (e) {
                      console.log('❌ [LOAD-IMPORT] Cannot access iframe', i, ':', e.message);
                    }
                  }
                  
                  if (!cognosIframe || !cognosDoc) {
                    console.log('❌ [LOAD-IMPORT] Cognos iframe not found after enhanced search!');
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'load_3_schedules_error',
                      error: 'Cognos iframe not found. Found ' + allIframes.length + ' iframes total.'
                    }));
                    return;
                  }
                  
                  // Find elements with enhanced search (same as Load 3 schedules)
                  let weekDropdown = null;
                  let runButton = null;
                  
                  // Enhanced dropdown search
                  const allSelects = cognosDoc.querySelectorAll('select');
                  console.log('📅 [LOAD-IMPORT] Found', allSelects.length, 'select elements, checking each one...');
                  
                  for (let i = 0; i < allSelects.length; i++) {
                    const select = allSelects[i];
                    if (select.options.length > 0) {
                      const firstOption = select.options[0];
                      const hasDateOptions = firstOption.value.includes('2025-') || 
                                           firstOption.text.includes('2025-') ||
                                           firstOption.value.includes('T00:00:00');
                      
                      if (hasDateOptions) {
                        console.log('✅ [LOAD-IMPORT] Found Week End Date dropdown:', select.id);
                        weekDropdown = select;
                        break;
                      }
                    }
                  }
                  
                  if (!weekDropdown) {
                    weekDropdown = cognosDoc.querySelector('select[id*="PRMT_SV_"]') ||
                                 cognosDoc.querySelector('select.clsSelectControl') ||
                                 cognosDoc.querySelector('select[role="listbox"]') ||
                                 cognosDoc.querySelector('select');
                  }
                  
                  // Enhanced button search
                  const allButtons = cognosDoc.querySelectorAll('button');
                  for (let i = 0; i < allButtons.length; i++) {
                    const btn = allButtons[i];
                    const btnText = (btn.textContent || '').trim().toLowerCase();
                    const btnId = btn.id || '';
                    
                    if (btnText === 'run' || 
                        btnId.includes('finish') && btnId.includes('_NS_') ||
                        btn.className.includes('bp')) {
                      console.log('✅ [LOAD-IMPORT] Found Run button:', btnId);
                      runButton = btn;
                      break;
                    }
                  }
                  
                  if (!runButton) {
                    runButton = cognosDoc.querySelector('button[id*="finish"]') ||
                               cognosDoc.querySelector('button.bp') ||
                               cognosDoc.querySelector('button[onclick*="promptAction"]') ||
                               cognosDoc.querySelector('button');
                  }
                  
                  if (!weekDropdown || !runButton) {
                    console.log('❌ [LOAD-IMPORT] Required elements not found!');
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'load_3_schedules_error',
                      error: 'Week dropdown: ' + !!weekDropdown + ', Run button: ' + !!runButton
                    }));
                    return;
                  }
                  
                  if (weekDropdown.options.length < 3) {
                    console.log('❌ [LOAD-IMPORT] Not enough week options available! Found:', weekDropdown.options.length);
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'load_3_schedules_error',
                      error: 'Not enough week options available. Need at least 3, found: ' + weekDropdown.options.length
                    }));
                    return;
                  }
                  
                  console.log('📅 [LOAD-IMPORT] Found elements:');
                  console.log('  - Week dropdown ID:', weekDropdown.id);
                  console.log('  - Week dropdown options:', weekDropdown.options.length);
                  console.log('  - Run button ID:', runButton.id);
                  
                  // Function to select a week, run it, and import the schedule
                  function selectAndRunWeekWithImport(weekIndex, callback) {
                    const option = weekDropdown.options[weekIndex];
                    const weekText = option.text;
                    const weekValue = option.value;
                    
                    console.log('📅 [LOAD-IMPORT] Selecting and importing week', weekIndex + 1, ':', weekText);
                    
                    // Select the week
                    weekDropdown.selectedIndex = weekIndex;
                    weekDropdown.value = weekValue;
                    option.selected = true;
                    
                    // Trigger events
                    weekDropdown.dispatchEvent(new Event('focus', { bubbles: true }));
                    weekDropdown.dispatchEvent(new Event('change', { bubbles: true }));
                    weekDropdown.dispatchEvent(new Event('input', { bubbles: true }));
                    weekDropdown.dispatchEvent(new Event('blur', { bubbles: true }));
                    
                    // Enable run button if needed
                    if (runButton.disabled) {
                      runButton.disabled = false;
                    }
                    
                    // Wait a bit, then click run
                    setTimeout(() => {
                      console.log('📅 [LOAD-IMPORT] Clicking run for week', weekIndex + 1, ':', weekText);
                      
                      // Click the run button
                      runButton.click();
                      runButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                      
                      // Wait for the page to load, then extract and import the schedule
                      setTimeout(() => {
                        console.log('📅 [LOAD-IMPORT] Week', weekIndex + 1, 'loaded, extracting schedule HTML...');
                        
                        try {
                          // Extract the schedule HTML from the iframe for import
                          const scheduleHTML = cognosDoc.documentElement.outerHTML;
                          const scheduleText = cognosDoc.body ? cognosDoc.body.textContent || cognosDoc.body.innerText || '' : '';
                          
                          console.log('📅 [LOAD-IMPORT] Extracted schedule for week', weekIndex + 1);
                          console.log('  - HTML length:', scheduleHTML.length);
                          console.log('  - Text length:', scheduleText.length);
                          console.log('  - Contains schedule data:', scheduleText.includes('Weekly Schedule') || scheduleText.includes('Total Hours'));
                          
                          // Send the schedule HTML for parsing and import
                          window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'enhanced_schedule_html',
                            html: scheduleHTML,
                            url: window.location.href,
                            title: document.title,
                            weekNumber: weekIndex + 1,
                            weekText: weekText,
                            weekValue: weekValue,
                            foundInIframe: true,
                            iframeCount: allIframes.length,
                            hasScheduleContent: scheduleText.includes('Weekly Schedule') || scheduleText.includes('Total Hours') || scheduleText.includes('Employee #'),
                            mainHtmlLength: document.documentElement.outerHTML.length,
                            scheduleHtmlLength: scheduleHTML.length,
                            source: 'load_3_schedules_with_import'
                          }));
                          
                          // Continue to next week
                          if (callback) callback();
                          
                        } catch (extractError) {
                          console.log('❌ [LOAD-IMPORT] Error extracting schedule for week', weekIndex + 1, ':', extractError);
                          window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'load_3_schedules_error',
                            error: 'Schedule extraction failed for week ' + (weekIndex + 1) + ': ' + extractError.message,
                            weekNumber: weekIndex + 1,
                            weekText: weekText
                          }));
                          
                          // Continue anyway
                          if (callback) callback();
                        }
                      }, 4000); // Wait 4 seconds for page to load completely
                    }, 1000); // Wait 1 second after selection
                  }
                  
                  // Load weeks 1, 2, and 3 (indices 0, 1, 2) with import
                  console.log('📅 [LOAD-IMPORT] Starting to load and import all 3 weeks (1, 2, and 3)...');
                  
                  selectAndRunWeekWithImport(0, () => {
                    // After week 1 is loaded and imported, load week 2
                    selectAndRunWeekWithImport(1, () => {
                      // After week 2 is loaded and imported, load week 3
                      selectAndRunWeekWithImport(2, () => {
                        console.log('✅ [LOAD-IMPORT] All 3 weeks have been loaded and imported!');
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                          type: 'load_3_schedules_complete',
                          message: 'Successfully loaded and imported all 3 schedules (weeks 1, 2, and 3) into the app!'
                        }));
                      });
                    });
                  });
                  
                } catch (error) {
                  console.log('❌ [LOAD-IMPORT] Script error:', error);
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'load_3_schedules_error',
                    error: error.message,
                    stack: error.stack
                  }));
                }
              })();`;
              
              webViewRef.current.injectJavaScript(getHtmlScript);
              
            } catch (error) {
              console.log('❌ [UI] Error injecting Load 3 Schedules with Import script:', error);
              Alert.alert('Script Error', 'Failed to inject Load 3 Schedules with Import script: ' + (error as Error).message);
            }
          }}
        >
          <Text style={[styles.demoButtonText, { color: COLORS.success }]}>
            🧪 Load 3 Schedules (with Import)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.demoButton, { borderColor: COLORS.warning, marginBottom: SPACING.md }]} 
          onPress={async () => {
            console.log('🔄 [UI] Starting enhanced schedule verification with step-by-step debugging...');
            if (!webViewRef.current) {
              Alert.alert('Error', 'WebView not available. Please ensure you are on the WebView screen.');
              return;
            }
            try {
              const enhancedLoadSchedulesScript = `
              (function() { 
                try { 
                  console.log('🔄 [NAV-DEBUG] === ENHANCED LOAD SCHEDULES DEBUG ===');
                  console.log('🔄 [NAV-DEBUG] Step 1: Script injection started');
                  
                  // Immediate safety checks
                  if (typeof window === 'undefined') {
                    console.log('❌ [NAV-DEBUG] Window object not available');
                    return false;
                  }
                  console.log('✅ [NAV-DEBUG] Step 1.1: Window object available');
                  
                  if (typeof document === 'undefined') {
                    console.log('❌ [NAV-DEBUG] Document object not available');
                    return false;
                  }
                  console.log('✅ [NAV-DEBUG] Step 1.2: Document object available');
                  
                  if (typeof window.ReactNativeWebView === 'undefined') {
                    console.log('❌ [NAV-DEBUG] ReactNativeWebView not available - not in WebView context');
                    // Don't return, continue debugging locally
                  } else {
                    console.log('✅ [NAV-DEBUG] Step 1.3: ReactNativeWebView available');
                  }
                  
                  // Post initial status
                  function postMessage(data) {
                    if (typeof window.ReactNativeWebView !== 'undefined') {
                      window.ReactNativeWebView.postMessage(JSON.stringify(data));
                    } else {
                      console.log('📨 [NAV-DEBUG] Would send message:', JSON.stringify(data));
                    }
                  }
                  
                  postMessage({
                    type: 'enhanced_load_debug',
                    step: 'initialization',
                    message: 'Enhanced load script started successfully',
                    environment: {
                      hasWindow: typeof window !== 'undefined',
                      hasDocument: typeof document !== 'undefined',
                      hasReactNativeWebView: typeof window.ReactNativeWebView !== 'undefined',
                      url: window.location.href,
                      title: document.title,
                      readyState: document.readyState
                    }
                  });
                  
                  console.log('🔄 [NAV-DEBUG] Step 2: Environment check complete');
                  console.log('  - URL:', window.location.href);
                  console.log('  - Title:', document.title);
                  console.log('  - Ready state:', document.readyState);
                  console.log('  - Body exists:', !!document.body);
                  
                  // Step 3: Iframe discovery with detailed logging
                  console.log('🔄 [NAV-DEBUG] Step 3: Starting comprehensive iframe search...');
                  const allIframes = document.querySelectorAll('iframe');
                  console.log('🔄 [NAV-DEBUG] Found', allIframes.length, 'total iframes');
                  
                  if (allIframes.length === 0) {
                    console.log('❌ [NAV-DEBUG] No iframes found - this might not be the right page');
                    postMessage({
                      type: 'enhanced_load_debug',
                      step: 'iframe_search',
                      error: 'No iframes found on page',
                      pageInfo: {
                        url: window.location.href,
                        title: document.title,
                        bodyLength: document.body ? document.body.innerHTML.length : 0
                      }
                    });
                    return false;
                  }
                  
                  // Step 4: Detailed iframe analysis
                  let cognosIframe = null;
                  let cognosDoc = null;
                  let iframeAnalysis = [];
                  
                  console.log('🔄 [NAV-DEBUG] Step 4: Analyzing each iframe...');
                  
                  for (let i = 0; i < allIframes.length; i++) {
                    const iframe = allIframes[i];
                    console.log('🔄 [NAV-DEBUG] Analyzing iframe', i, '...');
                    
                    const iframeInfo = {
                      index: i,
                      src: iframe.src || '(no src)',
                      id: iframe.id || '(no id)', 
                      name: iframe.name || '(no name)',
                      width: iframe.width || 'auto',
                      height: iframe.height || 'auto',
                      visible: iframe.offsetParent !== null,
                      hasContentDocument: false,
                      hasContentWindow: false,
                      accessible: false,
                      isCognosTarget: false,
                      errorMessage: null
                    };
                    
                    console.log('  - Src:', iframeInfo.src);
                    console.log('  - ID:', iframeInfo.id);
                    console.log('  - Name:', iframeInfo.name);
                    console.log('  - Visible:', iframeInfo.visible);
                    
                    try {
                      // Check basic accessibility
                      iframeInfo.hasContentDocument = !!iframe.contentDocument;
                      iframeInfo.hasContentWindow = !!iframe.contentWindow;
                      console.log('  - Has contentDocument:', iframeInfo.hasContentDocument);
                      console.log('  - Has contentWindow:', iframeInfo.hasContentWindow);
                      
                      if (iframe.contentDocument && iframe.contentWindow) {
                        console.log('  - Accessible: YES - checking content...');
                        iframeInfo.accessible = true;
                        
                        const iframeDoc = iframe.contentDocument;
                        const iframeWin = iframe.contentWindow;
                        
                        // Get iframe details
                        const iframeURL = iframeWin.location.href;
                        const iframeTitle = iframeDoc.title;
                        const iframeContent = iframeDoc.documentElement.outerHTML;
                        const iframeBodyText = iframeDoc.body ? (iframeDoc.body.textContent || iframeDoc.body.innerText || '') : '';
                        
                        console.log('  - Iframe URL:', iframeURL);
                        console.log('  - Iframe Title:', iframeTitle);
                        console.log('  - Content length:', iframeContent.length);
                        console.log('  - Body text length:', iframeBodyText.length);
                        
                        // Extended to match actual iframe HTML from your example
                        const cognosIndicators = {
                          hasWeekEndDate: iframeBodyText.includes('Week End Date') || iframeContent.includes('Week End Date'),
                          hasCognosViewer: iframeTitle.includes('IBM Cognos Viewer') || iframeContent.includes('IBM Cognos Viewer'),
                          hasPRMT_SV: iframeContent.includes('PRMT_SV_'),
                          hasScheduleTitle: iframeTitle.includes('Schedule'),
                          hasCognosScript: iframeContent.includes('cognos_ext') || iframeContent.includes('CCognosViewer'),
                          hasFormWarpRequest: iframeContent.includes('formWarpRequest_NS_'),
                          hasPromptManager: iframeContent.includes('C_PromptManager') || iframeContent.includes('G_PM_NS_'),
                          hasDispBiV1: iframeURL.includes('/bi/v1/disp') || iframeContent.includes('/bi/v1/disp')
                        };
                        
                        console.log('  - Cognos indicators check:');
                        Object.keys(cognosIndicators).forEach(key => {
                          console.log('    * ' + key + ':', cognosIndicators[key]);
                        });
                        
                        // Determine if this is our target iframe (more flexible matching)
                        const cognosScore = Object.values(cognosIndicators).filter(v => v).length;
                        console.log('  - Cognos score:', cognosScore + '/8');
                        
                        // If it has at least 3 cognos indicators, consider it a match
                        if (cognosScore >= 3 || (cognosIndicators.hasDispBiV1 && cognosIndicators.hasScheduleTitle)) {
                          console.log('✅ [NAV-DEBUG] COGNOS TARGET IFRAME FOUND at index', i);
                          console.log('✅ [NAV-DEBUG] Cognos score:', cognosScore, 'indicators met');
                          iframeInfo.isCognosTarget = true;
                          cognosIframe = iframe;
                          cognosDoc = iframeDoc;
                          // Don't break, continue analysis for debugging
                        }
                        
                        // Store additional analysis
                        iframeInfo.cognosIndicators = cognosIndicators;
                        iframeInfo.cognosScore = cognosScore;
                        iframeInfo.iframeURL = iframeURL;
                        iframeInfo.iframeTitle = iframeTitle;
                        iframeInfo.contentLength = iframeContent.length;
                        iframeInfo.bodyTextLength = iframeBodyText.length;
                        
                      } else {
                        console.log('  - Accessible: NO (contentDocument or contentWindow missing)');
                        iframeInfo.errorMessage = 'ContentDocument or contentWindow missing';
                      }
                    } catch (e) {
                      console.log('  - Accessible: NO (error:', e.message, ')');
                      iframeInfo.errorMessage = e.message;
                    }
                    
                    iframeAnalysis.push(iframeInfo);
                  }
                  
                  console.log('🔄 [NAV-DEBUG] Step 5: Iframe analysis complete');
                  console.log('🔄 [NAV-DEBUG] Summary:');
                  console.log('  - Total iframes:', allIframes.length);
                  console.log('  - Accessible iframes:', iframeAnalysis.filter(f => f.accessible).length);
                  console.log('  - Cognos target found:', !!cognosIframe);
                  
                  // Send detailed iframe analysis
                  postMessage({
                    type: 'enhanced_load_debug',
                    step: 'iframe_analysis_complete',
                    iframeAnalysis: iframeAnalysis,
                    cognosTargetFound: !!cognosIframe,
                    summary: {
                      totalIframes: allIframes.length,
                      accessibleIframes: iframeAnalysis.filter(f => f.accessible).length,
                      cognosTargets: iframeAnalysis.filter(f => f.isCognosTarget).length
                    }
                  });
                  
                  if (!cognosIframe || !cognosDoc) {
                    console.log('❌ [NAV-DEBUG] Cognos iframe not found or not accessible!');
                    postMessage({
                      type: 'enhanced_load_debug',
                      step: 'cognos_iframe_not_found',
                      error: 'No suitable Cognos iframe found',
                      analysis: iframeAnalysis
                    });
                    return false;
                  }
                  
                  // Step 6: Element search within Cognos iframe
                  console.log('🔄 [NAV-DEBUG] Step 6: Searching for elements in Cognos iframe...');
                  
                  // Multiple selector strategies for finding elements
                  const elementSearchStrategies = {
                    weekDropdown: [
                      'select[id*="PRMT_SV_"][name*="EndDate"]',
                      'select[id*="PRMT_SV_"][name*="p_EndDate"]',
                      'select[id*="PRMT_SV_"][id*="_NS_"]',
                      'select[name*="EndDate"]',
                      'select[name*="Date"]',
                      'select.clsSelectControl',
                      'select[role="listbox"]',
                      'select'
                    ],
                    runButton: [
                      'button[id*="next"][id*="_NS_"]',
                      'button[onclick*="promptAction"]',
                      'button.bp',
                      'input[type="submit"]',
                      'button[type="submit"]',
                      'button'
                    ]
                  };
                  
                  let foundElements = {};
                  
                  Object.keys(elementSearchStrategies).forEach(elementType => {
                    console.log('🔍 [NAV-DEBUG] Searching for', elementType, '...');
                    const selectors = elementSearchStrategies[elementType];
                    
                    for (let j = 0; j < selectors.length; j++) {
                      const selector = selectors[j];
                      try {
                        const elements = cognosDoc.querySelectorAll(selector);
                        console.log('  - Selector "' + selector + '": found', elements.length, 'elements');
                        
                        if (elements.length > 0) {
                          foundElements[elementType] = foundElements[elementType] || [];
                          Array.from(elements).forEach((el, idx) => {
                            const elementInfo = {
                              index: idx,
                              selector: selector,
                              tagName: el.tagName,
                              id: el.id || '(no id)',
                              name: el.name || '(no name)',
                              className: el.className || '(no class)',
                              textContent: (el.textContent || '').substring(0, 100),
                              visible: el.offsetParent !== null,
                              disabled: el.disabled,
                              optionsCount: el.tagName === 'SELECT' ? el.options.length : null
                            };
                            
                            foundElements[elementType].push(elementInfo);
                            console.log('    * Element', idx, ':', JSON.stringify(elementInfo, null, 2));
                          });
                          
                          if (!foundElements[elementType + '_primary']) {
                            foundElements[elementType + '_primary'] = elements[0]; // Store actual element
                          }
                        }
                      } catch (selectorError) {
                        console.log('  - Selector "' + selector + '": error -', selectorError.message);
                      }
                    }
                  });
                  
                  console.log('🔄 [NAV-DEBUG] Step 7: Element search complete');
                  console.log('🔄 [NAV-DEBUG] Found elements summary:');
                  Object.keys(foundElements).forEach(key => {
                    if (!key.endsWith('_primary')) {
                      console.log('  -', key + ':', foundElements[key] ? foundElements[key].length : 0, 'elements');
                    }
                  });
                  
                  // Send element analysis
                  postMessage({
                    type: 'enhanced_load_debug',
                    step: 'element_search_complete',
                    foundElements: Object.keys(foundElements).reduce((acc, key) => {
                      if (!key.endsWith('_primary')) {
                        acc[key] = foundElements[key];
                      }
                      return acc;
                    }, {}),
                    elementSearchStrategies: elementSearchStrategies
                  });
                  
                  // Step 8: Verification and testing
                  console.log('🔄 [NAV-DEBUG] Step 8: Element verification...');
                  
                  const weekDropdown = foundElements.weekDropdown_primary;
                  const runButton = foundElements.runButton_primary;
                  
                  const verificationResults = {
                    weekDropdown: {
                      found: !!weekDropdown,
                      id: weekDropdown ? weekDropdown.id : null,
                      optionsCount: weekDropdown ? weekDropdown.options.length : 0,
                      visible: weekDropdown ? weekDropdown.offsetParent !== null : false,
                      disabled: weekDropdown ? weekDropdown.disabled : null
                    },
                    runButton: {
                      found: !!runButton,
                      id: runButton ? runButton.id : null,
                      text: runButton ? runButton.textContent.trim() : null,
                      visible: runButton ? runButton.offsetParent !== null : false,
                      disabled: runButton ? runButton.disabled : null
                    }
                  };
                  
                  console.log('🔄 [NAV-DEBUG] Verification results:');
                  console.log(JSON.stringify(verificationResults, null, 2));
                  
                  // Final status
                  const allElementsFound = verificationResults.weekDropdown.found && verificationResults.runButton.found;
                  const readyForNavigation = allElementsFound && 
                                           verificationResults.weekDropdown.optionsCount > 0 && 
                                           verificationResults.weekDropdown.visible &&
                                           verificationResults.runButton.visible;
                  
                  console.log('🔄 [NAV-DEBUG] Final assessment:');
                  console.log('  - All required elements found:', allElementsFound);
                  console.log('  - Ready for navigation:', readyForNavigation);
                  
                  postMessage({
                    type: 'enhanced_load_debug',
                    step: 'verification_complete',
                    verificationResults: verificationResults,
                    allElementsFound: allElementsFound,
                    readyForNavigation: readyForNavigation,
                    message: readyForNavigation ? 
                      'All elements found and ready for navigation!' : 
                      'Some elements missing or not ready for navigation'
                  });
                  
                  console.log('🔄 [NAV-DEBUG] === ENHANCED LOAD SCHEDULES DEBUG COMPLETE ===');
                  return readyForNavigation;
                } catch (error) {
                  console.log('❌ [NAV-DEBUG] Fatal error:', error);
                  if (typeof window.ReactNativeWebView !== 'undefined') {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'enhanced_load_debug',
                      step: 'fatal_error',
                      error: error.message,
                      stack: error.stack
                    }));
                  }
                  return false;
                }
              })();`;
              
              webViewRef.current.injectJavaScript(enhancedLoadSchedulesScript);
              
            } catch (error) {
              console.log('❌ [UI] Error injecting enhanced debug script:', error);
              Alert.alert('Script Error', 'Failed to inject enhanced debug script: ' + (error as Error).message);
            }
          }}
        >
          <Text style={[styles.demoButtonText, { color: COLORS.warning }]}>
            🔄 Load Schedules (Enhanced Debug)
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToCredentials}>
            <Text style={styles.backButtonText}>← Back to Login Options</Text>
          </TouchableOpacity>
          
          <Text style={styles.versionTextInline}>v{packageJson.version}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={currentStep === 'WEBVIEW_AUTH' ? undefined : (Platform.OS === 'ios' ? 'padding' : 'height')}
        style={styles.keyboardView}
      >
        {currentStep !== 'WEBVIEW_AUTH' ? (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {currentStep === 'CREDENTIALS' && renderCredentialsStep()}
            {currentStep === 'MFA_CODE' && renderMFAStep()}
            {currentStep === 'SAML_REDIRECT' && renderSAMLStep()}
          </ScrollView>
        ) : (
          renderWebViewStep()
        )}
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
  scrollContainer: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.h1.fontSize,
    fontWeight: TYPOGRAPHY.h1.fontWeight,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: TYPOGRAPHY.body.fontWeight,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.body.fontSize,
    backgroundColor: COLORS.white,
    color: COLORS.text,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.body.fontSize,
    backgroundColor: COLORS.white,
    color: COLORS.text,
    flex: 1,
  },
  passwordToggle: {
    padding: SPACING.md,
  },
  passwordToggleText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.primary,
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
    borderColor: COLORS.primary,
    borderRadius: 4,
    marginRight: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text,
  },
  errorContainer: {
    backgroundColor: COLORS.warningLight,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  disabledButton: {
    backgroundColor: COLORS.textSecondary,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
  },
  demoButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  demoButtonText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '500',
  },
  infoContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  infoText: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  samlInstructions: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: 8,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  instructionTitle: {
    fontSize: TYPOGRAPHY.h5.fontSize,
    fontWeight: TYPOGRAPHY.h5.fontWeight,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  instructionText: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    paddingLeft: SPACING.sm,
  },
  webViewScreenContainer: {
    flex: 1,
  },
  webViewContentContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
    borderRadius: 8,
  },
  webViewLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  webViewLoadingText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    marginTop: SPACING.sm,
  },
  webViewBottomControls: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  versionTextInline: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.textSecondary,
    textAlign: 'right',
    lineHeight: 16,
  },
}); 