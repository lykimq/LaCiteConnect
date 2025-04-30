.PHONY: install start android ios web clean

# Variables
NODE_MODULES = node_modules

# Install dependencies
install:
	npm install

# Start development server
start:
	npm start

# Run on Android
android:
	npm run android

# Run on iOS
ios:
	npm run ios

# Run on web
web:
	npm run web

# Clean build artifacts
clean:
	rm -rf $(NODE_MODULES)

# Default target
all: install start