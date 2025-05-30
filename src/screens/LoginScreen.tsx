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
import { UserCredentials } from '../types';
import { AuthService } from '../services/AuthService';
import { ScheduleService } from '../services/ScheduleService';

const packageJson = require('../../package.json');

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

type AuthStep = 'CREDENTIALS' | 'MFA_CODE' | 'SAML_REDIRECT' | 'WEBVIEW_AUTH';

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<AuthStep>('CREDENTIALS');
  const [authSessionData, setAuthSessionData] = useState<Record<string, unknown> | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const authService = AuthService.getInstance();
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    loadSavedCredentials();
  }, []);

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
        setAuthSessionData(result.sessionData || null);
        setErrorMessage('Please enter the verification code sent to your phone');
      } else if (result.errorType === 'SAML_REQUIRED') {
        console.log('🔄 [UI] SAML authentication required - showing SAML instructions');
        setCurrentStep('SAML_REDIRECT');
        setAuthSessionData(result.sessionData || null);
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
    setAuthSessionData(null);
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

  const fillWebViewCredentials = () => {
    if (!webViewRef.current || !employeeId.trim() || !password.trim()) {
      Alert.alert('No Credentials', 'Please enter your Employee ID and Password in the main login form first.');
      return;
    }

    const fillScript = `
      (function() {
        try {
          console.log('🔑 [WEBVIEW] Attempting to fill login credentials...');
          
          // Common selectors for username/employee ID fields
          const usernameSelectors = [
            'input[name="username"]',
            'input[name="user"]',
            'input[name="employeeId"]',
            'input[name="employee_id"]',
            'input[name="login"]',
            'input[name="userid"]',
            'input[name="user_id"]',
            'input[name="User ID"]',
            'input[name="userID"]',
            'input[name="costcoext"]',
            'input[name="costcoextid"]',
            'input[name="COSTCOEXT"]',
            'input[name="COSTCOEXTID"]',
            'input[id*="username"]',
            'input[id*="user"]',
            'input[id*="employee"]',
            'input[id*="login"]',
            'input[id*="costco"]',
            'input[id*="userid"]',
            'input[id*="User"]',
            'input[placeholder*="User ID"]',
            'input[placeholder*="user id"]',
            'input[placeholder*="COSTCO"]',
            'input[placeholder*="costco"]',
            'input[type="text"]',
            'input[type="email"]'
          ];
          
          // Common selectors for password fields
          const passwordSelectors = [
            'input[name="password"]',
            'input[name="passwd"]',
            'input[name="pwd"]',
            'input[id*="password"]',
            'input[id*="passwd"]',
            'input[id*="pwd"]',
            'input[type="password"]'
          ];
          
          let usernameField = null;
          let passwordField = null;
          
          // Find username field
          for (let selector of usernameSelectors) {
            const field = document.querySelector(selector);
            if (field && field.offsetParent !== null) { // Check if visible
              usernameField = field;
              console.log('🔑 [WEBVIEW] Found username field:', selector);
              break;
            }
          }
          
          // If no username field found by selectors, try finding by label text
          if (!usernameField) {
            const labels = document.querySelectorAll('label');
            for (let label of labels) {
              const labelText = label.textContent || label.innerText || '';
              if (labelText.toLowerCase().includes('user id') || 
                  labelText.toLowerCase().includes('userid') ||
                  labelText.toLowerCase().includes('costco') ||
                  labelText.toLowerCase().includes('employee') ||
                  labelText.toLowerCase().includes('username')) {
                const forAttr = label.getAttribute('for');
                if (forAttr) {
                  const field = document.getElementById(forAttr);
                  if (field && field.offsetParent !== null) {
                    usernameField = field;
                    console.log('🔑 [WEBVIEW] Found username field by label:', labelText.trim());
                    break;
                  }
                }
                // Also check if the input is a sibling or child of the label
                const nearbyInput = label.querySelector('input') || label.nextElementSibling;
                if (nearbyInput && nearbyInput.tagName === 'INPUT' && nearbyInput.offsetParent !== null) {
                  usernameField = nearbyInput;
                  console.log('🔑 [WEBVIEW] Found username field near label:', labelText.trim());
                  break;
                }
              }
            }
          }
          
          // Find password field
          for (let selector of passwordSelectors) {
            const field = document.querySelector(selector);
            if (field && field.offsetParent !== null) { // Check if visible
              passwordField = field;
              console.log('🔑 [WEBVIEW] Found password field:', selector);
              break;
            }
          }
          
          // If no password field found by selectors, try finding by label text
          if (!passwordField) {
            const labels = document.querySelectorAll('label');
            for (let label of labels) {
              const labelText = label.textContent || label.innerText || '';
              if (labelText.toLowerCase().includes('password') || 
                  labelText.toLowerCase().includes('passwd') ||
                  labelText.toLowerCase().includes('pwd')) {
                const forAttr = label.getAttribute('for');
                if (forAttr) {
                  const field = document.getElementById(forAttr);
                  if (field && field.offsetParent !== null) {
                    passwordField = field;
                    console.log('🔑 [WEBVIEW] Found password field by label:', labelText.trim());
                    break;
                  }
                }
                // Also check if the input is a sibling or child of the label
                const nearbyInput = label.querySelector('input') || label.nextElementSibling;
                if (nearbyInput && nearbyInput.tagName === 'INPUT' && nearbyInput.offsetParent !== null) {
                  passwordField = nearbyInput;
                  console.log('🔑 [WEBVIEW] Found password field near label:', labelText.trim());
                  break;
                }
              }
            }
          }
          
          let filled = false;
          
          // Function to simulate realistic user input
          function simulateUserInput(field, value) {
            if (!field) return false;
            
            // Human-like random delays (in milliseconds)
            const focusDelay = 50 + Math.random() * 100; // 50-150ms
            const typingDelay = 80 + Math.random() * 120; // 80-200ms (realistic typing speed)
            const blurDelay = 30 + Math.random() * 70; // 30-100ms
            
            // Clear the field first
            field.focus();
            field.select();
            field.value = '';
            
            // Trigger events that happen when user clears field
            field.dispatchEvent(new Event('focus', { bubbles: true }));
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
            
            // Random delay to simulate human thinking/typing time
            setTimeout(() => {
              // Set the value
              field.value = value;
              
              // Trigger comprehensive events that simulate user typing
              field.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
              field.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
              field.dispatchEvent(new Event('keyup', { bubbles: true, cancelable: true }));
              field.dispatchEvent(new Event('keydown', { bubbles: true, cancelable: true }));
              field.dispatchEvent(new Event('keypress', { bubbles: true, cancelable: true }));
              
              // Trigger React/Angular specific events
              const inputEvent = new Event('input', { bubbles: true });
              Object.defineProperty(inputEvent, 'target', { value: field, enumerable: true });
              field.dispatchEvent(inputEvent);
              
              // Random delay before blur to complete the input cycle
              setTimeout(() => {
                field.dispatchEvent(new Event('blur', { bubbles: true }));
              }, blurDelay);
            }, typingDelay);
            
            return true;
          }
          
          if (usernameField) {
            console.log('✅ [WEBVIEW] Filling username field with enhanced simulation');
            simulateUserInput(usernameField, '${employeeId.trim()}');
            filled = true;
          }
          
          if (passwordField) {
            console.log('✅ [WEBVIEW] Filling password field with enhanced simulation');
            // Random delay between username and password (realistic user behavior)
            const fieldSwitchDelay = 150 + Math.random() * 300; // 150-450ms
            setTimeout(() => {
              simulateUserInput(passwordField, '${password.trim()}');
            }, fieldSwitchDelay);
            filled = true;
          }
          
          if (filled) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'credentials_filled',
              success: true,
              usernameFound: !!usernameField,
              passwordFound: !!passwordField
            }));
          } else {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'credentials_filled',
              success: false,
              error: 'No login fields found on this page'
            }));
          }
          
          return filled;
        } catch (error) {
          console.error('❌ [WEBVIEW] Error filling credentials:', error);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'credentials_filled',
            success: false,
            error: error.message
          }));
          return false;
        }
      })();
    `;

    webViewRef.current.injectJavaScript(fillScript);
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
        <Text style={styles.demoButtonText}>View Demo Schedule</Text>
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
      <View style={styles.webViewHeaderContainer}>
        <Text style={styles.title}>In-App Authentication</Text>
        <Text style={styles.subtitle}>
          Complete your login within the app to capture session data
        </Text>
      </View>

      <View style={styles.webViewContentContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: APP_CONFIG.PORTAL_URLS.BASE }}
          onNavigationStateChange={(navState) => {
            console.log('🌐 [WEBVIEW] Navigation:', navState.url);
            console.log('📋 [WEBVIEW] Page title:', navState.title);
            console.log('🔄 [WEBVIEW] Loading:', navState.loading);
            console.log('🔗 [WEBVIEW] Can go back:', navState.canGoBack);
            console.log('🔗 [WEBVIEW] Can go forward:', navState.canGoForward);
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
                            }
                          },
                          { 
                            text: 'Copy to Clipboard', 
                            onPress: async () => {
                              try {
                                const Clipboard = require('@react-native-clipboard/clipboard').default;
                                await Clipboard.setString(parsedMessage.html);
                                Alert.alert('HTML Copied', 'The HTML content has been copied to your clipboard for debugging.');
                              } catch (error) {
                                console.error('Failed to copy HTML:', error);
                                // Fallback: just log it
                                console.log('🔍 [DEBUG] Full HTML content (clipboard failed):');
                                console.log(parsedMessage.html);
                                Alert.alert('Copy Failed', 'Could not copy to clipboard, but HTML has been logged to console.');
                              }
                            }
                          },
                          { text: 'Cancel' }
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
                              }
                            },
                            { text: 'Cancel' }
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
                            }
                          },
                          { text: 'OK' }
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
                      [{ text: 'OK' }]
                    );
                  } else {
                    Alert.alert(
                      'Could Not Fill Credentials',
                      `Unable to automatically fill login fields: ${parsedMessage.error}\n\nThis might happen if:\n• The page hasn't fully loaded\n• The login form uses non-standard field names\n• The fields are in an iframe\n\nYou can manually enter your credentials in the webpage.`,
                      [{ text: 'OK' }]
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
                          schedule.html
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
                          onPress: () => onLoginSuccess() 
                        },
                        { text: 'Stay Here', style: 'cancel' }
                      ]
                    );
                  } else {
                    Alert.alert(
                      'No Schedules Found',
                      `Attempted to extract ${totalWeeks} weeks but no schedule data was found. The page might not have loaded properly or the schedule format may have changed.`,
                      [{ text: 'OK' }]
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
                          { text: 'Continue Testing', style: 'cancel' }
                        ]
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
                            }
                          },
                          { text: 'OK' }
                        ]
                      );
                    }
                  } catch (error) {
                    console.error('❌ [WEBVIEW] Error processing Week 1 schedule:', error);
                    Alert.alert(
                      'Week 1 Processing Error',
                      `Week 1 loaded but processing failed: ${error instanceof Error ? error.message : 'Unknown error'}\n\nSelected Week: ${parsedMessage.selectedWeek}`,
                      [{ text: 'OK' }]
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
                        }
                      },
                      { text: 'OK' }
                    ]
                  );
                } else if (parsedMessage.type === 'week1_error') {
                  console.log('❌ [WEBVIEW] Week 1 test error:', parsedMessage);
                  Alert.alert(
                    'Week 1 Test Error ❌',
                    `Week 1 test failed: ${parsedMessage.error}\n\nThis helps us identify what's not working in the dropdown selection process.`,
                    [{ text: 'OK' }]
                  );
                } else if (parsedMessage.type === 'page_diagnostic') {
                  console.log('🔍 [WEBVIEW] Page diagnostic results:', parsedMessage);
                  Alert.alert(
                    'Page Diagnostics Results 🔍',
                    `Current Page Analysis:\n\n` +
                    `URL: ${parsedMessage.url.substring(0, 50)}...\n` +
                    `Title: ${parsedMessage.title}\n` +
                    `Content Length: ${parsedMessage.contentLength}\n` +
                    `Select Elements: ${parsedMessage.selectCount}\n` +
                    `Button Elements: ${parsedMessage.buttonCount}\n` +
                    `Iframe Elements: ${parsedMessage.iframeCount}\n\n` +
                    `Key Content:\n` +
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
                        }
                      },
                      { text: 'OK' }
                    ]
                  );
                } else if (parsedMessage.type === 'diagnostic_error') {
                  console.log('❌ [WEBVIEW] Diagnostic error:', parsedMessage);
                  Alert.alert(
                    'Diagnostic Error ❌',
                    `Error running page diagnostics: ${parsedMessage.error}`,
                    [{ text: 'OK' }]
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
          onLoadStart={() => {
            console.log('🚀 [WEBVIEW] Load started');
          }}
          onLoadEnd={() => {
            console.log('✅ [WEBVIEW] Load ended');
          }}
          onLoadProgress={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.log('📊 [WEBVIEW] Load progress:', Math.round(nativeEvent.progress * 100) + '%');
          }}
          style={styles.webView}
          startInLoadingState={true}
          javaScriptEnabled={!debugMode}
          domStorageEnabled={true}
          thirdPartyCookiesEnabled={true}
          sharedCookiesEnabled={true}
          hideKeyboardAccessoryView={Platform.OS === 'ios'}
          keyboardDisplayRequiresUserAction={false}
          nestedScrollEnabled={false}
          mixedContentMode="compatibility"
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
          onPress={fillWebViewCredentials}
        >
          <Text style={[styles.demoButtonText, { color: COLORS.info }]}>
            🔑 Fill Login Credentials
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.demoButton, { borderColor: COLORS.primary, marginBottom: SPACING.md }]} 
          onPress={async () => {
            console.log('🍪 [UI] Manually extracting session cookies...');
            if (!webViewRef.current) {
              Alert.alert('Error', 'WebView not ready'); return;
            }
            try {
              const extractCookiesScript = '(function() { try { const cookies = document.cookie; const url = window.location.href; const title = document.title; const result = { type: \'manual_extraction\', cookies: cookies, url: url, title: title, timestamp: new Date().toISOString() }; window.ReactNativeWebView.postMessage(JSON.stringify(result)); return true; } catch (error) { window.ReactNativeWebView.postMessage(JSON.stringify({ type: \'extraction_error\', error: error.message })); return false; } })();';
              webViewRef.current.injectJavaScript(extractCookiesScript);
            } catch (error) {
              console.error('❌ [UI] Cookie extraction error:', error);
              Alert.alert('Extraction Error', 'Error extracting cookies: ' + (error as Error).message);
            }
          }}
        >
          <Text style={[styles.demoButtonText, { color: COLORS.primary }]}>
            🍪 Extract Session Cookies
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.demoButton, { borderColor: COLORS.success, marginBottom: SPACING.md }]} 
          onPress={async () => {
            console.log('🧪 [UI] Attempting to extract and parse schedule HTML from WebView...');
            if (!webViewRef.current) {
              Alert.alert('Error', 'WebView not available. Please ensure you are on the WebView screen.');
              return;
            }
            try {
              const getHtmlScript = `
              (function() { 
                try { 
                  console.log('🔍 Starting enhanced HTML extraction...');
                  
                  // Define the missing variables that are referenced later
                  const allSelects = document.querySelectorAll('select');
                  const allOptions = document.querySelectorAll('option');
                  const allButtons = document.querySelectorAll('input[type="submit"], button, input[type="button"]');
                  
                  // Check if we're on the schedule selection page
                  const pageTitle = document.title || '';
                  const pageContent = document.body.innerText || '';
                  const pageHTML = document.body.innerHTML || '';
                  
                  // Enhanced detection logic
                  const hasWeeklyScheduleText = pageContent.includes('Weekly Schedule');
                  const hasWeekEndDateText = pageContent.includes('Week End Date');
                  const hasWeeklyScheduleInHTML = pageHTML.includes('Weekly Schedule');
                  const hasWeekEndDateInHTML = pageHTML.includes('Week End Date');
                  
                  // Look for specific elements
                  const weekEndDateLabels = document.querySelectorAll('*');
                  let hasWeekEndDateLabel = false;
                  let weekEndDateLabelText = '';
                  
                  for (let elem of weekEndDateLabels) {
                    const text = elem.textContent || elem.innerText || '';
                    if (text.includes('Week End Date')) {
                      hasWeekEndDateLabel = true;
                      weekEndDateLabelText = text.trim();
                      break;
                    }
                  }
                  
                  // Check URL patterns
                  const currentURL = window.location.href;
                  const isPromptingURL = currentURL.includes('prompting') || currentURL.includes('prompt');
                  const isCognosURL = currentURL.includes('cognos');
                  const isViewerURL = currentURL.includes('viewer');
                  
                  console.log('🔍 [DEBUG] Enhanced page analysis:');
                  console.log('  - Page title:', pageTitle);
                  console.log('  - Current URL:', currentURL);
                  console.log('  - Is Cognos URL:', isCognosURL);
                  console.log('  - Is Viewer URL:', isViewerURL);
                  console.log('  - Is Prompting URL:', isPromptingURL);
                  console.log('  - Page content length:', pageContent.length);
                  console.log('  - Page HTML length:', pageHTML.length);
                  console.log('');
                  console.log('🔍 [DEBUG] Text detection:');
                  console.log('  - Page contains "Weekly Schedule" (text):', hasWeeklyScheduleText);
                  console.log('  - Page contains "Week End Date" (text):', hasWeekEndDateText);
                  console.log('  - Page contains "Weekly Schedule" (HTML):', hasWeeklyScheduleInHTML);
                  console.log('  - Page contains "Week End Date" (HTML):', hasWeekEndDateInHTML);
                  console.log('  - Has Week End Date label element:', hasWeekEndDateLabel);
                  console.log('  - Week End Date label text:', weekEndDateLabelText);
                  console.log('');
                  console.log('🔍 [DEBUG] Element counts:');
                  console.log('  - Total select elements:', allSelects.length);
                  console.log('  - Total option elements:', allOptions.length);
                  console.log('  - Total button elements:', allButtons.length);
                  console.log('');
                  console.log('🔍 [DEBUG] Page content preview (first 1000 chars):');
                  console.log(pageContent.substring(0, 1000));
                  console.log('');
                  console.log('🔍 [DEBUG] Page content preview (search for key terms):');
                  const weeklyPos = pageContent.toLowerCase().indexOf('weekly schedule');
                  const weekEndPos = pageContent.toLowerCase().indexOf('week end date');
                  console.log('  - "weekly schedule" position:', weeklyPos);
                  console.log('  - "week end date" position:', weekEndPos);
                  if (weeklyPos >= 0) {
                    console.log('  - Context around "weekly schedule":', pageContent.substring(Math.max(0, weeklyPos - 50), weeklyPos + 100));
                  }
                  if (weekEndPos >= 0) {
                    console.log('  - Context around "week end date":', pageContent.substring(Math.max(0, weekEndPos - 50), weekEndPos + 100));
                  }
                  
                  // More strict detection criteria
                  const isSchedulePage = (hasWeeklyScheduleText || hasWeeklyScheduleInHTML) && 
                                        (hasWeekEndDateText || hasWeekEndDateInHTML || hasWeekEndDateLabel) &&
                                        allSelects.length > 0;
                  
                  console.log('');
                  console.log('🔍 [DEBUG] Final determination:');
                  console.log('  - Is schedule page:', isSchedulePage);
                  console.log('  - Criteria met:');
                  console.log('    * Has Weekly Schedule text:', hasWeeklyScheduleText || hasWeeklyScheduleInHTML);
                  console.log('    * Has Week End Date text:', hasWeekEndDateText || hasWeekEndDateInHTML || hasWeekEndDateLabel);
                  console.log('    * Has select elements:', allSelects.length > 0);
                  
                  if (isSchedulePage) {
                    console.log('📅 [WEBVIEW] Detected schedule selection page - extracting all weeks');
                    
                    // Find the dropdown for week selection
                    const dropdowns = document.querySelectorAll('select');
                    let weekDropdown = null;
                    
                    console.log('🔍 [DEBUG] Dropdown analysis:');
                    console.log('  - Total dropdowns found:', dropdowns.length);
                    
                    // Enhanced dropdown detection with more detailed logging
                    for (let i = 0; i < dropdowns.length; i++) {
                      const dropdown = dropdowns[i];
                      const parentElement = dropdown.parentElement;
                      const grandParentElement = parentElement ? parentElement.parentElement : null;
                      
                      // Get text from various parent levels
                      const nearbyText = parentElement?.innerText || '';
                      const grandParentText = grandParentElement?.innerText || '';
                      const allNearbyText = nearbyText + ' ' + grandParentText;
                      
                      // Check various criteria
                      const hasWeekEndDate = allNearbyText.includes('Week End Date');
                      const hasWeek = allNearbyText.toLowerCase().includes('week');
                      const hasDate = allNearbyText.toLowerCase().includes('date');
                      const hasMultipleOptions = dropdown.options.length > 1;
                      const isVisible = dropdown.offsetParent !== null;
                      
                      console.log('  - Dropdown ' + i + ':');
                      console.log('    * Element:', dropdown);
                      console.log('    * Options count: ' + dropdown.options.length);
                      console.log('    * Is visible: ' + isVisible);
                      console.log('    * Dropdown name: "' + dropdown.name + '"');
                      console.log('    * Dropdown id: "' + dropdown.id + '"');
                      console.log('    * Parent text (100 chars): "' + nearbyText.substring(0, 100) + '"');
                      console.log('    * GrandParent text (100 chars): "' + grandParentText.substring(0, 100) + '"');
                      console.log('    * Has "Week End Date": ' + hasWeekEndDate);
                      console.log('    * Has "week": ' + hasWeek);
                      console.log('    * Has "date": ' + hasDate);
                      console.log('    * Has multiple options: ' + hasMultipleOptions);
                      
                      if (dropdown.options.length > 0) {
                        console.log('    * Options preview:');
                        for (let j = 0; j < Math.min(dropdown.options.length, 3); j++) {
                          const option = dropdown.options[j];
                          console.log('      - Option ' + j + ': value="' + option.value + '", text="' + option.text + '"');
                        }
                        if (dropdown.options.length > 3) {
                          console.log('      - ... and ' + (dropdown.options.length - 3) + ' more options');
                        }
                      }
                      
                      // More flexible dropdown selection criteria
                      const isLikelyWeekDropdown = (hasWeekEndDate || hasWeek || hasDate) && hasMultipleOptions && isVisible;
                      console.log('    * Is likely week dropdown: ' + isLikelyWeekDropdown);
                      
                      if (isLikelyWeekDropdown && !weekDropdown) {
                        weekDropdown = dropdown;
                        console.log('✅ [DEBUG] Selected dropdown ' + i + ' as week dropdown');
                      }
                    }
                    
                    // If no dropdown found by text criteria, try the first dropdown with multiple options
                    if (!weekDropdown && dropdowns.length > 0) {
                      for (let i = 0; i < dropdowns.length; i++) {
                        const dropdown = dropdowns[i];
                        if (dropdown.options.length > 1 && dropdown.offsetParent !== null) {
                          weekDropdown = dropdown;
                          console.log('🔄 [DEBUG] Fallback: Selected dropdown ' + i + ' (first with multiple options)');
                          break;
                        }
                      }
                    }
                    
                    if (weekDropdown && weekDropdown.options.length > 1) {
                      const totalWeeks = weekDropdown.options.length;
                      console.log('📅 [WEBVIEW] Found week dropdown with', totalWeeks, 'weeks available');
                      console.log('🔍 [DEBUG] Week dropdown final details:');
                      console.log('  - Dropdown element:', weekDropdown);
                      console.log('  - Current selected index:', weekDropdown.selectedIndex);
                      console.log('  - Current value:', weekDropdown.value);
                      console.log('  - Total options:', totalWeeks);
                      
                      // Log all available weeks
                      console.log('  - All available weeks:');
                      for (let k = 0; k < totalWeeks; k++) {
                        const opt = weekDropdown.options[k];
                        console.log('    * Week ' + (k + 1) + ': value="' + opt.value + '", text="' + opt.text + '"');
                      }
                      
                      // Find the Run button before starting extraction
                      const allButtons = document.querySelectorAll('input[type="submit"], button, input[type="button"]');
                      let runButton = null;
                      
                      console.log('🔍 [DEBUG] Pre-extraction button search:');
                      console.log('  - Total buttons found:', allButtons.length);
                      
                      for (let b = 0; b < allButtons.length; b++) {
                        const btn = allButtons[b];
                        const btnText = (btn.value || btn.innerText || btn.textContent || '').toLowerCase();
                        const isRunButton = btnText.includes('run') || btnText.includes('submit') || btnText.includes('go') || btnText.includes('execute');
                        const isVisible = btn.offsetParent !== null;
                        
                        console.log('  - Button ' + b + ':');
                        console.log('    * Type: ' + btn.type);
                        console.log('    * Value: "' + btn.value + '"');
                        console.log('    * InnerText: "' + btn.innerText + '"');
                        console.log('    * TextContent: "' + btn.textContent + '"');
                        console.log('    * Combined text: "' + btnText + '"');
                        console.log('    * Is run button: ' + isRunButton);
                        console.log('    * Is visible: ' + isVisible);
                        console.log('    * Element: ', btn);
                        
                        if (isRunButton && isVisible && !runButton) {
                          runButton = btn;
                          console.log('✅ [DEBUG] Pre-selected run button: ' + b);
                        }
                      }
                      
                      if (!runButton) {
                        console.log('❌ [DEBUG] No run button found! Cannot proceed with extraction.');
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                          type: 'extraction_error',
                          error: 'No run button found on schedule page. Found ' + allButtons.length + ' buttons total.'
                        }));
                        return;
                      }
                      
                      console.log('🚀 [DEBUG] Starting multi-week extraction process...');
                      console.log('  - Week dropdown: ready');
                      console.log('  - Run button: ready');
                      console.log('  - Total weeks to process: ' + totalWeeks);
                      
                      // Extract all schedules
                      let allSchedules = [];
                      let currentWeek = 0;
                      
                      function extractNextWeek() {
                        console.log('');
                        console.log('🔄 [DEBUG] === EXTRACTING WEEK ' + (currentWeek + 1) + ' of ' + totalWeeks + ' ===');
                        console.log('🔄 [DEBUG] extractNextWeek called, currentWeek:', currentWeek, 'totalWeeks:', totalWeeks);
                        
                        if (currentWeek >= totalWeeks) {
                          // All weeks processed, send results
                          console.log('');
                          console.log('✅ [DEBUG] === ALL WEEKS COMPLETED ===');
                          console.log('✅ [DEBUG] All weeks processed, sending results');
                          console.log('  - Total schedules extracted:', allSchedules.length);
                          window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'multiple_schedules_extracted',
                            schedules: allSchedules,
                            totalWeeks: totalWeeks,
                            url: window.location.href,
                            title: document.title
                          }));
                          return;
                        }
                        
                        const option = weekDropdown.options[currentWeek];
                        const weekText = option.text || option.value;
                        console.log('📅 [WEBVIEW] Processing week', currentWeek + 1, ':', weekText);
                        console.log('🔍 [DEBUG] Week selection details:');
                        console.log('  - Option index:', currentWeek);
                        console.log('  - Option value: "' + option.value + '"');
                        console.log('  - Option text: "' + option.text + '"');
                        console.log('  - Current dropdown selectedIndex before:', weekDropdown.selectedIndex);
                        console.log('  - Current dropdown value before: "' + weekDropdown.value + '"');
                        
                        // Select the week
                        console.log('🖱️ [DEBUG] Selecting week in dropdown...');
                        weekDropdown.selectedIndex = currentWeek;
                        weekDropdown.value = option.value;
                        
                        // Trigger change events
                        console.log('📡 [DEBUG] Triggering change events...');
                        weekDropdown.dispatchEvent(new Event('change', { bubbles: true }));
                        weekDropdown.dispatchEvent(new Event('input', { bubbles: true }));
                        
                        console.log('🔍 [DEBUG] After selection:');
                        console.log('  - New selectedIndex:', weekDropdown.selectedIndex);
                        console.log('  - New value: "' + weekDropdown.value + '"');
                        console.log('  - Selected option text: "' + weekDropdown.options[weekDropdown.selectedIndex].text + '"');
                        
                        // Small delay to let the dropdown selection register
                        setTimeout(() => {
                          console.log('🖱️ [DEBUG] About to click run button...');
                          console.log('  - Run button element:', runButton);
                          console.log('  - Run button visible:', runButton.offsetParent !== null);
                          
                          // Set up a listener for when the schedule loads
                          let checkCount = 0;
                          const maxChecks = 20; // 10 seconds max
                          
                          const checkForSchedule = setInterval(() => {
                            checkCount++;
                            const scheduleContent = document.body.innerHTML;
                            const hasEmployeeNum = scheduleContent.includes('Employee #');
                            const hasTotalHours = scheduleContent.includes('Total Hours');
                            const hasScheduleDetail = scheduleContent.includes('Schedule Detail');
                            const hasWeeklyScheduleTitle = scheduleContent.includes('Weekly Schedule');
                            const hasScheduleData = hasEmployeeNum || hasTotalHours || hasScheduleDetail;
                            
                            // Check if we're still on the parameter page (bad) or on results page (good)
                            const stillOnParameterPage = scheduleContent.includes('Week End Date') && 
                                                        document.querySelectorAll('select').length > 0;
                            
                            console.log('🔍 [DEBUG] Schedule check ' + checkCount + '/' + maxChecks + ' for week ' + (currentWeek + 1) + ':');
                            console.log('  - Content length: ' + scheduleContent.length);
                            console.log('  - Has Employee #: ' + hasEmployeeNum);
                            console.log('  - Has Total Hours: ' + hasTotalHours);
                            console.log('  - Has Schedule Detail: ' + hasScheduleDetail);
                            console.log('  - Has Weekly Schedule title: ' + hasWeeklyScheduleTitle);
                            console.log('  - Has schedule data: ' + hasScheduleData);
                            console.log('  - Still on parameter page: ' + stillOnParameterPage);
                            
                            // Check if schedule data has loaded (and we're not still on parameter page)
                            if (hasScheduleData && !stillOnParameterPage) {
                              clearInterval(checkForSchedule);
                              console.log('✅ [DEBUG] Schedule loaded for week ' + (currentWeek + 1) + ' after ' + checkCount + ' checks');
                              console.log('  - Content preview (first 500 chars):');
                              console.log(scheduleContent.substring(0, 500));
                              
                              // Extract this week's schedule
                              allSchedules.push({
                                weekNumber: currentWeek + 1,
                                weekText: weekText,
                                html: scheduleContent,
                                extractedAt: new Date().toISOString(),
                                checksRequired: checkCount
                              });
                              
                              console.log('📅 [DEBUG] Added schedule to collection:');
                              console.log('  - Week number:', currentWeek + 1);
                              console.log('  - Week text: "' + weekText + '"');
                              console.log('  - HTML length:', scheduleContent.length);
                              console.log('  - Total schedules so far:', allSchedules.length);
                              
                              // Move to next week
                              currentWeek++;
                              
                              // Delay before processing next week
                              const nextDelay = 1000 + Math.random() * 1000; // 1-2 seconds
                              console.log('⏳ [DEBUG] Waiting ' + Math.round(nextDelay) + 'ms before next week');
                              setTimeout(() => {
                                extractNextWeek();
                              }, nextDelay);
                              
                            } else if (checkCount >= maxChecks) {
                              // Timeout
                              clearInterval(checkForSchedule);
                              console.log('⚠️ [DEBUG] Timeout waiting for schedule ' + (currentWeek + 1) + ' after ' + checkCount + ' checks');
                              console.log('  - Final content length:', scheduleContent.length);
                              console.log('  - Still on parameter page:', stillOnParameterPage);
                              
                              // Still try to extract what we can
                              allSchedules.push({
                                weekNumber: currentWeek + 1,
                                weekText: weekText,
                                html: scheduleContent,
                                extractedAt: new Date().toISOString(),
                                timeout: true,
                                checksAttempted: checkCount,
                                stuckOnParameterPage: stillOnParameterPage
                              });
                              
                              console.log('📅 [DEBUG] Added timeout schedule to collection (week ' + (currentWeek + 1) + ')');
                              
                              currentWeek++;
                              setTimeout(() => {
                                extractNextWeek();
                              }, 500);
                            }
                          }, 500); // Check every 500ms
                          
                          // Click the run button
                          console.log('🖱️ [DEBUG] Clicking run button NOW...');
                          try {
                            runButton.click();
                            console.log('✅ [DEBUG] Run button clicked successfully for week ' + (currentWeek + 1));
                          } catch (clickError) {
                            console.log('❌ [DEBUG] Error clicking run button:', clickError);
                            clearInterval(checkForSchedule);
                            currentWeek++;
                            setTimeout(() => {
                              extractNextWeek();
                            }, 500);
                          }
                          
                        }, 300); // Small delay after dropdown selection
                      }
                      
                      // Start extracting from first week
                      console.log('🚀 [DEBUG] Initiating extraction sequence...');
                      extractNextWeek();
                      
                    } else {
                      console.log('❌ [WEBVIEW] Could not find suitable week dropdown');
                      console.log('  - Total dropdowns found:', dropdowns.length);
                      console.log('  - Dropdowns with multiple options:', Array.from(dropdowns).filter(d => d.options.length > 1).length);
                      console.log('  - Visible dropdowns:', Array.from(dropdowns).filter(d => d.offsetParent !== null).length);
                      
                      // Fall back to single schedule extraction
                      const mainHtml = document.documentElement.outerHTML;
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'enhanced_schedule_html',
                        html: mainHtml,
                        url: window.location.href,
                        title: document.title,
                        foundInIframe: false,
                        iframeCount: 0,
                        hasScheduleContent: mainHtml.includes('Weekly Schedule'),
                        mainHtmlLength: mainHtml.length,
                        scheduleHtmlLength: mainHtml.length,
                        dropdownSearchFailed: true,
                        dropdownCount: dropdowns.length
                      }));
                    }
                    
                  } else {
                    // Not on schedule page, do regular extraction
                    console.log('🔍 [WEBVIEW] Not on schedule page, doing regular extraction');
                    
                    // Get main document HTML
                    const mainHtml = document.documentElement.outerHTML;
                    
                    // Look for iframes that might contain the schedule
                    const iframes = document.querySelectorAll('iframe');
                    console.log('Found', iframes.length, 'iframes');
                    
                    let scheduleContent = null;
                    let foundInIframe = false;
                    
                    // Check each iframe for schedule content
                    for (let i = 0; i < iframes.length; i++) {
                      try {
                        const iframe = iframes[i];
                        console.log('Checking iframe', i, 'src:', iframe.src);
                        
                        if (iframe.contentDocument) {
                          const iframeHtml = iframe.contentDocument.documentElement.outerHTML;
                          console.log('Iframe', i, 'HTML length:', iframeHtml.length);
                          
                          // Check if this iframe contains schedule data
                          if (iframeHtml.includes('Weekly Schedule') || 
                              iframeHtml.includes('Employee #') || 
                              iframeHtml.includes('Total Hours') ||
                              iframeHtml.includes('Schedule Detail')) {
                            console.log('Found schedule content in iframe', i);
                            scheduleContent = iframeHtml;
                            foundInIframe = true;
                            break;
                          }
                        }
                      } catch (e) {
                        console.log('Cannot access iframe', i, 'due to cross-origin:', e.message);
                      }
                    }
                    
                    // If no schedule found in iframes, check main document more thoroughly
                    if (!scheduleContent) {
                      console.log('No schedule found in iframes, checking main document...');
                      
                      // Look for specific elements that might contain schedule data
                      const scheduleElements = [
                        document.querySelector('[id*="schedule"]'),
                        document.querySelector('[class*="schedule"]'),
                        document.querySelector('[id*="report"]'),
                        document.querySelector('[class*="report"]'),
                        document.querySelector('table'),
                        document.querySelector('[id*="content"]'),
                        document.querySelector('[class*="content"]')
                      ];
                      
                      for (let elem of scheduleElements) {
                        if (elem && elem.innerHTML) {
                          const elemHtml = elem.outerHTML;
                          if (elemHtml.includes('Weekly Schedule') || 
                              elemHtml.includes('Employee #') || 
                              elemHtml.includes('Total Hours')) {
                            console.log('Found schedule content in element:', elem.tagName, elem.id, elem.className);
                            scheduleContent = elemHtml;
                            break;
                          }
                        }
                      }
                    }
                    
                    // Prepare result
                    const result = {
                      type: 'enhanced_schedule_html',
                      html: scheduleContent || mainHtml,
                      url: window.location.href,
                      title: document.title,
                      foundInIframe: foundInIframe,
                      iframeCount: iframes.length,
                      hasScheduleContent: !!scheduleContent,
                      mainHtmlLength: mainHtml.length,
                      scheduleHtmlLength: scheduleContent ? scheduleContent.length : 0
                    };
                    
                    window.ReactNativeWebView.postMessage(JSON.stringify(result));
                  }
                  
                  return true;
                } catch (e) { 
                  window.ReactNativeWebView.postMessage(JSON.stringify({ 
                    type: 'schedule_html_error', 
                    error: e.message 
                  })); 
                  return false; 
                } 
              })();`;
              
              webViewRef.current.injectJavaScript(getHtmlScript);
              Alert.alert('Multi-Week Extraction', 'Importing all available schedules. This may take a moment...');
            } catch (error) {
              console.error('❌ [UI] Enhanced HTML extraction error:', error);
              Alert.alert('Extraction Error', 'Error attempting enhanced schedule extraction: ' + (error as Error).message);
            }
          }}
        >
          <Text style={[styles.demoButtonText, { color: COLORS.success }]}>
            🔍 Import Schedule
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.demoButton, { borderColor: COLORS.warning, marginBottom: SPACING.md }]} 
          onPress={async () => {
            console.log('📅 [UI] Testing Week 1 loading...');
            if (!webViewRef.current) {
              Alert.alert('Error', 'WebView not available. Please ensure you are on the WebView screen.');
              return;
            }
            try {
              const loadWeek1Script = `
              (function() { 
                try { 
                  console.log('📅 [WEEK1] Starting Week 1 load test...');
                  
                  // Find all dropdowns
                  const allDropdowns = document.querySelectorAll('select');
                  console.log('📅 [WEEK1] Found ' + allDropdowns.length + ' dropdowns total');
                  
                  let weekDropdown = null;
                  
                  // Enhanced dropdown detection
                  for (let i = 0; i < allDropdowns.length; i++) {
                    const dropdown = allDropdowns[i];
                    const parentElement = dropdown.parentElement;
                    const grandParentElement = parentElement ? parentElement.parentElement : null;
                    
                    // Get text from various parent levels
                    const nearbyText = parentElement?.innerText || '';
                    const grandParentText = grandParentElement?.innerText || '';
                    const allNearbyText = nearbyText + ' ' + grandParentText;
                    
                    // Check various criteria
                    const hasWeekEndDate = allNearbyText.includes('Week End Date');
                    const hasWeek = allNearbyText.toLowerCase().includes('week');
                    const hasDate = allNearbyText.toLowerCase().includes('date');
                    const hasMultipleOptions = dropdown.options.length > 1;
                    const isVisible = dropdown.offsetParent !== null;
                    
                    console.log('📅 [WEEK1] Dropdown ' + i + ' analysis:');
                    console.log('  - Options count: ' + dropdown.options.length);
                    console.log('  - Is visible: ' + isVisible);
                    console.log('  - Name: "' + dropdown.name + '"');
                    console.log('  - ID: "' + dropdown.id + '"');
                    console.log('  - Parent text: "' + nearbyText.substring(0, 100) + '"');
                    console.log('  - Has Week End Date: ' + hasWeekEndDate);
                    console.log('  - Has week: ' + hasWeek);
                    console.log('  - Has date: ' + hasDate);
                    console.log('  - Has multiple options: ' + hasMultipleOptions);
                    
                    if (dropdown.options.length > 0) {
                      console.log('  - First 3 options:');
                      for (let j = 0; j < Math.min(dropdown.options.length, 3); j++) {
                        const option = dropdown.options[j];
                        console.log('    * Option ' + j + ': value="' + option.value + '", text="' + option.text + '"');
                      }
                    }
                    
                    // Selection criteria
                    const isLikelyWeekDropdown = (hasWeekEndDate || hasWeek || hasDate) && hasMultipleOptions && isVisible;
                    console.log('  - Is likely week dropdown: ' + isLikelyWeekDropdown);
                    
                    if (isLikelyWeekDropdown && !weekDropdown) {
                      weekDropdown = dropdown;
                      console.log('✅ [WEEK1] Selected dropdown ' + i + ' as week dropdown');
                    }
                  }
                  
                  // Fallback: use first dropdown with multiple options
                  if (!weekDropdown && allDropdowns.length > 0) {
                    for (let i = 0; i < allDropdowns.length; i++) {
                      const dropdown = allDropdowns[i];
                      if (dropdown.options.length > 1 && dropdown.offsetParent !== null) {
                        weekDropdown = dropdown;
                        console.log('🔄 [WEEK1] Fallback: Using dropdown ' + i + ' (first with multiple options)');
                        break;
                      }
                    }
                  }
                  
                  if (!weekDropdown) {
                    console.log('❌ [WEEK1] No suitable dropdown found!');
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'week1_error',
                      error: 'No week dropdown found. Found ' + allDropdowns.length + ' dropdowns total.'
                    }));
                    return;
                  }
                  
                  console.log('📅 [WEEK1] Using dropdown with ' + weekDropdown.options.length + ' options');
                  console.log('📅 [WEEK1] Current selection: index=' + weekDropdown.selectedIndex + ', value="' + weekDropdown.value + '"');
                  
                  // Show all options for debugging
                  console.log('📅 [WEEK1] All available options:');
                  for (let k = 0; k < weekDropdown.options.length; k++) {
                    const opt = weekDropdown.options[k];
                    console.log('  - Option ' + k + ': value="' + opt.value + '", text="' + opt.text + '"');
                  }
                  
                  // Select the first option (index 0)
                  const firstOption = weekDropdown.options[0];
                  console.log('📅 [WEEK1] Selecting first option: value="' + firstOption.value + '", text="' + firstOption.text + '"');
                  
                  // Record before state
                  console.log('📅 [WEEK1] BEFORE selection:');
                  console.log('  - selectedIndex: ' + weekDropdown.selectedIndex);
                  console.log('  - value: "' + weekDropdown.value + '"');
                  
                  // Select the first week
                  weekDropdown.selectedIndex = 0;
                  weekDropdown.value = firstOption.value;
                  
                  // Trigger events
                  console.log('📅 [WEEK1] Triggering change events...');
                  weekDropdown.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
                  weekDropdown.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                  
                  // Record after state
                  console.log('📅 [WEEK1] AFTER selection:');
                  console.log('  - selectedIndex: ' + weekDropdown.selectedIndex);
                  console.log('  - value: "' + weekDropdown.value + '"');
                  console.log('  - selected option text: "' + weekDropdown.options[weekDropdown.selectedIndex].text + '"');
                  
                  // Find Run button
                  const allButtons = document.querySelectorAll('input[type="submit"], button, input[type="button"]');
                  let runButton = null;
                  
                  console.log('📅 [WEEK1] Searching for Run button among ' + allButtons.length + ' buttons...');
                  
                  for (let b = 0; b < allButtons.length; b++) {
                    const btn = allButtons[b];
                    const btnText = (btn.value || btn.innerText || btn.textContent || '').toLowerCase();
                    const isRunButton = btnText.includes('run') || btnText.includes('submit') || btnText.includes('go') || btnText.includes('execute');
                    const isVisible = btn.offsetParent !== null;
                    
                    console.log('📅 [WEEK1] Button ' + b + ':');
                    console.log('  - Type: ' + btn.type);
                    console.log('  - Value: "' + btn.value + '"');
                    console.log('  - InnerText: "' + btn.innerText + '"');
                    console.log('  - TextContent: "' + btn.textContent + '"');
                    console.log('  - Combined text: "' + btnText + '"');
                    console.log('  - Is run button: ' + isRunButton);
                    console.log('  - Is visible: ' + isVisible);
                    
                    if (isRunButton && isVisible && !runButton) {
                      runButton = btn;
                      console.log('✅ [WEEK1] Selected button ' + b + ' as run button');
                    }
                  }
                  
                  if (!runButton) {
                    console.log('❌ [WEEK1] No run button found!');
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'week1_error',
                      error: 'No run button found. Found ' + allButtons.length + ' buttons total.'
                    }));
                    return;
                  }
                  
                  console.log('📅 [WEEK1] Found run button, waiting 500ms before clicking...');
                  
                  // Wait a bit then click
                  setTimeout(() => {
                    console.log('📅 [WEEK1] Clicking run button NOW...');
                    console.log('📅 [WEEK1] Button element: ', runButton);
                    console.log('📅 [WEEK1] Button still visible: ' + (runButton.offsetParent !== null));
                    
                    try {
                      runButton.click();
                      console.log('✅ [WEEK1] Run button clicked successfully!');
                      
                      // Monitor for page change
                      let checkCount = 0;
                      const maxChecks = 20;
                      
                      const checkForResults = setInterval(() => {
                        checkCount++;
                        const currentContent = document.body.innerHTML;
                        const hasEmployeeNum = currentContent.includes('Employee #');
                        const hasTotalHours = currentContent.includes('Total Hours');
                        const hasScheduleDetail = currentContent.includes('Schedule Detail');
                        const hasScheduleData = hasEmployeeNum || hasTotalHours || hasScheduleDetail;
                        
                        // Check if still on parameter page
                        const stillOnParameterPage = currentContent.includes('Week End Date') && 
                                                   document.querySelectorAll('select').length > 0;
                        
                        console.log('📅 [WEEK1] Check ' + checkCount + '/' + maxChecks + ':');
                        console.log('  - Content length: ' + currentContent.length);
                        console.log('  - Has Employee #: ' + hasEmployeeNum);
                        console.log('  - Has Total Hours: ' + hasTotalHours);
                        console.log('  - Has Schedule Detail: ' + hasScheduleDetail);
                        console.log('  - Has schedule data: ' + hasScheduleData);
                        console.log('  - Still on parameter page: ' + stillOnParameterPage);
                        console.log('  - Current URL: ' + window.location.href);
                        console.log('  - Page title: ' + document.title);
                        
                        if (hasScheduleData && !stillOnParameterPage) {
                          clearInterval(checkForResults);
                          console.log('✅ [WEEK1] SUCCESS! Schedule loaded after ' + checkCount + ' checks');
                          console.log('📅 [WEEK1] Content preview:');
                          console.log(currentContent.substring(0, 1000));
                          
                          window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'week1_success',
                            html: currentContent,
                            url: window.location.href,
                            title: document.title,
                            checksRequired: checkCount,
                            selectedWeek: firstOption.text
                          }));
                          
                        } else if (checkCount >= maxChecks) {
                          clearInterval(checkForResults);
                          console.log('⚠️ [WEEK1] TIMEOUT after ' + checkCount + ' checks');
                          console.log('📅 [WEEK1] Final state:');
                          console.log('  - Still on parameter page: ' + stillOnParameterPage);
                          console.log('  - Content length: ' + currentContent.length);
                          
                          window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'week1_timeout',
                            html: currentContent,
                            url: window.location.href,
                            title: document.title,
                            checksAttempted: checkCount,
                            stuckOnParameterPage: stillOnParameterPage,
                            selectedWeek: firstOption.text
                          }));
                        }
                      }, 500);
                      
                    } catch (clickError) {
                      console.log('❌ [WEEK1] Error clicking run button: ' + clickError.message);
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'week1_error',
                        error: 'Error clicking run button: ' + clickError.message
                      }));
                    }
                  }, 500);
                  
                  return true;
                } catch (e) { 
                  console.log('❌ [WEEK1] Script error: ' + e.message);
                  window.ReactNativeWebView.postMessage(JSON.stringify({ 
                    type: 'week1_error', 
                    error: 'Script error: ' + e.message 
                  })); 
                  return false; 
                } 
              })();`;
              
              webViewRef.current.injectJavaScript(loadWeek1Script);
              Alert.alert('Week 1 Test', 'Testing Week 1 loading. Check console for detailed logs...');
            } catch (error) {
              console.error('❌ [UI] Week 1 test error:', error);
              Alert.alert('Test Error', 'Error testing Week 1 load: ' + (error as Error).message);
            }
          }}
        >
          <Text style={[styles.demoButtonText, { color: COLORS.warning }]}>
            📅 Load Week 1
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.demoButton, { borderColor: COLORS.info, marginBottom: SPACING.md }]} 
          onPress={async () => {
            console.log('🔍 [UI] Running page diagnostics...');
            if (!webViewRef.current) {
              Alert.alert('Error', 'WebView not available. Please ensure you are on the WebView screen.');
              return;
            }
            try {
              const diagnosticScript = `
              (function() { 
                try { 
                  console.log('🔍 [DIAGNOSTIC] Starting comprehensive page analysis...');
                  
                  // Basic page info
                  const currentURL = window.location.href;
                  const pageTitle = document.title;
                  const pageContent = document.body.innerText || '';
                  const pageHTML = document.body.innerHTML || '';
                  
                  console.log('🔍 [DIAGNOSTIC] === BASIC PAGE INFO ===');
                  console.log('  - URL: ' + currentURL);
                  console.log('  - Title: ' + pageTitle);
                  console.log('  - Content length: ' + pageContent.length);
                  console.log('  - HTML length: ' + pageHTML.length);
                  console.log('  - Domain: ' + window.location.hostname);
                  console.log('  - Protocol: ' + window.location.protocol);
                  console.log('  - Pathname: ' + window.location.pathname);
                  
                  // Check for key text indicators
                  console.log('🔍 [DIAGNOSTIC] === TEXT CONTENT ANALYSIS ===');
                  const hasWeeklySchedule = pageContent.includes('Weekly Schedule');
                  const hasWeekEndDate = pageContent.includes('Week End Date');
                  const hasCognos = pageContent.toLowerCase().includes('cognos');
                  const hasEmployee = pageContent.includes('Employee');
                  const hasSchedule = pageContent.toLowerCase().includes('schedule');
                  const hasReport = pageContent.toLowerCase().includes('report');
                  
                  console.log('  - Contains "Weekly Schedule": ' + hasWeeklySchedule);
                  console.log('  - Contains "Week End Date": ' + hasWeekEndDate);
                  console.log('  - Contains "cognos": ' + hasCognos);
                  console.log('  - Contains "Employee": ' + hasEmployee);
                  console.log('  - Contains "schedule": ' + hasSchedule);
                  console.log('  - Contains "report": ' + hasReport);
                  
                  // Element counts
                  console.log('🔍 [DIAGNOSTIC] === ELEMENT COUNTS ===');
                  const allSelects = document.querySelectorAll('select');
                  const allInputs = document.querySelectorAll('input');
                  const allButtons = document.querySelectorAll('button');
                  const allSubmits = document.querySelectorAll('input[type="submit"]');
                  const allTables = document.querySelectorAll('table');
                  const allForms = document.querySelectorAll('form');
                  const allIframes = document.querySelectorAll('iframe');
                  const allDivs = document.querySelectorAll('div');
                  const allLinks = document.querySelectorAll('a');
                  
                  console.log('  - Select elements: ' + allSelects.length);
                  console.log('  - Input elements: ' + allInputs.length);
                  console.log('  - Button elements: ' + allButtons.length);
                  console.log('  - Submit inputs: ' + allSubmits.length);
                  console.log('  - Table elements: ' + allTables.length);
                  console.log('  - Form elements: ' + allForms.length);
                  console.log('  - Iframe elements: ' + allIframes.length);
                  console.log('  - Div elements: ' + allDivs.length);
                  console.log('  - Link elements: ' + allLinks.length);
                  
                  // Detailed select analysis
                  if (allSelects.length > 0) {
                    console.log('🔍 [DIAGNOSTIC] === SELECT ELEMENT DETAILS ===');
                    for (let i = 0; i < allSelects.length; i++) {
                      const select = allSelects[i];
                      console.log('  - Select ' + i + ':');
                      console.log('    * ID: "' + select.id + '"');
                      console.log('    * Name: "' + select.name + '"');
                      console.log('    * Class: "' + select.className + '"');
                      console.log('    * Options: ' + select.options.length);
                      console.log('    * Visible: ' + (select.offsetParent !== null));
                      console.log('    * Parent text: "' + (select.parentElement?.innerText || '').substring(0, 100) + '"');
                      if (select.options.length > 0) {
                        console.log('    * First 3 options:');
                        for (let j = 0; j < Math.min(select.options.length, 3); j++) {
                          console.log('      - "' + select.options[j].text + '" (value: "' + select.options[j].value + '")');
                        }
                      }
                    }
                  } else {
                    console.log('🔍 [DIAGNOSTIC] === NO SELECT ELEMENTS FOUND ===');
                    console.log('  - This indicates we are likely on a viewer page, not a parameter page');
                  }
                  
                  // Detailed button analysis
                  if (allButtons.length > 0 || allSubmits.length > 0) {
                    console.log('🔍 [DIAGNOSTIC] === BUTTON ELEMENT DETAILS ===');
                    const allButtonElements = [...allButtons, ...allSubmits];
                    for (let i = 0; i < Math.min(allButtonElements.length, 10); i++) {
                      const btn = allButtonElements[i];
                      console.log('  - Button ' + i + ':');
                      console.log('    * Type: ' + btn.type);
                      console.log('    * ID: "' + btn.id + '"');
                      console.log('    * Class: "' + btn.className + '"');
                      console.log('    * Value: "' + btn.value + '"');
                      console.log('    * InnerText: "' + btn.innerText + '"');
                      console.log('    * TextContent: "' + btn.textContent + '"');
                      console.log('    * Visible: ' + (btn.offsetParent !== null));
                      console.log('    * OnClick: ' + (btn.onclick ? 'has onclick' : 'no onclick'));
                    }
                  }
                  
                  // Detailed link analysis for navigation
                  console.log('🔍 [DIAGNOSTIC] === LINK ANALYSIS ===');
                  const relevantLinks = [];
                  for (let i = 0; i < Math.min(allLinks.length, 20); i++) {
                    const link = allLinks[i];
                    const linkText = (link.innerText || link.textContent || '').toLowerCase();
                    const href = link.href || '';
                    
                    // Look for links that might lead to parameter page
                    const isRelevant = linkText.includes('parameter') || 
                                      linkText.includes('prompt') || 
                                      linkText.includes('run') || 
                                      linkText.includes('edit') || 
                                      linkText.includes('modify') ||
                                      href.includes('prompt') ||
                                      href.includes('parameter');
                    
                    if (isRelevant || i < 5) { // Log first 5 links regardless
                      console.log('  - Link ' + i + ':');
                      console.log('    * Text: "' + linkText + '"');
                      console.log('    * Href: "' + href + '"');
                      console.log('    * Visible: ' + (link.offsetParent !== null));
                      console.log('    * Is relevant: ' + isRelevant);
                      
                      if (isRelevant) {
                        relevantLinks.push({
                          index: i,
                          text: linkText,
                          href: href,
                          element: link
                        });
                      }
                    }
                  }
                  
                  // Iframe analysis
                  if (allIframes.length > 0) {
                    console.log('🔍 [DIAGNOSTIC] === IFRAME ANALYSIS ===');
                    for (let i = 0; i < allIframes.length; i++) {
                      const iframe = allIframes[i];
                      console.log('  - Iframe ' + i + ':');
                      console.log('    * Src: "' + iframe.src + '"');
                      console.log('    * ID: "' + iframe.id + '"');
                      console.log('    * Class: "' + iframe.className + '"');
                      console.log('    * Width: ' + iframe.width);
                      console.log('    * Height: ' + iframe.height);
                      console.log('    * Visible: ' + (iframe.offsetParent !== null));
                      console.log('    * Name: "' + iframe.name + '"');
                      console.log('    * Title: "' + iframe.title + '"');
                      
                      // Try to access iframe content
                      try {
                        if (iframe.contentDocument) {
                          const iframeContent = iframe.contentDocument.body?.innerText || '';
                          const iframeSelects = iframe.contentDocument.querySelectorAll('select');
                          const iframeButtons = iframe.contentDocument.querySelectorAll('button, input[type="submit"]');
                          console.log('    * Content length: ' + iframeContent.length);
                          console.log('    * Select elements in iframe: ' + iframeSelects.length);
                          console.log('    * Button elements in iframe: ' + iframeButtons.length);
                          console.log('    * Contains "Week End Date": ' + iframeContent.includes('Week End Date'));
                          console.log('    * Contains "Weekly Schedule": ' + iframeContent.includes('Weekly Schedule'));
                          console.log('    * Content preview: "' + iframeContent.substring(0, 200) + '"');
                        } else {
                          console.log('    * Cannot access iframe content (cross-origin or not loaded)');
                        }
                      } catch (e) {
                        console.log('    * Cannot access iframe content: ' + e.message);
                      }
                    }
                  }
                  
                  // URL Analysis for Cognos
                  console.log('🔍 [DIAGNOSTIC] === COGNOS URL ANALYSIS ===');
                  const urlParams = new URLSearchParams(window.location.search);
                  const perspective = urlParams.get('perspective');
                  const pathRef = urlParams.get('pathRef');
                  const reportId = urlParams.get('id');
                  
                  console.log('  - Perspective: "' + perspective + '"');
                  console.log('  - PathRef: "' + pathRef + '"');
                  console.log('  - Report ID: "' + reportId + '"');
                  console.log('  - Is viewer page: ' + (perspective === 'classicviewer'));
                  console.log('  - Is authoring page: ' + (perspective === 'authoring'));
                  
                  if (perspective === 'classicviewer') {
                    console.log('  - ANALYSIS: You are on a VIEWER page (showing results)');
                    console.log('  - SOLUTION: Need to navigate to PARAMETER/PROMPTING page');
                    
                    // Try to construct parameter page URL
                    const baseUrl = window.location.origin + window.location.pathname;
                    const parameterUrl = baseUrl + '?perspective=prompting&pathRef=' + encodeURIComponent(pathRef || '') + '&id=' + (reportId || '');
                    console.log('  - Suggested parameter URL: ' + parameterUrl);
                  }
                  
                  // Content preview
                  console.log('🔍 [DIAGNOSTIC] === CONTENT PREVIEW ===');
                  console.log('  - Full page text content:');
                  console.log('"' + pageContent + '"');
                  console.log('');
                  console.log('  - HTML preview (first 1000 chars):');
                  console.log(pageHTML.substring(0, 1000));
                  console.log('');
                  console.log('  - Search for key terms:');
                  const weeklyPos = pageContent.toLowerCase().indexOf('weekly');
                  const schedulePos = pageContent.toLowerCase().indexOf('schedule');
                  const weekPos = pageContent.toLowerCase().indexOf('week end');
                  const parameterPos = pageContent.toLowerCase().indexOf('parameter');
                  const promptPos = pageContent.toLowerCase().indexOf('prompt');
                  console.log('    * "weekly" at position: ' + weeklyPos);
                  console.log('    * "schedule" at position: ' + schedulePos);
                  console.log('    * "week end" at position: ' + weekPos);
                  console.log('    * "parameter" at position: ' + parameterPos);
                  console.log('    * "prompt" at position: ' + promptPos);
                  
                  // Page readiness
                  console.log('🔍 [DIAGNOSTIC] === PAGE READINESS ===');
                  console.log('  - Document ready state: ' + document.readyState);
                  console.log('  - Page loaded: ' + (document.readyState === 'complete'));
                  console.log('  - Has body: ' + !!document.body);
                  console.log('  - Body children: ' + (document.body?.children?.length || 0));
                  
                  // Navigation suggestions
                  console.log('🔍 [DIAGNOSTIC] === NAVIGATION SUGGESTIONS ===');
                  if (allSelects.length === 0 && perspective === 'classicviewer') {
                    console.log('  - ISSUE: No dropdowns found because you are on viewer page');
                    console.log('  - SOLUTION: Navigate to parameter/prompting page');
                    console.log('  - METHOD 1: Look for "Edit" or "Modify" links');
                    console.log('  - METHOD 2: Change URL perspective from "classicviewer" to "prompting"');
                    console.log('  - METHOD 3: Look for parameter/prompt buttons in the interface');
                  }
                  
                  // Send comprehensive results
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'page_diagnostic',
                    url: currentURL,
                    title: pageTitle,
                    contentLength: pageContent.length,
                    htmlLength: pageHTML.length,
                    selectCount: allSelects.length,
                    buttonCount: allButtons.length + allSubmits.length,
                    iframeCount: allIframes.length,
                    linkCount: allLinks.length,
                    hasWeeklySchedule: hasWeeklySchedule,
                    hasWeekEndDate: hasWeekEndDate,
                    hasCognos: hasCognos,
                    readyState: document.readyState,
                    contentPreview: pageContent,
                    htmlPreview: pageHTML.substring(0, 1000),
                    perspective: perspective,
                    isViewerPage: perspective === 'classicviewer',
                    pathRef: pathRef,
                    reportId: reportId,
                    relevantLinks: relevantLinks.length,
                    navigationSuggestion: allSelects.length === 0 && perspective === 'classicviewer' ? 'Navigate to parameter page' : 'Current page should work'
                  }));
                  
                  return true;
                } catch (e) { 
                  console.log('❌ [DIAGNOSTIC] Error: ' + e.message);
                  window.ReactNativeWebView.postMessage(JSON.stringify({ 
                    type: 'diagnostic_error', 
                    error: e.message 
                  })); 
                  return false; 
                } 
              })();`;
              
              webViewRef.current.injectJavaScript(diagnosticScript);
              Alert.alert('Page Diagnostics', 'Running comprehensive page analysis. Check console for detailed results...');
            } catch (error) {
              console.error('❌ [UI] Diagnostic error:', error);
              Alert.alert('Diagnostic Error', 'Error running page diagnostics: ' + (error as Error).message);
            }
          }}
        >
          <Text style={[styles.demoButtonText, { color: COLORS.info }]}>
            🔍 Page Diagnostics
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.demoButton, { borderColor: COLORS.primary, marginBottom: SPACING.md }]} 
          onPress={async () => {
            console.log('🔄 [UI] Attempting to navigate to parameter page...');
            if (!webViewRef.current) {
              Alert.alert('Error', 'WebView not available. Please ensure you are on the WebView screen.');
              return;
            }
            try {
              const navigateScript = `
              (function() { 
                try { 
                  console.log('🔄 [NAVIGATE] Attempting to navigate to parameter page...');
                  
                  const currentURL = window.location.href;
                  const urlParams = new URLSearchParams(window.location.search);
                  const perspective = urlParams.get('perspective');
                  const pathRef = urlParams.get('pathRef');
                  const reportId = urlParams.get('id');
                  
                  console.log('🔄 [NAVIGATE] Current URL: ' + currentURL);
                  console.log('🔄 [NAVIGATE] Current perspective: ' + perspective);
                  
                  if (perspective === 'classicviewer') {
                    // Construct parameter page URL
                    const baseUrl = window.location.origin + window.location.pathname;
                    const parameterUrl = baseUrl + '?perspective=prompting&pathRef=' + encodeURIComponent(pathRef || '') + '&id=' + (reportId || '');
                    
                    console.log('🔄 [NAVIGATE] Navigating to parameter URL: ' + parameterUrl);
                    
                    // Navigate to parameter page
                    window.location.href = parameterUrl;
                    
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'navigation_attempted',
                      fromUrl: currentURL,
                      toUrl: parameterUrl,
                      method: 'URL change'
                    }));
                    
                  } else {
                    console.log('🔄 [NAVIGATE] Not on viewer page, looking for navigation links...');
                    
                    // Look for links that might lead to parameter page
                    const allLinks = document.querySelectorAll('a');
                    let parameterLink = null;
                    
                    for (let i = 0; i < allLinks.length; i++) {
                      const link = allLinks[i];
                      const linkText = (link.innerText || link.textContent || '').toLowerCase();
                      const href = link.href || '';
                      
                      if (linkText.includes('parameter') || 
                          linkText.includes('prompt') || 
                          linkText.includes('edit') || 
                          linkText.includes('modify') ||
                          href.includes('prompt') ||
                          href.includes('parameter')) {
                        parameterLink = link;
                        console.log('🔄 [NAVIGATE] Found parameter link: "' + linkText + '" -> ' + href);
                        break;
                      }
                    }
                    
                    if (parameterLink) {
                      console.log('🔄 [NAVIGATE] Clicking parameter link...');
                      parameterLink.click();
                      
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'navigation_attempted',
                        fromUrl: currentURL,
                        method: 'Link click',
                        linkText: parameterLink.innerText || parameterLink.textContent
                      }));
                    } else {
                      console.log('🔄 [NAVIGATE] No parameter links found');
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'navigation_failed',
                        error: 'No parameter links found and not on viewer page'
                      }));
                    }
                  }
                  
                  return true;
                } catch (e) { 
                  console.log('❌ [NAVIGATE] Error: ' + e.message);
                  window.ReactNativeWebView.postMessage(JSON.stringify({ 
                    type: 'navigation_error', 
                    error: e.message 
                  })); 
                  return false; 
                } 
              })();`;
              
              webViewRef.current.injectJavaScript(navigateScript);
              Alert.alert('Navigation', 'Attempting to navigate to parameter page...');
            } catch (error) {
              console.error('❌ [UI] Navigation error:', error);
              Alert.alert('Navigation Error', 'Error attempting navigation: ' + (error as Error).message);
            }
          }}
        >
          <Text style={[styles.demoButtonText, { color: COLORS.primary }]}>
            🔄 Go to Parameter Page
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
  webViewHeaderContainer: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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