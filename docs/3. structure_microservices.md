# Structure Microservices

## Codebase Structure
Each microservice should be independent, self-contained, and have its own database.

Example Folder Structure:
```
/church-app
│
├── /auth-service
│   ├── /src
│   │   ├── /controllers
│   │   ├── /services
│   │   ├── /models
│   │   ├── /routes
│   │   ├── /utils
│   │   └── /middlewares
│   ├── Dockerfile
│   ├── package.json
│   ├── .env
│   └── README.md
│
├── /event-service
│   ├── /src
│   │   ├── /controllers
│   │   ├── /services
│   │   ├── /models
│   │   ├── /routes
│   │   ├── /utils
│   │   └── /middlewares
│   ├── Dockerfile
│   ├── package.json
│   ├── .env
│   └── README.md
|
|── ...
│
├── /notification-service
│   ├── /src
│   │   ├── /controllers
│   │   ├── /services
│   │   ├── /models
│   │   ├── /routes
│   │   ├── /utils
│   │   └── /middlewares
│   ├── Dockerfile
│   ├── package.json
│   ├── .env
│   └── README.md
│
├── /user-service
│   ├── /src
│   │   ├── /controllers
│   │   ├── /services
│   │   ├── /models
│   │   ├── /routes
│   │   ├── /utils
│   │   └── /middlewares
│   ├── Dockerfile
│   ├── package.json
│   ├── .env
│   └── README.md
|
├── API Gateway
├── ...
├── docs
├── docker-compose.yml
├── ...
└── /shared-libraries
    ├── /utils
    ├── /models
    ├── /middlewares
    └── README.md
```
**Explanation**:
- Each microservice (e.g. `auth-service`, `event-service`, etc.) has its own folder with subdirectories for code organization.
    + `controllers`: Contains code to handle incoming requests.
    + `services`: Contains business logic or domain logic.
    + `models`: Contains database models or schema definitions.
    + `routes`: Defines the routes/endpoints for the microservice.
    + `utils`: Helper functions (e.g., logging, error handling).
    + `middleware`: Any middleware for intercepting requests (authentication, authorization, logging, etc.)
- `Dockerfile`: Contains Docker configuration for each microservice.
- `package.json`: Lists dependencies for the microservice.
- `.env`: Stores environment variables specific to the microservice (e.g., DB connection, API keys).
- `shared-libraries`: Common code that can be reused across multiple services (e.g., utility functions, authentication logic, etc.)

## Database Structure
Each microservice should own its database schema to maintain independence and avoid tight coupling. This is Database Per Service. However, services can communicate with other services' data via APIs if necessary.

**Consideration**:
- Consistency: Each service manages its own database to avoid cross-service dependencies.
- Event Sourcing: For certain features, like payments or donations, we could consider implementing event sourcing or CQRS (Command Query Responsibility Segregation) to store events and queries separately.

## Inter-service Communication
Microservices often need to communicate with each other. There are two main patterns for this:
- Synchronous communication: RESTful APIs, GraphQL, gRPC (services talk directly to each other).
- Asynchronous communication: Message queues (RabbitMQ, Kafka), Event-driven architecture (for example, sending an event when a user registers for an event.)

**Example Communication**:
- Event Service -> Notification Service: When a user registers for an event, the Event Service send an event to the Notification Service to trigger a reminder for that user.
- Notification Service -> User Service: User preferences are stored in the User Service, and the Notification Service needs to check these preferences before sending notifications.

## Version Control and CI/CD
- Version control: use Git with a monorepo instead of multi-repo structure.
- CI/CD: Use Github Actions to automate building, testing, and deploying each microservice.
    + Build: Each service should have its own pipeline (Docker build and push to registry).
    + Test: Use unit tests for each service (e.g., Jest for Node.js).
    + Deploy: Automate deployment to Kubernetes (if using), or deploy to AWS, Azure, or GCP.

## Environment Configuration and Secrets Management
- Environment Variables: Store configurations (e.g., DB credentials, API keys) in `.env` files for each microservice.
    + Docker: Pass environment variables in Docker containers using the `-e` flag.
- Secrets Management:
    + AWS Secrets Manager to securely store sensitive data like API keys and database password.

## Combine All Microservices into One App
### API Gateway/ Reverse Proxy
Introduce an API Gateway (or reverse proxy) to route requests to the correct mircoservice. This centralizes traffic management, provides load balacing, and enables other important functionalities such as authentication, logging, and rate limiting.

We can use: Nginx, Kong, or Traefik.

### Docker Compose (for Local Development)
We can use Docker Compose to define, configure, and run all our microservices locally in a multi-container environment. This helps to simulate production-like environments locally and ensures everything works together. `docker-compose.yml`.

### Dockerization of Microservices
Ensure each microservice is dockerized with a proper `Dockerfile`.

### Use a Message Broker (Optional)
If implementing asynchronous communication (e.g., sending notifications or events updates), consider using a message broker like RabbitMQ or Kafka to decouple services.

### Database Setup and Synchronization
Each microservice should manage its own database as described earlier, but we also need to ensure they can share data when necessary.

For example:
- Event Service may need to access User Service to find out who has registered for an event.
- Notification Service may need access to both User Service (to fetch user contact info) and Event Service (to get event data).

We can do that by using RESTful APIs or gRPC for synchronous communication, or Message Brokers for asynchronous communication.

### Service Discovery (for Large Scale)
As the number of microservices grows, we might want to implement Service Discovery. This allows services to automatically discover and communicate with each other. Tools like Consul or Eureka (for Spring-based applications) help with this.
- Consul can register each service and dynamically discover their addresses.
- Kubernetes also comes with built-in service discovery when using DNS names for service communication.

### Deployment (for Production)
For production deployment, we can orchestrate all these services using Kubernetes (with Helm charts for better management) or Docker Swarm for container orchestration.
- Kubernetes will help manage the scaling of services, health checks and service discovery.
- Helm is a tool that makes deploying applications in Kubernetes easier, providing charts to manage microservices. `YAML file`. Use Helm charts for easy deployment and managing dependencies between services.

### Integrating Frontend with Backend
Once all microservices are up and running, integrate the frontend (e.g., React Native, etc.) with the API Gateway.
- Frontend requests will go through the API Gateway, which will route them to the appropriate microservices.
- We can use OAuth2 or JWT tokens to maanage user authentication between the frontend and microservices.


