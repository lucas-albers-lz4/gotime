# GoTime Schedule App - Development Guide

## Project Overview

A mobile application for employees to securely view their work schedules from corporate portals. The app runs on iOS and Android, prioritizing security, simplicity, and legal compliance. Generically branded as "GoTime Schedule" to support multiple corporate portal integrations while maintaining app store compliance.

## Current Project Status (2024)

### ✅ Infrastructure Health
- **Expo Doctor**: 14/15 checks passing (excellent)
- **Dependencies**: React 19.0.0, Expo SDK 53, all compatible
- **Build System**: Comprehensive Makefile with 50+ commands
- **CI/CD**: Dependabot configured for all ecosystems
- **Development Workflow**: Fully functional across platforms

### ✅ Current Configuration
```json
{
  "app": {
    "name": "GoTime Schedule",
    "slug": "gotime-schedule", 
    "version": "1.0.0",
    "bundleIdentifier": "com.gotime.scheduleapp"
  },
  "dependencies": {
    "react": "19.0.0",
    "react-native": "0.79.2",
    "expo": "~53.0.9",
    "react-native-safe-area-context": "5.4.0"
  }
}
```

### 🔄 Development Status
- **Phase**: Rebranding and rate limiting implementation
- **Next**: Authentication flow with proper server respect
- **Goal**: App store submission within 4-6 weeks

## Technical Architecture

### Technology Stack
- **Framework**: React Native with Expo SDK 53
- **Language**: TypeScript for type safety
- **Storage**: 
  - Expo SecureStore for credentials
  - SQLite for schedule data
  - AsyncStorage for app settings
- **Notifications**: Expo Notifications
- **Web Requests**: Axios with proper rate limiting
- **Architecture**: Modular service-based design

## Backend Integration

### **Corporate System Overview**
The app integrates with a complex enterprise infrastructure:

- **Primary Portal**: Employee Self Service (ESS) portal
- **Authentication**: SAML 2.0 Single Sign-On with PingOne 2FA
- **Infrastructure**: F5 BIG-IP load balancer with session management
- **Reporting System**: IBM Cognos BI for schedule generation
- **Data Format**: Complex HTML reports with nested iframe structures

### **Integration Method**
- **WebView-based automation** for enterprise portal navigation
- **JavaScript injection** for iframe interaction and data extraction
- **Multi-week navigation** with respectful rate limiting
- **Real-time schedule parsing** with comprehensive error handling

### **Technical Implementation Status:**
- ✅ **Real URL Integration**: Updated from placeholder to actual portal
- ✅ **SAML Flow Detection**: Handles enterprise authentication redirects
- ✅ **HTML Parsing**: Complete Cognos report parser with real data
- ✅ **Demo Mode**: Working demonstration with actual parsed data
- 🔄 **Rate Limiting**: Implementing respectful server interaction
- ❌ **Full Authentication**: Limited by enterprise security (SAML SSO + 2FA)

> **📋 For comprehensive backend technical details, see [Backend-Integration.md](./Backend-Integration.md)**
> 
> This dedicated document covers:
> - Complete IBM Cognos BI system architecture
> - Authentication flow diagrams and implementation
> - HTML structure analysis and parsing patterns
> - JavaScript injection methods and iframe handling
> - Rate limiting strategies and error handling
> - Security considerations and session management

## Core Requirements & Compliance

### Functional Requirements
- Secure authentication to corporate portals
- Download and display employee schedules 
- Next shift notifications and reminders
- Manual refresh with intelligent sync
- Offline schedule viewing
- Multi-week schedule support

### Security & Privacy Requirements
- Local-only credential storage (no cloud)
- Encrypted local database
- Device keychain/keystore integration
- Privacy policy compliance
- User consent for data storage
- Secure session management

### Legal Compliance Requirements
- ✅ **No Trademark Issues**: Generic "GoTime Schedule" branding
- 🔄 **Privacy Policy**: Comprehensive data usage disclosure
- 🔄 **Terms of Service**: User agreement and limitations
- 🔄 **App Store Compliance**: Guidelines adherence
- 🔄 **Rate Limiting**: Respectful server interaction

## Data Models & Architecture

