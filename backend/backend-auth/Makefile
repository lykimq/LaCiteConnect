# Makefile for LaCiteConnect Auth Service

# Variables
NODE=node
NPM=npm
NEST=npx @nestjs/cli
NODE_ENV=development
PORT=3000
DB_USER=quyen
DB_NAME=auth_service

# Default target
.PHONY: all
all: install

# Install dependencies
.PHONY: install
install:
	@echo "Installing dependencies..."
	$(NPM) install
	npx prisma generate

# Development targets
.PHONY: dev
dev:
	@echo "Starting development server..."
	NODE_ENV=$(NODE_ENV) $(NPM) run start:dev

.PHONY: start
start: check-db build
	@echo "Starting production server..."
	NODE_ENV=production node dist/main.js

# Build targets
.PHONY: build
build:
	@echo "Building the application..."
	rm -rf dist
	npx prisma generate
	$(NEST) build
	@if [ -d "dist/src" ]; then \
		cp -r dist/src/* dist/ && \
		rm -rf dist/src; \
	fi

# Database safety checks
.PHONY: check-db
check-db:
	@echo "Checking database connection..."
	@if ! psql -U $(DB_USER) -d $(DB_NAME) -c "\q" 2>/dev/null; then \
		echo "Error: Cannot connect to database. Please check your database configuration."; \
		exit 1; \
	fi

# Database backup (only used in clean target)
.PHONY: backup-db
backup-db:
	@echo "Backing up database users and permissions..."
	@./scripts/backup-db-users.sh

# Clean target with safety check
.PHONY: clean
clean: backup-db
	@echo "Cleaning build artifacts..."
	rm -rf dist
	@echo "Note: Database users and permissions have been backed up"

# Test targets
.PHONY: test
test:
	@echo "Running tests..."
	$(NPM) run test

.PHONY: test-coverage
test-coverage:
	@echo "Running tests with coverage..."
	$(NPM) run test:cov

# Database migration targets
.PHONY: migrate
migrate: check-db
	@echo "Running database migrations..."
	npx prisma migrate dev

.PHONY: migrate-prod
migrate-prod: check-db
	@echo "Running production database migrations..."
	npx prisma migrate deploy

# Help target
.PHONY: help
help:
	@echo "Available targets:"
	@echo "  all          - Install dependencies (default)"
	@echo "  install      - Install dependencies"
	@echo "  dev          - Start development server"
	@echo "  start        - Start production server"
	@echo "  build        - Build the application"
	@echo "  clean        - Clean build artifacts (with database backup)"
	@echo "  test         - Run tests"
	@echo "  test-coverage - Run tests with coverage"
	@echo "  migrate      - Run database migrations"
	@echo "  migrate-prod - Run production database migrations"
	@echo "  help         - Show this help message"