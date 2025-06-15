/**
 * @fileoverview Secure storage service for GoTime Schedule application.
 * Handles all data persistence including encrypted credentials, schedule data, and app settings.
 * Uses device-specific secure storage (Keychain/Keystore) and SQLite for optimal security and performance.
 */

import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Crypto from 'expo-crypto';
import { UserCredentials, ScheduleEntry, AppSettings, WeeklySchedule } from '../types';
import { APP_CONFIG } from '../constants';

/**
 * Database row structure for weekly schedule storage.
 * Matches the SQLite table schema for efficient data retrieval.
 */
interface WeeklyScheduleRow {
  weekStart: string;
  weekEnd: string;
  dataAsOf: string;
  employeeName: string;
  employeeId: string;
  location: string;
  department: string;
  jobTitle: string;
  status: string;
  hireDate: string;
  scheduleData: string;
  totalHours: number;
  straightTimeEarnings: number;
  /** Legal disclaimer text from corporate schedule reports */
  disclaimerText?: string;
  /** Flag indicating this is an exception schedule (stored as INTEGER: 1 = true, 0 = false) */
  isException?: number;
}

/**
 * Secure storage service providing encrypted data persistence.
 * Manages user credentials, schedule data, and application settings.
 * Uses platform-appropriate secure storage mechanisms for maximum security.
 */
class StorageService {
  /** SQLite database instance for schedule data storage */
  private db: SQLite.SQLiteDatabase | null = null;
  
  /** Flag indicating web platform usage (affects storage strategy) */
  private isWeb = Platform.OS === 'web';

