.PHONY: install build test lint clean start-all start-auth start-homegroup

# Install dependencies for all microservices
install:
	@echo "Installing dependencies for all microservices..."
	npm install

# Build all microservices
build:
	@echo "Building all microservices..."
	npm run build:auth
	# npm run build:homegroup  # Uncomment when implementing homegroup service

# Run tests for all microservices
test:
	@echo "Running tests for all microservices..."
	npm run test:auth
	# npm run test:homegroup  # Uncomment when implementing homegroup service

# Run linting for all microservices
lint:
	@echo "Running linting for all microservices..."
	npm run lint:auth
	# npm run lint:homegroup  # Uncomment when implementing homegroup service

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf backend-auth/dist
	# rm -rf backend-homegroup/dist  # Uncomment when implementing homegroup service

# Start all microservices
start-all:
	@echo "Starting all microservices..."
	npm run start:auth
	# npm run start:homegroup &  # Uncomment when implementing homegroup service

# Start auth microservice
start-auth:
	@echo "Starting auth microservice..."
	npm run start:auth

# Start homegroup microservice
start-homegroup:
	@echo "Starting homegroup microservice..."
	# npm run start:homegroup  # Uncomment when implementing homegroup service