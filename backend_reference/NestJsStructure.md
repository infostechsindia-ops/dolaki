# NestJS Backend Project Structure

This serves as the foundational architecture for the multi-platform AuraMart backend.

```text
auramart-backend/
├── src/
│   ├── app.module.ts             # Root application module
│   ├── main.ts                   # Application entry point
│   │
│   ├── common/                   # Shared resources
│   │   ├── decorators/           # Custom decorators (e.g., @CurrentUser, @Roles)
│   │   ├── filters/              # Global exception filters
│   │   ├── guards/               # Auth & Role guards (RolesGuard)
│   │   ├── interceptors/         # Response transformations, logging
│   │   └── middleware/           # Express middlewares (JwtAuthMiddleware)
│   │
│   ├── config/                   # Configuration management
│   │   ├── database.config.ts    # TypeORM / Prisma PostgreSQL config
│   │   └── env.validation.ts     # Joi validation for environment variables
│   │
│   ├── modules/                  # Feature Modules
│   │   │
│   │   ├── auth/                 # Authentication & Authorization
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   └── strategies/       # Passport.js strategies (JWT, Google, Apple)
│   │   │
│   │   ├── users/                # Customer, Vendor, Admin management
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.module.ts
│   │   │   └── dto/              # Data Transfer Objects
│   │   │
│   │   ├── products/             # Inventory and Product Catalog
│   │   │   ├── products.controller.ts
│   │   │   ├── products.service.ts
│   │   │   └── entities/         # TypeORM Entities / Models
│   │   │
│   │   ├── orders/               # Order Lifecycle & Multi-vendor splitting
│   │   │   ├── orders.controller.ts
│   │   │   └── orders.service.ts
│   │   │
│   │   ├── vendor-portal/        # Dedicated endpoints for Vendor dashboard
│   │   │   ├── vendor.controller.ts
│   │   │   └── vendor.service.ts # Aggregates analytics, sales, inventory
│   │   │
│   │   └── admin-panel/          # Dedicated endpoints for Admin dashboard
│   │       ├── admin.controller.ts
│   │       └── admin.service.ts  # System-wide metrics, user management
│   │
│   └── database/                 # Database Migrations and Seeding
│       ├── migrations/           
│       └── seeds/                # Initial dummy data
│
├── .env                          # Environment Variables
├── docker-compose.yml            # Local PostgreSQL & Redis setup
├── package.json
└── tsconfig.json
```

## Key Technologies
* **Framework:** NestJS (Node.js/TypeScript)
* **Database:** PostgreSQL with TypeORM or Prisma
* **Caching:** Redis (for session caching, quick commerce inventory sync)
* **Auth:** Passport.js with JWT
