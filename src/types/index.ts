/**
 * @fileoverview Core data types for the GoTime Schedule application.
 * Defines all interfaces and types used throughout the app for employee schedule management,
 * authentication, and application settings.
 */

/**
 * User authentication credentials for corporate portal access.
 * Used for secure login to Employee Self Service (ESS) portals.
 */
export interface UserCredentials {
  /** Corporate employee ID used for authentication */
  employeeId: string;
  /** Employee password (stored securely using device keychain/keystore) */
  password: string;
  /** Whether to remember credentials between app sessions */
  rememberMe: boolean;
  /** Whether to save password for auto-fill (requires explicit user consent) */
  savePassword?: boolean;
}

/**
 * Corporate employee information retrieved from the portal.
 * Contains personal and employment details used for schedule context.
 */
export interface EmployeeInfo {
  /** Full employee name as displayed in corporate systems */
  name: string;
  /** Unique corporate employee identifier */
  employeeId: string;
  /** Work location (store number and name) */
  location: string;
  /** Employee's assigned department */
  department: string;
  /** Current job title/position */
  jobTitle: string;
  /** Employment status (PT = Part Time, FT = Full Time, etc.) */
  status: string;
  /** Employee hire date in MM/DD/YYYY format */
  hireDate: string;
}

/**
 * Individual work shift within a daily schedule.
 * Supports complex schedules including split shifts and department transfers.
 */
export interface ScheduleShift {
  /** Shift start time in 12-hour format (e.g., "08:00 AM") */
  startTime: string;
  /** Shift end time in 12-hour format (e.g., "04:30 PM") */
  endTime: string;
  /** Total hours for this shift (calculated from start/end times) */
  shiftHours: number;
  /** Alternative work location if different from employee's primary location */
  altLocation?: string;
  /** Alternative department/job assignment for this shift */
  altDeptJob?: string;
  /** Payroll code for special pay conditions (overtime, holiday, etc.) */
  payCode?: string;
  /** Timestamp when this shift was last modified in the system */
  changedOn?: string;
}

/**
 * Complete daily schedule entry containing all shifts for a single day.
 * Supports employees with multiple shifts per day (split shifts).
 */
export interface ScheduleEntry {
  /** Day of week (e.g., "Monday", "Tuesday") */
  day: string;
  /** Date in MM/DD/YYYY format */
  date: string;
  /** Array of all shifts scheduled for this day */
  shifts: ScheduleShift[];
  /** Total hours worked for this day (sum of all shifts) */
  dailyHours: number;
}

/**
 * Metadata for a weekly schedule, used for efficient storage and retrieval.
 * Contains summary information without the full schedule data.
 */
export interface ScheduleMetadata {
  /** Employee ID this schedule belongs to */
  employeeId: string;
  /** Week start date in YYYY-MM-DD format */
  weekStart: string;
  /** Week end date in YYYY-MM-DD format */
  weekEnd: string;
  /** Total hours scheduled for the week */
  totalHours: number;
  /** Timestamp when this schedule was saved locally */
  savedAt: number;
}

/**
 * Complete weekly schedule with employee information and all daily entries.
 * Primary data structure for schedule display and storage.
 */
export interface WeeklySchedule {
  /** Week start date in MM/DD/YYYY format */
  weekStart: string;
  /** Week end date in MM/DD/YYYY format */
  weekEnd: string;
  /** Timestamp when schedule data was last updated */
  dataAsOf: string;
  /** Employee information */
  employee: EmployeeInfo;
  /** Daily schedule entries for the week */
  entries: ScheduleEntry[];
  /** Total hours for the week */
  totalHours: number;
  /** Straight time earnings for the week */
  straightTimeEarnings: number;
  /** Disclaimer text from the schedule report */
  disclaimerText?: string;
  /** Flag indicating this is an exception schedule (e.g., payroll error) */
  isException?: boolean;
}

/**
 * Available week options for schedule selection in the corporate portal.
 * Used to populate week selection dropdowns and navigation.
 */
