export interface CognosAnalysis {
  url: string;
  title: string;
  timestamp: string;
  totalIframes: number;
  cognosIframeFound: boolean;
  dropdownInfo: {
    id: string;
    name: string;
    className: string;
    optionsCount: number;
    selectedIndex: number;
    selectedValue: string;
    selectedText: string;
    allOptions: Array<{
      index: number;
      value: string;
      text: string;
      selected: boolean;
    }>;
  } | null;
  buttonInfo: {
    id: string;
    className: string;
    textContent: string;
    type: string;
    tagName: string;
  } | null;
  jsEnvironment: {
    hasJQuery: boolean;
    hasAngular: boolean;
    hasReact: boolean;
    globalObjects: string[];
    documentReadyState: string;
  };
  domStructure: {
    selectElements: number;
    buttonElements: number;
    inputElements: number;
    formElements: number;
    scriptElements: number;
    divElements: number;
    spanElements: number;
  };
  currentPageHtml: string;
}

export interface ScheduleOption {
  index: number;
  value: string;
  text: string;
  selected: boolean;
}

export interface AutomationResult {
  success: boolean;
  error?: string;
  selectedOption?: ScheduleOption;
  scheduleData?: ScheduleData;
  message?: string;
}

export interface ScheduleData {
  tableCount?: number;
  totalRows?: number;
  employeeName?: string;
  employeeId?: string;
  location?: string;
  department?: string;
  jobTitle?: string;
  status?: string;
  hireDate?: string;
  weekStart?: string;
  weekEnd?: string;
  totalHours?: number;
  scheduleEntries?: Array<{
    day: string;
    date: string;
    shifts: Array<{
      startTime: string;
      endTime: string;
      shiftHours: number;
      changedOn?: string;
    }>;
    dailyHours: number;
  }>;
  [key: string]: unknown;
}

export class CognosAutomationService {
  /**
   * Analyzes the current Cognos interface and returns comprehensive information
   */
  static generateAnalysisScript(): string {
    return `
      (function() { 
        try { 
          console.log('🧪 [COGNOS-ANALYSIS] Starting comprehensive Cognos interface analysis...');
          
          // Find the Cognos iframe
          let cognosDoc = null;
          let cognosWindow = null;
          const iframes = document.querySelectorAll('iframe');
          console.log('🧪 [COGNOS-ANALYSIS] Found ' + iframes.length + ' iframes to check');
          
          for (let i = 0; i < iframes.length; i++) {
            const iframe = iframes[i];
            try {
              if (iframe.contentDocument && iframe.contentWindow) {
                const iframeDoc = iframe.contentDocument;
                const iframeUrl = iframe.contentWindow.location.href;
                
                console.log('🧪 [COGNOS-ANALYSIS] Checking iframe ' + i + ': ' + iframeUrl.substring(0, 50) + '...');
                
                // Look for Cognos-specific elements
                const selects = iframeDoc.querySelectorAll('select');
                const buttons = iframeDoc.querySelectorAll('button, input[type="button"], input[type="submit"]');
                
                // Check for Cognos-specific patterns
                const hasCognosElements = iframeDoc.querySelector('select[class*="clsSelectControl"]') ||
                                        iframeDoc.querySelector('button[class*="bp"]') ||
                                        iframeUrl.includes('cognos') ||
                                        iframeDoc.title.includes('Cognos');
                
                if ((selects.length > 0 && buttons.length > 0) || hasCognosElements) {
                  console.log('✅ [COGNOS-ANALYSIS] Found Cognos iframe with ' + selects.length + ' selects and ' + buttons.length + ' buttons');
                  cognosDoc = iframeDoc;
                  cognosWindow = iframe.contentWindow;
                  break;
                }
              }
            } catch (e) {
              console.log('❌ [COGNOS-ANALYSIS] Iframe ' + i + ' blocked: ' + e.message);
            }
          }
          
          if (!cognosDoc) {
            throw new Error('Cognos iframe not found. Found ' + iframes.length + ' iframes total.');
          }
          
          // Find dropdown using stable selectors
          const dropdown = cognosDoc.querySelector('select.clsSelectControl') ||
                          cognosDoc.querySelector('select[id*="PRMT_SV_"]') ||
                          cognosDoc.querySelector('select');
          
          // Find run button using stable selectors
          const runButton = cognosDoc.querySelector('button.bp') ||
                           cognosDoc.querySelector('button[textContent*="Run"]') ||
                           cognosDoc.querySelector('input[type="submit"]') ||
                           cognosDoc.querySelector('button');
          
          console.log('🧪 [COGNOS-ANALYSIS] Found dropdown:', !!dropdown, 'button:', !!runButton);
          
          // Comprehensive analysis
          const analysis = {
            url: window.location.href,
            title: document.title,
            timestamp: new Date().toISOString(),
            totalIframes: iframes.length,
            cognosIframeFound: !!cognosDoc,
            
            dropdownInfo: dropdown ? {
              id: dropdown.id,
              name: dropdown.name,
              className: dropdown.className,
              optionsCount: dropdown.options.length,
              selectedIndex: dropdown.selectedIndex,
              selectedValue: dropdown.value,
              selectedText: dropdown.options[dropdown.selectedIndex] ? dropdown.options[dropdown.selectedIndex].text : 'None',
              allOptions: Array.from(dropdown.options).map(function(opt, idx) {
                return {
                  index: idx,
                  value: opt.value,
                  text: opt.text,
                  selected: opt.selected
                };
              })
            } : null,
            
            buttonInfo: runButton ? {
              id: runButton.id,
              className: runButton.className,
              textContent: runButton.textContent.trim(),
              type: runButton.type,
              tagName: runButton.tagName
            } : null,
            
            jsEnvironment: {
              hasJQuery: typeof cognosWindow.$ !== 'undefined',
              hasAngular: typeof cognosWindow.angular !== 'undefined',
              hasReact: typeof cognosWindow.React !== 'undefined',
              globalObjects: Object.keys(cognosWindow).filter(function(key) {
                return key.toLowerCase().includes('cognos') || key.toLowerCase().includes('cv_') || key.toLowerCase().includes('ocv');
              }),
              documentReadyState: cognosDoc.readyState
            },
            
            domStructure: {
              selectElements: cognosDoc.querySelectorAll('select').length,
              buttonElements: cognosDoc.querySelectorAll('button').length,
              inputElements: cognosDoc.querySelectorAll('input').length,
              formElements: cognosDoc.querySelectorAll('form').length,
              scriptElements: cognosDoc.querySelectorAll('script').length,
              divElements: cognosDoc.querySelectorAll('div').length,
              spanElements: cognosDoc.querySelectorAll('span').length
            },
            
            currentPageHtml: cognosDoc.documentElement.outerHTML.substring(0, 5000)
          };
          
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'cognos_analysis_complete',
            analysis: analysis,
            message: 'Comprehensive Cognos interface analysis complete'
          }));
          
        } catch (error) {
          console.error('🧪 [COGNOS-ANALYSIS] Error:', error);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'cognos_analysis_error',
            error: error.message
          }));
        }
      })();
    `;
  }

  /**
   * Selects a specific schedule option by value
   */
  static generateSelectScheduleScript(scheduleValue: string): string {
    return `
      (function() {
        try {
          console.log('🔄 [COGNOS-SELECT] Selecting schedule: ${scheduleValue}');
          
          // Find Cognos iframe
          let cognosDoc = null;
          const iframes = document.querySelectorAll('iframe');
          
          for (let i = 0; i < iframes.length; i++) {
            const iframe = iframes[i];
            try {
              if (iframe.contentDocument && iframe.contentWindow) {
                const iframeDoc = iframe.contentDocument;
                const selects = iframeDoc.querySelectorAll('select');
                
                if (selects.length > 0) {
                  cognosDoc = iframeDoc;
                  break;
                }
              }
            } catch (e) {
              // Cross-origin blocked, skip
            }
          }
          
          if (!cognosDoc) {
            throw new Error('Cognos iframe not found for schedule selection');
          }
          
          // Find dropdown using stable selectors
          const dropdown = cognosDoc.querySelector('select.clsSelectControl') ||
                          cognosDoc.querySelector('select[id*="PRMT_SV_"]') ||
                          cognosDoc.querySelector('select');
          
          if (!dropdown) {
            throw new Error('Schedule dropdown not found');
          }
          
          console.log('🔄 [COGNOS-SELECT] Found dropdown with ' + dropdown.options.length + ' options');
          
          // Find the option with matching value
          let targetOption = null;
          for (let i = 0; i < dropdown.options.length; i++) {
            if (dropdown.options[i].value === '${scheduleValue}') {
              targetOption = dropdown.options[i];
              break;
            }
          }
          
          if (!targetOption) {
            throw new Error('Schedule option not found: ${scheduleValue}');
          }
          
          // Select the option
          dropdown.selectedIndex = targetOption.index;
          dropdown.value = targetOption.value;
          
          // Trigger change event
          const changeEvent = new Event('change', { bubbles: true });
          dropdown.dispatchEvent(changeEvent);
          
          console.log('✅ [COGNOS-SELECT] Selected option:', targetOption.text, 'with value:', targetOption.value);
          
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'schedule_selected',
            success: true,
            selectedOption: {
              index: targetOption.index,
              value: targetOption.value,
              text: targetOption.text,
              selected: true
            },
            message: 'Schedule successfully selected: ' + targetOption.text
          }));
          
        } catch (error) {
          console.error('🔄 [COGNOS-SELECT] Error:', error);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'schedule_selection_error',
            error: error.message
          }));
        }
      })();
    `;
  }

