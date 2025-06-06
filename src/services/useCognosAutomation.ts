import React, { useState, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { CognosAutomationService, CognosAnalysis, ScheduleOption } from './CognosAutomationService';
import { ScheduleService } from './ScheduleService';

export interface AutomationState {
  isAnalyzing: boolean;
  isAutomating: boolean;
  currentStep: string | null;
  analysis: CognosAnalysis | null;
  availableSchedules: ScheduleOption[];
  error: string | null;
  currentHtml?: string;
  importCompleted?: boolean;
  exportSessionId?: string | null;
}

// Define a base type for WebView messages handled by this hook
interface AutomationWebViewMessage {
  type: string;
  analysis?: CognosAnalysis;
  buttonClicked?: { textContent?: string };
  selectedOption?: string;
  scheduleData?: { 
    totalRows?: number; 
    tableCount?: number; 
    employeeName?: string;
    employeeId?: string;
    [key: string]: unknown 
  };
  summary?: { 
    weeksProcessed?: number;
    totalWeeksAvailable?: number;
    successRate?: string;
    testDuration?: string;
    errorsEncountered?: number;
    conclusiveResult?: string;
    scheduleTimings?: Array<{
      weekIndex: number;
      weekText: string;
      startTime: number;
      endTime: number;
      loadDurationMs: number;
    }>;
    timingStats?: {
      avgLoadTimeMs: number;
      minLoadTimeMs: number;
      maxLoadTimeMs: number;
    };
    [key: string]: unknown 
  }; 
  currentHtml?: string;
  isLoginForm2?: boolean;
  success?: boolean;
  error?: string;
  message?: string;
  exportSessionId?: string;
  messageId?: string;
  testId?: string;
  timestamp?: number;
  detailedResults?: {
    processedWeeks?: any[];
    errors?: any[];
    testState?: any;
    scheduleTimings?: Array<{
      weekIndex: number;
      weekText: string;
      startTime: number;
      endTime: number;
      loadDurationMs: number;
    }>;
    timingStats?: {
      avgLoadTimeMs: number;
      minLoadTimeMs: number;
      maxLoadTimeMs: number;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown; // Allow other properties for specific messages
}

export interface CognosAutomationHook {
  state: AutomationState;
  analyzeInterface: () => Promise<void>;
  loadInitialSchedule: () => Promise<void>;
  dumpHtml: () => Promise<void>;
  selectSchedule: (scheduleValue: string) => Promise<void>;
  runReport: () => Promise<void>;
  extractData: () => Promise<void>;
  automateSchedule: (scheduleValue: string) => Promise<void>;
  testMultiWeekAutomation: () => Promise<void>;
  importSchedule: () => Promise<void>;
  exportSchedule: () => Promise<void>;
  resetState: () => void;
  resetImportCompletedFlag: () => void;
  handleWebViewMessage: (messageData: AutomationWebViewMessage) => Promise<void>;
  inspectLoginForm: () => Promise<void>;
}

export function useCognosAutomation(webViewRef: React.RefObject<WebView | null>): CognosAutomationHook {
  const [state, setState] = useState<AutomationState>({
    isAnalyzing: false,
    isAutomating: false,
    currentStep: null,
    analysis: null,
    availableSchedules: [],
    error: null,
    importCompleted: false,
    exportSessionId: null,
  });
  
  // Use a ref to store the safety timeout ID
  const safetyTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  
  // Create a ref to store export handlers
  const exportHandlersRef = useRef<Record<string, (htmlContent: string) => Promise<void>>>({});
  
  // Create a ref for tracking active test sessions
  const activeTestsRef = useRef<Record<string, {
    startTime: number;
    lastActivityTime: number;
    messageIds: Set<string>;
    completionMessageId: string | null;
    isAcknowledged: boolean;
  }>>({});
  
  // Function to send acknowledgment back to WebView
  const sendAcknowledgment = useCallback((messageId: string, testId: string) => {
    if (!webViewRef.current) {
      console.warn('⚠️ [AUTOMATION] Cannot send acknowledgment - WebView not available');
      return;
    }
    
    try {
      const ackMessage = {
        type: 'ack',
        messageId,
        testId,
        timestamp: Date.now()
      };
      
      console.log('✅ [AUTOMATION] Sending acknowledgment for message:', messageId);
      
      // Use the WebView's injectJavaScript method to post a message back to the WebView
      const jsCode = `
        (function() {
          try {
            if (window.document) {
              const event = new MessageEvent('message', {
                data: '${JSON.stringify(ackMessage)}'
              });
              window.document.dispatchEvent(event);
              console.log('✅ [RN->WEB] Acknowledgment delivered for message: ${messageId}');
            }
          } catch (e) {
            console.error('❌ [RN->WEB] Failed to deliver acknowledgment:', e);
          }
        })();
      `;
      
      webViewRef.current.injectJavaScript(jsCode);
    } catch (error) {
      console.error('❌ [AUTOMATION] Error sending acknowledgment:', error);
    }
  }, [webViewRef]);
  
  // Track test completion with improved reliability
  const markTestCompleted = useCallback((testId: string) => {
    // Update test tracking
    if (activeTestsRef.current[testId]) {
      activeTestsRef.current[testId].isAcknowledged = true;
      console.log('✅ [AUTOMATION] Marked test as completed and acknowledged:', testId);
      
      // Clean up after some time
      setTimeout(() => {
        if (activeTestsRef.current[testId]) {
          console.log('🧹 [AUTOMATION] Cleaning up completed test:', testId);
          delete activeTestsRef.current[testId];
        }
      }, 10000);
    }
    
    // Update UI state
    setState(prev => {
      if (!prev.isAutomating) return prev;
      
      return {
        ...prev,
        isAutomating: false,
        currentStep: null
      };
    });
    
    // Clear any safety timeout
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
  }, []);

  const resetState = useCallback(() => {
    setState({
      isAnalyzing: false,
      isAutomating: false,
      currentStep: null,
      analysis: null,
      availableSchedules: [],
      error: null,
      importCompleted: false,
      exportSessionId: null,
    });
  }, []);

  const analyzeInterface = useCallback(async () => {
    if (!webViewRef.current) {
      Alert.alert('Error', 'WebView not ready');
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isAnalyzing: true, 
      error: null,
      currentStep: 'Analyzing Cognos interface...',
    }));

    try {
      const script = CognosAutomationService.generateAnalysisScript();
      webViewRef.current.injectJavaScript(script);
    } catch (error) {
      console.error('❌ [AUTOMATION] Error injecting analysis script:', error);
      setState(prev => ({ 
        ...prev, 
        isAnalyzing: false, 
        error: 'Failed to inject analysis script',
        currentStep: null,
      }));
      Alert.alert('Error', 'Failed to inject analysis script');
    }
  }, [webViewRef]);

  const loadInitialSchedule = useCallback(async () => {
    if (!webViewRef.current) {
      Alert.alert('Error', 'WebView not ready');
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isAutomating: true, 
      error: null,
      currentStep: 'Loading initial schedule to initialize interface...',
    }));

    try {
      const script = CognosAutomationService.generateInitialScheduleLoadScript();
      webViewRef.current.injectJavaScript(script);
    } catch (error) {
      console.error('❌ [AUTOMATION] Error injecting initial load script:', error);
      setState(prev => ({ 
        ...prev, 
        isAutomating: false, 
        error: 'Failed to inject initial load script',
        currentStep: null,
      }));
      Alert.alert('Error', 'Failed to inject initial load script');
    }
  }, [webViewRef]);

  const dumpHtml = useCallback(async () => {
    if (!webViewRef.current) {
      Alert.alert('Error', 'WebView not ready');
      return;
    }

    try {
      setState(prev => ({ ...prev, isAutomating: true, currentStep: 'Dumping HTML...' }));
      
      const htmlDumpScript = CognosAutomationService.generateSimpleHtmlDumpScript();
      webViewRef.current.injectJavaScript(htmlDumpScript);
    } catch (error) {
      console.error('❌ [AUTOMATION] Error injecting HTML dump script:', error);
      setState(prev => ({
        ...prev,
        isAutomating: false,
        error: 'Failed to inject HTML dump script',
        currentStep: null,
      }));
    }
  }, []);

  const inspectLoginForm = useCallback(async () => {
    if (!webViewRef.current) {
      Alert.alert('Error', 'WebView not ready');
      return;
    }

    try {
      setState(prev => ({ ...prev, isAutomating: true, currentStep: 'Inspecting login form...' }));
      
      const loginFormScript = CognosAutomationService.generateLoginForm2DumpScript();
      webViewRef.current.injectJavaScript(loginFormScript);
      
      console.log('🔍 [AUTOMATION] Injected login form inspection script');
    } catch (error) {
      console.error('❌ [AUTOMATION] Error inspecting login form:', error);
      setState(prev => ({
        ...prev,
        isAutomating: false,
        error: 'Failed to inspect login form',
        currentStep: null,
      }));
    }
  }, []);

  const selectSchedule = useCallback(async (scheduleValue: string) => {
    if (!webViewRef.current) {
      Alert.alert('Error', 'WebView not ready');
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isAutomating: true, 
      error: null,
      currentStep: `Selecting schedule: ${scheduleValue}`,
    }));

    try {
      const script = CognosAutomationService.generateSelectScheduleScript(scheduleValue);
      webViewRef.current.injectJavaScript(script);
    } catch (error) {
      console.error('❌ [AUTOMATION] Error injecting select script:', error);
      setState(prev => ({ 
        ...prev, 
        isAutomating: false, 
        error: 'Failed to inject select script',
        currentStep: null,
      }));
      Alert.alert('Error', 'Failed to inject select script');
    }
  }, [webViewRef]);

  const runReport = useCallback(async () => {
    if (!webViewRef.current) {
      Alert.alert('Error', 'WebView not ready');
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isAutomating: true, 
      error: null,
      currentStep: 'Running report...',
    }));

    try {
      const script = CognosAutomationService.generateClickRunScript();
      webViewRef.current.injectJavaScript(script);
    } catch (error) {
      console.error('❌ [AUTOMATION] Error injecting run script:', error);
      setState(prev => ({ 
        ...prev, 
        isAutomating: false, 
        error: 'Failed to inject run script',
        currentStep: null,
      }));
      Alert.alert('Error', 'Failed to inject run script');
    }
  }, [webViewRef]);

  const extractData = useCallback(async () => {
    if (!webViewRef.current) {
      Alert.alert('Error', 'WebView not ready');
      return;
    }
    
    setState(prev => ({ 
      ...prev, 
      isAutomating: true, 
      error: null,
      currentStep: 'Extracting schedule data...'
    }));

    try {
      console.log('🔄 [AUTOMATION] Extracting data');
      const script = CognosAutomationService.generateExtractDataScript();
      webViewRef.current.injectJavaScript(script);
    } catch (error) {
      console.error('❌ [AUTOMATION] Error injecting extract script:', error);
      setState(prev => ({ 
        ...prev, 
        isAutomating: false, 
        error: 'Failed to inject extract script',
        currentStep: null,
      }));
      Alert.alert('Error', 'Failed to inject extract script');
    }
  }, [webViewRef]);

  const automateSchedule = useCallback(async (scheduleValue: string) => {
    if (!webViewRef.current) {
      Alert.alert('Error', 'WebView not ready');
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isAutomating: true, 
      error: null,
      currentStep: `Starting automation for: ${scheduleValue}`,
    }));

    try {
      // Step 1: Select schedule
      await selectSchedule(scheduleValue);
      
      // Note: Steps 2 and 3 will be triggered by WebView message responses
    } catch (error) {
      console.error('❌ [AUTOMATION] Error in automation:', error);
      setState(prev => ({ 
        ...prev, 
        isAutomating: false, 
        error: 'Automation failed',
        currentStep: null,
      }));
      Alert.alert('Error', 'Automation failed');
    }
  }, [webViewRef, selectSchedule]);

  const testMultiWeekAutomation = useCallback(async () => {
    if (!webViewRef.current) {
      Alert.alert('Error', 'WebView not ready');
      return;
    }

    console.log('🚀 [AUTOMATION] Starting multi-week automation test...');

    // Reset any previous state
    setState(prev => ({ 
      ...prev, 
      isAutomating: true, 
      error: null,
      currentStep: 'Starting multi-week automation test...',
    }));

    try {
      // Set a safety timeout to ensure the test doesn't get stuck in automating state
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
      }
      
      safetyTimeoutRef.current = setTimeout(() => {
        console.warn('⚠️ [AUTOMATION] Safety timeout triggered for multi-week test');
        setState(prev => {
          // Only update if we're still automating (to avoid race conditions)
          if (!prev.isAutomating) return prev;
          
          return {
            ...prev,
            isAutomating: false,
            error: 'Test timed out after 60 seconds',
            currentStep: null
          };
        });
        
        // Show timeout alert
        Alert.alert(
          'Multi-Week Test Timeout',
          'The test took longer than expected. It may have completed but failed to notify the app.',
          [{ text: 'OK' }]
        );
      }, 60000); // 60 second timeout

      // Inject the test script into the WebView
      const multiWeekTestScript = CognosAutomationService.generateMultiWeekAutomationTest();
      await webViewRef.current.injectJavaScript(multiWeekTestScript);
      console.log('✅ [AUTOMATION] Multi-week test script injected successfully');
    } catch (error) {
      console.error('❌ [AUTOMATION] Error starting multi-week test:', error);
      
      setState(prev => ({
        ...prev,
        isAutomating: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        currentStep: null
      }));
      
      Alert.alert('Error', `Failed to start multi-week test: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [webViewRef]);

  // Function to import the current schedule data
  const importSchedule = useCallback(async () => {
    try {
      console.log('🔄 [AUTOMATION] Import schedule called. Current state:', {
        hasHtml: !!state.currentHtml,
        htmlSize: state.currentHtml?.length || 0
      });
      
      // Check if we have any HTML content
      if (!state.currentHtml) {
        console.log('❌ [AUTOMATION] No HTML content available for import');
        Alert.alert(
          'Import Failed ❌',
          'No schedule HTML available. Please extract data first.',
          [{ text: 'OK' }],
        );
        return;
      }

      setState(prev => ({
        ...prev,
        isAutomating: true,
        currentStep: 'Importing schedule data...',
        error: null,
      }));

      // Use the ScheduleService to parse and save the schedule
      const scheduleService = ScheduleService.getInstance();
      
      // Try to parse the schedule from the HTML
      console.log('🔄 [AUTOMATION] Attempting to parse schedule from HTML (length:', state.currentHtml.length, ')');
      const schedule = await scheduleService.parseAndSaveRealSchedule(state.currentHtml);

      if (schedule) {
        console.log('✅ [AUTOMATION] Schedule parsed and saved successfully:', {
          employeeName: schedule.employee.name,
          weekStart: schedule.weekStart,
          weekEnd: schedule.weekEnd
        });
        
        setState(prev => ({
          ...prev,
          isAutomating: false,
          currentStep: null,
          importCompleted: true,
        }));

        Alert.alert(
          'Schedule Imported! ✅',
          `Successfully imported schedule for ${schedule.employee.name} (${schedule.weekStart} - ${schedule.weekEnd})`,
          [{ text: 'Great!' }],
        );
      } else {
        console.log('❌ [AUTOMATION] Failed to parse or save schedule');
        
        setState(prev => ({
          ...prev,
          isAutomating: false,
          error: 'Failed to parse or save schedule',
          currentStep: null,
        }));

        Alert.alert(
          'Import Failed ❌',
          'Could not parse or save the schedule data. Please try again.',
          [{ text: 'OK' }],
        );
      }
    } catch (error) {
      console.error('❌ [AUTOMATION] Import schedule error:', error);
      setState(prev => ({
        ...prev,
        isAutomating: false,
        error: (error as Error).message,
        currentStep: null,
      }));

      Alert.alert(
        'Import Error ❌',
        `An error occurred: ${(error as Error).message}`,
        [{ text: 'OK' }],
      );
    }
  }, [state.currentHtml]);

  // Function to export schedule - combines extractData and importSchedule in sequence
  const exportSchedule = useCallback(async () => {
    if (!webViewRef.current) {
      Alert.alert('Error', 'WebView not ready');
      return;
    }

    console.log('🔄 [AUTOMATION] Starting export schedule flow...');
    
    // Use a dedicated variable for this export session
    // This avoids relying on complex shared state
    const exportSessionId = Date.now().toString();
    console.log('🔄 [AUTOMATION] Created export session ID:', exportSessionId);
    
    setState(prev => ({ 
      ...prev, 
      isAutomating: true, 
      error: null,
      currentStep: 'Exporting schedule: Extracting data...',
      // Set simple identifier for this export session
      exportSessionId
    }));

    try {
      // Create a new function to handle the export sequence
      const handleExportSequence = async (htmlContent: string) => {
        console.log('🔄 [AUTOMATION] Export sequence handler called with HTML content length:', htmlContent.length);
        
        setState(prev => ({
          ...prev,
          currentStep: 'Exporting schedule: Importing data...',
          // Store the HTML content directly in state
          currentHtml: htmlContent
        }));
        
        // Use the ScheduleService to parse and save the schedule
        const scheduleService = ScheduleService.getInstance();
        
        try {
          // Parse and save the schedule
          const schedule = await scheduleService.parseAndSaveRealSchedule(htmlContent);
          
          if (schedule) {
            console.log('✅ [AUTOMATION] Schedule exported successfully:', {
              employeeName: schedule.employee.name,
              weekStart: schedule.weekStart,
              weekEnd: schedule.weekEnd
            });
            
            setState(prev => ({
              ...prev,
              isAutomating: false,
              currentStep: null,
              importCompleted: true,
              exportSessionId: null
            }));

            Alert.alert(
              'Schedule Exported! ✅',
              `Successfully exported schedule for ${schedule.employee.name} (${schedule.weekStart} - ${schedule.weekEnd})`,
              [{ text: 'Great!' }],
            );
          } else {
            console.log('❌ [AUTOMATION] Failed to parse or save schedule');
            
            setState(prev => ({
              ...prev,
              isAutomating: false,
              error: 'Failed to parse or save schedule',
              currentStep: null,
              exportSessionId: null
            }));

            Alert.alert(
              'Export Failed ❌',
              'Could not parse or save the schedule data. Please try again.',
              [{ text: 'OK' }],
            );
          }
        } catch (error) {
          console.error('❌ [AUTOMATION] Export error during import:', error);
          setState(prev => ({
            ...prev,
            isAutomating: false,
            error: (error as Error).message,
            currentStep: null,
            exportSessionId: null
          }));

          Alert.alert(
            'Export Error ❌',
            `An error occurred: ${(error as Error).message}`,
            [{ text: 'OK' }],
          );
        }
      };
      
      // Save the handler in a global variable so it can be accessed by the message handler
      // @ts-ignore
      window.__exportHandlers = window.__exportHandlers || {};
      // @ts-ignore
      window.__exportHandlers[exportSessionId] = handleExportSequence;
      
      // Also save in our local ref for easier access from React Native
      exportHandlersRef.current[exportSessionId] = handleExportSequence;
      console.log('🔄 [AUTOMATION] Saved export handler with ID:', exportSessionId);
      
      // Step 1: Inject script to extract data
      console.log('🔄 [AUTOMATION] Injecting extract data script for export session:', exportSessionId);
      
      // Modify the script to include the export session ID
      const extractScript = `
        (function() {
          try {
            ${CognosAutomationService.generateExtractDataScript().replace(
              'window.ReactNativeWebView.postMessage(JSON.stringify(message));',
              `message.exportSessionId = "${exportSessionId}";
              window.ReactNativeWebView.postMessage(JSON.stringify(message));`
            )}
          } catch (error) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'schedule_extraction_error',
              error: error.message,
              exportSessionId: "${exportSessionId}"
            }));
          }
        })();
      `;
      
      webViewRef.current.injectJavaScript(extractScript);
      
    } catch (error) {
      console.error('❌ [AUTOMATION] Error starting export sequence:', error);
      setState(prev => ({ 
        ...prev, 
        isAutomating: false, 
        error: 'Export failed to start',
        currentStep: null,
        exportSessionId: null
      }));
      Alert.alert('Error', 'Failed to start export');
    }
  }, [webViewRef]);

  // Define an interface for WebView messages with tracking info
  interface TrackedWebViewMessage extends AutomationWebViewMessage {
    messageId?: string;
    testId?: string;
    timestamp?: number;
    isRetry?: boolean;
    retryCount?: number;
    originalMessageId?: string;
  }

  const handleWebViewMessage = useCallback(async (messageData: AutomationWebViewMessage) => {
    try {
      // Handle specific message types
      switch (messageData.type) {
        case 'cognos_analysis_complete': {
          console.log('✅ [AUTOMATION] Analysis complete:', messageData.analysis);
          setState(prev => ({
            ...prev,
            isAnalyzing: false,
            analysis: messageData.analysis ?? null,
            availableSchedules: messageData.analysis?.dropdownInfo?.allOptions || [],
            currentStep: null,
            error: null,
          }));
          
          Alert.alert(
            'Analysis Complete! ✅',
            `Found Cognos interface with ${messageData.analysis?.dropdownInfo?.optionsCount || 0} schedule options.\n\n` +
              `Current selection: ${messageData.analysis?.dropdownInfo?.selectedText || 'None'}\n\n` +
              'Available schedules ready for automation.',
            [{ text: 'Great!' }],
          );
          break;
        }
        case 'cognos_analysis_error': {
          console.log('❌ [AUTOMATION] Analysis error:', messageData.error);
          setState(prev => ({
            ...prev,
            isAnalyzing: false,
            error: messageData.error ?? null,
            currentStep: null,
          }));
          
          Alert.alert(
            'Analysis Failed ❌',
            `Could not analyze Cognos interface:\n\n${messageData.error ?? 'Unknown error'}\n\n` +
              'Make sure you are on the correct Cognos page.',
            [{ text: 'OK' }],
          );
          break;
        }
        case 'initial_schedule_load_complete': {
          console.log('✅ [AUTOMATION] Initial schedule load complete:', messageData.buttonClicked);
          setState(prev => ({
            ...prev,
            isAutomating: false,
            currentStep: null,
            error: null,
          }));
          
          Alert.alert(
            'Initial Load Complete! ✅',
            'Successfully loaded initial schedule to initialize Cognos interface.\n\n' +
              `Button clicked: ${messageData.buttonClicked?.textContent || 'Run'}\n\n` +
              'Now you can run "Analyze Cognos Interface" to see the proper week schedule options.',
            [{ text: 'Great!' }],
          );
          break;
        }
        case 'initial_schedule_load_error': {
          console.log('❌ [AUTOMATION] Initial schedule load error:', messageData.error);
          setState(prev => ({
            ...prev,
            isAutomating: false,
            error: messageData.error ?? null,
            currentStep: null,
          }));
          
          Alert.alert(
            'Initial Load Failed ❌',
            `Could not load initial schedule:\n\n${messageData.error ?? 'Unknown error'}\n\n` +
              'Make sure you are on the correct Cognos page.',
            [{ text: 'OK' }],
          );
          break;
        }
        case 'schedule_selected': {
          console.log('✅ [AUTOMATION] Schedule selected:', messageData.selectedOption);
          setState(prev => ({
            ...prev,
            currentStep: 'Schedule selected, running report...',
          }));
          
          // Auto-proceed to run report
          global.setTimeout(() => {
            runReport();
          }, 1000);
          break;
        }
        case 'schedule_selection_error': {
          console.log('❌ [AUTOMATION] Schedule selection error:', messageData.error);
          setState(prev => ({
            ...prev,
            isAutomating: false,
            error: messageData.error ?? null,
            currentStep: null,
          }));
          
          Alert.alert(
            'Schedule Selection Failed ❌',
            `Could not select schedule:\n\n${messageData.error ?? 'Unknown error'}`, 
            [{ text: 'OK' }],
          );
          break;
        }
        case 'run_button_clicked': {
          console.log('✅ [AUTOMATION] Run button clicked');
          setState(prev => ({
            ...prev,
            currentStep: 'Report running, waiting for completion...',
          }));
          
          // Wait for page to reload, then extract data
          global.setTimeout(() => {
            extractData();
          }, 3000);
          break;
        }
        case 'run_button_error': {
          console.log('❌ [AUTOMATION] Run button error:', messageData.error);
          setState(prev => ({
            ...prev,
            isAutomating: false,
            error: messageData.error ?? null,
            currentStep: null,
          }));
          
          Alert.alert(
            'Run Button Failed ❌',
            `Could not click run button:\n\n${messageData.error ?? 'Unknown error'}`, 
            [{ text: 'OK' }],
          );
          break;
        }
        case 'schedule_data_extracted': {
          console.log('✅ [AUTOMATION] Schedule data extracted:', messageData.scheduleData);
          
          // Store the HTML from the current page for later import
          let extractedHtml = messageData.currentHtml as string;
          
          // If currentHtml isn't available, try to generate HTML from the schedule data
          if (!extractedHtml && Array.isArray(messageData.scheduleData) && messageData.scheduleData.length > 0) {
            // Convert schedule data to HTML content suitable for import
            console.log('✅ [AUTOMATION] No direct HTML found, generating from schedule data');
            
            // Create a simple HTML structure with the schedule data
            extractedHtml = `<html><body>
              <div class="schedule-container">
                ${Array.isArray(messageData.scheduleData[0]) 
                  ? messageData.scheduleData[0].join('\n')
                  : JSON.stringify(messageData.scheduleData)}
              </div>
            </body></html>`;
            
            console.log('✅ [AUTOMATION] Generated HTML size:', extractedHtml.length);
          }
          
          // Check if this is part of an export session and call the handler if it exists
          const exportSessionId = messageData.exportSessionId as string;
          if (exportSessionId) {
            console.log('✅ [AUTOMATION] Message contains export session ID:', exportSessionId);
          }
          
          // First check our local ref (more reliable in React Native)
          if (exportSessionId && exportHandlersRef.current[exportSessionId]) {
            console.log('✅ [AUTOMATION] Found export handler in ref for session:', exportSessionId);
            try {
              // Call the export handler with the HTML content
              await exportHandlersRef.current[exportSessionId](extractedHtml);
              
              // Clear the handler after use
              delete exportHandlersRef.current[exportSessionId];
              
              // Don't show the alert here since the handler will handle that
              return;
            } catch (error) {
              console.error('❌ [AUTOMATION] Error calling export handler from ref:', error);
              // Continue with the default behavior
            }
          } 
          // Fallback to global window (this might not work in React Native)
          else if (exportSessionId && (window as any).__exportHandlers && (window as any).__exportHandlers[exportSessionId]) {
            console.log('✅ [AUTOMATION] Found export handler in window for session:', exportSessionId);
            try {
              // Call the export handler with the HTML content
              (window as any).__exportHandlers[exportSessionId](extractedHtml);
              
              // Clear the handler after use
              delete (window as any).__exportHandlers[exportSessionId];
              
              // Don't show the alert here since the handler will handle that
              return;
            } catch (error) {
              console.error('❌ [AUTOMATION] Error calling export handler from window:', error);
              // Continue with the default behavior
            }
          } else if (state.exportSessionId) {
            // If there's an active export session but no handler was found
            console.log('⚠️ [AUTOMATION] Export session active but no handler found:', state.exportSessionId);
            console.log('⚠️ [AUTOMATION] Available handlers in ref:', Object.keys(exportHandlersRef.current));
          }
          
          // Default behavior if no export handler is found
          setState(prev => ({
            ...prev,
            isAutomating: false,
            currentStep: null,
            error: null,
            currentHtml: extractedHtml || prev.currentHtml,
          }));
          
          Alert.alert(
            'Data Extraction Complete! 🎉',
            'Successfully extracted schedule data:\n\n' +
              `• ${messageData.scheduleData?.totalRows || 0} rows of data\n` +
              `• ${messageData.scheduleData?.tableCount || 0} tables found\n\n` +
              'You can now import this schedule data.',
            [{ text: 'Great!' }],
          );
          break;
        }
        case 'schedule_extraction_error': {
          console.log('❌ [AUTOMATION] Data extraction error:', messageData.error);
          setState(prev => ({
            ...prev,
            isAutomating: false,
            error: messageData.error ?? null,
            currentStep: null,
          }));
          
          Alert.alert(
            'Data Extraction Failed ❌',
            `Could not extract schedule data:\n\n${messageData.error ?? 'Unknown error'}`, 
            [{ text: 'OK' }],
          );
          break;
        }
        case 'multi_week_test_progress':
          sendAcknowledgment(messageData.messageId || '', messageData.testId || '');
          if (messageData.summary) {
            console.log('📊 [AUTOMATION] Multi-week test progress update:', messageData.summary);
            
            // Log timing data if available
            if (messageData.summary.scheduleTimings && Array.isArray(messageData.summary.scheduleTimings) && messageData.summary.scheduleTimings.length > 0) {
              console.log('⏱️ [AUTOMATION] Schedule timings so far:');
              messageData.summary.scheduleTimings.forEach((timing) => {
                console.log(`  - Week ${timing.weekText}: ${timing.loadDurationMs}ms`);
              });
            }
          }
          break;
        case 'html_dump_complete': {
          console.log('📋 [AUTOMATION] HTML dump complete:', messageData.summary);
          setState(prev => ({
            ...prev,
            isAutomating: false,
            currentStep: null,
            error: null,
          }));
          
          const summary = messageData.summary;
          Alert.alert(
            'HTML Dump Complete! 📋',
            'Successfully dumped HTML content:\n\n' +
              `📄 Total Iframes: ${summary?.totalIframes || 0}\n` +
              `✅ Accessible: ${summary?.accessibleIframes || 0}\n` +
              `🎯 Cognos Iframes: ${summary?.cognosIframes || 0}\n` +
              `❌ Blocked: ${summary?.blockedIframes || 0}\n\n` +
              `📏 Main Document: ${summary?.mainDocumentSize || 0} chars\n` +
              `📏 Total HTML: ${summary?.totalHtmlSize || 0} chars\n\n` +
              'Check console logs for detailed HTML content and iframe analysis.',
            [{ text: 'Great!' }],
          );
          break;
        }
        case 'html_dump_error': {
          console.log('❌ [AUTOMATION] HTML dump error:', messageData.error);
          setState(prev => ({
            ...prev,
            isAutomating: false,
            error: messageData.error ?? null,
            currentStep: null,
          }));
          
          Alert.alert(
            'HTML Dump Failed ❌',
            `Could not dump HTML content:\n\n${messageData.error ?? 'Unknown error'}`, 
            [{ text: 'OK' }],
          );
          break;
        }
        case 'main_html_dump_complete': {
          console.log('📄 [AUTOMATION] Main HTML dump complete:', messageData.summary);
          setState(prev => ({
            ...prev,
            isAutomating: false,
            currentStep: null,
            error: null,
          }));
          
          const mainSummary = messageData.summary;
          Alert.alert(
            'Main HTML Dump Complete! 📄',
            'Successfully dumped main document HTML:\n\n' +
              `📍 URL: ${mainSummary?.url || 'N/A'}\n` +
              `📋 Title: ${mainSummary?.title || 'N/A'}\n` +
              `📏 HTML Length: ${mainSummary?.htmlLength || 0} chars\n` +
              `🔄 Ready State: ${mainSummary?.readyState || 'N/A'}\n\n` +
              'Check console logs for the complete HTML content.',
            [{ text: 'Great!' }],
          );
          break;
        }
        case 'main_html_dump_error': {
          console.log('❌ [AUTOMATION] Main HTML dump error:', messageData.error);
          setState(prev => ({
            ...prev,
            isAutomating: false,
            error: messageData.error ?? null,
            currentStep: null,
          }));
          
          Alert.alert(
            'Main HTML Dump Failed ❌',
            `Could not dump main HTML:\n\n${messageData.error ?? 'Unknown error'}`, 
            [{ text: 'OK' }],
          );
          break;
        }
        case 'iframe_html_dump_complete': {
          console.log('🖼️ [AUTOMATION] Iframe HTML dump complete:', messageData.summary);
          setState(prev => ({
            ...prev,
            isAutomating: false,
            currentStep: null,
            error: null,
          }));
          
          const iframeSummary = messageData.summary;
          Alert.alert(
            'Iframe HTML Dump Complete! 🖼️',
            'Successfully dumped iframe HTML analysis:\n\n' +
              `📄 Total Iframes: ${iframeSummary?.totalIframes || 0}\n` +
              `✅ Accessible: ${iframeSummary?.accessibleIframes || 0}\n` +
              `🎯 Cognos Iframes: ${iframeSummary?.cognosIframes || 0}\n` +
              `❌ Blocked: ${iframeSummary?.blockedIframes || 0}\n\n` +
              'Check console logs for detailed iframe HTML content.',
            [{ text: 'Great!' }],
          );
          break;
        }
        case 'iframe_html_dump_error': {
          console.log('❌ [AUTOMATION] Iframe HTML dump error:', messageData.error);
          setState(prev => ({
            ...prev,
            isAutomating: false,
            error: messageData.error ?? null,
            currentStep: null,
          }));
          
          Alert.alert(
            'Iframe HTML Dump Failed ❌',
            `Could not dump iframe HTML:\n\n${messageData.error ?? 'Unknown error'}`, 
            [{ text: 'OK' }],
          );
          break;
        }
        case 'login_form_2_dump_complete': {
          console.log('🔍 [AUTOMATION] Login form inspection complete:', messageData.summary);
          setState(prev => ({
            ...prev,
            isAutomating: false,
            currentStep: null,
            error: null,
          }));
          
          const loginFormSummary = messageData.summary;
          Alert.alert(
            'Login Form Inspection Complete! 🔍',
            'Successfully analyzed login form:\n\n' +
              `📍 URL: ${loginFormSummary?.url || 'N/A'}\n` +
              `📋 Input Fields: ${loginFormSummary?.inputCount || 0}\n` +
              `📃 Forms: ${loginFormSummary?.formCount || 0}\n` +
              `🔘 Buttons: ${loginFormSummary?.buttonCount || 0}\n` +
              `🔐 Validation Scripts: ${loginFormSummary?.validationScriptCount || 0}\n\n` +
              'Check console logs for detailed validation logic analysis.',
            [{ text: 'Great!' }],
          );
          break;
        }
        case 'login_form_2_dump_error': {
          console.log('❌ [AUTOMATION] Login form inspection error:', messageData.error);
          setState(prev => ({
            ...prev,
            isAutomating: false,
            error: messageData.error ?? null,
            currentStep: null,
          }));
          
          Alert.alert(
            'Login Form Inspection Failed ❌',
            `Could not analyze login form:\n\n${messageData.error ?? 'Unknown error'}`, 
            [{ text: 'OK' }],
          );
          break;
        }
        case 'simple_html_dump_complete': {
          console.log('📋 [AUTOMATION] Simple HTML dump complete:', messageData.summary);
          setState(prev => ({
            ...prev,
            isAutomating: false,
            currentStep: null,
            error: null,
          }));
          
          const htmlSummary = messageData.summary;
          Alert.alert(
            'HTML Dump Complete! 📋',
            'Successfully dumped all HTML content:\n\n' +
              `📍 URL: ${htmlSummary?.url || 'N/A'}\n` +
              `📄 Main Document: ${htmlSummary?.mainDocumentSize || 0} chars\n` +
              `🖼️ Total Iframes: ${htmlSummary?.totalIframes || 0}\n` +
              `✅ Accessible Iframes: ${htmlSummary?.accessibleIframes || 0}\n` +
              `📏 Total HTML: ${htmlSummary?.totalHtmlDumped || 0} chars\n\n` +
              'Check console logs for complete HTML content.',
            [{ text: 'Great!' }],
          );
          break;
        }
        case 'simple_html_dump_error': {
          console.log('❌ [AUTOMATION] Simple HTML dump error:', messageData.error);
          setState(prev => ({
            ...prev,
            isAutomating: false,
            error: messageData.error ?? null,
            currentStep: null,
          }));
          
          Alert.alert(
            'HTML Dump Failed ❌',
            `Could not dump HTML:\n\n${messageData.error ?? 'Unknown error'}`, 
            [{ text: 'OK' }],
          );
          break;
        }
        case 'multi_week_test_complete':
          sendAcknowledgment(messageData.messageId || '', messageData.testId || '');
          console.log('✅ [AUTOMATION] Multi-week test complete:', messageData.summary || {});
          console.log('📊 [AUTOMATION] Multi-week test detailed results:');
          console.log('  - Message ID:', messageData.messageId || 'unknown');
          console.log('  - Test ID:', messageData.testId || 'unknown');
          console.log('  - Type:', messageData.type);
          console.log('  - Success flag:', messageData.success);
          console.log('  - Has summary:', !!messageData.summary);
          
          if (messageData.summary) {
            console.log('  - Weeks processed:', messageData.summary.weeksProcessed);
            console.log('  - Total weeks available:', messageData.summary.totalWeeksAvailable);
            console.log('  - Success rate:', messageData.summary.successRate);
            console.log('  - Test duration:', messageData.summary.testDuration);
            console.log('  - Errors encountered:', messageData.summary.errorsEncountered);
            
            // Log timing stats if available
            if (messageData.summary.timingStats) {
              console.log('⏱️ [AUTOMATION] Schedule load timing statistics:');
              console.log('  - Average load time:', messageData.summary.timingStats.avgLoadTimeMs, 'ms');
              console.log('  - Minimum load time:', messageData.summary.timingStats.minLoadTimeMs, 'ms');
              console.log('  - Maximum load time:', messageData.summary.timingStats.maxLoadTimeMs, 'ms');
            }
            
            // Log individual schedule timings if available
            if (messageData.detailedResults && 
                messageData.detailedResults.scheduleTimings && 
                Array.isArray(messageData.detailedResults.scheduleTimings)) {
              console.log('⏱️ [AUTOMATION] Detailed schedule load timings:');
              messageData.detailedResults.scheduleTimings.forEach((timing, index) => {
                console.log(`  - Week ${timing.weekText}: ${timing.loadDurationMs}ms`);
              });
            }
          }
          
          // Mark test as completed
          if (messageData.testId) {
            markTestCompleted(messageData.testId);
          }
          
          break;
        case 'multi_week_test_error': {
          console.error('❌ [AUTOMATION] Multi-week test error:', messageData.error);
          
          // Clear any pending safety timeout
          if (safetyTimeoutRef.current) {
            clearTimeout(safetyTimeoutRef.current);
            safetyTimeoutRef.current = null;
          }
          
          // Update UI state
          setState(prev => ({
            ...prev,
            isAutomating: false,
            error: typeof messageData.error === 'string' ? messageData.error : 'Unknown error in multi-week test',
            currentStep: null
          }));
          
          // Show alert
          Alert.alert(
            'Multi-Week Test Error',
            `The test encountered an error: ${typeof messageData.error === 'string' ? messageData.error : 'Unknown error'}`,
            [{ text: 'OK' }]
          );
          
          break;
        }
        default:
          console.log('ℹ️ [AUTOMATION] Unhandled message type:', messageData.type);
      }
      
      // ... rest of the function ...
    } catch (error) {
      // ... error handling ...
    }
  }, [sendAcknowledgment, markTestCompleted]);

  const resetImportCompletedFlag = useCallback(() => {
    setState(prev => ({
      ...prev,
      importCompleted: false,
    }));
    console.log('🔄 [AUTOMATION] Reset import completed flag');
  }, []);

  return {
    state,
    analyzeInterface,
    loadInitialSchedule,
    dumpHtml,
    selectSchedule,
    runReport,
    extractData,
    automateSchedule,
    testMultiWeekAutomation,
    importSchedule,
    exportSchedule,
    resetState,
    resetImportCompletedFlag,
    handleWebViewMessage,
    inspectLoginForm
  };
}