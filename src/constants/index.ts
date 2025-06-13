/**
 * @fileoverview Application configuration constants for GoTime Schedule.
 * Centralizes all configuration values, URLs, styling, and application behavior settings.
 * These constants are used throughout the app to maintain consistency and enable easy configuration changes.
 */

/**
 * Core application configuration settings.
 * Contains timeouts, retry logic, storage configuration, and external service URLs.
 */
export const APP_CONFIG = {
  /**
   * Default reminder time in minutes before shift starts.
   * Used for push notifications and user preference initialization.
   */
  DEFAULT_REMINDER_MINUTES: 30,
  
  /**
   * Maximum time to wait for network operations before timing out.
   * Applies to authentication, schedule sync, and API requests.
   */
  SYNC_TIMEOUT_MS: 30000, // 30 seconds
  
  /**
   * Maximum number of retry attempts for failed operations.
   * Used for network requests, authentication, and data sync operations.
   */
  MAX_RETRY_ATTEMPTS: 3,
  
  /**
   * Secure storage keys for encrypted data persistence.
   * These keys are used with Expo SecureStore and device keychain/keystore.
   */
  STORAGE_KEYS: {
    /** Key for storing encrypted user credentials */
    CREDENTIALS: 'user_credentials',
    /** Key for storing application settings and preferences */
    SETTINGS: 'app_settings',
    /** Key for storing last successful synchronization timestamp */
    LAST_SYNC: 'last_sync_time',
  },
  
  /**
   * SQLite database configuration for local schedule storage.
   * Database is created and managed by the StorageService.
   */
  DB_NAME: 'gotime_schedule.db',
  /** Database schema version for migration handling */
  DB_VERSION: 1,
  
  /**
   * Corporate Employee Portal URLs for enterprise system integration.
   * These URLs are configured for Employee Self Service (ESS) portal access.
   * Can be modified to support different corporate portal implementations.
   */
  PORTAL_URLS: {
    /** Primary corporate portal base URL */
    BASE: 'https://ess.costco.com',
    /** Initial login endpoint for credential submission */
    LOGIN: 'https://ess.costco.com/',
    /** Main portal interface after successful authentication */
    PORTAL_MAIN: 'https://ess.costco.com/irj/portal/external',
    
    /**
     * PingOne Identity Provider URLs for SAML SSO authentication.
     * Used for multi-factor authentication and single sign-on flows.
     */
    PINGONE_AUTH: 'https://authenticator.pingone.com/pingid/ppm/auth',
    PINGONE_BASE: 'https://authenticator.pingone.com',
    
    /**
     * SAP HCM System URLs for human capital management integration.
     * Provides access to Fiori launchpad and schedule management tools.
     */
    SCHEDULE_LAUNCHPAD: 'https://hcm.costco.com/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?sap-language=EN&sap-client=100&sap-locale=en_US&sap-rtl=&sap-accessibility=&sap-ushell-config=embedded&&appState=lean#ScheduleLine-display',
    
    /**
     * IBM Cognos BI Reporting System URLs for schedule data extraction.
     * Business Intelligence system that generates employee schedule reports.
     */
    SCHEDULE_REPORT: 'https://bireport.costco.com/cognos_ext/bi/',
    /** Path to the schedule report within the BI system */
    SCHEDULE_REPORT_PATH: '.public_folders%2FWarehouse%2FHR%252FPayroll%2FSchedule',
    /** Unique identifier for the employee schedule report */
    SCHEDULE_REPORT_ID: 'i7C53D2304D524CE1BF24DFEF232E6FE0',
    
    /** Corporate portal logout endpoint for session termination */
    LOGOUT: 'https://ess.costco.com/logout',
  },
  
  /**
   * User agent strings for HTTP requests to corporate systems.
   * Different user agents are used to ensure compatibility with enterprise portals.
   * Some corporate systems are optimized for specific browsers or mobile clients.
   */
  USER_AGENTS: [
    /**
     * Mobile user agents for iOS and Android compatibility.
     * Used when mobile-optimized interfaces are preferred.
     */
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Android 13; Mobile; rv:109.0) Gecko/109.0 Firefox/109.0',
    'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36',
    
    /**
     * Desktop user agents for enterprise system compatibility.
     * Many corporate portals work more reliably with desktop browser user agents.
     */
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0',
  ],
};

