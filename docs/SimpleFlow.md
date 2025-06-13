Schedule Sync Flow Overview
The "Sync Schedule" automation combines 7 distinct steps into a single-click process:
Step 1: Credential Validation
Validates that username/password fields are filled
Shows error if credentials missing
Step 2: Fill Login Form
Executes the existing handleFillCredentials() function
Waits 5 seconds for form filling to complete
Step 3: MFA Detection & Handling
Monitors WebView for MFA page at authenticator.pingone.com
Detects MFA requirement and pauses automation
Manual intervention required: User must enter SMS code and click "Continue After MFA"
Step 4: Fiori Navigation
Executes Fiori automation script to navigate to the BI system
Auto-detects and fills login forms if present
Searches for "Online Employee Schedules" button
Includes retry logic (up to 3 attempts with 2-second delays)
Step 5: Execute Schedule Query
Navigates to IBM Cognos BI system
Auto-selects week from dropdown menu
Clicks "Run" button to execute the schedule query
Waits for schedule data to load
Step 6: Import Schedule Data
Extracts schedule data from Cognos HTML report
Parses the table structure
Converts raw data to WeeklySchedule format
Validates the data structure
Step 7: Save to Local Storage
Web platform: Saves to AsyncStorage
Native platforms: Saves to encrypted SQLite database
Updates schedule metadata for quick access
Key Features
Error Handling: Non-retryable errors stop automation, retryable errors allow up to 2 retry attempts
MFA Support: Pauses automation for manual SMS code entry
Platform Agnostic: Works on both web and native platforms with appropriate storage
Progress Tracking: Visual progress indicator shows current step status
Security: All data stored locally with encryption on native platforms
The diagram uses color coding:
Blue: Start action
Green: Successful completion
Red: Error/stopped states
Orange: Manual intervention required (MFA steps)
This automation replaces what was previously a 6-step manual process with intelligent retry logic and comprehensive error handling.