# Costco Schedule App - Makefile
# React Native Expo Project

.PHONY: help install start start-clear ios android web clean reset test lint type-check build-ios build-android deploy-staging deploy-prod doctor tunnel security audit update-deps update-deps-safe update-deps-force check-outdated docs env-setup health-check clear-all watch-all validate pre-commit post-install dev-setup check-android setup-android-env setup-android-full android-studio-setup update-ios-deps update-android-deps

# Default target
help: ## Show this help message
	@echo "Costco Schedule App - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-25s\033[0m %s\n", $$1, $$2}'

# Development Setup
install: ## Install dependencies
	npm install

install-clean: ## Clean install dependencies
	rm -rf node_modules package-lock.json
	npm install

post-install: ## Run post-installation setup tasks
	@echo "Running post-installation setup..."
	npx expo install --fix
	npm audit fix --force
	@echo "✅ Post-installation setup complete"

update-deps: ## Update all dependencies to latest versions
	@echo "🔄 Updating dependencies..."
	@echo "Note: Using --legacy-peer-deps to handle React version conflicts"
	npm update --legacy-peer-deps
	npx expo install --fix
	@echo "✅ Dependencies updated"

update-deps-safe: ## Safely update dependencies (recommended)
	@echo "🔄 Safely updating dependencies..."
	@echo "Checking for outdated packages..."
	npm outdated || true
	@echo ""
	@echo "Updating with Expo compatibility checks..."
	npx expo install --fix
	@echo "✅ Safe dependency update completed"

update-deps-force: ## Force update dependencies (use with caution)
	@echo "⚠️  Force updating dependencies..."
	@echo "This may cause compatibility issues!"
	npm update --force
	npx expo install --fix
	@echo "✅ Force update completed - test thoroughly!"

check-outdated: ## Check for outdated dependencies
	@echo "📊 Checking for outdated dependencies..."
	@echo ""
	@echo "=== npm outdated ==="
	npm outdated || echo "All npm packages are up to date"
	@echo ""
	@echo "=== Expo compatibility ==="
	npx expo install --check || echo "All Expo packages are compatible"

security: ## Run security audit
	@echo "🔒 Running security audit..."
	npm audit
	@echo "Use 'make audit' to fix issues automatically"

audit: ## Fix security vulnerabilities automatically
	@echo "🔧 Fixing security vulnerabilities..."
	npm audit fix
	@echo "✅ Security vulnerabilities fixed"

# Development Commands (these work reliably)
start: ## Start Expo development server
	npx expo start

start-clear: ## Start Expo development server with cache cleared
	npx expo start --clear

ios: ## Start iOS simulator (development mode - RECOMMENDED)
	npx expo start --ios

android: ## Start Android emulator (development mode - RECOMMENDED)
	npx expo start --android

web: ## Start web development server
	@echo "🌐 Starting web version (Note: Uses AsyncStorage fallback for SQLite)"
	npx expo start --web

# Local Build Commands (for testing production builds)
build-ios-local: ## Build and run iOS app locally on simulator
	@echo "🍎 Building iOS app for simulator..."
	@if [ ! -d "ios" ]; then \
		echo "❌ iOS directory not found. Run 'npx expo prebuild' first."; \
		exit 1; \
	fi
	@echo "⚠️  If this fails due to device issues, use 'make ios' instead"
	@echo "Building for iOS 18.4 simulator..."
	cd ios && xcodebuild -workspace costcoscheduleapp.xcworkspace \
		-scheme costcoscheduleapp \
		-configuration Release \
		-sdk iphonesimulator \
		-destination 'platform=iOS Simulator,OS=18.4,name=iPhone 16' \
		build

build-ios-debug: ## Build and run iOS app in debug mode
	@echo "🍎 Building iOS app (debug) for simulator..."
	@if [ ! -d "ios" ]; then \
		echo "❌ iOS directory not found. Run 'npx expo prebuild' first."; \
		exit 1; \
	fi
	npx expo run:ios

build-ios-device: ## Build iOS app for physical device (requires Xcode & provisioning)
	@echo "📱 Building iOS app for device..."
	@if [ ! -d "ios" ]; then \
		echo "❌ iOS directory not found. Run 'npx expo prebuild' first."; \
		exit 1; \
	fi
	npx expo run:ios --device --configuration Release

build-android-local: ## Build and run Android app locally on emulator
	@echo "🤖 Building Android app for emulator..."
	@if [ ! -d "android" ]; then \
		echo "❌ Android directory not found. Run 'npx expo prebuild' first."; \
		exit 1; \
	fi
	@echo "⚠️  If this fails, use 'make android' instead"
	cd android && ./gradlew assembleRelease && ./gradlew installRelease

