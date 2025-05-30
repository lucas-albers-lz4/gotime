// Application constants

export const APP_CONFIG = {
  // Notification settings
  DEFAULT_REMINDER_MINUTES: 30,
  
  // Sync settings
  SYNC_TIMEOUT_MS: 30000, // 30 seconds
  MAX_RETRY_ATTEMPTS: 3,
  
  // Storage keys
  STORAGE_KEYS: {
    CREDENTIALS: 'user_credentials',
    SETTINGS: 'app_settings',
    LAST_SYNC: 'last_sync_time',
  },
  
  // Database settings
  DB_NAME: 'gotime_schedule.db',
  DB_VERSION: 1,
  
  // Corporate Employee Portal URLs (configurable for different organizations)
  PORTAL_URLS: {
    BASE: 'https://ess.costco.com', // Costco Employee Self Service portal
    LOGIN: 'https://ess.costco.com/',
    PORTAL_MAIN: 'https://ess.costco.com/irj/portal/external', // Main portal after login
    
    // PingOne Identity Provider URLs
    PINGONE_AUTH: 'https://authenticator.pingone.com/pingid/ppm/auth',
    PINGONE_BASE: 'https://authenticator.pingone.com',
    
    // SAP HCM System URLs
    SCHEDULE_LAUNCHPAD: 'https://hcm.costco.com/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?sap-language=EN&sap-client=100&sap-locale=en_US&sap-rtl=&sap-accessibility=&sap-ushell-config=embedded&&appState=lean#ScheduleLine-display',
    
    // BI Reporting System URLs  
    SCHEDULE_REPORT: 'https://bireport.costco.com/cognos_ext/bi/',
    SCHEDULE_REPORT_PATH: '.public_folders%2FWarehouse%2FHR%252FPayroll%2FSchedule',
    SCHEDULE_REPORT_ID: 'i7C53D2304D524CE1BF24DFEF232E6FE0',
    
    LOGOUT: 'https://ess.costco.com/logout',
  },
  
  // User agent strings for web requests (enterprise portal compatible)
  USER_AGENTS: [
    // Standard mobile user agents
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Android 13; Mobile; rv:109.0) Gecko/109.0 Firefox/109.0',
    'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36',
    
    // Desktop user agents (often work better with enterprise systems)
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0',
  ],
};

// Color palette
export const COLORS = {
  // Primary colors (professional blue theme)
  primary: '#0066CC',
  primaryDark: '#004499',
  primaryLight: '#3388DD',
  
  // Background colors
  background: '#F5F5F5',
  surface: '#FFFFFF',
  white: '#FFFFFF',
  
  // Text colors
  text: '#1A1A1A',
  textSecondary: '#666666',
  textLight: '#999999',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  warningLight: '#FFF3E0',
  error: '#F44336',
  info: '#2196F3',
  
  // Border colors
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  
  // Shadow colors
  shadow: '#000000',
};

// Typography
export const FONTS = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  weights: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

// Typography styles
export const TYPOGRAPHY = {
  h1: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.bold,
    lineHeight: 40,
  },
  h2: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    lineHeight: 32,
  },
  h3: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.semibold,
    lineHeight: 28,
  },
  h4: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semibold,
    lineHeight: 24,
  },
  h5: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
    lineHeight: 22,
  },
  body: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.normal,
    lineHeight: 22,
  },
  caption: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.normal,
    lineHeight: 18,
  },
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

// Animation durations
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
}; 