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
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
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
        <Text style={styles.title}>In-App Authentication {debugMode ? '(JS OFF)' : '(JS ON)'}</Text>
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
          allowsBackForwardNavigationGestures={false}
          automaticallyAdjustContentInsets={false}
          contentInsetAdjustmentBehavior="never"
          scrollEnabled={true}
          bounces={false}
          autoManageStatusBarEnabled={false}
          hideKeyboardAccessoryView={true}
          keyboardDisplayRequiresUserAction={false}
          renderLoading={() => (
            <View style={styles.webViewLoading}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.webViewLoadingText}>Loading authentication page...</Text>
            </View>
          )}
        />
      </View>

      <View style={styles.webViewBottomControls}>
        <View style={styles.buttonSection}> 
          <Text style={styles.sectionTitle}>🍪 Session Management</Text>
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
                Alert.alert('Enhanced Extraction', 'Searching for schedule content in main document and iframes...');
              } catch (error) {
                console.error('❌ [UI] Enhanced HTML extraction error:', error);
                Alert.alert('Extraction Error', 'Error attempting enhanced schedule extraction: ' + (error as Error).message);
              }
            }}
          >
            <Text style={[styles.demoButtonText, { color: COLORS.success }]}>
              🔍 Enhanced Schedule Search (Check iframes)
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={handleBackToCredentials}>
          <Text style={styles.backButtonText}>← Back to Login Options</Text>
        </TouchableOpacity>
        
        <View style={styles.infoContainer} /> 
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
    marginBottom: SPACING.xl,
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
    marginBottom: SPACING.lg,
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
    padding: SPACING.lg,
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
  buttonSection: {
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h5.fontSize,
    fontWeight: TYPOGRAPHY.h5.fontWeight,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
}); 