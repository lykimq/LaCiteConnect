# Technical Design Document for La Cite Eglise Mobile and Web Application

## 1. Objective
The goal is develop a church application that supports **both mobile** (Android and iOS) and **web** platforms. The app will handle: **events, donations, user registration, announcements, and allow interaction with the church community**. It should scale up to **100k** users and support **10k concurrent requests**, without the need for complex infrastructure management. It will provide secure payment integration, both for fiat (via Stripe) and cryptocurrency (via Tezos), and push notifications to keep users engaged.

## 2. Key Features
- **Common Information**: Main page with basic church info.
- **Events**: Admin can create/edit/delete events, and users can view and register for events.
- **Donations**: Integration of fiat and crypto donations.
- **Home Groups**: Users can see available homegroups and register for them.
- **Notifications**: Push notifications for events, donations, and announcements.
- **User Roles**: Admin, signed-in user, guest (anonymous).

## 3. Architecture Overview

- Mobile (Android and iOS): React Native with Expo.
- Web: React.js (with TypeScript).
- Authentication: Firebase Auth (Google, Email/Password, Anonymous).
- Backend (API): Node.js with NestJS/Express.js + GraphQL
- Database: PostgreSQL (hosted on Firebase Storage).
- Notification: Firebase Cloud Messaging (FCM).
- Payments: Stripe for fiat, Tezos (Taquito SDK) for crypto donations.
- Hosting/Deployment: Vercel (Web), AWS/DigitalOcean (Backend), AWS RDS (PostgreSQL
)