build-android-debug: ## Build and run Android app in debug mode
	@echo "🤖 Building Android app (debug) for emulator..."
	@if [ ! -d "android" ]; then \
		echo "❌ Android directory not found. Run 'npx expo prebuild' first."; \
		exit 1; \
	fi
	npx expo run:android

build-android-device: ## Build Android app for physical device (requires Android Studio)
	@echo "📱 Building Android app for device..."
	@if [ ! -d "android" ]; then \
		echo "❌ Android directory not found. Run 'npx expo prebuild' first."; \
		exit 1; \
	fi
	npx expo run:android --device --variant release

# CI/CD Build Commands (for GitHub Actions)
ci-build-ios: ## Build iOS for CI (creates .app bundle without running)
	@echo "🏗️  Building iOS for CI..."
	@if [ ! -d "ios" ]; then \
		echo "❌ iOS directory not found. Run 'npx expo prebuild' first."; \
		exit 1; \
	fi
	@echo "Building iOS app bundle for CI..."
	cd ios && xcodebuild -workspace costcoscheduleapp.xcworkspace \
		-scheme costcoscheduleapp \
		-configuration Release \
		-sdk iphonesimulator \
		-derivedDataPath build \
		build

ci-build-android: ## Build Android for CI (creates APK without running)
	@echo "🏗️  Building Android for CI..."
	@if [ ! -d "android" ]; then \
		echo "❌ Android directory not found. Run 'npx expo prebuild' first."; \
		exit 1; \
	fi
	@echo "Building Android APK for CI..."
	cd android && ./gradlew assembleRelease

ci-test-build: ci-build-ios ci-build-android ## Build both platforms for CI testing
	@echo "✅ CI builds completed successfully"

# EAS Cloud Build Commands (require EAS setup)
build-ios: ## Build iOS app with EAS (cloud build)
	@echo "☁️  Building iOS app with EAS..."
	@if [ ! -f "eas.json" ]; then \
		echo "❌ EAS not configured. Run 'make setup-eas' first."; \
		echo "💡 For local development, use 'make build-ios-local' or 'make ios'"; \
		echo "💡 For CI builds, use 'make ci-build-ios'"; \
		exit 1; \
	fi
	npx eas build --platform ios

build-android: ## Build Android app with EAS (cloud build)
	@echo "☁️  Building Android app with EAS..."
	@if [ ! -f "eas.json" ]; then \
		echo "❌ EAS not configured. Run 'make setup-eas' first."; \
		echo "💡 For local development, use 'make build-android-local' or 'make android'"; \
		echo "💡 For CI builds, use 'make ci-build-android'"; \
		exit 1; \
	fi
	npx eas build --platform android

build-all: ## Build for all platforms with EAS (cloud build)
	@echo "☁️  Building for all platforms with EAS..."
	@if [ ! -f "eas.json" ]; then \
		echo "❌ EAS not configured. Run 'make setup-eas' first."; \
		echo "💡 For local development, use 'make build-ios-local' and 'make build-android-local'"; \
		echo "💡 For CI builds, use 'make ci-test-build'"; \
		exit 1; \
	fi
	npx eas build --platform all

build-preview: ## Build preview for testing
	@if [ ! -f "eas.json" ]; then \
		echo "❌ EAS not configured. Run 'make setup-eas' first."; \
		exit 1; \
	fi
	npx eas build --platform all --profile preview

# Deployment
deploy-staging: ## Deploy to staging (EAS Update)
	npx eas update --branch staging --message "Staging deployment $(shell date)"

deploy-prod: ## Deploy to production (EAS Update)
	npx eas update --branch production --message "Production deployment $(shell date)"

submit-ios: ## Submit iOS build to App Store
	npx eas submit --platform ios

submit-android: ## Submit Android build to Google Play
	npx eas submit --platform android

# Environment Management
env-setup: ## Setup environment files and configurations
	@echo "🔧 Setting up environment..."
	@if [ ! -f ".env" ]; then \
		echo "Creating .env file..."; \
		echo "# Costco Schedule App Environment Variables" > .env; \
		echo "NODE_ENV=development" >> .env; \
		echo "EXPO_DEBUG=true" >> .env; \
	fi
	@echo "✅ Environment setup complete"

# Maintenance
clean: ## Clean cache and temporary files
	@echo "🧹 Cleaning caches..."
	npx expo start --clear
	rm -rf .expo
	rm -rf node_modules/.cache
	npx react-native clean-project-auto || true

