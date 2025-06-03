import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { CognosAutomationService, CognosAnalysis, ScheduleOption, AutomationResult } from './CognosAutomationService';

export interface AutomationState {
  isAnalyzing: boolean;
  isAutomating: boolean;
  currentStep: string | null;
  analysis: CognosAnalysis | null;
  availableSchedules: ScheduleOption[];
  error: string | null;
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
  resetState: () => void;
  handleWebViewMessage: (messageData: any) => void;
}

export function useCognosAutomation(webViewRef: React.RefObject<WebView | null>): CognosAutomationHook {
  const [state, setState] = useState<AutomationState>({
    isAnalyzing: false,
    isAutomating: false,
    currentStep: null,
    analysis: null,
    availableSchedules: [],
    error: null,
  });

  const resetState = useCallback(() => {
    setState({
      isAnalyzing: false,
      isAutomating: false,
      currentStep: null,
      analysis: null,
      availableSchedules: [],
      error: null,
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
      currentStep: 'Analyzing Cognos interface...'
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
        currentStep: null
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
      currentStep: 'Loading initial schedule to initialize interface...'
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
        currentStep: null
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
        currentStep: null
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
      currentStep: `Selecting schedule: ${scheduleValue}`
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
        currentStep: null
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
      currentStep: 'Running report...'
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
        currentStep: null
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
      const script = CognosAutomationService.generateExtractDataScript();
      webViewRef.current.injectJavaScript(script);
    } catch (error) {
      console.error('❌ [AUTOMATION] Error injecting extract script:', error);
      setState(prev => ({ 
        ...prev, 
        isAutomating: false, 
        error: 'Failed to inject extract script',
        currentStep: null
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
      currentStep: `Starting automation for: ${scheduleValue}`
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
        currentStep: null
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
      currentStep: 'Starting multi-week automation test...'
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
        currentStep: null
      }));
      Alert.alert('Error', 'Failed to inject multi-week test script');
    }
  }, [webViewRef]);

  // Handler for WebView messages - this should be called from the parent component
  const handleWebViewMessage = useCallback((messageData: any) => {
    console.log('🤖 [AUTOMATION] Received message:', messageData.type);

    switch (messageData.type) {
      case 'cognos_analysis_complete':
        console.log('✅ [AUTOMATION] Analysis complete:', messageData.analysis);
        setState(prev => ({
          ...prev,
          isAnalyzing: false,
          analysis: messageData.analysis,
          availableSchedules: messageData.analysis.dropdownInfo?.allOptions || [],
          currentStep: null,
          error: null
        }));
        
        Alert.alert(
          'Analysis Complete! ✅',
          `Found Cognos interface with ${messageData.analysis.dropdownInfo?.optionsCount || 0} schedule options.\n\n` +
          `Current selection: ${messageData.analysis.dropdownInfo?.selectedText || 'None'}\n\n` +
          `Available schedules ready for automation.`,
          [{ text: 'Great!' }]
        );
        break;

      case 'cognos_analysis_error':
        console.log('❌ [AUTOMATION] Analysis error:', messageData.error);
        setState(prev => ({
          ...prev,
          isAnalyzing: false,
          error: messageData.error,
          currentStep: null
        }));
        
        Alert.alert(
          'Analysis Failed ❌',
          `Could not analyze Cognos interface:\n\n${messageData.error}\n\n` +
          'Make sure you are on the correct Cognos page.',
          [{ text: 'OK' }]
        );
        break;

      case 'initial_schedule_load_complete':
        console.log('✅ [AUTOMATION] Initial schedule load complete:', messageData.buttonClicked);
        setState(prev => ({
          ...prev,
          isAutomating: false,
          currentStep: null,
          error: null
        }));
        
        Alert.alert(
          'Initial Load Complete! ✅',
          `Successfully loaded initial schedule to initialize Cognos interface.\n\n` +
          `Button clicked: ${messageData.buttonClicked?.textContent || 'Run'}\n\n` +
          'Now you can run "Analyze Cognos Interface" to see the proper week schedule options.',
          [{ text: 'Great!' }]
        );
        break;

      case 'initial_schedule_load_error':
        console.log('❌ [AUTOMATION] Initial schedule load error:', messageData.error);
        setState(prev => ({
          ...prev,
          isAutomating: false,
          error: messageData.error,
          currentStep: null
        }));
        
        Alert.alert(
          'Initial Load Failed ❌',
          `Could not load initial schedule:\n\n${messageData.error}\n\n` +
          'Make sure you are on the correct Cognos page.',
          [{ text: 'OK' }]
        );
        break;

      case 'schedule_selected':
        console.log('✅ [AUTOMATION] Schedule selected:', messageData.selectedOption);
        setState(prev => ({
          ...prev,
          currentStep: 'Schedule selected, running report...'
        }));
        
        // Auto-proceed to run report
        setTimeout(() => {
          runReport();
        }, 1000);
        break;

      case 'schedule_selection_error':
        console.log('❌ [AUTOMATION] Schedule selection error:', messageData.error);
        setState(prev => ({
          ...prev,
          isAutomating: false,
          error: messageData.error,
          currentStep: null
        }));
        
        Alert.alert(
          'Schedule Selection Failed ❌',
          `Could not select schedule:\n\n${messageData.error}`,
          [{ text: 'OK' }]
        );
        break;

      case 'run_button_clicked':
        console.log('✅ [AUTOMATION] Run button clicked');
        setState(prev => ({
          ...prev,
          currentStep: 'Report running, waiting for completion...'
        }));
        
        // Wait for page to reload, then extract data
        setTimeout(() => {
          extractData();
        }, 3000);
        break;

      case 'run_button_error':
        console.log('❌ [AUTOMATION] Run button error:', messageData.error);
        setState(prev => ({
          ...prev,
          isAutomating: false,
          error: messageData.error,
          currentStep: null
        }));
        
        Alert.alert(
          'Run Button Failed ❌',
          `Could not click run button:\n\n${messageData.error}`,
          [{ text: 'OK' }]
        );
        break;

      case 'schedule_data_extracted':
        console.log('✅ [AUTOMATION] Schedule data extracted:', messageData.scheduleData);
        setState(prev => ({
          ...prev,
          isAutomating: false,
          currentStep: null,
          error: null
        }));
        
        Alert.alert(
          'Automation Complete! 🎉',
          `Successfully extracted schedule data:\n\n` +
          `• ${messageData.totalRows} rows of data\n` +
          `• ${messageData.tableCount} tables found\n\n` +
          'Schedule data is ready for processing.',
          [{ text: 'Excellent!' }]
        );
        break;

      case 'schedule_extraction_error':
        console.log('❌ [AUTOMATION] Data extraction error:', messageData.error);
        setState(prev => ({
          ...prev,
          isAutomating: false,
          error: messageData.error,
          currentStep: null
        }));
        
        Alert.alert(
          'Data Extraction Failed ❌',
          `Could not extract schedule data:\n\n${messageData.error}`,
          [{ text: 'OK' }]
        );
        break;

      case 'html_dump_complete':
        console.log('📋 [AUTOMATION] HTML dump complete:', messageData.summary);
        setState(prev => ({
          ...prev,
          isAutomating: false,
          currentStep: null,
          error: null
        }));
        
        const summary = messageData.summary;
        Alert.alert(
          'HTML Dump Complete! 📋',
          `Successfully dumped HTML content:\n\n` +
          `📄 Total Iframes: ${summary.totalIframes}\n` +
          `✅ Accessible: ${summary.accessibleIframes}\n` +
          `🎯 Cognos Iframes: ${summary.cognosIframes}\n` +
          `❌ Blocked: ${summary.blockedIframes}\n\n` +
          `📏 Main Document: ${summary.mainDocumentSize} chars\n` +
          `📏 Total HTML: ${summary.totalHtmlSize} chars\n\n` +
          `Check console logs for detailed HTML content and iframe analysis.`,
          [{ text: 'Great!' }]
        );
        break;

      case 'html_dump_error':
        console.log('❌ [AUTOMATION] HTML dump error:', messageData.error);
        setState(prev => ({
          ...prev,
          isAutomating: false,
          error: messageData.error,
          currentStep: null
        }));
        
        Alert.alert(
          'HTML Dump Failed ❌',
          `Could not dump HTML content:\n\n${messageData.error}`,
          [{ text: 'OK' }]
        );
        break;

      case 'main_html_dump_complete':
        console.log('📄 [AUTOMATION] Main HTML dump complete:', messageData.summary);
        setState(prev => ({
          ...prev,
          isAutomating: false,
          currentStep: null,
          error: null
        }));
        
        const mainSummary = messageData.summary;
        Alert.alert(
          'Main HTML Dump Complete! 📄',
          `Successfully dumped main document HTML:\n\n` +
          `📍 URL: ${mainSummary.url}\n` +
          `📋 Title: ${mainSummary.title}\n` +
          `📏 HTML Length: ${mainSummary.htmlLength} chars\n` +
          `🔄 Ready State: ${mainSummary.readyState}\n\n` +
          `Check console logs for the complete HTML content.`,
          [{ text: 'Great!' }]
        );
        break;

      case 'main_html_dump_error':
        console.log('❌ [AUTOMATION] Main HTML dump error:', messageData.error);
        setState(prev => ({
          ...prev,
          isAutomating: false,
          error: messageData.error,
          currentStep: null
        }));
        
        Alert.alert(
          'Main HTML Dump Failed ❌',
          `Could not dump main HTML:\n\n${messageData.error}`,
          [{ text: 'OK' }]
        );
        break;

      case 'iframe_html_dump_complete':
        console.log('🖼️ [AUTOMATION] Iframe HTML dump complete:', messageData.summary);
        setState(prev => ({
          ...prev,
          isAutomating: false,
          currentStep: null,
          error: null
        }));
        
        const iframeSummary = messageData.summary;
        Alert.alert(
          'Iframe HTML Dump Complete! 🖼️',
          `Successfully dumped iframe HTML analysis:\n\n` +
          `📄 Total Iframes: ${iframeSummary.totalIframes}\n` +
          `✅ Accessible: ${iframeSummary.accessibleIframes}\n` +
          `🎯 Cognos Iframes: ${iframeSummary.cognosIframes}\n` +
          `❌ Blocked: ${iframeSummary.blockedIframes}\n\n` +
          `Check console logs for detailed iframe HTML content.`,
          [{ text: 'Great!' }]
        );
        break;

      case 'iframe_html_dump_error':
        console.log('❌ [AUTOMATION] Iframe HTML dump error:', messageData.error);
        setState(prev => ({
          ...prev,
          isAutomating: false,
          error: messageData.error,
          currentStep: null
        }));
        
        Alert.alert(
          'Iframe HTML Dump Failed ❌',
          `Could not dump iframe HTML:\n\n${messageData.error}`,
          [{ text: 'OK' }]
        );
        break;

      case 'login_form_2_dump_complete':
        console.log('🔐 [AUTOMATION] Login Form 2 dump complete:', messageData.summary);
        setState(prev => ({
          ...prev,
          isAutomating: false,
          currentStep: null,
          error: null
        }));
        
        const loginSummary = messageData.summary;
        Alert.alert(
          'Login Form 2 Analysis Complete! 🔐',
          `Successfully analyzed login form:\n\n` +
          `📍 URL: ${loginSummary.url.includes('bireport') ? '✅ Cognos BI page' : '❓ Other page'}\n` +
          `🔐 Is Login Form 2: ${messageData.isLoginForm2 ? '✅ Yes' : '❌ No'}\n` +
          `📝 Input Fields: ${loginSummary.inputCount}\n` +
          `📋 Forms: ${loginSummary.formCount}\n` +
          `🔘 Buttons: ${loginSummary.buttonCount}\n` +
          `📜 Validation Scripts: ${loginSummary.validationScriptCount}\n\n` +
          `Check console logs for detailed field validation states and HTML structure.`,
          [{ text: 'Great!' }]
        );
        break;

      case 'login_form_2_dump_error':
        console.log('❌ [AUTOMATION] Login Form 2 dump error:', messageData.error);
        setState(prev => ({
          ...prev,
          isAutomating: false,
          error: messageData.error,
          currentStep: null
        }));
        
        Alert.alert(
          'Login Form 2 Analysis Failed ❌',
          `Could not analyze login form:\n\n${messageData.error}`,
          [{ text: 'OK' }]
        );
        break;

      case 'simple_html_dump_complete':
        console.log('📋 [AUTOMATION] Simple HTML dump complete:', messageData.summary);
        setState(prev => ({
          ...prev,
          isAutomating: false,
          currentStep: null,
          error: null
        }));
        
        const htmlSummary = messageData.summary;
        Alert.alert(
          'HTML Dump Complete! 📋',
          `Successfully dumped all HTML content:\n\n` +
          `📍 URL: ${htmlSummary.url}\n` +
          `📄 Main Document: ${htmlSummary.mainDocumentSize} chars\n` +
          `🖼️ Total Iframes: ${htmlSummary.totalIframes}\n` +
          `✅ Accessible Iframes: ${htmlSummary.accessibleIframes}\n` +
          `📏 Total HTML: ${htmlSummary.totalHtmlDumped} chars\n\n` +
          `Check console logs for complete HTML content.`,
          [{ text: 'Great!' }]
        );
        break;

      case 'simple_html_dump_error':
        console.log('❌ [AUTOMATION] Simple HTML dump error:', messageData.error);
        setState(prev => ({
          ...prev,
          isAutomating: false,
          error: messageData.error,
          currentStep: null
        }));
        
        Alert.alert(
          'HTML Dump Failed ❌',
          `Could not dump HTML:\n\n${messageData.error}`,
          [{ text: 'OK' }]
        );
        break;

      case 'multi_week_test_complete':
        console.log('🎉 [AUTOMATION] Multi-week test completed:', messageData.summary);
        setState(prev => ({
          ...prev,
          isAutomating: false,
          currentStep: null,
          error: null
        }));
        
        const testSummary = messageData.summary;
        Alert.alert(
          messageData.success ? 'Multi-Week Test SUCCESS! 🎉' : 'Multi-Week Test Results 📊',
          `Test Duration: ${testSummary.testDuration}\n\n` +
          `📋 Weeks Available: ${testSummary.totalWeeksAvailable}\n` +
          `✅ Weeks Processed: ${testSummary.weeksProcessed}\n` +
          `❌ Errors: ${testSummary.errorsEncountered}\n` +
          `📈 Success Rate: ${testSummary.successRate}\n\n` +
          `🏆 Result: ${testSummary.conclusiveResult}\n\n` +
          `${messageData.success ? 
            'The automation successfully handled Cognos ID changes and can load multiple schedule weeks automatically!' : 
            'Review the console logs for detailed error information.'}`,
          [{ text: 'Excellent!' }]
        );
        break;

      case 'multi_week_test_error':
        console.log('❌ [AUTOMATION] Multi-week test error:', messageData.error);
        setState(prev => ({
          ...prev,
          isAutomating: false,
          error: messageData.error,
          currentStep: null
        }));
        
        Alert.alert(
          'Multi-Week Test Failed ❌',
          `Multi-week automation test failed:\n\n${messageData.error}\n\n` +
          'This indicates the automation may not be able to handle Cognos ID changes reliably.',
          [{ text: 'OK' }]
        );
        break;

      default:
        // Handle other message types or ignore
        break;
    }
  }, [runReport, extractData]);

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
    resetState,
    handleWebViewMessage,
  };
}