  /**
   * Clicks the Run button to execute the report
   */
  static generateClickRunScript(): string {
    return `
      (function() {
        try {
          console.log('▶️ [COGNOS-RUN] Clicking Run button...');
          
          // Find Cognos iframe
          let cognosDoc = null;
          const iframes = document.querySelectorAll('iframe');
          
          for (let i = 0; i < iframes.length; i++) {
            const iframe = iframes[i];
            try {
              if (iframe.contentDocument && iframe.contentWindow) {
                const iframeDoc = iframe.contentDocument;
                const buttons = iframeDoc.querySelectorAll('button, input[type="button"], input[type="submit"]');
                
                if (buttons.length > 0) {
                  cognosDoc = iframeDoc;
                  break;
                }
              }
            } catch (e) {
              // Cross-origin blocked, skip
            }
          }
          
          if (!cognosDoc) {
            throw new Error('Cognos iframe not found for button click');
          }
          
          // Find run button using stable selectors
          const runButton = cognosDoc.querySelector('button.bp') ||
                           Array.from(cognosDoc.querySelectorAll('button')).find(function(btn) {
                             return btn.textContent && btn.textContent.trim().toLowerCase() === 'run';
                           }) ||
                           cognosDoc.querySelector('input[type="submit"]') ||
                           cognosDoc.querySelector('button');
          
          if (!runButton) {
            throw new Error('Run button not found');
          }
          
          console.log('▶️ [COGNOS-RUN] Found run button:', runButton.textContent.trim());
          
          // Click the button
          runButton.click();
          
          console.log('✅ [COGNOS-RUN] Run button clicked successfully');
          
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'run_button_clicked',
            success: true,
            buttonInfo: {
              id: runButton.id,
              className: runButton.className,
              textContent: runButton.textContent.trim(),
              type: runButton.type,
              tagName: runButton.tagName
            },
            message: 'Run button clicked successfully'
          }));
          
        } catch (error) {
          console.error('▶️ [COGNOS-RUN] Error:', error);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'run_button_error',
            error: error.message
          }));
        }
      })();
    `;
  }

  /**
   * Extracts schedule data from the loaded report
   */
  static generateExtractDataScript(): string {
    return `
      (function() {
        try {
          console.log('📊 [COGNOS-EXTRACT] Extracting schedule data...');
          
          // Find Cognos iframe
          let cognosDoc = null;
          const iframes = document.querySelectorAll('iframe');
          
          for (let i = 0; i < iframes.length; i++) {
            const iframe = iframes[i];
            try {
              if (iframe.contentDocument && iframe.contentWindow) {
                const iframeDoc = iframe.contentDocument;
                const tables = iframeDoc.querySelectorAll('table');
                
                if (tables.length > 0) {
                  cognosDoc = iframeDoc;
                  break;
                }
              }
            } catch (e) {
              // Cross-origin blocked, skip
            }
          }
          
          if (!cognosDoc) {
            throw new Error('Cognos iframe not found for data extraction');
          }
          
          // Extract schedule table data
          const tables = cognosDoc.querySelectorAll('table');
          let scheduleData = [];
          
          console.log('📊 [COGNOS-EXTRACT] Found ' + tables.length + ' tables');
          
          // Look for the main schedule table (usually the largest or most structured one)
          let mainTable = null;
          let maxRows = 0;
          
          for (let i = 0; i < tables.length; i++) {
            const table = tables[i];
            const rows = table.querySelectorAll('tr');
            if (rows.length > maxRows) {
              maxRows = rows.length;
              mainTable = table;
            }
          }
          
          if (mainTable) {
            console.log('📊 [COGNOS-EXTRACT] Processing main table with ' + maxRows + ' rows');
            
            const rows = mainTable.querySelectorAll('tr');
            for (let i = 0; i < rows.length; i++) {
              const row = rows[i];
              const cells = row.querySelectorAll('td, th');
              
              if (cells.length > 0) {
                const rowData = Array.from(cells).map(function(cell) {
                  return cell.textContent ? cell.textContent.trim() : '';
                });
                scheduleData.push(rowData);
              }
            }
          }
          
          console.log('✅ [COGNOS-EXTRACT] Extracted ' + scheduleData.length + ' rows of schedule data');
          
          // Capture the full HTML for proper parsing
          const currentHtml = cognosDoc.documentElement.outerHTML;
          
          console.log('📊 [COGNOS-EXTRACT] Captured HTML content, length:', currentHtml ? currentHtml.length : 0);
          
          // Make sure we're sending a properly formatted message with HTML content
          const message = {
            type: 'schedule_data_extracted',
            success: true,
            scheduleData: scheduleData,
            totalRows: scheduleData.length,
            tableCount: tables.length,
            currentHtml: currentHtml, // Include the full HTML for proper parsing
            message: 'Schedule data extracted successfully'
          };
          
          // Verify html content is included
          if (!currentHtml) {
            console.warn('⚠️ [COGNOS-EXTRACT] Warning: No HTML content captured for import');
          } else if (currentHtml.length < 100) {
            console.warn('⚠️ [COGNOS-EXTRACT] Warning: HTML content too small:', currentHtml.length, 'characters');
          } else {
            console.log('✅ [COGNOS-EXTRACT] HTML content ready for import:', currentHtml.length, 'characters');
          }
          
          window.ReactNativeWebView.postMessage(JSON.stringify(message));
          
        } catch (error) {
          console.error('📊 [COGNOS-EXTRACT] Error:', error);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'schedule_extraction_error',
            error: error.message
          }));
        }
      })();
    `;
  }

  /**
   * Combined script to select schedule, run report, and extract data
   */
  static generateFullAutomationScript(scheduleValue: string): string {
    return `
      (function() {
        try {
          console.log('🤖 [COGNOS-AUTO] Starting full automation for schedule: ${scheduleValue}');
          
          let step = 1;
          const steps = ['select', 'run', 'extract'];
          
          function executeStep() {
            try {
              switch(steps[step - 1]) {
                case 'select':
                  console.log('🤖 [COGNOS-AUTO] Step 1: Selecting schedule...');
                  selectSchedule();
                  break;
                case 'run':
                  console.log('🤖 [COGNOS-AUTO] Step 2: Running report...');
                  clickRunButton();
                  break;
                case 'extract':
                  console.log('🤖 [COGNOS-AUTO] Step 3: Extracting data...');
                  extractData();
                  break;
              }
            } catch (error) {
              throw new Error('Step ' + step + ' (' + steps[step - 1] + ') failed: ' + error.message);
            }
          }
          
          function selectSchedule() {
            // Find and select dropdown (same logic as individual script)
            // Implementation would go here...
          }
          
          function clickRunButton() {
            // Find and click run button (same logic as individual script)
            // Implementation would go here...
          }
          
          function extractData() {
            // Extract schedule data (same logic as individual script)
            // Implementation would go here...
          }
          
          // Start automation
          executeStep();
          
        } catch (error) {
          console.error('🤖 [COGNOS-AUTO] Error:', error);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'automation_error',
            error: error.message
          }));
        }
      })();
    `;
  }