clear-all: ## Clear all caches including Metro and npm
	@echo "🧹 Clearing all caches..."
	rm -rf .expo
	rm -rf node_modules/.cache
	rm -rf /tmp/metro-* || true
	rm -rf /tmp/haste-map-* || true
	npx metro --reset-cache || true
	npm cache clean --force
	@echo "✅ All caches cleared"

reset: ## Reset project (clean + reinstall)
	@echo "♻️  Resetting project..."
	rm -rf node_modules
	rm -rf .expo
	rm -f package-lock.json
	npm install
	@echo "✅ Project reset complete"

doctor: ## Run Expo doctor to check for issues
	@echo "This is just a warning --> : Check for app config fields that may not be synced in a non-CNG project"
	@echo "You don't need to fix it now"
	npx expo-doctor

health-check: ## Comprehensive project health check
	@echo "🏥 Running project health check..."
	@echo "Node.js version: $(shell node --version)"
	@echo "npm version: $(shell npm --version)"
	@echo "Expo CLI version: $(shell npx expo --version 2>/dev/null || echo 'Not installed')"
	@echo ""
	@echo "=== Package Health ==="
	@npm outdated || echo "All packages up to date"
	@echo ""
	@echo "=== Security Audit ==="
	@npm audit --audit-level=moderate || echo "Security issues found - run 'make audit' to fix"
	@echo ""
	@echo "=== TypeScript Check ==="
	@npm run type-check || echo "TypeScript errors found"
	@echo ""
	@echo "=== ESLint Check ==="
	@npm run lint || echo "ESLint errors found"

# Database
db-reset: ## Reset local SQLite database (development only)
	@echo "🗄️  Resetting local database..."
	@echo "Note: This will clear all local schedule data"
	rm -f costco_schedule.db*
	@echo "✅ Database reset complete"

db-backup: ## Backup local database
	@echo "💾 Creating database backup..."
	@if [ -f "costco_schedule.db" ]; then \
		cp costco_schedule.db "costco_schedule_backup_$(shell date +%Y%m%d_%H%M%S).db"; \
		echo "✅ Database backed up"; \
	else \
		echo "No database found to backup"; \
	fi

# Documentation
docs: ## Generate project documentation
	@echo "📚 Generating documentation..."
	@echo "# Project Documentation" > DOCS.md
	@echo "" >> DOCS.md
	@echo "## Available Commands" >> DOCS.md
	@make help >> DOCS.md
	@echo "✅ Documentation generated in DOCS.md"

docs-serve: ## Serve documentation locally (if using docs generator)
	@echo "📖 Serving documentation..."
	@if command -v docsify >/dev/null 2>&1; then \
		docsify serve docs; \
	else \
		echo "Install docsify-cli to serve docs: npm i -g docsify-cli"; \
	fi

# Development Tools Setup
setup-lint: ## Add ESLint configuration
	npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-native
	@echo "✅ ESLint installed. Configuration already exists in eslint.config.js"

setup-format: ## Add Prettier configuration
	npm install --save-dev prettier
	@echo '{\n  "semi": true,\n  "trailingComma": "es5",\n  "singleQuote": true,\n  "printWidth": 80,\n  "tabWidth": 2\n}' > .prettierrc
	@echo "✅ Prettier configured"

setup-test: ## Add Jest testing framework
	npm install --save-dev jest @types/jest @testing-library/react-native @testing-library/jest-native jest-expo
	@echo "✅ Jest installed. Configuration already exists in jest.config.js"

setup-husky: ## Add git hooks with Husky
	npm install --save-dev husky lint-staged
	npx husky install
	npx husky add .husky/pre-commit "npm run lint-staged"
	@echo "✅ Husky git hooks configured"

setup-eas: ## Configure EAS for cloud builds
	@echo "⚙️  Setting up EAS..."
	@echo "This will configure cloud builds for your project."
	@echo "You'll need an Expo account and may incur build costs."
	@read -p "Continue? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	npx eas build:configure
	@echo "✅ EAS configured! You can now use 'make build-ios' and 'make build-android'"

release-patch: ## Create patch release
	npm version patch
	git push origin main --tags

release-minor: ## Create minor release
	npm version minor
	git push origin main --tags

release-major: ## Create major release
	npm version major
	git push origin main --tags

