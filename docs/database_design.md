# Database Design for Microservices Architecture
This document outlines the database schema, relationship, and deployment strategy for the microservices-based using PostgreSQL.

## Database Design Per Microservice

Each microservice has its own isolated database to ensure modularity and scalability. Services communicate via **API calls** or an **event-driven system** (e.g., Kafka, RabbitMQ, or AWS SNS/SQS).

### User Management Service

Manages users, authentication, roles, and account settings.

- Relationships: This table connects with **events, home_groups, services, and donations** via `user_id`.

## Users Table

| Column Name            | Type            | Properties & Constraints                                        | Description |
|------------------------|----------------|-----------------------------------------------------------------|-------------|
| **id**                | UUID           | Primary Key, Auto-generated, Unique, Indexed                    | Unique identifier for the user |
| **email**             | VARCHAR(255)   | Unique, Required, Validate Check Format, Indexed                                      | User's email address |
| **password_hash**     | TEXT           | Required, Hashed with bcrypt or Argon2                         | Securely stored password hash |
| **password_salt**     | TEXT           | Required, Stored Separately                                    | Salt used for password hashing |
| **password_reset_token** | VARCHAR(255) | Nullable, Expires after set duration                           | Token for password recovery |
| **first_name**        | VARCHAR(100)   | Required, Indexed                                              | User’s first name |
| **last_name**         | VARCHAR(100)   | Required, Indexed                                              | User’s last name |
| **full_name**         | VARCHAR(255)   | Generated (first_name + last_name), Indexed                    | Used for searching users |
| **phone_number**      | VARCHAR(20)    | Optional, Unique, Indexed                                      | User's phone number |
| **phone_region**      | VARCHAR(10)    | Optional                                                       | Country code (e.g., "+1" for US, "+84" for Vietnam) |
| **role**              | ENUM('guest', 'user', 'admin') | Default: 'guest', Required                                   | Defines user access level |
| **privacy_settings** | JSONB        | Default: {}                    | Stores user privacy preferences (e.g., who can see email, phone number, profile, etc.). |
| **session_type** | ENUM('session', 'persistent') | Default: 'session'             | Determines if the user stays logged in after closing the app. |
| **biometric_enabled** | BOOLEAN    | Default: false                   | Indicates whether biometric login (fingerprint/face ID) is enabled. |
| **last_login_at** | TIMESTAMP      | Auto-updated on login            | Stores last login timestamp for tracking. |
| **profile_picture_url** | TEXT         | Nullable                                                       | URL to the user’s profile picture |
| **created_at**        | TIMESTAMP      | Auto-generated, Default: `NOW()`                               | Account creation timestamp |
| **updated_at**        | TIMESTAMP      | Auto-updated on changes                                        | Last updated timestamp |

### **Indexes for Optimized Search**
- `id` (Indexed for fast lookups)
- `email` (Unique, Indexed for authentication & searches)
- `first_name` (Indexed for name-based searches)
- `last_name` (Indexed for name-based searches)
- `full_name` (Precomputed & Indexed for better performance)
- `phone_number` (Indexed for contact searches)

### **Security Features**
- **Password stored securely** using `bcrypt`/`Argon2` with a **salt**.
- **Password reset token** for account recovery.
- **Precomputed `full_name`** ensures **efficient** search queries.

### **Searchable Fields**
Users can be searched using:
✅ `id`
✅ `email`
✅ `first_name`
✅ `last_name`
✅ `full_name`
✅ `phone_number`

This structure ensures **fast and efficient searching**, **secure password handling**, and **scalability**. 🚀

#### Primary Identifier
`id`: Uniquely identifies each user. UUID is used instead of an auto-incremented integer to prevent enumeration attacks.

#### Authentication and Security
- `email`: Users must provide a valid email for authentication and communication. Email validation rules:
    + Must contain an `@` symbol.
    + Must contain a valid domain (e.g., `gmail.com`, `example.org`).
    + Cannot contain spaces or special characters outside of `.` and `-`.
    + Max length: 255 characters.
    + Uses a case-insensitive index to prevent duplicate accounts with mixed-case emails (`Example@gmail.com = example@gmail.com`)
- `password_hash`: `bcrypt` or `Argon2` ensures strong encryption, securely stores user passwords using strong encryption.
- `password_salt`: A unique salt is added to each password before hashing to prevent rainbow table attacks.
- `password_reset_token`: Token used for password recovery, expires after a predefined period (e.g., 15 minutes). Limits the exposure window for compromised tokens.

#### User Personal Information
- `first_name`: Stores the user's first name, enabling quick retrieval.
- `last_name`: Stores the user's last name, allowing better searchability.
- `full_name`: Precomputed filed combining `first_name`, and `last_name` to optimize search performance.
- `profile_picture_url`: Stores the URL of the user's profile picture, allowing users to personalize their accounts.

#### Phone Information
- `phone_number`: Users can add a phone number for additional verification and contact purposes.
- `phone_region`: Stores the country code (.e.g, for France `+33`) to enable international compability.

#### Role and Permissions
- `role`: Defines the user's access level in the system, default is `guest`.
    + Guest: can browser public content but cannot register for events or services/homegroup. Can send donations.
    + User: can register for events/services/homegroup, update their profile, donation and receive notifications.
    + Admin: Can manage users, events, services, homegroups, and donations.

#### Timestamps and Tracking
- `created_at`: Stores the timestamp when the user account was created.
- `update_at`: Stores the timestamp of the last update made to the user's profile.

+ Allows tracking user account creation time.
+ Helps in detecting inactive or outdated accounts.
+ Useful for auditing and data consistency.

