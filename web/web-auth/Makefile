.PHONY: install start build test test-coverage clean lint format type-check dev-setup prod-setup help

# Variables
NODE_ENV ?= development
PORT ?= 3001

# Install dependencies
install:
	npm install

# Start development server
start:
	REACT_APP_API_URL=http://localhost:3000 PORT=$(PORT) npm start

# Build for production
build:
	npm run build

# Run tests
test:
	npm test

# Run tests with coverage
test-coverage:
	npm run test:coverage

# Clean build artifacts
clean:
	rm -rf build/
	rm -rf node_modules/
	rm -rf .cache/
	rm -rf .npm/

# Lint code
lint:
	npm run lint

# Format code
format:
	npm run format

# Check types
type-check:
	npm run type-check

# Development setup
dev-setup: install
	cp .env.example .env

# Production setup
prod-setup: install
	cp .env.example .env.production

# Help command
help:
	@echo "Available commands:"
	@echo "  make install        - Install dependencies"
	@echo "  make start         - Start development server"
	@echo "  make build         - Build for production"
	@echo "  make test          - Run tests"
	@echo "  make test-coverage - Run tests with coverage"
	@echo "  make clean         - Clean build artifacts"
	@echo "  make lint          - Lint code"
	@echo "  make format        - Format code"
	@echo "  make type-check    - Check TypeScript types"
	@echo "  make dev-setup     - Setup development environment"
	@echo "  make prod-setup    - Setup production environment"