export interface ScheduleWeekOption {
  /** Internal value used by the corporate system */
  value: string;
  /** Human-readable date range for display */
  displayValue: string;
  /** Week ending date in YYYY-MM-DD format */
  endDate: string;
}

/**
 * Application settings and preferences.
 * Stored locally and synchronized across app sessions.
 */
export interface AppSettings {
  /** UI theme preference */
  theme: 'light' | 'dark';
  /** Legacy notifications flag (deprecated) */
  notifications: boolean;
  /** Whether push notifications are enabled */
  notificationsEnabled: boolean;
  /** Minutes before shift start to send reminder notification */
  reminderMinutes: number;
  /** Whether to automatically refresh schedules on app launch */
  autoRefresh: boolean;
  /** Interval in minutes for background schedule refresh */
  refreshInterval: number;
  /** Timestamp of last successful schedule synchronization */
  lastSyncTime?: number;
}

/**
 * Enhanced authentication error types for comprehensive error handling.
 * Covers all possible failure scenarios in corporate authentication flows.
 */
export type AuthErrorType = 
  | 'INVALID_CREDENTIALS'      // Username/password rejected
  | 'NETWORK_ERROR'            // Network connectivity issues
  | 'RATE_LIMITED'             // Too many requests, temporary block
  | 'CAPTCHA_REQUIRED'         // Security captcha challenge needed
  | 'SERVICE_MAINTENANCE'      // Corporate system under maintenance
  | 'SESSION_EXPIRED'          // Authentication session timeout
  | 'SAML_REQUIRED'            // SAML SSO authentication required
  | 'MFA_REQUIRED'             // Multi-factor authentication needed
  | 'SERVER_ERROR'             // Corporate server internal error
  | 'UNKNOWN_ERROR';           // Unhandled error condition

/**
 * Result of authentication attempt with detailed error information.
 * Provides comprehensive feedback for authentication flow handling.
 */
export interface AuthResult {
  /** Whether authentication was successful */
  success: boolean;
  /** Whether multi-factor authentication is required */
  requiresMFA?: boolean;
  /** Type of MFA required (SMS or email verification) */
  mfaMethod?: 'sms' | 'email';
  /** Human-readable error message for display */
  error?: string;
  /** Specific error type for programmatic handling */
  errorType?: AuthErrorType;
  /** Milliseconds to wait before retry attempt (for rate limiting) */
  retryAfter?: number;
  /** Session data for maintaining authentication state */
  sessionData?: Record<string, unknown>;
}

/**
 * Notification preferences and settings.
 * Controls how and when the app sends schedule reminders.
 */
export interface NotificationSettings {
  /** Whether notifications are enabled globally */
  enabled: boolean;
  /** Minutes before shift to send reminder */
  reminderMinutes: number;
  /** Whether to play notification sound */
  sound: boolean;
  /** Whether to vibrate device for notifications */
  vibration: boolean;
}

/**
 * Response from login attempt to corporate portal.
 * Simplified version of AuthResult for backward compatibility.
 */
export interface LoginResponse {
  /** Whether login was successful */
  success: boolean;
  /** Whether SMS verification is required */
  requiresSMS: boolean;
  /** Session token for maintaining authenticated state */
  sessionToken?: string;
  /** Error message if login failed */
  error?: string;
  /** Specific error type for error handling */
  errorType?: AuthErrorType;
  /** Milliseconds to wait before retry (for rate limiting) */
  retryAfter?: number;
}

/**
 * Result of schedule synchronization operation.
 * Provides feedback on sync success/failure and data retrieved.
 */
export interface SyncResult {
  /** Whether synchronization completed successfully */
  success: boolean;
  /** Number of schedule weeks successfully imported */
  scheduleCount: number;
  /** Timestamp when synchronization completed */
  lastSyncTime: number;
  /** Error message if synchronization failed */
  error?: string;
  /** Specific error type for programmatic handling */
  errorType?: AuthErrorType;
  /** Milliseconds to wait before retry attempt */
  retryAfter?: number;
} 