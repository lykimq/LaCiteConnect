# Makefile for LaCiteConnect Auth Service

# Variables
NODE=node
NPM=npm
NEST=npx @nestjs/cli
NODE_ENV=development
PORT=3000

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
start: build
	@echo "Starting production server..."
	NODE_ENV=production $(NPM) run start:prod

# Build targets
.PHONY: build
build:
	@echo "Building the application..."
	rm -rf dist
	npx prisma generate
	$(NEST) build

# Test targets
.PHONY: test
test:
	@echo "Running tests..."
	$(NPM) run test

.PHONY: test-coverage
test-coverage:
	@echo "Running tests with coverage..."
	$(NPM) run test:cov

.PHONY: test-e2e
test-e2e:
	@echo "Running end-to-end tests..."
	$(NPM) run test:e2e

# Clean targets
.PHONY: clean
clean:
	@echo "Cleaning build artifacts..."
	rm -rf dist
	rm -rf node_modules
	rm -rf coverage

# Linting and formatting
.PHONY: lint
lint:
	@echo "Running linter..."
	$(NPM) run lint

.PHONY: format
format:
	@echo "Formatting code..."
	$(NPM) run format

# Database targets
.PHONY: db-migrate
db-migrate:
	@echo "Running database migrations..."
	$(NPM) run migrate

.PHONY: db-seed
db-seed:
	@echo "Seeding database..."
	$(NPM) run seed

# Generate resources
.PHONY: generate
generate:
	@echo "Generating NestJS resources..."
	$(NEST) generate

# Help target
.PHONY: help
help:
	@echo "Available targets:"
	@echo "  all          - Install dependencies (default target)"
	@echo "  install      - Install dependencies"
	@echo "  dev          - Start development server"
	@echo "  start        - Start production server"
	@echo "  build        - Build the application"
	@echo "  test         - Run unit tests"
	@echo "  test-coverage - Run tests with coverage report"
	@echo "  test-e2e     - Run end-to-end tests"
	@echo "  clean        - Clean build artifacts"
	@echo "  lint         - Run linter"
	@echo "  format       - Format code"
	@echo "  db-migrate   - Run database migrations"
	@echo "  db-seed      - Seed the database"
	@echo "  generate     - Generate NestJS resources"
	@echo "  help         - Show this help message"