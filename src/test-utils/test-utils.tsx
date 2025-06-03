import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WeeklySchedule, EmployeeInfo, ScheduleEntry, ScheduleShift } from '../types';

// Mock data for testing
export const mockEmployeeInfo: EmployeeInfo = {
  name: 'Test Employee',
  employeeId: '1234567',
  location: 'Test Location',
  department: 'Test Department',
  jobTitle: 'Test Job Title',
  status: 'Active',
  hireDate: '2023-01-01',
};

export const mockScheduleShift: ScheduleShift = {
  startTime: '9:00a',
  endTime: '5:00p',
  shiftHours: 8.0,
  changedOn: undefined,
};

export const mockScheduleEntry: ScheduleEntry = {
  day: 'Monday',
  date: '6/2/2025',
  shifts: [mockScheduleShift],
  dailyHours: 8.0,
};

export const mockWeeklySchedule: WeeklySchedule = {
  weekStart: '6/2/2025',
  weekEnd: '6/8/2025',
  dataAsOf: '5/29/2025 7:24:02 AM',
  employee: mockEmployeeInfo,
  entries: [mockScheduleEntry],
  totalHours: 40.0,
  straightTimeEarnings: 640.0, // 40 hours * $16/hour example
};

// Custom render function with providers
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 0, height: 0 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}
    >
      {children}
    </SafeAreaProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react-native';

// Override render method
export { customRender as render };

// Helper functions for testing
export const createMockScheduleWithDays = (days: string[]): WeeklySchedule => {
  const entries = days.map((day, index) => ({
    day,
    date: `6/${index + 2}/2025`,
    shifts: [mockScheduleShift],
    dailyHours: 8.0,
  }));

  return {
    ...mockWeeklySchedule,
    entries,
    totalHours: days.length * 8.0,
  };
};

export const createMockScheduleWithNoShifts = (): WeeklySchedule => {
  return {
    ...mockWeeklySchedule,
    entries: [
      {
        day: 'Monday',
        date: '6/2/2025',
        shifts: [],
        dailyHours: 0,
      },
    ],
    totalHours: 0,
  };
}; 