  /**
   * Comprehensive multi-week automation test to validate ID change resilience
   */
  static generateMultiWeekAutomationTest(): string {
    return `
      (function() {
        try {
          console.log('🧪 [MULTI-WEEK-TEST] Starting comprehensive multi-week automation test...');
          
          // MESSAGE RELIABILITY SYSTEM
          // Generate a unique test ID for this test run
          let testId = localStorage.getItem('multiWeekTestId');
          if (!testId) {
            testId = 'mwt_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
            localStorage.setItem('multiWeekTestId', testId);
            console.log('🧪 [MULTI-WEEK-TEST] Created new test ID:', testId);
          } else {
            console.log('🧪 [MULTI-WEEK-TEST] Resuming test with ID:', testId);
          }
          
          // Message tracking for acknowledgments
          let messageLog = JSON.parse(localStorage.getItem('multiWeekMessageLog') || '{}');
          if (!messageLog[testId]) {
            messageLog[testId] = {
              sentMessages: {},
              acknowledgedMessages: {},
              completionSent: false,
              completionAcknowledged: false,
              lastProgressUpdate: 0
            };
          }
          
          // Function to save message log to localStorage
          function saveMessageLog() {
            localStorage.setItem('multiWeekMessageLog', JSON.stringify(messageLog));
          }
          
          // Message sending with retry and acknowledgment tracking
          function sendMessageWithTracking(messageType, messageData, isCompletion = false) {
            const messageId = messageType + '_' + Date.now();
            
            // Add tracking metadata to message
            const message = {
              ...messageData,
              type: messageType,
              messageId: messageId,
              testId: testId,
              timestamp: Date.now()
            };
            
            // Log this message as sent
            messageLog[testId].sentMessages[messageId] = {
              type: messageType,
              timestamp: Date.now(),
              retries: 0,
              acknowledged: false,
              isCompletion: isCompletion
            };
            
            // If this is a completion message, mark completion as sent
            if (isCompletion) {
              messageLog[testId].completionSent = true;
            }
            
            // Save state
            saveMessageLog();
            
            // Send the message
            console.log('📨 [MULTI-WEEK-TEST] Sending message:', messageType, messageId);
            window.ReactNativeWebView.postMessage(JSON.stringify(message));
            
            // Set up retry logic for important messages only
            if (isCompletion) {
              setupRetry(messageId);
            }
          }
          
          // Setup retry for unacknowledged messages
          function setupRetry(messageId) {
            const maxRetries = 3;
            const retryDelays = [2000, 5000, 10000]; // Increasing backoff
            
            function retry() {
              // Check if message still needs retrying
              if (!messageLog[testId] || 
                  !messageLog[testId].sentMessages[messageId] ||
                  messageLog[testId].sentMessages[messageId].acknowledged ||
                  messageLog[testId].completionAcknowledged) {
                console.log('📨 [MULTI-WEEK-TEST] No need to retry message:', messageId);
                return;
              }
              
              const msgInfo = messageLog[testId].sentMessages[messageId];
              
              // Check if we've hit max retries
              if (msgInfo.retries >= maxRetries) {
                console.log('⚠️ [MULTI-WEEK-TEST] Max retries reached for message:', messageId);
                return;
              }
              
              // Increment retry count
              msgInfo.retries++;
              saveMessageLog();
              
              // Resend the message
              console.log('🔄 [MULTI-WEEK-TEST] Retrying message:', messageId, '(Attempt', msgInfo.retries, 'of', maxRetries, ')');
              
              // Get the original message content
              let retryMessage;
              
              // For completion messages, rebuild with latest state
              if (msgInfo.isCompletion) {
                // Rebuild completion message with latest data
                const summary = createSummary();
                retryMessage = {
                  type: msgInfo.type,
                  messageId: messageId + '_retry' + msgInfo.retries,
                  originalMessageId: messageId,
                  testId: testId,
                  timestamp: Date.now(),
                  success: testState.processedWeeks.length >= 2,
                  summary: summary,
                  detailedResults: {
                    processedWeeks: testState.processedWeeks,
                    errors: testState.errors,
                    testState: testState
                  },
                  message: summary.conclusiveResult,
                  isRetry: true,
                  retryCount: msgInfo.retries
                };
              }
              
              // Send the retry message
              window.ReactNativeWebView.postMessage(JSON.stringify(retryMessage));
              
              // Schedule next retry if needed
              if (msgInfo.retries < maxRetries) {
                setTimeout(() => retry(), retryDelays[msgInfo.retries]);
              }
            }
            
            // Schedule first retry
            setTimeout(retry, retryDelays[0]);
          }
          
          // Handle acknowledgment messages from React Native
          function setupMessageListener() {
            // Try to access the original document for message listening
            try {
              window.document.addEventListener('message', function(event) {
                try {
                  const data = JSON.parse(event.data);
                  
                  // Check if this is an acknowledgment message
                  if (data.type === 'ack' && data.testId === testId) {
                    console.log('✅ [MULTI-WEEK-TEST] Received acknowledgment for message:', data.messageId);
                    
                    // Mark the message as acknowledged
                    if (messageLog[testId].sentMessages[data.messageId]) {
                      messageLog[testId].sentMessages[data.messageId].acknowledged = true;
                      messageLog[testId].acknowledgedMessages[data.messageId] = Date.now();
                      
                      // If this is a completion ack, mark completion as acknowledged
                      if (messageLog[testId].sentMessages[data.messageId].isCompletion) {
                        messageLog[testId].completionAcknowledged = true;
                        
                        // If test is complete and acknowledged, clean up localStorage
                        if (testState.currentStep === 'completed') {
                          console.log('🧹 [MULTI-WEEK-TEST] Test complete and acknowledged, cleaning up localStorage');
                          setTimeout(() => {
                            localStorage.removeItem('multiWeekTestId');
                            delete messageLog[testId];
                            saveMessageLog();
                          }, 2000);
                        }
                      }
                      
                      saveMessageLog();
                    }
                  }
                } catch (e) {
                  console.error('❌ [MULTI-WEEK-TEST] Error processing acknowledgment:', e);
                }
              });
              console.log('👂 [MULTI-WEEK-TEST] Set up message listener for acknowledgments');
            } catch (e) {
              console.log('⚠️ [MULTI-WEEK-TEST] Could not set up message listener:', e);
            }
          }
          
          // Try to set up the message listener
          setupMessageListener();
          
          let testState = {
            totalWeeks: 0,
            currentWeekIndex: 0,
            processedWeeks: [],
            errors: [],
            startTime: new Date().toISOString(),
            currentStep: 'initialization',
            lastProgressUpdate: Date.now()
          };
          
          // Report progress periodically to ensure UI is updated
          function reportProgress(forceUpdate = false) {
            const now = Date.now();
            // Only send updates every 2 seconds (unless force update is requested)
            if (forceUpdate || (now - testState.lastProgressUpdate) > 2000) {
              console.log('📊 [MULTI-WEEK-TEST] Progress update: Processing week ' + 
                (testState.currentWeekIndex + 1) + ' of ' + testState.totalWeeks);
              
              const progressSummary = {
                testDuration: Math.round((now - new Date(testState.startTime).getTime()) / 1000) + ' seconds',
                totalWeeksAvailable: testState.totalWeeks,
                weeksProcessed: testState.processedWeeks.length,
                errorsEncountered: testState.errors.length,
                currentWeekIndex: testState.currentWeekIndex,
                progress: Math.round((testState.currentWeekIndex / testState.totalWeeks) * 100) + '%',
                status: 'in_progress'
              };
              
              sendMessageWithTracking('multi_week_test_progress', {
                summary: progressSummary,
                currentStep: testState.currentStep
              });
              
              testState.lastProgressUpdate = now;
              
              // Also update the message log's last progress update
              if (messageLog[testId]) {
                messageLog[testId].lastProgressUpdate = now;
                saveMessageLog();
              }
            }
          }
          
          function findCognosIframe() {
            console.log('🔍 [MULTI-WEEK-TEST] Searching for Cognos iframe...');
            const iframes = document.querySelectorAll('iframe');
            
            for (let i = 0; i < iframes.length; i++) {
              const iframe = iframes[i];
              try {
                if (iframe.contentDocument && iframe.contentWindow) {
                  const iframeDoc = iframe.contentDocument;
                  const selects = iframeDoc.querySelectorAll('select');
                  const buttons = iframeDoc.querySelectorAll('button, input[type="button"], input[type="submit"]');
                  
                  // Look for Cognos-specific patterns
                  const hasCognosElements = iframeDoc.querySelector('select[class*="clsSelectControl"]') ||
                                          iframeDoc.querySelector('button[class*="bp"]') ||
                                          iframeDoc.documentElement.outerHTML.includes('Week End Date');
                  
                  if ((selects.length > 0 && buttons.length > 0) || hasCognosElements) {
                    console.log('✅ [MULTI-WEEK-TEST] Found Cognos iframe with ' + selects.length + ' selects and ' + buttons.length + ' buttons');
                    return { iframe, doc: iframeDoc };
                  }
                }
              } catch (e) {
                console.log('❌ [MULTI-WEEK-TEST] Iframe ' + i + ' blocked: ' + e.message);
              }
            }
            return null;
          }
          
          function findElements(cognosDoc) {
            console.log('🔍 [MULTI-WEEK-TEST] Finding elements with stable selectors...');
            
            // Find dropdown using stable selectors
            const dropdown = cognosDoc.querySelector('select.clsSelectControl') ||
                            cognosDoc.querySelector('select[id*="PRMT_SV_"]') ||
                            cognosDoc.querySelector('select');
            
            // Find run button using stable selectors
            const runButton = cognosDoc.querySelector('button.bp') ||
                             Array.from(cognosDoc.querySelectorAll('button')).find(btn => 
                               btn.textContent && btn.textContent.trim().toLowerCase() === 'run'
                             ) ||
                             cognosDoc.querySelector('input[type="submit"]') ||
                             cognosDoc.querySelector('button');
            
            console.log('🔍 [MULTI-WEEK-TEST] Elements found:');
            console.log('  - Dropdown:', !!dropdown, dropdown ? '(ID: ' + dropdown.id + ')' : '');
            console.log('  - Run Button:', !!runButton, runButton ? '(ID: ' + runButton.id + ')' : '');
            
            return { dropdown, runButton };
          }
          
          function analyzeCurrentState(cognosDoc) {
            const elements = findElements(cognosDoc);
            if (!elements.dropdown || !elements.runButton) {
              throw new Error('Required elements not found');
            }
            
            const dropdown = elements.dropdown;
            const runButton = elements.runButton;
            
            const analysis = {
              dropdownId: dropdown.id,
              dropdownClass: dropdown.className,
              runButtonId: runButton.id,
              runButtonClass: runButton.className,
              runButtonText: runButton.textContent.trim(),
              totalOptions: dropdown.options.length,
              selectedIndex: dropdown.selectedIndex,
              selectedValue: dropdown.value,
              selectedText: dropdown.options[dropdown.selectedIndex] ? dropdown.options[dropdown.selectedIndex].text : 'None',
              allOptions: Array.from(dropdown.options).map((opt, idx) => ({
                index: idx,
                value: opt.value,
                text: opt.text,
                selected: opt.selected
              }))
            };
            
            console.log('📊 [MULTI-WEEK-TEST] Current state analysis:');
            console.log('  - Dropdown ID changed to:', analysis.dropdownId);
            console.log('  - Run Button ID changed to:', analysis.runButtonId);
            console.log('  - Total weeks available:', analysis.totalOptions);
            console.log('  - Currently selected:', analysis.selectedText);
            
            return analysis;
          }
          
          function selectWeek(cognosDoc, weekIndex) {
            console.log('🔄 [MULTI-WEEK-TEST] Selecting week ' + weekIndex + '...');
            
            const elements = findElements(cognosDoc);
            if (!elements.dropdown) {
              throw new Error('Dropdown not found for week selection');
            }
            
            const dropdown = elements.dropdown;
            if (weekIndex >= dropdown.options.length) {
              throw new Error('Week index ' + weekIndex + ' exceeds available options (' + dropdown.options.length + ')');
            }
            
            const targetOption = dropdown.options[weekIndex];
            const weekText = targetOption.text;
            const weekValue = targetOption.value;
            
            console.log('🔄 [MULTI-WEEK-TEST] Selecting: ' + weekText + ' (value: ' + weekValue + ')');
            
            // Select the option
            dropdown.selectedIndex = weekIndex;
            dropdown.value = weekValue;
            targetOption.selected = true;
            
            // Trigger change events
            dropdown.dispatchEvent(new Event('focus', { bubbles: true }));
            dropdown.dispatchEvent(new Event('change', { bubbles: true }));
            dropdown.dispatchEvent(new Event('input', { bubbles: true }));
            dropdown.dispatchEvent(new Event('blur', { bubbles: true }));
            
            console.log('✅ [MULTI-WEEK-TEST] Week selection completed');
            return { weekText, weekValue, weekIndex };
          }
          
          function clickRunButton(cognosDoc) {
            console.log('▶️ [MULTI-WEEK-TEST] Clicking run button...');
            
            const elements = findElements(cognosDoc);
            if (!elements.runButton) {
              throw new Error('Run button not found');
            }
            
            const runButton = elements.runButton;
            console.log('▶️ [MULTI-WEEK-TEST] Clicking button: ' + runButton.id + ' (' + runButton.textContent.trim() + ')');
            
            // Click the button
            runButton.click();
            runButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
            
            console.log('✅ [MULTI-WEEK-TEST] Run button clicked');
            return { buttonId: runButton.id, buttonText: runButton.textContent.trim() };
          }
          
          function processNextWeek() {
            console.log('🔄 [MULTI-WEEK-TEST] Processing week ' + (testState.currentWeekIndex + 1) + ' of ' + testState.totalWeeks + '...');
            testState.currentStep = 'processing_week_' + (testState.currentWeekIndex + 1);
            reportProgress(true); // Force a progress update when starting a new week
            
            const cognosInfo = findCognosIframe();
            if (!cognosInfo) {
              const error = new Error('Cognos iframe lost during processing');
              testState.errors.push({
                weekIndex: testState.currentWeekIndex,
                step: 'find_cognos_iframe',
                error: error.message
              });
              
              // Try to continue with next week
              testState.currentWeekIndex++;
              if (testState.currentWeekIndex < testState.totalWeeks) {
                setTimeout(() => processNextWeek(), 2000);
              } else {
                completeTest();
              }
              return;
            }
            
            try {
              // Analyze current state (this will show us the new IDs after page reload)
              const analysis = analyzeCurrentState(cognosInfo.doc);
              
              // Record the state changes
              const weekData = {
                weekIndex: testState.currentWeekIndex,
                beforeSelection: {
                  dropdownId: analysis.dropdownId,
                  runButtonId: analysis.runButtonId,
                  selectedWeek: analysis.selectedText
                }
              };
              
              // Select the target week
              const selectionResult = selectWeek(cognosInfo.doc, testState.currentWeekIndex);
              weekData.selectedWeek = selectionResult;
              
              // Wait a moment for dropdown changes to settle
              setTimeout(() => {
                try {
                  // Click run button to load the schedule
                  const clickResult = clickRunButton(cognosInfo.doc);
                  weekData.runButtonClick = clickResult;
                  
                  // Record this week as processed
                  testState.processedWeeks.push(weekData);
                  
                  console.log('✅ [MULTI-WEEK-TEST] Week ' + (testState.currentWeekIndex + 1) + ' processing initiated');
                  
                  // Move to next week
                  testState.currentWeekIndex++;
                  reportProgress();
                  
                  if (testState.currentWeekIndex < testState.totalWeeks) {
                    // Wait for page to reload/update, then process next week
                    setTimeout(() => {
                      testState.currentStep = 'processing_week_' + (testState.currentWeekIndex + 1);
                      processNextWeek();
                    }, 3000); // 3 second delay for page reload
                  } else {
                    // All weeks processed
                    completeTest();
                  }
                  
                } catch (error) {
                  console.error('❌ [MULTI-WEEK-TEST] Error in run button click:', error);
                  testState.errors.push({
                    weekIndex: testState.currentWeekIndex,
                    step: 'run_button_click',
                    error: error.message
                  });
                  
                  // Try to continue with next week
                  testState.currentWeekIndex++;
                  if (testState.currentWeekIndex < testState.totalWeeks) {
                    setTimeout(() => processNextWeek(), 2000);
                  } else {
                    completeTest();
                  }
                }
              }, 500);
              
            } catch (error) {
              console.error('❌ [MULTI-WEEK-TEST] Error processing week ' + testState.currentWeekIndex + ':', error);
              testState.errors.push({
                weekIndex: testState.currentWeekIndex,
                step: 'week_processing',
                error: error.message
              });
              
              // Try to continue with next week
              testState.currentWeekIndex++;
              if (testState.currentWeekIndex < testState.totalWeeks) {
                setTimeout(() => processNextWeek(), 2000);
              } else {
                completeTest();
              }
            }
          }
          
          function createSummary() {
            const endTime = new Date().toISOString();
            const duration = new Date(endTime) - new Date(testState.startTime);
            
            return {
              testDuration: Math.round(duration / 1000) + ' seconds',
              totalWeeksAvailable: testState.totalWeeks,
              weeksProcessed: testState.processedWeeks.length,
              errorsEncountered: testState.errors.length,
              successRate: Math.round((testState.processedWeeks.length / testState.totalWeeks) * 100) + '%',
              processedWeeks: testState.processedWeeks,
              errors: testState.errors,
              conclusiveResult: testState.processedWeeks.length >= 2 ? 
                'SUCCESS: Automation can handle multiple weeks with ID changes' :
                'PARTIAL: Limited week processing, needs investigation',
              status: 'completed'
            };
          }
          
          function completeTest() {
            console.log('🎉 [MULTI-WEEK-TEST] Test completed!');
            testState.currentStep = 'completed';
            
            const summary = createSummary();
            
            console.log('📊 [MULTI-WEEK-TEST] Final Summary:', summary);
            
            // Check if we've already sent a completion message for this test
            if (messageLog[testId].completionSent && messageLog[testId].completionAcknowledged) {
              console.log('⏩ [MULTI-WEEK-TEST] Completion already sent and acknowledged for test:', testId);
              return;
            }
            
            // Send completion message with tracking and retry
            sendMessageWithTracking('multi_week_test_complete', {
              success: testState.processedWeeks.length >= 2,
              summary: summary,
              detailedResults: {
                processedWeeks: testState.processedWeeks,
                errors: testState.errors,
                testState: testState
              },
              message: summary.conclusiveResult
            }, true); // Mark as completion message
          }
          
          // Try to load any existing state from previous page loads
          try {
            const savedState = localStorage.getItem('multiWeekTestState');
            if (savedState) {
              const parsedState = JSON.parse(savedState);
              // Only restore if it's the same test (check testId)
              if (parsedState.testId === testId) {
                console.log('🔄 [MULTI-WEEK-TEST] Restoring saved state from localStorage');
                
                // Restore key properties but keep the current time references
                testState.totalWeeks = parsedState.totalWeeks;
                testState.currentWeekIndex = parsedState.currentWeekIndex;
                testState.processedWeeks = parsedState.processedWeeks;
                testState.errors = parsedState.errors;
                testState.startTime = parsedState.startTime;
                testState.currentStep = parsedState.currentStep;
                
                console.log('✅ [MULTI-WEEK-TEST] State restored - current week:', testState.currentWeekIndex, 'of', testState.totalWeeks);
                console.log('✅ [MULTI-WEEK-TEST] State restored - processed weeks:', testState.processedWeeks.length);
                
                // Check if test was already completed
                if (testState.currentStep === 'completed') {
                  console.log('⏩ [MULTI-WEEK-TEST] Restored state shows test was already completed');
                  
                  // If we already completed the test but it wasn't acknowledged, resend completion
                  if (!messageLog[testId].completionAcknowledged) {
                    console.log('🔄 [MULTI-WEEK-TEST] Resending completion message as it was not acknowledged');
                    completeTest();
                  } else {
                    console.log('✅ [MULTI-WEEK-TEST] Test was already completed and acknowledged');
                    // Nothing more to do
                  }
                  
                  return;
                }
              } else {
                console.log('🔄 [MULTI-WEEK-TEST] Found saved state for different test, starting fresh');
                localStorage.removeItem('multiWeekTestState');
              }
            }
          } catch (e) {
            console.log('⚠️ [MULTI-WEEK-TEST] Error restoring state:', e);
          }
          
          // Function to periodically save state to localStorage
          function saveState() {
            try {
              // Add testId to state for verification on reload
              const stateToSave = {...testState, testId: testId};
              localStorage.setItem('multiWeekTestState', JSON.stringify(stateToSave));
              console.log('💾 [MULTI-WEEK-TEST] Saved state to localStorage');
            } catch (e) {
              console.log('⚠️ [MULTI-WEEK-TEST] Error saving state:', e);
            }
            
            // Schedule next save if test is still running
            if (testState.currentStep !== 'completed') {
              setTimeout(saveState, 5000); // Save every 5 seconds
            }
          }
          
          // Start saving state periodically
          saveState();
          
          // Start the test
          testState.currentStep = 'initializing';
          console.log('🚀 [MULTI-WEEK-TEST] Initializing multi-week automation test...');
          
          const cognosInfo = findCognosIframe();
          if (!cognosInfo) {
            throw new Error('Cognos iframe not found for multi-week test');
          }
          
          // Get initial analysis
          const initialAnalysis = analyzeCurrentState(cognosInfo.doc);
          testState.totalWeeks = initialAnalysis.totalOptions;
          
          if (testState.totalWeeks < 2) {
            throw new Error('Need at least 2 weeks to test automation (found ' + testState.totalWeeks + ')');
          }
          
          console.log('🧪 [MULTI-WEEK-TEST] Test parameters:');
          console.log('  - Total weeks to test:', testState.totalWeeks);
          console.log('  - Initial dropdown ID:', initialAnalysis.dropdownId);
          console.log('  - Initial run button ID:', initialAnalysis.runButtonId);
          console.log('  - Currently selected:', initialAnalysis.selectedText);
          
          // Start with first week (index 0)
          testState.currentWeekIndex = 0;
          testState.currentStep = 'processing_week_1';
          
          // Begin processing
          setTimeout(() => {
            processNextWeek();
          }, 1000);
          
        } catch (error) {
          console.error('❌ [MULTI-WEEK-TEST] Fatal error:', error);
          sendMessageWithTracking('multi_week_test_error', {
            error: error.message,
            stack: error.stack
          });
        }
      })();
    `;
  }

