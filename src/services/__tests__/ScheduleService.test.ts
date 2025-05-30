import { ScheduleService } from '../ScheduleService';
import { readFileSync } from 'fs';
import { join } from 'path';

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
        expect(schedule.weekStart).toBe('6/2/2025');
        expect(schedule.weekEnd).toBe('6/8/2025');
      }
    });
  });
}); 