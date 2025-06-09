// Core data types for the GoTime Schedule App

export interface UserCredentials {
  employeeId: string;
  password: string;
  rememberMe: boolean;
  savePassword?: boolean;
}

export interface EmployeeInfo {
  name: string;
  employeeId: string;
  location: string;
  department: string;
  jobTitle: string;
  status: string; // PT, FT, etc.
  hireDate: string;
}

export interface ScheduleShift {
  startTime: string;
  endTime: string;
  shiftHours: number;
  altLocation?: string;
  altDeptJob?: string;
  payCode?: string;
  changedOn?: string;
}

export interface ScheduleEntry {
  day: string;
  date: string;
  shifts: ScheduleShift[];
  dailyHours: number;
}

export interface ScheduleMetadata {
  employeeId: string;
  weekStart: string;
  weekEnd: string;
  totalHours: number;
  savedAt: number;
}

export interface WeeklySchedule {
  weekStart: string;
  weekEnd: string;
  dataAsOf: string;
  employee: EmployeeInfo;
  entries: ScheduleEntry[];
  totalHours: number;
  straightTimeEarnings: number;
  disclaimerText?: string; // Boilerplate text from schedule report
}

export interface ScheduleWeekOption {
  value: string;
  displayValue: string;
  endDate: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
  notificationsEnabled: boolean;
  reminderMinutes: number;
  autoRefresh: boolean;
  refreshInterval: number;
  lastSyncTime?: number;
}

// Enhanced error types for rate limiting and server responses
export type AuthErrorType = 
  | 'INVALID_CREDENTIALS'
  | 'NETWORK_ERROR'
  | 'RATE_LIMITED'
  | 'CAPTCHA_REQUIRED'
  | 'SERVICE_MAINTENANCE'
  | 'SESSION_EXPIRED'
  | 'SAML_REQUIRED'
  | 'MFA_REQUIRED'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR';

export interface AuthResult {
  success: boolean;
  requiresMFA?: boolean;
  mfaMethod?: 'sms' | 'email';
  error?: string;
  errorType?: AuthErrorType;
  retryAfter?: number; // milliseconds to wait before retry
  sessionData?: Record<string, unknown>;
}

export interface NotificationSettings {
  enabled: boolean;
  reminderMinutes: number;
  sound: boolean;
  vibration: boolean;
}

export interface LoginResponse {
  success: boolean;
  requiresSMS: boolean;
  sessionToken?: string;
  error?: string;
  errorType?: AuthErrorType;
  retryAfter?: number;
}

export interface SyncResult {
  success: boolean;
  scheduleCount: number;
  lastSyncTime: number;
  error?: string;
  errorType?: AuthErrorType;
  retryAfter?: number;
} 