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
import { COLORS, TYPOGRAPHY, SPACING, APP_CONFIG } from '../constants';
import { AuthService } from '../services/AuthService';
import { ScheduleService } from '../services/ScheduleService';
import { useCognosAutomation } from '../services/useCognosAutomation';

// eslint-disable-next-line no-undef
const packageJson = require('../../package.json');

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

type AuthStep = 'CREDENTIALS' | 'MFA_CODE' | 'SAML_REDIRECT' | 'WEBVIEW_AUTH';

// Define a minimal type for the iframes in the html_document_dump message
interface DumpedIframe {
  accessible: boolean;
  html?: string | null; // html can be string or null
  // Add other properties if accessed, e.g., src, id, etc.
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMFACode] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<AuthStep>('CREDENTIALS');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [hasStoredSchedules, setHasStoredSchedules] = useState(false);

  const authService = AuthService.getInstance();
  const scheduleService = ScheduleService.getInstance();
  const webViewRef = useRef<WebView>(null);

  // Initialize Cognos automation
  const automation = useCognosAutomation(webViewRef);

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
      
      const result = await authService.verifyMFACode(mfaCode.trim(), undefined);

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
    setMFACode('');
    setErrorMessage(null);
    setShowPassword(false);
    
    // Reload saved credentials when returning to credentials step
    loadSavedCredentials();
  };

  const handleDemoMode = () => {
    Alert.alert(
      'Demo Mode',
      'This will show you how the app works with real corporate schedule data, but without requiring authentication.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => {
            // Set demo mode flag
            scheduleService.setDemoMode(true);
            onLoginSuccess();
          },
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
        console.log('🔑 [CREDENTIALS] Starting hybrid credential fill (jQuery + Fallback)...');
        
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
        
        // FORM TYPE DETECTION
        const currentUrl = window.location.href;
        const pageTitle = document.title;
        const pageContent = document.documentElement.outerHTML;
        
        // Check if this is Login Form 2 (Cognos BI authentication)
        const isLoginForm2 = currentUrl.includes('bireport.costco.com/cognos_ext/bi') && 
                            (pageContent.includes('Log in with your COSTCOEXT ID') || 
                             pageContent.includes('COSTCOEXT') ||
                             pageContent.includes('User ID'));
        
        console.log('🔑 [FORM-DETECTION] URL:', currentUrl);
        console.log('🔑 [FORM-DETECTION] Title:', pageTitle);
        console.log('🔑 [FORM-DETECTION] Login Form 2 (Cognos BI):', isLoginForm2);
        
        if (isLoginForm2) {
          console.log('🎯 [LOGIN-FORM-2] Detected Cognos BI authentication page');
          console.log('🎯 [LOGIN-FORM-2] Using block paste + last character retype pattern');
          
          // LOGIN FORM 2 - Special handling for Cognos BI page
          let userIdField = null;
          let passwordField = null;
          
          // Look for User ID field (Login Form 2 specific)
          const userIdSelectors = [
            'input[placeholder*="User ID"]',
            'input[aria-label*="User ID"]', 
            'input[id*="userid"]',
            'input[name*="userid"]',
            'input[id*="UserID"]',
            'input[name*="UserID"]',
            'input[id*="user_id"]',
            'input[name*="user_id"]',
            'input[type="text"]' // Fallback for any text input
          ];
          
          // Look for password field
          const passwordSelectors = [
            'input[type="password"]',
            'input[placeholder*="Password"]',
            'input[aria-label*="Password"]',
            'input[id*="password"]',
            'input[name*="password"]'
          ];
          
          // Find User ID field
          for (const selector of userIdSelectors) {
            const field = document.querySelector(selector);
            if (field && field.offsetParent !== null) {
              console.log('🎯 [LOGIN-FORM-2] Found User ID field:', selector);
              userIdField = field;
              break;
            }
          }
          
          // Find Password field
          for (const selector of passwordSelectors) {
            const field = document.querySelector(selector);
            if (field && field.offsetParent !== null) {
              console.log('🎯 [LOGIN-FORM-2] Found Password field:', selector);
              passwordField = field;
              break;
            }
          }
          
          if (!userIdField || !passwordField) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'credentials_filled',
              success: false,
              error: 'Could not find User ID or Password fields on Login Form 2',
              formType: 'cognos-bi',
              userIdFound: !!userIdField,
              passwordFound: !!passwordField
            }));
            return;
          }
          
          console.log('🎯 [LOGIN-FORM-2] Found both fields - starting block paste + last character retype');
          
          // BLOCK PASTE + LAST CHARACTER RETYPE PATTERN for Login Form 2
          function fillFieldWithLastCharacterRetype(field, value, fieldName) {
            console.log('🎯 [LOGIN-FORM-2] Filling', fieldName, 'with block paste + last character retype');
            
            return new Promise((resolve) => {
              // Step 1: Click and focus the field
              field.focus();
              field.click();
              
              // Step 2: Block paste the entire value
              field.value = value;
              field.dispatchEvent(new Event('input', { bubbles: true }));
              field.dispatchEvent(new Event('change', { bubbles: true }));
              
              console.log('🎯 [LOGIN-FORM-2] Block pasted', fieldName, '- value:', field.value);
              
              setTimeout(() => {
                // Step 3: Delete the last character
                const lastChar = value.slice(-1);
                const valueWithoutLast = value.slice(0, -1);
                
                field.value = valueWithoutLast;
                field.dispatchEvent(new Event('input', { bubbles: true }));
                field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
                field.dispatchEvent(new KeyboardEvent('keyup', { key: 'Backspace', bubbles: true }));
                
                console.log('🎯 [LOGIN-FORM-2] Deleted last character from', fieldName, '- value now:', field.value);
                
                setTimeout(() => {
                  // Step 4: Type the last character back
                  field.dispatchEvent(new KeyboardEvent('keydown', { 
                    key: lastChar, 
                    keyCode: lastChar.charCodeAt(0), 
                    bubbles: true 
                  }));
                  
                  field.value = value; // Set back to full value
                  field.dispatchEvent(new Event('input', { bubbles: true }));
                  
                  field.dispatchEvent(new KeyboardEvent('keyup', { 
                    key: lastChar, 
                    keyCode: lastChar.charCodeAt(0), 
                    bubbles: true 
                  }));
                  
                  console.log('🎯 [LOGIN-FORM-2] Retyped last character for', fieldName, '- final value:', field.value);
                  
                  // Step 5: Final validation events
                  setTimeout(() => {
                    field.dispatchEvent(new Event('change', { bubbles: true }));
                    field.dispatchEvent(new Event('blur', { bubbles: true }));
                    
                    // Refocus for final validation
                    setTimeout(() => {
                      field.focus();
                      field.dispatchEvent(new Event('focus', { bubbles: true }));
                      
                      console.log('🎯 [LOGIN-FORM-2] Completed last-character retype for', fieldName);
                      resolve(true);
                    }, 50);
                  }, 100);
                }, 150);
              }, 150);
            });
          }
          
          // Fill User ID field with last character retype
          console.log('🎯 [LOGIN-FORM-2] Starting User ID field with last-character retype...');
          fillFieldWithLastCharacterRetype(userIdField, employeeId, 'User ID').then((userIdSuccess) => {
            console.log('🎯 [LOGIN-FORM-2] User ID completed, starting Password field...');
            
            // Fill password field with last character retype
            return fillFieldWithLastCharacterRetype(passwordField, password, 'Password');
          }).then((passwordSuccess) => {
            console.log('🎯 [LOGIN-FORM-2] Password completed, finalizing...');
            
            // Final verification and activation
            setTimeout(() => {
              console.log('🎯 [LOGIN-FORM-2] Final verification:');
              console.log('  - User ID value:', userIdField.value);
              console.log('  - Password value set:', passwordField.value === password);
              
              // Look for and potentially activate the login button
              const loginButton = document.querySelector('button[type="submit"]') ||
                                document.querySelector('input[type="submit"]') ||
                                Array.from(document.querySelectorAll('button')).find(btn => 
                                  btn.textContent && btn.textContent.toLowerCase().includes('log in'));
              
              if (loginButton) {
                console.log('🎯 [LOGIN-FORM-2] Found login button:', loginButton.textContent);
                // Focus the button to ensure it's activated
                loginButton.focus();
                setTimeout(() => loginButton.blur(), 50);
              }
              
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'credentials_filled',
                success: true,
                formType: 'cognos-bi-login-form-2',
                strategy: 'Block Paste + Last Character Retype',
                userIdFound: true,
                passwordFound: true,
                loginButtonFound: !!loginButton,
                finalValidation: {
                  userIdValue: userIdField.value === employeeId,
                  passwordValue: passwordField.value === password
                },
                message: 'Login Form 2 (Cognos BI) credentials filled with last-character retype technique',
                error: null
              }));
              
            }, 300);
          }).catch((error) => {
            console.error('🎯 [LOGIN-FORM-2] Error during last-character retype:', error);
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'credentials_filled',
              success: false,
              formType: 'cognos-bi-login-form-2',
              error: 'Last-character retype failed: ' + error.message
            }));
          });
          
          return; // Exit early for Login Form 2
        }
        
        // LOGIN FORM 1 - Original logic for standard authentication
        console.log('🔑 [LOGIN-FORM-1] Using standard authentication form handling');
        
        // STEP 1: Try specific fields first (CAMUsername/CAMPassword from diagnostics)
        console.log('🔑 [STEP-1] Trying specific field detection...');
        let usernameField = document.getElementById('CAMUsername');
        let passwordField = document.getElementById('CAMPassword');
        let detectionMethod = 'specific-ids';
        
        // STEP 2: If specific fields not found, try broader detection
        if (!usernameField || !passwordField) {
          console.log('🔑 [STEP-2] Specific fields not found, trying broader detection...');
          
          // Enhanced field selectors (from original approach)
        const usernameSelectors = [
            'input[name="CAMUsername"]', 'input[id="CAMUsername"]', // Try CAM fields first
            'input[name="username"]', 'input[name="employeeId"]', 'input[name="employee_id"]', 
            'input[name="userid"]', 'input[name="user"]', 'input[name="uid"]', 'input[name="login"]',
            'input[name="userID"]', 'input[name="User_ID"]', 'input[type="text"]',
            'input[id*="username"]', 'input[id*="employee"]', 'input[id*="user"]', 'input[id*="login"]',
            'input[placeholder*="User"]', 'input[placeholder*="Employee"]', 'input[placeholder*="ID"]'
        ];
        
        const passwordSelectors = [
            'input[name="CAMPassword"]', 'input[id="CAMPassword"]', // Try CAM fields first
            'input[name="password"]', 'input[name="passwd"]', 'input[name="pwd"]', 'input[name="pass"]',
            'input[name="Password"]', 'input[type="password"]', 'input[id*="password"]',
            'input[id*="passwd"]', 'input[id*="pwd"]', 'input[placeholder*="Password"]'
          ];
          
          // Find fields with broader search
        for (const selector of usernameSelectors) {
          const field = document.querySelector(selector);
          if (field && field.offsetParent !== null) {
              console.log('🔑 [BROAD-SEARCH] Found username field:', selector);
            usernameField = field;
              detectionMethod = 'broad-search';
            break;
          }
        }
        
        for (const selector of passwordSelectors) {
          const field = document.querySelector(selector);
          if (field && field.offsetParent !== null) {
              console.log('🔑 [BROAD-SEARCH] Found password field:', selector);
            passwordField = field;
              detectionMethod = 'broad-search';
            break;
            }
          }
        }
        
        console.log('🔑 [DETECTION] Results:');
        console.log('  - Username field found:', !!usernameField);
        console.log('  - Password field found:', !!passwordField);
        console.log('  - Detection method:', detectionMethod);
        
        if (usernameField) {
          console.log('  - Username field ID:', usernameField.id);
          console.log('  - Username field name:', usernameField.name);
          console.log('  - Username field type:', usernameField.type);
        }
        if (passwordField) {
          console.log('  - Password field ID:', passwordField.id);
          console.log('  - Password field name:', passwordField.name);
          console.log('  - Password field type:', passwordField.type);
        }
        
        if (!usernameField || !passwordField) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'credentials_filled',
            success: false,
            error: 'Could not find username or password fields',
            usernameFound: !!usernameField,
            passwordFound: !!passwordField,
            detectionMethod: detectionMethod
          }));
          return;
        }
        
        // Determine if this is the Carbon Design System login form
        const isCarbonForm = usernameField.classList.contains('bx--text-input') || 
                           passwordField.classList.contains('bx--text-input') ||
                           usernameField.id === 'CAMUsername';
        
        console.log('🔑 [FORM-TYPE] Carbon Design System detected:', isCarbonForm);
        
        // Smart filling function that adapts to the form type
        function fillFieldSmart(field, value, fieldType) {
          console.log('🔑 [SMART-FILL] Filling', fieldType, '- Carbon form:', isCarbonForm);
          
          // Clear any existing validation states (Carbon-specific)
          if (isCarbonForm) {
            field.classList.remove('bx--text-input--invalid');
            field.setAttribute('aria-invalid', 'false');
            
            // Remove validation messages
            const parent = field.closest('.bx--text-input-wrapper') || field.parentElement;
            if (parent) {
              const errorElements = parent.querySelectorAll('.bx--form-requirement');
              errorElements.forEach(el => el.remove());
            }
          }
          
          // Focus and clear the field
          field.focus();
          field.value = '';
          
          // Method 1: jQuery approach (if available and Carbon form)
          if (isCarbonForm && window.jQuery && window.jQuery.fn) {
            console.log('🔑 [JQUERY] Using jQuery events for', fieldType);
            const jqField = window.jQuery(field);
            
            jqField.trigger('focus');
            jqField.val(value);
            jqField.trigger('input');
            jqField.trigger('change');
            jqField.trigger('keyup');
            jqField.trigger('blur');
            
            // Also trigger native events
          field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
            
          } else {
            // Method 2: Enhanced native events (all forms)
            console.log('🔑 [NATIVE] Using enhanced native events for', fieldType);
            
            field.value = value;
            
            // Full event sequence
            field.dispatchEvent(new Event('focus', { bubbles: true }));
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
            field.dispatchEvent(new Event('keydown', { bubbles: true }));
            field.dispatchEvent(new Event('keyup', { bubbles: true }));
            field.dispatchEvent(new Event('blur', { bubbles: true }));
            
            // Additional keyboard events that some forms expect
            field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', keyCode: 9, bubbles: true }));
            field.dispatchEvent(new KeyboardEvent('keyup', { key: 'Tab', keyCode: 9, bubbles: true }));
          }
          
          // Method 3: Carbon-specific validation triggers
          if (isCarbonForm) {
            const carbonInstance = field._carbonInstance || field.carbonInstance;
            if (carbonInstance && typeof carbonInstance.validate === 'function') {
              console.log('🔑 [CARBON] Triggering Carbon validation for', fieldType);
              carbonInstance.validate();
            }
            
            // Mark as touched/dirty
            field.setAttribute('data-touched', 'true');
            field.setAttribute('data-dirty', 'true');
          }
          
          // Method 4: Re-trigger validation after delay
                setTimeout(() => {
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
            
            if (window.jQuery && window.jQuery.fn) {
              const jqField = window.jQuery(field);
              jqField.trigger('input');
              jqField.trigger('change');
            }
          }, 100);
          
          console.log('🔑 [SMART-FILL] Completed filling', fieldType, '- final value:', field.value);
          return true;
        }
        
        // Fill both fields with proper sequencing
        console.log('🔑 [CREDENTIALS] Starting sequential field filling...');
        
        try {
          // Fill username first
          const usernameSuccess = fillFieldSmart(usernameField, employeeId, 'username');
          
          // Wait a bit, then fill password
                    setTimeout(() => {
            try {
              const passwordSuccess = fillFieldSmart(passwordField, password, 'password');
              
              // Final validation trigger after both fields are filled
                            setTimeout(() => {
                console.log('🔑 [CREDENTIALS] Triggering final form validation...');
                
                // Global validation triggers
                if (window.jQuery && window.jQuery.fn) {
                  window.jQuery('form').trigger('validate');
                  window.jQuery('.authInput').trigger('change');
                }
                
                if (window.validateForm && typeof window.validateForm === 'function') {
                  window.validateForm();
                }
                if (window.validate && typeof window.validate === 'function') {
                  window.validate();
                }
                
                // Check final state
                const finalUsernameValid = isCarbonForm ? 
                  (!usernameField.classList.contains('bx--text-input--invalid') && 
                   usernameField.getAttribute('aria-invalid') !== 'true') :
                  (!usernameField.classList.contains('error') && 
                   !usernameField.classList.contains('invalid'));
                   
                const finalPasswordValid = isCarbonForm ?
                  (!passwordField.classList.contains('bx--text-input--invalid') && 
                   passwordField.getAttribute('aria-invalid') !== 'true') :
                  (!passwordField.classList.contains('error') && 
                   !passwordField.classList.contains('invalid'));
                
                console.log('🔑 [CREDENTIALS] Final validation state:');
                console.log('  - Username valid:', finalUsernameValid);
                console.log('  - Password valid:', finalPasswordValid);
                console.log('  - Username value set:', usernameField.value === employeeId);
                console.log('  - Password value set:', passwordField.value === password);
                console.log('  - Form type:', isCarbonForm ? 'Carbon Design System' : 'Standard');
                
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'credentials_filled',
                  success: usernameSuccess && passwordSuccess,
                  usernameFound: true,
                  passwordFound: true,
                  strategy: isCarbonForm ? 'jQuery + Carbon Design System' : 'Enhanced Native Events',
                  detectionMethod: detectionMethod,
                  formType: isCarbonForm ? 'carbon' : 'standard',
                  finalValidation: {
                    usernameValid: finalUsernameValid,
                    passwordValid: finalPasswordValid,
                    usernameValue: usernameField.value === employeeId,
                    passwordValue: passwordField.value === password
                  },
                  message: 'Hybrid credential fill completed',
                  error: null
                }));
                
              }, 500); // Wait for validation to complete
            } catch (passwordError) {
              console.error('🔑 [CREDENTIALS] Password filling error:', passwordError);
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'credentials_filled',
                success: false,
                error: 'Password filling failed: ' + passwordError.message,
                usernameFound: true,
                passwordFound: true,
                detectionMethod: detectionMethod
              }));
            }
          }, 300); // Delay between username and password
          
        } catch (usernameError) {
          console.error('🔑 [CREDENTIALS] Username filling error:', usernameError);
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'credentials_filled',
            success: false,
            error: 'Username filling failed: ' + usernameError.message,
            usernameFound: true,
            passwordFound: true,
            detectionMethod: detectionMethod
          }));
        }
        
      } catch (error) {
        console.error('🔑 [CREDENTIALS] General error:', error);
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'credentials_filled',
          success: false,
          error: error.message
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
        onPress={handleWebViewAuth}
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
        onPress={() => {
          // Set NOT in demo mode
          scheduleService.setDemoMode(false);
          onLoginSuccess();
        }}
      >
        <Text style={[styles.demoButtonText, { color: COLORS.success }]}>
          📅 My Schedule
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.demoButton, { 
          borderColor: hasStoredSchedules ? COLORS.error : COLORS.warning, 
          marginTop: SPACING.sm, 
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
          onChangeText={setMFACode}
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
            console.log('✅ [WEBVIEW] Load finished');
            console.log('✅ [WEBVIEW] URL:', nativeEvent.url);
            console.log('✅ [WEBVIEW] Title:', nativeEvent.title);
          }}
          onMessage={async (event) => {
            try {
              const messageData = event.nativeEvent.data;
              console.log('📨 [WEBVIEW] Message received:', messageData);
              
              // Try to parse as JSON for structured messages
              try {
                const parsedMessage = JSON.parse(messageData);
                console.log('📨 [WEBVIEW] Parsed message:', parsedMessage);
                
                // First check if this is a Cognos automation message
                if (parsedMessage.type && parsedMessage.type.startsWith('cognos_') || 
                    ['schedule_selected', 'schedule_selection_error', 'run_button_clicked', 
                      'run_button_error', 'schedule_data_extracted', 'schedule_extraction_error'].includes(parsedMessage.type)) {
                  automation.handleWebViewMessage(parsedMessage);
                  return;
                }

                // Handle existing message types
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
                      'Session Captured! 🍪',
                      `Successfully captured ${parsedMessage.cookies.length} session cookies.\n\nYou can now close this view and the app will automatically sync your schedules in the background.`,
                      [
                        {
                          text: 'Continue in Browser',
                          style: 'cancel',
                        },
                        {
                          text: 'Close & Auto-Sync',
                          onPress: () => {
                            console.log('🔄 [AUTH] Starting auto-sync after WebView capture...');
                            onLoginSuccess();
                          },
                        },
                      ],
                    );
                  } else {
                    Alert.alert(
                      'No Session Found',
                      'Could not find valid session cookies. Please ensure you are logged in to the system.',
                      [{ text: 'OK' }],
                    );
                  }
                } else if (parsedMessage.type === 'manual_extraction_error') {
                  console.log('❌ [WEBVIEW] Manual extraction error:', parsedMessage.error);
                  Alert.alert(
                    'Session Capture Failed',
                    `Could not capture session: ${parsedMessage.error}\n\nThis may happen if you haven't logged in yet or if there are browser security restrictions.`,
                    [{ text: 'OK' }],
                  );
                
                } else if (parsedMessage.type === 'cognos_js_analysis') {
                  console.log('🧪 [WEBVIEW] Cognos JS analysis received:', parsedMessage.analysis);
                  
                  const dropdown = parsedMessage.analysis.dropdownInfo;
                  const button = parsedMessage.analysis.buttonInfo;
                  
                  Alert.alert(
                    'Cognos Analysis Complete! 🧪',
                    'Interface Analysis:\n\n' +
                    `📍 URL: ${parsedMessage.analysis.url.includes('cognos') ? '✅ Cognos detected' : '❓ Unknown page'}\n` +
                    `🔍 Iframes: ${parsedMessage.analysis.totalIframes} found\n` +
                    `📊 Cognos Interface: ${parsedMessage.analysis.cognosIframeFound ? '✅ Found' : '❌ Not found'}\n\n` +
                    'Dropdown Info:\n' +
                    `• ${dropdown ? '✅ Found' : '❌ Not found'}${dropdown ? ` (${dropdown.optionsCount} options)` : ''}\n` +
                    `• Current: ${dropdown?.selectedText || 'None'}\n\n` +
                    'Run Button:\n' +
                    `• ${button ? '✅ Found' : '❌ Not found'}${button ? ` ("${button.textContent}")` : ''}\n\n` +
                    'Environment:\n' +
                    `• jQuery: ${parsedMessage.analysis.jsEnvironment.hasJQuery ? '✅' : '❌'}\n` +
                    `• Ready State: ${parsedMessage.analysis.jsEnvironment.documentReadyState}\n\n` +
                    `This interface ${parsedMessage.analysis.cognosIframeFound && dropdown && button ? 'is ready for automation! 🚀' : 'may need manual interaction.'}`,
                    [{ text: 'Great!' }],
                  );
                  
                } else if (parsedMessage.type === 'js_analysis_error') {
                  console.log('❌ [WEBVIEW] JS analysis error:', parsedMessage);
                  Alert.alert(
                    'JS Analysis Error ❌',
                    `Error analyzing Cognos interface: ${parsedMessage.error}`,
                    [{ text: 'OK' }],
                  );
                } else if (parsedMessage.type === 'html_document_dump_error') {
                  console.log('❌ [WEBVIEW] HTML document dump error:', parsedMessage);
                  Alert.alert(
                    'HTML Document Dump Error ❌',
                    `Error dumping HTML document: ${parsedMessage.error}`,
                    [{ text: 'OK' }],
                  );
                } else if (parsedMessage.type === 'dropdown_discovery_complete') {
                  console.log('🔍 [WEBVIEW] Dropdown discovery completed:', parsedMessage);
                  
                  const weekCandidates = parsedMessage.weekEndDateCandidates || [];
                  const employeeDropdowns = parsedMessage.employeeDropdowns || [];
                  const bestCandidate = parsedMessage.bestCandidate;
                  
                  Alert.alert(
                    'Dropdown Discovery Complete! 🔍',
                    `Found ${parsedMessage.totalDropdowns} total dropdowns:\n\n` +
                    `🎯 Week End Date Candidates: ${weekCandidates.length}\n` +
                    `👤 Employee Dropdowns: ${employeeDropdowns.length}\n\n` +
                    `${bestCandidate ? 
                      '🏆 Best Week End Date Candidate:\n' +
                      `• ID: ${bestCandidate.id}\n` +
                      `• Score: ${bestCandidate.weekEndDateScore}/10\n` +
                      `• Options: ${bestCandidate.optionsCount}\n` +
                      `• Current: ${bestCandidate.selectedValue}` :
                      '❌ No clear Week End Date dropdown found'
                    }\n\n` +
                    'Check console logs for detailed analysis of all dropdowns.',
                    [{ text: 'Great!' }],
                  );
                
                } else if (parsedMessage.type === 'dropdown_discovery_error') {
                  console.log('❌ [WEBVIEW] Dropdown discovery error:', parsedMessage.error);
                  Alert.alert(
                    'Dropdown Discovery Failed ❌',
                    `Could not discover dropdowns:\n\n${parsedMessage.error}`,
                    [{ text: 'OK' }],
                  );
                } else if (parsedMessage.type === 'html_document_dump') {
                  console.log('📄 [WEBVIEW] HTML document dump received:', parsedMessage);
                  
                  const { mainDocument, iframes, iframeCount } = parsedMessage;
                  const accessibleIframes = iframes?.filter((iframe: DumpedIframe) => iframe.accessible) || [];
                  const totalHtmlSize = (mainDocument?.htmlLength || 0) + (accessibleIframes.reduce((sum: number, iframe: DumpedIframe) => sum + (iframe.html?.length || 0), 0) || 0);
                  
                  Alert.alert(
                    'HTML Document Dump Complete! 📄',
                    'Successfully captured page content:\n\n' +
                    `🌐 URL: ${parsedMessage.url}\n` +
                    `📄 Title: ${parsedMessage.title || 'No title'}\n\n` +
                    '📊 Main Document:\n' +
                    `• HTML: ${mainDocument?.htmlLength?.toLocaleString() || 0} chars\n` +
                    `• Text: ${mainDocument?.textLength?.toLocaleString() || 0} chars\n\n` +
                    `🖼️ Iframes: ${iframeCount || 0} total\n` +
                    `• Accessible: ${accessibleIframes.length}\n` +
                    `• Blocked: ${(iframeCount || 0) - accessibleIframes.length}\n\n` +
                    `📏 Total HTML Size: ${totalHtmlSize?.toLocaleString() || 0} chars\n\n` +
                    'All HTML content has been logged to the console for analysis.',
                    [{ text: 'Great!' }],
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
          style={[styles.demoButton, { borderColor: COLORS.warning, marginBottom: SPACING.md }]} 
          onPress={async () => {
            console.log('🔍 [UI] Dropdown Discovery - Finding all select elements...');
            if (!webViewRef.current) {
              Alert.alert('Error', 'WebView not ready'); 
              return;
            }
            try {
              const { CognosAutomationService } = await import('../services/CognosAutomationService');
              const dropdownDiscoveryScript = CognosAutomationService.generateDropdownDiscoveryScript();
              webViewRef.current.injectJavaScript(dropdownDiscoveryScript);
            } catch (error) {
              console.error('❌ [UI] Error injecting dropdown discovery script:', error);
              Alert.alert('Error', 'Failed to inject dropdown discovery script');
            }
          }}
        >
          <Text style={[styles.demoButtonText, { color: COLORS.info }]}>
            🔍 Discover All Dropdowns
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.demoButton, { borderColor: COLORS.warning, marginBottom: SPACING.md }]} 
          onPress={async () => {
            console.log('🔍 [UI] Diagnose Elements - Analyzing current page...');
            if (!webViewRef.current) {
              Alert.alert('Error', 'WebView not ready'); 
              return;
            }
            try {
              const diagnoseElementsScript = `
              (function() { 
                try { 
                  console.log('🔍 [DIAGNOSE] Starting element analysis...');
                  
                  // Main document analysis
                  console.log('🔍 [DIAGNOSE] === MAIN DOCUMENT ===');
                  console.log('URL:', window.location.href);
                  console.log('Title:', document.title);
                  console.log('Ready state:', document.readyState);
                  
                  const mainSelects = document.querySelectorAll('select');
                  const mainButtons = document.querySelectorAll('button, input[type="submit"], input[type="button"]');
                  
                  console.log('Main document selects:', mainSelects.length);
                  console.log('Main document buttons:', mainButtons.length);
                  
                  // Iframe analysis
                  const allIframes = document.querySelectorAll('iframe');
                  console.log('🔍 [DIAGNOSE] === IFRAMES ===');
                  console.log('Total iframes found:', allIframes.length);
                  
                  const iframeResults = [];
                  
                  for (let i = 0; i < allIframes.length; i++) {
                    const iframe = allIframes[i];
                    const iframeInfo = {
                      index: i,
                      src: iframe.src || '',
                      id: iframe.id || '',
                      name: iframe.name || '',
                      accessible: false,
                      cognosScore: 0,
                      selectCount: 0,
                      buttonCount: 0,
                      selects: [],
                      buttons: [],
                      error: null
                    };
                    
                    try {
                      if (iframe.contentDocument && iframe.contentWindow) {
                        iframeInfo.accessible = true;
                        const iframeDoc = iframe.contentDocument;
                        const iframeUrl = iframe.contentWindow.location.href;
                        const iframeTitle = iframeDoc.title;
                        
                        console.log(\`🔍 [IFRAME-\${i}] Accessible - URL: \${iframeUrl}\`);
                        console.log(\`🔍 [IFRAME-\${i}] Title: \${iframeTitle}\`);
                        
                        // Calculate Cognos score
                        const content = iframeDoc.documentElement.outerHTML;
                        if (content.includes('Week End Date')) iframeInfo.cognosScore += 2;
                        if (content.includes('IBM Cognos')) iframeInfo.cognosScore += 2;
                        if (content.includes('Schedule')) iframeInfo.cognosScore += 1;
                        if (content.includes('PRMT_SV_')) iframeInfo.cognosScore += 1;
                        if (content.includes('_oLstChoices')) iframeInfo.cognosScore += 2;
                        
                        console.log(\`🔍 [IFRAME-\${i}] Cognos score: \${iframeInfo.cognosScore}/8\`);
                        
                        // Find all selects in iframe
                        const iframeSelects = iframeDoc.querySelectorAll('select');
                        iframeInfo.selectCount = iframeSelects.length;
                        
                        console.log(\`🔍 [IFRAME-\${i}] Found \${iframeSelects.length} select elements\`);
                        
                        for (let j = 0; j < iframeSelects.length; j++) {
                          const select = iframeSelects[j];
                          const selectInfo = {
                            index: j,
                            id: select.id || '',
                            name: select.name || '',
                            className: select.className || '',
                            optionsCount: select.options.length,
                            selectedIndex: select.selectedIndex,
                            value: select.value,
                            visible: select.offsetParent !== null,
                            options: []
                          };
                          
                          // Get first few options
                          for (let k = 0; k < Math.min(select.options.length, 5); k++) {
                            const option = select.options[k];
                            selectInfo.options.push({
                              value: option.value,
                              text: option.text,
                              selected: option.selected
                            });
                          }
                          
                          iframeInfo.selects.push(selectInfo);
                          
                          console.log(\`🔍 [SELECT-\${j}] ID: "\${selectInfo.id}", Name: "\${selectInfo.name}", Options: \${selectInfo.optionsCount}, Visible: \${selectInfo.visible}\`);
                          if (selectInfo.options.length > 0) {
                            console.log(\`🔍 [SELECT-\${j}] First option: "\${selectInfo.options[0].text}" (value: "\${selectInfo.options[0].value}")\`);
                          }
                        }
                        
                        // Find all buttons/inputs in iframe
                        const iframeButtons = iframeDoc.querySelectorAll('button, input[type="submit"], input[type="button"]');
                        iframeInfo.buttonCount = iframeButtons.length;
                        
                        console.log(\`🔍 [IFRAME-\${i}] Found \${iframeButtons.length} button elements\`);
                        
                        for (let j = 0; j < iframeButtons.length; j++) {
                          const button = iframeButtons[j];
                          const buttonInfo = {
                            index: j,
                            id: button.id || '',
                            name: button.name || '',
                            className: button.className || '',
                            type: button.type || button.tagName,
                            value: button.value || '',
                            textContent: (button.textContent || '').trim(),
                            visible: button.offsetParent !== null,
                            disabled: button.disabled
                          };
                          
                          iframeInfo.buttons.push(buttonInfo);
                          
                          console.log(\`🔍 [BUTTON-\${j}] ID: "\${buttonInfo.id}", Type: "\${buttonInfo.type}", Value: "\${buttonInfo.value}", Text: "\${buttonInfo.textContent}", Visible: \${buttonInfo.visible}\`);
                        }
                        
                      } else {
                        iframeInfo.error = 'Cross-origin access blocked';
                        console.log(\`❌ [IFRAME-\${i}] Cross-origin blocked\`);
                      }
                    } catch (e) {
                      iframeInfo.error = e.message;
                      console.log(\`❌ [IFRAME-\${i}] Error: \${e.message}\`);
                    }
                    
                    iframeResults.push(iframeInfo);
                  }
                  
                  // Find the best Cognos candidate
                  const cognosCandidates = iframeResults.filter(iframe => iframe.accessible && iframe.cognosScore > 0);
                  cognosCandidates.sort((a, b) => b.cognosScore - a.cognosScore);
                  
                  console.log('🔍 [DIAGNOSE] === SUMMARY ===');
                  console.log('Total accessible iframes:', iframeResults.filter(i => i.accessible).length);
                  console.log('Cognos candidates:', cognosCandidates.length);
                  
                  if (cognosCandidates.length > 0) {
                    const best = cognosCandidates[0];
                    console.log('Best Cognos candidate:');
                    console.log('  - Iframe index:', best.index);
                    console.log('  - Cognos score:', best.cognosScore);
                    console.log('  - Select elements:', best.selectCount);
                    console.log('  - Button elements:', best.buttonCount);
                    
                    if (best.selects.length > 0) {
                      console.log('  - Primary select:', best.selects[0].id || best.selects[0].name);
                    }
                    if (best.buttons.length > 0) {
                      console.log('  - Primary button:', best.buttons[0].id || best.buttons[0].value || best.buttons[0].textContent);
                    }
                  }
                  
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'element_diagnosis_complete',
                    url: window.location.href,
                    title: document.title,
                    mainDocument: {
                      selectCount: mainSelects.length,
                      buttonCount: mainButtons.length
                    },
                    iframes: iframeResults,
                    cognosCandidates: cognosCandidates,
                    bestCandidate: cognosCandidates.length > 0 ? cognosCandidates[0] : null,
                    recommendations: cognosCandidates.length > 0 ? 
                      'Found Cognos iframe - check console for element details' : 
                      'No Cognos iframe found - check if you are on the correct page'
                  }));
                  
                } catch (error) {
                  console.error('🔍 [DIAGNOSE] Error:', error);
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'element_diagnosis_error',
                    error: error.message
                  }));
                }
              })();`;
              
              webViewRef.current.injectJavaScript(diagnoseElementsScript);
            } catch (error) {
              console.error('❌ [UI] Error injecting diagnose script:', error);
              Alert.alert('Error', 'Failed to inject diagnose script');
            }
          }}
        >
          <Text style={[styles.demoButtonText, { color: COLORS.warning }]}>
            🔍 Diagnose Elements
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.demoButton, { borderColor: COLORS.warning, marginBottom: SPACING.md }]} 
          onPress={async () => {
            console.log('📄 [UI] Dump HTML - Getting complete page content...');
            if (!webViewRef.current) {
              Alert.alert('Error', 'WebView not ready'); 
              return;
            }
            try {
              const dumpHtmlScript = `
              (function() { 
                try { 
                  console.log('📄 [DUMP-HTML] Starting complete HTML document dump...');
                  
                  const timestamp = new Date().toISOString();
                  const url = window.location.href;
                  const title = document.title;
                  
                  // Get main document
                  const mainDocument = {
                    html: document.documentElement.outerHTML,
                    htmlLength: document.documentElement.outerHTML.length,
                    textContent: document.body ? document.body.textContent : '',
                    textLength: document.body ? (document.body.textContent || '').length : 0
                  };
                  
                  console.log('📄 [DUMP-HTML] Main document HTML length:', mainDocument.htmlLength);
                  console.log('📄 [DUMP-HTML] Main document text length:', mainDocument.textLength);
                  
                  // Get all iframes
                  const allIframes = document.querySelectorAll('iframe');
                  const iframes = [];
                  
                  console.log('📄 [DUMP-HTML] Found', allIframes.length, 'iframes to analyze');
                  
                  for (let i = 0; i < allIframes.length; i++) {
                    const iframe = allIframes[i];
                    const iframeInfo = {
                      index: i,
                      src: iframe.src || '',
                      id: iframe.id || '',
                      name: iframe.name || '',
                      accessible: false,
                      visible: iframe.offsetWidth > 0 && iframe.offsetHeight > 0,
                      error: null,
                      url: null,
                      title: null,
                      html: null,
                      textContent: null
                    };
                    
                    try {
                      if (iframe.contentDocument && iframe.contentWindow) {
                        iframeInfo.accessible = true;
                        iframeInfo.url = iframe.contentWindow.location.href;
                        iframeInfo.title = iframe.contentDocument.title;
                        iframeInfo.html = iframe.contentDocument.documentElement.outerHTML;
                        iframeInfo.textContent = iframe.contentDocument.body ? iframe.contentDocument.body.textContent : '';
                        
                        console.log('✅ [DUMP-HTML] Iframe', i, 'accessible:', {
                          url: iframeInfo.url,
                          title: iframeInfo.title,
                          htmlLength: iframeInfo.html.length
                        });
                      } else {
                        iframeInfo.error = 'Cross-origin access blocked';
                        console.log(\`❌ [DUMP-HTML] Iframe \${i} Cross-origin blocked\`);
                      }
                    } catch (e) {
                      iframeInfo.error = e.message;
                      console.log(\`❌ [DUMP-HTML] Iframe \${i} Error: \${e.message}\`);
                    }
                    
                    iframes.push(iframeInfo);
                  }
                  
                  console.log('📄 [DUMP-HTML] Sending complete HTML dump...');
                  
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'html_document_dump',
                    timestamp: timestamp,
                    url: url,
                    title: title,
                    mainDocument: mainDocument,
                    iframes: iframes,
                    iframeCount: allIframes.length
                  }));
                  
                } catch (error) {
                  console.error('📄 [DUMP-HTML] Error:', error);
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'html_document_dump_error',
                    error: error.message
                  }));
                }
              })();
              `;
              
              webViewRef.current.injectJavaScript(dumpHtmlScript);
            } catch (error) {
              console.error('❌ [UI] Error injecting dump HTML script:', error);
              Alert.alert('Error', 'Failed to inject dump HTML script');
            }
          }}
        >
          <Text style={[styles.demoButtonText, { color: COLORS.warning }]}>
            📄 Dump HTML
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
          style={[styles.demoButton, { borderColor: COLORS.success, marginBottom: SPACING.md }]} 
          onPress={automation.analyzeInterface}
          disabled={automation.state.isAnalyzing}
        >
          <Text style={[styles.demoButtonText, { color: COLORS.success }]}>
            {automation.state.isAnalyzing ? '🔄 Analyzing...' : '🧪 Analyze Cognos Interface'}
          </Text>
        </TouchableOpacity>

        {automation.state.analysis && automation.state.availableSchedules.length > 0 && (
          <View style={[styles.automationSection, { marginBottom: SPACING.md }]}>
            <Text style={styles.automationTitle}>📋 Available Schedules:</Text>
            <View style={styles.scheduleButtonsContainer}>
              {automation.state.availableSchedules.map((schedule, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.scheduleButton,
                    schedule.selected && styles.scheduleButtonSelected,
                    automation.state.isAutomating && styles.scheduleButtonDisabled,
                  ]}
                  onPress={() => automation.automateSchedule(schedule.value)}
                  disabled={automation.state.isAutomating}
                >
                  <Text style={[
                    styles.scheduleButtonText,
                    schedule.selected && styles.scheduleButtonTextSelected,
                  ]}>
                    {schedule.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {automation.state.currentStep && (
              <View style={styles.automationStatus}>
                <Text style={styles.automationStatusText}>
                  🤖 {automation.state.currentStep}
                </Text>
              </View>
            )}
            
            {automation.state.error && (
              <View style={styles.automationError}>
                <Text style={styles.automationErrorText}>
                  ❌ {automation.state.error}
                </Text>
              </View>
            )}
            
            <View style={styles.manualControlsContainer}>
              <Text style={styles.manualControlsTitle}>Manual Controls:</Text>
              <View style={styles.manualButtonsRow}>
                <TouchableOpacity
                  style={[styles.manualButton, { borderColor: COLORS.warning }]}
                  onPress={automation.runReport}
                  disabled={automation.state.isAutomating}
                >
                  <Text style={[styles.manualButtonText, { color: COLORS.warning }]}>
                    ▶️ Run Report
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.manualButton, { borderColor: COLORS.info }]}
                  onPress={automation.extractData}
                  disabled={automation.state.isAutomating}
                >
                  <Text style={[styles.manualButtonText, { color: COLORS.info }]}>
                    📊 Extract Data
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.manualButtonsRow}>
                <TouchableOpacity
                  style={[styles.manualButton, { borderColor: COLORS.success }]}
                  onPress={automation.importSchedule}
                  disabled={automation.state.isAutomating}
                >
                  <Text style={[styles.manualButtonText, { color: COLORS.success }]}>
                    💾 Import Schedule
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity
              style={[styles.resetButton, { borderColor: COLORS.error }]}
              onPress={automation.resetState}
            >
              <Text style={[styles.resetButtonText, { color: COLORS.error }]}>
                🔄 Reset Automation
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.demoButton,
                styles.multiWeekTestButton,
                automation.state.isAutomating && styles.multiWeekTestButtonAutomating,
              ]}
              onPress={automation.testMultiWeekAutomation}
              disabled={automation.state.isAutomating}
            >
              <Text style={[
                styles.demoButtonText,
                styles.multiWeekTestButtonText,
                styles.boldText, // Added for fontWeight: 'bold'
                automation.state.isAutomating && styles.multiWeekTestButtonTextAutomating,
              ]}>
                {automation.state.isAutomating ? '🔄 Testing...' : '🧪 Multi-Week Automation Test'}
              </Text>
            </TouchableOpacity> 
          </View>
        )}

        <TouchableOpacity 
          style={[styles.demoButton, { 
            borderColor: hasStoredSchedules ? COLORS.error : COLORS.warning, 
            marginTop: SPACING.sm, 
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
  automationSection: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: 8,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  automationTitle: {
    fontSize: TYPOGRAPHY.h5.fontSize,
    fontWeight: TYPOGRAPHY.h5.fontWeight,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  scheduleButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  scheduleButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
  },
  scheduleButtonSelected: {
    backgroundColor: COLORS.success,
  },
  scheduleButtonDisabled: {
    backgroundColor: COLORS.textSecondary,
  },
  scheduleButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
  },
  scheduleButtonTextSelected: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
  },
  automationStatus: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  automationStatusText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '500',
  },
  automationError: {
    backgroundColor: COLORS.warningLight,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },
  automationErrorText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '500',
  },
  manualControlsContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: 8,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  manualControlsTitle: {
    fontSize: TYPOGRAPHY.h5.fontSize,
    fontWeight: TYPOGRAPHY.h5.fontWeight,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  manualButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  manualButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
  },
  manualButtonText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '500',
  },
  resetButton: {
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: 8,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  resetButtonText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '500',
  },
  multiWeekTestButton: {
    borderColor: COLORS.primary,
    marginTop: SPACING.md,
    // Default background is transparent (from demoButton or inherent)
  },
  multiWeekTestButtonAutomating: {
    backgroundColor: COLORS.textSecondary,
  },
  multiWeekTestButtonText: {
    // Default color is COLORS.primary (from demoButtonText)
  },
  multiWeekTestButtonTextAutomating: {
    color: COLORS.white,
  },
  boldText: {
    fontWeight: 'bold',
  },
}); 