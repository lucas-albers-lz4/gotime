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

// Mock exception employee info (for payroll error schedules)
export const mockExceptionEmployeeInfo: EmployeeInfo = {
  name: 'Unknown Employee',
  employeeId: 'Unknown',
  location: 'Not Available',
  department: 'Not Available',
  jobTitle: 'Not Available',
  status: 'Not Available',
  hireDate: 'Not Available',
};

export const mockScheduleShift: ScheduleShift = {
  startTime: '8:00 AM',
  endTime: '5:00 PM',
  shiftHours: 8,
};

export const mockScheduleEntry: ScheduleEntry = {
  day: 'Monday',
  date: '2023-06-05',
  shifts: [mockScheduleShift],
  dailyHours: 8,
};

// Mock exception schedule entry (zero hours)
export const mockExceptionScheduleEntry: ScheduleEntry = {
  day: 'Monday',
  date: '2023-06-05',
  shifts: [],
  dailyHours: 0,
};

export const mockWeeklySchedule: WeeklySchedule = {
  weekStart: '2023-06-05',
  weekEnd: '2023-06-11',
  dataAsOf: '2023-06-01 9:00 AM',
  employee: mockEmployeeInfo,
  entries: [mockScheduleEntry],
  totalHours: 40,
  straightTimeEarnings: 800,
  disclaimerText: 'This is a test schedule',
};

// Mock exception weekly schedule (payroll error)
export const mockExceptionWeeklySchedule: WeeklySchedule = {
  weekStart: '2023-06-05',
  weekEnd: '2023-06-11',
  dataAsOf: '2023-06-01 9:00 AM',
  employee: mockExceptionEmployeeInfo,
  entries: Array.from({ length: 7 }, (_, i) => ({
    day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i],
    date: `2023-06-${String(5 + i).padStart(2, '0')}`,
    shifts: [],
    dailyHours: 0,
  })),
  totalHours: 0,
  straightTimeEarnings: 0,
  disclaimerText: 'Your schedule is not available at this time. Please contact your payroll clerk for assistance.',
  isException: true,
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