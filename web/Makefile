.PHONY: install build test lint clean start-all start-auth

# Install dependencies for all microservices
install:
	@echo "Installing dependencies for all web microservices..."
	npm install

# Build all microservices
build:
	@echo "Building all web microservices..."
	npm run build:auth

# Run tests for all microservices
test:
	@echo "Running tests for all web microservices..."
	npm run test:auth

# Run linting for all microservices
lint:
	@echo "Running linting for all web microservices..."
	npm run lint:auth

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf web-auth/dist

# Start all microservices
start-all:
	@echo "Starting all web microservices..."
	npm run start:auth

# Start auth microservice
start-auth:
	@echo "Starting auth microservice..."
	npm run start:auth