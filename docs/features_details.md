# Feature Breakdown
| **Feature Category**          | **Feature**                   | **Guest** | **Signed-in User** | **Admin** |
|-------------------------------|-------------------------------|-----------|---------------------|-----------|
| **Church Information**         | View church info              | ✅        | ✅                  | ✅        |
| **Events**                     | View events list              | ✅        | ✅                  | ✅        |
|                               | Register for events           | ❌        | ✅                  | ✅        |
|                               | Upload event images           | ❌        | ❌                  | ✅        |
|                               | Create/edit/delete events     | ❌        | ❌                  | ✅        |
|                               | Share event on social media   | ❌        | ✅                  | ✅        |
| **Services**                   | View service list             | ❌        | ✅                  | ✅        |
|                               | Register for services         | ❌        | ✅                  | ✅        |
|                               | View service details (date, time, etc.) | ❌ | ✅              | ✅        |
|                               | Upload service images         | ❌        | ❌                  | ✅        |
|                               | Create/edit/delete services   | ❌        | ❌                  | ✅        |
| **Donations**                  | Donate (fiat & crypto)        | ✅        | ✅                  | ✅        |
| **Home Groups**                | View home group details       | ✅        | ✅                  | ✅        |
|                               | Register for home groups      | ❌        | ✅                  | ✅        |
| **Notifications**              | Enable event/service notifications | ❌    | ✅                  | ✅        |
|                               | Receive event/service reminders (push, email, SMS) | ❌ | ✅    | ✅        |
| **User Management**            | Manage user accounts          | ❌        | ✅                  | ✅        |
|                               | Change profile information    | ❌        | ✅                  | ✅        |
|                               | Change email/password         | ❌        | ✅                  | ✅        |
|                               | Manage notification settings  | ❌        | ✅                  | ✅        |
|                               | Manage privacy settings       | ❌        | ✅                  | ✅        |
|                               | Deactivate/delete account     | ❌        | ✅                  | ✅        |

## Church Information
- View Church Info: This feature allows all users (guest, signed-in users, and admins) to view basic church information like services, contact details, address, and history.
- Why: This is the first step for any user who accesses the app. It provides transparency and helps them understand the church's mission and goals.

## Events
- View Events List: Users can view all events organized by the church, whether they are signed in or guests. This include basic information like event title, date, and short description.
- Register for Events: Signed-in users and admins can register for events, while guests can only view event details. This is critical feature, especially for high-demand events.
- Upload Event Images: Admins have full control over creating, editing, or deleting events. This will include setting event titles, descriptions, images, and registration requirements.
- Create/Edit/Delete Events: Admins have full control over creating, editing, or deleting events. This will include setting event titles, descriptions, images, and registration requirements.
- Share Event on Social Media: Signed-in users and admins can share event details directly on social media platforms. This is an excellent way to increase awareness and attendance for upcoming church events.

## Services
- Views Service List: Signed-in users and admins can view available services (e.g., Bible study, Worship services, etc.)
- Register for Services: Similar to events, users can register for services. This includes confirming attendance, choosing specific dates, and tracking service attendance.
- View Service Details: Once registered, users can access details information about the service (e.g., schedule, time, date, theme, etc.)
- Upload Service Images: Admins can upload service-related media to highlight upcoming services, capture moments from previous ones, and provide visual context to the service descriptions.
- Create/Edit/Delete Services: Admins manage service creation, including times, dates, locations, and additional resources.

## Donations
- Donate (Fiat and Crypto): The app integrates secure payment systems, allowing users to donate via fiat (using Stripe or Paypal) or cryptocurrentcy (Tezos blockchain). Both signed-in users and guests can donate, but users have more options for tracking and recurring donations.
- Why: This is a crucial part of the app since donations are a vitual source of income for churches, and it allows the community to contribute regardless of geographical location.

## Home Groups
- View Home Group Details: All users can view home group details (e.g., group name, description, schedule, etc.). Signed-in users and admins will also be able to register for the home groups.
- Reigster for Home Groups: Signed-in users can register to participate in home groups, while admins can manage registrations.
- Why: Home groups are central to building a strong community, and this feature supports those seeking a more personal, small-group interaction.

## Notifications
- Enable Event/Service Notifications: Signed-in users and admins can opt-in to receive notifications for upcoming events and services (e.g., reminders, new events).
- Receive Event/Service Reminders (Push, Email, SMS): Users can choose their preferred notification channels (push notification, email, SMS) to receive reminders for events and services they've signed up for. Admins can configure reminders for registered users.
- Why: Push notifications and reminders help ensure users don't miss important events or services. This boosts engagement and ensures that users attend the events they've registered for.

## User Management
- Manage User Accounts: Admins can view and manage all users within the system, assigning roles, controlling accesss, and deleting users when necessary.
- Change Profile Information: Signed-in users can update their profile information (name, photo, contact details). Admins can also update user profile if necessary.
- Change Email/Password: Users can update their email addresses or change their password for security reasons.
- Manage Notification Settings: Users can configure their notification perferences (email, SMS, push notifications). Admins also have control over configuring default notification settings for the entire system.
- Manage Privacy Settings: Signed-in users can control the visibility of their personal information (e.g., who can see their profile, donations, or event registrations).
- Deactivate/Delete Account: Users can choose to deactivate or delete their accounts, either temporarily or permanently, depending on the settings provided by the app.