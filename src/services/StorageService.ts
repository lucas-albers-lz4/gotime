import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Crypto from 'expo-crypto';
import { UserCredentials, ScheduleEntry, AppSettings, WeeklySchedule } from '../types';
import { APP_CONFIG } from '../constants';

// Define database row types
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
  disclaimerText?: string; // Boilerplate text from schedule report
}

class StorageService {
  private db: SQLite.SQLiteDatabase | null = null;
  private isWeb = Platform.OS === 'web';

  /**
   * Generate a deterministic hash of the password for secure storage
   * This adds an extra layer of security beyond SecureStore/Keychain
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
      console.error('Password hashing failed:', error);
      throw new Error('Failed to hash password - credential storage not possible');
    }
  }

  /**
   * Verify a password against its stored hash
   */
  private async verifyPassword(password: string, hashedPassword: string, salt: string = 'gotime_salt_2025'): Promise<boolean> {
    try {
      const hash = await this.hashPassword(password, salt);
      return hash === hashedPassword;
    } catch (error) {
      console.warn('Password verification failed:', error);
      return false; // Fail secure - no fallback to plain text
    }
  }

  // Initialize the database
  async initializeDatabase(): Promise<void> {
    try {
      if (this.isWeb) {
        console.log('Web platform detected - using AsyncStorage fallback for schedules');
        return; // Skip SQLite initialization on web
      }

      this.db = await SQLite.openDatabaseAsync(APP_CONFIG.DB_NAME);
      
      // Create schedules table with updated schema for new data structure
      await this.db.execAsync(`
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
        
        CREATE INDEX IF NOT EXISTS idx_weekly_schedules_employee ON weekly_schedules(employeeId);
        CREATE INDEX IF NOT EXISTS idx_weekly_schedules_week ON weekly_schedules(weekStart, weekEnd);
        CREATE INDEX IF NOT EXISTS idx_weekly_schedules_synced ON weekly_schedules(syncedAt);
        
        -- Legacy schedules table - keep for backwards compatibility but mark as deprecated
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
      
      // Add disclaimerText column to existing tables (migration)
      try {
        await this.db.execAsync(`ALTER TABLE weekly_schedules ADD COLUMN disclaimerText TEXT;`);
        console.log('✅ [DATABASE] Added disclaimerText column to existing weekly_schedules table');
      } catch (error) {
        // Column might already exist, which is fine
        if (error && error.toString().includes('duplicate column name')) {
          console.log('ℹ️ [DATABASE] disclaimerText column already exists');
        } else {
          console.log('ℹ️ [DATABASE] Column addition skipped (expected for new databases)');
        }
      }
      
      console.log('Database initialized successfully with updated schema');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  // Secure credential storage
  async storeCredentials(credentials: UserCredentials): Promise<void> {
    try {
      // Hash the password for additional security layer
      const hashedPassword = await this.hashPassword(credentials.password);
      
      const encryptedData = JSON.stringify({
        employeeId: credentials.employeeId,
        password: hashedPassword,
        rememberMe: credentials.rememberMe,
        lastLogin: Date.now(),
      });
      
      if (this.isWeb) {
        // Use AsyncStorage on web (less secure but functional)
        await AsyncStorage.setItem(APP_CONFIG.STORAGE_KEYS.CREDENTIALS, encryptedData);
        console.warn('Web platform: Credentials stored in AsyncStorage (less secure than SecureStore)');
      } else {
        await SecureStore.setItemAsync(
          APP_CONFIG.STORAGE_KEYS.CREDENTIALS,
          encryptedData,
        );
        console.log('🔐 Credentials stored securely with SHA-256 password hashing');
      }
    } catch (error) {
      console.error('Failed to store credentials:', error);
      throw error;
    }
  }

  async getCredentials(): Promise<UserCredentials | null> {
    try {
      let encryptedData: string | null;
      
      if (this.isWeb) {
        encryptedData = await AsyncStorage.getItem(APP_CONFIG.STORAGE_KEYS.CREDENTIALS);
      } else {
        encryptedData = await SecureStore.getItemAsync(
          APP_CONFIG.STORAGE_KEYS.CREDENTIALS,
        );
      }
      
      if (!encryptedData) return null;
      
      const parsedData = JSON.parse(encryptedData);
      
      // Return credentials - all passwords are now required to be hashed
      return {
        employeeId: parsedData.employeeId,
        password: parsedData.password,
        rememberMe: parsedData.rememberMe,
        lastLogin: parsedData.lastLogin,
      } as UserCredentials & { lastLogin?: number };
      
    } catch (error) {
      console.error('Failed to retrieve credentials:', error);
      return null;
    }
  }

  /**
   * Verify stored credentials against provided password
   * All stored passwords are required to be hashed
   */
  async verifyStoredCredentials(employeeId: string, password: string): Promise<boolean> {
    try {
      const storedCredentials = await this.getCredentials();
      if (!storedCredentials || storedCredentials.employeeId !== employeeId) {
        return false;
      }

      // All stored passwords are hashed - verify against hash
      return await this.verifyPassword(password, storedCredentials.password);
    } catch (error) {
      console.error('Failed to verify stored credentials:', error);
      return false;
    }
  }

  async clearCredentials(): Promise<void> {
    try {
      if (this.isWeb) {
        await AsyncStorage.removeItem(APP_CONFIG.STORAGE_KEYS.CREDENTIALS);
      } else {
        await SecureStore.deleteItemAsync(APP_CONFIG.STORAGE_KEYS.CREDENTIALS);
      }
    } catch (error) {
      console.error('Failed to clear credentials:', error);
      throw error;
    }
  }

  // Schedule data management - Updated for new WeeklySchedule structure
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
            totalHours, straightTimeEarnings, scheduleData, disclaimerText, syncedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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