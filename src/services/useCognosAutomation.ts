import React, { useState, useCallback } from 'react';
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
  isExportFlow?: boolean;
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
    isExportFlow: false,
  });

  const resetState = useCallback(() => {
    setState({
      isAnalyzing: false,
      isAutomating: false,
      currentStep: null,
      analysis: null,
      availableSchedules: [],
      error: null,
      importCompleted: false,
      isExportFlow: false,
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
      currentStep: 'Extracting schedule data...',
    }));

    try {
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

    setState(prev => ({ 
      ...prev, 
      isAutomating: true, 
      error: null,
      currentStep: 'Starting multi-week automation test...',
    }));

    try {
      const script = CognosAutomationService.generateMultiWeekAutomationTest();
      webViewRef.current.injectJavaScript(script);
    } catch (error) {
      console.error('❌ [AUTOMATION] Error injecting multi-week test script:', error);
      setState(prev => ({ 
        ...prev, 
        isAutomating: false, 
        error: 'Failed to inject multi-week test script',
        currentStep: null,
      }));
      Alert.alert('Error', 'Failed to inject multi-week test script');
    }
  }, [webViewRef]);

  // New function to import the current schedule data
  const importSchedule = useCallback(async () => {
    try {
      console.log('🔄 [AUTOMATION] Import schedule called. Export flow:', state.isExportFlow ? 'Yes' : 'No');
      
      if (!state.currentHtml) {
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
      const schedule = await scheduleService.parseAndSaveRealSchedule(state.currentHtml);

      if (schedule) {
        setState(prev => ({
          ...prev,
          isAutomating: false,
          currentStep: null,
          importCompleted: true,
          isExportFlow: false, // Reset export flow flag after successful import
        }));

        Alert.alert(
          'Schedule Imported! ✅',
          `Successfully imported schedule for ${schedule.employee.name} (${schedule.weekStart} - ${schedule.weekEnd})`,
          [{ text: 'Great!' }],
        );
      } else {
        setState(prev => ({
          ...prev,
          isAutomating: false,
          error: 'Failed to parse or save schedule',
          currentStep: null,
          isExportFlow: false, // Reset export flow flag on failure too
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
        isExportFlow: false, // Reset export flow flag on error
      }));

      Alert.alert(
        'Import Error ❌',
        `An error occurred: ${(error as Error).message}`,
        [{ text: 'OK' }],
      );
    }
  }, [state.currentHtml]);

  // New function to export schedule - combines extractData and importSchedule
  const exportSchedule = useCallback(async () => {
    if (!webViewRef.current) {
      Alert.alert('Error', 'WebView not ready');
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isAutomating: true, 
      error: null,
      currentStep: 'Exporting schedule (step 1/2): Extracting data...',
      isExportFlow: true, // Set the dedicated export flow flag
    }));

    try {
      // Step 1: Extract data
      const script = CognosAutomationService.generateExtractDataScript();
      webViewRef.current.injectJavaScript(script);
      
      // The handleWebViewMessage function will receive the extracted HTML
      // and update state.currentHtml, then we'll process the import
      // This is handled in the 'extract_data_complete' case of the switch statement
    } catch (error) {
      console.error('❌ [AUTOMATION] Error in export schedule:', error);
      setState(prev => ({ 
        ...prev, 
        isAutomating: false, 
        error: 'Export schedule failed',
        currentStep: null,
        isExportFlow: false, // Reset the flag on error
      }));
      Alert.alert('Error', 'Export schedule failed');
    }
  }, [webViewRef]);

  // Handler for WebView messages - this should be called from the parent component
  const handleWebViewMessage = useCallback((messageData: AutomationWebViewMessage) => {
    console.log('🤖 [AUTOMATION] Received message:', messageData.type);

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
      const extractedHtml = messageData.currentHtml as string;
      
      // Check if we're in the export flow using the dedicated flag
      const isInExportFlow = state.isExportFlow === true;
      console.log('✅ [AUTOMATION] Export flow check:', isInExportFlow ? 'In export flow' : 'Regular extraction');
      
      setState(prev => {
        // Keep the export flow state during update
        const inExportFlow = prev.isExportFlow === true;
        
        return {
          ...prev,
          isAutomating: inExportFlow, // Keep automating if in export flow
          currentStep: inExportFlow ? 'Exporting schedule (step 2/2): Importing data...' : null,
          error: null,
          currentHtml: extractedHtml || prev.currentHtml,
          // Don't reset isExportFlow here to maintain the flow state
        };
      });
      
      // Check if this is part of an export flow
      if (isInExportFlow) {
        console.log('✅ [AUTOMATION] Continuing with export flow, proceeding to import...');
        // If we're in an export flow, continue to step 2 (import)
        // Need to use setTimeout to ensure state is updated before proceeding
        global.setTimeout(() => {
          console.log('✅ [AUTOMATION] Starting import as part of export flow');
          importSchedule();
        }, 500);
      } else {
        // Regular extraction flow - show standard alert
        Alert.alert(
          'Data Extraction Complete! 🎉',
          'Successfully extracted schedule data:\n\n' +
            `• ${messageData.scheduleData?.totalRows || 0} rows of data\n` +
            `• ${messageData.scheduleData?.tableCount || 0} tables found\n\n` +
            'You can now import this schedule data.',
          [{ text: 'Great!' }],
        );
      }
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
      console.log('🔐 [AUTOMATION] Login Form 2 dump complete:', messageData.summary);
      setState(prev => ({
        ...prev,
        isAutomating: false,
        currentStep: null,
        error: null,
      }));
        
      const loginSummary = messageData.summary;
      Alert.alert(
        'Login Form 2 Analysis Complete! 🔐',
        'Successfully analyzed login form:\n\n' +
          `📍 URL: ${typeof (loginSummary?.url) === 'string' && (loginSummary.url).includes('bireport') ? '✅ Cognos BI page' : '❓ Other page'}\n` +
          `🔐 Is Login Form 2: ${messageData.isLoginForm2 ? '✅ Yes' : '❌ No'}\n` +
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
      console.log('❌ [AUTOMATION] Login Form 2 dump error:', messageData.error);
      setState(prev => ({
        ...prev,
        isAutomating: false,
        error: messageData.error ?? null,
        currentStep: null,
      }));
        
      Alert.alert(
        'Login Form 2 Analysis Failed ❌',
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
    case 'multi_week_test_complete': {
      console.log('✅ [AUTOMATION] Multi-week test complete:', messageData.summary);
      setState(prev => ({
        ...prev,
        isAutomating: false,
        currentStep: null,
        error: null,
      }));
      
      const summary = messageData.summary;
      if (summary && typeof summary === 'object') {
        const conclusiveResult = 'conclusiveResult' in summary ? summary.conclusiveResult : 'Test completed.';
        
        Alert.alert(
          'Multi-Week Test Complete! 🎉',
          'Automation test results:\n\n' +
            `• Weeks Processed: ${summary.weeksProcessed || 0} / ${summary.totalWeeksAvailable || 0}\n` +
            `• Success Rate: ${summary.successRate || '0%'}\n` +
            `• Test Duration: ${summary.testDuration || 'unknown'}\n` +
            `• Errors: ${summary.errorsEncountered || 0}\n\n` +
            conclusiveResult,
          [{ text: 'Great!' }],
        );
      } else {
        Alert.alert(
          'Multi-Week Test Complete',
          'Test completed but no detailed results available.',
          [{ text: 'OK' }],
        );
      }
      break;
    }
    case 'multi_week_test_error': {
      console.log('❌ [AUTOMATION] Multi-week test error:', messageData.error);
      setState(prev => ({
        ...prev,
        isAutomating: false,
        error: messageData.error ?? null,
        currentStep: null,
      }));
        
      Alert.alert(
        'Multi-Week Test Failed ❌',
        `Multi-week automation test failed:\n\n${messageData.error ?? 'Unknown error'}\n\n` +
          'This indicates the automation may not be able to handle Cognos ID changes reliably.',
        [{ text: 'OK' }],
      );
      break;
    }
    default:
      console.log('ℹ️ [AUTOMATION] Unhandled message type:', messageData.type);
    }
  }, [runReport, extractData, importSchedule]);

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