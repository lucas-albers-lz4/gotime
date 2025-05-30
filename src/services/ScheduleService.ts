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
      console.log('📄 [SCHEDULE] Starting HTML parsing, content length:', html.length);
      
      // Extract employee information
      const employee = this.extractEmployeeInfo(html);
      if (!employee) {
        console.log('❌ [SCHEDULE] Failed to extract employee information');
        throw new Error('Could not extract employee information');
      }

      // Extract week information
      const weekInfo = this.extractWeekInfo(html);
      if (!weekInfo) {
        console.log('❌ [SCHEDULE] Failed to extract week information');
        throw new Error('Could not extract week information');
      }
      console.log('✅ [SCHEDULE] Week info extracted:', weekInfo);

      // Extract data as of timestamp
      const dataAsOf = this.extractDataAsOf(html);
      console.log('📅 [SCHEDULE] Data as of:', dataAsOf);

      // Extract schedule entries
      const entries = this.extractScheduleEntries(html);
      console.log('📋 [SCHEDULE] Extracted', entries.length, 'schedule entries');

      // Extract total hours
      const totalHours = this.extractTotalHours(html);
      console.log('⏰ [SCHEDULE] Total hours:', totalHours);

      // Extract straight time earnings
      const straightTimeEarnings = this.extractStraightTimeEarnings(html);
      console.log('💰 [SCHEDULE] Straight time earnings:', straightTimeEarnings);

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
      // Extract name from the table format (more reliable than header format)
      // Try multiple patterns to handle different HTML structures
      let nameMatch = html.match(/<span[^>]*>Name<\/span>.*?<span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>([^<]+)<\/span>[^<]*<span[^>]*>&nbsp;<\/span>[^<]*<span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>([^<]+)<\/span>/s);
      
      // If first pattern doesn't work, try a more flexible pattern
      if (!nameMatch) {
        nameMatch = html.match(/<span[^>]*>Name<\/span>.*?<span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>([A-Z]+)<\/span>[^<]*<span[^>]*>&nbsp;<\/span>[^<]*<span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>([A-Z]+)<\/span>/s);
      }
      
      // Try even more flexible pattern
      if (!nameMatch) {
        nameMatch = html.match(/Name<\/span>.*?<span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>([A-Z]+)<\/span>.*?<span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>([A-Z]+)<\/span>/s);
      }
      
      const firstName = nameMatch ? nameMatch[1].trim() : '';
      const lastName = nameMatch ? nameMatch[2].trim() : '';
      const name = `${firstName} ${lastName}`.trim();

      // Extract employee ID - look for Employee # label followed by the ID
      let employeeIdMatch = html.match(/<span[^>]*>Employee #<\/span>.*?<span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>(\d+)<\/span>/s);
      
      // Try more flexible pattern
      if (!employeeIdMatch) {
        employeeIdMatch = html.match(/Employee #<\/span>.*?<span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>(\d+)<\/span>/s);
      }
      
      const employeeId = employeeIdMatch ? employeeIdMatch[1] : '';

      // Extract location - look for Location label
      let locationMatch = html.match(/<span[^>]*>Location<\/span>.*?<span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>([^<]+)<\/span>/s);
      
      // Try more flexible pattern
      if (!locationMatch) {
        locationMatch = html.match(/Location<\/span>.*?<span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>([^<]+)<\/span>/s);
      }
      
      const location = locationMatch ? locationMatch[1].trim() : '';

      // Extract department - look for Department label
      let departmentMatch = html.match(/<span[^>]*>Department<\/span>.*?<span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>([^<]+)<\/span>/s);
      
      // Try more flexible pattern
      if (!departmentMatch) {
        departmentMatch = html.match(/Department<\/span>.*?<span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>([^<]+)<\/span>/s);
      }
      
      const department = departmentMatch ? departmentMatch[1].trim() : '';

      // Extract job title - look for Job Title label
      let jobTitleMatch = html.match(/<span[^>]*>Job Title<\/span>.*?<span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>([^<]+)<\/span>/s);
      
      // Try more flexible pattern
      if (!jobTitleMatch) {
        jobTitleMatch = html.match(/Job Title<\/span>.*?<span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>([^<]+)<\/span>/s);
      }
      
      const jobTitle = jobTitleMatch ? jobTitleMatch[1].trim() : '';

      // Extract status - look for Status label
      let statusMatch = html.match(/<span[^>]*>Status[^<]*<\/span>.*?<span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>([^<]+)<\/span>/s);
      
      // Try more flexible pattern
      if (!statusMatch) {
        statusMatch = html.match(/Status[^<]*<\/span>.*?<span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>([^<]+)<\/span>/s);
      }
      
      const status = statusMatch ? statusMatch[1].trim() : '';

      // Extract hire date - look for Hire Date pattern
      let hireDateMatch = html.match(/<span[^>]*>Hire Date:[^<]*<\/span>[^<]*<span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>[^<]*?([0-9\/]+)<\/span>/s);
      
      // Try more flexible pattern
      if (!hireDateMatch) {
        hireDateMatch = html.match(/Hire Date:[^<]*<\/span>[^<]*<span[^>]*style="[^"]*font-weight:bold[^"]*"[^>]*>[^<]*?([0-9\/]+)<\/span>/s);
      }
      
      const hireDate = hireDateMatch ? hireDateMatch[1].trim() : '';

      console.log('🔍 [SCHEDULE] Extraction results:');
      console.log('Name match:', !!nameMatch, 'Result:', name);
      console.log('Employee ID match:', !!employeeIdMatch, 'Result:', employeeId);
      console.log('Location match:', !!locationMatch, 'Result:', location);
      console.log('Department match:', !!departmentMatch, 'Result:', department);
      console.log('Job Title match:', !!jobTitleMatch, 'Result:', jobTitle);
      console.log('Status match:', !!statusMatch, 'Result:', status);
      console.log('Hire Date match:', !!hireDateMatch, 'Result:', hireDate);

      if (!name || !employeeId) {
        console.log('❌ [SCHEDULE] Missing required fields - name:', name, 'employeeId:', employeeId);
        return null;
      }

      console.log('✅ [SCHEDULE] Successfully extracted employee info:', {
        name,
        employeeId,
        location,
        department,
        jobTitle,
        status,
        hireDate,
      });

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
      // Look for week range in format "6/2/2025 - 6/8/2025" or "5/26/2025 - 6/1/2025"
      let weekMatch = html.match(/(\d+\/\d+\/\d+)\s*-[^<]*(\d+\/\d+\/\d+)/);
      
      // Try alternative patterns
      if (!weekMatch) {
        weekMatch = html.match(/Week:[^<]*(\d+\/\d+\/\d+)[^<]*-[^<]*(\d+\/\d+\/\d+)/);
      }
      
      if (!weekMatch) {
        weekMatch = html.match(/(\d{1,2}\/\d{1,2}\/\d{4})[^<]*-[^<]*(\d{1,2}\/\d{1,2}\/\d{4})/);
      }
      
      // If no explicit week range found, try to derive from schedule dates
      if (!weekMatch) {
        console.log('🔍 [SCHEDULE] No explicit week range found, trying to derive from schedule dates...');
        
        // Extract all dates from the schedule table
        const dateMatches = html.match(/<span[^>]*>(\d+\/\d+\/\d+)<\/span>/g);
        if (dateMatches) {
          const dates: string[] = [];
          for (const match of dateMatches) {
            const dateMatch = match.match(/>(\d+\/\d+\/\d+)</);
            if (dateMatch) {
              dates.push(dateMatch[1]);
            }
          }
          
          console.log('🔍 [SCHEDULE] Raw dates found:', dates);
          
          // Remove duplicates and sort chronologically
          const uniqueDates = [...new Set(dates)].sort((a, b) => {
            // Parse dates more explicitly: M/D/YYYY format
            const [monthA, dayA, yearA] = a.split('/').map(Number);
            const [monthB, dayB, yearB] = b.split('/').map(Number);
            
            const dateA = new Date(yearA, monthA - 1, dayA); // Month is 0-indexed
            const dateB = new Date(yearB, monthB - 1, dayB);
            
            console.log('🔍 [SCHEDULE] Comparing dates:', a, '(', dateA.toISOString(), ') vs', b, '(', dateB.toISOString(), ')');
            
            return dateA.getTime() - dateB.getTime();
          });
          
          console.log('🔍 [SCHEDULE] Sorted unique dates:', uniqueDates);
          
          if (uniqueDates.length >= 2) {
            // Use first and last dates as week range
            const start = uniqueDates[0];
            const end = uniqueDates[uniqueDates.length - 1];
            console.log('✅ [SCHEDULE] Derived week info from schedule dates:', start, '-', end);
            console.log('🔍 [SCHEDULE] Week start (first date):', start);
            console.log('🔍 [SCHEDULE] Week end (last date):', end);
            return { start, end };
          }
        }
      }
      
      // Try to find dates in the EndDate parameter (from the XML-like content)
      if (!weekMatch) {
        console.log('🔍 [SCHEDULE] Trying to extract from EndDate parameter...');
        const endDateMatch = html.match(/EndDate.*?2025-(\d{2})-(\d{2})/);
        if (endDateMatch) {
          const month = endDateMatch[1];
          const day = endDateMatch[2];
          const endDate = `${parseInt(month)}/${parseInt(day)}/2025`;
          
          // Calculate start date (assuming 7-day week)
          const endDateObj = new Date(2025, parseInt(month) - 1, parseInt(day));
          const startDateObj = new Date(endDateObj.getTime() - (6 * 24 * 60 * 60 * 1000));
          const startDate = `${startDateObj.getMonth() + 1}/${startDateObj.getDate()}/2025`;
          
          console.log('✅ [SCHEDULE] Derived week info from EndDate parameter:', startDate, '-', endDate);
          return { start: startDate, end: endDate };
        }
      }
      
      if (weekMatch) {
        console.log('✅ [SCHEDULE] Week info extracted:', weekMatch[1], '-', weekMatch[2]);
        return {
          start: weekMatch[1],
          end: weekMatch[2],
        };
      }
      
      console.log('❌ [SCHEDULE] Could not extract week info');
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
      // Extract date from "Data as of:" pattern with better HTML structure matching
      let dateMatch = html.match(/<span[^>]*>Data as of:<\/span>[^<]*<span[^>]*>([^<]+)<\/span>/i);
      
      // Try more flexible patterns
      if (!dateMatch) {
        dateMatch = html.match(/Data as of:[^<]*<\/span>[^<]*<span[^>]*>([^<]+)<\/span>/i);
      }
      
      if (!dateMatch) {
        dateMatch = html.match(/Data as of:\s*([^<\s]+)/i);
      }
      
      // Extract time from "valid as of" pattern
      let timeMatch = html.match(/valid as of[^>]*>\s*([^<]+)/i);
      
      // Try alternative time patterns
      if (!timeMatch) {
        timeMatch = html.match(/valid as of[^<]*([0-9]{1,2}:[0-9]{2}:[0-9]{2}\s*[AP]M)/i);
      }
      
      if (dateMatch && timeMatch) {
        const date = dateMatch[1].trim();
        const time = timeMatch[1].trim();
        console.log('✅ [SCHEDULE] Data as of extracted:', `${date} ${time}`);
        return `${date} ${time}`;
      }
      
      // Fallback to just date if time not found
      if (dateMatch) {
        console.log('✅ [SCHEDULE] Data as of (date only) extracted:', dateMatch[1].trim());
        return dateMatch[1].trim();
      }
      
      console.log('❌ [SCHEDULE] Could not extract data as of timestamp');
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
    const entries: ScheduleEntry[] = [];
    
    try {
      // Look for the schedule table - try multiple patterns
      let tableMatch = html.match(/<table[^>]*class="ls"[^>]*>.*?<\/table>/s);
      
      // Try alternative table patterns
      if (!tableMatch) {
        tableMatch = html.match(/<table[^>]*>.*?Weekly Schedule Detail.*?<\/table>/s);
      }
      
      if (!tableMatch) {
        tableMatch = html.match(/<table[^>]*>.*?<span[^>]*>Day<\/span>.*?<\/table>/s);
      }
      
      if (!tableMatch) {
        console.log('❌ [SCHEDULE] Could not find schedule table');
        return entries;
      }
      
      const tableHtml = tableMatch[0];
      console.log('✅ [SCHEDULE] Found schedule table, length:', tableHtml.length);
      
      // Extract all table rows - more flexible pattern
      const rowMatches = tableHtml.match(/<tr[^>]*>.*?<\/tr>/gs);
      
      if (!rowMatches) {
        console.log('❌ [SCHEDULE] No table rows found');
        return entries;
      }
      
      console.log('🔍 [SCHEDULE] Found', rowMatches.length, 'table rows');
      
      // Skip header rows and process data rows
      let dataRowsFound = 0;
      let currentDay = '';
      let currentDate = '';
      let currentShifts: ScheduleShift[] = [];
      let currentDailyHours = 0;
      
      for (let i = 0; i < rowMatches.length; i++) {
        const row = rowMatches[i];
        
        // Skip header rows (contain "Day", "Date", etc.)
        if (row.includes('Day</span>') || row.includes('Date</span>') || row.includes('Start Time</span>') || row.includes('Weekly Schedule Detail')) {
          console.log('🔍 [SCHEDULE] Skipping header row', i);
          continue;
        }
        
        console.log('🔍 [SCHEDULE] ===== PROCESSING ROW', i, '=====');
        console.log('🔍 [SCHEDULE] Raw HTML row:', row);
        
        // Extract day information using more flexible patterns
        const dayMatch = row.match(/<span[^>]*>([A-Za-z]+)<\/span>/);
        const dateMatch = row.match(/<span[^>]*>(\d+\/\d+\/\d+)<\/span>/);
        
        console.log('🔍 [SCHEDULE] Day regex match:', dayMatch);
        console.log('🔍 [SCHEDULE] Date regex match:', dateMatch);
        
        // Extract times - handle both 12-hour and 24-hour formats, more flexible
        const allSpans = row.match(/<span[^>]*>([^<]*)<\/span>/g) || [];
        console.log('🔍 [SCHEDULE] All span matches (raw):', allSpans);
        
        const spanContents = allSpans.map(span => {
          const match = span.match(/>([^<]*)</);
          return match ? match[1].trim() : '';
        });
        
        console.log('🔍 [SCHEDULE] All span contents for row:', spanContents);
        
        // Look for time patterns in span contents
        const timePattern = /(\d{1,2}:\d{2}\s*[AP]M)/;
        const hourPattern = /^(\d+\.?\d*)$/;
        
        const times = spanContents.filter(content => timePattern.test(content));
        const hours = spanContents.filter(content => hourPattern.test(content) && parseFloat(content) > 0 && parseFloat(content) <= 24);
        
        console.log('🔍 [SCHEDULE] Extracted times:', times);
        console.log('🔍 [SCHEDULE] Extracted hours:', hours);
        
        // Check if this is a data row (has either day name or date with times)
        const hasDay = dayMatch && dayMatch[1];
        const hasDate = dateMatch && dateMatch[1];
        const hasTimes = times.length >= 2;
        const hasHours = hours.length >= 1;
        
        console.log('🔍 [SCHEDULE] Row analysis - hasDay:', hasDay, 'hasDate:', hasDate, 'hasTimes:', hasTimes, 'hasHours:', hasHours);
        
        if ((hasDay && hasDate) || (hasDate && hasTimes && hasHours)) {
          dataRowsFound++;
          
          let dayName = '';
          let date = '';
          
          if (hasDay) {
            // This is a new day row
            dayName = dayMatch[1];
            date = dateMatch[1];
          } else if (hasDate && currentDate === dateMatch[1]) {
            // This is a continuation row for the same date
            dayName = currentDay;
            date = currentDate;
            console.log('🔍 [SCHEDULE] Found continuation row for same date:', date);
          } else {
            // Skip this row if we can't determine the day
            console.log('🔍 [SCHEDULE] Skipping row - cannot determine day/date relationship');
            continue;
          }
          
          // Extract start and end times
          let startTime = '';
          let endTime = '';
          
          if (times.length >= 2) {
            startTime = times[0];
            endTime = times[1];
          }
          
          // Extract hours
          let shiftHours = 0;
          let dailyHours = 0;
          
          if (hours.length >= 1) {
            shiftHours = parseFloat(hours[0]);
          }
          if (hours.length >= 2) {
            dailyHours = parseFloat(hours[1]);
          }
          
          console.log('🔍 [SCHEDULE] Parsed values - Day:', dayName, 'Date:', date, 'Start:', startTime, 'End:', endTime, 'Shift Hours:', shiftHours, 'Daily Hours:', dailyHours);
          
          // Check if this is a new day or continuation of current day
          if (dayName && dayName !== currentDay) {
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
            currentDay = dayName;
            currentDate = date;
            currentShifts = [];
            currentDailyHours = dailyHours;
          } else if (dayName === currentDay && date === currentDate) {
            // Same day, same date - this is an additional shift for the same day
            console.log('🔍 [SCHEDULE] Found additional shift for same day:', dayName, date);
          }
          
          // Add shift if there are times and hours
          if (startTime && endTime && shiftHours > 0) {
            currentShifts.push({
              startTime,
              endTime,
              shiftHours,
            });
            console.log('✅ [SCHEDULE] Added shift:', { startTime, endTime, shiftHours });
          }
          
          // Update daily hours if provided (use the latest non-zero value)
          if (dailyHours > 0) {
            currentDailyHours = dailyHours;
            console.log('✅ [SCHEDULE] Updated daily hours to:', dailyHours);
          }
          
          console.log('✅ [SCHEDULE] Processed row for day:', dayName, date, 'Start:', startTime, 'End:', endTime, 'Shift Hours:', shiftHours, 'Daily Hours:', dailyHours);
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
      
      console.log('✅ [SCHEDULE] Extracted', entries.length, 'schedule entries from', dataRowsFound, 'data rows');
      return entries;
      
    } catch (error) {
      console.error('❌ [SCHEDULE] Error extracting schedule entries:', error);
      return entries;
    }
  }

  /**
   * Extract total hours from the schedule
   */
  private extractTotalHours(html: string): number | null {
    try {
      // Try the original pattern first
      let totalMatch = html.match(/<span[^>]*>Total Hours<\/span>[^<]*<\/td>[^<]*<td[^>]*><span[^>]*>([0-9.]+)<\/span>/);
      
      // Try more flexible patterns
      if (!totalMatch) {
        totalMatch = html.match(/Total Hours<\/span>.*?<span[^>]*>([0-9.]+)<\/span>/s);
      }
      
      if (!totalMatch) {
        totalMatch = html.match(/<span[^>]*>Total Hours[^<]*<\/span>.*?<span[^>]*>([0-9.]+)<\/span>/s);
      }
      
      // If no explicit total found, calculate from daily hours in the schedule
      if (!totalMatch) {
        console.log('🔍 [SCHEDULE] No explicit total hours found, calculating from schedule...');
        
        // Extract all daily hours from the schedule table
        const dailyHoursMatches = html.match(/<span[^>]*>(\d+\.\d+|\d+)<\/span>/g);
        if (dailyHoursMatches) {
          let totalHours = 0;
          let hoursFound = 0;
          
          for (const match of dailyHoursMatches) {
            const hourMatch = match.match(/>(\d+\.\d+|\d+)</);
            if (hourMatch) {
              const hours = parseFloat(hourMatch[1]);
              // Only count reasonable hour values (0-24 range)
              if (hours >= 0 && hours <= 24) {
                totalHours += hours;
                hoursFound++;
              }
            }
          }
          
          if (hoursFound > 0) {
            console.log('✅ [SCHEDULE] Calculated total hours from schedule:', totalHours);
            return totalHours;
          }
        }
      }
      
      const result = totalMatch ? parseFloat(totalMatch[1]) : null;
      if (result) {
        console.log('✅ [SCHEDULE] Total hours extracted:', result);
      } else {
        console.log('❌ [SCHEDULE] Could not extract total hours');
      }
      
      return result;
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

  /**
   * Parse and save real schedule data from HTML content
   */
  public async parseAndSaveRealSchedule(html: string): Promise<WeeklySchedule | null> {
    try {
      console.log('📅 [SCHEDULE] Parsing and saving real schedule from provided HTML...');
      
      if (!html || html.length < 1000) { // Basic sanity check for HTML content
        console.log('❌ [SCHEDULE] Invalid or empty HTML provided for parsing.');
        return null;
      }
      
      console.log('📄 [SCHEDULE] HTML content received, length:', html.length);
      
      // Parse the HTML to extract schedule data
      const schedule = this.parseScheduleHTML(html);
      
      if (schedule) {
        console.log('✅ [SCHEDULE] Schedule parsed successfully for week:', schedule.weekStart, '-', schedule.weekEnd);
        
        // Save the schedule locally
        await this.saveSchedule(schedule);
        console.log('💾 [SCHEDULE] Real schedule saved locally.');
        return schedule;
      } else {
        console.log('❌ [SCHEDULE] Failed to parse schedule HTML');
        return null;
      }
    } catch (error) {
      console.error('💥 [SCHEDULE] Error parsing/saving real schedule:', error);
      return null;
    }
  }
}