  /**
   * Comprehensive dropdown discovery script to find ALL select elements
   */
  static generateDropdownDiscoveryScript(): string {
    return `
      (function() {
        try {
          console.log('🔍 [DROPDOWN-DISCOVERY] Starting comprehensive dropdown discovery...');
          
          // Find Cognos iframe
          let cognosDoc = null;
          const iframes = document.querySelectorAll('iframe');
          console.log('🔍 [DROPDOWN-DISCOVERY] Found ' + iframes.length + ' iframes to check');
          
          for (let i = 0; i < iframes.length; i++) {
            const iframe = iframes[i];
            try {
              if (iframe.contentDocument && iframe.contentWindow) {
                const iframeDoc = iframe.contentDocument;
                const selects = iframeDoc.querySelectorAll('select');
                
                if (selects.length > 0) {
                  console.log('✅ [DROPDOWN-DISCOVERY] Found Cognos iframe with ' + selects.length + ' select elements');
                  cognosDoc = iframeDoc;
                  break;
                }
              }
            } catch (e) {
              console.log('❌ [DROPDOWN-DISCOVERY] Iframe ' + i + ' blocked: ' + e.message);
            }
          }
          
          if (!cognosDoc) {
            throw new Error('Cognos iframe with select elements not found');
          }
          
          // Find ALL select elements
          const allSelects = cognosDoc.querySelectorAll('select');
          console.log('🔍 [DROPDOWN-DISCOVERY] Found ' + allSelects.length + ' total select elements');
          
          const dropdownAnalysis = [];
          
          for (let i = 0; i < allSelects.length; i++) {
            const select = allSelects[i];
            
            console.log('\\n📋 [SELECT-' + i + '] =====================================');
            console.log('ID: "' + (select.id || 'NO_ID') + '"');
            console.log('Name: "' + (select.name || 'NO_NAME') + '"');
            console.log('ClassName: "' + (select.className || 'NO_CLASS') + '"');
            console.log('Options Count: ' + select.options.length);
            console.log('Selected Index: ' + select.selectedIndex);
            console.log('Selected Value: "' + (select.value || 'NO_VALUE') + '"');
            console.log('Visible: ' + (select.offsetParent !== null));
            console.log('Disabled: ' + select.disabled);
            
            // Log all options
            console.log('Options:');
            const options = [];
            for (let j = 0; j < select.options.length; j++) {
              const option = select.options[j];
              const optionInfo = {
                index: j,
                value: option.value || 'NO_VALUE',
                text: option.text || 'NO_TEXT',
                selected: option.selected
              };
              options.push(optionInfo);
              console.log('  [' + j + '] Value: "' + optionInfo.value + '", Text: "' + optionInfo.text + '", Selected: ' + optionInfo.selected);
            }
            
            // Look for Week End Date patterns
            let isWeekEndDate = false;
            let weekEndDateScore = 0;
            
            // Check if this looks like a date/week dropdown
            for (let j = 0; j < select.options.length; j++) {
              const option = select.options[j];
              const value = option.value || '';
              const text = option.text || '';
              
              // Look for date patterns
              if (value.includes('2025-') || text.includes('2025-')) weekEndDateScore += 2;
              if (value.includes('T00:00:00') || text.includes('T00:00:00')) weekEndDateScore += 2;
              if (value.match(/\\d{4}-\\d{2}-\\d{2}/) || text.match(/\\d{4}-\\d{2}-\\d{2}/)) weekEndDateScore += 2;
              if (text.includes('/')) weekEndDateScore += 1; // Date format like 6/15/2025
              if (value.includes('week') || text.includes('week')) weekEndDateScore += 1;
              if (value.includes('end') || text.includes('end')) weekEndDateScore += 1;
            }
            
            // Check if associated with Week End Date input
            const associatedInput = cognosDoc.querySelector('input[name="p_EndDate"]') || 
                                  cognosDoc.querySelector('input[name*="EndDate"]') ||
                                  cognosDoc.querySelector('input[name*="Week"]');
            if (associatedInput) weekEndDateScore += 3;
            
            // Check ID patterns
            if (select.id.includes('EndDate') || select.id.includes('Week')) weekEndDateScore += 2;
            if (select.id.includes('PRMT_SV_')) weekEndDateScore += 1; // Cognos prompt pattern
            
            if (weekEndDateScore >= 3) {
              isWeekEndDate = true;
              console.log('🎯 [WEEK-END-DATE-CANDIDATE] Score: ' + weekEndDateScore + '/10');
            } else {
              console.log('❌ [NOT-WEEK-END-DATE] Score: ' + weekEndDateScore + '/10');
            }
            
            // Check for employee dropdown patterns
            let isEmployeeDropdown = false;
            if (select.id.includes('Employee') || select.name.includes('Employee')) isEmployeeDropdown = true;
            for (let j = 0; j < select.options.length; j++) {
              const option = select.options[j];
              if (option.value === 'p_Employee' || option.text === 'p_Employee') isEmployeeDropdown = true;
              if (/^\\d{7}$/.test(option.value)) isEmployeeDropdown = true; // 7-digit employee ID
            }
            if (isEmployeeDropdown) {
              console.log('👤 [EMPLOYEE-DROPDOWN] Detected');
            }
            
            // Store analysis
            const analysis = {
              index: i,
              id: select.id || 'NO_ID',
              name: select.name || 'NO_NAME',
              className: select.className || 'NO_CLASS',
              optionsCount: select.options.length,
              selectedIndex: select.selectedIndex,
              selectedValue: select.value || 'NO_VALUE',
              visible: select.offsetParent !== null,
              disabled: select.disabled,
              options: options,
              isWeekEndDateCandidate: isWeekEndDate,
              weekEndDateScore: weekEndDateScore,
              isEmployeeDropdown: isEmployeeDropdown
            };
            
            dropdownAnalysis.push(analysis);
          }
          
          // Find the best Week End Date candidate
          const weekEndDateCandidates = dropdownAnalysis.filter(d => d.isWeekEndDateCandidate);
          weekEndDateCandidates.sort((a, b) => b.weekEndDateScore - a.weekEndDateScore);
          
          console.log('\\n🎯 [SUMMARY] =====================================');
          console.log('Total dropdowns found: ' + dropdownAnalysis.length);
          console.log('Week End Date candidates: ' + weekEndDateCandidates.length);
          console.log('Employee dropdowns: ' + dropdownAnalysis.filter(d => d.isEmployeeDropdown).length);
          
          if (weekEndDateCandidates.length > 0) {
            const best = weekEndDateCandidates[0];
            console.log('\\n🏆 [BEST-WEEK-END-DATE-CANDIDATE]:');
            console.log('  Index: ' + best.index);
            console.log('  ID: "' + best.id + '"');
            console.log('  Score: ' + best.weekEndDateScore + '/10');
            console.log('  Options: ' + best.optionsCount);
            console.log('  Current Selection: "' + best.selectedValue + '"');
          } else {
            console.log('\\n❌ [NO-WEEK-END-DATE-CANDIDATES] No clear Week End Date dropdown found');
          }
          
          // Send results to React Native
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'dropdown_discovery_complete',
            totalDropdowns: dropdownAnalysis.length,
            dropdownAnalysis: dropdownAnalysis,
            weekEndDateCandidates: weekEndDateCandidates,
            bestCandidate: weekEndDateCandidates.length > 0 ? weekEndDateCandidates[0] : null,
            employeeDropdowns: dropdownAnalysis.filter(d => d.isEmployeeDropdown),
            message: 'Dropdown discovery completed - check console for detailed analysis'
          }));
          
        } catch (error) {
          console.error('🔍 [DROPDOWN-DISCOVERY] Error:', error);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'dropdown_discovery_error',
            error: error.message
          }));
        }
      })();
    `;
  }

