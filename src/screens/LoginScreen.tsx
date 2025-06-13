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

  const [savePassword, setSavePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<AuthStep>('CREDENTIALS');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [hasStoredSchedules, setHasStoredSchedules] = useState(false);
  const [storageStats, setStorageStats] = useState<{
    totalSchedules: number;
    employeeCount: number;
    oldestWeek: string | null;
    newestWeek: string | null;
  }>({ totalSchedules: 0, employeeCount: 0, oldestWeek: null, newestWeek: null });

  // Sync Schedule state management with timing
  const [syncSchedule, setSyncSchedule] = useState<{
    isActive: boolean;
    currentStep: number;
    stepStates: ('pending' | 'active' | 'success' | 'error')[];
    error: string | null;
    retryCount: number;
    canRetry: boolean;
    mfaDetected: boolean;
    mfaCompleted: boolean;
    // Timing fields
    startTime: Date | null;
    stepTimings: Map<number, { stepName: string; startTime: Date; endTime?: Date; duration?: number }>;
    totalDuration: number | null;
      }>({
        isActive: false,
        currentStep: 0,
        stepStates: ['pending', 'pending', 'pending', 'pending', 'pending', 'pending', 'pending'],
        error: null,
        retryCount: 0,
        canRetry: false,
        mfaDetected: false,
        mfaCompleted: false,
        // Initialize timing fields
        startTime: null,
        stepTimings: new Map(),
        totalDuration: null,
      });

  const authService = AuthService.getInstance();
  const scheduleService = ScheduleService.getInstance();
  const webViewRef = useRef<WebView>(null);

  // Initialize Cognos automation
  const automation = useCognosAutomation(webViewRef);

  // Track completed messages to prevent duplicate popups
  const [completedMessageIds, setCompletedMessageIds] = useState<Set<string>>(new Set());

  // Sync Schedule step names
  const SYNC_STEPS = [
    'Validate Credentials',
    'Fill Login Form',
    'Handle MFA (if required)',
    'Navigate to Schedule System',
    'Execute Schedule Query',
    'Import Schedule Data',
    'Complete Synchronization',
  ];

  useEffect(() => {
    loadSavedCredentials();
    // Ensure password field starts masked
    setShowPassword(false);
  }, []);

  // Check for stored schedules on component mount
  useEffect(() => {
    setLastCheckTime(Date.now()); // Initialize the last check time
    checkStoredSchedules();
  }, []);

  // Add effect to check stored schedules when automation state changes
  useEffect(() => {
    // If automation just completed a schedule import successfully
    if (automation.state.importCompleted) {
      // Add a small delay to prevent race conditions
      const timer = global.setTimeout(() => {
        console.log('🔄 [LOGIN] Import completed flag detected, checking stored schedules...');
        checkStoredSchedules();
        // Reset the flag to avoid repeated checks
        automation.resetImportCompletedFlag();
      }, 300);
      
      return () => global.clearTimeout(timer);
    }
  }, [automation.state.importCompleted]);

  // Create a debounced storage check to avoid repetitive checks
  const [lastCheckTime, setLastCheckTime] = useState<number>(0);
  
  const checkStoredSchedules = async () => {
    try {
      // Implement debouncing to prevent excessive checks
      const now = Date.now();
      const timeSinceLastCheck = now - lastCheckTime;
      const minimumInterval = 2000; // 2 seconds minimum between checks
      
      if (timeSinceLastCheck < minimumInterval) {
        console.log('🛑 [LOGIN] Skipping redundant storage check (last check was', 
          Math.round(timeSinceLastCheck), 'ms ago)');
        return;
      }
      
      console.log('📊 [LOGIN] Checking stored schedules...');
      setLastCheckTime(now);
      
      const stats = await scheduleService.getStorageStats();
      setStorageStats(stats);
      setHasStoredSchedules(stats.totalSchedules > 0);
      console.log('📊 [LOGIN] Storage check complete:', 
        stats.totalSchedules > 0 ? `Found ${stats.totalSchedules} schedules` : 'No stored schedules');
    } catch (error) {
      console.error('❌ [LOGIN] Error checking stored schedules:', error);
      // Don't update state on error to avoid triggering re-renders
      // If we previously determined there are schedules, maintain that state
    }
  };

  const toggleOfflineStorage = async () => {
    try {
      // Reset the debounce timer to ensure this operation always runs
      setLastCheckTime(0);
      
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
        setStorageStats({ totalSchedules: 0, employeeCount: 0, oldestWeek: null, newestWeek: null });
      } else {
        // Create test data
        console.log('📂 [UI] Creating test schedule data...');
        const { testOfflineStorage } = await import('../test-utils/offlineTest');
        
        await testOfflineStorage();
        
        Alert.alert(
          'Test Data Created ✅',
          'Sample schedule data has been created successfully!\n\n• Created 3 test schedules\n• Saved to local storage\n• Retrieved schedules\n• Verified storage stats\n\nTap "My Schedule" to see stored schedules.',
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
        if (saved.savePassword && saved.password) {
          setPassword(saved.password);
          setSavePassword(true);
        }
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
    setShowPassword(false); // Always default to masked password
    
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
            console.log('🎯 [LOGIN] Demo mode enabled - app will show demo schedules');
            onLoginSuccess();
          },
        },
      ],
    );
  };

  const handleWebViewAuth = () => {
    // Validate that Employee ID and Password are filled in
    if (!employeeId.trim() || !password.trim()) {
      Alert.alert(
        'Missing Information',
        'Please enter both Employee ID and Password before signing in.',
        [{ text: 'OK' }],
      );
      return;
    }

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
          console.log('🎯 [LOGIN-FORM-2] Using React-compatible event simulation for form validation');
          
          // LOGIN FORM 2 - React-compatible handling for Cognos BI page
          const usernameField = document.getElementById('CAMUsername');
          const passwordField = document.getElementById('CAMPassword');
          const signinButton = document.getElementById('signInBtn');
          
          if (!usernameField || !passwordField || !signinButton) {
            console.error('🎯 [LOGIN-FORM-2] Could not find all required login fields');
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'credentials_filled',
              success: false,
              error: 'Could not find username, password, or sign-in button on the page',
              formType: 'cognos-bi',
              usernameFound: !!usernameField,
              passwordFound: !!passwordField,
              buttonFound: !!signinButton
            }));
            return;
          }
          
          console.log('🎯 [LOGIN-FORM-2] Found all fields - starting React-compatible filling');
          
          // React-compatible field filling function
          function fillReactInput(element, value, fieldName) {
            console.log('🎯 [LOGIN-FORM-2] Filling', fieldName, 'with React events');
            
            // Focus the field first
            element.focus();
            element.dispatchEvent(new Event('focus', { bubbles: true }));
            
            // Set the value using React-compatible method
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(element, value);

            // Dispatch events that React listens for
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            element.dispatchEvent(new Event('blur', { bubbles: true }));
            
            console.log('🎯 [LOGIN-FORM-2]', fieldName, 'filled and events dispatched');
          }
          
          try {
            // Fill username field
            fillReactInput(usernameField, employeeId, 'Username');
            
            // Fill password field
            fillReactInput(passwordField, password, 'Password');
            
            // Brief delay for React state to update before checking button state
            setTimeout(() => {
              console.log('🎯 [LOGIN-FORM-2] Checking sign-in button state after filling');
              
                             if (signinButton.disabled) {
                 console.error('🎯 [LOGIN-FORM-2] Sign-in button is disabled - validation likely failed');
                 window.ReactNativeWebView.postMessage(JSON.stringify({
                   type: 'credentials_filled',
                   success: false,
                   formType: 'cognos-bi-login-form-2',
                   error: 'Sign-in button is disabled after filling fields. Client-side validation failed.',
                   strategy: 'React Event Simulation',
                   usernameValue: usernameField.value,
                   passwordValue: passwordField.value ? '******' : '',
                   buttonDisabled: signinButton.disabled
                 }));
               } else {
                 console.log('🎯 [LOGIN-FORM-2] Sign-in button is enabled - validation passed! Clicking submit...');
                 
                 // Click the submit button to log in
                 signinButton.focus();
                 signinButton.click();
                 
                 // Dispatch additional events to ensure the click is registered
                 signinButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                 signinButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                 signinButton.dispatchEvent(new Event('click', { bubbles: true }));
                 
                 console.log('🎯 [LOGIN-FORM-2] Submit button clicked successfully');
                 
                 window.ReactNativeWebView.postMessage(JSON.stringify({
                   type: 'credentials_filled',
                   success: true,
                   formType: 'cognos-bi-login-form-2',
                   strategy: 'React Event Simulation + Auto Submit',
                   usernameFound: true,
                   passwordFound: true,
                   loginButtonFound: true,
                   autoSubmitted: true,
                   finalValidation: {
                     usernameValue: usernameField.value === employeeId,
                     passwordValue: passwordField.value === password,
                     buttonEnabled: !signinButton.disabled
                   },
                   message: 'Login Form 2 (Cognos BI) credentials filled and submitted successfully',
                   error: null
                 }));
               }
            }, 500);
            
          } catch (error) {
            console.error('🎯 [LOGIN-FORM-2] Error during React-compatible filling:', error);
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'credentials_filled',
              success: false,
              formType: 'cognos-bi-login-form-2',
              strategy: 'React Event Simulation',
              error: 'React-compatible filling failed: ' + error.message
            }));
          }
          
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
                
                // Auto click the Sign In button for Login Form 1 (not for Login Form 2)
                if (!isLoginForm2) {
                  console.log('🔑 [CREDENTIALS] This is Login Form 1, attempting to click Sign In button...');
                  
                  // Find the Submit/Sign In button
                  const loginButtons = [
                    document.querySelector('button[type="submit"]'),
                    document.querySelector('input[type="submit"]'),
                    document.querySelector('button.login-button'),
                    document.querySelector('button[id*="login"]'),
                    document.querySelector('a.button[title="Sign In"]'), // Specific selector for this form
                    document.querySelector('a[onclick*="postOk"]'), // Anchor with postOk function
                    ...Array.from(document.querySelectorAll('a')).filter(link => 
                      link.textContent && 
                      (link.textContent.trim() === 'Sign In' || 
                       link.textContent.toLowerCase().includes('sign in')) &&
                      (link.onclick || link.getAttribute('onclick'))
                    ),
                    ...Array.from(document.querySelectorAll('button')).filter(btn => 
                      btn.textContent && 
                      (btn.textContent.toLowerCase().includes('sign in') || 
                       btn.textContent.toLowerCase().includes('login') || 
                       btn.textContent.toLowerCase().includes('log in'))
                    ),
                    ...Array.from(document.querySelectorAll('input[type="button"]')).filter(btn => 
                      btn.value && 
                      (btn.value.toLowerCase().includes('sign in') || 
                       btn.value.toLowerCase().includes('login') || 
                       btn.value.toLowerCase().includes('log in'))
                    )
                  ].filter(Boolean)[0]; // Get first matching button
                  
                  if (loginButtons) {
                    console.log('🔑 [CREDENTIALS] Found Sign In button:', 
                      loginButtons.tagName, 
                      loginButtons.type, 
                      loginButtons.textContent || loginButtons.value,
                      'onclick:', loginButtons.getAttribute ? loginButtons.getAttribute('onclick') : 'N/A'
                    );
                    
                    console.log('🔑 [CREDENTIALS] Button details:', {
                      tagName: loginButtons.tagName,
                      id: loginButtons.id || 'none',
                      className: loginButtons.className || 'none',
                      type: loginButtons.type || 'none',
                      text: loginButtons.textContent ? loginButtons.textContent.trim() : 'none',
                      value: loginButtons.value || 'none',
                      visible: loginButtons.offsetParent !== null,
                      hasOnClick: !!loginButtons.onclick || !!(loginButtons.getAttribute && loginButtons.getAttribute('onclick'))
                    });
                    
                    // Focus and click the button
                    loginButtons.focus();
                    console.log('🔑 [CREDENTIALS] Button focused, will click in 500ms');
                    
                    setTimeout(() => {
                      console.log('🔑 [CREDENTIALS] Clicking Sign In button...');
                      
                      // Try different approaches based on the element type
                      if (loginButtons.tagName === 'A' && loginButtons.getAttribute('onclick')) {
                        // For anchor tags with onclick handlers, try to directly call the postOk function
                        console.log('🔑 [CREDENTIALS] Detected anchor with onclick, trying direct function call...');
                        
                        console.log('🔑 [CREDENTIALS] Step 1: Regular click on anchor element');
                        // First try clicking the element
                        loginButtons.click();
                        
                        // If that doesn't work, try to call postOk directly
                        try {
                          console.log('🔑 [CREDENTIALS] Step 2: Attempting to call postOk() directly...');
                          // Try to eval the onclick content or call postOk function directly
                          if (typeof window.postOk === 'function') {
                            console.log('🔑 [CREDENTIALS] Found global postOk function, calling directly');
                            window.postOk();
                          } else if (loginButtons.getAttribute('onclick').includes('postOk')) {
                            // Try to execute the onclick content
                            console.log('🔑 [CREDENTIALS] Evaluating onclick attribute:', loginButtons.getAttribute('onclick'));
                            eval(loginButtons.getAttribute('onclick'));
                          }
                          console.log('🔑 [CREDENTIALS] Direct function call complete');
                        } catch (e) {
                          console.log('🔑 [CREDENTIALS] Direct function call failed:', e);
                          // Fallback to alternative submit approach
                          const form = document.querySelector('form');
                          if (form && typeof form.submit === 'function') {
                            console.log('🔑 [CREDENTIALS] Step 3: Falling back to form.submit()...');
                            
                            // Set the pf.ok value if needed
                            const pfOkField = form.querySelector('input[name="pf.ok"]');
                            if (pfOkField) {
                              pfOkField.value = 'clicked';
                              console.log('🔑 [CREDENTIALS] Set pf.ok field value to "clicked"');
                            }
                            
                            console.log('🔑 [CREDENTIALS] Submitting form directly');
                            form.submit();
                            console.log('🔑 [CREDENTIALS] Form submission complete');
                          }
                        }
                      } else {
                        // Standard approach for buttons
                        console.log('🔑 [CREDENTIALS] Using standard button click approach');
                        loginButtons.click();
                        
                        // Dispatch additional events to ensure the click is registered
                        console.log('🔑 [CREDENTIALS] Dispatching additional events');
                        loginButtons.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                        loginButtons.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                        loginButtons.dispatchEvent(new Event('click', { bubbles: true }));
                        console.log('🔑 [CREDENTIALS] All click events dispatched');
                      }
                      
                      console.log('🔑 [CREDENTIALS] Sign In button click sequence completed');
                      
                      // Log form submission attempt
                      setTimeout(() => {
                        console.log('🔑 [CREDENTIALS] Form submission status check (after 1s):');
                        try {
                          const forms = document.querySelectorAll('form');
                          console.log('🔑 [CREDENTIALS] Forms on page: ' + forms.length);
                          
                          if (forms.length > 0) {
                            console.log('🔑 [CREDENTIALS] First form still present on page - might indicate submission issue');
                          } else {
                            console.log('🔑 [CREDENTIALS] No forms found - may indicate successful submission');
                          }
                          
                          console.log('🔑 [CREDENTIALS] Current URL:', window.location.href);
                        } catch (e) {
                          console.log('🔑 [CREDENTIALS] Error checking form status:', e);
                        }
                      }, 1000);
                    }, 500);
                  } else {
                    console.log('🔑 [CREDENTIALS] Could not find Sign In button');
                  }
                } else {
                  console.log('🔑 [CREDENTIALS] This is Login Form 2, NOT auto-clicking any buttons');
                }
                
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

  // Validation Analysis Debug Function
  // Helper function to calculate the number of weeks from storage stats
  const getWeekCountText = () => {
    if (!hasStoredSchedules || storageStats.totalSchedules === 0) {
      return '';
    }

    // For this app, each schedule represents one week, so totalSchedules = number of weeks
    const weekCount = storageStats.totalSchedules;
    
    if (weekCount > 0) {
      return ` (${weekCount} week${weekCount === 1 ? '' : 's'})`;
    }

    return '';
  };

  // Sync Schedule helper functions
  const resetSyncSchedule = () => {
    setSyncSchedule({
      isActive: false,
      currentStep: 0,
      stepStates: ['pending', 'pending', 'pending', 'pending', 'pending', 'pending', 'pending'],
      error: null,
      retryCount: 0,
      canRetry: false,
      mfaDetected: false,
      mfaCompleted: false,
      // Reset timing fields
      startTime: null,
      stepTimings: new Map(),
      totalDuration: null,
    });
    // Clear completed message tracking
    setCompletedMessageIds(new Set());
  };

  const updateSyncStep = (step: number, state: 'pending' | 'active' | 'success' | 'error', error?: string) => {
    console.log(`🔍 [DEBUG] updateSyncStep called: step=${step}, state=${state}, error=${error}`);
    setSyncSchedule(prev => {
      console.log(`🔍 [DEBUG] Previous sync state: isActive=${prev.isActive}, startTime=${prev.startTime}, stepTimings.size=${prev.stepTimings.size}`);
      const newStepStates = [...prev.stepStates];
      newStepStates[step] = state;
      
      // Handle timing
      const newStepTimings = new Map(prev.stepTimings);
      const now = new Date();
      const stepName = SYNC_STEPS[step];
      
      if (state === 'active') {
        // Step is starting - record start time
        newStepTimings.set(step, {
          stepName,
          startTime: now,
        });
        console.log(`⏱️ [TIMING] Step ${step + 1} "${stepName}" started at ${now.toISOString()}`);
      } else if (state === 'success' || state === 'error') {
        // Step is ending - calculate duration
        const existingTiming = newStepTimings.get(step);
        if (existingTiming && existingTiming.startTime) {
          const duration = now.getTime() - existingTiming.startTime.getTime();
          newStepTimings.set(step, {
            ...existingTiming,
            endTime: now,
            duration,
          });
          console.log(`⏱️ [TIMING] Step ${step + 1} "${stepName}" ${state} after ${duration}ms (${(duration/1000).toFixed(1)}s)`);
        }
      }
      
      return {
        ...prev,
        currentStep: step,
        stepStates: newStepStates,
        error: error || null,
        canRetry: state === 'error' && [1, 3, 4, 5].includes(step), // Retryable steps: 2,4,5,6 (0-indexed: 1,3,4,5)
        stepTimings: newStepTimings,
      };
    });
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Timing summary function
  const showTimingSummary = () => {
    setSyncSchedule(prev => {
      if (!prev.startTime) return prev;
      
      const endTime = new Date();
      const totalDuration = endTime.getTime() - prev.startTime.getTime();
      
      console.log('\n⏱️ ===== SYNC SCHEDULE TIMING SUMMARY =====');
      console.log(`🚀 Total Execution Time: ${(totalDuration/1000).toFixed(1)}s (${totalDuration}ms)`);
      console.log(`📅 Started: ${prev.startTime.toISOString()}`);
      console.log(`📅 Completed: ${endTime.toISOString()}`);
      console.log('\n📊 Step-by-Step Breakdown:');
      
      let completedSteps = 0;
      let totalStepTime = 0;
      
      // Sort steps by step number for proper order
      const sortedSteps = Array.from(prev.stepTimings.entries()).sort(([a], [b]) => a - b);
      
      for (const [stepIndex, timing] of sortedSteps) {
        if (timing.duration !== undefined) {
          completedSteps++;
          totalStepTime += timing.duration;
          
          const percentage = ((timing.duration / totalDuration) * 100).toFixed(1);
          console.log(`  ${stepIndex + 1}. ${timing.stepName}: ${(timing.duration/1000).toFixed(1)}s (${percentage}%)`);
        }
      }
      
      // Calculate overhead (total time - sum of step times)
      const overhead = totalDuration - totalStepTime;
      const overheadPercentage = ((overhead / totalDuration) * 100).toFixed(1);
      
      console.log('\n📈 Performance Analysis:');
      console.log(`  • Completed Steps: ${completedSteps}/${SYNC_STEPS.length}`);
      console.log(`  • Step Processing Time: ${(totalStepTime/1000).toFixed(1)}s`);
      console.log(`  • Overhead/Transition Time: ${(overhead/1000).toFixed(1)}s (${overheadPercentage}%)`);
      
      // Find slowest step
      let slowestStep: { name: string; duration: number; index: number } | null = null;
      for (const [stepIndex, timing] of sortedSteps) {
        if (timing.duration !== undefined) {
          if (!slowestStep || timing.duration > slowestStep.duration) {
            slowestStep = { 
              name: timing.stepName, 
              duration: timing.duration, 
              index: stepIndex + 1, 
            };
          }
        }
      }
      
      if (slowestStep) {
        const slowestPercentage = ((slowestStep.duration / totalDuration) * 100).toFixed(1);
        console.log(`  • Slowest Step: #${slowestStep.index} "${slowestStep.name}" (${(slowestStep.duration/1000).toFixed(1)}s, ${slowestPercentage}%)`);
      }
      
      console.log('⏱️ ======================================\n');
      
      return {
        ...prev,
        totalDuration,
      };
    });
  };

  // Main Sync Schedule function
  const handleSyncSchedule = async () => {
    console.log('🚀 [AUTOMATION] Starting sync schedule automation...');
    
    // Initialize timing
    const startTime = new Date();
    setSyncSchedule(prev => ({ ...prev, startTime, isActive: true }));
    console.log(`⏱️ [TIMING] Automation started at ${startTime.toISOString()}`);
    
    // Step 1: Validate Credentials
    updateSyncStep(0, 'active');
    
    if (!employeeId.trim() || !password.trim()) {
      updateSyncStep(0, 'error', 'Please enter username and password first');
      Alert.alert('Credentials Required', 'Please enter your username and password before starting the sync.');
      setSyncSchedule(prev => ({ ...prev, isActive: false }));
      return;
    }

    updateSyncStep(0, 'success');

    try {
      // Step 2: Fill Login Form
      await delay(1000);
      updateSyncStep(1, 'active');
      
      setCurrentStep('WEBVIEW_AUTH');
      await delay(2000);
      
      // Execute fill credentials and wait for success
      handleFillCredentials();
      await delay(5000); // Wait for credentials to be filled
      
      updateSyncStep(1, 'success');

      // Step 3: Handle MFA Detection
      await delay(2000);
      updateSyncStep(2, 'active');
      
      // Simple MFA detection - just wait and set as detected so user can complete manually
      console.log('🔐 [SYNC] MFA detection phase - checking if MFA is required...');
      setSyncSchedule(prev => ({ ...prev, mfaDetected: true }));
      
      // Wait briefly to see if we automatically proceed past MFA
      await delay(5000);
      
      console.log('⏳ [SYNC] MFA step will remain active - user can complete MFA and continue manually');
      // Return early to wait for user MFA completion - remaining steps will be triggered by user action
      return;

      // Step 4: Fiori Navigation
      await delay(1500);
      updateSyncStep(3, 'active');
      
      // Execute Fiori navigation (using the actual working Fiori code)
      console.log('🎯 [SYNC] Starting Fiori navigation...');
      
      if (webViewRef.current) {
        const fioriScript = `
          (function() {
            try {
              const scriptStartTime = Date.now();
              const currentUrl = window.location.href;
              
              console.log('⏱️ [PERFORMANCE] Fiori script started at:', new Date().toISOString());
              console.log('📍 [PERFORMANCE] Current URL:', currentUrl);
              console.log('📄 [PERFORMANCE] Document ready state:', document.readyState);
              console.log('📊 [PERFORMANCE] Page load timing:', window.performance.timing ? {
                loadComplete: window.performance.timing.loadEventEnd - window.performance.timing.navigationStart,
                domReady: window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart
              } : 'Not available');
              
              // Function to detect and handle login forms during Fiori navigation
              function detectAndHandleLoginForm() {
                console.log('🔍 [FIORI-AUTH] Checking for login form...');
                
                const pageContent = document.documentElement.outerHTML;
                const isLoginForm2 = currentUrl.includes('bireport.costco.com/cognos_ext/bi') && 
                                    (pageContent.includes('Log in with your COSTCOEXT ID') || 
                                     pageContent.includes('COSTCOEXT') ||
                                     pageContent.includes('User ID'));
                
                if (isLoginForm2) {
                  console.log('🎯 [FIORI-AUTH] Login Form 2 detected during Fiori navigation!');
                  console.log('🔑 [FIORI-AUTH] Automatically filling credentials...');
                  
                  const employeeId = '${employeeId}';
                  const password = '${password}';
                  
                  if (!employeeId || !password) {
                    console.error('❌ [FIORI-AUTH] No credentials available for auto-fill');
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'fiori_auth_error',
                      error: 'No credentials available for automatic authentication'
                    }));
                    return false;
                  }
                  
                  const usernameField = document.getElementById('CAMUsername');
                  const passwordField = document.getElementById('CAMPassword');
                  const signinButton = document.getElementById('signInBtn');
                  
                  if (!usernameField || !passwordField || !signinButton) {
                    console.error('🎯 [FIORI-AUTH] Could not find all required login fields');
                    return false;
                  }
                  
                  console.log('🎯 [FIORI-AUTH] Found all fields - filling credentials automatically');
                  
                  // React-compatible field filling function
                  function fillReactInput(element, value, fieldName) {
                    console.log('🎯 [FIORI-AUTH] Filling', fieldName, 'with React events');
                    
                    element.focus();
                    element.dispatchEvent(new Event('focus', { bubbles: true }));
                    
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                    nativeInputValueSetter.call(element, value);

                    element.dispatchEvent(new Event('input', { bubbles: true }));
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                    element.dispatchEvent(new Event('blur', { bubbles: true }));
                  }
                  
                  try {
                    // Fill credentials
                    fillReactInput(usernameField, employeeId, 'Username');
                    fillReactInput(passwordField, password, 'Password');
                    
                    // Wait for React state to update, then submit
                    setTimeout(() => {
                      if (signinButton.disabled) {
                        console.error('🎯 [FIORI-AUTH] Sign-in button is disabled - validation failed');
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                          type: 'fiori_auth_error',
                          error: 'Sign-in button is disabled after filling fields'
                        }));
                      } else {
                        console.log('🎯 [FIORI-AUTH] Submitting login form...');
                        
                        // Store intent to continue Fiori navigation after login
                        window.fioriContinueAfterLogin = true;
                        
                        signinButton.focus();
                        signinButton.click();
                        signinButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                        signinButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                        signinButton.dispatchEvent(new Event('click', { bubbles: true }));
                        
                        console.log('✅ [FIORI-AUTH] Login form submitted, will continue Fiori navigation after authentication');
                        
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                          type: 'fiori_auth_success',
                          message: 'Authentication form filled and submitted, continuing Fiori navigation...'
                        }));
                      }
                    }, 500);
                    
                    return true;
                    
                  } catch (error) {
                    console.error('🎯 [FIORI-AUTH] Error during credential filling:', error);
                    return false;
                  }
                }
                
                return false; // No login form detected
              }
              
              // Function to search and click schedule buttons
              function searchAndClickScheduleButton(retryCount = 0) {
                const searchStartTime = Date.now();
                console.log('🎯 [FIORI] Searching for schedule buttons (attempt ' + (retryCount + 1) + ')...');
                console.log('⏱️ [PERFORMANCE] Search started at:', new Date().toISOString());
                
                // First check if we need to handle a login form
                if (detectAndHandleLoginForm()) {
                  console.log('🔑 [FIORI] Login form detected and handled, navigation will continue after authentication');
                  return true;
                }
                
                // Look for Schedule tile link first (most reliable)
                const scheduleLinks = document.querySelectorAll('a[href*="ScheduleLine"]');
                console.log('🔍 [SEARCH] Found', scheduleLinks.length, 'ScheduleLine links');
                
                if (scheduleLinks.length > 0) {
                  const searchDuration = Date.now() - searchStartTime;
                  console.log('✅ [FIORI] Found ScheduleLine link in', searchDuration, 'ms');
                  const link = scheduleLinks[0];
                  const href = link.href;
                  
                  // Navigate directly instead of clicking (avoids target="_blank" issues)
                  console.log('🚀 [FIORI] Navigating to:', href);
                  console.log('⏱️ [PERFORMANCE] Navigation started at:', new Date().toISOString());
                  window.location.href = href;
                  
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'fiori_button_click_success',
                    buttonText: 'Online Employee Schedules',
                    success: true,
                    method: 'direct-navigation',
                    performanceData: {
                      searchDuration: searchDuration,
                      retryCount: retryCount,
                      totalScriptDuration: Date.now() - scriptStartTime
                    }
                  }));
                  return true;
                }
                
                // Fallback: Look for clickable elements with schedule text
                const allClickables = document.querySelectorAll('a, button, [role="button"], [role="link"]');
                console.log('🔍 [SEARCH] Searching through', allClickables.length, 'clickable elements');
                
                for (const el of allClickables) {
                  const text = (el.textContent || el.title || el.getAttribute('aria-label') || '').toLowerCase();
                  
                  if (text.includes('online employee schedule')) {
                    const searchDuration = Date.now() - searchStartTime;
                    console.log('✅ [FIORI] Found "Online Employee Schedules" element in', searchDuration, 'ms');
                    
                    // Try to find parent link if this is an inner element
                    let clickTarget = el;
                    if (el.tagName !== 'A') {
                      const parentLink = el.closest('a');
                      if (parentLink) {
                        clickTarget = parentLink;
                        console.log('✅ [FIORI] Using parent link for navigation');
                      }
                    }
                    
                    console.log('⏱️ [PERFORMANCE] Clicking element at:', new Date().toISOString());
                    clickTarget.click();
                    
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'fiori_button_click_success',
                      buttonText: 'Online Employee Schedules',
                      success: true,
                      method: 'element-click',
                      performanceData: {
                        searchDuration: searchDuration,
                        retryCount: retryCount,
                        totalScriptDuration: Date.now() - scriptStartTime
                      }
                    }));
                    return true;
                  }
                }
                
                // Fallback: any schedule element
                for (const el of allClickables) {
                  const text = (el.textContent || '').toLowerCase();
                  if (text.includes('schedule') && text.length < 100) {
                    const searchDuration = Date.now() - searchStartTime;
                    console.log('✅ [FIORI] Found schedule element in', searchDuration, 'ms:', text.substring(0, 30));
                    console.log('⏱️ [PERFORMANCE] Clicking fallback element at:', new Date().toISOString());
                    el.click();
                    
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'fiori_button_click_success',
                      buttonText: text.substring(0, 30) + '...',
                      success: true,
                      method: 'fallback-click',
                      performanceData: {
                        searchDuration: searchDuration,
                        retryCount: retryCount,
                        totalScriptDuration: Date.now() - scriptStartTime
                      }
                    }));
                    return true;
                  }
                }
                
                const searchDuration = Date.now() - searchStartTime;
                console.log('⏳ [SEARCH] Search completed in', searchDuration, 'ms - no matches found');
                
                // If we're on Fiori but buttons not found, retry up to 3 times with delays
                if (retryCount < 3) {
                  console.log('⏳ [FIORI] Buttons not ready, retrying in 2 seconds...');
                  console.log('⏱️ [PERFORMANCE] Will retry at:', new Date(Date.now() + 2000).toISOString());
                  setTimeout(() => searchAndClickScheduleButton(retryCount + 1), 2000);
                  return false;
                }
                
                console.log('❌ [FIORI] No schedule buttons found after ' + (retryCount + 1) + ' attempts');
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'fiori_button_click_error',
                  error: 'No schedule buttons found after ' + (retryCount + 1) + ' attempts',
                  success: false,
                  performanceData: {
                    totalSearchDuration: Date.now() - scriptStartTime,
                    retryCount: retryCount + 1,
                    finalAttemptDuration: searchDuration
                  }
                }));
                return false;
              }
              
              if (currentUrl.includes('hcm.costco.com')) {
                // Already on Fiori - search for buttons immediately
                searchAndClickScheduleButton();
                
              } else {
                // Navigate to Fiori first, then auto-search for buttons
                console.log('🚀 [FIORI] Navigating to Fiori Launchpad...');
                const contentIframe = document.getElementById('contentAreaFrame');
                if (contentIframe?.contentDocument) {
                  const fioriIframe = contentIframe.contentDocument.getElementById('isolatedWorkArea');
                  if (fioriIframe?.src) {
                    // Store flag to auto-continue after navigation
                    window.fioriAutoClick = true;
                    
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'navigate_to_fiori',
                      url: fioriIframe.src,
                      success: true,
                      autoClick: true
                    }));
                    return;
                  }
                }
                
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'fiori_button_click_error',
                  error: 'Cannot find Fiori URL',
                  success: false,
                  performanceData: {
                    totalScriptDuration: Date.now() - scriptStartTime,
                    errorType: 'fiori-url-not-found'
                  }
                }));
              }
              
            } catch (error) {
              console.error('❌ [FIORI] Error:', error.message);
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'fiori_button_click_error',
                error: error.message,
                success: false,
                performanceData: {
                  totalScriptDuration: Date.now() - scriptStartTime,
                  errorType: 'script-execution-error'
                }
              }));
            }
          })();
        `;
        
        webViewRef.current.injectJavaScript(fioriScript);
      }
      
      // Wait for navigation
      await delay(15000); // Increased from 10s to 15s for more reliable navigation
      updateSyncStep(3, 'success');

      // Step 5: Test Run
      await delay(1500);
      updateSyncStep(4, 'active');
      
      // Execute test run automation (using the actual working test run code)
      console.log('🧪 [SYNC] Starting Test Run...');
      
      if (webViewRef.current) {
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
                    
                    // DIAGNOSTIC LOGGING: Analyze all dropdown options before selection
                    console.log('🧪 [TEST-RUN] DROPDOWN DIAGNOSTIC - Complete option analysis:');
                    console.log('  - Total options found:', weekDropdown.options.length);
                    
                    for (let i = 0; i < weekDropdown.options.length; i++) {
                      const option = weekDropdown.options[i];
                      console.log('  - Option', i + ':', {
                        text: option.text,
                        value: option.value,
                        selected: option.selected,
                        disabled: option.disabled
                      });
                    }
                    
                    // PROBLEM DETECTION: Check if first option is p_employee or similar
                    const firstOption = weekDropdown.options[0];
                    const isFirstOptionValidWeek = firstOption.value.includes('2025-') || 
                                                   firstOption.value.includes('T00:00:00') ||
                                                   new RegExp('\\\\d{4}-\\\\d{2}-\\\\d{2}').test(firstOption.value);
                    const isFirstOptionPEmployee = firstOption.value === 'p_Employee' || 
                                                   firstOption.text === 'p_Employee' ||
                                                   firstOption.value.toLowerCase().includes('employee');
                    
                    console.log('🧪 [TEST-RUN] FIRST OPTION ANALYSIS:');
                    console.log('  - Text:', firstOption.text);
                    console.log('  - Value:', firstOption.value);
                    console.log('  - Is valid week date:', isFirstOptionValidWeek);
                    console.log('  - Is p_employee:', isFirstOptionPEmployee);
                    console.log('  - Selected status:', firstOption.selected);
                    
                    // Find the first actual week date option (skip p_employee or invalid options)
                    let selectedOptionIndex = 0;
                    let selectedOption = firstOption;
                    
                    if (isFirstOptionPEmployee || !isFirstOptionValidWeek) {
                      console.log('🧪 [TEST-RUN] PROBLEM DETECTED: First option is not a valid week!');
                      console.log('🧪 [TEST-RUN] Searching for first valid week option...');
                      
                      for (let i = 1; i < weekDropdown.options.length; i++) {
                        const option = weekDropdown.options[i];
                        const isValidWeek = option.value.includes('2025-') || 
                                          option.value.includes('T00:00:00') ||
                                          new RegExp('\\\\d{4}-\\\\d{2}-\\\\d{2}').test(option.value);
                        const isPEmployee = option.value === 'p_Employee' || 
                                          option.text === 'p_Employee' ||
                                          option.value.toLowerCase().includes('employee');
                        
                        console.log('🧪 [TEST-RUN] Option', i, 'analysis:', {
                          text: option.text,
                          value: option.value,
                          isValidWeek: isValidWeek,
                          isPEmployee: isPEmployee
                        });
                        
                        if (isValidWeek && !isPEmployee) {
                          console.log('✅ [TEST-RUN] Found first valid week option at index', i);
                          selectedOptionIndex = i;
                          selectedOption = option;
                          break;
                        }
                      }
                      
                      if (selectedOptionIndex === 0 && isFirstOptionPEmployee) {
                        console.log('❌ [TEST-RUN] CRITICAL: No valid week options found! All options appear to be p_employee or invalid.');
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                          type: 'test_run_error',
                          error: 'No valid week options found - only p_employee or invalid options available',
                          allOptions: Array.from(weekDropdown.options).map((opt, idx) => ({
                            index: idx,
                            text: opt.text,
                            value: opt.value,
                            selected: opt.selected
                          }))
                        }));
                        return;
                      }
                    }
                    
                    const weekText = selectedOption.text;
                    const weekValue = selectedOption.value;
                    
                    console.log('🧪 [TEST-RUN] FINAL SELECTION:');
                    console.log('  - Selected index:', selectedOptionIndex);
                    console.log('  - Selected text:', weekText);
                    console.log('  - Selected value:', weekValue);
                    console.log('  - Is this a valid week?', !isFirstOptionPEmployee || selectedOptionIndex > 0);
                    
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
                      
                      // Method 1: Try selecting the correct option (not always first)
                      if (weekDropdown.options.length > 0) {
                        console.log('🧪 [TEST-RUN] Selecting option at index', selectedOptionIndex + ':', selectedOption.text, 'with value:', selectedOption.value);
                        
                        // Clear all previous selections first
                        for (let i = 0; i < weekDropdown.options.length; i++) {
                          weekDropdown.options[i].selected = false;
                        }
                        
                        // Select the correct option
                        weekDropdown.selectedIndex = selectedOptionIndex;
                        weekDropdown.value = selectedOption.value;
                        
                        // Mark the option as selected in the DOM
                        selectedOption.selected = true;
                        
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
                        console.log('🧪 [TEST-RUN] Selected option status:', selectedOption.selected);
                        console.log('🧪 [TEST-RUN] Expected index match:', weekDropdown.selectedIndex === selectedOptionIndex);
                        
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
      }
      
      // Test run and import are now handled entirely by message listeners
      // No timeout-based logic needed here

    } catch (error) {
      console.error('❌ [SYNC] Sync schedule error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      updateSyncStep(syncSchedule.currentStep, 'error', errorMessage);
      
      Alert.alert(
        'Sync Failed',
        `${errorMessage}\n\nPlease try again or use manual steps.`,
        [{ text: 'OK', onPress: () => resetSyncSchedule() }],
      );
    }
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
        onPress={() => setSavePassword(!savePassword)}
      >
        <View style={[styles.checkbox, savePassword && styles.checkboxChecked]}>
          {savePassword && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.checkboxLabel}>Save Password</Text>
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

      <TouchableOpacity
        style={[styles.loginButton, { 
          backgroundColor: syncSchedule.isActive ? COLORS.warning : COLORS.success,
          marginTop: SPACING.sm,
        }, (isLoading || syncSchedule.isActive) && styles.disabledButton]}
        onPress={handleSyncSchedule}
        disabled={isLoading || syncSchedule.isActive}
      >
        {syncSchedule.isActive ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.loginButtonText}>🔄 Sync Schedule</Text>
        )}
      </TouchableOpacity>

      {syncSchedule.isActive && (
        <View style={styles.syncProgressContainer}>
          <Text style={styles.syncProgressTitle}>Sync Progress:</Text>
          {SYNC_STEPS.map((stepName, index) => {
            const stepState = syncSchedule.stepStates[index];
            const isCurrentStep = syncSchedule.currentStep === index;
            const emoji = stepState === 'success' ? '✅' : 
              stepState === 'error' ? '❌' : 
                stepState === 'active' ? '🔄' : '⭕';
            
            return (
              <View key={index} style={styles.syncProgressStep}>
                <Text style={[
                  styles.syncProgressStepText,
                  stepState === 'success' && { color: COLORS.success },
                  stepState === 'error' && { color: COLORS.error },
                  stepState === 'active' && { color: COLORS.warning },
                ]}>
                  {emoji} {index + 1}. {stepName}
                </Text>
                {stepState === 'error' && syncSchedule.error && isCurrentStep && (
                  <Text style={styles.syncProgressError}>
                    Error: {syncSchedule.error}
                  </Text>
                )}
                {stepState === 'active' && syncSchedule.mfaDetected && index === 2 && (
                  <View style={styles.mfaInstructions}>
                    <Text style={styles.syncProgressMfaNote}>
                      🔐 MFA Required: Complete authentication in the browser below, then click Continue
                    </Text>
                    <TouchableOpacity 
                      style={[styles.mfaContinueButton]} 
                      onPress={async () => {
                        console.log('✅ [SYNC] User clicked Continue After MFA');
                        setSyncSchedule(prev => ({ ...prev, mfaCompleted: true }));
                        updateSyncStep(2, 'success');
                        
                        // Continue to Fiori navigation
                        setTimeout(async () => {
                          console.log('🎯 [SYNC] Continuing to Fiori navigation after MFA...');
                          updateSyncStep(3, 'active');
                          
                          // Execute Fiori script
                          console.log('🎯 [SYNC] Starting Fiori navigation...');
                          // The Fiori navigation will be handled by the existing step 4 logic
                        }, 1000);
                      }}
                    >
                      <Text style={styles.mfaContinueButtonText}>✅ Continue After MFA</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}

      <TouchableOpacity style={styles.demoButton} onPress={handleDemoMode}>
        <Text style={styles.demoButtonText}>📱 Demo Mode</Text>
      </TouchableOpacity>



      <TouchableOpacity 
        style={[styles.demoButton, { borderColor: COLORS.success }]} 
        onPress={() => {
          // Set NOT in demo mode
          scheduleService.setDemoMode(false);
          console.log('🎯 [LOGIN] Demo mode disabled - app will show real stored schedules');
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
          {hasStoredSchedules ? `🗑️ Wipe Schedule Data${getWeekCountText()}` : '📂 No Stored Data'}
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
              
              // CHECK FOR LOGIN FORM 2 - Critical for sync schedule automation
              if (!navState.loading && navState.url.includes('/cognos_ext/bi')) {
                console.log('🔍 [LOGIN-FORM-2] Checking for Login Form 2 at Cognos URL...');
                
                // Wait longer for page to fully load before checking for login form
                setTimeout(() => {
                  if (webViewRef.current) {
                    const loginForm2Script = `
                      (function() {
                        console.log('🔍 [LOGIN-FORM-2] Detecting Login Form 2...');
                        
                        const currentUrl = window.location.href;
                        const pageContent = document.documentElement.outerHTML;
                        
                        // Check for Login Form 2 indicators
                        const hasLoginForm = document.getElementById('CAMUsername') && 
                                           document.getElementById('CAMPassword') && 
                                           document.getElementById('signInBtn');
                        
                        const hasLoginText = pageContent.includes('Log in with your COSTCOEXT ID') || 
                                           pageContent.includes('COSTCOEXT') ||
                                           pageContent.includes('User ID');
                        
                        const isLoginForm2 = currentUrl.includes('bireport.costco.com/cognos_ext/bi') && 
                                           (hasLoginForm || hasLoginText);
                        
                        console.log('🔍 [LOGIN-FORM-2] Analysis:', {
                          url: currentUrl,
                          hasLoginForm: hasLoginForm,
                          hasLoginText: hasLoginText,
                          isLoginForm2: isLoginForm2
                        });
                        
                        if (isLoginForm2) {
                          console.log('🎯 [LOGIN-FORM-2] LOGIN FORM 2 DETECTED! Auto-filling credentials...');
                          
                          const employeeId = '${employeeId}';
                          const password = '${password}';
                          
                          if (!employeeId || !password) {
                            console.error('❌ [LOGIN-FORM-2] No credentials available');
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                              type: 'login_form_2_error',
                              error: 'No credentials available for Login Form 2'
                            }));
                            return;
                          }
                          
                          const usernameField = document.getElementById('CAMUsername');
                          const passwordField = document.getElementById('CAMPassword');
                          const signinButton = document.getElementById('signInBtn');
                          
                          if (!usernameField || !passwordField || !signinButton) {
                            console.log('ℹ️ [LOGIN-FORM-2] Login fields not found - likely already authenticated');
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                              type: 'login_form_2_not_needed',
                              message: 'Login fields not found - likely already authenticated'
                            }));
                            return;
                          }
                          
                          console.log('🔑 [LOGIN-FORM-2] Filling credentials...');
                          
                          // React-compatible field filling
                          function fillField(element, value, fieldName) {
                            element.focus();
                            element.dispatchEvent(new Event('focus', { bubbles: true }));
                            
                            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                            nativeInputValueSetter.call(element, value);

                            element.dispatchEvent(new Event('input', { bubbles: true }));
                            element.dispatchEvent(new Event('change', { bubbles: true }));
                            element.dispatchEvent(new Event('blur', { bubbles: true }));
                            
                            console.log('✅ [LOGIN-FORM-2] Filled', fieldName, 'field');
                          }
                          
                          try {
                            fillField(usernameField, employeeId, 'username');
                            fillField(passwordField, password, 'password');
                            
                            setTimeout(() => {
                              if (signinButton.disabled) {
                                console.error('❌ [LOGIN-FORM-2] Submit button is disabled');
                                window.ReactNativeWebView.postMessage(JSON.stringify({
                                  type: 'login_form_2_error',
                                  error: 'Submit button is disabled after filling fields'
                                }));
                              } else {
                                console.log('🚀 [LOGIN-FORM-2] Submitting form...');
                                
                                signinButton.focus();
                                signinButton.click();
                                signinButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                                
                                window.ReactNativeWebView.postMessage(JSON.stringify({
                                  type: 'login_form_2_success',
                                  message: 'Login Form 2 filled and submitted successfully'
                                }));
                              }
                            }, 1000);
                            
                          } catch (error) {
                            console.error('❌ [LOGIN-FORM-2] Error:', error);
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                              type: 'login_form_2_error',
                              error: 'Error filling Login Form 2: ' + error.message
                            }));
                          }
                        } else {
                          console.log('ℹ️ [LOGIN-FORM-2] No login form detected - already authenticated');
                          // Send success message to indicate no action needed
                          window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'login_form_2_not_needed',
                            message: 'Already authenticated, no login form required'
                          }));
                        }
                      })();
                    `;
                    
                    webViewRef.current.injectJavaScript(loginForm2Script);
                  }
                }, 4000); // Wait 4 seconds for page to fully load (increased from 2 seconds)
              }
              
              // Check if we've successfully authenticated and landed back on the schedule system
              if (!navState.loading && !navState.url.includes('/bi/v1/disp?b_action=logonAs')) {
                console.log('🔍 [FIORI-MONITOR] Checking for post-authentication continuation...');
                
                // Inject script to check if we need to continue Fiori navigation
                if (webViewRef.current) {
                  const continueScript = `
                    (function() {
                      console.log('🔍 [FIORI-MONITOR] Checking continuation flag...');
                      
                      if (window.fioriContinueAfterLogin) {
                        console.log('✅ [FIORI-MONITOR] Continuation flag detected - authenticated successfully');
                        console.log('🚀 [FIORI-MONITOR] Resuming Fiori navigation to schedule...');
                        
                        // Clear the flag
                        window.fioriContinueAfterLogin = false;
                        
                        // Look for the schedule interface or continue navigation
                        const currentUrl = window.location.href;
                        console.log('📍 [FIORI-MONITOR] Current URL after auth:', currentUrl);
                        
                        // Check if we're already at the schedule interface
                        if (currentUrl.includes('bireport.costco.com') && 
                            !currentUrl.includes('/bi/v1/disp?b_action=logonAs')) {
                          console.log('🎯 [FIORI-MONITOR] Already at schedule system - checking for prompts...');
                          
                          // Look for parameter prompts or schedule interface
                          setTimeout(() => {
                            const hasPrompts = document.querySelector('[id*="prompt"]') || 
                                             document.querySelector('[class*="prompt"]') ||
                                             document.querySelector('input[type="text"]') ||
                                             document.querySelector('select');
                            
                            if (hasPrompts) {
                              console.log('📋 [FIORI-MONITOR] Parameter prompts found - user interaction needed');
                              window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'fiori_navigation_complete',
                                message: 'Successfully navigated to schedule system - parameter prompts ready',
                                requiresUserInput: true,
                                url: currentUrl
                              }));
                            } else {
                              console.log('✅ [FIORI-MONITOR] Schedule interface loaded successfully');
                              window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'fiori_navigation_complete',
                                message: 'Successfully navigated to schedule system',
                                requiresUserInput: false,
                                url: currentUrl
                              }));
                            }
                          }, 2000);
                        }
                      }
                    })();
                  `;
                  
                  webViewRef.current.injectJavaScript(continueScript);
                }
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
              
              // Try to parse as JSON for structured messages
              try {
                const parsedMessage = JSON.parse(messageData);
                
                // Create a condensed version for logging (without large HTML content)
                const condensedMessage = { ...parsedMessage };
                if (condensedMessage.extractedHtml && typeof condensedMessage.extractedHtml === 'string') {
                  const htmlLength = condensedMessage.extractedHtml.length;
                  condensedMessage.extractedHtml = `<HTML_CONTENT_${htmlLength}_CHARS>`;
                }
                if (condensedMessage.currentHtml && typeof condensedMessage.currentHtml === 'string') {
                  const htmlLength = condensedMessage.currentHtml.length;
                  condensedMessage.currentHtml = `<HTML_CONTENT_${htmlLength}_CHARS>`;
                }
                
                console.log('📨 [WEBVIEW] Message received:', condensedMessage);
                
                // When sync schedule is active, handle ALL automation messages in sync flow
                if (syncSchedule.isActive && parsedMessage.type && (
                  parsedMessage.type.startsWith('cognos_') || 
                  parsedMessage.type.startsWith('multi_week_') ||
                  parsedMessage.type.includes('_run_') ||
                  parsedMessage.type.includes('login_form_2') ||
                  ['schedule_selected', 'schedule_selection_error', 'run_button_clicked', 
                    'run_button_error', 'schedule_data_extracted', 'schedule_extraction_error',
                    'schedule_extraction_complete_for_import'].includes(parsedMessage.type)
                )) {
                  console.log('🎯 [SYNC] Sync schedule active - routing ALL automation messages to sync handler:', parsedMessage.type);
                  // Let all automation messages go to sync handlers when sync is active
                } else if (parsedMessage.type && (
                  parsedMessage.type.startsWith('cognos_') || 
                  parsedMessage.type.startsWith('multi_week_test_') ||
                  parsedMessage.type.startsWith('multi_week_import_') ||
                  ['schedule_selected', 'schedule_selection_error', 'run_button_clicked', 
                    'run_button_error', 'schedule_data_extracted', 'schedule_extraction_error',
                    'schedule_extraction_complete_for_import',
                    'html_dump_complete', 'html_dump_error', 'main_html_dump_complete', 
                    'main_html_dump_error', 'iframe_html_dump_complete', 'iframe_html_dump_error',
                    'login_form_2_dump_complete', 'login_form_2_dump_error', 
                    'simple_html_dump_complete', 'simple_html_dump_error',
                    'initial_schedule_load_complete', 'initial_schedule_load_error'].includes(parsedMessage.type)
                )) {
                  console.log('🤖 [WEBVIEW] Routing message to Cognos automation handler:', parsedMessage.type);
                  automation.handleWebViewMessage(parsedMessage);
                  return;
                }

                // Handle sync schedule-specific messages
                if (parsedMessage.type === 'test_run_error' && syncSchedule.isActive) {
                  console.log('❌ [SYNC] Test run failed:', parsedMessage.error);
                  updateSyncStep(4, 'error', parsedMessage.error);
                  
                  Alert.alert(
                    'Test Run Failed',
                    `The test run step failed: ${parsedMessage.error}\n\nSync schedule has been stopped.`,
                    [{ text: 'OK', onPress: () => resetSyncSchedule() }],
                  );
                  return;
                } else if (parsedMessage.type === 'multi_week_import_error' && syncSchedule.isActive) {
                  console.log('❌ [SYNC] Import failed:', parsedMessage.error);
                  updateSyncStep(5, 'error', parsedMessage.error);
                  
                  Alert.alert(
                    'Import Failed',
                    `The import step failed: ${parsedMessage.error}\n\nSync schedule has been stopped.`,
                    [{ text: 'OK', onPress: () => resetSyncSchedule() }],
                  );
                  return;
                } else if (parsedMessage.type === 'login_form_2_success' && syncSchedule.isActive) {
                  console.log('✅ [SYNC] Login Form 2 handled successfully');
                  // Update step 4 to indicate login form was handled
                  updateSyncStep(3, 'success');
                } else if (parsedMessage.type === 'login_form_2_error' && syncSchedule.isActive) {
                  console.log('⚠️ [SYNC] Login Form 2 detection failed (non-fatal):', parsedMessage.error);
                  console.log('🔄 [SYNC] Continuing automation - this may be a timing issue or already authenticated');
                  // Don't mark as error or stop automation - this could be a race condition
                  // The automation will continue and if authentication is actually needed, it will fail later
                } else if (parsedMessage.type === 'login_form_2_not_needed' && syncSchedule.isActive) {
                  console.log('ℹ️ [SYNC] Login Form 2 not needed - already authenticated');
                  // Continue automation without error
                } else if (parsedMessage.type.startsWith('multi_week_import_progress') && syncSchedule.isActive) {
                  console.log('📊 [SYNC] Import progress update - forwarding to automation handler');
                  automation.handleWebViewMessage(parsedMessage);
                  return;
                } else if (parsedMessage.type === 'schedule_extraction_complete_for_import' && syncSchedule.isActive) {
                  console.log('📥 [SYNC] Schedule extraction complete - forwarding to automation handler');
                  automation.handleWebViewMessage(parsedMessage);
                  return;
                } else if (parsedMessage.type === 'test_run_success' && syncSchedule.isActive) {
                  console.log('✅ [SYNC] Test run completed successfully');
                  console.log('🔍 [DEBUG] Sync schedule active:', syncSchedule.isActive, 'Current step:', syncSchedule.currentStep);
                  updateSyncStep(4, 'success');
                  
                  // Automatically proceed to Import All Schedules
                  setTimeout(async () => {
                    console.log('🔄 [SYNC] Starting Import All Schedules...');
                    updateSyncStep(5, 'active');
                    
                    try {
                      await automation.importAllSchedules();
                    } catch (error) {
                      console.error('❌ [SYNC] Import error:', error);
                      updateSyncStep(5, 'error', error instanceof Error ? error.message : 'Import failed');
                    }
                  }, 1500);
                } else if (parsedMessage.type === 'mfa_required' && syncSchedule.isActive) {
                  console.log('🔐 [SYNC] MFA detected - waiting for user to complete authentication');
                  setSyncSchedule(prev => ({ ...prev, mfaDetected: true }));
                  // Keep step 2 active and wait for completion
                } else if (parsedMessage.type === 'mfa_not_required' && syncSchedule.isActive) {
                  console.log('✅ [SYNC] MFA not required or completed - proceeding to Fiori navigation');
                  setSyncSchedule(prev => ({ ...prev, mfaDetected: false, mfaCompleted: true }));
                  updateSyncStep(2, 'success');
                  
                  // Automatically proceed to Fiori navigation
                  setTimeout(async () => {
                    console.log('🎯 [SYNC] Auto-proceeding to Fiori navigation...');
                    updateSyncStep(3, 'active');
                     
                    // Execute Fiori navigation
                    console.log('🎯 [SYNC] Starting Fiori navigation...');
                    if (webViewRef.current) {
                      // Use the existing Fiori script from the original implementation
                      console.log('🚀 [SYNC] Injecting Fiori navigation script...');
                      // The script will be injected - this should be handled by existing logic
                    }
                  }, 1000);
                } else if (parsedMessage.type === 'mfa_status_unknown' && syncSchedule.isActive) {
                  console.log('⚠️ [SYNC] Unable to determine MFA status - user may need to check manually');
                  // Don't fail completely, but mark MFA as detected so user can handle manually
                  setSyncSchedule(prev => ({ ...prev, mfaDetected: true }));
                } else if (parsedMessage.type === 'multi_week_import_complete' && syncSchedule.isActive) {
                  // Check if this is a retry message we've already handled
                  const messageId = parsedMessage.originalMessageId || parsedMessage.messageId;
                  console.log('🔍 [DEBUG] multi_week_import_complete - messageId:', messageId, 'isRetry:', parsedMessage.isRetry, 'alreadyHandled:', completedMessageIds.has(messageId));
                  
                  if (parsedMessage.isRetry && completedMessageIds.has(messageId)) {
                    console.log('🔄 [SYNC] Ignoring retry message - already handled:', messageId);
                    return;
                  }

                  console.log('✅ [SYNC] Import completed successfully - PROCEEDING TO SHOW POPUP');
                  console.log('🔍 [DEBUG] Sync schedule active:', syncSchedule.isActive, 'Current step:', syncSchedule.currentStep);
                  console.log('🔍 [DEBUG] Timing data:', syncSchedule.startTime, 'Step timings count:', syncSchedule.stepTimings.size);
                  
                  // Mark this message as handled
                  setCompletedMessageIds(prev => new Set(prev).add(messageId));
                  
                  updateSyncStep(5, 'success');
                  
                  // Complete the sync schedule successfully
                  setTimeout(() => {
                    updateSyncStep(6, 'success');
                    
                    // Show timing summary
                    setTimeout(() => {
                      console.log('🕐 [DEBUG] About to call showTimingSummary()...');
                      showTimingSummary();
                    }, 500);
                    
                    console.log('🚨 [DEBUG] About to show Alert.alert for Sync Schedule Complete...');
                    Alert.alert(
                      'Sync Schedule Complete! ✅',
                      'Your schedule has been successfully synchronized and imported.\n\nYou can now view your schedules in the Dashboard.\n\nCheck console logs for detailed timing analysis.',
                      [
                        {
                          text: 'View Schedules',
                          onPress: () => {
                            resetSyncSchedule();
                            onLoginSuccess();
                          },
                        },
                      ],
                    );
                    console.log('✅ [DEBUG] Alert.alert called for Sync Schedule Complete');
                    
                    setSyncSchedule(prev => ({ ...prev, isActive: false }));
                  }, 1000);
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
                    
                    // Always save Employee ID, optionally save password
                    try {
                      await authService.saveCredentials({
                        employeeId,
                        password: savePassword ? password : '',
                        rememberMe: true, // Always remember Employee ID
                        savePassword,
                      });
                      console.log('💾 [AUTH] Credentials saved successfully');
                    } catch (error) {
                      console.error('❌ [AUTH] Failed to save credentials:', error);
                    }
                    
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
                } else if (parsedMessage.type === 'navigate_to_fiori') {
                  const navigationStartTime = Date.now();
                  console.log('🚀 [WEBVIEW] Navigate to Fiori request:', parsedMessage.url);
                  console.log('⏱️ [PERFORMANCE] Fiori navigation started at:', new Date().toISOString());
                  
                  if (parsedMessage.url && webViewRef.current) {
                    // Navigate directly to the Fiori URL using injectJavaScript
                    const navigationScript = `
                      console.log('⏱️ [PERFORMANCE] Starting navigation to Fiori at:', new Date().toISOString());
                      window.location.href = '${parsedMessage.url}';
                    `;
                    webViewRef.current.injectJavaScript(navigationScript);
                    
                    // If this navigation was triggered by auto-click, schedule button search after navigation
                    if (parsedMessage.autoClick) {
                      console.log('⏰ [WEBVIEW] Auto-click scheduled after navigation');
                      console.log('⏱️ [PERFORMANCE] Auto-click will trigger in 5 seconds');
                      
                      // Wait for navigation to complete, then search for buttons
                      setTimeout(() => {
                        const autoClickStartTime = Date.now();
                        const navigationDuration = autoClickStartTime - navigationStartTime;
                        console.log('🎯 [WEBVIEW] Auto-triggering button search after navigation...');
                        console.log('⏱️ [PERFORMANCE] Navigation took:', navigationDuration, 'ms');
                        
                        const autoClickScript = `
                          (function() {
                            try {
                              console.log('🎯 [AUTO-CLICK] Searching for schedule buttons after navigation...');
                              console.log('⏱️ [PERFORMANCE] Auto-click script started at:', new Date().toISOString());
                              console.log('📍 [PERFORMANCE] Current URL:', window.location.href);
                              console.log('📄 [PERFORMANCE] Document ready state:', document.readyState);
                              
                              function searchAndClickScheduleButton(retryCount) {
                                retryCount = retryCount || 0;
                                var searchStartTime = Date.now();
                                console.log('🎯 [AUTO-CLICK] Searching for schedule buttons (attempt ' + (retryCount + 1) + ')...');
                                console.log('⏱️ [PERFORMANCE] Search attempt started at:', new Date().toISOString());
                                
                                // Performance: Count DOM elements
                                var totalElements = document.querySelectorAll('*').length;
                                var totalLinks = document.querySelectorAll('a').length;
                                var totalButtons = document.querySelectorAll('button').length;
                                console.log('📊 [PERFORMANCE] DOM stats:', {
                                  totalElements: totalElements,
                                  totalLinks: totalLinks,
                                  totalButtons: totalButtons
                                });
                                
                                // Look for Schedule tile link first (most reliable)
                                var scheduleLinks = document.querySelectorAll('a[href*="ScheduleLine"]');
                                console.log('🔍 [SEARCH] Found', scheduleLinks.length, 'ScheduleLine links');
                                
                                if (scheduleLinks.length > 0) {
                                  var searchDuration = Date.now() - searchStartTime;
                                  console.log('✅ [AUTO-CLICK] Found ScheduleLine link in', searchDuration, 'ms');
                                  var link = scheduleLinks[0];
                                  var href = link.href;
                                  
                                  console.log('🚀 [AUTO-CLICK] Navigating to:', href);
                                  console.log('⏱️ [PERFORMANCE] Navigation started at:', new Date().toISOString());
                                  window.location.href = href;
                                  
                                  window.ReactNativeWebView.postMessage(JSON.stringify({
                                    type: 'fiori_button_click_success',
                                    buttonText: 'Online Employee Schedules',
                                    success: true,
                                    method: 'auto-click-navigation',
                                    performanceData: {
                                      searchDuration: searchDuration,
                                      retryCount: retryCount,
                                      domStats: { totalElements, totalLinks, totalButtons }
                                    }
                                  }));
                                  return true;
                                }
                                
                                // Fallback: Look for clickable elements with schedule text
                                var allClickables = document.querySelectorAll('a, button, [role="button"], [role="link"]');
                                console.log('🔍 [SEARCH] Searching through', allClickables.length, 'clickable elements');
                                
                                for (var i = 0; i < allClickables.length; i++) {
                                  var el = allClickables[i];
                                  var text = (el.textContent || el.title || el.getAttribute('aria-label') || '').toLowerCase();
                                  
                                  if (text.includes('online employee schedule')) {
                                    var searchDuration = Date.now() - searchStartTime;
                                    console.log('✅ [AUTO-CLICK] Found "Online Employee Schedules" element in', searchDuration, 'ms');
                                    
                                    var clickTarget = el;
                                    if (el.tagName !== 'A') {
                                      var parentLink = el.closest('a');
                                      if (parentLink) {
                                        clickTarget = parentLink;
                                        console.log('✅ [AUTO-CLICK] Using parent link for navigation');
                                      }
                                    }
                                    
                                    console.log('⏱️ [PERFORMANCE] Clicking element at:', new Date().toISOString());
                                    clickTarget.click();
                                    
                                    window.ReactNativeWebView.postMessage(JSON.stringify({
                                      type: 'fiori_button_click_success',
                                      buttonText: 'Online Employee Schedules',
                                      success: true,
                                      method: 'auto-click-element',
                                      performanceData: {
                                        searchDuration: searchDuration,
                                        retryCount: retryCount,
                                        domStats: { totalElements, totalLinks, totalButtons }
                                      }
                                    }));
                                    return true;
                                  }
                                }
                                
                                var searchDuration = Date.now() - searchStartTime;
                                console.log('⏳ [SEARCH] Search completed in', searchDuration, 'ms - no matches found');
                                
                                // If buttons not found, retry up to 5 times with delays
                                if (retryCount < 5) {
                                  console.log('⏳ [AUTO-CLICK] Buttons not ready, retrying in 3 seconds...');
                                  console.log('⏱️ [PERFORMANCE] Will retry at:', new Date(Date.now() + 3000).toISOString());
                                  setTimeout(function() { searchAndClickScheduleButton(retryCount + 1); }, 3000);
                                  return false;
                                }
                                
                                console.log('❌ [AUTO-CLICK] No schedule buttons found after ' + (retryCount + 1) + ' attempts');
                                window.ReactNativeWebView.postMessage(JSON.stringify({
                                  type: 'fiori_button_click_error',
                                  error: 'Auto-click: No schedule buttons found after ' + (retryCount + 1) + ' attempts',
                                  success: false,
                                  performanceData: {
                                    totalSearchDuration: Date.now() - ${autoClickStartTime},
                                    retryCount: retryCount + 1,
                                    domStats: { totalElements, totalLinks, totalButtons }
                                  }
                                }));
                                return false;
                              }
                              
                              // Start the search with retries
                              searchAndClickScheduleButton();
                              
                            } catch (error) {
                              console.error('❌ [AUTO-CLICK] Error:', error.message);
                              window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'fiori_button_click_error',
                                error: 'Auto-click error: ' + error.message,
                                success: false,
                                performanceData: {
                                  errorOccurredAt: new Date().toISOString()
                                }
                              }));
                            }
                          })();
                        `;
                        
                        if (webViewRef.current) {
                          webViewRef.current.injectJavaScript(autoClickScript);
                        }
                      }, 5000); // Wait 5 seconds for Fiori to fully load
                    }
                    
                    console.log('🚀 [FIORI] Navigation initiated - no popup shown');
                    console.log('📋 [FIORI] Auto-click mode:', parsedMessage.autoClick ? 'enabled' : 'disabled');
                  } else {
                    console.error('❌ [FIORI] Navigation failed - invalid URL or WebView not available');
                    console.log('🔧 [DEBUG] URL provided:', parsedMessage.url);
                    console.log('🔧 [DEBUG] WebView available:', !!webViewRef.current);
                  }
                } else if (parsedMessage.type === 'fiori_button_click_success') {
                  console.log('✅ [WEBVIEW] Fiori button click success:', parsedMessage);
                  console.log('🎯 [SUCCESS] Successfully clicked:', parsedMessage.buttonText);
                  console.log('🔧 [METHOD] Click method used:', parsedMessage.method || 'unknown');
                  if (parsedMessage.performanceData) {
                    console.log('⏱️ [PERFORMANCE] Success performance data:', parsedMessage.performanceData);
                  }
                } else if (parsedMessage.type === 'fiori_button_click_error') {
                  console.log('❌ [WEBVIEW] Fiori button click error:', parsedMessage);
                  console.error('🚫 [ERROR] Fiori access issue:', parsedMessage.error);
                  if (parsedMessage.suggestion || parsedMessage.details) {
                    console.log('💡 [SUGGESTION]:', parsedMessage.suggestion || parsedMessage.details);
                  }
                  if (parsedMessage.performanceData) {
                    console.log('⏱️ [PERFORMANCE] Error performance data:', parsedMessage.performanceData);
                  }
                } else if (parsedMessage.type === 'fiori_auth_success') {
                  console.log('✅ [WEBVIEW] Fiori authentication successful:', parsedMessage.message);
                  console.log('🔑 [AUTH] Login form filled and submitted during Fiori navigation');
                  console.log('⏳ [AUTH] Waiting for authentication to complete...');
                  
                  // The authentication should redirect back to the schedule system automatically
                  // No user intervention needed - the flow will continue
                } else if (parsedMessage.type === 'fiori_auth_error') {
                  console.log('❌ [WEBVIEW] Fiori authentication error:', parsedMessage.error);
                  console.error('🚫 [AUTH] Authentication failed during Fiori navigation:', parsedMessage.error);
                  
                  Alert.alert(
                    'Authentication Issue',
                    `Automatic authentication during Fiori navigation failed:\n\n${parsedMessage.error}\n\nYou may need to manually complete the login form.`,
                    [{ text: 'OK' }],
                  );
                } else if (parsedMessage.type === 'fiori_navigation_complete') {
                  console.log('✅ [WEBVIEW] Fiori navigation completed:', parsedMessage.message);
                  console.log('🎯 [SUCCESS] Fiori navigation with auto-auth successful');
                  console.log('📍 [SUCCESS] Final URL:', parsedMessage.url);
                  console.log('👤 [SUCCESS] Requires user input:', parsedMessage.requiresUserInput);
                  
                  if (parsedMessage.requiresUserInput) {
                    console.log('📋 [INFO] Parameter prompts are ready for user interaction');
                    // User can now interact with the parameter prompts
                  } else {
                    console.log('🎉 [INFO] Schedule interface is fully loaded and ready');
                  }
                } else if (parsedMessage.type === 'schedule_page_reached') {
                  console.log('🎉 [WEBVIEW] Final destination reached!');
                  console.log('📍 [SUCCESS] Final URL:', parsedMessage.finalUrl);
                  console.log('📄 [SUCCESS] Final title:', parsedMessage.finalTitle);
                  console.log('⏱️ [JOURNEY] Total journey time:', parsedMessage.totalJourneyTime, 'ms');
                } else if (parsedMessage.type === 'schedule_page_verification_pending') {
                  console.log('⏳ [WEBVIEW] Verification pending...');
                  console.log('📍 [CURRENT] Current URL:', parsedMessage.currentUrl);
                  console.log('📄 [CURRENT] Current title:', parsedMessage.currentTitle);
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
          setSupportMultipleWindows={false}
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
          style={[styles.demoButton, { borderColor: COLORS.warning, marginBottom: SPACING.md, display: 'none' }]} 
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

        <View style={styles.buttonRowFour}>
          <TouchableOpacity 
            style={[styles.rowButtonSmall, { borderColor: COLORS.primary }]} 
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
                    
                    // DIAGNOSTIC LOGGING: Analyze all dropdown options before selection
                    console.log('🧪 [TEST-RUN] DROPDOWN DIAGNOSTIC - Complete option analysis:');
                    console.log('  - Total options found:', weekDropdown.options.length);
                    
                    for (let i = 0; i < weekDropdown.options.length; i++) {
                      const option = weekDropdown.options[i];
                      console.log('  - Option', i + ':', {
                        text: option.text,
                        value: option.value,
                        selected: option.selected,
                        disabled: option.disabled
                      });
                    }
                    
                    // PROBLEM DETECTION: Check if first option is p_employee or similar
                    const firstOption = weekDropdown.options[0];
                    const isFirstOptionValidWeek = firstOption.value.includes('2025-') || 
                                                   firstOption.value.includes('T00:00:00') ||
                                                   new RegExp('\\\\d{4}-\\\\d{2}-\\\\d{2}').test(firstOption.value);
                    const isFirstOptionPEmployee = firstOption.value === 'p_Employee' || 
                                                   firstOption.text === 'p_Employee' ||
                                                   firstOption.value.toLowerCase().includes('employee');
                    
                    console.log('🧪 [TEST-RUN] FIRST OPTION ANALYSIS:');
                    console.log('  - Text:', firstOption.text);
                    console.log('  - Value:', firstOption.value);
                    console.log('  - Is valid week date:', isFirstOptionValidWeek);
                    console.log('  - Is p_employee:', isFirstOptionPEmployee);
                    console.log('  - Selected status:', firstOption.selected);
                    
                    // Find the first actual week date option (skip p_employee or invalid options)
                    let selectedOptionIndex = 0;
                    let selectedOption = firstOption;
                    
                    if (isFirstOptionPEmployee || !isFirstOptionValidWeek) {
                      console.log('🧪 [TEST-RUN] PROBLEM DETECTED: First option is not a valid week!');
                      console.log('🧪 [TEST-RUN] Searching for first valid week option...');
                      
                      for (let i = 1; i < weekDropdown.options.length; i++) {
                        const option = weekDropdown.options[i];
                        const isValidWeek = option.value.includes('2025-') || 
                                          option.value.includes('T00:00:00') ||
                                          new RegExp('\\\\d{4}-\\\\d{2}-\\\\d{2}').test(option.value);
                        const isPEmployee = option.value === 'p_Employee' || 
                                          option.text === 'p_Employee' ||
                                          option.value.toLowerCase().includes('employee');
                        
                        console.log('🧪 [TEST-RUN] Option', i, 'analysis:', {
                          text: option.text,
                          value: option.value,
                          isValidWeek: isValidWeek,
                          isPEmployee: isPEmployee
                        });
                        
                        if (isValidWeek && !isPEmployee) {
                          console.log('✅ [TEST-RUN] Found first valid week option at index', i);
                          selectedOptionIndex = i;
                          selectedOption = option;
                          break;
                        }
                      }
                      
                      if (selectedOptionIndex === 0 && isFirstOptionPEmployee) {
                        console.log('❌ [TEST-RUN] CRITICAL: No valid week options found! All options appear to be p_employee or invalid.');
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                          type: 'test_run_error',
                          error: 'No valid week options found - only p_employee or invalid options available',
                          allOptions: Array.from(weekDropdown.options).map((opt, idx) => ({
                            index: idx,
                            text: opt.text,
                            value: opt.value,
                            selected: opt.selected
                          }))
                        }));
                        return;
                      }
                    }
                    
                    const weekText = selectedOption.text;
                    const weekValue = selectedOption.value;
                    
                    console.log('🧪 [TEST-RUN] FINAL SELECTION:');
                    console.log('  - Selected index:', selectedOptionIndex);
                    console.log('  - Selected text:', weekText);
                    console.log('  - Selected value:', weekValue);
                    console.log('  - Is this a valid week?', !isFirstOptionPEmployee || selectedOptionIndex > 0);
                    
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
                      
                      // Method 1: Try selecting the correct option (not always first)
                      if (weekDropdown.options.length > 0) {
                        console.log('🧪 [TEST-RUN] Selecting option at index', selectedOptionIndex + ':', selectedOption.text, 'with value:', selectedOption.value);
                        
                        // Clear all previous selections first
                        for (let i = 0; i < weekDropdown.options.length; i++) {
                          weekDropdown.options[i].selected = false;
                        }
                        
                        // Select the correct option
                        weekDropdown.selectedIndex = selectedOptionIndex;
                        weekDropdown.value = selectedOption.value;
                        
                        // Mark the option as selected in the DOM
                        selectedOption.selected = true;
                        
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
                        console.log('🧪 [TEST-RUN] Selected option status:', selectedOption.selected);
                        console.log('🧪 [TEST-RUN] Expected index match:', weekDropdown.selectedIndex === selectedOptionIndex);
                        
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
            <Text style={[styles.rowButtonText, { color: COLORS.primary }]}>
              🧪 Test Run
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.rowButtonSmall, { borderColor: COLORS.success }]}
            onPress={automation.exportSchedule}
            disabled={automation.state.isAutomating}
          >
            <Text style={[
              styles.rowButtonText,
              { color: COLORS.success },
              automation.state.isAutomating && { color: COLORS.white },
            ]}>
              {automation.state.isAutomating ? '🔄 Exporting...' : '📤 Export Schedule'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.rowButtonSmall,
              { borderColor: COLORS.primary },
              automation.state.isAutomating && styles.rowButtonAutomating,
              { display: 'none' }, // Hide but keep around
            ]}
            onPress={automation.testMultiWeekAutomation}
            disabled={automation.state.isAutomating}
          >
            <Text style={[
              styles.rowButtonText,
              { color: COLORS.primary },
              automation.state.isAutomating && { color: COLORS.white },
            ]}>
              {automation.state.isAutomating ? '🔄 Loading...' : '📄 Load All Schedules'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.rowButtonSmall,
              { borderColor: COLORS.info },
            ]}
            onPress={() => {
              try {
                console.log('🎯 [FIORI] Starting Fiori Button Search and Click...');
                console.log('⏱️ [PERFORMANCE] Fiori button clicked at:', new Date().toISOString());
                
                const fioriClickScript = `
                  (function() {
                    try {
                      const scriptStartTime = Date.now();
                      const currentUrl = window.location.href;
                      
                      console.log('⏱️ [PERFORMANCE] Fiori script started at:', new Date().toISOString());
                      console.log('📍 [PERFORMANCE] Current URL:', currentUrl);
                      console.log('📄 [PERFORMANCE] Document ready state:', document.readyState);
                      console.log('📊 [PERFORMANCE] Page load timing:', window.performance.timing ? {
                        loadComplete: window.performance.timing.loadEventEnd - window.performance.timing.navigationStart,
                        domReady: window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart
                      } : 'Not available');
                      
                      // Function to detect and handle login forms during Fiori navigation
                      function detectAndHandleLoginForm() {
                        console.log('🔍 [FIORI-AUTH] Checking for login form...');
                        
                        const pageContent = document.documentElement.outerHTML;
                        const isLoginForm2 = currentUrl.includes('bireport.costco.com/cognos_ext/bi') && 
                                            (pageContent.includes('Log in with your COSTCOEXT ID') || 
                                             pageContent.includes('COSTCOEXT') ||
                                             pageContent.includes('User ID'));
                        
                        if (isLoginForm2) {
                          console.log('🎯 [FIORI-AUTH] Login Form 2 detected during Fiori navigation!');
                          console.log('🔑 [FIORI-AUTH] Automatically filling credentials...');
                          
                          const employeeId = '${employeeId}';
                          const password = '${password}';
                          
                          if (!employeeId || !password) {
                            console.error('❌ [FIORI-AUTH] No credentials available for auto-fill');
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                              type: 'fiori_auth_error',
                              error: 'No credentials available for automatic authentication'
                            }));
                            return false;
                          }
                          
                          const usernameField = document.getElementById('CAMUsername');
                          const passwordField = document.getElementById('CAMPassword');
                          const signinButton = document.getElementById('signInBtn');
                          
                          if (!usernameField || !passwordField || !signinButton) {
                            console.error('🎯 [FIORI-AUTH] Could not find all required login fields');
                            return false;
                          }
                          
                          console.log('🎯 [FIORI-AUTH] Found all fields - filling credentials automatically');
                          
                          // React-compatible field filling function
                          function fillReactInput(element, value, fieldName) {
                            console.log('🎯 [FIORI-AUTH] Filling', fieldName, 'with React events');
                            
                            element.focus();
                            element.dispatchEvent(new Event('focus', { bubbles: true }));
                            
                            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                            nativeInputValueSetter.call(element, value);

                            element.dispatchEvent(new Event('input', { bubbles: true }));
                            element.dispatchEvent(new Event('change', { bubbles: true }));
                            element.dispatchEvent(new Event('blur', { bubbles: true }));
                          }
                          
                          try {
                            // Fill credentials
                            fillReactInput(usernameField, employeeId, 'Username');
                            fillReactInput(passwordField, password, 'Password');
                            
                            // Wait for React state to update, then submit
                            setTimeout(() => {
                              if (signinButton.disabled) {
                                console.error('🎯 [FIORI-AUTH] Sign-in button is disabled - validation failed');
                                window.ReactNativeWebView.postMessage(JSON.stringify({
                                  type: 'fiori_auth_error',
                                  error: 'Sign-in button is disabled after filling fields'
                                }));
                              } else {
                                console.log('🎯 [FIORI-AUTH] Submitting login form...');
                                
                                // Store intent to continue Fiori navigation after login
                                window.fioriContinueAfterLogin = true;
                                
                                signinButton.focus();
                                signinButton.click();
                                signinButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                                signinButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                                signinButton.dispatchEvent(new Event('click', { bubbles: true }));
                                
                                console.log('✅ [FIORI-AUTH] Login form submitted, will continue Fiori navigation after authentication');
                                
                                window.ReactNativeWebView.postMessage(JSON.stringify({
                                  type: 'fiori_auth_success',
                                  message: 'Authentication form filled and submitted, continuing Fiori navigation...'
                                }));
                              }
                            }, 500);
                            
                            return true;
                            
                          } catch (error) {
                            console.error('🎯 [FIORI-AUTH] Error during credential filling:', error);
                            return false;
                          }
                        }
                        
                        return false; // No login form detected
                      }
                      
                      // Function to search and click schedule buttons
                      function searchAndClickScheduleButton(retryCount = 0) {
                        const searchStartTime = Date.now();
                        console.log('🎯 [FIORI] Searching for schedule buttons (attempt ' + (retryCount + 1) + ')...');
                        console.log('⏱️ [PERFORMANCE] Search started at:', new Date().toISOString());
                        
                        // First check if we need to handle a login form
                        if (detectAndHandleLoginForm()) {
                          console.log('🔑 [FIORI] Login form detected and handled, navigation will continue after authentication');
                          return true;
                        }
                        
                        // Look for Schedule tile link first (most reliable)
                        const scheduleLinks = document.querySelectorAll('a[href*="ScheduleLine"]');
                        console.log('🔍 [SEARCH] Found', scheduleLinks.length, 'ScheduleLine links');
                        
                        if (scheduleLinks.length > 0) {
                          const searchDuration = Date.now() - searchStartTime;
                          console.log('✅ [FIORI] Found ScheduleLine link in', searchDuration, 'ms');
                          const link = scheduleLinks[0];
                          const href = link.href;
                          
                          // Navigate directly instead of clicking (avoids target="_blank" issues)
                          console.log('🚀 [FIORI] Navigating to:', href);
                          console.log('⏱️ [PERFORMANCE] Navigation started at:', new Date().toISOString());
                          window.location.href = href;
                          
                          window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'fiori_button_click_success',
                            buttonText: 'Online Employee Schedules',
                            success: true,
                            method: 'direct-navigation',
                            performanceData: {
                              searchDuration: searchDuration,
                              retryCount: retryCount,
                              totalScriptDuration: Date.now() - scriptStartTime
                            }
                          }));
                          return true;
                        }
                        
                        // Fallback: Look for clickable elements with schedule text
                        const allClickables = document.querySelectorAll('a, button, [role="button"], [role="link"]');
                        console.log('🔍 [SEARCH] Searching through', allClickables.length, 'clickable elements');
                        
                        for (const el of allClickables) {
                          const text = (el.textContent || el.title || el.getAttribute('aria-label') || '').toLowerCase();
                          
                          if (text.includes('online employee schedule')) {
                            const searchDuration = Date.now() - searchStartTime;
                            console.log('✅ [FIORI] Found "Online Employee Schedules" element in', searchDuration, 'ms');
                            
                            // Try to find parent link if this is an inner element
                            let clickTarget = el;
                            if (el.tagName !== 'A') {
                              const parentLink = el.closest('a');
                              if (parentLink) {
                                clickTarget = parentLink;
                                console.log('✅ [FIORI] Using parent link for navigation');
                              }
                            }
                            
                            console.log('⏱️ [PERFORMANCE] Clicking element at:', new Date().toISOString());
                            clickTarget.click();
                            
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                              type: 'fiori_button_click_success',
                              buttonText: 'Online Employee Schedules',
                              success: true,
                              method: 'element-click',
                              performanceData: {
                                searchDuration: searchDuration,
                                retryCount: retryCount,
                                totalScriptDuration: Date.now() - scriptStartTime
                              }
                            }));
                            return true;
                          }
                        }
                        
                        // Fallback: any schedule element
                        for (const el of allClickables) {
                          const text = (el.textContent || '').toLowerCase();
                          if (text.includes('schedule') && text.length < 100) {
                            const searchDuration = Date.now() - searchStartTime;
                            console.log('✅ [FIORI] Found schedule element in', searchDuration, 'ms:', text.substring(0, 30));
                            console.log('⏱️ [PERFORMANCE] Clicking fallback element at:', new Date().toISOString());
                            el.click();
                            
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                              type: 'fiori_button_click_success',
                              buttonText: text.substring(0, 30) + '...',
                              success: true,
                              method: 'fallback-click',
                              performanceData: {
                                searchDuration: searchDuration,
                                retryCount: retryCount,
                                totalScriptDuration: Date.now() - scriptStartTime
                              }
                            }));
                            return true;
                          }
                        }
                        
                        const searchDuration = Date.now() - searchStartTime;
                        console.log('⏳ [SEARCH] Search completed in', searchDuration, 'ms - no matches found');
                        
                        // If we're on Fiori but buttons not found, retry up to 3 times with delays
                        if (retryCount < 3) {
                          console.log('⏳ [FIORI] Buttons not ready, retrying in 2 seconds...');
                          console.log('⏱️ [PERFORMANCE] Will retry at:', new Date(Date.now() + 2000).toISOString());
                          setTimeout(() => searchAndClickScheduleButton(retryCount + 1), 2000);
                          return false;
                        }
                        
                        console.log('❌ [FIORI] No schedule buttons found after ' + (retryCount + 1) + ' attempts');
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                          type: 'fiori_button_click_error',
                          error: 'No schedule buttons found after ' + (retryCount + 1) + ' attempts',
                          success: false,
                          performanceData: {
                            totalSearchDuration: Date.now() - scriptStartTime,
                            retryCount: retryCount + 1,
                            finalAttemptDuration: searchDuration
                          }
                        }));
                        return false;
                      }
                      
                      if (currentUrl.includes('hcm.costco.com')) {
                        // Already on Fiori - search for buttons immediately
                        searchAndClickScheduleButton();
                        
                      } else {
                        // Navigate to Fiori first, then auto-search for buttons
                        console.log('🚀 [FIORI] Navigating to Fiori Launchpad...');
                        const contentIframe = document.getElementById('contentAreaFrame');
                        if (contentIframe?.contentDocument) {
                          const fioriIframe = contentIframe.contentDocument.getElementById('isolatedWorkArea');
                          if (fioriIframe?.src) {
                            // Store flag to auto-continue after navigation
                            window.fioriAutoClick = true;
                            
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                              type: 'navigate_to_fiori',
                              url: fioriIframe.src,
                              success: true,
                              autoClick: true
                            }));
                            return;
                          }
                        }
                        
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                          type: 'fiori_button_click_error',
                          error: 'Cannot find Fiori URL',
                          success: false,
                          performanceData: {
                            totalScriptDuration: Date.now() - scriptStartTime,
                            errorType: 'fiori-url-not-found'
                          }
                        }));
                      }
                      
                    } catch (error) {
                      console.error('❌ [FIORI] Error:', error.message);
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'fiori_button_click_error',
                        error: error.message,
                        success: false,
                        performanceData: {
                          totalScriptDuration: Date.now() - scriptStartTime,
                          errorType: 'script-execution-error'
                        }
                      }));
                    }
                  })();
                `;
                
                if (webViewRef.current) {
                  console.log('🚀 [FIORI] Injecting Fiori automation script');
                  console.log('⏱️ [PERFORMANCE] Script injection started at:', new Date().toISOString());
                  webViewRef.current.injectJavaScript(fioriClickScript);
                } else {
                  console.error('❌ [FIORI] WebView is not available');
                  console.log('🔧 [DEBUG] WebView ref current:', webViewRef.current);
                }
              } catch (error) {
                console.error('❌ [UI] Fiori button error:', error);
                console.log('🔧 [DEBUG] Error details:', (error as Error).message);
              }
            }}
          >
            <Text style={[styles.rowButtonText, { color: COLORS.info }]}>
              🎯 Fiori
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.rowButtonSmall,
              { borderColor: COLORS.warning },
              automation.state.isAutomating && styles.rowButtonAutomating,
            ]}
            onPress={automation.importAllSchedules}
            disabled={automation.state.isAutomating}
          >
            <Text style={[
              styles.rowButtonText,
              { color: COLORS.warning },
              automation.state.isAutomating && { color: COLORS.white },
            ]}>
              {automation.state.isAutomating ? '🔄 Importing...' : '📥 Import All Schedules'}
            </Text>
          </TouchableOpacity>
        </View>

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
            {hasStoredSchedules ? `🗑️ Wipe Schedule Data${getWeekCountText()}` : '🧪 Test Offline Storage'}
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
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: SPACING.sm,
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
    marginBottom: SPACING.sm,
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
    padding: SPACING.sm,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: SPACING.sm,
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
    padding: SPACING.sm,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: SPACING.sm,
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
  buttonRowFour: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.xs,
    flexWrap: 'wrap',
  },
  rowButtonSmall: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 2,
    minWidth: '22%',
  },
  rowButtonAutomating: {
    backgroundColor: COLORS.textSecondary,
  },
  rowButtonText: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '600',
    textAlign: 'center',
  },
  syncProgressContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: 8,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  syncProgressTitle: {
    fontSize: TYPOGRAPHY.h5.fontSize,
    fontWeight: TYPOGRAPHY.h5.fontWeight,
    color: COLORS.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  syncProgressStep: {
    marginBottom: SPACING.sm,
  },
  syncProgressStepText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text,
    fontWeight: '500',
  },
  syncProgressError: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.error,
    marginTop: SPACING.xs,
    paddingLeft: SPACING.lg,
    fontStyle: 'italic',
  },
  syncProgressMfaNote: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.warning,
    marginTop: SPACING.xs,
    paddingLeft: SPACING.lg,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  mfaInstructions: {
    marginTop: SPACING.sm,
    paddingLeft: SPACING.lg,
  },
  mfaContinueButton: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 6,
    marginTop: SPACING.sm,
    alignItems: 'center',
  },
  mfaContinueButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '600',
  },
}); 