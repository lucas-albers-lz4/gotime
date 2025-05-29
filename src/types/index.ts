// Core data types for the GoTime Schedule App

export interface UserCredentials {
  employeeId: string;
  password: string;
  rememberMe: boolean;
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

export interface AuthResult {
  success: boolean;
  requiresMFA?: boolean;
  mfaMethod?: 'sms' | 'email';
  error?: string;
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
}

export interface SyncResult {
  success: boolean;
  scheduleCount: number;
  lastSyncTime: number;
  error?: string;
} 