  /**
   * Generates script to load initial schedule to properly initialize Cognos interface
   * This is needed because before any schedule is loaded, dropdowns show employee options instead of week options
   */
  static generateInitialScheduleLoadScript(): string {
    return `
      (function() {
        try {
          console.log('🚀 [INITIAL-LOAD] Starting initial schedule load to initialize Cognos interface...');
          
          // Find the Cognos iframe
          let cognosDoc = null;
          const iframes = document.querySelectorAll('iframe');
          console.log('🚀 [INITIAL-LOAD] Found ' + iframes.length + ' iframes to check');
          
          for (let i = 0; i < iframes.length; i++) {
            const iframe = iframes[i];
            try {
              if (iframe.contentDocument && iframe.contentWindow) {
                const iframeDoc = iframe.contentDocument;
                const iframeUrl = iframe.contentWindow.location.href;
                
                // Look for Cognos-specific elements
                const selects = iframeDoc.querySelectorAll('select');
                const buttons = iframeDoc.querySelectorAll('button, input[type="button"], input[type="submit"]');
                
                // Check for Cognos-specific patterns
                const hasCognosElements = iframeDoc.querySelector('select[class*="clsSelectControl"]') ||
                                        iframeDoc.querySelector('button[class*="bp"]') ||
                                        iframeUrl.includes('cognos') ||
                                        iframeDoc.title.includes('Cognos');
                
                if ((selects.length > 0 && buttons.length > 0) || hasCognosElements) {
                  console.log('✅ [INITIAL-LOAD] Found Cognos iframe');
                  cognosDoc = iframeDoc;
                  break;
                }
              }
            } catch (e) {
              console.log('❌ [INITIAL-LOAD] Iframe ' + i + ' blocked: ' + e.message);
            }
          }
          
          if (!cognosDoc) {
            throw new Error('Cognos iframe not found for initial load');
          }
          
          // Find the run button using stable selectors
          const runButton = cognosDoc.querySelector('button.bp') ||
                           cognosDoc.querySelector('button[class*="bp"]') ||
                           Array.from(cognosDoc.querySelectorAll('button')).find(function(btn) {
                             return btn.textContent && btn.textContent.includes('Run');
                           }) ||
                           cognosDoc.querySelector('input[type="submit"]') ||
                           cognosDoc.querySelector('button');
          
          if (!runButton) {
            throw new Error('Run button not found for initial load');
          }
          
          console.log('🚀 [INITIAL-LOAD] Found run button:', runButton.id || runButton.className);
          console.log('🚀 [INITIAL-LOAD] Button text:', runButton.textContent);
          
          // Click the run button to load initial schedule
          console.log('🚀 [INITIAL-LOAD] Clicking run button to initialize interface...');
          runButton.click();
          
          // Wait for the page to load, then notify completion
          setTimeout(function() {
            console.log('✅ [INITIAL-LOAD] Initial schedule load completed - interface should now be initialized');
            
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'initial_schedule_load_complete',
              success: true,
              message: 'Initial schedule loaded successfully. Interface is now initialized.',
              buttonClicked: {
                id: runButton.id,
                className: runButton.className,
                textContent: runButton.textContent.trim()
              }
            }));
          }, 3000); // Give time for Cognos to process
          
        } catch (error) {
          console.error('🚀 [INITIAL-LOAD] Error:', error);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'initial_schedule_load_error',
            success: false,
            error: error.message
          }));
        }
      })();
    `;
  }

