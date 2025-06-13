# Sync Schedule Automation Plan

## Overview
The "Sync Schedule" feature provides a one-click automation that combines all existing manual steps into a single streamlined process. This replaces the current multi-step workflow with an intelligent automation that handles the entire schedule synchronization process.

## Current Manual Process (to be automated)
1. User enters username/password in form
2. User clicks "Fill Login Credentials" 
3. **Conditional**: MFA prompt appears at `https://authenticator.pingone.com/pingid/ppm/auth`
   - User manually enters SMS code in WebView
4. User clicks "Fiori" to navigate to BI system
5. User clicks "Test Run" to execute schedule query
6. User clicks "Import All Schedules" to save data locally

## New Automated Process
**Single Button**: "Sync Schedule" (placed under "Sign In" button on LoginScreen)

### Prerequisites
- Username and password fields must be filled (same validation as "Sign In")
- WebView must be ready and available

### Automation Flow States

#### State 1: Credential Validation ⭕ → ✅
- **Action**: Validate username/password fields are filled
- **Success**: Proceed to State 2
- **Failure**: Show alert "Please enter username and password first"
- **Retry**: User must fix credentials manually

#### State 2: Fill Login Credentials ⭕ → ✅  
- **Action**: Execute existing `handleFillCredentials()` function
- **Success**: Proceed to State 3
- **Failure**: Show error, allow retry (up to 2 attempts)
- **Retry Strategy**: Can retry this step

#### State 3: MFA Detection & Handling ⭕ → ✅
- **Action**: Monitor WebView for navigation to `https://authenticator.pingone.com/pingid/ppm/auth`
- **Detection**: Look for MFA page HTML elements:
  - `<input id="otp" name="otp" type="text" class="passcode-input">`
  - Text: "Enter the passcode you received"
  - Form with id="otp-form"
- **Behavior**: 
  - **If MFA appears**: Pause automation, display message "Please enter SMS code in the form below"
  - **If no MFA**: Continue to State 4 immediately
  - **After MFA completion**: Auto-detect completion and proceed to State 4
- **Failure**: Timeout after 5 minutes → restart from State 1
- **Retry Strategy**: Must restart entire flow if MFA fails

#### State 4: Fiori Navigation ⭕ → ✅
- **Action**: Execute existing Fiori button click automation
- **Success**: Navigate to Employee Schedule page
- **Failure**: Show error, allow retry (up to 2 attempts)  
- **Retry Strategy**: Can retry this step

#### State 5: Test Run Execution ⭕ → ✅
- **Action**: Execute existing "Test Run" automation script
- **Success**: Schedule interface loads with data
- **Failure**: Show error, allow retry (up to 2 attempts)
- **Retry Strategy**: Can retry this step

#### State 6: Import All Schedules ⭕ → ✅
- **Action**: Execute existing `importAllSchedules()` function
- **Success**: All available schedules imported to local storage
- **Failure**: Show error, allow retry (up to 2 attempts)
- **Retry Strategy**: Can retry this step

#### State 7: Completion ✅
- **Action**: Show success message with import summary
- **Result**: User can now view schedules in Dashboard

## Progress Indicator Design

### Visual Design Pattern
- **Inactive State**: ⭕ Red circle with step name
- **Active State**: 🔄 Yellow circle with spinner + step name  
- **Success State**: ✅ Green checkmark with step name
- **Error State**: ❌ Red X with step name

### Progress Steps Display
```
Sync Schedule Progress:

⭕ 1. Validate Credentials
⭕ 2. Fill Login Form  
⭕ 3. Handle MFA (if required)
⭕ 4. Navigate to Schedule System
⭕ 5. Execute Schedule Query
⭕ 6. Import Schedule Data
⭕ 7. Complete Synchronization
```

### Progress State Examples
```
During Step 2:
✅ 1. Validate Credentials
🔄 2. Fill Login Form
⭕ 3. Handle MFA (if required)
⭕ 4. Navigate to Schedule System  
⭕ 5. Execute Schedule Query
⭕ 6. Import Schedule Data
⭕ 7. Complete Synchronization
```