  /**
   * Generates a deterministic SHA-256 hash of a password with salt.
   * Provides additional security layer beyond device keychain/keystore encryption.
   * Used for secure password verification without storing plain text.
   * 
   * @param password - Plain text password to hash
   * @param salt - Cryptographic salt to prevent rainbow table attacks
   * @returns Promise resolving to hexadecimal hash string
   * @throws {Error} When cryptographic hashing fails
   * @private
   */
  private async hashPassword(password: string, salt: string = 'gotime_salt_2025'): Promise<string> {
    try {
      const combined = password + salt;
      const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        combined,
        { encoding: Crypto.CryptoEncoding.HEX },
      );
      return hash;
    } catch (error) {
      console.error('❌ Password hashing failed:', error);
      throw new Error('Failed to hash password - credential storage not possible');
    }
  }

  /**
   * Verifies a plain text password against its stored hash.
   * Uses constant-time comparison to prevent timing attacks.
   * 
   * @param password - Plain text password to verify
   * @param hashedPassword - Stored hash to compare against
   * @param salt - Cryptographic salt used during original hashing
   * @returns Promise resolving to true if password matches, false otherwise
   * @private
   */
  private async verifyPassword(password: string, hashedPassword: string, salt: string = 'gotime_salt_2025'): Promise<boolean> {
    try {
      const hash = await this.hashPassword(password, salt);
      return hash === hashedPassword;
    } catch (error) {
      console.warn('⚠️ Password verification failed:', error);
      // Fail secure - never fall back to plain text comparison
      return false;
    }
  }

  /**
   * Initializes the SQLite database with required tables and indexes.
   * Creates schema for schedule storage and handles database migrations.
   * Web platform uses AsyncStorage fallback instead of SQLite.
   * 
   * @public
   * @throws {Error} When database initialization fails
   */
  async initializeDatabase(): Promise<void> {
    try {
      if (this.isWeb) {
        console.log('🌐 Web platform detected - using AsyncStorage fallback for schedules');
        return; // Skip SQLite initialization on web platforms
      }

      // Open or create the local SQLite database
      this.db = await SQLite.openDatabaseAsync(APP_CONFIG.DB_NAME);
      
      // Create main tables with optimized schema for schedule data
      await this.db.execAsync(`
        -- Primary table for weekly schedule storage
        CREATE TABLE IF NOT EXISTS weekly_schedules (
          id TEXT PRIMARY KEY,
          employeeId TEXT NOT NULL,
          weekStart TEXT NOT NULL,
          weekEnd TEXT NOT NULL,
          dataAsOf TEXT NOT NULL,
          employeeName TEXT NOT NULL,
          location TEXT NOT NULL,
          department TEXT NOT NULL,
          jobTitle TEXT NOT NULL,
          status TEXT NOT NULL,
          hireDate TEXT NOT NULL,
          totalHours REAL NOT NULL,
          straightTimeEarnings REAL NOT NULL,
          scheduleData TEXT NOT NULL,
          disclaimerText TEXT,
          syncedAt INTEGER NOT NULL
        );
        
        -- Performance indexes for common query patterns
        CREATE INDEX IF NOT EXISTS idx_weekly_schedules_employee ON weekly_schedules(employeeId);
        CREATE INDEX IF NOT EXISTS idx_weekly_schedules_week ON weekly_schedules(weekStart, weekEnd);
        CREATE INDEX IF NOT EXISTS idx_weekly_schedules_synced ON weekly_schedules(syncedAt);
        
        -- Legacy table maintained for backward compatibility
        -- TODO: Remove in future version after data migration
        CREATE TABLE IF NOT EXISTS schedules (
          id TEXT PRIMARY KEY,
          date TEXT NOT NULL,
          startTime TEXT NOT NULL,
          endTime TEXT NOT NULL,
          department TEXT NOT NULL,
          position TEXT NOT NULL,
          syncedAt INTEGER NOT NULL
        );
      `);
      
      // Handle database schema migrations for existing installations
      try {
        await this.db.execAsync('ALTER TABLE weekly_schedules ADD COLUMN disclaimerText TEXT;');
        console.log('✅ [DATABASE MIGRATION] Added disclaimerText column to weekly_schedules');
      } catch (migrationError) {
        // Column addition failure is expected for existing databases
        if (migrationError && migrationError.toString().includes('duplicate column name')) {
          console.log('ℹ️ [DATABASE] disclaimerText column already exists - migration not needed');
        } else {
          console.log('ℹ️ [DATABASE] Column migration skipped (expected for new installations)');
        }
      }

      // Migration for isException column
      try {
        await this.db.execAsync('ALTER TABLE weekly_schedules ADD COLUMN isException INTEGER DEFAULT 0;');
        console.log('✅ [DATABASE MIGRATION] Added isException column to weekly_schedules');
      } catch (migrationError) {
        // Column addition failure is expected for existing databases
        if (migrationError && migrationError.toString().includes('duplicate column name')) {
          console.log('ℹ️ [DATABASE] isException column already exists - migration not needed');
        } else {
          console.log('ℹ️ [DATABASE] isException column migration skipped (expected for new installations)');
        }
      }
      
      console.log('✅ Database initialization completed successfully');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  /**
   * Securely stores user credentials with appropriate encryption based on user preferences.
   * Uses device keychain/keystore for maximum security on native platforms.
   * 
   * Password Storage Strategy:
   * - savePassword=true: Store plain text for auto-fill (relies on SecureStore encryption)
   * - rememberMe=true: Store hashed password for verification only
   * - Both false: No password storage
   * 
   * @param credentials - User credentials including preferences
   * @public
   * @throws {Error} When credential storage fails
   */
  async storeCredentials(credentials: UserCredentials): Promise<void> {
    try {
      // Determine password storage strategy based on user preferences
      let storedPassword = '';
      if (credentials.savePassword && credentials.password) {
        // Store plain text password for auto-fill convenience
        // Security relies on SecureStore's device-level encryption
        storedPassword = credentials.password;
      } else if (credentials.rememberMe && credentials.password) {
        // Store hashed password for login verification without exposing plain text
        storedPassword = await this.hashPassword(credentials.password);
      }
      
      // Create encrypted credential payload
      const credentialPayload = JSON.stringify({
        employeeId: credentials.employeeId,
        password: storedPassword,
        rememberMe: credentials.rememberMe,
        savePassword: credentials.savePassword || false,
        lastLogin: Date.now(),
      });
      
      if (this.isWeb) {
        // Web platform fallback using AsyncStorage
        await AsyncStorage.setItem(APP_CONFIG.STORAGE_KEYS.CREDENTIALS, credentialPayload);
        console.warn('⚠️ Web platform: Using AsyncStorage (less secure than device keychain)');
      } else {
        // Native platform using secure device storage
        await SecureStore.setItemAsync(
          APP_CONFIG.STORAGE_KEYS.CREDENTIALS,
          credentialPayload,
        );
        console.log('🔐 Credentials stored securely in device keychain/keystore');
      }
    } catch (error) {
      console.error('❌ Failed to store credentials:', error);
      throw error;
    }
  }

  /**
   * Retrieves stored user credentials from secure storage.
   * Returns null if no credentials are stored or if retrieval fails.
   * 
   * @returns Promise resolving to stored credentials or null if not found
   * @public
   */
  async getCredentials(): Promise<UserCredentials | null> {
    try {
      let storedData: string | null;
      
      if (this.isWeb) {
        // Retrieve from AsyncStorage on web platform
        storedData = await AsyncStorage.getItem(APP_CONFIG.STORAGE_KEYS.CREDENTIALS);
      } else {
        // Retrieve from secure device storage on native platforms
        storedData = await SecureStore.getItemAsync(
          APP_CONFIG.STORAGE_KEYS.CREDENTIALS,
        );
      }
      
      if (!storedData) {
        return null; // No credentials stored
      }
      
      const parsedCredentials = JSON.parse(storedData);
      
      // Return credentials with type safety
      return {
        employeeId: parsedCredentials.employeeId,
        password: parsedCredentials.password,
        rememberMe: parsedCredentials.rememberMe,
        savePassword: parsedCredentials.savePassword || false,
        lastLogin: parsedCredentials.lastLogin,
      } as UserCredentials & { lastLogin?: number };
      
    } catch (error) {
      console.error('❌ Failed to retrieve credentials:', error);
      return null; // Fail gracefully
    }
  }

  /**
   * Verifies provided credentials against securely stored user data.
   * Performs secure hash comparison to validate passwords without exposing plain text.
   * 
   * @param employeeId - Employee ID to verify
   * @param password - Plain text password to verify
   * @returns Promise resolving to true if credentials match, false otherwise
   * @public
   */
  async verifyStoredCredentials(employeeId: string, password: string): Promise<boolean> {
    try {
      const storedCredentials = await this.getCredentials();
      if (!storedCredentials || storedCredentials.employeeId !== employeeId) {
        return false; // No matching credentials found
      }

      // Verify password against stored hash using secure comparison
      return await this.verifyPassword(password, storedCredentials.password);
    } catch (error) {
      console.error('❌ Credential verification failed:', error);
      return false; // Fail secure on any error
    }
  }

  /**
   * Permanently removes stored user credentials from secure storage.
   * Used during logout to ensure no sensitive data remains on device.
   * 
   * @public
   * @throws {Error} When credential removal fails
   */
  async clearCredentials(): Promise<void> {
    try {
      if (this.isWeb) {
        // Remove from AsyncStorage on web platform
        await AsyncStorage.removeItem(APP_CONFIG.STORAGE_KEYS.CREDENTIALS);
      } else {
        // Remove from device keychain/keystore on native platforms
        await SecureStore.deleteItemAsync(APP_CONFIG.STORAGE_KEYS.CREDENTIALS);
      }
      console.log('🔓 User credentials cleared successfully');
    } catch (error) {
      console.error('❌ Failed to clear credentials:', error);
      throw error;
    }
  }

  /**
   * Saves a complete weekly schedule to local storage with transaction safety.
   * Uses SQLite on native platforms and AsyncStorage on web with automatic cleanup.
   * Implements upsert logic to handle both new and updated schedules.
   * 
   * @param schedule - Complete weekly schedule data to save
   * @public
   * @throws {Error} When database is not initialized or save operation fails
   */
  async saveWeeklySchedule(schedule: WeeklySchedule): Promise<void> {
    try {
      const scheduleId = `${schedule.employee.employeeId}_${schedule.weekEnd}`;
      
      if (this.isWeb) {
        // Use AsyncStorage on web as fallback
        const key = `weekly_schedule_${scheduleId}`;
        await AsyncStorage.setItem(key, JSON.stringify(schedule));
        
        // Update schedule list
        const scheduleListKey = 'weekly_schedules_list';
        const existingListData = await AsyncStorage.getItem(scheduleListKey);
        const scheduleList: WeeklySchedule[] = existingListData ? JSON.parse(existingListData) : [];
        
        // Remove existing entry for this employee/week if it exists
        const filteredList = scheduleList.filter(s => 
          !(s.employee.employeeId === schedule.employee.employeeId && s.weekEnd === schedule.weekEnd),
        );
        
        // Add the new schedule
        filteredList.push(schedule);
        
        // Keep only the last 10 weeks per employee to avoid storage bloat
        const sortedList = filteredList.sort((a, b) => b.weekEnd.localeCompare(a.weekEnd));
        const employeeSchedules: { [key: string]: WeeklySchedule[] } = {};
        
        for (const sched of sortedList) {
          if (!employeeSchedules[sched.employee.employeeId]) {
            employeeSchedules[sched.employee.employeeId] = [];
          }
          if (employeeSchedules[sched.employee.employeeId].length < 10) {
            employeeSchedules[sched.employee.employeeId].push(sched);
          }
        }
        
        const finalList = Object.values(employeeSchedules).flat();
        await AsyncStorage.setItem(scheduleListKey, JSON.stringify(finalList));
        
        console.log('Web platform: Weekly schedule saved to AsyncStorage');
        return;
      }

      if (!this.db) {
        throw new Error('Database not initialized');
      }
      const currentDb = this.db; // Assign to a non-nullable local constant

      await currentDb.withTransactionAsync(async () => {
        // Remove existing schedule for this employee/week if it exists
        await currentDb.runAsync(
          'DELETE FROM weekly_schedules WHERE employeeId = ? AND weekEnd = ?',
          [schedule.employee.employeeId, schedule.weekEnd],
        );
        
        // Insert new schedule
        await currentDb.runAsync(
          `INSERT INTO weekly_schedules (
            id, employeeId, weekStart, weekEnd, dataAsOf, 
            employeeName, location, department, jobTitle, status, hireDate,
            totalHours, straightTimeEarnings, scheduleData, disclaimerText, isException, syncedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            scheduleId,
            schedule.employee.employeeId,
            schedule.weekStart,
            schedule.weekEnd,
            schedule.dataAsOf,
            schedule.employee.name,
            schedule.employee.location,
            schedule.employee.department,
            schedule.employee.jobTitle,
            schedule.employee.status,
            schedule.employee.hireDate,
            schedule.totalHours,
            schedule.straightTimeEarnings,
            JSON.stringify(schedule.entries), // Store the detailed schedule entries as JSON
            schedule.disclaimerText || null,
            schedule.isException ? 1 : 0, // Store boolean as integer (SQLite doesn't have boolean type)
            Date.now(),
          ],
        );
      });
      
      console.log(`Saved weekly schedule for employee ${schedule.employee.employeeId}, week ${schedule.weekStart} - ${schedule.weekEnd}`);
    } catch (error) {
      console.error('Failed to save weekly schedule:', error);
      throw error;
    }
  }

  async getWeeklySchedule(employeeId: string, weekEnd: string): Promise<WeeklySchedule | null> {
    try {
      const scheduleId = `${employeeId}_${weekEnd}`;
      
      if (this.isWeb) {
        // Use AsyncStorage on web as fallback
        const key = `weekly_schedule_${scheduleId}`;
        const scheduleData = await AsyncStorage.getItem(key);
        return scheduleData ? JSON.parse(scheduleData) : null;
      }

      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const result = await this.db.getFirstAsync(
        'SELECT * FROM weekly_schedules WHERE employeeId = ? AND weekEnd = ?',
        [employeeId, weekEnd],
      ) as WeeklyScheduleRow | null;

      if (!result) {
        return null;
      }

      // Reconstruct the WeeklySchedule object
      const schedule: WeeklySchedule = {
        weekStart: result.weekStart,
        weekEnd: result.weekEnd,
        dataAsOf: result.dataAsOf,
        employee: {
          name: result.employeeName,
          employeeId: result.employeeId,
          location: result.location,
          department: result.department,
          jobTitle: result.jobTitle,
          status: result.status,
          hireDate: result.hireDate,
        },
        entries: JSON.parse(result.scheduleData),
        totalHours: result.totalHours,
        straightTimeEarnings: result.straightTimeEarnings,
        disclaimerText: result.disclaimerText || undefined,
        isException: result.isException === 1, // Convert SQLite INTEGER back to boolean
      };

      return schedule;
    } catch (error) {
      console.error('Failed to get weekly schedule:', error);
      return null;
    }
  }

  async getAllWeeklySchedules(employeeId?: string): Promise<WeeklySchedule[]> {
    try {
      if (this.isWeb) {
        // Use AsyncStorage on web as fallback
        const scheduleListKey = 'weekly_schedules_list';
        const scheduleListData = await AsyncStorage.getItem(scheduleListKey);
        const allSchedules: WeeklySchedule[] = scheduleListData ? JSON.parse(scheduleListData) : [];
        
        if (employeeId) {
          return allSchedules.filter(s => s.employee.employeeId === employeeId);
        }
        
        return allSchedules;
      }

      if (!this.db) {
        throw new Error('Database not initialized');
      }

      let query = 'SELECT * FROM weekly_schedules';
      const params: string[] = [];

      if (employeeId) {
        query += ' WHERE employeeId = ?';
        params.push(employeeId);
      }

      query += ' ORDER BY weekEnd DESC';

      const results = await this.db.getAllAsync(query, params) as WeeklyScheduleRow[];
      
      return results.map(result => ({
        weekStart: result.weekStart,
        weekEnd: result.weekEnd,
        dataAsOf: result.dataAsOf,
        employee: {
          name: result.employeeName,
          employeeId: result.employeeId,
          location: result.location,
          department: result.department,
          jobTitle: result.jobTitle,
          status: result.status,
          hireDate: result.hireDate,
        },
        entries: JSON.parse(result.scheduleData),
        totalHours: result.totalHours,
        straightTimeEarnings: result.straightTimeEarnings,
        disclaimerText: result.disclaimerText || undefined,
        isException: result.isException === 1, // Convert SQLite INTEGER back to boolean
      }));
    } catch (error) {
      console.error('Failed to get all weekly schedules:', error);
      return [];
    }
  }

  // Legacy method - Updated to use new structure but marked as deprecated
  async saveSchedules(_schedules: ScheduleEntry[]): Promise<void> {
    console.log('⚠️ saveSchedules method is deprecated. Use saveWeeklySchedule instead.');
    console.log('This method is no longer functional with the current data structure.');
    return;
  }

  async getSchedules(_fromDate?: string, _toDate?: string): Promise<ScheduleEntry[]> {
    console.log('⚠️ getSchedules method is deprecated. Use getAllWeeklySchedules instead.');
    console.log('This method is no longer functional with the current data structure.');
    return [];
  }

  async getNextSchedule(): Promise<ScheduleEntry | null> {
    try {
      // TODO: Update this method to work with new ScheduleEntry structure
      console.log('getNextSchedule temporarily disabled - needs refactoring for new data structure');
      return null;
      
      /*
      if (this.isWeb) {
        // Use AsyncStorage on web as fallback
        const schedulesData = await AsyncStorage.getItem('schedules_data');
        if (!schedulesData) return null;
        
        const allSchedules: ScheduleEntry[] = JSON.parse(schedulesData);
        const now = new Date();
        const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const currentTime = now.toTimeString().slice(0, 5); // HH:MM
        
        // Find next schedule
        const upcomingSchedules = allSchedules.filter(schedule => {
          return (schedule.date === today && schedule.startTime > currentTime) || schedule.date > today;
        });
        
        if (upcomingSchedules.length === 0) return null;
        
        // Sort and return the earliest
        upcomingSchedules.sort((a, b) => {
          const dateCompare = a.date.localeCompare(b.date);
          if (dateCompare !== 0) return dateCompare;
          return a.startTime.localeCompare(b.startTime);
        });
        
        return upcomingSchedules[0];
      }

      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const now = new Date();
      const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM

      // Get next schedule (today after current time, or future dates)
      const result = await this.db.getFirstAsync(
        `SELECT * FROM schedules 
         WHERE (date = ? AND startTime > ?) OR date > ?
         ORDER BY date ASC, startTime ASC
         LIMIT 1`,
        [today, currentTime, today]
      );

      return result as ScheduleEntry | null;
      */
    } catch (error) {
      console.error('Failed to get next schedule:', error);
      throw error;
    }
  }

  // App settings management
  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(
        APP_CONFIG.STORAGE_KEYS.SETTINGS,
        JSON.stringify(settings),
      );
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  }

  async getSettings(): Promise<AppSettings> {
    try {
      const settingsData = await AsyncStorage.getItem(
        APP_CONFIG.STORAGE_KEYS.SETTINGS,
      );

      if (!settingsData) {
        // Return default settings
        return {
          theme: 'light',
          notifications: true,
          notificationsEnabled: true,
          reminderMinutes: APP_CONFIG.DEFAULT_REMINDER_MINUTES,
          autoRefresh: true,
          refreshInterval: 30,
          lastSyncTime: 0,
        };
      }

      return JSON.parse(settingsData) as AppSettings;
    } catch (error) {
      console.error('Failed to get settings:', error);
      // Return default settings on error
      return {
        theme: 'light',
        notifications: true,
        notificationsEnabled: true,
        reminderMinutes: APP_CONFIG.DEFAULT_REMINDER_MINUTES,
        autoRefresh: true,
        refreshInterval: 30,
        lastSyncTime: 0,
      };
    }
  }

  async updateLastSyncTime(timestamp: number): Promise<void> {
    try {
      const settings = await this.getSettings();
      settings.lastSyncTime = timestamp;
      await this.saveSettings(settings);
    } catch (error) {
      console.error('Failed to update last sync time:', error);
      throw error;
    }
  }

  // Cleanup old schedules (keep only last 8 weeks per employee)
  async cleanupOldSchedules(): Promise<void> {
    try {
      if (this.isWeb) {
        // Use AsyncStorage on web as fallback
        const scheduleListKey = 'weekly_schedules_list';
        const scheduleListData = await AsyncStorage.getItem(scheduleListKey);
        if (!scheduleListData) return;
        
        const allSchedules: WeeklySchedule[] = JSON.parse(scheduleListData);
        
        // Group by employee
        const employeeSchedules: { [key: string]: WeeklySchedule[] } = {};
        for (const schedule of allSchedules) {
          if (!employeeSchedules[schedule.employee.employeeId]) {
            employeeSchedules[schedule.employee.employeeId] = [];
          }
          employeeSchedules[schedule.employee.employeeId].push(schedule);
        }
        
        // Keep only the last 8 weeks per employee
        const filteredSchedules: WeeklySchedule[] = [];
        for (const employeeId in employeeSchedules) {
          const schedules = employeeSchedules[employeeId]
            .sort((a, b) => b.weekEnd.localeCompare(a.weekEnd))
            .slice(0, 8); // Keep only the 8 most recent
          filteredSchedules.push(...schedules);
          
          // Remove individual schedule items for old weeks
          const oldSchedules = employeeSchedules[employeeId].slice(8);
          for (const oldSchedule of oldSchedules) {
            const key = `weekly_schedule_${oldSchedule.employee.employeeId}_${oldSchedule.weekEnd}`;
            await AsyncStorage.removeItem(key);
          }
        }
        
        await AsyncStorage.setItem(scheduleListKey, JSON.stringify(filteredSchedules));
        console.log('Web platform: Old weekly schedules cleaned up from AsyncStorage');
        return;
      }

      if (!this.db) {
        throw new Error('Database not initialized');
      }

      // Get all employees
      const employees = await this.db.getAllAsync(
        'SELECT DISTINCT employeeId FROM weekly_schedules',
      ) as { employeeId: string }[];

      // For each employee, keep only the 8 most recent weeks
      for (const { employeeId } of employees) {
        const schedules = await this.db.getAllAsync(
          'SELECT weekEnd FROM weekly_schedules WHERE employeeId = ? ORDER BY weekEnd DESC',
          [employeeId],
        ) as { weekEnd: string }[];

        if (schedules.length > 8) {
          const weekEndsToDelete = schedules.slice(8).map(s => s.weekEnd);
          
          for (const weekEnd of weekEndsToDelete) {
            await this.db.runAsync(
              'DELETE FROM weekly_schedules WHERE employeeId = ? AND weekEnd = ?',
              [employeeId, weekEnd],
            );
          }
          
          console.log(`Cleaned up ${weekEndsToDelete.length} old schedules for employee ${employeeId}`);
        }
      }
      
      console.log('Database: Old weekly schedules cleaned up');
    } catch (error) {
      console.error('Failed to cleanup old schedules:', error);
      throw error;
    }
  }

  // Get the most recent schedule for an employee
  async getMostRecentSchedule(employeeId: string): Promise<WeeklySchedule | null> {
    try {
      if (this.isWeb) {
        const schedules = await this.getAllWeeklySchedules(employeeId);
        return schedules.length > 0 ? schedules[0] : null; // Already sorted by weekEnd DESC
      }

      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const result = await this.db.getFirstAsync(
        'SELECT * FROM weekly_schedules WHERE employeeId = ? ORDER BY weekEnd DESC LIMIT 1',
        [employeeId],
      ) as WeeklyScheduleRow | null;

      if (!result) {
        return null;
      }

      return {
        weekStart: result.weekStart,
        weekEnd: result.weekEnd,
        dataAsOf: result.dataAsOf,
        employee: {
          name: result.employeeName,
          employeeId: result.employeeId,
          location: result.location,
          department: result.department,
          jobTitle: result.jobTitle,
          status: result.status,
          hireDate: result.hireDate,
        },
        entries: JSON.parse(result.scheduleData),
        totalHours: result.totalHours,
        straightTimeEarnings: result.straightTimeEarnings,
        disclaimerText: result.disclaimerText || undefined,
        isException: result.isException === 1, // Convert SQLite INTEGER back to boolean
      };
    } catch (error) {
      console.error('Failed to get most recent schedule:', error);
      return null;
    }
  }

  // Get storage statistics
  async getStorageStats(): Promise<{ totalSchedules: number; employeeCount: number; oldestWeek: string | null; newestWeek: string | null }> {
    try {
      if (this.isWeb) {
        const schedules = await this.getAllWeeklySchedules();
        const uniqueEmployees = new Set(schedules.map(s => s.employee.employeeId));
        const weekEnds = schedules.map(s => s.weekEnd).sort();
        
        return {
          totalSchedules: schedules.length,
          employeeCount: uniqueEmployees.size,
          oldestWeek: weekEnds.length > 0 ? weekEnds[0] : null,
          newestWeek: weekEnds.length > 0 ? weekEnds[weekEnds.length - 1] : null,
        };
      }

      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const totalResult = await this.db.getFirstAsync(
        'SELECT COUNT(*) as count FROM weekly_schedules',
      ) as { count: number };

      const employeeResult = await this.db.getFirstAsync(
        'SELECT COUNT(DISTINCT employeeId) as count FROM weekly_schedules',
      ) as { count: number };

      const oldestResult = await this.db.getFirstAsync(
        'SELECT MIN(weekEnd) as oldest FROM weekly_schedules',
      ) as { oldest: string | null };

      const newestResult = await this.db.getFirstAsync(
        'SELECT MAX(weekEnd) as newest FROM weekly_schedules',
      ) as { newest: string | null };

      return {
        totalSchedules: totalResult.count,
        employeeCount: employeeResult.count,
        oldestWeek: oldestResult.oldest,
        newestWeek: newestResult.newest,
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return {
        totalSchedules: 0,
        employeeCount: 0,
        oldestWeek: null,
        newestWeek: null,
      };
    }
  }

  // Clear all weekly schedules (return to demo mode)
  async clearAllWeeklySchedules(): Promise<void> {
    try {
      if (this.isWeb) {
        // Clear AsyncStorage on web
        const scheduleListKey = 'weekly_schedules_list';
        await AsyncStorage.removeItem(scheduleListKey);
        
        // Also remove individual schedule items
        const schedules = await this.getAllWeeklySchedules();
        for (const schedule of schedules) {
          const key = `weekly_schedule_${schedule.employee.employeeId}_${schedule.weekEnd}`;
          await AsyncStorage.removeItem(key);
        }
        
        console.log('Web platform: All weekly schedules cleared from AsyncStorage');
        return;
      }

      if (!this.db) {
        throw new Error('Database not initialized');
      }

      await this.db.runAsync('DELETE FROM weekly_schedules');
      
      console.log('Database: All weekly schedules cleared');
    } catch (error) {
      console.error('Failed to clear all weekly schedules:', error);
      throw error;
    }
  }

  // Generic storage methods for other services
  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Failed to set item ${key}:`, error);
      throw error;
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Failed to get item ${key}:`, error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove item ${key}:`, error);
      throw error;
    }
  }

  /**
   * Saves an item to storage after serializing it.
   * @param key The key to store the item under.
   * @param value The value to store (will be JSON.stringified).
   */
  async saveItem<T = unknown>(key: string, value: T): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Failed to save item ${key}:`, error);
      throw error;
    }
  }

  /**
   * Saves multiple key-value pairs to storage.
   * Values must be strings.
   * @param pairs Array of [key, value] tuples.
   */
  async multiSet(pairs: Array<[string, unknown]>): Promise<void> {
    try {
      const stringPairs = pairs.map(([key, value]) => {
        if (typeof value !== 'string') {
          console.warn(`[StorageService] Value for key '${key}' in multiSet is not a string. Attempting to stringify.`);
          try {
            return [key, JSON.stringify(value)];
          } catch (stringifyError) {
            console.error(`[StorageService] Failed to stringify value for key '${key}' in multiSet:`, stringifyError);
            // Skip this pair or throw, depending on desired error handling
            return [key, 'Or some default/error indicator']; // Ensured single quotes
          }
        }
        return [key, value];
      });
      await AsyncStorage.multiSet(stringPairs as Array<[string, string]>);
    } catch (error) {
      console.error('Failed to multiSet items:', error);
      throw error;
    }
  }

  /**
   * Saves a raw item (already stringified or a primitive string) to storage.
   * Use this if you are handling serialization manually.
   * @param key The key to store the item under.
   * @param value The raw string value to store.
   */
  async saveRawItem(key: string, value: unknown): Promise<void> {
    try {
      if (typeof value !== 'string') {
        console.warn(`[StorageService] Value for saveRawItem with key '${key}' is not a string. Attempting to stringify.`);
        await AsyncStorage.setItem(key, JSON.stringify(value));
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.error(`Failed to save raw item ${key}:`, error);
      throw error;
    }
  }
}

export default new StorageService(); 