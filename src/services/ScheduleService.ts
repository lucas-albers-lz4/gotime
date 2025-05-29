import { Platform } from 'react-native';
import { 
  WeeklySchedule, 
  ScheduleEntry, 
  ScheduleShift, 
  EmployeeInfo, 
  ScheduleWeekOption,
  ScheduleMetadata,
} from '../types';
import StorageService from './StorageService';

export class ScheduleService {
  private static instance: ScheduleService;
  private storageService: typeof StorageService;

  private constructor() {
    this.storageService = StorageService;
  }

  public static getInstance(): ScheduleService {
    if (!ScheduleService.instance) {
      ScheduleService.instance = new ScheduleService();
    }
    return ScheduleService.instance;
  }

  /**
   * Parse corporate BI HTML schedule format
   */
  public parseScheduleHTML(html: string): WeeklySchedule | null {
    try {
      // Extract employee information
      const employee = this.extractEmployeeInfo(html);
      if (!employee) {
        throw new Error('Could not extract employee information');
      }

      // Extract week information
      const weekInfo = this.extractWeekInfo(html);
      if (!weekInfo) {
        throw new Error('Could not extract week information');
      }

      // Extract data as of timestamp
      const dataAsOf = this.extractDataAsOf(html);

      // Extract schedule entries
      const entries = this.extractScheduleEntries(html);

      // Extract total hours
      const totalHours = this.extractTotalHours(html);

      // Extract straight time earnings
      const straightTimeEarnings = this.extractStraightTimeEarnings(html);

      return {
        weekStart: weekInfo.start,
        weekEnd: weekInfo.end,
        dataAsOf: dataAsOf || '',
        employee,
        entries,
        totalHours: totalHours || 0,
        straightTimeEarnings: straightTimeEarnings || 0,
      };
    } catch (error) {
      console.error('Error parsing schedule HTML:', error);
      return null;
    }
  }

  /**
   * Extract employee information from HTML
   */
  private extractEmployeeInfo(html: string): EmployeeInfo | null {
    try {
      // Extract name (appears in multiple places, look for the header format)
      const nameMatch = html.match(/<span[^>]*style="[^"]*font-size:14pt[^"]*"[^>]*>([A-Z]+)<\/span>[^<]*<span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*><br[^>]*>[^<]*<\/span>[^<]*<span[^>]*style="[^"]*font-size:14pt[^"]*"[^>]*>([A-Z]+)<\/span>/);
      const firstName = nameMatch ? nameMatch[1] : '';
      const lastName = nameMatch ? nameMatch[2] : '';
      const name = `${firstName} ${lastName}`.trim();

      // Extract employee ID
      const employeeIdMatch = html.match(/<span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>(\d+)<\/span>/);
      const employeeId = employeeIdMatch ? employeeIdMatch[1] : '';

      // Extract location
      const locationMatch = html.match(/<span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>(\d+-[^<]+)<\/span>/);
      const location = locationMatch ? locationMatch[1] : '';

      // Extract department
      const departmentMatch = html.match(/<td[^>]*><span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>Department<\/span><\/td>[^<]*<td[^>]*><span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>([^<]+)<\/span>/);
      const department = departmentMatch ? departmentMatch[1] : '';

      // Extract job title
      const jobTitleMatch = html.match(/<td[^>]*><span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>Job Title<\/span><\/td>[^<]*<td[^>]*><span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>([^<]+)<\/span>/);
      const jobTitle = jobTitleMatch ? jobTitleMatch[1] : '';

      // Extract status
      const statusMatch = html.match(/<td[^>]*><span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>Status[^<]*<\/span><\/td>[^<]*<td[^>]*><span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>([^<]+)<\/span>/);
      const status = statusMatch ? statusMatch[1] : '';

      // Extract hire date
      const hireDateMatch = html.match(/<span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>Hire Date:[^<]*<\/span>[^<]*<span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>[^<]*([0-9/]+)<\/span>/);
      const hireDate = hireDateMatch ? hireDateMatch[1] : '';

      if (!name || !employeeId) {
        return null;
      }

      return {
        name,
        employeeId,
        location,
        department,
        jobTitle,
        status,
        hireDate,
      };
    } catch (error) {
      console.error('Error extracting employee info:', error);
      return null;
    }
  }