```
MFA Required:
✅ 1. Validate Credentials
✅ 2. Fill Login Form
🔄 3. Handle MFA (if required) - Please enter SMS code below
⭕ 4. Navigate to Schedule System
⭕ 5. Execute Schedule Query  
⭕ 6. Import Schedule Data
⭕ 7. Complete Synchronization
```

## Error Handling & Retry Logic

### Retryable Errors (2 attempts max)
- **State 2**: Credential filling fails (form not found, fields not fillable)
- **State 4**: Fiori navigation fails (buttons not found, navigation timeout)  
- **State 5**: Test run fails (Cognos interface not ready, query timeout)
- **State 6**: Import fails (data extraction errors, storage errors)

### Non-Retryable Errors (restart required)
- **State 1**: No credentials provided
- **State 3**: MFA timeout (5 minutes)
- **State 3**: MFA authentication failure
- **Critical errors**: WebView becomes unresponsive, network connectivity lost

### Error Recovery Patterns
```
Retryable Error Flow:
Error Detected → Show Retry Dialog → "Retry" or "Cancel"
- Retry: Attempt same step again (max 2 times)  
- Cancel: Stop automation, return to manual mode

Non-Retryable Error Flow:  
Error Detected → Show Restart Dialog → "Start Over" or "Cancel"
- Start Over: Reset to State 1
- Cancel: Stop automation, return to manual mode
```

## Implementation Architecture

### State Management
```typescript
interface SyncScheduleState {
  isActive: boolean;
  currentStep: number; // 1-7
  stepStates: StepState[]; // Array of step status
  error: string | null;
  retryCount: number;
  canRetry: boolean;
}

type StepState = 'pending' | 'active' | 'success' | 'error';
```

### Core Functions Integration
- **State 2**: Reuse `handleFillCredentials()` from LoginScreen.tsx
- **State 4**: Reuse Fiori automation from existing button handler
- **State 5**: Reuse "Test Run" automation script  
- **State 6**: Reuse `importAllSchedules()` from useCognosAutomation.ts

### MFA Detection Strategy
```typescript
// Monitor WebView navigation and content
const detectMFAPage = (url: string, html: string): boolean => {
  return url.includes('authenticator.pingone.com/pingid/ppm/auth') &&
         html.includes('Enter the passcode you received') &&
         html.includes('id="otp"');
};

// Monitor for MFA completion
const detectMFACompletion = (url: string): boolean => {
  return !url.includes('authenticator.pingone.com/pingid/ppm/auth');
};
```

## Security Considerations

### Bot Detection Avoidance
- **MFA Handling**: Never intercept or auto-fill MFA codes
- **Timing**: Add realistic delays between steps (1-3 seconds)
- **User Interaction**: Require manual MFA input in WebView
- **Session Management**: Respect existing session timeouts

### Data Protection
- **Credentials**: Use existing secure storage mechanisms
- **Schedule Data**: Maintain existing encryption for stored schedules
- **Network Traffic**: All existing security headers and authentication

## Success Metrics

### Automation Success Criteria
1. **Completion Rate**: >90% of attempts reach State 7
2. **Error Recovery**: <10% require full restart due to non-retryable errors
3. **User Experience**: Average completion time <3 minutes (excluding MFA wait time)
4. **Data Integrity**: 100% of successfully imported schedules match source data

### Monitoring Points
- Step completion times for performance optimization
- Error frequency by step for reliability improvements
- User abandonment points for UX enhancements
- MFA timeout frequency for workflow optimization

## Future Enhancements

### Phase 2 Features
- **Smart Retry**: AI-powered error detection and recovery
- **Background Sync**: Scheduled automatic synchronization
- **Conflict Resolution**: Handle schedule conflicts intelligently
- **Batch Processing**: Multi-employee schedule management

### Integration Opportunities  
- **Push Notifications**: Schedule change alerts
- **Calendar Integration**: Export to device calendar
- **Shift Trading**: Integration with shift exchange systems
- **Analytics Dashboard**: Schedule pattern analysis

---

## Implementation Notes

This automation represents the capstone feature that ties together all individual automation components into a cohesive, user-friendly experience. The key to success is robust error handling, clear progress communication, and maintaining the security posture of the existing authentication flow.

The modular design allows for easy testing of individual steps while providing a seamless end-to-end experience for users. 