### Updated Data Models
```typescript
// Corporate employee information
interface EmployeeInfo {
  name: string;
  employeeId: string;
  location: string;
  department: string;
  jobTitle: string;
  status: string; // PT, FT, etc.
  hireDate: string;
}

// Individual shift within a day
interface ScheduleShift {
  startTime: string;
  endTime: string;
  shiftHours: number;
  altLocation?: string;
  altDeptJob?: string;
  payCode?: string;
  changedOn?: string;
}

// Daily schedule entry (may contain multiple shifts)
interface ScheduleEntry {
  day: string;
  date: string;
  shifts: ScheduleShift[]; // Support for split shifts
  dailyHours: number;
}

// Complete weekly schedule
interface WeeklySchedule {
  weekStart: string;
  weekEnd: string;
  dataAsOf: string;
  employee: EmployeeInfo;
  entries: ScheduleEntry[];
  totalHours: number;
  straightTimeEarnings: number;
}

// Secure credential storage
interface UserCredentials {
  employeeId: string;
  password: string;
  rememberMe: boolean;
}

// Application configuration
interface AppSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
  notificationsEnabled: boolean;
  reminderMinutes: number;
  autoRefresh: boolean;
  refreshInterval: number;
  lastSyncTime?: number;
}
```

## Development Environment Setup

### Prerequisites
- **Node.js**: 18+ (currently using latest)
- **npm**: 10+ for package management
- **Expo CLI**: Installed globally
- **iOS**: Xcode 15+ with iOS 17+ simulator
- **Android**: Android Studio with SDK 34+

### Quick Start
```bash
# Clone and setup
git clone <repository>
cd gotime-schedule
make install

# Start development
make start        # Start Expo dev server
make ios         # iOS simulator (recommended)
make android     # Android emulator
make web         # Web development

# Quality checks
make lint        # ESLint checking
make type-check  # TypeScript validation
make test        # Jest testing
make health-check # Full project health
```

### Available Make Commands (50+)
```bash
# Development
make start, make ios, make android, make web
make clean, make reset, make doctor

# Building
make build-ios-local, make build-android-local
make ci-build-ios, make ci-build-android

# Testing & Quality
make test, make lint, make type-check
make test-coverage, make validate

# Dependencies
make update-deps-safe, make check-outdated
make security, make audit

# Setup & Configuration
make setup-test, make setup-lint, make env-setup
make check-android, make android-studio-setup

# Versioning & Releases
make version:patch, make version:minor
make release-patch, make release-minor
```

## Implementation Phases

### ✅ Phase 1: Infrastructure (COMPLETED)
- [x] Expo project setup with TypeScript
- [x] Core service architecture implementation
- [x] Type definitions for corporate schedule format
- [x] Basic UI components (Login & Dashboard screens)
- [x] Storage service with SQLite and SecureStore
- [x] Authentication service foundation
- [x] Schedule service with HTML parsing
- [x] Notification service setup
- [x] App navigation and initialization
- [x] Generic rebranding for compliance

### 🔄 Phase 2: Rate Limiting & Authentication (CURRENT)
- [ ] Implement respectful web scraping with proper delays
- [ ] Add exponential backoff and retry logic
- [ ] Server response respect (429, 503, Retry-After)
- [ ] Captcha detection and graceful degradation
- [ ] Enhanced session management
- [ ] SAML authentication flow handling
- [ ] 2FA integration and user interface
- [ ] Comprehensive error handling

### 🔄 Phase 3: Production Polish (WEEKS 2-3)
- [ ] Intelligent schedule synchronization
- [ ] Data management and cleanup
- [ ] Loading states and user feedback
- [ ] Security hardening and encryption
- [ ] Privacy policy integration
- [ ] User consent flows
- [ ] Performance optimization

### 🔄 Phase 4: Beta Distribution (WEEKS 3-4)
- [ ] TestFlight setup for iOS (100 internal, 10,000 external)
- [ ] Google Play Console internal testing
- [ ] GitHub Releases for development builds
- [ ] Expo Development Client distribution
- [ ] Beta testing documentation
- [ ] Feedback collection system

### 🔄 Phase 5: App Store Submission (WEEKS 4-6)
- [ ] Final compliance review
- [ ] Store listing assets and descriptions
- [ ] Privacy policy and terms of service
- [ ] Legal review of all content
- [ ] App Store and Google Play submission
- [ ] Review response and iteration

