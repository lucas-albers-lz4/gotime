import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants';
import { WeeklySchedule, ScheduleEntry, ScheduleShift } from '../types';
import { ScheduleService } from '../services/ScheduleService';
import { AuthService } from '../services/AuthService';

interface DashboardScreenProps {
  onLogout: () => void;
}

export default function DashboardScreen({ onLogout }: DashboardScreenProps) {
  const [schedule, setSchedule] = useState<WeeklySchedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [availableWeeks, setAvailableWeeks] = useState<WeeklySchedule[]>([]);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);

  const scheduleService = ScheduleService.getInstance();
  const authService = AuthService.getInstance();

  /**
   * Find the week index that contains today's date
   */
  const findWeekContainingToday = (schedules: WeeklySchedule[]): number => {
    const today = new Date();
    
    for (let i = 0; i < schedules.length; i++) {
      const schedule = schedules[i];
      
      try {
        // Parse week start and end dates
        const [startMonth, startDay, startYear] = schedule.weekStart.split('/').map(Number);
        const [endMonth, endDay, endYear] = schedule.weekEnd.split('/').map(Number);
        
        const weekStart = new Date(startYear, startMonth - 1, startDay);
        const weekEnd = new Date(endYear, endMonth - 1, endDay);
        
        // Check if today falls within this week (inclusive)
        if (today >= weekStart && today <= weekEnd) {
          console.log('📅 [DASHBOARD] Found week containing today:', schedule.weekStart, '-', schedule.weekEnd, 'at index', i);
          return i;
        }
      } catch (error) {
        console.error('Error parsing dates for week comparison:', error);
        continue;
      }
    }
    
    console.log('📅 [DASHBOARD] No week found containing today, using fallback');
    return -1; // Not found
  };

  useEffect(() => {
    loadScheduleData();
  }, []);

  useEffect(() => {
    if (availableWeeks.length > 0) {
      setSchedule(availableWeeks[currentWeekIndex % availableWeeks.length]);
    }
  }, [currentWeekIndex, availableWeeks]);

  useEffect(() => {
    if (schedule === null && !loading) {
      console.log('DashboardScreen: Schedule is null, displaying "No Schedule Data" message');
    }
  }, [schedule, loading]);

  const loadScheduleData = async () => {
    try {
      console.log('DashboardScreen: Starting to load schedule data...');
      setLoading(true);
      
      // Try to load all available real schedules first
      console.log('DashboardScreen: Loading all stored schedules...');
      const allStoredSchedules = await scheduleService.getAllWeeklySchedules();
      
      if (allStoredSchedules.length > 0) {
        console.log('DashboardScreen: ✅ Found', allStoredSchedules.length, 'stored schedules');
        
        // Remove duplicates by creating a Map with normalized weekEnd as key (latest entry wins)
        const scheduleMap = new Map<string, WeeklySchedule>();
        allStoredSchedules.forEach(schedule => {
          // Normalize weekEnd date to handle leading zeros (e.g., "06/01/2025" -> "6/1/2025")
          const normalizeDate = (date: string): string => {
            const parts = date.split('/');
            return `${parseInt(parts[0])}/${parseInt(parts[1])}/${parts[2]}`;
          };
          
          const normalizedWeekEnd = normalizeDate(schedule.weekEnd);
          const key = `${schedule.employee.employeeId}_${normalizedWeekEnd}`;
          
          // Only add if not already present, or if this one is "newer" (we'll keep the first encountered)
          if (!scheduleMap.has(key)) {
            scheduleMap.set(key, schedule);
            console.log('✅ [DASHBOARD] Added schedule for week:', schedule.weekEnd, '(normalized:', normalizedWeekEnd, ')');
          } else {
            console.log('🔄 [DASHBOARD] Duplicate detected for week:', schedule.weekEnd, '(normalized:', normalizedWeekEnd, ') - keeping existing');
          }
        });
        
        const uniqueSchedules = Array.from(scheduleMap.values());
        console.log('🧹 [DASHBOARD] After deduplication:', uniqueSchedules.length, 'unique schedules');
        
        // Sort schedules by week start date (chronologically, earliest first)
        const sortedSchedules = uniqueSchedules.sort((a: WeeklySchedule, b: WeeklySchedule) => {
          try {
            // Parse dates properly for comparison - handle MM/dd/yyyy format
            const parseDate = (dateStr: string): Date => {
              const [month, day, year] = dateStr.split('/').map(Number);
              return new Date(year, month - 1, day); // month is 0-indexed
            };
            
            const dateA = parseDate(a.weekStart);
            const dateB = parseDate(b.weekStart);
            
            console.log('🔍 [DASHBOARD] Comparing dates:', a.weekStart, '(', dateA.toISOString(), ') vs', b.weekStart, '(', dateB.toISOString(), ')');
            
            return dateA.getTime() - dateB.getTime(); // Ascending order (earliest first)
          } catch (error) {
            console.error('❌ [DASHBOARD] Error parsing dates for sorting:', error);
            // Fallback to string comparison
            return a.weekStart.localeCompare(b.weekStart);
          }
        });
        
        setAvailableWeeks(sortedSchedules);
        
        // Try to find the week containing today's date first
        const todayWeekIndex = findWeekContainingToday(sortedSchedules);
        let initialWeekIndex: number;
        let currentSchedule: WeeklySchedule;
        
        if (todayWeekIndex !== -1) {
          // Found week containing today - use it
          initialWeekIndex = todayWeekIndex;
          currentSchedule = sortedSchedules[todayWeekIndex];
          console.log('📅 [DASHBOARD] Loading week containing today:', currentSchedule.weekStart, '-', currentSchedule.weekEnd);
        } else {
          // Fall back to most recent schedule (last in chronologically sorted array)
          initialWeekIndex = sortedSchedules.length - 1;
          currentSchedule = sortedSchedules[initialWeekIndex];
          console.log('📅 [DASHBOARD] No current week found, loading most recent:', currentSchedule.weekStart, '-', currentSchedule.weekEnd);
        }
        
        setSchedule(currentSchedule);
        setCurrentWeekIndex(initialWeekIndex);
        
        console.log('DashboardScreen: Set current schedule for week:', currentSchedule.weekStart, '-', currentSchedule.weekEnd);
        console.log('DashboardScreen: Available weeks (chronological order):', sortedSchedules.map((s: WeeklySchedule) => `${s.weekStart} - ${s.weekEnd}`));
        
        return;
      }
      
      // Fall back to demo schedules if no real data is available in storage
      console.log('DashboardScreen: No stored schedules found, loading demo schedules...');
      await loadDemoSchedule();
      
    } catch (err) {
      console.error('Error loading schedules:', err);
      setAvailableWeeks([]);
      setLoading(false);
    }
  };

  const loadDemoSchedule = async () => {
    try {
      console.log('DashboardScreen: Loading demo schedules...');
      
      // Load all available demo schedules
      const allSchedules = await scheduleService.getAllDemoSchedules();
      console.log('DashboardScreen: Loaded', allSchedules.length, 'demo schedules');
      
      if (allSchedules.length > 0) {
        setAvailableWeeks(allSchedules);
        
        // Try to find the week containing today's date first
        const todayWeekIndex = findWeekContainingToday(allSchedules);
        let initialWeekIndex: number;
        let currentSchedule: WeeklySchedule;
        
        if (todayWeekIndex !== -1) {
          // Found week containing today - use it
          initialWeekIndex = todayWeekIndex;
          currentSchedule = allSchedules[todayWeekIndex];
          console.log('📅 [DASHBOARD] Loading demo week containing today:', currentSchedule.weekStart, '-', currentSchedule.weekEnd);
        } else {
          // Fall back to latest demo schedule (most recent chronologically)
          initialWeekIndex = allSchedules.length - 1;
          currentSchedule = allSchedules[allSchedules.length - 1];
          console.log('📅 [DASHBOARD] No current week in demo data, loading latest week:', currentSchedule.weekStart, '-', currentSchedule.weekEnd);
        }
        
        setSchedule(currentSchedule);
        setCurrentWeekIndex(initialWeekIndex);
        
        console.log('DashboardScreen: Set current schedule for week:', currentSchedule.weekStart, '-', currentSchedule.weekEnd);
      } else {
        console.log('DashboardScreen: No demo schedules available');
      }
    } catch (error) {
      console.error('DashboardScreen: Error loading demo schedules:', error);
    }
  };

  const switchToWeek = (weekIndex: number) => {
    if (availableWeeks.length > 0) {
      const newIndex = weekIndex % availableWeeks.length;
      setCurrentWeekIndex(newIndex);
      setSchedule(availableWeeks[newIndex]);
      console.log('DashboardScreen: Switched to week', newIndex + 1, 'of', availableWeeks.length);
    }
  };

  const nextWeek = () => {
    switchToWeek(currentWeekIndex + 1);
  };

  const previousWeek = () => {
    switchToWeek(currentWeekIndex - 1 + availableWeeks.length);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadScheduleData(); // Reload schedules after refresh
      Alert.alert('Schedules Refreshed', 'Latest schedules have been fetched.');
    } catch {
      Alert.alert('Refresh Failed', 'Could not refresh schedules. Please check your connection or try logging in again via the WebView method.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await authService.logout();
            await authService.clearCredentials();
            onLogout();
          },
        },
      ],
    );
  };

  // Format current date
  const getCurrentDate = (): string => {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[now.getDay()];
    
    // Format as MM/DD/YYYY to match schedule format
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();
    
    return `${dayName} ${month}/${day}/${year}`;
  };

  // Exact time formatting - ALWAYS show hour:minute, NEVER round
  const formatTime = (time: string): string => {
    if (!time) return '';
    
    // If already in correct format like "12:30p" or "4:15p", return as is
    if (time.match(/^\d{1,2}:\d{2}[ap]$/)) {
      return time;
    }
    
    // Handle formats like "12:30:00 PM", "12:30 PM", "4:15:00 AM", etc.
    if (time.includes('AM') || time.includes('PM')) {
      // Extract time parts
      const timeOnly = time.replace(/\s*(AM|PM).*$/, '').trim();
      const isPM = time.toUpperCase().includes('PM');
      
      // Split into hours and minutes
      const parts = timeOnly.split(':');
      if (parts.length >= 2) {
        const hours = parseInt(parts[0]);
        const minutes = parts[1]; // Keep as string to preserve leading zeros
        
        // Convert to 12-hour format if needed
        let displayHour = hours;
        if (hours === 0) displayHour = 12; // 12 AM
        else if (hours > 12) displayHour = hours - 12; // PM hours
        
        const ampm = isPM ? 'p' : 'a';
        return `${displayHour}:${minutes}${ampm}`;
      }
    }
    
    // Handle 24-hour format like "12:30", "16:45", etc.
    const parts = time.split(':');
    if (parts.length >= 2) {
      const hours = parseInt(parts[0]);
      const minutes = parts[1]; // Keep as string to preserve format
      const ampm = hours >= 12 ? 'p' : 'a';
      const hour12 = hours % 12 || 12;
      return `${hour12}:${minutes}${ampm}`;
    }
    
    return time; // Return original if can't parse
  };

  // Check if two shifts are consecutive (end time of first = start time of second)
  const areShiftsConsecutive = (shift1: ScheduleShift, shift2: ScheduleShift): boolean => {
    return shift1.endTime === shift2.startTime;
  };

  // Merge consecutive shifts into combined display
  const mergeConsecutiveShifts = (shifts: ScheduleShift[]): ScheduleShift[] => {
    if (shifts.length <= 1) return shifts;
    
    const merged: ScheduleShift[] = [];
    let currentShift = { ...shifts[0] };
    
    for (let i = 1; i < shifts.length; i++) {
      const nextShift = shifts[i];
      
      if (areShiftsConsecutive(currentShift, nextShift)) {
        // Merge shifts: extend end time and add hours
        currentShift = {
          ...currentShift,
          endTime: nextShift.endTime,
          shiftHours: currentShift.shiftHours + nextShift.shiftHours,
          // Keep change info if either shift was changed
          changedOn: currentShift.changedOn || nextShift.changedOn,
        };
      } else {
        // Not consecutive, add current shift and start new one
        merged.push(currentShift);
        currentShift = { ...nextShift };
      }
    }
    
    // Add the last shift
    merged.push(currentShift);
    return merged;
  };

  // Get abbreviated day name
  const getAbbreviatedDay = (day: string): string => {
    const dayMap: { [key: string]: string } = {
      'Monday': 'Mon',
      'Tuesday': 'Tue', 
      'Wednesday': 'Wed',
      'Thursday': 'Thu',
      'Friday': 'Fri',
      'Saturday': 'Sat',
      'Sunday': 'Sun',
    };
    return dayMap[day] || day.substr(0, 3);
  };

  const renderShift = (shift: ScheduleShift, index: number) => (
    <View key={index} style={styles.compactShift}>
      <Text style={styles.compactTimeText}>
        {formatTime(shift.startTime)}-{formatTime(shift.endTime)}
      </Text>
      <Text style={styles.compactHoursText}>{shift.shiftHours}h</Text>
      {shift.changedOn && (
        <View style={styles.changedIndicator}>
          <Text style={styles.compactChangedText}>*</Text>
          <Text style={styles.compactChangedDateText}>{shift.changedOn}</Text>
        </View>
      )}
    </View>
  );

  const renderScheduleEntry = (entry: ScheduleEntry, index: number) => {
    const hasShifts = entry.shifts.length > 0;
    
    // More robust today comparison that handles different date formats
    // and prevents highlighting when viewing demo/stored schedules from different time periods
    const isToday = (() => {
      try {
        // Parse dates to compare
        const today = new Date();
        const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const entryDate = new Date(entry.date);
        const entryNormalized = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate());
        
        // Only highlight as "today" if we're viewing current week schedules
        // Check if the schedule week contains today's date
        if (schedule) {
          const weekStart = new Date(schedule.weekStart);
          const weekEnd = new Date(schedule.weekEnd);
          const isCurrentWeek = today >= weekStart && today <= weekEnd;
          
          // Only apply today highlighting if we're in the current week
          return isCurrentWeek && todayNormalized.getTime() === entryNormalized.getTime();
        }
        
        return false;
      } catch (_) {
        // If date parsing fails, don't highlight
        return false;
      }
    })();
    
    const dayAbbr = getAbbreviatedDay(entry.day);
    
    // Merge consecutive shifts for display
    const mergedShifts = hasShifts ? mergeConsecutiveShifts(entry.shifts) : [];
    
    return (
      <View key={index} style={[styles.compactDayContainer, isToday && styles.todayContainer]}>
        <View style={styles.compactDayHeader}>
          <Text style={[styles.compactDayText, isToday && styles.todayText]}>
            {dayAbbr}
          </Text>
          <Text style={[styles.compactDateText, isToday && styles.todayText]}>
            {entry.date}
          </Text>
          {entry.dailyHours > 0 && (
            <Text style={[styles.compactDailyHoursText, isToday && styles.todayText]}>
              {entry.dailyHours}h
            </Text>
          )}
        </View>
        
        {hasShifts ? (
          <View style={styles.compactShiftsContainer}>
            {mergedShifts.map((shift, shiftIndex) => renderShift(shift, shiftIndex))}
          </View>
        ) : (
          <Text style={styles.compactNoShiftText}>—</Text>
        )}
      </View>
    );
  };

  if (loading && !schedule) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading schedule...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={onLogout}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.currentDate}>{getCurrentDate()}</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {schedule ? (
          <>
            {/* Condensed Employee Info with Data Validity */}
            <View style={styles.employeeCard}>
              <View style={styles.employeeHeader}>
                <View style={styles.employeeNameContainer}>
                  <Text style={styles.employeeName}>
                    {schedule.employee.name}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => setShowEmployeeDetails(!showEmployeeDetails)}
                    style={styles.infoButton}
                  >
                    <Text style={styles.infoButtonText}>ℹ️ Info</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.dataValidityText}>
                  Data Synced: {schedule.dataAsOf}
                </Text>
              </View>
              
              {showEmployeeDetails && (
                <View style={styles.employeeDetails}>
                  <Text style={styles.detailText}>ID: {schedule.employee.employeeId}</Text>
                  <Text style={styles.detailText}>Location: {schedule.employee.location}</Text>
                  <Text style={styles.detailText}>Department: {schedule.employee.department}</Text>
                  <Text style={styles.detailText}>Job Title: {schedule.employee.jobTitle}</Text>
                  <Text style={styles.detailText}>Status: {schedule.employee.status}</Text>
                  <Text style={styles.detailText}>Hire Date: {schedule.employee.hireDate}</Text>
                  <Text style={styles.detailText}>Week: {schedule.weekStart} - {schedule.weekEnd}</Text>
                  <Text style={styles.detailText}>Total Hours: {schedule.totalHours}</Text>
                </View>
              )}
            </View>

            {/* Simplified Week Navigation */}
            <View style={styles.weekNavigation}>
              <TouchableOpacity onPress={previousWeek} style={styles.navButton}>
                <Text style={styles.navButtonText}>← Prev</Text>
              </TouchableOpacity>
              
              <View style={styles.weekInfo}>
                <Text style={styles.weekTitle}>
                  {schedule.weekStart} - {schedule.weekEnd}
                </Text>
                {availableWeeks.length > 1 && (
                  <Text style={styles.weekNumber}>
                    Week {currentWeekIndex + 1} of {availableWeeks.length}
                  </Text>
                )}
              </View>
              
              <TouchableOpacity onPress={nextWeek} style={styles.navButton}>
                <Text style={styles.navButtonText}>Next →</Text>
              </TouchableOpacity>
            </View>

            {/* Compact Schedule */}
            <View style={styles.scheduleCard}>
              {schedule.entries.map((entry, index) => renderScheduleEntry(entry, index))}
            </View>

            {/* Schedule Change Indicator */}
            <View style={styles.scheduleChangeNotice}>
              <Text style={styles.scheduleChangeText}>
                <Text style={styles.redAsterisk}>*</Text> = Schedule changed after original posting (date indicates when change was made)
              </Text>
            </View>

            {/* Mode Indicator - show either Demo Mode or Employee Schedule Data */}
            {scheduleService.getDemoMode() ? (
              <View style={styles.demoNotice}>
                <Text style={styles.demoTitle}>Demo Mode</Text>
              </View>
            ) : (
              <View style={styles.employeeDataNotice}>
                <Text style={styles.employeeDataTitle}>Employee Schedule Data</Text>
              </View>
            )}

            {/* Offline Storage Status */}
            <View style={styles.offlineStatus}>
              <Text style={styles.offlineTitle}>📱 Offline Storage</Text>
              <Text style={styles.offlineText}>
                {availableWeeks.length > 0 
                  ? `✅ ${availableWeeks.length} schedule${availableWeeks.length === 1 ? '' : 's'} stored locally`
                  : '❌ No schedules stored offline'
                }
              </Text>
              {availableWeeks.length > 0 && (
                <Text style={styles.offlineSubtext}>
                  {availableWeeks.length > 1 
                    ? 'Browse between weeks using ← Prev / Next → buttons above (chronological order)'
                    : 'Single schedule stored'
                  }
                </Text>
              )}
            </View>
          </>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataTitle}>No Schedule Data</Text>
            <Text style={styles.noDataText}>
              Pull down to refresh or check your connection.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primary,
  },
  backButton: {
    padding: SPACING.sm,
  },
  backButtonText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    fontWeight: 'bold',
    marginRight: SPACING.md,
  },
  logoutButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  logoutText: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  employeeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  employeeHeader: {
    flexDirection: 'column',
  },
  employeeNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  employeeName: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
    flex: 1,
  },
  infoButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  infoButtonText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  dataValidityText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  employeeDetails: {
    marginTop: SPACING.sm,
  },
  detailText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  weekNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SPACING.sm,
  },
  navButton: {
    padding: SPACING.sm,
  },
  navButtonText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  weekInfo: {
    flex: 1,
    alignItems: 'center',
  },
  weekTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  weekNumber: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  scheduleCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // Compact schedule styles
  compactDayContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  todayContainer: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 6,
    marginHorizontal: -SPACING.sm,
  },
  compactDayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  compactDayText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text,
    fontWeight: 'bold',
    width: 35,
  },
  todayText: {
    color: COLORS.primary,
  },
  compactDateText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    flex: 1,
    marginLeft: SPACING.xs,
  },
  compactDailyHoursText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.success,
    fontWeight: 'bold',
    textAlign: 'right',
    minWidth: 30,
  },
  compactShiftsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 35 + SPACING.xs,
  },
  compactShift: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.borderLight,
    borderRadius: 4,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  compactTimeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text,
    fontSize: 11,
  },
  compactHoursText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontSize: 10,
    marginLeft: SPACING.xs,
  },
  compactChangedText: {
    ...TYPOGRAPHY.caption,
    color: '#FF4444',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  compactChangedDateText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginLeft: 2,
  },
  changedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleChangeNotice: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  scheduleChangeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text,
    lineHeight: 16,
  },
  redAsterisk: {
    ...TYPOGRAPHY.caption,
    color: '#FF4444',
    fontWeight: 'bold',
  },
  demoNotice: {
    backgroundColor: COLORS.warning,
    padding: SPACING.sm,
    borderRadius: 8,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  demoTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  noDataTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  noDataText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  offlineStatus: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  offlineTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  offlineText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text,
  },
  offlineSubtext: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  employeeDataNotice: {
    backgroundColor: COLORS.success,
    padding: SPACING.sm,
    borderRadius: 8,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  employeeDataTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  compactNoShiftText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginLeft: 35 + SPACING.xs,
  },
}); 