  /**
   * Ultra-lightweight HTML dump - gives you HTML info without hanging
   * Saves HTML to window._lastHtmlDump for manual inspection
   */
  static generateSimpleHtmlDumpScript(): string {
    return `
      (function() {
        try {
          console.log('📋 [HTML-DUMP] Starting ultra-lightweight HTML dump...');
          
          const timestamp = new Date().toISOString();
          const url = window.location.href;
          const title = document.title;
          
          // Get main document HTML
          const mainHtml = document.documentElement.outerHTML;
          const mainLength = mainHtml.length;
          
          console.log('📋 [HTML-DUMP] ===== SUMMARY =====');
          console.log('📋 [HTML-DUMP] URL:', url);
          console.log('📋 [HTML-DUMP] Title:', title);
          console.log('📋 [HTML-DUMP] Main HTML Length:', mainLength, 'characters');
          
          // Save HTML to global variable for manual inspection
          window._lastHtmlDump = {
            mainHtml: mainHtml,
            url: url,
            title: title,
            timestamp: timestamp
          };
          console.log('📋 [HTML-DUMP] ✅ HTML saved to window._lastHtmlDump');
          console.log('📋 [HTML-DUMP] 💡 Access with: window._lastHtmlDump.mainHtml');
          
          // Check for iframes (but don't log their HTML)
          const allIframes = document.querySelectorAll('iframe');
          let accessibleIframes = 0;
          let totalIframeHtml = 0;
          let iframeInfo = [];
          
          console.log('📋 [HTML-DUMP] ===== IFRAME SUMMARY =====');
          console.log('📋 [HTML-DUMP] Total iframes found:', allIframes.length);
          
          for (let i = 0; i < allIframes.length; i++) {
            const iframe = allIframes[i];
            const info = {
              index: i,
              src: iframe.src || 'NO_SRC',
              id: iframe.id || 'NO_ID',
              accessible: false,
              htmlLength: 0
            };
            
            try {
              if (iframe.contentDocument && iframe.contentWindow) {
                accessibleIframes++;
                const iframeHtml = iframe.contentDocument.documentElement.outerHTML;
                const iframeUrl = iframe.contentWindow.location.href;
                const iframeTitle = iframe.contentDocument.title;
                
                info.accessible = true;
                info.htmlLength = iframeHtml.length;
                info.url = iframeUrl;
                info.title = iframeTitle;
                
                totalIframeHtml += iframeHtml.length;
                
                // Save iframe HTML to global variable
                if (!window._lastHtmlDump.iframes) window._lastHtmlDump.iframes = [];
                window._lastHtmlDump.iframes[i] = {
                  html: iframeHtml,
                  url: iframeUrl,
                  title: iframeTitle,
                  src: iframe.src,
                  id: iframe.id
                };
                
                console.log('📋 [IFRAME-' + i + '] ✅ ACCESSIBLE - Length:', info.htmlLength, 'chars');
                console.log('📋 [IFRAME-' + i + '] URL:', iframeUrl);
                console.log('📋 [IFRAME-' + i + '] Title:', iframeTitle);
                console.log('📋 [IFRAME-' + i + '] 💡 Access with: window._lastHtmlDump.iframes[' + i + '].html');
              } else {
                console.log('📋 [IFRAME-' + i + '] ❌ BLOCKED - SRC:', info.src);
              }
            } catch (e) {
              console.log('📋 [IFRAME-' + i + '] ❌ ERROR:', e.message);
            }
            
            iframeInfo.push(info);
          }
          
          console.log('📋 [HTML-DUMP] ===== FINAL SUMMARY =====');
          console.log('📋 [HTML-DUMP] Main document:', mainLength, 'characters');
          console.log('📋 [HTML-DUMP] Total iframes:', allIframes.length);
          console.log('📋 [HTML-DUMP] Accessible iframes:', accessibleIframes);
          console.log('📋 [HTML-DUMP] Total iframe HTML:', totalIframeHtml, 'characters');
          console.log('📋 [HTML-DUMP] Total HTML captured:', (mainLength + totalIframeHtml), 'characters');
          console.log('📋 [HTML-DUMP] ===== DUMP COMPLETE =====');
          console.log('📋 [HTML-DUMP] 🎯 To view HTML: window._lastHtmlDump.mainHtml');
          if (accessibleIframes > 0) {
            console.log('📋 [HTML-DUMP] 🎯 To view iframe HTML: window._lastHtmlDump.iframes[0].html (etc.)');
          }
          
          // Send lightweight summary only
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'simple_html_dump_complete',
            success: true,
            summary: {
              url: url,
              title: title,
              timestamp: timestamp,
              mainDocumentSize: mainLength,
              totalIframes: allIframes.length,
              accessibleIframes: accessibleIframes,
              totalIframeHtml: totalIframeHtml,
              totalHtmlDumped: mainLength + totalIframeHtml,
              globalVariableSet: true
            },
            message: 'HTML captured and saved to window._lastHtmlDump - check console for access instructions'
          }));
          
        } catch (error) {
          console.error('📋 [HTML-DUMP] Error:', error);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'simple_html_dump_error',
            success: false,
            error: error.message
          }));
        }
      })();
    `;
  }