## Beta Distribution Strategy

### Development Distribution
```bash
# GitHub Releases for internal development
git tag v1.0.0-beta.1
git push origin --tags
# Automated GitHub Actions workflow creates release

# Expo Development Client
expo install --dev-client
npm run build:development
# QR code distribution to testers
```

### iOS Beta Testing (TestFlight)
1. **Apple Developer Account**: $99/year individual or enterprise
2. **App Store Connect Setup**: Create app listing
3. **Internal Testing**: Up to 100 users, immediate access
4. **External Testing**: Up to 10,000 users, requires App Store review
5. **Build Distribution**: Automated via EAS Build + TestFlight upload

### Android Beta Testing (Play Console)
1. **Google Play Console**: $25 one-time registration
2. **Internal Testing**: Up to 100 users, immediate access
3. **Closed Testing**: Limited user groups via email/Google groups
4. **Open Testing**: Public opt-in beta program
5. **Build Distribution**: Automated via EAS Build + Play Console upload

### Beta Testing Process
1. **Internal Alpha**: Core team testing (5-10 users)
2. **Closed Beta**: Extended team and power users (50-100 users)
3. **Open Beta**: Public beta program (500-1000 users)
4. **Release Candidate**: Final pre-production testing
5. **Production Release**: Full app store availability

## App Store Approval Considerations

### Critical Compliance Requirements

#### 1. Legal & Trademark Compliance
- ✅ **Generic Branding**: "GoTime Schedule" instead of corporate names
- ✅ **Bundle Identifier**: `com.gotime.scheduleapp`
- 🔄 **UI Language**: Remove any corporate-specific terminology
- 🔄 **Service Comments**: Make all code comments generic
- 🔄 **Marketing Materials**: Focus on schedule management benefits

#### 2. Privacy & Data Protection
- 🔄 **Privacy Policy**: Comprehensive data usage disclosure
- 🔄 **Data Collection**: Clear explanation of what data is stored
- 🔄 **User Consent**: Explicit consent for credential storage
- 🔄 **Data Deletion**: User ability to delete all stored data
- ✅ **Local Storage**: No cloud storage of sensitive data

#### 3. Technical Compliance
- 🔄 **Error Handling**: No app crashes, graceful error recovery
- 🔄 **Loading States**: Clear feedback during operations
- 🔄 **Accessibility**: Screen reader and accessibility support
- 🔄 **Performance**: Fast app load times (< 3 seconds)
- 🔄 **Rate Limiting**: Respectful server interaction

#### 4. App Store Guidelines
- 🔄 **Value Proposition**: Clear benefit to users
- 🔄 **Functionality**: All features work as described
- 🔄 **Content Policy**: Appropriate for general audience
- 🔄 **No Misleading Claims**: Accurate app description
- 🔄 **Review Guidelines**: Compliance with platform policies

### Positioning Strategy
Instead of "corporate portal scraper," position as:
- **"Personal Schedule Manager"**
- **"Work Schedule Organizer"**
- **"Shift Planning Assistant"**
- **"Employee Schedule Viewer"**

Focus on user benefits:
- Convenient schedule access
- Shift reminders and notifications
- Offline schedule viewing
- Personal productivity tool

## Version Management & Releases

### Semantic Versioning Strategy
```
MAJOR.MINOR.PATCH[-PRERELEASE]
1.0.0 - Initial release
1.0.1 - Bug fixes
1.1.0 - New features
2.0.0 - Breaking changes
```

### Version Configuration
```typescript
// app.json
{
  "expo": {
    "version": "1.0.0",
    "ios": {
      "buildNumber": "1"
    },
    "android": {
      "versionCode": 1
    },
    "extra": {
      "appVersion": "1.0.0",
      "buildNumber": "1"
    }
  }
}
```

### Release Process
```bash
# Development builds
npm run version:patch  # 1.0.0 -> 1.0.1
git push origin main --tags

# Beta releases  
npm run version:minor  # 1.0.1 -> 1.1.0-beta.1
expo build --release-channel beta

# Production releases
npm run version:minor  # 1.1.0-beta.1 -> 1.1.0
expo build --release-channel production
```

