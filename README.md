# 📱 Costco Employee Schedule App

> A secure, local-first mobile application for Costco employees to view their work schedules

[![React Native](https://img.shields.io/badge/React%20Native-0.79.2-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~53.0.9-000020.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-~5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-Dual%20(AGPL%2FCommercial)-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-passing-green.svg)](#testing)
[![Code Style](https://img.shields.io/badge/code%20style-ESLint-purple.svg)](eslint.config.js)

## 🌟 Features

- **🔐 Secure Authentication**: Integration with Costco's Employee Self Service (ESS) portal
- **📅 Schedule Viewing**: Weekly schedule display with split shift support
- **💾 Local Storage**: Secure local data storage with no cloud dependency
- **🔔 Smart Notifications**: 30-minute shift reminders (planned)
- **📱 Cross-Platform**: iOS and Android support via React Native
- **🎨 Modern UI**: Clean, intuitive interface optimized for mobile
- **🛡️ Privacy-First**: All data stored locally on device

## 📸 Screenshots

| Login Screen | Dashboard | Schedule Details |
|:------------:|:---------:|:----------------:|
| *Coming Soon* | *Coming Soon* | *Coming Soon* |

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **iOS Simulator** (macOS) or **Android Studio** (for emulator)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/costco-schedule-app.git
cd costco-schedule-app

# Complete setup (installs dependencies and configures environment)
make full-setup

# Start development server
make start
```

### Quick Development Commands

```bash
make dev          # Install deps and start development server
make ios          # Run on iOS simulator
make android      # Run on Android emulator
make web          # Run in web browser (demo mode only)
make help         # See all available commands
```

## 📱 Usage

### Demo Mode
Experience the app without Costco credentials:

1. Open the app in Expo Go or simulator
2. Tap "Demo Mode" on the login screen
3. Explore the interface with sample schedule data

### Production Use
*Note: Full authentication requires enterprise SAML SSO access*

1. Enter your Costco Employee ID and password
2. Complete SMS 2FA verification
3. View your schedule with automatic sync

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React Native 0.79.2 + TypeScript
- **Framework**: Expo ~53.0.9
- **Storage**: SQLite + Expo SecureStore
- **Testing**: Jest + React Native Testing Library
- **Code Quality**: ESLint + TypeScript strict mode

### Project Structure
```
src/
├── components/          # Reusable UI components
├── screens/            # App screens (Login, Dashboard)
├── services/           # Core business logic
│   ├── AuthService.ts     # Authentication handling
│   ├── ScheduleService.ts # Schedule parsing & management
│   ├── StorageService.ts  # Local data persistence
│   └── NotificationService.ts # Push notifications
├── types/              # TypeScript type definitions
├── constants/          # App constants and configuration
├── utils/              # Utility functions
└── test-utils/         # Testing utilities and mocks
```

### Service Architecture
- **AuthService**: Handles Costco ESS portal authentication with SAML SSO
- **ScheduleService**: Parses IBM Cognos BI reports and manages schedule data
- **StorageService**: Secure local storage using SQLite and SecureStore
- **NotificationService**: Local push notifications for shift reminders

## 🧪 Testing

### Running Tests
```bash
make test              # Run all tests
make test-coverage     # Run tests with coverage report
make test-watch        # Run tests in watch mode
make quick-test        # Run lint + type-check + tests
```

### Test Coverage
- ✅ **Service Layer**: 100% coverage (10/10 tests passing)
- ⚠️ **Components**: Partial coverage (TurboModule compatibility issues)
- 📊 **Coverage Report**: Generated in `coverage/` directory

### Code Quality
```bash
make lint              # Run ESLint
make lint-fix          # Auto-fix ESLint issues
make type-check        # Run TypeScript validation
make validate          # Run all quality checks
```

## 🔧 Development

### Development Workflow
```bash
# Setup development environment
make dev-setup

# Watch for changes during development
make watch-all

# Pre-commit validation
make pre-commit

# Health check
make health-check
```

### Environment Configuration
```bash
# Setup environment variables
make env-setup

# Security audit
make security

# Update dependencies
make update-deps
```

## 📦 Building & Deployment

### Development Builds
```bash
make build-preview     # Build preview for testing
make build-ios         # Build for iOS
make build-android     # Build for Android
```

### Deployment
```bash
make deploy-staging    # Deploy to staging
make deploy-prod       # Deploy to production
make submit-ios        # Submit to App Store
make submit-android    # Submit to Google Play
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Run** quality checks (`make pre-commit`)
4. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
5. **Push** to the branch (`git push origin feature/amazing-feature`)
6. **Open** a Pull Request

### Contribution Guidelines
- Follow [Conventional Commits](https://conventionalcommits.org/) for commit messages
- Ensure all tests pass (`make test`)
- Maintain code quality (`make lint`)
- Add tests for new features
- Update documentation as needed

### Development Setup for Contributors
```bash
# Complete setup for new contributors
git clone https://github.com/yourusername/costco-schedule-app.git
cd costco-schedule-app
make full-setup

# Verify setup
make health-check
```

## 🛡️ Security & Privacy

### Data Handling
- **Local-Only Storage**: No data transmitted to external servers
- **Encrypted Credentials**: Stored in device Keychain/Keystore
- **Session Security**: Secure token management
- **No Analytics**: No user tracking or data collection

### Security Features
- 🔐 **SecureStore Integration**: iOS Keychain & Android Keystore
- 🗄️ **Encrypted Database**: SQLite with encryption support
- 🔒 **HTTPS Only**: All network communication encrypted
- 🛡️ **Input Validation**: All inputs sanitized and validated

## 📋 Requirements

### System Requirements
- **iOS**: 13.0+ (iPhone 6s and newer)
- **Android**: API Level 21+ (Android 5.0+)
- **Node.js**: 18.0.0+
- **Expo CLI**: Latest version

### Costco Integration
- **ESS Portal Access**: Valid Costco employee credentials
- **Network Access**: Internet connection for schedule sync
- **2FA Setup**: SMS verification capability
- **Enterprise Access**: May require VPN for some locations

## 🔧 Troubleshooting

### Common Issues

**App won't start?**
```bash
make clear-all
make emergency-reset
```

**Tests failing?**
```bash
make test-coverage
# Check coverage report for details
```

**ESLint errors?**
```bash
make lint-fix
```

**TypeScript errors?**
```bash
make type-check
```

### Getting Help
- 📖 Check the [Development Guide](Development.md)
- 🎯 Run `make help` for available commands
- 🔧 Use `make health-check` for project status
- 💬 Open an issue for bug reports

## 📄 License

This project uses **dual licensing**:

### 🆓 **Non-Commercial Use** - AGPL v3
- ✅ **Free** for personal, educational, and research use
- ✅ **Modify and distribute** under same license terms
- ✅ **Source code** must remain open for derivatives
- ❌ **No commercial use** without separate license

### 💼 **Commercial Use** - Commercial License
- 💰 **Paid license** required for commercial use
- ✅ **Sell apps** or integrate into commercial products
- ✅ **Proprietary modifications** allowed
- ✅ **Priority support** and custom terms available

**Contact**: [your-email@example.com] for commercial licensing

See the [LICENSE](LICENSE) file for complete terms.

## 🙏 Acknowledgments

- **Costco Wholesale**: For employee schedule system integration
- **Expo Team**: For the excellent React Native development platform
- **React Native Community**: For comprehensive testing libraries
- **Open Source Contributors**: For the amazing tools that make this possible

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/costco-schedule-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/costco-schedule-app/discussions)
- **Security**: Email security@example.com for security-related issues

---

<div align="center">

**Made with ❤️ for Costco employees**

*This is an unofficial app and is not affiliated with Costco Wholesale Corporation*

</div>
