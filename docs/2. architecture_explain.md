# Architecture Overview

## Frontend (Mobile + Web)
- **React Native with Expo** for mobile development: Cross-platform mobile development (iOS and Android). Expo simplifies the development process and adds additional features (e.g., push notifications) that are easy to integrate.
- **React.js with TypeScript** for the web: React with TypeScript is a strong choice for web applications. It offers a structured way to build scalable applications and ensures type safety.
- **Authentication - Firebase Auth**: Firebase Authentication is an idea choice for managing user authentication, supporting Google, email/password, and anonymous login. It simplifies user management and integrates well with other Firebase services.

## Backend (API)
- **Node.js with NetsJS/Express.js + GraphQL**: NestJS or Express.js are both solid choices for building RESTful APIs or GraphQL APIs. Since we are using GraphQL, NestJS is a good fit for building a scalable, maintainable, and modular architecture. Express.js is better fit for a lightweight approach.
- Why GraphQL: GraphQL offers flexibility and efficiency, allowing clients to fetch exactly the data they need. It's greate for mobile apps where we might need to reduce the amount of data transferred.

## Database: PostgreSQL
- PostgreSQL is a good choice for structured relational data. Since we are using Firebase for authentication and notifications.
- AWS RDS (Relational Database Service) is a hosting for PostgreSQL. It is a fully managed service that supports PostgreSQL. It provides scalability, high availability, and automated backups. It is easy to set up and integrates seamlessly with other AWS services, such as AWS Lambda or API Gateway.

## Notification: Firebase Cloud Messaging (FCM)
- It is a good choice for sending push notifications to both Android and iOS. Since we are using Firebase for authentication, integrating FCM will be simple and straightforward.

## Payment: Stripe and Tezos
- Stripe: is widely used for handling fiat payments securely. It is simple to integrate and has support for various payment method globally.
- Tezos (Taquito SDK) for crypto donations: The Taquito SDK is an excellent choice for interacting with the Tezos blockchain. It will allow users to send crypto donations easily.

## Hosting/Deployment
- **Frontend**: **Vercel** is a strong option for hosting React.js web app because it is optimized for Next.js and offers easy deployment, automatic scaling, and a fast global CDN. It is designed for frontend applications, providing a simple CI/CD setup.
- **Backend**: **AWS** (Amazon Web Services) is an ideal choice for hosting the backend API. AWS offers a wide range of service, high scalability, and reliability.
    + AWS Service to use:
        ++ AWS Elastic Beanstalk for managing the application.
        ++ Amazon EC2 for custom server hosting, providing more flexibility if needed.
        ++ Amazon API Gateway to expore the backend as APIs (it is useful since we are using GraphQL).
        ++ AWS Lamda for running serverless functions if we weant serverless computing for scalability and cost management.
## Why AWS?
- **Scalability**: AWS allos us to scale the resources based on traffic demand. As the application grows, AWS services can automatically scale without needing manual intervention.
- **Reliability**: AWS provides high availability and fault tolerance across regions. This is especially important if we expect high traffic, such as 10k concurrent users.
- **Security**: AWS offers robust security features, including VPC, IAM roles, encryption, and security groups. Since we are handling donations (including crypto), securing the infrastructure is paramount.
- **Integration with PostgreSQL**: AWS RDS for PostgreSQL provides automatic backups, patch management, and easy scaling without much overhead.