### GitHub Releases for Development
```yaml
# .github/workflows/release.yml
name: Create Release
on:
  push:
    tags: ['v*']
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Create Release
        uses: actions/create-release@v1
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          draft: false
          prerelease: contains(github.ref, 'beta')
```

## Security & Rate Limiting Implementation

### Respectful Server Interaction
```typescript
// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  MIN_REQUEST_DELAY: 3000,     // 3 seconds minimum
  MAX_REQUEST_DELAY: 10000,    // 10 seconds maximum
  JITTER_RANGE: 2000,          // ±2 seconds random
  MAX_RETRIES: 3,              // Maximum retry attempts
  BACKOFF_MULTIPLIER: 2,       // Exponential backoff
  MAX_BACKOFF: 60000,          // 60 seconds maximum backoff
  SESSION_TIMEOUT: 1800000,    // 30 minutes
};

// Implementation example
class RateLimitedHttpClient {
  private lastRequestTime = 0;
  private requestQueue: Array<() => Promise<void>> = [];
  
  async makeRequest(url: string, options?: RequestInit): Promise<Response> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          await this.waitForRateLimit();
          const response = await this.executeRequest(url, options);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
      
      if (this.requestQueue.length === 1) {
        this.processQueue();
      }
    });
  }
  
  private async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minDelay = RATE_LIMIT_CONFIG.MIN_REQUEST_DELAY;
    const jitter = Math.random() * RATE_LIMIT_CONFIG.JITTER_RANGE;
    
    if (timeSinceLastRequest < minDelay) {
      const delayNeeded = minDelay - timeSinceLastRequest + jitter;
      await new Promise(resolve => setTimeout(resolve, delayNeeded));
    }
    
    this.lastRequestTime = Date.now();
  }
}
```

### Error Handling & Server Response Respect
```typescript
// Server response handling
async function handleServerResponse(response: Response): Promise<Response> {
  switch (response.status) {
    case 429: // Too Many Requests
      const retryAfter = response.headers.get('Retry-After');
      const delay = retryAfter ? parseInt(retryAfter) * 1000 : 60000;
      throw new RateLimitError(`Rate limited, retry after ${delay}ms`, delay);
      
    case 503: // Service Unavailable
      throw new ServiceUnavailableError('Server temporarily unavailable');
      
    case 403: // Forbidden (possible captcha)
      const html = await response.text();
      if (html.includes('captcha') || html.includes('verification')) {
        throw new CaptchaRequiredError('Manual verification required');
      }
      throw new AuthenticationError('Access forbidden');
      
    default:
      return response;
  }
}
```

## Testing Strategy

### Testing Pyramid
1. **Unit Tests**: Individual service methods (80% coverage target)
2. **Integration Tests**: Service interactions and data flow
3. **Component Tests**: UI component behavior
4. **End-to-End Tests**: Complete user workflows
5. **Manual Testing**: Device-specific and edge case testing

### Test Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test-utils/**',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80,
    },
  },
};
```

## Performance & Optimization

### Performance Targets
- **App Launch**: < 3 seconds to main screen
- **Schedule Sync**: < 10 seconds for weekly data
- **Memory Usage**: < 100MB during normal operation
- **Battery Impact**: Minimal background processing
- **Storage**: < 50MB total app size

### Optimization Strategies
- Lazy loading of non-critical components
- Image optimization and caching
- SQLite query optimization
- Background task minimization
- Memory leak prevention

## Documentation & Support

### User Documentation
- Getting started guide
- Feature overview
- Troubleshooting guide
- Privacy and security information
- FAQ and common issues

### Developer Documentation
- Setup and installation guide
- Architecture overview
- API documentation
- Contributing guidelines
- Deployment procedures

## Future Roadmap

### Version 1.1 Features
- Enhanced notifications and customization
- Accessibility improvements
- Performance optimizations
- Additional schedule export formats

### Version 2.0 Vision
- Multi-employee support (family accounts)
- Advanced analytics and reporting
- Integration with calendar applications
- Biometric authentication options

This development guide provides comprehensive information for building, testing, and deploying the GoTime Schedule app while ensuring legal compliance and respectful server interaction.
