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
    [key: string]: unknown 
  }; // Summary objects with explicit properties
  currentHtml?: string;
  isLoginForm2?: boolean;
  success?: boolean;
  error?: string;
  message?: string;
  exportSessionId?: string;
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
  handleWebViewMessage: (messageData: AutomationWebViewMessage) => void;
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
  
  // Track active tests and their message history
  const activeTestsRef = useRef<{
    [testId: string]: {
      startTime: number;
      lastActivityTime: number;
      messageIds: Set<string>;
      completionMessageId: string | null;
      isAcknowledged: boolean;
    }
  }>({});
  
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
        console.log('🔄 [AUTOMATION] Export sequence: HTML content received, length:', htmlContent.length);
        
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

  const handleWebViewMessage = useCallback((messageData: any) => {
    if (!messageData || !messageData.type) {
      console.error('❌ [AUTOMATION] Received invalid message:', messageData);
      return;
    }
    
    // Type assertion to the tracked message interface
    const trackedMessage = messageData as TrackedWebViewMessage;
    
    // Extract message tracking info if available
    const messageId = trackedMessage.messageId || `legacy_${Date.now()}`;
    const testId = trackedMessage.testId || 'default_test';
    const timestamp = trackedMessage.timestamp || Date.now();
    
    // Track this message and test
    if (testId && messageId) {
      // Initialize test tracking if this is a new test
      if (!activeTestsRef.current[testId]) {
        activeTestsRef.current[testId] = {
          startTime: timestamp,
          lastActivityTime: timestamp,
          messageIds: new Set<string>(),
          completionMessageId: null,
          isAcknowledged: false
        };
        console.log('🆕 [AUTOMATION] Tracking new test:', testId);
      }
      
      // Update last activity time
      activeTestsRef.current[testId].lastActivityTime = timestamp;
      
      // Check if we've seen this message before
      const isDuplicate = activeTestsRef.current[testId].messageIds.has(messageId);
      if (isDuplicate) {
        console.log('🔄 [AUTOMATION] Received duplicate message:', messageId, 'for test:', testId);
        
        // For completion messages, we might still want to acknowledge again
        if (trackedMessage.type === 'multi_week_test_complete') {
          sendAcknowledgment(messageId, testId);
        } else {
          // For other messages, no need to process duplicates
          return;
        }
      } else {
        // Track this message
        activeTestsRef.current[testId].messageIds.add(messageId);
        
        // Always acknowledge messages that have IDs
        sendAcknowledgment(messageId, testId);
      }
    }
    
    // Process message based on type
    switch (trackedMessage.type) {
    case 'cognos_analysis_complete': {
      console.log('✅ [AUTOMATION] Analysis complete:', trackedMessage.analysis);
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        analysis: trackedMessage.analysis ?? null,
        availableSchedules: trackedMessage.analysis?.dropdownInfo?.allOptions || [],
        currentStep: null,
        error: null,
      }));
        
      Alert.alert(
        'Analysis Complete! ✅',
        `Found Cognos interface with ${trackedMessage.analysis?.dropdownInfo?.optionsCount || 0} schedule options.\n\n` +
          `Current selection: ${trackedMessage.analysis?.dropdownInfo?.selectedText || 'None'}\n\n` +
          'Available schedules ready for automation.',
        [{ text: 'Great!' }],
      );
      break;
    }
    case 'cognos_analysis_error': {
      console.log('❌ [AUTOMATION] Analysis error:', trackedMessage.error);
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: trackedMessage.error ?? null,
        currentStep: null,
      }));
        
      Alert.alert(
        'Analysis Failed ❌',
        `Could not analyze Cognos interface:\n\n${trackedMessage.error ?? 'Unknown error'}\n\n` +
          'Make sure you are on the correct Cognos page.',
        [{ text: 'OK' }],
      );
      break;
    }
    case 'initial_schedule_load_complete': {
      console.log('✅ [AUTOMATION] Initial schedule load complete:', trackedMessage.buttonClicked);
      setState(prev => ({
        ...prev,
        isAutomating: false,
        currentStep: null,
        error: null,
      }));
        
      Alert.alert(
        'Initial Load Complete! ✅',
        'Successfully loaded initial schedule to initialize Cognos interface.\n\n' +
          `Button clicked: ${trackedMessage.buttonClicked?.textContent || 'Run'}\n\n` +
          'Now you can run "Analyze Cognos Interface" to see the proper week schedule options.',
        [{ text: 'Great!' }],
      );
      break;
    }
    case 'initial_schedule_load_error': {
      console.log('❌ [AUTOMATION] Initial schedule load error:', trackedMessage.error);
      setState(prev => ({
        ...prev,
        isAutomating: false,
        error: trackedMessage.error ?? null,
        currentStep: null,
      }));
        
      Alert.alert(
        'Initial Load Failed ❌',
        `Could not load initial schedule:\n\n${trackedMessage.error ?? 'Unknown error'}\n\n` +
          'Make sure you are on the correct Cognos page.',
        [{ text: 'OK' }],
      );
      break;
    }
    case 'schedule_selected': {
      console.log('✅ [AUTOMATION] Schedule selected:', trackedMessage.selectedOption);
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
      console.log('❌ [AUTOMATION] Schedule selection error:', trackedMessage.error);
      setState(prev => ({
        ...prev,
        isAutomating: false,
        error: trackedMessage.error ?? null,
        currentStep: null,
      }));
        
      Alert.alert(
        'Schedule Selection Failed ❌',
        `Could not select schedule:\n\n${trackedMessage.error ?? 'Unknown error'}`, 
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
      console.log('❌ [AUTOMATION] Run button error:', trackedMessage.error);
      setState(prev => ({
        ...prev,
        isAutomating: false,
        error: trackedMessage.error ?? null,
        currentStep: null,
      }));
        
      Alert.alert(
        'Run Button Failed ❌',
        `Could not click run button:\n\n${trackedMessage.error ?? 'Unknown error'}`, 
        [{ text: 'OK' }],
      );
      break;
    }
    case 'schedule_data_extracted': {
      console.log('✅ [AUTOMATION] Schedule data extracted:', trackedMessage.scheduleData);
      
      // Store the HTML from the current page for later import
      let extractedHtml = trackedMessage.currentHtml as string;
      
      // If currentHtml isn't available, try to generate HTML from the schedule data
      if (!extractedHtml && Array.isArray(trackedMessage.scheduleData) && trackedMessage.scheduleData.length > 0) {
        // Convert schedule data to HTML content suitable for import
        console.log('✅ [AUTOMATION] No direct HTML found, generating from schedule data');
        
        // Create a simple HTML structure with the schedule data
        extractedHtml = `<html><body>
          <div class="schedule-container">
            ${Array.isArray(trackedMessage.scheduleData[0]) 
              ? trackedMessage.scheduleData[0].join('\n')
              : JSON.stringify(trackedMessage.scheduleData)}
          </div>
        </body></html>`;
        
        console.log('✅ [AUTOMATION] Generated HTML size:', extractedHtml.length);
      }
      
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
          `• ${trackedMessage.scheduleData?.totalRows || 0} rows of data\n` +
          `• ${trackedMessage.scheduleData?.tableCount || 0} tables found\n\n` +
          'You can now import this schedule data.',
        [{ text: 'Great!' }],
      );
      break;
    }
    case 'schedule_extraction_error': {
      console.log('❌ [AUTOMATION] Data extraction error:', trackedMessage.error);
      setState(prev => ({
        ...prev,
        isAutomating: false,
        error: trackedMessage.error ?? null,
        currentStep: null,
      }));
        
      Alert.alert(
        'Data Extraction Failed ❌',
        `Could not extract schedule data:\n\n${trackedMessage.error ?? 'Unknown error'}`, 
        [{ text: 'OK' }],
      );
      break;
    }
    case 'multi_week_test_progress': {
      console.log('📊 [AUTOMATION] Multi-week test progress update:', trackedMessage.summary);
      
      // Only update the current step to show progress
      if (trackedMessage.currentStep) {
        setState(prev => {
          // Don't override if we're no longer in automating state
          if (!prev.isAutomating) return prev;
          
          const summary = trackedMessage.summary as {
            currentWeekIndex: number;
            totalWeeksAvailable: number;
            progress: string;
            testDuration: string;
            weeksProcessed: number;
            errorsEncountered: number;
            status: string;
          } | undefined;
          
          let progressMessage: string;
          if (summary && typeof summary.currentWeekIndex === 'number' && 
              typeof summary.totalWeeksAvailable === 'number') {
            progressMessage = `Processing week ${summary.currentWeekIndex + 1} of ${summary.totalWeeksAvailable} (${summary.progress})`;
            if (summary.weeksProcessed > 0) {
              progressMessage += ` - ${summary.weeksProcessed} completed`;
            }
            if (summary.errorsEncountered > 0) {
              progressMessage += ` - ${summary.errorsEncountered} errors`;
            }
          } else {
            progressMessage = trackedMessage.currentStep as string;
          }
          
          return {
            ...prev,
            currentStep: progressMessage
          };
        });
      }
      
      break;
    }
    case 'html_dump_complete': {
      console.log('📋 [AUTOMATION] HTML dump complete:', trackedMessage.summary);
      setState(prev => ({
        ...prev,
        isAutomating: false,
        currentStep: null,
        error: null,
      }));
        
      const summary = trackedMessage.summary;
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
      console.log('❌ [AUTOMATION] HTML dump error:', trackedMessage.error);
      setState(prev => ({
        ...prev,
        isAutomating: false,
        error: trackedMessage.error ?? null,
        currentStep: null,
      }));
        
      Alert.alert(
        'HTML Dump Failed ❌',
        `Could not dump HTML content:\n\n${trackedMessage.error ?? 'Unknown error'}`, 
        [{ text: 'OK' }],
      );
      break;
    }
    case 'main_html_dump_complete': {
      console.log('📄 [AUTOMATION] Main HTML dump complete:', trackedMessage.summary);
      setState(prev => ({
        ...prev,
        isAutomating: false,
        currentStep: null,
        error: null,
      }));
        
      const mainSummary = trackedMessage.summary;
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
      console.log('❌ [AUTOMATION] Main HTML dump error:', trackedMessage.error);
      setState(prev => ({
        ...prev,
        isAutomating: false,
        error: trackedMessage.error ?? null,
        currentStep: null,
      }));
        
      Alert.alert(
        'Main HTML Dump Failed ❌',
        `Could not dump main HTML:\n\n${trackedMessage.error ?? 'Unknown error'}`, 
        [{ text: 'OK' }],
      );
      break;
    }
    case 'iframe_html_dump_complete': {
      console.log('🖼️ [AUTOMATION] Iframe HTML dump complete:', trackedMessage.summary);
      setState(prev => ({
        ...prev,
        isAutomating: false,
        currentStep: null,
        error: null,
      }));
        
      const iframeSummary = trackedMessage.summary;
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
      console.log('❌ [AUTOMATION] Iframe HTML dump error:', trackedMessage.error);
      setState(prev => ({
        ...prev,
        isAutomating: false,
        error: trackedMessage.error ?? null,
        currentStep: null,
      }));
        
      Alert.alert(
        'Iframe HTML Dump Failed ❌',
        `Could not dump iframe HTML:\n\n${trackedMessage.error ?? 'Unknown error'}`, 
        [{ text: 'OK' }],
      );
      break;
    }
    case 'login_form_2_dump_complete': {
      console.log('🔐 [AUTOMATION] Login Form 2 dump complete:', trackedMessage.summary);
      setState(prev => ({
        ...prev,
        isAutomating: false,
        currentStep: null,
        error: null,
      }));
        
      const loginSummary = trackedMessage.summary;
      Alert.alert(
        'Login Form 2 Analysis Complete! 🔐',
        'Successfully analyzed login form:\n\n' +
          `📍 URL: ${typeof (loginSummary?.url) === 'string' && (loginSummary.url).includes('bireport') ? '✅ Cognos BI page' : '❓ Other page'}\n` +
          `🔐 Is Login Form 2: ${trackedMessage.isLoginForm2 ? '✅ Yes' : '❌ No'}\n` +
          `📝 Input Fields: ${loginSummary?.inputCount || 0}\n` +
          `📋 Forms: ${loginSummary?.formCount || 0}\n` +
          `🔘 Buttons: ${loginSummary?.buttonCount || 0}\n` +
          `📜 Validation Scripts: ${loginSummary?.validationScriptCount || 0}\n\n` +
          'Check console logs for detailed field validation states and HTML structure.',
        [{ text: 'Great!' }],
      );
      break;
    }
    case 'login_form_2_dump_error': {
      console.log('❌ [AUTOMATION] Login Form 2 dump error:', trackedMessage.error);
      setState(prev => ({
        ...prev,
        isAutomating: false,
        error: trackedMessage.error ?? null,
        currentStep: null,
      }));
        
      Alert.alert(
        'Login Form 2 Analysis Failed ❌',
        `Could not analyze login form:\n\n${trackedMessage.error ?? 'Unknown error'}`, 
        [{ text: 'OK' }],
      );
      break;
    }
    case 'simple_html_dump_complete': {
      console.log('📋 [AUTOMATION] Simple HTML dump complete:', trackedMessage.summary);
      setState(prev => ({
        ...prev,
        isAutomating: false,
        currentStep: null,
        error: null,
      }));
        
      const htmlSummary = trackedMessage.summary;
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
      console.log('❌ [AUTOMATION] Simple HTML dump error:', trackedMessage.error);
      setState(prev => ({
        ...prev,
        isAutomating: false,
        error: trackedMessage.error ?? null,
        currentStep: null,
      }));
        
      Alert.alert(
        'HTML Dump Failed ❌',
        `Could not dump HTML:\n\n${trackedMessage.error ?? 'Unknown error'}`, 
        [{ text: 'OK' }],
      );
      break;
    }
    case 'multi_week_test_complete': {
      console.log('✅ [AUTOMATION] Multi-week test complete:', trackedMessage.summary);
      
      // Additional detailed logging for debugging completion issues
      console.log('📊 [AUTOMATION] Multi-week test detailed results:');
      console.log('  - Message ID:', messageId);
      console.log('  - Test ID:', testId);
      console.log('  - Type:', trackedMessage.type);
      console.log('  - Success flag:', trackedMessage.success);
      console.log('  - Has summary:', !!trackedMessage.summary);
      
      if (trackedMessage.summary) {
        console.log('  - Weeks processed:', trackedMessage.summary.weeksProcessed);
        console.log('  - Total weeks available:', trackedMessage.summary.totalWeeksAvailable);
        console.log('  - Success rate:', trackedMessage.summary.successRate);
        console.log('  - Test duration:', trackedMessage.summary.testDuration);
        console.log('  - Errors encountered:', trackedMessage.summary.errorsEncountered);
      }
      
      // Track this as a completion message
      if (activeTestsRef.current[testId]) {
        activeTestsRef.current[testId].completionMessageId = messageId;
      }
      
      // Update UI state - force exit automating state
      markTestCompleted(testId);
      
      // Show alert only if we haven't already shown one for this test
      // or if this is a legacy message without tracking info
      if (!activeTestsRef.current[testId]?.isAcknowledged || !testId) {
        const successfulWeeks = trackedMessage.summary?.weeksProcessed ?? 0;
        const totalWeeks = trackedMessage.summary?.totalWeeksAvailable ?? 0;
        const testDuration = trackedMessage.summary?.testDuration ?? 'unknown duration';
        
        Alert.alert(
          'Multi-Week Test Complete!',
          `Successfully processed ${successfulWeeks} of ${totalWeeks} weeks in ${testDuration}.`,
          [{ text: 'OK' }]
        );
      }
      
      break;
    }
    case 'multi_week_test_error': {
      console.error('❌ [AUTOMATION] Multi-week test error:', trackedMessage.error);
      
      // Clear any pending safety timeout
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
        safetyTimeoutRef.current = null;
      }
      
      // Update UI state
      setState(prev => ({
        ...prev,
        isAutomating: false,
        error: typeof trackedMessage.error === 'string' ? trackedMessage.error : 'Unknown error in multi-week test',
        currentStep: null
      }));
      
      // Show alert
      Alert.alert(
        'Multi-Week Test Error',
        `The test encountered an error: ${typeof trackedMessage.error === 'string' ? trackedMessage.error : 'Unknown error'}`,
        [{ text: 'OK' }]
      );
      
      break;
    }
    default:
      console.log('ℹ️ [AUTOMATION] Unhandled message type:', trackedMessage.type);
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
  };
}