# 🛡️ Authentication Microservice Design Documentation

## 📁 Directory Structure

```
backend/
├── src/
│   ├── auth/                    # Authentication module
│   │   ├── dto/                 # Data Transfer Objects
│   │   │   ├── login.dto.ts
│   │   │   ├── register-user.dto.ts
│   │   │   └── admin-login.dto.ts
│   │   ├── guards/              # Authorization guards
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── admin.guard.ts
│   │   ├── auth.controller.ts   # API endpoints
│   │   ├── auth.service.ts      # Business logic
│   │   └── auth.module.ts       # Module configuration
│   ├── prisma/                  # Database layer
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── main.ts                  # Application entry point
│   └── app.module.ts            # Root module
├── prisma/
│   └── schema.prisma            # Database schema
├── .env                         # Environment variables
├── jest.config.js               # Jest configuration
├── package.json                 # Project metadata and scripts
└── tsconfig.json                # TypeScript configuration
```

---

## ⚙️ Code Flow and Implementation Order

1. **Prisma Setup**
2. **DTO Validation**
3. **Guards Configuration**
4. **Authentication Logic**
5. **Controller Routing**

---

## 🎯 Flow of Execution

1. Application bootstraps via `main.ts`
2. `AppModule` loads:
   - `PrismaModule`
   - `AuthModule`
   - `ConfigModule`
3. Request hits controller:
   - Validated with DTO
   - Processed in service
   - Checked by guards
   - Uses Prisma for DB
   - Sends response

---

## 🧩 Design Patterns

| Pattern              | Used In                                   |
|----------------------|--------------------------------------------|
| Modular Architecture | NestJS modules (auth, prisma, etc.)        |
| Dependency Injection | Service injection (e.g., `AuthService`)    |
| DTO Pattern          | `login.dto.ts`, `register-user.dto.ts`    |
| Strategy Pattern     | Guards and token/auth strategy             |
| DAO/Repository       | Prisma ORM abstraction layer               |
| Middleware           | CORS, cookie parsing, validation pipe      |

---

## 🏗️ System Architecture

- **Layered Architecture**
  - Controller → Service → Prisma
- **RBAC (Role-Based Access Control)**
  - `RoleType` enum + `AdminGuard`
- **JWT-based Stateless Auth**
- **Scalable Module Design**

---

## ✅ Implemented Features

- [x] **User Registration**
- [x] **User Login**
- [x] **Admin Login**
- [x] **Role-Based Guards**
- [x] **JWT Auth**
- [x] **Password Hashing**
- [x] **Firebase Integration**
- [x] **Prisma ORM Integration**
- [x] **Admin Dashboard**
- [x] **Structured Logging**

---

## 📈 Planned Features

- [ ] Password Reset
- [ ] Rate Limiting & 2FA
- [ ] Profile Updates & Deletion
- [ ] Analytics & Logging
- [ ] Swagger API Docs

---

## 📡 API Endpoints

| Method | Endpoint                     | Description                         |
|--------|------------------------------|-------------------------------------|
| POST   | `/auth/register`             | User registration                   |
| POST   | `/auth/login`                | User login                          |
| POST   | `/auth/admin/login`          | Admin login (requires secret)       |
| GET    | `/auth/validate`             | Token validation                    |
| GET    | `/auth/admin/dashboard`      | Admin-only dashboard                |
| POST   | `/auth/logout`               | Logout (planned)                    |
| POST   | `/auth/refresh`              | Refresh token (planned)             |
| POST   | `/auth/reset-password`       | Password reset (planned)            |

---

## 🔐 Security Features

- ✅ JWT Token Auth
- ✅ Password Hashing
- ✅ Admin Role Verification
- ✅ DTO Input Validation
- ✅ CORS Config
- ✅ Secure Headers
- ✅ Cookie Parsing
- ✅ Structured Logging

---

## 🧠 Summary

This backend system is built using **NestJS**, **Prisma**, and **PostgreSQL**, with strong security, scalability, and separation of concerns. It supports real-world use cases for user/admin auth, is extensible to microservices, and is CI/CD-friendly.

---

