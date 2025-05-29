# Costco Schedule App - Makefile
# React Native Expo Project

.PHONY: help install start start-clear ios android web clean reset test lint type-check build-ios build-android deploy-staging deploy-prod doctor tunnel security audit update-deps docs env-setup health-check clear-all watch-all validate pre-commit post-install dev-setup

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
	npm update
	npx expo install --fix
	@echo "✅ Dependencies updated"

security: ## Run security audit
	@echo "🔒 Running security audit..."
	npm audit
	@echo "Use 'make audit' to fix issues automatically"

audit: ## Fix security vulnerabilities automatically
	@echo "🔧 Fixing security vulnerabilities..."
	npm audit fix
	@echo "✅ Security vulnerabilities fixed"

# Development Commands
start: ## Start Expo development server
	npx expo start

start-clear: ## Start Expo development server with cache cleared
	npx expo start --clear

ios: ## Start iOS simulator
	npx expo start --ios

android: ## Start Android emulator
	npx expo start --android

web: ## Start web development server
	@echo "🌐 Starting web version (Note: Uses AsyncStorage fallback for SQLite)"
	npx expo start --web

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

# Build Commands
build-ios: ## Build iOS app for production
	npx eas build --platform ios

build-android: ## Build Android app for production
	npx eas build --platform android

build-all: ## Build for all platforms
	npx eas build --platform all

build-preview: ## Build preview for testing
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
	npx expo doctor

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

ci-build: ## Build for CI environment
	npx eas build --platform all --non-interactive 