# Project Info
info: ## Show project information
	@echo "=== Costco Schedule App ==="
	@echo "Node.js version: $(shell node --version)"
	@echo "npm version: $(shell npm --version)"
	@echo "Expo CLI version: $(shell npx expo --version 2>/dev/null || echo 'Not installed')"
	@echo ""
	@echo "=== Package Info ==="
	@cat package.json | grep -E '"name"|"version"|"expo"' | head -3
	@echo ""
	@echo "=== Development Status ==="
	@if [ -d "node_modules" ]; then echo "✅ Dependencies installed"; else echo "❌ Run 'make install'"; fi
	@if [ -f "src/services/AuthService.ts" ]; then echo "✅ Core services present"; else echo "❌ Missing core files"; fi
	@if [ -f "jest.config.js" ]; then echo "✅ Tests configured"; else echo "⚠️  Tests not configured"; fi
	@if [ -f "eslint.config.js" ]; then echo "✅ ESLint configured"; else echo "⚠️  ESLint not configured"; fi
	@echo ""

# Performance
analyze-bundle: ## Analyze bundle size (for web)
	@echo "📊 Analyzing bundle size..."
	npx expo start --web --dev=false
	@echo "Check browser dev tools for bundle analysis"

# Quick development workflows
dev: install start ## Quick start: install deps and start dev server

full-setup: install post-install setup-test setup-lint env-setup ## Complete project setup from scratch
	@echo "🎉 Full project setup complete!"

quick-test: lint type-check test ## Quick validation pipeline
	@echo "✅ Quick validation passed"


# CI/CD helpers
ci-install: ## Install dependencies for CI environment
	npm ci

ci-test: ## Run tests in CI environment
	npm run test:coverage
	npm run lint
	npm run type-check

ci-full: ci-install ci-test ci-test-build ## Complete CI pipeline
	@echo "🎉 Full CI pipeline completed successfully!"

# Simplified build commands that work reliably
build-ios-simple: ## Simple iOS build (just compile, don't run)
	@echo "🍎 Simple iOS build..."
	@if [ ! -d "ios" ]; then \
		echo "❌ iOS directory not found. Run 'npx expo prebuild' first."; \
		exit 1; \
	fi
	cd ios && xcodebuild -workspace costcoscheduleapp.xcworkspace \
		-scheme costcoscheduleapp \
		-configuration Release \
		build

build-android-simple: ## Simple Android build (just compile, don't run)
	@echo "🤖 Simple Android build..."
	@if [ ! -d "android" ]; then \
		echo "❌ Android directory not found. Run 'npx expo prebuild' first."; \
		exit 1; \
	fi
	cd android && ./gradlew assembleRelease

tunnel: ## Start with tunnel for external device testing
	npx expo start --tunnel

dev-setup: install post-install ## Complete development environment setup
	@echo "🚀 Development environment ready!"

# Code Quality
lint: ## Run ESLint
	@if [ -f "eslint.config.js" ] || [ -f ".eslintrc.js" ]; then \
		npm run lint; \
	else \
		echo "ESLint not configured. Run 'make setup-lint' to add it."; \
	fi

lint-fix: ## Run ESLint with auto-fix
	@if [ -f "eslint.config.js" ] || [ -f ".eslintrc.js" ]; then \
		npm run lint:fix; \
	else \
		echo "ESLint not configured. Run 'make setup-lint' to add it."; \
	fi

type-check: ## Run TypeScript type checking
	npm run type-check

format: ## Format code with Prettier (when configured)
	@if [ -f ".prettierrc" ] || [ -f "prettier.config.js" ]; then \
		npx prettier --write "src/**/*.{ts,tsx,js,jsx,json}"; \
	else \
		echo "Prettier not configured. Run 'make setup-format' to add it."; \
	fi

validate: type-check lint ## Run all code quality checks
	@echo "✅ All code quality checks passed"

pre-commit: validate test ## Run all checks before commit
	@echo "✅ Pre-commit checks completed successfully"

# Testing
test: ## Run tests
	@if [ -f "jest.config.js" ] || grep -q "jest" package.json; then \
		npm test; \
	else \
		echo "Tests not configured. Run 'make setup-test' to add Jest."; \
	fi

test-watch: ## Run tests in watch mode
	@if [ -f "jest.config.js" ] || grep -q "jest" package.json; then \
		npm run test:watch; \
	else \
		echo "Tests not configured. Run 'make setup-test' to add Jest."; \
	fi

test-coverage: ## Run tests with coverage report
	@if [ -f "jest.config.js" ] || grep -q "jest" package.json; then \
		npm run test:coverage; \
		@echo "📊 Coverage report generated in coverage/ directory"; \
	else \
		echo "Tests not configured. Run 'make setup-test' to add Jest."; \
	fi

