/**
 * @fileoverview Main Application Component for GoTime Schedule.
 * Handles app initialization, authentication state management, and root-level routing.
 * Manages the transition between login and dashboard screens based on authentication status.
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Core services for data management and business logic
import StorageService from './src/services/StorageService';
import NotificationService from './src/services/NotificationService';
import { ScheduleService } from './src/services/ScheduleService';

// Screen components for authentication and schedule management
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';

// Application styling constants
import { COLORS } from './src/constants';

/**
 * Root application component that orchestrates the entire app lifecycle.
 * Manages authentication state, service initialization, and screen routing.
 * 
 * @returns {JSX.Element} The rendered application with appropriate screen based on auth state
 */
export default function App() {
  /** Tracks whether all app services have been successfully initialized */
  const [isInitialized, setIsInitialized] = useState(false);
  
  /** Tracks user authentication status for screen routing */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  /** Tracks initial app loading state during service initialization */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize app services and check authentication status on app start.
   * This effect runs once when the component mounts.
   */
  useEffect(() => {
    initializeApp();
  }, []);

  /**
   * Initializes all application services and checks for existing user session.
   * Handles database setup, notification configuration, and schedule data migration.
   * 
   * @private
   */
  const initializeApp = async () => {
    try {
      console.log('Initializing GoTime Schedule App...');

      // Initialize secure local database for schedule storage
      await StorageService.initializeDatabase();
      console.log('✅ Database initialized successfully');

      // Configure push notifications for shift reminders
      await NotificationService.initialize();
      console.log('✅ Notification system initialized');

      // Check for existing user credentials to enable auto-login
      const credentials = await StorageService.getCredentials();
      if (credentials) {
        setIsLoggedIn(true);
        console.log('✅ User credentials found - enabling auto-login');
      }

      // Migrate and normalize any existing schedule data to current format
      // This ensures compatibility with app updates and schema changes
      const scheduleService = ScheduleService.getInstance();
      await scheduleService.reNormalizeAllStoredSchedules();
      console.log('✅ Schedule data migration completed');

      setIsInitialized(true);
    } catch (error) {
      console.error('❌ App initialization failed:', error);
      // Continue initialization even if some services fail
      // This ensures the app remains functional for basic operations
      setIsInitialized(true);
    } finally {
      // Always complete loading state regardless of initialization success
      setIsLoading(false);
    }
  };

  /**
   * Handles successful user authentication.
   * Transitions the app from login screen to dashboard screen.
   * 
   * @public
   */
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  /**
   * Handles user logout request.
   * Transitions the app from dashboard screen back to login screen.
   * Note: Actual credential clearing is handled by the logout action in dashboard.
   * 
   * @public
   */
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  /**
   * Renders loading screen while app services are initializing.
   * Displays branded loading interface during startup.
   */
  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
          {/* Loading spinner component can be added here for better UX */}
        </View>
      </SafeAreaProvider>
    );
  }

  /**
   * Renders the main application interface.
   * Routes between login and dashboard screens based on authentication state.
   */
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.container}>
        {isLoggedIn ? (
          <DashboardScreen onLogout={handleLogout} />
        ) : (
          <LoginScreen onLoginSuccess={handleLoginSuccess} />
        )}
      </View>
    </SafeAreaProvider>
  );
}

/**
 * Stylesheet for the main application container.
 * Defines layout and visual styling for the root component.
 */
const styles = StyleSheet.create({
  /** Main container for the entire application */
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  /** Loading screen container with branded background */
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
