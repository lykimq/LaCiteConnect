# Dashboard Design

## Flow
1. The admin logs in and is greeted with a quick overview of the system status, pending user registrations, recent authentication logs, and security alerts.

2. They can manage pending registrations by approving or rejecting users.

3. The admin has a quick overview of failed logins, lockouts, and other security-related actions.

4. The dashboard shows if any user has weak passwords, of if any user has 2FA disabled.

5. Admins can navigate to detailed sections for further user and security management, such as reviewing authentication logs or managing user roles.

## Design Element

1. Card Layouts for Quick Stats: Use card-based layouts for key stats like pending registrations, failed login attempts, and 2FA statuses. Each card should have a clear call-to-action (approve, reject, view details, etc.).

2. Tables for Lists and Logs: Display the lists of pending registrations, user actions, and logs in tables. Provide pagination and search functionality for easy access to large amounts of data.

3. Actionable Alerts: Use prominent alerts for critical actions like failed logins, password reset requests, and potential security threats.

4. Side Navigation: A sidebard navigation with clear sections such as:
- Dashboard
- Pending Registrations
- Login Activity
- Password Management
- Security Logs

5. Profile and Account Settings for Admin: Include an admin profile section where they can update their information, change passwords, and configure authentication preferences (e.g., enforce 2FA for all users).

## Admin Authentication Dashboard
1. Dashboard Overview:
- Welcome Message: Greet the admin by name, e.g., "Welcome, [Admin Name]!"
- System Health Check: Quick system status (e.g., server uptime, authentication service status).
- Admin Activity Feed: A quick feed showing recent admin actions like user registration approvals, logins, and password changes.

2. Authentication Management
- User Registration Overview:
    + Pending Registrations: Display a list of users who have registrated but are pending approval.
    + Actions: Options to approve or reject pending registrations.
    + Quick Access: A "view user" link for admins to view the profile of a registered user.
    + Search/Filter: Allow admins to filter pending registrations by date, name, or status.
- User Authentication Logs:
    + Last login: Display the last login date and time for each user.
    + Failed Login Attempts: Highlight users who have failed multiple login attempts.
    + User Suspensions: List any users who have been suspended due to security concerns (e.g., failed login attempts or suspicious activity).
    + Account Lockout Alerts: Warn about accounts locked due to too m any failed login attempts.
- Password Management:
    + Password Reset Requests: Display requests for passowrd resets, with options to approve or reject.
    + Passowrd Strength Metrics: Show statistics on users with weak passwords or those who haven't changed their password in a long time.
- Two-Factor Authentication (2FA):
    + 2FA Status: Show whether users have enabled 2FA.
    + Enable/Disable 2FA: Options for the admin to enforce or disable 2FA for certain users.
    + 2FA Enrollment Status: List users who have not yet completed 2FA enrollment.
4. Audit and Security Monitoring:
- Authentication Audit Logs:
    + Recent Actions: Display a history of authentication-related actions, such as user logins, failed login attempts, password changes, and role updates.
    + Admin Actions Log: Keep track of admin actions such as approval of user registrations, password resets, and role changes.
- Security Alerts:
    + Suspicious Login Location: Display users who are logging in from unusual locations or devices.
    + Account Compromise Alerts: Display alerts for potential account compromise, such as multiple failed login attempts or location changes.

4. User Role Managment
- Manage Admin Roles: Allow the admin to assign or remove admin roles or permissions for other users.
- Permission Settings: A section where admins can modify permissions related to authentication (e.g., who can approve users, reset passwords, etc.)

5. Account Settings and Customization
- Admin Profile Management: Allow admins to change their own password, email, or profile settings.
- Customizable Notifications: Let admins set up notifications for specific events (e.g., when a user registers, when there is a failed login attempt0).

## Priority Order

1. Basic Dashboard Setup
- Goal: Establish a foundation for the admin dashboard that can be expanded later with specific features.
- Tasks:
    + Set up the admin dashboard page structure.
    + Include a navigation bar and sidebar (if needed) for easy access to different sections.
    + Design a welcome section to greet the admin with their name (fetch from user context).
    + Add placeholders for system health check, recent activity, and user-related metrics (without full data for now)
2. User Registration Overview
- Goal: Display and manage pending user registrations.
- Tasks:
    + Fetch pending registration data from the backend (`GET /api/users/pending`) (planned)
    + Create a list or table showing pending registrations with action buttons to **approve** or **reject**.
    + Implement the **approve** or **reject** actions, calling the respective backend endpoint (`POST /api/user/approve`, `POST /api/user/reject`) (planned).
    + Display a message when there are no pending users.
3. Authentication Logs
- Goal: Display authentication logs for user activities (e.g., logins, failed login attempts).
- Tasks:
    + Fetch authentication logs from the backend (`GET /api/auth/logs`) (planned).
    + Display the logs in a table, including information such as: **login time, IP address** and **status** (success or failure).
    + Allow filtering by date or user.
    + Highlight users with multiple failed login attempts and provide the option to take action (e.g., suspend account).
4. Failed Login and Account Lockout Alerts
- Goal: Track and alert for failed login attempts and account lockouts.
- Tasks:
    + Display a section showing users with **failed login attempts**.
    + Include a **lockout alert** section for accounts that have been temporarily locked due to repeated failed login attempts.
    + Implement functinality to **unlock accounts** if needed.
    + Set up a warning message or alert for admins when suspicious activity (e.g., many failed attempts) is detected.
5. Password Management
- Goal: Enable password management for users and enforce strong password policies.
- Tasks:
    + Display a list of users with **weak passwords** or those who have not updated their passwords in a set period.
    + Implement functionality to allow the admin to send **password reset requests**.
    + Show a **password strength meter** for users during password change requests.
    + Display a section to manage **password reset requests** that need admin approval.
6. 2FA Management
- Goal: Manage and enforce 2FA for users.
- Tasks:
    + Display a section showing which users have **2FA enabled**.
    + Implement an option for the admin to **enforce 2FA** for all users (or for specific roles).
    + Add functionality to allow users to enable or disable 2FA on their accounts (admin can also help).
    + Display a notification for users who have not completed the 2FA setup.
7. Security and Audit Logs
- Goal: Track all authentication-related activities, both by users and admins.
- Tasks:
    + Fetch and display **audit logs** related to user authentication actions (e.g., logins, password changes).
    + Include an option to filter logs by date, user, or action type.
    + Show a history of **admin actions** like approval or rejection of users.
    + Highlight **suspicious activities** (e.g., multiple password changes or IP address changes).
8. Admin Role and Permission Management
- Goal: Manange admin roles and permissions for user authentication-related tasks.
- Tasks:
    + Display a section where the admin can assign roles (e.g., regular admin, super admin) to users.
    + Allow the admin to assign or remove permissions for user authentication tasks (approve/reject registrations, reset passwords, enable 2FA).
    + Implement functionality for **role-based access control** (RBAC) in the admin dashboard.
9. Profile Management for Admins
- Goal: Allow admins to manage their profile and settings.
- Tasks:
    + Implement an admin profile section where admins can update their personal details (e.g., name, email).
    + Allow password changes and updates of security settings (e.g., 2FA).
    + Implement functionality to update notification preferences (e.g., receive alerts on failed login attempts).
10. Customizable Security Alerts
- Goal: Allow admins to set up custom security alerts and notifications for critical authentication events.
- Tasks:
    + Implement a settings page where admins can customize alerts for events such as failed logins, passwords resets, or 2FA change.
    + Allow admins to receive notifications via email or within the dashboard for critical security events.