/**
 * Application color palette following professional design standards.
 * Uses a cohesive blue theme appropriate for corporate applications.
 */
export const COLORS = {
  /**
   * Primary brand colors - professional blue theme.
   * Used for headers, buttons, and key interactive elements.
   */
  primary: '#0066CC',
  primaryDark: '#004499',
  primaryLight: '#3388DD',
  
  /**
   * Background colors for surfaces and containers.
   * Provides visual hierarchy and content separation.
   */
  background: '#F5F5F5',
  surface: '#FFFFFF',
  white: '#FFFFFF',
  
  /**
   * Text colors for content hierarchy.
   * Ensures proper contrast and readability on all backgrounds.
   */
  text: '#1A1A1A',
  textSecondary: '#666666',
  textLight: '#999999',
  
  /**
   * Status colors for user feedback and state indication.
   * Follows standard conventions for success, warning, and error states.
   */
  success: '#4CAF50',
  warning: '#FF9800',
  warningLight: '#FFF3E0',
  error: '#F44336',
  info: '#2196F3',
  
  /**
   * Border colors for element separation and visual structure.
   * Creates subtle divisions between content areas.
   */
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  
  /**
   * Shadow colors for depth and elevation effects.
   * Used for card shadows and modal overlays.
   */
  shadow: '#000000',
};

/**
 * Typography size and weight definitions.
 * Provides consistent text sizing throughout the application.
 */
export const FONTS = {
  /**
   * Font sizes in pixels for different text hierarchies.
   * Based on standard mobile typography scales.
   */
  sizes: {
    xs: 12,   // Captions, fine print
    sm: 14,   // Small text, labels
    md: 16,   // Body text, default size
    lg: 18,   // Large body text
    xl: 20,   // Section headers
    xxl: 24,  // Page headers
    xxxl: 32, // Main titles
  },
  
  /**
   * Font weights for text emphasis and hierarchy.
   * Typed as const to ensure TypeScript compatibility.
   */
  weights: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

/**
 * Pre-configured typography styles combining size, weight, and line height.
 * Ensures consistent text styling across components.
 */
export const TYPOGRAPHY = {
  /** Main page titles and hero text */
  h1: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.bold,
    lineHeight: 40,
  },
  /** Section headers and important headings */
  h2: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    lineHeight: 32,
  },
  /** Subsection headers */
  h3: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.semibold,
    lineHeight: 28,
  },
  /** Component headers and labels */
  h4: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semibold,
    lineHeight: 24,
  },
  /** Form labels and small headers */
  h5: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
    lineHeight: 22,
  },
  /** Default body text for content */
  body: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.normal,
    lineHeight: 22,
  },
  /** Small text, captions, and metadata */
  caption: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.normal,
    lineHeight: 18,
  },
};

/**
 * Standardized spacing values for consistent layout.
 * Used for margins, padding, and component spacing throughout the app.
 */
export const SPACING = {
  xs: 4,    // Minimal spacing, tight layouts
  sm: 8,    // Small spacing, compact elements
  md: 16,   // Standard spacing, most common
  lg: 24,   // Large spacing, section separation
  xl: 32,   // Extra large spacing, major sections
  xxl: 48,  // Maximum spacing, page-level separation
};

/**
 * Border radius values for consistent rounded corners.
 * Creates visual cohesion across buttons, cards, and input fields.
 */
export const BORDER_RADIUS = {
  sm: 4,    // Subtle rounding for small elements
  md: 8,    // Standard rounding for buttons and inputs
  lg: 12,   // Large rounding for cards
  xl: 16,   // Extra large rounding for modals
  round: 50, // Fully rounded for circular elements
};

/**
 * Animation duration constants for consistent motion design.
 * Measured in milliseconds for React Native Animated API.
 */
export const ANIMATION = {
  fast: 150,   // Quick transitions, button feedback
  normal: 300, // Standard transitions, screen changes
  slow: 500,   // Slow transitions, complex animations
}; 