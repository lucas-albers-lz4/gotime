import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor, screen } from '../../test-utils/test-utils';
import DashboardScreen from '../DashboardScreen';
import { ScheduleService } from '../../services/ScheduleService';
import { AuthService } from '../../services/AuthService';
import { mockWeeklySchedule, createMockScheduleWithNoShifts } from '../../test-utils/test-utils';

// Mock the services
jest.mock('../../services/ScheduleService');
jest.mock('../../services/AuthService');

describe('DashboardScreen', () => {
  const mockOnLogout = jest.fn();
  
  // Create mock instances
  const mockScheduleServiceInstance = {
    getAllDemoSchedules: jest.fn(),
    loadDemoSchedule: jest.fn(),
  };
  
  const mockAuthServiceInstance = {
    logout: jest.fn(),
    clearCredentials: jest.fn(),
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset mock implementations
    mockScheduleServiceInstance.getAllDemoSchedules.mockResolvedValue([mockWeeklySchedule]);
    mockScheduleServiceInstance.loadDemoSchedule.mockResolvedValue(mockWeeklySchedule);
    mockAuthServiceInstance.logout.mockResolvedValue(undefined);
    mockAuthServiceInstance.clearCredentials.mockResolvedValue(undefined);
    
    // Mock the getInstance methods
    (ScheduleService.getInstance as jest.Mock).mockReturnValue(mockScheduleServiceInstance);
    (AuthService.getInstance as jest.Mock).mockReturnValue(mockAuthServiceInstance);
    
    // Mock Alert
    jest.spyOn(Alert, 'alert').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render loading state initially', () => {
      render(<DashboardScreen onLogout={mockOnLogout} />);
      
      expect(screen.getByText('Loading schedule...')).toBeTruthy();
    });

    it('should render employee name when schedule is loaded', async () => {
      render(<DashboardScreen onLogout={mockOnLogout} />);
      
      await waitFor(() => {
        expect(screen.getByText('Test Employee')).toBeTruthy();
      });
    });

    it('should render current date in header', async () => {
      render(<DashboardScreen onLogout={mockOnLogout} />);
      
      await waitFor(() => {
        // Should contain day name and date
        const currentDate = new Date();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[currentDate.getDay()];
        
        expect(screen.getByText(new RegExp(dayName))).toBeTruthy();
      });
    });

    it('should render week navigation with date range', async () => {
      render(<DashboardScreen onLogout={mockOnLogout} />);
      
      await waitFor(() => {
        expect(screen.getByText('01/01/2024 - 01/07/2024')).toBeTruthy();
        expect(screen.getByText('← Prev')).toBeTruthy();
        expect(screen.getByText('Next →')).toBeTruthy();
      });
    });

    it('should render data sync information', async () => {
      render(<DashboardScreen onLogout={mockOnLogout} />);
      
      await waitFor(() => {
        expect(screen.getByText(/Data Synced:/)).toBeTruthy();
        expect(screen.getByText(/12\/29\/2023 8:00:00 AM/)).toBeTruthy();
      });
    });

    it('should render schedule entries', async () => {
      render(<DashboardScreen onLogout={mockOnLogout} />);
      
      await waitFor(() => {
        expect(screen.getByText('Mon')).toBeTruthy();
        expect(screen.getByText('01/01/2024')).toBeTruthy();
        expect(screen.getByText('9:00a-5:00p')).toBeTruthy();
        // Use getAllByText to handle multiple "8h" elements (daily hours + shift hours)
        const hoursElements = screen.getAllByText('8h');
        expect(hoursElements.length).toBeGreaterThan(0);
      });
    });

    it('should render no data message when schedule is null', async () => {
      mockScheduleServiceInstance.getAllDemoSchedules.mockResolvedValue([]);
      mockScheduleServiceInstance.loadDemoSchedule.mockResolvedValue(null);
      
      render(<DashboardScreen onLogout={mockOnLogout} />);
      
      await waitFor(() => {
        expect(screen.getByText('No Schedule Data')).toBeTruthy();
        expect(screen.getByText('Pull down to refresh or check your connection.')).toBeTruthy();
      });
    });
  });

  describe('Employee Details', () => {
    it('should toggle employee details when info button is pressed', async () => {
      render(<DashboardScreen onLogout={mockOnLogout} />);
      
      await waitFor(() => {
        expect(screen.getByText('ℹ️ Info')).toBeTruthy();
      });
      
      // Details should not be visible initially
      expect(screen.queryByText('ID: 1234567')).toBeFalsy();
      
      // Tap info button
      fireEvent.press(screen.getByText('ℹ️ Info'));
      
      // Details should now be visible
      await waitFor(() => {
        expect(screen.getByText('ID: 1234567')).toBeTruthy();
        expect(screen.getByText('Location: Test Location')).toBeTruthy();
        expect(screen.getByText('Department: Test Department')).toBeTruthy();
      });
    });
  });

  describe('Navigation', () => {
    it('should handle week navigation', async () => {
      const multipleSchedules = [
        mockWeeklySchedule,
        { ...mockWeeklySchedule, weekStart: '01/08/2024', weekEnd: '01/14/2024' },
      ];
      
      mockScheduleServiceInstance.getAllDemoSchedules.mockResolvedValue(multipleSchedules);
      mockScheduleServiceInstance.loadDemoSchedule.mockResolvedValue(multipleSchedules[0]);
      
      render(<DashboardScreen onLogout={mockOnLogout} />);
      
      await waitFor(() => {
        // Should start with latest schedule (second one) due to fallback behavior
        expect(screen.getByText('01/08/2024 - 01/14/2024')).toBeTruthy();
      });
      
      // Navigate to next week (wraps to first week)
      fireEvent.press(screen.getByText('Next →'));
      
      await waitFor(() => {
        expect(screen.getByText('01/01/2024 - 01/07/2024')).toBeTruthy();
      });
      
      // Navigate back to previous week (wraps to latest week)
      fireEvent.press(screen.getByText('← Prev'));
      
      await waitFor(() => {
        expect(screen.getByText('01/08/2024 - 01/14/2024')).toBeTruthy();
      });
    });

    it('should handle back button press', async () => {
      render(<DashboardScreen onLogout={mockOnLogout} />);
      
      await waitFor(() => {
        expect(screen.getByText('← Back')).toBeTruthy();
      });
      
      fireEvent.press(screen.getByText('← Back'));
      
      expect(mockOnLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe('Logout Functionality', () => {
    it('should show logout confirmation dialog', async () => {
      render(<DashboardScreen onLogout={mockOnLogout} />);
      
      await waitFor(() => {
        expect(screen.getByText('Logout')).toBeTruthy();
      });
      
      fireEvent.press(screen.getByText('Logout'));
      
      expect(Alert.alert).toHaveBeenCalledWith(
        'Logout',
        'Are you sure you want to logout?',
        expect.arrayContaining([
          expect.objectContaining({ text: 'Cancel' }),
          expect.objectContaining({ text: 'Logout' }),
        ]),
      );
    });
  });

  describe('Time Formatting', () => {
    it('should display exact time without rounding', async () => {
      const scheduleWithPreciseTime = {
        ...mockWeeklySchedule,
        entries: [
          {
            day: 'Monday',
            date: '01/01/2024',
            shifts: [
              {
                startTime: '8:15a',
                endTime: '4:45p',
                shiftHours: 8.5,
                changedOn: undefined,
              },
            ],
            dailyHours: 8.5,
          },
        ],
      };
      
      mockScheduleServiceInstance.getAllDemoSchedules.mockResolvedValue([scheduleWithPreciseTime]);
      mockScheduleServiceInstance.loadDemoSchedule.mockResolvedValue(scheduleWithPreciseTime);
      
      render(<DashboardScreen onLogout={mockOnLogout} />);
      
      await waitFor(() => {
        // Should show exact minutes, not rounded hours
        expect(screen.getByText('8:15a-4:45p')).toBeTruthy();
        expect(screen.queryByText('8a-5p')).toBeFalsy(); // Should not be rounded
      });
    });
  });

  describe('Schedule Changes Indicator', () => {
    it('should display asterisk for changed schedules', async () => {
      const scheduleWithChanges = {
        ...mockWeeklySchedule,
        entries: [
          {
            day: 'Monday',
            date: '01/01/2024',
            shifts: [
              {
                startTime: '9:00a',
                endTime: '5:00p',
                shiftHours: 8.0,
                changedOn: '12/28/2023',
              },
            ],
            dailyHours: 8.0,
          },
        ],
      };
      
      mockScheduleServiceInstance.getAllDemoSchedules.mockResolvedValue([scheduleWithChanges]);
      mockScheduleServiceInstance.loadDemoSchedule.mockResolvedValue(scheduleWithChanges);
      
      render(<DashboardScreen onLogout={mockOnLogout} />);
      
      await waitFor(() => {
        // Should find multiple asterisks - one in schedule entry, one in explanation
        const asterisks = screen.getAllByText('*');
        expect(asterisks.length).toBeGreaterThanOrEqual(2);
        
        // Should also have the explanation text
        expect(screen.getByText('* = Schedule changed after original posting')).toBeTruthy();
      });
    });
  });

  describe('Empty Schedule Handling', () => {
    it('should handle days with no shifts', async () => {
      const emptySchedule = createMockScheduleWithNoShifts();
      
      mockScheduleServiceInstance.getAllDemoSchedules.mockResolvedValue([emptySchedule]);
      mockScheduleServiceInstance.loadDemoSchedule.mockResolvedValue(emptySchedule);
      
      render(<DashboardScreen onLogout={mockOnLogout} />);
      
      await waitFor(() => {
        expect(screen.getByText('—')).toBeTruthy(); // Em dash for no shifts
      });
    });
  });

  describe('Current Week Loading', () => {
    it('should load the week containing today\'s date when available', async () => {
      const today = new Date();
      
      // Create schedules where the middle one contains today's date
      const pastWeek = {
        ...mockWeeklySchedule,
        weekStart: '01/01/2024',
        weekEnd: '01/07/2024',
      };
      
      // Calculate Monday of current week
      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Days to subtract to get to Monday
      const monday = new Date(today);
      monday.setDate(today.getDate() - daysToMonday);
      
      // Calculate Sunday of current week  
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      
      const currentWeek = {
        ...mockWeeklySchedule,
        weekStart: `${monday.getMonth() + 1}/${monday.getDate()}/${monday.getFullYear()}`,
        weekEnd: `${sunday.getMonth() + 1}/${sunday.getDate()}/${sunday.getFullYear()}`,
      };
      
      const futureWeek = {
        ...mockWeeklySchedule,
        weekStart: '12/25/2024',
        weekEnd: '12/31/2024',
      };
      
      const multipleSchedules = [pastWeek, currentWeek, futureWeek];
      
      mockScheduleServiceInstance.getAllDemoSchedules.mockResolvedValue(multipleSchedules);
      mockScheduleServiceInstance.loadDemoSchedule.mockResolvedValue(currentWeek);
      
      render(<DashboardScreen onLogout={mockOnLogout} />);
      
      await waitFor(() => {
        // Should display the current week's date range
        expect(screen.getByText(`${currentWeek.weekStart} - ${currentWeek.weekEnd}`)).toBeTruthy();
      });
    });

    it('should fall back to latest schedule when no week contains today', async () => {
      const pastWeek1 = {
        ...mockWeeklySchedule,
        weekStart: '01/01/2024',
        weekEnd: '01/07/2024',
      };
      
      const pastWeek2 = {
        ...mockWeeklySchedule,
        weekStart: '01/08/2024',
        weekEnd: '01/14/2024',
      };
      
      const pastSchedules = [pastWeek1, pastWeek2];
      
      mockScheduleServiceInstance.getAllDemoSchedules.mockResolvedValue(pastSchedules);
      mockScheduleServiceInstance.loadDemoSchedule.mockResolvedValue(pastWeek2);
      
      render(<DashboardScreen onLogout={mockOnLogout} />);
      
      await waitFor(() => {
        // Should display the latest (most recent) week since none contain today
        expect(screen.getByText('01/08/2024 - 01/14/2024')).toBeTruthy();
      });
    });
  });
}); 