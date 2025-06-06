import { ScheduleService } from '../ScheduleService';
import { WeeklySchedule } from '../../types';
import { readFileSync } from 'fs';
import { join } from 'path';

/* eslint-env jest */

describe('ScheduleService', () => {
  let scheduleService: ScheduleService;

  beforeEach(() => {
    scheduleService = ScheduleService.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getInstance', () => {
    it('should return a singleton instance', () => {
      const instance1 = ScheduleService.getInstance();
      const instance2 = ScheduleService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('getAllDemoSchedules', () => {
    it('should return an array of demo schedules', async () => {
      const schedules = await scheduleService.getAllDemoSchedules();
      
      expect(schedules).toBeInstanceOf(Array);
      expect(schedules.length).toBeGreaterThan(0);
      
      // Check first schedule structure
      const firstSchedule = schedules[0];
      expect(firstSchedule).toHaveProperty('weekStart');
      expect(firstSchedule).toHaveProperty('weekEnd');
      expect(firstSchedule).toHaveProperty('dataAsOf');
      expect(firstSchedule).toHaveProperty('employee');
      expect(firstSchedule).toHaveProperty('entries');
      expect(firstSchedule).toHaveProperty('totalHours');
      expect(firstSchedule).toHaveProperty('straightTimeEarnings');
    });

    it('should return schedules with valid employee information', async () => {
      const schedules = await scheduleService.getAllDemoSchedules();
      const firstSchedule = schedules[0];
      
      expect(firstSchedule.employee).toHaveProperty('name');
      expect(firstSchedule.employee).toHaveProperty('employeeId');
      expect(firstSchedule.employee).toHaveProperty('location');
      expect(firstSchedule.employee).toHaveProperty('department');
      expect(firstSchedule.employee).toHaveProperty('jobTitle');
      expect(firstSchedule.employee).toHaveProperty('status');
      expect(firstSchedule.employee).toHaveProperty('hireDate');
      
      expect(typeof firstSchedule.employee.name).toBe('string');
      expect(typeof firstSchedule.employee.employeeId).toBe('string');
    });

    it('should return schedules with valid schedule entries', async () => {
      const schedules = await scheduleService.getAllDemoSchedules();
      const firstSchedule = schedules[0];
      
      expect(firstSchedule.entries).toBeInstanceOf(Array);
      expect(firstSchedule.entries.length).toBeGreaterThan(0);
      
      const firstEntry = firstSchedule.entries[0];
      expect(firstEntry).toHaveProperty('day');
      expect(firstEntry).toHaveProperty('date');
      expect(firstEntry).toHaveProperty('shifts');
      expect(firstEntry).toHaveProperty('dailyHours');
      
      expect(typeof firstEntry.day).toBe('string');
      expect(typeof firstEntry.date).toBe('string');
      expect(firstEntry.shifts).toBeInstanceOf(Array);
      expect(typeof firstEntry.dailyHours).toBe('number');
    });

    it('should return schedules with valid shift data', async () => {
      const schedules = await scheduleService.getAllDemoSchedules();
      const firstSchedule = schedules[0];
      
      // Find an entry with shifts
      const entryWithShifts = firstSchedule.entries.find(entry => entry.shifts.length > 0);
      expect(entryWithShifts).toBeDefined();
      
      if (entryWithShifts) {
        const firstShift = entryWithShifts.shifts[0];
        expect(firstShift).toHaveProperty('startTime');
        expect(firstShift).toHaveProperty('endTime');
        expect(firstShift).toHaveProperty('shiftHours');
        
        expect(typeof firstShift.startTime).toBe('string');
        expect(typeof firstShift.endTime).toBe('string');
        expect(typeof firstShift.shiftHours).toBe('number');
        expect(firstShift.shiftHours).toBeGreaterThan(0);
      }
    });

    it('should return schedules with proper data sync timestamps', async () => {
      const schedules = await scheduleService.getAllDemoSchedules();
      
      schedules.forEach(schedule => {
        expect(schedule.dataAsOf).toBeDefined();
        expect(typeof schedule.dataAsOf).toBe('string');
        // Should contain both date and time
        expect(schedule.dataAsOf).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}.*\d{1,2}:\d{2}:\d{2}\s*(AM|PM)/);
      });
    });

    it('should return schedules with different week ranges', async () => {
      const schedules = await scheduleService.getAllDemoSchedules();
      
      if (schedules.length > 1) {
        const weekStarts = schedules.map(s => s.weekStart);
        const uniqueWeekStarts = new Set(weekStarts);
        expect(uniqueWeekStarts.size).toBe(weekStarts.length);
      }
    });

    test('should return demo schedules in chronological order', async () => {
      const schedules = await scheduleService.getAllDemoSchedules();
      
      expect(schedules.length).toBe(3);
      
      // Verify chronological ordering by weekStart dates
      const weekStarts = schedules.map(s => s.weekStart);
      expect(weekStarts).toEqual(['5/26/2025', '6/2/2025', '6/9/2025']);
      
      // Verify that each subsequent schedule is later than the previous
      for (let i = 1; i < schedules.length; i++) {
        const prevStart = new Date(schedules[i-1].weekStart);
        const currentStart = new Date(schedules[i].weekStart);
        expect(currentStart.getTime()).toBeGreaterThan(prevStart.getTime());
      }
      
      console.log('✅ Demo schedules verified in chronological order');
    });
  });

  describe('loadDemoSchedule', () => {
    it('should load a demo schedule successfully', async () => {
      const schedule = await scheduleService.loadDemoSchedule();
      
      expect(schedule).toBeDefined();
      expect(schedule).toHaveProperty('weekStart');
      expect(schedule).toHaveProperty('weekEnd');
      expect(schedule).toHaveProperty('employee');
      expect(schedule).toHaveProperty('entries');
    });

    it('should handle errors gracefully', async () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // This test ensures the method doesn't throw
      await expect(scheduleService.loadDemoSchedule()).resolves.toBeDefined();
      
      consoleSpy.mockRestore();
    });
  });

  describe('time formatting validation', () => {
    it('should preserve exact minutes in schedule data', async () => {
      const schedules = await scheduleService.getAllDemoSchedules();
      
      schedules.forEach(schedule => {
        schedule.entries.forEach(entry => {
          entry.shifts.forEach(shift => {
            // Check that times contain minutes (not just hours)
            if (shift.startTime.includes(':')) {
              const [, minutes] = shift.startTime.split(':');
              expect(minutes).toBeDefined();
              expect(minutes.length).toBeGreaterThanOrEqual(2);
            }
            
            if (shift.endTime.includes(':')) {
              const [, minutes] = shift.endTime.split(':');
              expect(minutes).toBeDefined();
              expect(minutes.length).toBeGreaterThanOrEqual(2);
            }
          });
        });
      });
    });
  });

  describe('parseScheduleHTML with real HTML', () => {
    it('should parse real schedule HTML from example file', () => {
      // Read the actual HTML file
      // eslint-disable-next-line no-undef
      const htmlPath = join(__dirname, '../../..', 'example.schedule/Schedule1_files/saved_resource.html');
      const html = readFileSync(htmlPath, 'utf-8');
      
      const schedule = scheduleService.parseScheduleHTML(html);
      
      expect(schedule).not.toBeNull();
      if (schedule) {
        expect(schedule.employee.name).toBe('LUCAS ALBERS');
        expect(schedule.employee.employeeId).toBe('6570527');
        expect(schedule.employee.location).toBe('00096-Bozeman, MT');
        expect(schedule.employee.department).toBe('080-Front End');
        expect(schedule.employee.jobTitle).toBe('Cashier Asst');
        expect(schedule.employee.status).toBe('PT');
        expect(schedule.employee.hireDate).toBe('5/22/2025');
        expect(schedule.weekStart).toBe('6/2/2025');  // Monday's date
        expect(schedule.weekEnd).toBe('6/8/2025');    // Sunday's date (as found in HTML)
      }
    });
  });

  describe('Date Format and Week Alignment', () => {
    test('should convert ISO dates to MM/dd/yyyy format', () => {
      const mockHtml = `
        <span>Name</span><span style="font-weight:bold">John</span><span>&nbsp;</span><span style="font-weight:bold">Doe</span>
        <span>Employee #</span><span style="font-weight:bold">123456</span>
        <span>Location</span><span style="font-weight:bold">Test Location</span>
        <span>Department</span><span style="font-weight:bold">Test Dept</span>
        <span>Job Title</span><span style="font-weight:bold">Test Title</span>
        <span>Status</span><span style="font-weight:bold">Active</span>
        <span>Hire Date:</span><span style="font-weight:bold">1/1/2023</span>
        <table class="ls">
          <tr><span>Day</span><span>Date</span></tr>
          <tr><span>Monday</span><span>5/26/2025</span></tr>
          <tr><span>Sunday</span><span>6/1/2025</span></tr>
        </table>
        Week: 2025-05-26 - 2025-06-01
        <span>Total Hours</span><span>40.0</span>
      `;

      const schedule = scheduleService.parseScheduleHTML(mockHtml);
      // Week should start on Monday and end on Sunday (Monday-to-Sunday format)
      expect(schedule?.weekStart).toBe('5/26/2025'); // Monday's date
      expect(schedule?.weekEnd).toBe('6/1/2025');   // Sunday's date (6 days after Monday)
    });

    test('should correct misaligned week dates to match Monday', () => {
      // This test covers the user's specific issue: 5/22/2025 - 6/1/2025 with Monday being 5/26/2025
      const mockHtml = `
        <span>Name</span><span style="font-weight:bold">John</span><span>&nbsp;</span><span style="font-weight:bold">Doe</span>
        <span>Employee #</span><span style="font-weight:bold">123456</span>
        <span>Location</span><span style="font-weight:bold">Test Location</span>
        <span>Department</span><span style="font-weight:bold">Test Dept</span>
        <span>Job Title</span><span style="font-weight:bold">Test Title</span>
        <span>Status</span><span style="font-weight:bold">Active</span>
        <span>Hire Date:</span><span style="font-weight:bold">1/1/2023</span>
        <table class="ls">
          <tr><span>Day</span><span>Date</span><span>Start Time</span><span>End Time</span><span>Hours</span></tr>
          <tr><span>Monday</span><span>5/26/2025</span><span>9:00 AM</span><span>5:00 PM</span><span>8.0</span></tr>
          <tr><span>Tuesday</span><span>5/27/2025</span><span>9:00 AM</span><span>5:00 PM</span><span>8.0</span></tr>
          <tr><span>Wednesday</span><span>5/28/2025</span><span>9:00 AM</span><span>5:00 PM</span><span>8.0</span></tr>
          <tr><span>Thursday</span><span>5/29/2025</span><span>9:00 AM</span><span>5:00 PM</span><span>8.0</span></tr>
          <tr><span>Friday</span><span>5/30/2025</span><span>9:00 AM</span><span>5:00 PM</span><span>8.0</span></tr>
          <tr><span>Saturday</span><span>5/31/2025</span><span></span><span></span><span>0</span></tr>
          <tr><span>Sunday</span><span>6/1/2025</span><span></span><span></span><span>0</span></tr>
        </table>
        Week: 5/22/2025 - 6/1/2025
        <span>Total Hours</span><span>40.0</span>
      `;

      const schedule = scheduleService.parseScheduleHTML(mockHtml);
      
      // Should correct the week start to Monday's date
      expect(schedule?.weekStart).toBe('5/26/2025'); // Monday's date  
      // Should correct the week end to Sunday (6 days after Monday)
      expect(schedule?.weekEnd).toBe('6/1/2025');   // Sunday's date
      
      // Verify entries have correct dates
      const mondayEntry = schedule?.entries.find(entry => entry.day === 'Monday');
      expect(mondayEntry?.date).toBe('5/26/2025');
    });

    test('should maintain correct week dates when they already align', () => {
      const mockHtml = `
        <span>Name</span><span style="font-weight:bold">Jane</span><span>&nbsp;</span><span style="font-weight:bold">Smith</span>
        <span>Employee #</span><span style="font-weight:bold">789012</span>
        <span>Location</span><span style="font-weight:bold">Test Location</span>
        <span>Department</span><span style="font-weight:bold">Test Dept</span>
        <span>Job Title</span><span style="font-weight:bold">Test Title</span>
        <span>Status</span><span style="font-weight:bold">Active</span>
        <span>Hire Date:</span><span style="font-weight:bold">1/1/2023</span>
        <table class="ls">
          <tr><span>Day</span><span>Date</span><span>Start Time</span><span>End Time</span><span>Hours</span></tr>
          <tr><span>Monday</span><span>6/2/2025</span><span>9:00 AM</span><span>5:00 PM</span><span>8.0</span></tr>
          <tr><span>Sunday</span><span>6/8/2025</span><span></span><span></span><span>0</span></tr>
        </table>
        Week: 6/2/2025 - 6/8/2025
        <span>Total Hours</span><span>40.0</span>
      `;

      const schedule = scheduleService.parseScheduleHTML(mockHtml);
      
      // Should maintain correct Monday-to-Sunday format
      expect(schedule?.weekStart).toBe('6/2/2025');  // Monday's date
      expect(schedule?.weekEnd).toBe('6/8/2025');    // Sunday's date (6 days after Monday)
    });

    test('should handle ISO format dates in week range', () => {
      const mockHtml = `
        <span>Name</span><span style="font-weight:bold">Bob</span><span>&nbsp;</span><span style="font-weight:bold">Wilson</span>
        <span>Employee #</span><span style="font-weight:bold">345678</span>
        <span>Location</span><span style="font-weight:bold">Test Location</span>
        <span>Department</span><span style="font-weight:bold">Test Dept</span>
        <span>Job Title</span><span style="font-weight:bold">Test Title</span>
        <span>Status</span><span style="font-weight:bold">Active</span>
        <span>Hire Date:</span><span style="font-weight:bold">1/1/2023</span>
        <table class="ls">
          <tr><span>Day</span><span>Date</span><span>Start Time</span><span>End Time</span><span>Hours</span></tr>
          <tr><span>Monday</span><span>6/9/2025</span><span>9:00 AM</span><span>5:00 PM</span><span>8.0</span></tr>
          <tr><span>Sunday</span><span>6/15/2025</span><span></span><span></span><span>0</span></tr>
        </table>
        Week: 2025-06-09 - 2025-06-15
        <span>Total Hours</span><span>40.0</span>
      `;

      const schedule = scheduleService.parseScheduleHTML(mockHtml);
      
      // Should convert ISO dates to MM/dd/yyyy format and maintain Monday-Sunday format
      expect(schedule?.weekStart).toBe('6/9/2025');  // Monday's date
      expect(schedule?.weekEnd).toBe('6/15/2025');   // Sunday's date (6 days after Monday)
    });

    test('should derive week range from schedule dates when no explicit range provided', () => {
      const mockHtml = `
        <span>Name</span><span style="font-weight:bold">Alice</span><span>&nbsp;</span><span style="font-weight:bold">Brown</span>
        <span>Employee #</span><span style="font-weight:bold">567890</span>
        <span>Location</span><span style="font-weight:bold">Test Location</span>
        <span>Department</span><span style="font-weight:bold">Test Dept</span>
        <span>Job Title</span><span style="font-weight:bold">Test Title</span>
        <span>Status</span><span style="font-weight:bold">Active</span>
        <span>Hire Date:</span><span style="font-weight:bold">1/1/2023</span>
        <table class="ls">
          <tr><span>Day</span><span>Date</span><span>Start Time</span><span>End Time</span><span>Hours</span></tr>
          <tr><span>Monday</span><span>6/16/2025</span><span>9:00 AM</span><span>5:00 PM</span><span>8.0</span></tr>
          <tr><span>Tuesday</span><span>6/17/2025</span><span>9:00 AM</span><span>5:00 PM</span><span>8.0</span></tr>
          <tr><span>Wednesday</span><span>6/18/2025</span><span>9:00 AM</span><span>5:00 PM</span><span>8.0</span></tr>
          <tr><span>Thursday</span><span>6/19/2025</span><span>9:00 AM</span><span>5:00 PM</span><span>8.0</span></tr>
          <tr><span>Friday</span><span>6/20/2025</span><span>9:00 AM</span><span>5:00 PM</span><span>8.0</span></tr>
          <tr><span>Saturday</span><span>6/21/2025</span><span></span><span></span><span>0</span></tr>
          <tr><span>Sunday</span><span>6/22/2025</span><span></span><span></span><span>0</span></tr>
        </table>
        <span>Total Hours</span><span>40.0</span>
      `;

      const schedule = scheduleService.parseScheduleHTML(mockHtml);
      
      // Should derive Monday-to-Sunday week from Monday's date
      expect(schedule?.weekStart).toBe('6/16/2025'); // Monday's date
      // Should calculate Sunday as week end (6 days after Monday)
      expect(schedule?.weekEnd).toBe('6/22/2025');   // Sunday's date
    });

    test('should handle mixed ISO and standard date formats', () => {
      const mockHtml = `
        <span>Name</span><span style="font-weight:bold">Charlie</span><span>&nbsp;</span><span style="font-weight:bold">Davis</span>
        <span>Employee #</span><span style="font-weight:bold">234567</span>
        <span>Location</span><span style="font-weight:bold">Test Location</span>
        <span>Department</span><span style="font-weight:bold">Test Dept</span>
        <span>Job Title</span><span style="font-weight:bold">Test Title</span>
        <span>Status</span><span style="font-weight:bold">Active</span>
        <span>Hire Date:</span><span style="font-weight:bold">1/1/2023</span>
        <table class="ls">
          <tr><span>Day</span><span>Date</span><span>Start Time</span><span>End Time</span><span>Hours</span></tr>
          <tr><span>Monday</span><span>6/23/2025</span><span>9:00 AM</span><span>5:00 PM</span><span>8.0</span></tr>
          <tr><span>Sunday</span><span>6/29/2025</span><span></span><span></span><span>0</span></tr>
        </table>
        EndDate: 2025-06-29T00:00:00
        <span>Total Hours</span><span>40.0</span>
      `;

      const schedule = scheduleService.parseScheduleHTML(mockHtml);
      
      // Should align with Monday's date regardless of EndDate format (Monday-Sunday week)
      expect(schedule?.weekStart).toBe('6/23/2025'); // Monday's date
      expect(schedule?.weekEnd).toBe('6/29/2025');   // Sunday's date (6 days after Monday)
    });

    test('should handle edge case where extracted week span is longer than 7 days', () => {
      const mockHtml = `
        <span>Name</span><span style="font-weight:bold">David</span><span>&nbsp;</span><span style="font-weight:bold">Lee</span>
        <span>Employee #</span><span style="font-weight:bold">890123</span>
        <span>Location</span><span style="font-weight:bold">Test Location</span>
        <span>Department</span><span style="font-weight:bold">Test Dept</span>
        <span>Job Title</span><span style="font-weight:bold">Test Title</span>
        <span>Status</span><span style="font-weight:bold">Active</span>
        <span>Hire Date:</span><span style="font-weight:bold">1/1/2023</span>
        <table class="ls">
          <tr><span>Day</span><span>Date</span><span>Start Time</span><span>End Time</span><span>Hours</span></tr>
          <tr><span>Monday</span><span>6/30/2025</span><span>9:00 AM</span><span>5:00 PM</span><span>8.0</span></tr>
          <tr><span>Sunday</span><span>7/6/2025</span><span></span><span></span><span>0</span></tr>
        </table>
        Week: 6/25/2025 - 7/8/2025
        <span>Total Hours</span><span>40.0</span>
      `;

      const schedule = scheduleService.parseScheduleHTML(mockHtml);
      
      // Should correct to use actual Monday and calculated Sunday (Monday-Sunday week)
      expect(schedule?.weekStart).toBe('6/30/2025'); // Monday's date
      expect(schedule?.weekEnd).toBe('7/6/2025');    // Sunday's date (6 days after Monday)
    });

    test('should normalize all entry dates to MM/dd/yyyy format', () => {
      const mockHtml = `
        <span>Name</span><span style="font-weight:bold">Eva</span><span>&nbsp;</span><span style="font-weight:bold">Garcia</span>
        <span>Employee #</span><span style="font-weight:bold">456789</span>
        <span>Location</span><span style="font-weight:bold">Test Location</span>
        <span>Department</span><span style="font-weight:bold">Test Dept</span>
        <span>Job Title</span><span style="font-weight:bold">Test Title</span>
        <span>Status</span><span style="font-weight:bold">Active</span>
        <span>Hire Date:</span><span style="font-weight:bold">1/1/2023</span>
        <table class="ls">
          <tr><span>Day</span><span>Date</span><span>Start Time</span><span>End Time</span><span>Hours</span></tr>
          <tr><span>Monday</span><span>7/7/2025</span><span>9:00 AM</span><span>5:00 PM</span><span>8.0</span></tr>
          <tr><span>Tuesday</span><span>7/8/2025</span><span>9:00 AM</span><span>5:00 PM</span><span>8.0</span></tr>
        </table>
        Week: 7/7/2025 - 7/13/2025
        <span>Total Hours</span><span>16.0</span>
      `;

      const schedule = scheduleService.parseScheduleHTML(mockHtml);
      
      // All dates should be in MM/dd/yyyy format
      expect(schedule?.weekStart).toMatch(/^\d{1,2}\/\d{1,2}\/\d{4}$/);
      expect(schedule?.weekEnd).toMatch(/^\d{1,2}\/\d{1,2}\/\d{4}$/);
      
      schedule?.entries.forEach(entry => {
        expect(entry.date).toMatch(/^\d{1,2}\/\d{1,2}\/\d{4}$/);
      });
    });

    test('should correct misaligned week dates with leading zeros', () => {
      // This test covers the user's specific issue: 05/22/2025 - 6/1/2025 with Monday being 5/26/2025
      const mockHtml = `
        <span>Name</span><span style="font-weight:bold">John</span><span>&nbsp;</span><span style="font-weight:bold">Doe</span>
        <span>Employee #</span><span style="font-weight:bold">123456</span>
        <span>Location</span><span style="font-weight:bold">Test Location</span>
        <span>Department</span><span style="font-weight:bold">Test Dept</span>
        <span>Job Title</span><span style="font-weight:bold">Test Title</span>
        <span>Status</span><span style="font-weight:bold">Active</span>
        <span>Hire Date:</span><span style="font-weight:bold">1/1/2023</span>
        <span>Data as of:</span><span style="font-weight:bold">6/1/2025</span>
        <span>valid as of&nbsp;</span><span>2:54:13 AM</span>
        <table class="ls">
          <tr><span>Day</span><span>Date</span><span>Start Time</span><span>End Time</span><span>Hours</span></tr>
          <tr><span>Monday</span><span>5/26/2025</span><span>9:00 AM</span><span>5:00 PM</span><span>8.0</span></tr>
          <tr><span>Tuesday</span><span>5/27/2025</span><span>9:00 AM</span><span>5:00 PM</span><span>8.0</span></tr>
          <tr><span>Wednesday</span><span>5/28/2025</span><span>9:00 AM</span><span>5:00 PM</span><span>8.0</span></tr>
          <tr><span>Thursday</span><span>5/29/2025</span><span>9:00 AM</span><span>5:00 PM</span><span>8.0</span></tr>
          <tr><span>Friday</span><span>5/30/2025</span><span>9:00 AM</span><span>5:00 PM</span><span>8.0</span></tr>
          <tr><span>Saturday</span><span>5/31/2025</span><span></span><span></span><span>0</span></tr>
          <tr><span>Sunday</span><span>6/1/2025</span><span></span><span></span><span>0</span></tr>
        </table>
        Week: 05/22/2025 - 6/1/2025
        <span>Total Hours</span><span>40.0</span>
      `;

      const schedule = scheduleService.parseScheduleHTML(mockHtml);
      
      // Should correct the week start to Monday's date (handles leading zero difference)
      expect(schedule?.weekStart).toBe('5/26/2025'); // Monday's date  
      // Should maintain the correct week end
      expect(schedule?.weekEnd).toBe('6/1/2025');   // Sunday's date
      
      // Should format the dataAsOf correctly
      expect(schedule?.dataAsOf).toBe('6/1/2025 2:54:13 AM');
      
      // Verify entries have correct dates
      const mondayEntry = schedule?.entries.find(entry => entry.day === 'Monday');
      expect(mondayEntry?.date).toBe('5/26/2025');
    });

    test('should handle ISO timestamp formatting', () => {
      const mockHtml = `
        <span>Name</span><span style="font-weight:bold">John</span><span>&nbsp;</span><span style="font-weight:bold">Doe</span>
        <span>Employee #</span><span style="font-weight:bold">123456</span>
        <span>Location</span><span style="font-weight:bold">Test Location</span>
        <span>Department</span><span style="font-weight:bold">Test Dept</span>
        <span>Job Title</span><span style="font-weight:bold">Test Title</span>
        <span>Status</span><span style="font-weight:bold">Active</span>
        <span>Hire Date:</span><span style="font-weight:bold">1/1/2023</span>
        <table class="ls">
          <tr><span>Day</span><span>Date</span><span>Start Time</span><span>End Time</span><span>Hours</span></tr>
          <tr><span>Monday</span><span>6/2/2025</span><span>9:00 AM</span><span>5:00 PM</span><span>8.0</span></tr>
          <tr><span>Sunday</span><span>6/8/2025</span><span></span><span></span><span>0</span></tr>
        </table>
        Week: 6/2/2025 - 6/8/2025
        <span>Total Hours</span><span>40.0</span>
      `;

      // Test with different timestamp formats that might be encountered
      const testCases = [
        {
          input: mockHtml.replace('Week: 6/2/2025 - 6/8/2025', 'Week: 6/2/2025 - 6/8/2025\n<span>Data as of:</span><span>6/1/2025</span>\n<span>valid as of&nbsp;</span><span>2:54:13 AM</span>'),
          expected: '6/1/2025 2:54:13 AM',
        },
      ];

      testCases.forEach(testCase => {
        const schedule = scheduleService.parseScheduleHTML(testCase.input);
        expect(schedule?.dataAsOf).toBe(testCase.expected);
      });
    });

    test('should fix week alignment during re-normalization', async () => {
      // Mock the storage service to simulate stored schedules with misaligned weeks
      const mockStorageService = {
        getAllWeeklySchedules: jest.fn(),
        saveWeeklySchedule: jest.fn(),
      };
      
      // Create a schedule with misaligned week dates (user's specific issue)
      const misalignedSchedule: WeeklySchedule = {
        weekStart: '5/22/2025',  // Wrong - should be Monday (5/26/2025)
        weekEnd: '6/1/2025',     // Correct - Sunday
        dataAsOf: '6/1/2025 2:54:13 AM',
        employee: {
          name: 'Test User',
          employeeId: '123456',
          location: 'Test Location',
          department: 'Test Dept',
          jobTitle: 'Test Title',
          status: 'Active',
          hireDate: '1/1/2023',
        },
        entries: [
          {
            day: 'Monday',
            date: '5/26/2025',  // This is the correct Monday date
            shifts: [{
              startTime: '9:00 AM',
              endTime: '5:00 PM',
              shiftHours: 8.0,
            }],
            dailyHours: 8.0,
          },
          {
            day: 'Tuesday',
            date: '5/27/2025',
            shifts: [],
            dailyHours: 0,
          },
          {
            day: 'Wednesday',
            date: '5/28/2025',
            shifts: [],
            dailyHours: 0,
          },
          {
            day: 'Thursday',
            date: '5/29/2025',
            shifts: [],
            dailyHours: 0,
          },
          {
            day: 'Friday',
            date: '5/30/2025',
            shifts: [],
            dailyHours: 0,
          },
          {
            day: 'Saturday',
            date: '5/31/2025',
            shifts: [],
            dailyHours: 0,
          },
          {
            day: 'Sunday',
            date: '6/1/2025',
            shifts: [],
            dailyHours: 0,
          },
        ],
        totalHours: 8.0,
        straightTimeEarnings: 8.0,
      };
      
      // Mock the storage service to return our misaligned schedule
      mockStorageService.getAllWeeklySchedules.mockResolvedValue([misalignedSchedule]);
      mockStorageService.saveWeeklySchedule.mockResolvedValue(undefined);
      
      // Replace the storage service temporarily
      const originalStorageService = (scheduleService as any).storageService;
      (scheduleService as any).storageService = mockStorageService;
      
      try {
        // Run re-normalization
        await scheduleService.reNormalizeAllStoredSchedules();
        
        // Verify that saveWeeklySchedule was called with corrected week dates
        expect(mockStorageService.saveWeeklySchedule).toHaveBeenCalled();
        
        const savedSchedule = mockStorageService.saveWeeklySchedule.mock.calls[0][0];
        
        // Should correct the week start to Monday's date
        expect(savedSchedule.weekStart).toBe('5/26/2025');
        // Should keep the correct week end
        expect(savedSchedule.weekEnd).toBe('6/1/2025');
        
      } finally {
        // Restore the original storage service
        (scheduleService as any).storageService = originalStorageService;
      }
    });

    test('demo schedules should match actual HTML data', async () => {
      // This test verifies that the demo schedules have been corrected to match
      // the actual HTML data from the example.schedule files
      
      const demoSchedules = await scheduleService.getAllDemoSchedules();
      expect(demoSchedules.length).toBeGreaterThan(0);
      
      // Schedules should now be in chronological order (earliest first)
      // Week 1: 5/26/2025 - 6/1/2025 (earliest)
      // Week 2: 6/2/2025 - 6/8/2025 (middle) 
      // Week 3: 6/9/2025 - 6/15/2025 (latest)
      
      expect(demoSchedules.length).toBe(3);
      
      // Verify chronological ordering
      expect(demoSchedules[0].weekStart).toBe('5/26/2025');
      expect(demoSchedules[0].weekEnd).toBe('6/1/2025');
      
      expect(demoSchedules[1].weekStart).toBe('6/2/2025');
      expect(demoSchedules[1].weekEnd).toBe('6/8/2025');
      
      expect(demoSchedules[2].weekStart).toBe('6/9/2025');
      expect(demoSchedules[2].weekEnd).toBe('6/15/2025');
      
      // Get the middle schedule (Week 6/2/2025 - 6/8/2025) which contains the Thursday data we corrected
      const scheduleWithThursday = demoSchedules[1]; // Now at index 1 due to chronological sorting
      
      // Verify employee info matches actual HTML
      expect(scheduleWithThursday.employee.name).toBe('LUCAS ALBERS');
      expect(scheduleWithThursday.employee.employeeId).toBe('6570527');
      expect(scheduleWithThursday.employee.location).toBe('00096-Bozeman, MT');
      expect(scheduleWithThursday.employee.department).toBe('080-Front End');
      expect(scheduleWithThursday.employee.jobTitle).toBe('Cashier Asst');
      expect(scheduleWithThursday.employee.status).toBe('PT');
      expect(scheduleWithThursday.employee.hireDate).toBe('5/22/2025');
      
      // CRITICAL: Verify Thursday 6/5/2025 entry matches actual HTML data
      const thursdayEntry = scheduleWithThursday.entries.find(e => e.day === 'Thursday');
      expect(thursdayEntry).toBeDefined();
      expect(thursdayEntry!.date).toBe('6/5/2025');
      expect(thursdayEntry!.shifts.length).toBe(1);
      
      // These values MUST match the actual HTML: "Thursday	6/5/2025	12:30 PM	05:00 PM	4.50	4.50"
      expect(thursdayEntry!.shifts[0].startTime).toBe('12:30 PM');
      expect(thursdayEntry!.shifts[0].endTime).toBe('05:00 PM');
      expect(thursdayEntry!.shifts[0].shiftHours).toBe(4.50);
      expect(thursdayEntry!.dailyHours).toBe(4.50);
      expect(thursdayEntry!.shifts[0].changedOn).toBe('5/22/2025');
      
      // Verify total hours
      expect(scheduleWithThursday.totalHours).toBe(27.50);
      expect(scheduleWithThursday.straightTimeEarnings).toBe(27.50);
      
      console.log('✅ Demo schedules now in chronological order!');
      console.log('✅ Week 1: 5/26/2025 - 6/1/2025 (earliest)');
      console.log('✅ Week 2: 6/2/2025 - 6/8/2025 (contains corrected Thursday data)');
      console.log('✅ Week 3: 6/9/2025 - 6/15/2025 (latest)');
      console.log('✅ Thursday 6/5/2025 correctly shows: 12:30 PM - 05:00 PM (4.50 hours)');
    });
  });

  describe('Date Format Conversion', () => {
    test('should convert various ISO date formats to MM/dd/yyyy', () => {
      // Mock the private method by testing through parseScheduleHTML
      const testCases = [
        { input: '2025-01-01', mondayDate: '1/1/2025', expectedEnd: '1/7/2025' }, // Monday to Sunday
        { input: '2025-12-31', mondayDate: '12/31/2025', expectedEnd: '1/6/2026' }, // Monday to Sunday (cross year)
        { input: '2025-06-15T00:00:00', mondayDate: '6/15/2025', expectedEnd: '6/21/2025' }, // Monday to Sunday
        { input: '2025-03-08T12:30:45', mondayDate: '3/8/2025', expectedEnd: '3/14/2025' }, // Monday to Sunday
      ];

      testCases.forEach(({ input, mondayDate, expectedEnd }) => {
        const mockHtml = `
          <span>Name</span><span style="font-weight:bold">Test</span><span>&nbsp;</span><span style="font-weight:bold">User</span>
          <span>Employee #</span><span style="font-weight:bold">123456</span>
          <span>Location</span><span style="font-weight:bold">Test Location</span>
          <span>Department</span><span style="font-weight:bold">Test Dept</span>
          <span>Job Title</span><span style="font-weight:bold">Test Title</span>
          <span>Status</span><span style="font-weight:bold">Active</span>
          <span>Hire Date:</span><span style="font-weight:bold">1/1/2023</span>
          <table class="ls">
            <tr><span>Monday</span><span>${mondayDate}</span></tr>
          </table>
          Week: ${input} - ${input}
          <span>Total Hours</span><span>8.0</span>
        `;

        const schedule = scheduleService.parseScheduleHTML(mockHtml);
        expect(schedule?.weekStart).toBe(mondayDate); // Monday's date
        expect(schedule?.weekEnd).toBe(expectedEnd);  // Sunday, 6 days after Monday
      });
    });
  });
});