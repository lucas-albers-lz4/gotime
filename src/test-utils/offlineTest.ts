// Test utilities for offline storage functionality
import { WeeklySchedule, ScheduleEntry, ScheduleShift, EmployeeInfo } from '../types';
import { ScheduleService } from '../services/ScheduleService';

// Create a sample schedule for testing
export const createTestSchedule = (weekOffset: number = 0): WeeklySchedule => {
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + (weekOffset * 7));
  
  const weekStart = new Date(baseDate);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Monday
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6); // Sunday
  
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Don't pad with zero
    const day = date.getDate(); // Don't pad with zero
    return `${month}/${day}/${year}`;
  };

  const employee: EmployeeInfo = {
    name: 'EXAMPLE EMPLOYEE',
    employeeId: '0000000',
    location: '00096-Test Location',
    department: '080-Front End',
    jobTitle: 'Test Position',
    status: 'PT',
    hireDate: '2024-01-01',
  };

  const shifts: ScheduleShift[] = [
    {
      startTime: '09:00',
      endTime: '13:00',
      shiftHours: 4.0,
    },
    {
      startTime: '14:00',
      endTime: '18:00',
      shiftHours: 4.0,
    },
  ];

  const entries: ScheduleEntry[] = [
    {
      day: 'Monday',
      date: formatDate(new Date(weekStart.getTime() + 0 * 24 * 60 * 60 * 1000)),
      shifts: [shifts[0]],
      dailyHours: 4.0,
    },
    {
      day: 'Tuesday',
      date: formatDate(new Date(weekStart.getTime() + 1 * 24 * 60 * 60 * 1000)),
      shifts: [shifts[1]],
      dailyHours: 4.0,
    },
    {
      day: 'Wednesday',
      date: formatDate(new Date(weekStart.getTime() + 2 * 24 * 60 * 60 * 1000)),
      shifts: shifts,
      dailyHours: 8.0,
    },
    {
      day: 'Thursday',
      date: formatDate(new Date(weekStart.getTime() + 3 * 24 * 60 * 60 * 1000)),
      shifts: [shifts[0]],
      dailyHours: 4.0,
    },
    {
      day: 'Friday',
      date: formatDate(new Date(weekStart.getTime() + 4 * 24 * 60 * 60 * 1000)),
      shifts: shifts,
      dailyHours: 8.0,
    },
    {
      day: 'Saturday',
      date: formatDate(new Date(weekStart.getTime() + 5 * 24 * 60 * 60 * 1000)),
      shifts: [shifts[1]],
      dailyHours: 4.0,
    },
    {
      day: 'Sunday',
      date: formatDate(new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)),
      shifts: [],
      dailyHours: 0,
    },
  ];

  return {
    weekStart: formatDate(weekStart),
    weekEnd: formatDate(weekEnd),
    dataAsOf: new Date().toISOString(),
    employee,
    entries,
    totalHours: 32.0,
    straightTimeEarnings: 32.0,
  };
};

// Test offline storage functionality
export const testOfflineStorage = async (): Promise<void> => {
  try {
    console.log('🧪 [OFFLINE-TEST] Starting offline storage test...');
    
    const scheduleService = ScheduleService.getInstance();
    
    // Create test schedules for multiple weeks
    const testSchedules = [
      createTestSchedule(0),  // Current week
      createTestSchedule(-1), // Last week
      createTestSchedule(1),  // Next week
    ];
    
    console.log('📅 [OFFLINE-TEST] Created', testSchedules.length, 'test schedules');
    
    // Save all test schedules
    for (const schedule of testSchedules) {
      await scheduleService.saveSchedule(schedule);
      console.log('💾 [OFFLINE-TEST] Saved schedule for week:', schedule.weekStart, '-', schedule.weekEnd);
    }
    
    // Retrieve all schedules
    const storedSchedules = await scheduleService.getAllWeeklySchedules();
    console.log('📋 [OFFLINE-TEST] Retrieved', storedSchedules.length, 'schedules from storage');
    
    // Retrieve specific schedule
    const firstSchedule = testSchedules[0];
    const retrievedSchedule = await scheduleService.getSchedule(
      firstSchedule.employee.employeeId, 
      firstSchedule.weekEnd,
    );
    
    if (retrievedSchedule) {
      console.log('✅ [OFFLINE-TEST] Successfully retrieved specific schedule');
    } else {
      console.log('❌ [OFFLINE-TEST] Failed to retrieve specific schedule');
    }
    
    // Get storage stats
    const stats = await scheduleService.getStorageStats();
    console.log('📊 [OFFLINE-TEST] Storage stats:', stats);
    
    // Test most recent schedule
    const mostRecent = await scheduleService.getMostRecentSchedule(firstSchedule.employee.employeeId);
    if (mostRecent) {
      console.log('🗓️ [OFFLINE-TEST] Most recent schedule:', mostRecent.weekStart, '-', mostRecent.weekEnd);
    }
    
    console.log('✅ [OFFLINE-TEST] Offline storage test completed successfully!');
    
  } catch (error) {
    console.error('❌ [OFFLINE-TEST] Offline storage test failed:', error);
    throw error;
  }
};

// Clean up test data
export const cleanupTestData = async (): Promise<void> => {
  try {
    console.log('🧹 [OFFLINE-TEST] Cleaning up test data...');
    const scheduleService = ScheduleService.getInstance();
    await scheduleService.cleanupOldSchedules();
    console.log('✅ [OFFLINE-TEST] Test data cleanup completed');
  } catch (error) {
    console.error('❌ [OFFLINE-TEST] Test data cleanup failed:', error);
  }
}; 