#### Login Persistence (`session_type`)
- `session` mode: User must login in every time they close they app.
- `persistent` mode: User remains logged in until they manually sign out.

#### Biometric Authentication (`biometric_enabled`)
- If enable `true`, user can sign in via fingerprint or face recognition.
- Backend must support OAuth or secure token-based authentication for this.

#### Privacy Controls (`privacy_settings`)
- A JSONB field stores user-defined privacy preferences.
- Example:
```json
{
    "show_email": false,
    "show_phone": true,
    "show_profile_picture": true,
    "allow_search_by_name": false
}
```
- Users can toggle what information is visible to other.

### Events Service

Handle event creation, registration, images, and social media sharing.

- Relationships: `events` is linked with `users` via `created_by`, and `event_registrations` connects users to events.


`events`

| Column Name        | Type                | Properties & Constraints         | Description |
|--------------------|---------------------|----------------------------------|-------------|
| id             | `UUID`              | Primary key, Auto-generated      | Unique identifier for each event. |
| title          | `VARCHAR(255)`      | Required                         | The title of the event. |
| description    | `TEXT`              | Optional                         | Detailed description of the event. |
| date           | `DATE`              | Required                         | The date when the event will take place. |
| time           | `TIME`              | Required                         | The time when the event will take place. |
| location       | `VARCHAR(255)`      | Optional                         | The location where the event will be held. |
| picture_url    | `TEXT`              | Optional                         | URL for the event’s picture. |
| video_url      | `TEXT`              | Optional                         | URL for the event’s video. |
| created_by     | `UUID`              | Foreign key → `users(id)`        | ID of the user who created the event. |
| created_at     | `TIMESTAMP`         | Auto-generated                   | Timestamp when the event was created. |
| updated_at     | `TIMESTAMP`         | Auto-generated                   | Timestamp when the event was last updated. |
| notification_enabled | `BOOLEAN`      | Default: false                   | Flag indicating if notifications are enabled for the event. |
| pagination_limit | `INTEGER`          | Default: 10                      | The number of events to display per page. |
| total_participants|	`INTEGER`	| Calculated field (via trigger)	|Total number of registered participants (calculated from event_registrations). |

#### Date and Time
- Allow flexibility in queries for event sorting and filtering.

#### Event Media (`picture_url`, `video_url`):
- Allow for the association of visual or multimedia content with the event.
- These URLs can link to images or videos hosted either on a server or cloud services like AWS S3.

#### Event Notifications (`notification_enabled`)
- This flag determines whether the event has notifications activated.
- If enabled, users who register will receive notifications based on their settings (push, email, SMS).

#### Search and Sorting
- Events can be searched by: title, date, time, location, via indexed columns.
- Sorting of events can be done based on: date, time, or location to allow for easy filtering and display of relevant events.

#### Pagination (`pagination_limit`)
- Allow users to specify how many events should be displayed on their screen at once. This helps optimize performance for loading events and enhacing user experience.

#### Total Participants
- We can add a trigger (if we want real-time updates), this will automatically update the count every time an event registration is added, updated, or removed. This trigger will ensure that every time a user registers or cancels their registration, the `total_participants` field in the `events` table is updated automatically.

### Event Registered
`events_registered`

| Column Name        | Type                | Properties & Constraints         | Description |
|--------------------|---------------------|----------------------------------|-------------|
| **id**             | `UUID`              | Primary key, Auto-generated      | Unique identifier for each event registration. |
| **user_id**        | `UUID`              | Foreign key → `users(id)`        | ID of the user who registered for the event. |
| **event_id**       | `UUID`              | Foreign key → `events(id)`       | ID of the event the user is registering for. |
| **status**         | `ENUM('pending', 'registered', 'canceled')` | Default: 'pending' | The current status of the registration (pending, registered, canceled). |
| **created_at**     | `TIMESTAMP`         | Auto-generated                   | Timestamp when the registration was created. |

#### Event Registeration Status
- `event_registrations` table tracks the status of each registration (i.e., whether the user is pending, registered, or has canceled their registration).
- This is important for tracking participation and managing event capacities.

- Pagniation: implemented via `LIMIT` and `OFFSET` in SQL queries.
- Search: full-text search using `tsvector` for efficient searching by user and event information.
- Filtering: Filtering by: status, user_id, event_id, and other columns.

### Services

Handles church service schedules, volunteer registration, and service details.
- Relationships: `services` are linked to `users`, and `service_registrations` connect users wsith services.

### Home Group
Handles small-group gatherings.

- Relationships: `home_groups` are linked to `users` via `leader_id`, and `home_group_members` track members.

### Donations
Handles financial and crypto donations.

- Relationships: Donations are linked to `users(id)`.

### Notifications

Manages push, email, and SMS notifications.

- Relationships: Notifications are linked to `users(id)`.

## Inter-Service Communication
Microservices interact using REST APIs, GraphQL, or event-driven messaging.
1. User service -> Events, Services and Donations:
- When a user registers, their `user_id` is referenced in other services.
2. Events and Services -> Notifications:
- When a user registers, an event triggers a notification.
3. Donations -> User Service:
- After a donation, the transaction is recorded under `user_id`.

## Deployment Strategy
### Local Deployment
Each service has its own PostgreSQL database instance:
- User Docker Compose:
    + Spin up multiple PostgreSQl containers for each microservice.
    + Configure each service with its own `DATABASE_URL`.

### Cloud Deployment
- AWS RDS (PostgreSQL)
    + Each microservice gets a separate PostgreSQL instance in AWS RDS.
    + Use IAM authentication for secure access.