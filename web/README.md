# LaCiteConnect Web Microservices

This repository contains the web microservices for the LaCiteConnect application's administration interface.

## Microservices

Currently implemented:
- `web-auth`: Authentication and user management interface

Planned:
- `web-admin`: Administration dashboard and management interface

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   make install
   ```

### Development

To start the auth microservice in development mode:
```bash
make start-auth
```

To start all microservices (currently only auth):
```bash
make start-all
```

### Building

To build the auth microservice:
```bash
make build
```

### Testing

To run tests for the auth microservice:
```bash
make test
```

### Linting

To run linting for the auth microservice:
```bash
make lint
```

## Project Structure

```
web/
├── web-auth/         # Authentication service
├── package.json      # Root package.json for all services
├── Makefile         # Common build and development tasks
└── README.md        # This file
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.