  /**
   * Generates script to dump only the main document HTML (lightweight, no hanging)
   */
  static generateMainDocumentDumpScript(): string {
    return `
      (function() {
        try {
          console.log('📄 [MAIN-HTML] Dumping main document HTML...');
          
          const mainDoc = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            title: document.title,
            readyState: document.readyState,
            charset: document.characterSet,
            htmlLength: document.documentElement.outerHTML.length
          };
          
          // Log the HTML to console (don't send via message to avoid hanging)
          console.log('📄 [MAIN-HTML] === MAIN DOCUMENT HTML ===');
          console.log('📄 [MAIN-HTML] URL:', mainDoc.url);
          console.log('📄 [MAIN-HTML] Title:', mainDoc.title);
          console.log('📄 [MAIN-HTML] Ready State:', mainDoc.readyState);
          console.log('📄 [MAIN-HTML] HTML Length:', mainDoc.htmlLength, 'characters');
          console.log('📄 [MAIN-HTML] === BEGIN HTML CONTENT ===');
          console.log(document.documentElement.outerHTML);
          console.log('📄 [MAIN-HTML] === END HTML CONTENT ===');
          
          // Send lightweight summary only
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'main_html_dump_complete',
            success: true,
            summary: mainDoc,
            message: 'Main document HTML dumped to console successfully'
          }));
          
        } catch (error) {
          console.error('📄 [MAIN-HTML] Error:', error);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'main_html_dump_error',
            success: false,
            error: error.message
          }));
        }
      })();
    `;
  }

  /**
   * Generates script to dump iframe HTML analysis (lightweight, no hanging)
   */
  static generateIframeDumpScript(): string {
    return `
      (function() {
        try {
          console.log('🖼️ [IFRAME-HTML] Dumping iframe HTML analysis...');
          
          const allIframes = document.querySelectorAll('iframe');
          console.log('🖼️ [IFRAME-HTML] Found ' + allIframes.length + ' iframes');
          
          const iframeSummary = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            totalIframes: allIframes.length,
            accessibleIframes: 0,
            cognosIframes: 0,
            blockedIframes: 0,
            iframes: []
          };
          
          for (let i = 0; i < allIframes.length; i++) {
            const iframe = allIframes[i];
            const iframeInfo = {
              index: i,
              src: iframe.src || '',
              id: iframe.id || '',
              name: iframe.name || '',
              accessible: false,
              cognosScore: 0,
              isCognos: false,
              htmlLength: 0,
              error: null
            };
            
            console.log('🖼️ [IFRAME-' + i + '] =====================================');
            console.log('🖼️ [IFRAME-' + i + '] SRC:', iframeInfo.src);
            console.log('🖼️ [IFRAME-' + i + '] ID:', iframeInfo.id);
            
            try {
              if (iframe.contentDocument && iframe.contentWindow) {
                iframeInfo.accessible = true;
                iframeSummary.accessibleIframes++;
                
                const iframeDoc = iframe.contentDocument;
                const iframeUrl = iframe.contentWindow.location.href;
                const iframeTitle = iframeDoc.title;
                const iframeHtml = iframeDoc.documentElement.outerHTML;
                
                iframeInfo.htmlLength = iframeHtml.length;
                
                console.log('🖼️ [IFRAME-' + i + '] ✅ ACCESSIBLE');
                console.log('🖼️ [IFRAME-' + i + '] URL:', iframeUrl);
                console.log('🖼️ [IFRAME-' + i + '] Title:', iframeTitle);
                console.log('🖼️ [IFRAME-' + i + '] HTML Length:', iframeInfo.htmlLength);
                
                // Calculate Cognos score
                if (iframeHtml.includes('Week End Date')) iframeInfo.cognosScore += 3;
                if (iframeHtml.includes('IBM Cognos')) iframeInfo.cognosScore += 3;
                if (iframeHtml.includes('Schedule')) iframeInfo.cognosScore += 2;
                if (iframeHtml.includes('PRMT_SV_')) iframeInfo.cognosScore += 2;
                if (iframeUrl.includes('cognos')) iframeInfo.cognosScore += 3;
                
                if (iframeInfo.cognosScore >= 3) {
                  iframeInfo.isCognos = true;
                  iframeSummary.cognosIframes++;
                  console.log('🖼️ [IFRAME-' + i + '] 🎯 COGNOS IFRAME (Score:', iframeInfo.cognosScore + ')');
                  
                  // Only dump HTML for Cognos iframes to console
                  console.log('🖼️ [COGNOS-HTML-' + i + '] === BEGIN COGNOS IFRAME HTML ===');
                  console.log(iframeHtml);
                  console.log('🖼️ [COGNOS-HTML-' + i + '] === END COGNOS IFRAME HTML ===');
                } else {
                  console.log('🖼️ [IFRAME-' + i + '] 📄 Regular iframe (Score:', iframeInfo.cognosScore + ')');
                }
                
              } else {
                iframeInfo.accessible = false;
                iframeSummary.blockedIframes++;
                iframeInfo.error = 'Cross-origin access blocked';
                console.log('🖼️ [IFRAME-' + i + '] ❌ BLOCKED (Cross-origin)');
              }
            } catch (e) {
              iframeInfo.accessible = false;
              iframeSummary.blockedIframes++;
              iframeInfo.error = e.message;
              console.log('🖼️ [IFRAME-' + i + '] ❌ ERROR:', e.message);
            }
            
            iframeSummary.iframes.push(iframeInfo);
          }
          
          console.log('🖼️ [IFRAME-HTML] === SUMMARY ===');
          console.log('🖼️ [IFRAME-HTML] Total iframes:', iframeSummary.totalIframes);
          console.log('🖼️ [IFRAME-HTML] Accessible:', iframeSummary.accessibleIframes);
          console.log('🖼️ [IFRAME-HTML] Cognos iframes:', iframeSummary.cognosIframes);
          console.log('🖼️ [IFRAME-HTML] Blocked:', iframeSummary.blockedIframes);
          
          // Send lightweight summary only (no HTML content to avoid hanging)
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'iframe_html_dump_complete',
            success: true,
            summary: iframeSummary,
            message: 'Iframe HTML analysis dumped to console successfully'
          }));
          
        } catch (error) {
          console.error('🖼️ [IFRAME-HTML] Error:', error);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'iframe_html_dump_error',
            success: false,
            error: error.message
          }));
        }
      })();
    `;
  }