  /**
   * Extract week start and end dates
   */
  private extractWeekInfo(html: string): { start: string; end: string } | null {
    try {
      // Look for week range in format "6/2/2025 - 6/8/2025"
      const weekMatch = html.match(/(\d+\/\d+\/\d+)\s*-[^<]*(\d+\/\d+\/\d+)/);
      if (weekMatch) {
        return {
          start: weekMatch[1],
          end: weekMatch[2],
        };
      }
      return null;
    } catch (error) {
      console.error('Error extracting week info:', error);
      return null;
    }
  }

  /**
   * Extract "Data as of" timestamp
   */
  private extractDataAsOf(html: string): string | null {
    try {
      // Extract date from "Data as of:5/29/2025" pattern
      const dateMatch = html.match(/Data as of:\s*([^<\s]+)/i);
      
      // Extract time from "valid as of 7:24:02 AM" pattern
      const timeMatch = html.match(/valid as of[^>]*>\s*([^<]+)/i);
      
      if (dateMatch && timeMatch) {
        const date = dateMatch[1].trim();
        const time = timeMatch[1].trim();
        return `${date} ${time}`;
      }
      
      // Fallback to just date if time not found
      if (dateMatch) {
        return dateMatch[1].trim();
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting data as of:', error);
      return null;
    }
  }

  /**
   * Extract schedule entries from the table
   */
  private extractScheduleEntries(html: string): ScheduleEntry[] {
    try {
      const entries: ScheduleEntry[] = [];
      
      // Find the schedule table (look for table with "Weekly Schedule Detail")
      const tableMatch = html.match(/<table[^>]*class="ls"[^>]*LID="List3_NS_"[^>]*>(.*?)<\/table>/s);
      if (!tableMatch) {
        return entries;
      }

      const tableContent = tableMatch[1];
      
      // Extract all table rows (skip header rows)
      const rowMatches = tableContent.match(/<tr[^>]*>.*?<\/tr>/gs);
      if (!rowMatches) {
        return entries;
      }

      let currentDay = '';
      let currentDate = '';
      let currentShifts: ScheduleShift[] = [];
      let currentDailyHours = 0;

      for (const row of rowMatches) {
        // Skip header rows
        if (row.includes('Weekly Schedule Detail') || 
            row.includes('Start Time') || 
            row.includes('Total Hours')) {
          continue;
        }

        // Extract cell contents
        const cells = this.extractTableCells(row);
        if (cells.length < 6) {
          continue;
        }

        const day = cells[0].trim();
        const date = cells[1].trim();
        const startTime = cells[2].trim();
        const endTime = cells[3].trim();
        const shiftHours = parseFloat(cells[4]) || 0;
        const dailyHours = parseFloat(cells[5]) || 0;
        const altLocation = cells[6]?.trim() || '';
        const altDeptJob = cells[7]?.trim() || '';
        const payCode = cells[8]?.trim() || '';
        const changedOn = cells[9]?.trim() || '';

        // Check if this is a new day or continuation of current day
        if (day && day !== currentDay) {
          // Save previous day if it exists
          if (currentDay && currentDate) {
            entries.push({
              day: currentDay,
              date: currentDate,
              shifts: [...currentShifts],
              dailyHours: currentDailyHours,
            });
          }

          // Start new day
          currentDay = day;
          currentDate = date;
          currentShifts = [];
          currentDailyHours = dailyHours;
        }

        // Add shift if there are times
        if (startTime && endTime) {
          currentShifts.push({
            startTime,
            endTime,
            shiftHours,
            altLocation: altLocation || undefined,
            altDeptJob: altDeptJob || undefined,
            payCode: payCode || undefined,
            changedOn: changedOn || undefined,
          });
        }

        // Update daily hours if provided
        if (dailyHours > 0) {
          currentDailyHours = dailyHours;
        }
      }

      // Add the last day
      if (currentDay && currentDate) {
        entries.push({
          day: currentDay,
          date: currentDate,
          shifts: [...currentShifts],
          dailyHours: currentDailyHours,
        });
      }

      return entries;
    } catch (error) {
      console.error('Error extracting schedule entries:', error);
      return [];
    }
  }

  /**
   * Extract cell contents from a table row
   */
  private extractTableCells(row: string): string[] {
    const cells: string[] = [];
    const cellMatches = row.match(/<td[^>]*>.*?<\/td>/gs);
    
    if (cellMatches) {
      for (const cell of cellMatches) {
        // Extract text content, handling nested spans
        const textMatch = cell.match(/<span[^>]*>([^<]*)<\/span>/);
        const text = textMatch ? textMatch[1] : '';
        cells.push(text.replace(/&nbsp;/g, ' ').trim());
      }
    }
    
    return cells;
  }

  /**
   * Extract total hours from the schedule
   */
  private extractTotalHours(html: string): number | null {
    try {
      const totalMatch = html.match(/<span[^>]*>Total Hours<\/span>[^<]*<\/td>[^<]*<td[^>]*><span[^>]*>([0-9.]+)<\/span>/);
      return totalMatch ? parseFloat(totalMatch[1]) : null;
    } catch (error) {
      console.error('Error extracting total hours:', error);
      return null;
    }
  }

  /**
   * Extract straight time earnings
   */
  private extractStraightTimeEarnings(html: string): number | null {
    try {
      const earningsMatch = html.match(/<span[^>]*>Straight Time Earnings<\/span>[^<]*<\/td>[^<]*<td[^>]*><span[^>]*>([0-9.]+)<\/span>/);
      return earningsMatch ? parseFloat(earningsMatch[1]) : null;
    } catch (error) {
      console.error('Error extracting straight time earnings:', error);
      return null;
    }
  }

  /**
   * Extract available week options from dropdown
   */
  public extractWeekOptions(html: string): ScheduleWeekOption[] {
    try {
      const options: ScheduleWeekOption[] = [];
      
      // Look for select options in the dropdown
      const optionMatches = html.match(/<option[^>]*value="([^"]*)"[^>]*dv="([^"]*)"[^>]*>([^<]*)<\/option>/g);
      
      if (optionMatches) {
        for (const option of optionMatches) {
          const match = option.match(/<option[^>]*value="([^"]*)"[^>]*dv="([^"]*)"[^>]*>([^<]*)<\/option>/);
          if (match) {
            options.push({
              value: match[1],
              displayValue: match[2],
              endDate: match[3],
            });
          }
        }
      }
      
      return options;
    } catch (error) {
      console.error('Error extracting week options:', error);
      return [];
    }
  }

  /**
   * Save schedule to local storage
   */
  public async saveSchedule(schedule: WeeklySchedule): Promise<void> {
    try {
      const key = `schedule_${schedule.employee.employeeId}_${schedule.weekEnd}`;
      await this.storageService.setItem(key, JSON.stringify(schedule));
      
      // Update schedule list
      const scheduleList = await this.getScheduleList();
      const existingIndex = scheduleList.findIndex(s => 
        s.employeeId === schedule.employee.employeeId && s.weekEnd === schedule.weekEnd,
      );
      
      const scheduleInfo = {
        employeeId: schedule.employee.employeeId,
        weekStart: schedule.weekStart,
        weekEnd: schedule.weekEnd,
        totalHours: schedule.totalHours,
        savedAt: Date.now(),
      };
      
      if (existingIndex >= 0) {
        scheduleList[existingIndex] = scheduleInfo;
      } else {
        scheduleList.push(scheduleInfo);
      }
      
      await this.storageService.setItem('schedule_list', JSON.stringify(scheduleList));
    } catch (error) {
      console.error('Error saving schedule:', error);
      throw error;
    }
  }

  /**
   * Get saved schedule
   */
  public async getSchedule(employeeId: string, weekEnd: string): Promise<WeeklySchedule | null> {
    try {
      const key = `schedule_${employeeId}_${weekEnd}`;
      const data = await this.storageService.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting schedule:', error);
      return null;
    }
  }

  /**
   * Get list of saved schedules
   */
  public async getScheduleList(): Promise<ScheduleMetadata[]> {
    try {
      const data = await this.storageService.getItem('schedule_list');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting schedule list:', error);
      return [];
    }
  }

  /**
   * Get all available demo schedules
   */
  public async getAllDemoSchedules(): Promise<WeeklySchedule[]> {
    try {
      console.log('ScheduleService: getAllDemoSchedules called');
      
      const demoSchedules: WeeklySchedule[] = [
        {
          weekStart: '6/2/2025',
          weekEnd: '6/8/2025',
          dataAsOf: '5/29/2025 7:24:02 AM',
          employee: {
            name: 'Lucas Albers',
            employeeId: '6570527',
            location: 'Bozeman MT',
            department: 'Front End',
            jobTitle: 'Cashier Asst',
            status: 'Active',
            hireDate: '2023-03-15',
          },
          entries: [
            {
              day: 'Monday',
              date: '6/2/2025',
              shifts: [],
              dailyHours: 0,
            },
            {
              day: 'Tuesday',
              date: '6/3/2025',
              shifts: [{
                startTime: '01:00 PM',
                endTime: '05:30 PM',
                shiftHours: 4.50,
                changedOn: '5/22/2025',
              }],
              dailyHours: 4.50,
            },
            {
              day: 'Wednesday',
              date: '6/4/2025',
              shifts: [{
                startTime: '12:30 PM',
                endTime: '05:00 PM',
                shiftHours: 4.50,
                changedOn: '5/22/2025',
              }],
              dailyHours: 4.50,
            },
            {
              day: 'Thursday',
              date: '6/5/2025',
              shifts: [{
                startTime: '12:30 PM',
                endTime: '05:00 PM',
                shiftHours: 4.50,
                changedOn: '5/22/2025',
              }],
              dailyHours: 4.50,
            },
            {
              day: 'Friday',
              date: '6/6/2025',
              shifts: [
                {
                  startTime: '12:30 PM',
                  endTime: '04:15 PM',
                  shiftHours: 3.25,
                },
                {
                  startTime: '04:15 PM',
                  endTime: '08:00 PM',
                  shiftHours: 3.75,
                },
              ],
              dailyHours: 7.00,
            },
            {
              day: 'Saturday',
              date: '6/7/2025',
              shifts: [
                {
                  startTime: '12:00 PM',
                  endTime: '03:45 PM',
                  shiftHours: 3.25,
                },
                {
                  startTime: '03:45 PM',
                  endTime: '07:30 PM',
                  shiftHours: 3.75,
                },
              ],
              dailyHours: 7.00,
            },
            {
              day: 'Sunday',
              date: '6/8/2025',
              shifts: [],
              dailyHours: 0,
            },
          ],
          totalHours: 27.50,
          straightTimeEarnings: 27.50,
        },
        
        // Schedule 2: Week 2
        {
          weekStart: '6/9/2025',
          weekEnd: '6/15/2025',
          dataAsOf: '6/5/2025 8:15:30 AM',
          employee: {
            name: 'Lucas Albers',
            employeeId: '6570527',
            location: 'Bozeman MT',
            department: 'Front End',
            jobTitle: 'Cashier Asst',
            status: 'Active',
            hireDate: '2023-03-15',
          },
          entries: [
            {
              day: 'Monday',
              date: '6/9/2025',
              shifts: [{
                startTime: '02:00 PM',
                endTime: '06:30 PM',
                shiftHours: 4.50,
              }],
              dailyHours: 4.50,
            },
            {
              day: 'Tuesday',
              date: '6/10/2025',
              shifts: [],
              dailyHours: 0,
            },
            {
              day: 'Wednesday',
              date: '6/11/2025',
              shifts: [{
                startTime: '01:00 PM',
                endTime: '06:00 PM',
                shiftHours: 5.00,
              }],
              dailyHours: 5.00,
            },
            {
              day: 'Thursday',
              date: '6/12/2025',
              shifts: [{
                startTime: '11:00 AM',
                endTime: '04:00 PM',
                shiftHours: 5.00,
              }],
              dailyHours: 5.00,
            },
            {
              day: 'Friday',
              date: '6/13/2025',
              shifts: [{
                startTime: '03:00 PM',
                endTime: '08:00 PM',
                shiftHours: 5.00,
              }],
              dailyHours: 5.00,
            },
            {
              day: 'Saturday',
              date: '6/14/2025',
              shifts: [
                {
                  startTime: '10:00 AM',
                  endTime: '02:00 PM',
                  shiftHours: 4.00,
                },
                {
                  startTime: '02:00 PM',
                  endTime: '06:00 PM',
                  shiftHours: 4.00,
                },
              ],
              dailyHours: 8.00,
            },
            {
              day: 'Sunday',
              date: '6/15/2025',
              shifts: [],
              dailyHours: 0,
            },
          ],
          totalHours: 31.50,
          straightTimeEarnings: 31.50,
        },
        
        // Schedule 3: Week 3
        {
          weekStart: '6/16/2025',
          weekEnd: '6/22/2025',
          dataAsOf: '6/12/2025 9:45:15 AM',
          employee: {
            name: 'Lucas Albers',
            employeeId: '6570527',
            location: 'Bozeman MT',
            department: 'Front End',
            jobTitle: 'Cashier Asst',
            status: 'Active',
            hireDate: '2023-03-15',
          },
          entries: [
            {
              day: 'Monday',
              date: '6/16/2025',
              shifts: [{
                startTime: '12:00 PM',
                endTime: '05:00 PM',
                shiftHours: 5.00,
              }],
              dailyHours: 5.00,
            },
            {
              day: 'Tuesday',
              date: '6/17/2025',
              shifts: [{
                startTime: '01:30 PM',
                endTime: '06:00 PM',
                shiftHours: 4.50,
              }],
              dailyHours: 4.50,
            },
            {
              day: 'Wednesday',
              date: '6/18/2025',
              shifts: [],
              dailyHours: 0,
            },
            {
              day: 'Thursday',
              date: '6/19/2025',
              shifts: [{
                startTime: '02:00 PM',
                endTime: '07:00 PM',
                shiftHours: 5.00,
              }],
              dailyHours: 5.00,
            },
            {
              day: 'Friday',
              date: '6/20/2025',
              shifts: [
                {
                  startTime: '11:00 AM',
                  endTime: '03:00 PM',
                  shiftHours: 4.00,
                },
                {
                  startTime: '03:00 PM',
                  endTime: '07:00 PM',
                  shiftHours: 4.00,
                },
              ],
              dailyHours: 8.00,
            },
            {
              day: 'Saturday',
              date: '6/21/2025',
              shifts: [{
                startTime: '09:00 AM',
                endTime: '02:00 PM',
                shiftHours: 5.00,
              }],
              dailyHours: 5.00,
            },
            {
              day: 'Sunday',
              date: '6/22/2025',
              shifts: [],
              dailyHours: 0,
            },
          ],
          totalHours: 31.50,
          straightTimeEarnings: 31.50,
        },
      ];
      
      console.log('ScheduleService: Created', demoSchedules.length, 'demo schedules');
      return demoSchedules;
    } catch (error) {
      console.error('ScheduleService: Error creating demo schedules:', error);
      return [];
    }
  }

  /**
   * Load demo schedule from example files (for testing)
   */
  public async loadDemoSchedule(weekIndex: number = 0): Promise<WeeklySchedule | null> {
    try {
      console.log('ScheduleService: loadDemoSchedule called, Platform.OS:', Platform.OS, 'weekIndex:', weekIndex);
      
      const demoSchedules = await this.getAllDemoSchedules();
      if (demoSchedules.length === 0) {
        console.log('ScheduleService: No demo schedules available');
        return null;
      }
      
      const selectedSchedule = demoSchedules[weekIndex % demoSchedules.length];
      console.log('ScheduleService: Demo schedule selected for week:', selectedSchedule.weekStart, '-', selectedSchedule.weekEnd);
      return selectedSchedule;
    } catch (error) {
      console.error('ScheduleService: Error loading demo schedule:', error);
      return null;
    }
  }
}