watch-all: ## Watch tests and lint simultaneously
	@echo "👁️  Watching tests and code quality..."
	@trap 'kill %1; kill %2' SIGINT; \
	npm run test:watch & \
	npm run lint -- --fix --watch &\
	wait

check-android: ## Check Android development environment setup
	@echo "🤖 Checking Android development environment..."
	@echo "ANDROID_HOME: $$ANDROID_HOME"
	@if [ -z "$$ANDROID_HOME" ]; then \
		echo "❌ ANDROID_HOME not set. Run 'source ~/.zshrc' or restart terminal"; \
	else \
		echo "✅ ANDROID_HOME is set"; \
	fi
	@if command -v adb >/dev/null 2>&1; then \
		echo "✅ adb is available"; \
		adb version; \
	else \
		echo "❌ adb not found in PATH"; \
	fi
	@if [ -d "$$ANDROID_HOME/emulator" ]; then \
		echo "✅ Android emulator directory exists"; \
	else \
		echo "❌ Android emulator directory not found"; \
	fi
	@echo "Available AVDs:"
	@if command -v emulator >/dev/null 2>&1; then \
		emulator -list-avds 2>/dev/null || echo "No AVDs found - create one in Android Studio"; \
	else \
		echo "❌ emulator command not found"; \
	fi

setup-android-env: ## Setup Android environment variables
	@echo "🔧 Setting up Android environment variables..."
	@echo 'export ANDROID_HOME=$$HOME/Library/Android/sdk' >> ~/.zshrc
	@echo 'export PATH=$$PATH:$$ANDROID_HOME/emulator' >> ~/.zshrc
	@echo 'export PATH=$$PATH:$$ANDROID_HOME/platform-tools' >> ~/.zshrc
	@echo "✅ Environment variables added to ~/.zshrc"
	@echo "Run 'source ~/.zshrc' or restart your terminal to apply changes"

setup-android-full: ## Complete Android development setup (automated)
	@echo "🤖 Setting up Android development environment..."
	@echo "This will install Java, Android SDK, and create an emulator"
	@echo ""
	@echo "Step 1: Installing Java..."
	brew install --cask temurin || echo "Java installation requires password"
	@echo ""
	@echo "Step 2: Setting up Android SDK..."
	@mkdir -p ~/Library/Android/sdk
	@echo 'export ANDROID_HOME=$$HOME/Library/Android/sdk' >> ~/.zshrc
	@echo 'export PATH=$$PATH:$$ANDROID_HOME/emulator' >> ~/.zshrc
	@echo 'export PATH=$$PATH:$$ANDROID_HOME/platform-tools' >> ~/.zshrc
	@echo 'export PATH=$$PATH:$$ANDROID_HOME/cmdline-tools/latest/bin' >> ~/.zshrc
	@echo ""
	@echo "Step 3: Instructions to complete setup:"
	@echo "1. Open Android Studio: open -a 'Android Studio'"
	@echo "2. Follow setup wizard (choose Standard installation)"
	@echo "3. Create an AVD (Tools > AVD Manager > Create Virtual Device)"
	@echo "4. Choose Pixel 7 or 8, download Android 14 (API 34)"
	@echo "5. Run 'source ~/.zshrc && make check-android' to verify"
	@echo ""
	@echo "✅ Environment variables configured!"

android-studio-setup: ## Open Android Studio and show setup instructions
	@echo "🚀 Opening Android Studio for setup..."
	open -a "Android Studio"
	@echo ""
	@echo "📋 Setup Instructions:"
	@echo "1. Choose 'Standard' installation type"
	@echo "2. Accept all license agreements"
	@echo "3. Wait for SDK download (10-15 minutes)"
	@echo "4. Go to Tools > AVD Manager"
	@echo "5. Click 'Create Virtual Device'"
	@echo "6. Choose Pixel 7 or Pixel 8"
	@echo "7. Download Android 14 (API 34) system image"
	@echo "8. Name your AVD and finish"
	@echo ""
	@echo "After setup, run: make check-android"

update-ios-deps: ## Update iOS CocoaPods dependencies
	@echo "📱 Updating iOS dependencies..."
	@if [ -d "ios" ]; then \
		cd ios && pod update && pod install; \
		echo "✅ iOS dependencies updated"; \
	else \
		echo "❌ iOS directory not found"; \
	fi

update-android-deps: ## Update Android Gradle dependencies
	@echo "🤖 Updating Android dependencies..."
	@if [ -d "android" ]; then \
		cd android && ./gradlew --refresh-dependencies; \
		echo "✅ Android dependencies refreshed"; \
	else \
		echo "❌ Android directory not found"; \
	fi
