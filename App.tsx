import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import our services
import StorageService from './src/services/StorageService';
import NotificationService from './src/services/NotificationService';
import { ScheduleService } from './src/services/ScheduleService';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';

// Import constants
import { COLORS } from './src/constants';

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('Initializing Corporate  Schedule App...');

      // Initialize database
      await StorageService.initializeDatabase();
      console.log('Database initialized');

      // Initialize notifications
      await NotificationService.initialize();
      console.log('Notifications initialized');

      // Check if user is already logged in
      const credentials = await StorageService.getCredentials();
      if (credentials) {
        setIsLoggedIn(true);
        console.log('User credentials found');
      }

      // Re-normalize existing stored schedules
      const scheduleService = ScheduleService.getInstance();
      await scheduleService.reNormalizeAllStoredSchedules();
      console.log('Schedules re-normalized');

      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize app:', error);
      // Continue anyway - app should still be usable
      setIsInitialized(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
          {/* You can add a loading spinner here */}
        </View>
      </SafeAreaProvider>
    );
  }

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
