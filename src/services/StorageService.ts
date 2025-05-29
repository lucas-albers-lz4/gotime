import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { UserCredentials, ScheduleEntry, AppSettings } from '../types';
import { APP_CONFIG } from '../constants';

class StorageService {
  private db: SQLite.SQLiteDatabase | null = null;
  private isWeb = Platform.OS === 'web';

  // Initialize the database
  async initializeDatabase(): Promise<void> {
    try {
      if (this.isWeb) {
        console.log('Web platform detected - using AsyncStorage fallback for schedules');
        return; // Skip SQLite initialization on web
      }

      this.db = await SQLite.openDatabaseAsync(APP_CONFIG.DB_NAME);
      
      // Create schedules table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS schedules (
          id TEXT PRIMARY KEY,
          date TEXT NOT NULL,
          startTime TEXT NOT NULL,
          endTime TEXT NOT NULL,
          department TEXT NOT NULL,
          position TEXT NOT NULL,
          syncedAt INTEGER NOT NULL
        );
        
        CREATE INDEX IF NOT EXISTS idx_schedules_date ON schedules(date);
        CREATE INDEX IF NOT EXISTS idx_schedules_synced ON schedules(syncedAt);
      `);
      
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  // Secure credential storage
  async storeCredentials(credentials: UserCredentials): Promise<void> {
    try {
      const encryptedData = JSON.stringify({
        ...credentials,
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
      
      return JSON.parse(encryptedData) as UserCredentials;
    } catch (error) {
      console.error('Failed to retrieve credentials:', error);
      return null;
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

  // Schedule data management
  async saveSchedules(_schedules: ScheduleEntry[]): Promise<void> {
    try {
      // TODO: Update this method to work with new ScheduleEntry structure
      console.log('saveSchedules temporarily disabled - needs refactoring for new data structure');
      return;
      
      /*
      if (this.isWeb) {
        // Use AsyncStorage on web as fallback
        await AsyncStorage.setItem('schedules_data', JSON.stringify(schedules));
        console.log('Web platform: Schedules saved to AsyncStorage');
        return;
      }

      if (!this.db) {
        throw new Error('Database not initialized');
      }

      await this.db.withTransactionAsync(async () => {
        // Clear existing schedules
        await this.db!.runAsync('DELETE FROM schedules');
        
        // Insert new schedules
        for (const schedule of schedules) {
          await this.db!.runAsync(
            'INSERT INTO schedules (id, date, startTime, endTime, department, position, syncedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [schedule.id, schedule.date, schedule.startTime, schedule.endTime, schedule.department, schedule.position, schedule.syncedAt]
          );
        }
      });
      */
    } catch (error) {
      console.error('Failed to save schedules:', error);
      throw error;
    }
  }

  async getSchedules(_fromDate?: string, _toDate?: string): Promise<ScheduleEntry[]> {
    try {
      // TODO: Update this method to work with new ScheduleEntry structure
      console.log('getSchedules temporarily disabled - needs refactoring for new data structure');
      return [];
      
      /*
      if (this.isWeb) {
        // Use AsyncStorage on web as fallback
        const schedulesData = await AsyncStorage.getItem('schedules_data');
        if (!schedulesData) return [];
        
        const allSchedules: ScheduleEntry[] = JSON.parse(schedulesData);
        
        // Filter by date range if provided
        let filteredSchedules = allSchedules;
        if (_fromDate && _toDate) {
          filteredSchedules = allSchedules.filter(s => s.date >= _fromDate && s.date <= _toDate);
        } else if (_fromDate) {
          filteredSchedules = allSchedules.filter(s => s.date >= _fromDate);
        }
        
        // Sort by date and time
        return filteredSchedules.sort((a, b) => {
          const dateCompare = a.date.localeCompare(b.date);
          if (dateCompare !== 0) return dateCompare;
          return a.startTime.localeCompare(b.startTime);
        });
      }

      if (!this.db) {
        throw new Error('Database not initialized');
      }

      let query = 'SELECT * FROM schedules';
      const params: string[] = [];

      if (_fromDate && _toDate) {
        query += ' WHERE date BETWEEN ? AND ?';
        params.push(_fromDate, _toDate);
      } else if (_fromDate) {
        query += ' WHERE date >= ?';
        params.push(_fromDate);
      }

      query += ' ORDER BY date ASC, startTime ASC';

      const result = await this.db.getAllAsync(query, params);
      return result as ScheduleEntry[];
      */
    } catch (error) {
      console.error('Failed to get schedules:', error);
      throw error;
    }
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

  // Cleanup old schedules (keep only last 3 weeks)
  async cleanupOldSchedules(): Promise<void> {
    try {
      const threeWeeksAgo = new Date();
      threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);
      const cutoffDate = threeWeeksAgo.toISOString().split('T')[0];

      if (this.isWeb) {
        // Use AsyncStorage on web as fallback
        const schedulesData = await AsyncStorage.getItem('schedules_data');
        if (!schedulesData) return;
        
        const allSchedules: ScheduleEntry[] = JSON.parse(schedulesData);
        const filteredSchedules = allSchedules.filter(schedule => schedule.date >= cutoffDate);
        
        await AsyncStorage.setItem('schedules_data', JSON.stringify(filteredSchedules));
        console.log('Web platform: Old schedules cleaned up from AsyncStorage');
        return;
      }

      if (!this.db) {
        throw new Error('Database not initialized');
      }

      await this.db.runAsync(
        'DELETE FROM schedules WHERE date < ?',
        [cutoffDate],
      );
    } catch (error) {
      console.error('Failed to cleanup old schedules:', error);
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
}

export default new StorageService(); 