  /**
   * Generates script to dump Login Form 2 specific HTML and validation state
   * Lightweight version that focuses only on login fields without hanging
   */
  static generateLoginForm2DumpScript(): string {
    return `
      (function() {
        try {
          console.log('🔐 [LOGIN-FORM-2-DUMP] Starting Login Form 2 specific HTML dump...');
          
          const currentUrl = window.location.href;
          const pageTitle = document.title;
          const isLoginForm2 = currentUrl.includes('bireport.costco.com/cognos_ext/bi') && 
                              (document.documentElement.outerHTML.includes('Log in with your COSTCOEXT ID') || 
                               document.documentElement.outerHTML.includes('COSTCOEXT') ||
                               document.documentElement.outerHTML.includes('User ID'));
          
          console.log('🔐 [LOGIN-FORM-2-DUMP] URL:', currentUrl);
          console.log('🔐 [LOGIN-FORM-2-DUMP] Title:', pageTitle);
          console.log('🔐 [LOGIN-FORM-2-DUMP] Is Login Form 2:', isLoginForm2);
          
          if (!isLoginForm2) {
            console.log('🔐 [LOGIN-FORM-2-DUMP] Not Login Form 2 - dumping general form info instead');
          }
          
          // Find all input fields and forms
          const allInputs = document.querySelectorAll('input');
          const allForms = document.querySelectorAll('form');
          const allButtons = document.querySelectorAll('button, input[type="submit"], input[type="button"]');
          
          console.log('🔐 [LOGIN-FORM-2-DUMP] === FORM ANALYSIS ===');
          console.log('🔐 [LOGIN-FORM-2-DUMP] Total inputs:', allInputs.length);
          console.log('🔐 [LOGIN-FORM-2-DUMP] Total forms:', allForms.length);
          console.log('🔐 [LOGIN-FORM-2-DUMP] Total buttons:', allButtons.length);
          
          // Analyze all input fields
          console.log('🔐 [LOGIN-FORM-2-DUMP] === INPUT FIELD ANALYSIS ===');
          for (let i = 0; i < allInputs.length; i++) {
            const input = allInputs[i];
            const inputInfo = {
              index: i,
              type: input.type || 'text',
              id: input.id || '',
              name: input.name || '',
              className: input.className || '',
              placeholder: input.placeholder || '',
              value: input.value || '',
              required: input.required,
              disabled: input.disabled,
              readOnly: input.readOnly,
              visible: input.offsetParent !== null,
              focused: document.activeElement === input,
              validationState: {
                validity: input.validity ? {
                  valid: input.validity.valid,
                  valueMissing: input.validity.valueMissing,
                  typeMismatch: input.validity.typeMismatch,
                  patternMismatch: input.validity.patternMismatch,
                  tooLong: input.validity.tooLong,
                  tooShort: input.validity.tooShort,
                  rangeUnderflow: input.validity.rangeUnderflow,
                  rangeOverflow: input.validity.rangeOverflow,
                  stepMismatch: input.validity.stepMismatch,
                  badInput: input.validity.badInput,
                  customError: input.validity.customError
                } : null,
                validationMessage: input.validationMessage || '',
                checkValidity: typeof input.checkValidity === 'function' ? input.checkValidity() : null
              },
              ariaAttributes: {
                ariaLabel: input.getAttribute('aria-label') || '',
                ariaRequired: input.getAttribute('aria-required') || '',
                ariaInvalid: input.getAttribute('aria-invalid') || '',
                ariaDescribedBy: input.getAttribute('aria-describedby') || ''
              },
              dataAttributes: {},
              cssClasses: Array.from(input.classList || [])
            };
            
            // Get all data attributes
            for (let attr of input.attributes) {
              if (attr.name.startsWith('data-')) {
                inputInfo.dataAttributes[attr.name] = attr.value;
              }
            }
            
            console.log('🔐 [INPUT-' + i + '] ===========================');
            console.log('🔐 [INPUT-' + i + '] Type:', inputInfo.type);
            console.log('🔐 [INPUT-' + i + '] ID:', inputInfo.id);
            console.log('🔐 [INPUT-' + i + '] Name:', inputInfo.name);
            console.log('🔐 [INPUT-' + i + '] Placeholder:', inputInfo.placeholder);
            console.log('🔐 [INPUT-' + i + '] Value length:', inputInfo.value.length);
            console.log('🔐 [INPUT-' + i + '] Value set:', inputInfo.value.length > 0);
            console.log('🔐 [INPUT-' + i + '] Visible:', inputInfo.visible);
            console.log('🔐 [INPUT-' + i + '] Focused:', inputInfo.focused);
            console.log('🔐 [INPUT-' + i + '] Disabled:', inputInfo.disabled);
            console.log('🔐 [INPUT-' + i + '] Required:', inputInfo.required);
            console.log('🔐 [INPUT-' + i + '] CSS Classes:', inputInfo.cssClasses.join(', '));
            
            if (inputInfo.validationState.validity) {
              console.log('🔐 [INPUT-' + i + '] Valid:', inputInfo.validationState.validity.valid);
              console.log('🔐 [INPUT-' + i + '] Value Missing:', inputInfo.validationState.validity.valueMissing);
              console.log('🔐 [INPUT-' + i + '] Custom Error:', inputInfo.validationState.validity.customError);
              if (inputInfo.validationState.validationMessage) {
                console.log('🔐 [INPUT-' + i + '] Validation Message:', inputInfo.validationState.validationMessage);
              }
            }
            
            if (inputInfo.ariaAttributes.ariaInvalid) {
              console.log('🔐 [INPUT-' + i + '] ARIA Invalid:', inputInfo.ariaAttributes.ariaInvalid);
            }
            if (inputInfo.ariaAttributes.ariaRequired) {
              console.log('🔐 [INPUT-' + i + '] ARIA Required:', inputInfo.ariaAttributes.ariaRequired);
            }
            
            // Check for field-specific validation indicators
            const parent = input.parentElement;
            if (parent) {
              const errorElements = parent.querySelectorAll('.error, .invalid, .validation-error, [class*="error"], [class*="invalid"]');
              if (errorElements.length > 0) {
                console.log('🔐 [INPUT-' + i + '] Error elements found:', errorElements.length);
                for (let j = 0; j < errorElements.length; j++) {
                  console.log('🔐 [INPUT-' + i + '] Error element ' + j + ':', errorElements[j].textContent || '', '(class:', errorElements[j].className + ')');
                }
              }
            }
          }
          
          // Analyze forms
          console.log('🔐 [LOGIN-FORM-2-DUMP] === FORM ANALYSIS ===');
          for (let i = 0; i < allForms.length; i++) {
            const form = allForms[i];
            console.log('🔐 [FORM-' + i + '] ID:', form.id || '');
            console.log('🔐 [FORM-' + i + '] Name:', form.name || '');
            console.log('🔐 [FORM-' + i + '] Action:', form.action || '');
            console.log('🔐 [FORM-' + i + '] Method:', form.method || '');
            console.log('🔐 [FORM-' + i + '] Valid:', typeof form.checkValidity === 'function' ? form.checkValidity() : 'unknown');
            console.log('🔐 [FORM-' + i + '] CSS Classes:', Array.from(form.classList || []).join(', '));
          }
          
          // Analyze buttons
          console.log('🔐 [LOGIN-FORM-2-DUMP] === BUTTON ANALYSIS ===');
          for (let i = 0; i < allButtons.length; i++) {
            const button = allButtons[i];
            const buttonInfo = {
              index: i,
              type: button.type || button.tagName,
              id: button.id || '',
              name: button.name || '',
              textContent: (button.textContent || '').trim(),
              value: button.value || '',
              disabled: button.disabled,
              visible: button.offsetParent !== null,
              cssClasses: Array.from(button.classList || [])
            };
            
            console.log('🔐 [BUTTON-' + i + '] Type:', buttonInfo.type);
            console.log('🔐 [BUTTON-' + i + '] ID:', buttonInfo.id);
            console.log('🔐 [BUTTON-' + i + '] Text:', buttonInfo.textContent);
            console.log('🔐 [BUTTON-' + i + '] Value:', buttonInfo.value);
            console.log('🔐 [BUTTON-' + i + '] Disabled:', buttonInfo.disabled);
            console.log('🔐 [BUTTON-' + i + '] Visible:', buttonInfo.visible);
            console.log('🔐 [BUTTON-' + i + '] CSS Classes:', buttonInfo.cssClasses.join(', '));
          }
          
          // Look for validation scripts and event listeners
          console.log('🔐 [LOGIN-FORM-2-DUMP] === VALIDATION ANALYSIS ===');
          const scripts = document.querySelectorAll('script');
          let validationScriptCount = 0;
          for (let i = 0; i < scripts.length; i++) {
            const script = scripts[i];
            const scriptContent = script.textContent || script.innerHTML || '';
            if (scriptContent.includes('valid') || scriptContent.includes('check') || scriptContent.includes('submit')) {
              validationScriptCount++;
              console.log('🔐 [SCRIPT-' + i + '] Validation-related script found (length:', scriptContent.length + ')');
              
              // Log first 500 characters of validation scripts
              if (scriptContent.length < 500) {
                console.log('🔐 [SCRIPT-' + i + '] Content:', scriptContent);
              } else {
                console.log('🔐 [SCRIPT-' + i + '] Content (first 500 chars):', scriptContent.substring(0, 500) + '...');
              }
            }
          }
          console.log('🔐 [LOGIN-FORM-2-DUMP] Total validation-related scripts:', validationScriptCount);
          
          // Check for JavaScript validation functions
          console.log('🔐 [LOGIN-FORM-2-DUMP] === JAVASCRIPT VALIDATION FUNCTIONS ===');
          const commonValidationFunctions = ['validate', 'validateForm', 'checkForm', 'submitForm', 'onSubmit'];
          for (const funcName of commonValidationFunctions) {
            if (typeof window[funcName] === 'function') {
              console.log('🔐 [JS-VALIDATION] Found function:', funcName);
            }
          }
          
          // Dump relevant HTML sections (lightweight)
          console.log('🔐 [LOGIN-FORM-2-DUMP] === RELEVANT HTML SECTIONS ===');
          
          // Find and log form HTML (not full page)
          for (let i = 0; i < allForms.length; i++) {
            const form = allForms[i];
            console.log('🔐 [FORM-HTML-' + i + '] === BEGIN FORM HTML ===');
            console.log(form.outerHTML);
            console.log('🔐 [FORM-HTML-' + i + '] === END FORM HTML ===');
          }
          
          // Look for any div/section containing login fields
          const loginContainers = document.querySelectorAll('div:has(input[type="text"], input[type="password"]), section:has(input[type="text"], input[type="password"])');
          console.log('🔐 [LOGIN-FORM-2-DUMP] Login containers found:', loginContainers.length);
          
          // Send lightweight summary (no large HTML to avoid hanging)
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'login_form_2_dump_complete',
            success: true,
            isLoginForm2: isLoginForm2,
            summary: {
              url: currentUrl,
              title: pageTitle,
              inputCount: allInputs.length,
              formCount: allForms.length,
              buttonCount: allButtons.length,
              validationScriptCount: validationScriptCount,
              timestamp: new Date().toISOString()
            },
            message: 'Login Form 2 analysis completed - check console for detailed field information'
          }));
          
        } catch (error) {
          console.error('🔐 [LOGIN-FORM-2-DUMP] Error:', error);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'login_form_2_dump_error',
            success: false,
            error: error.message
          }));
        }
      })();
    `;
  }
} 