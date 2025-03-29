# Microservices Architecture

The microservices model should airm to isolate the different features of the application while ensuring they can work together seamlessly.

## Authentication Service
- Functionality: Manages user authentication and authorization.
    + Registers users (email, social login, etc.)
    + Authenticates users and provides tokens for access.
    + Handles user roles (Admin, Signed-in user, Guest).
- Technologies:
    + Use JWT (JSON Web Tokens) for user sessions.
    + Firebase Auth or AuthO can be used for user authentication and role management.
    + Store user credentials in a **User Database** (PostgreSQL).

## Church Information Service
- Functionality: Manages the church's information (like service, contact details, history, etc.).
    + Provides a RESTful API to access church information.
    + Allows updates from admins.
- Technologies:
    + NestJS as the framework for creating the API.
    + Store church information in PostgreSQL.

## Event Service
- Functionality: Manages events (create, edit, delete, list, etc.)
    + Allows admins to create events, add images/videos, and set registration requirements.
    + Enables users to view events, register, and share events on social media.

- Technologies:
    + GraphQL/RESTful API for querying event-related data (flexible and efficient).
    + Store events in PostgreSQL (with image/video URLs pointing to storage like AWS S3 or Firebase Storage).

## Service Management
- Functionality: Manages services (Bible study, worship services, etc.)
    + Allows admin to create/edit/delete services.
    + Allows signed-in users to register for services and view service details.

- Techonologies:
    + RESTful API or GraphQL for service management.
    + PostgreSQL for storing service details and user registrations.
    + S3 for storing media content (service images/videos)

## Donations Service
- Functionality: Manages donations (both fiat and crypto).
    + Integrates Stripe for fiat donations and Tezos blockchain for cryptocurrency donations.
    + Handles secure payment processing and tracks donation history.
    + Allows users to donate via the app and track donation receipts.

- Techonologies:
    + Stripe API for fiat transactions.
    + Taquito SDK for Tezos blockchain interactions.
    + PostgreSQL for storing donation data and transaction records.
    + AWS Lambda for serverless functions to process donations asynchronously.

## Home Groups Service
- Functionality: Manages home group information (view and register).
    + Allows users to register for home groups, view home group details.
    + Admins can manage home group registrations.

- Technologies:
    + RESTful API or GraphQL for home group management.
    + PostgreSQL for storing home group details and user registrations.

## Notification Service
- Functionality: Sends notifications for events, services, and reminders.
    + Allows users to enable notifications (push, SMS, or email).
    + Sends event/service reminders for registered users.
    + Allows admins to configure default notification settings for the app.

- Technologies:
    + Firebase Cloud Messaging (FCM) for push notifications.
    + Twilio or SendGrid for SMS and email notifications.
    + Use RabbitMQ/Kafka or AWS SNS for message queuing and handling high notification volumns.

## User Management Service
- Functionality: Manages user profile and account settings.
    + Allows users to change their profile information, password, notification settings, and privacy settings.
    + Admins can view and manage user accounts.
    + Handles user deactivation or deletion requests.

- Technologies:
    + JWT for authentication tokens.
    + GraphQL/RESTful API for managing user profile and account information.
    + PostgreSQL for user data (names, emails, settings, etc.).
    + Integration with Firebase Auth for authentication management.

## Microservices Communication
- RESTful APIs: most services will expose RESTful APIS for communication. For example, the Event Service will expose a set of REST APIS for creating, editing, and listing events.
- Event-driven Architecture: The Notification Service can use an event-driven model, where other services (e.g., Event, User Management) will emit events (e.g., "User registered for event") to which the Notification Service listens to send notifications.
    + Use Kafka or RabbitMQ for asynchronous event handling.
    + This architecture allows for decoupling services and ensures that each service can work independently without blocking others.

## Infrastructure Planning
- AWS Services: For deployment and infrastructure management:
    + Elastic Beanstalk: for deploying backend services.
    + AWS RDS for PostgreSQL database management (fully managed, scablable).
    + S3 for storing images, videos and other media.
    + SNS or SQS for managing notifications and queues.
    + Lambda for serverless functions (for donation processing or sending notification).
- CI/CD pipeline: User GitHub Actions, AWS CodePipeline to manage continuous integrations and deployment.

## Security Considerations
- Authentication and Authorization: Use JWT tokesn to secure API endpoints and ensure role-based access (admin, signed-in user, guest).
- Encryption: Ensure sensitive data such as passwords, payment information, and user profile are encrypted using AES or TLS protocols.
- API Security: Secure APIs using OAuth2, API keys, and rate-limiting techniques to prevent abuse.

## Scalability and Reliability
- Horizontal Scaling: Services like Event Service, Notification Service, and User Management Service should be horizontally scalable to handle high traffic and ensure that the app can grow to support large numbers of users (e.g. 10k concurrent users).
- Fault Tolerance; Use AWS Scaling, Elastic Load Balancers, and AWS RDS Multi-AZ deployment for high availability and fault tolerance.
- Asynchronous Processing: Use AWS SQS or RabbitMQ for handling background tasks such as sending notifications and processing donations.

## Microservices Deployment Strategry
- Containerization: Dockerize the microservices for easy deployment and management.
- Kubernetes: Use Kubernets for orchestration and managing multiple services in a distributed environment.
- Monitoring and Logging: Use AWS CloudWatch, Datadog, or Prometheus for monitoring service health and logs.