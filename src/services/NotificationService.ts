import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { ScheduleEntry } from '../types';
import StorageService from './StorageService';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class NotificationService {
  private expoPushToken: string | null = null;

  // Initialize notification service
  async initialize(): Promise<boolean> {
    try {
      console.log('Initializing notification service...');

      // Check if device supports notifications
      if (!Device.isDevice) {
        console.warn('Notifications only work on physical devices');
        return false;
      }

      // Request permissions
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn('Notification permissions not granted');
        return false;
      }

      // Get push token (for future use if needed)
      await this.registerForPushNotifications();

      console.log('Notification service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
      return false;
    }
  }

  // Request notification permissions
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Notification permission denied');
        return false;
      }

      // Configure notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('shift-reminders', {
          name: 'Shift Reminders',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#0066CC',
          sound: 'default',
        });
      }

      return true;
    } catch (error) {
      console.error('Failed to request notification permissions:', error);
      return false;
    }
  }

  // Register for push notifications
  async registerForPushNotifications(): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });

      this.expoPushToken = token.data;
      console.log('Push token registered:', this.expoPushToken);
      
      return this.expoPushToken;
    } catch (error) {
      console.error('Failed to register for push notifications:', error);
      return null;
    }
  }

  // Schedule shift reminders for upcoming schedules
  async scheduleShiftReminders(): Promise<void> {
    try {
      // TODO: Update this method to work with new ScheduleEntry structure
      console.log('scheduleShiftReminders temporarily disabled - needs refactoring for new data structure');
      return;
      
      /*
      // Get app settings
      const settings = await StorageService.getSettings();
      if (!settings.notificationsEnabled) {
        console.log('Notifications disabled in settings');
        return;
      }

      // Get upcoming schedules (next 3 weeks)
      const today = new Date().toISOString().split('T')[0];
      const threeWeeksFromNow = new Date();
      threeWeeksFromNow.setDate(threeWeeksFromNow.getDate() + 21);
      const endDate = threeWeeksFromNow.toISOString().split('T')[0];

      const schedules = await StorageService.getSchedules(today, endDate);
      
      let scheduledCount = 0;
      for (const schedule of schedules) {
        const success = await this.scheduleShiftReminder(schedule, settings.reminderMinutes);
        if (success) {
          scheduledCount++;
        }
      }

      console.log(`Scheduled ${scheduledCount} shift reminders`);
      */
    } catch (error) {
      console.error('Failed to schedule shift reminders:', error);
      throw error;
    }
  }

  // Schedule a single shift reminder
  async scheduleShiftReminder(_schedule: ScheduleEntry, _reminderMinutes: number): Promise<boolean> {
    try {
      // TODO: Update this method to work with new ScheduleEntry structure
      console.log('scheduleShiftReminder temporarily disabled - needs refactoring for new data structure');
      return false;
      
      /*
      // This entire method is temporarily disabled until we update it for the new ScheduleEntry structure
      // The new structure uses shifts array instead of direct startTime/endTime properties
      
      // Calculate notification time
      const shiftDateTime = new Date(`${schedule.date}T${schedule.startTime}:00`);
      const notificationTime = new Date(shiftDateTime.getTime() - (reminderMinutes * 60 * 1000));

      // Don't schedule notifications for past times
      if (notificationTime <= new Date()) {
        return false;
      }

      // Format shift time for display
      const shiftTimeFormatted = this.formatTime(schedule.startTime);
      const shiftDateFormatted = this.formatDate(schedule.date);

      // Schedule the notification - also disabled due to Expo SDK 53 compatibility issues
      console.log(`Would schedule reminder for ${schedule.date} ${schedule.startTime} (temporarily disabled)`);
      return true;
      */
    } catch (error) {
      console.error('Failed to schedule shift reminder:', error);
      return false;
    }
  }

  // Send immediate notification (for testing or manual triggers)
  async sendImmediateNotification(title: string, body: string, data?: Record<string, unknown>): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Failed to send immediate notification:', error);
      throw error;
    }
  }

  // Cancel all scheduled notifications
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('Cancelled all scheduled notifications');
    } catch (error) {
      console.error('Failed to cancel notifications:', error);
      throw error;
    }
  }

  // Cancel specific notification
  async cancelNotification(identifier: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
      console.log(`Cancelled notification: ${identifier}`);
    } catch (error) {
      console.error('Failed to cancel notification:', error);
      throw error;
    }
  }

  // Get all scheduled notifications
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Failed to get scheduled notifications:', error);
      return [];
    }
  }

  // Check notification permissions status
  async checkPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Failed to check notification permissions:', error);
      return false;
    }
  }

  // Handle notification received while app is running
  addNotificationReceivedListener(handler: (notification: Notifications.Notification) => void): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(handler);
  }

  // Handle notification response (when user taps notification)
  addNotificationResponseReceivedListener(handler: (response: Notifications.NotificationResponse) => void): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(handler);
  }

  // Update notification settings and reschedule
  async updateNotificationSettings(enabled: boolean, reminderMinutes: number): Promise<void> {
    try {
      // Update settings in storage
      const settings = await StorageService.getSettings();
      settings.notificationsEnabled = enabled;
      settings.reminderMinutes = reminderMinutes;
      await StorageService.saveSettings(settings);

      // Reschedule notifications with new settings
      if (enabled) {
        await this.scheduleShiftReminders();
      } else {
        await this.cancelAllNotifications();
      }

      console.log(`Updated notification settings: enabled=${enabled}, reminderMinutes=${reminderMinutes}`);
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      throw error;
    }
  }

  // Test notification (for debugging)
  async sendTestNotification(): Promise<void> {
    try {
      await this.sendImmediateNotification(
        '🧪 Test Notification',
        'This is a test notification to verify the system is working correctly.',
        { test: true },
      );
    } catch (error) {
      console.error('Failed to send test notification:', error);
      throw error;
    }
  }

  // Format time for display (HH:MM to 12-hour format)
  private formatTime(time24: string): string {
    try {
      const [hours, minutes] = time24.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch {
      return time24;
    }
  }

  // Format date for display
  private formatDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  }

  // Get push token
  getPushToken(): string | null {
    return this.expoPushToken;
  }
}

export default new NotificationService();