# User Management Database & Firebase Storage Integration Guide

## Overview

This guide covers the setup of a PostgreSQL database for managing users and integrates Firebase Storage for handling user profile pictures. The database schema includes essential fields for user management, including authentication, roles, privacy settings, and profile management. We will also guide you through uploading and storing user profile pictures in Firebase Storage and linking them with the PostgreSQL database.

## Script for Building/Regenerating the Database
1. `users_db.sh`

```
chmod +x users_db.sh
./users_db.sh
```

2. Firebase Storage Integration
a. Install Firebase SDK

```
npm install firebase-admin
```

b. Initialize Firebase
In the backend, initialize Firebase Admin SDK using the service account crendentials. (The information about the Project ID and the path to the JSON file (`.env`)).

c. Upload Profile Pictures to Firebase
Use Firebase Storage to upload user profile pictures. After uploading, retrieve the image URL for storage in the in the PostgreSQL `users` table.
