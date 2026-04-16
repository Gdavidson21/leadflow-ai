# 📁 Project Structure Guide

## Complete Folder Layout

```
Leadflow AI/
│
├── 📄 README.md                 # Main project documentation
├── 📄 SETUP.md                  # Quick start guide
├── 📄 DEVELOPMENT.md            # Detailed development guide
├── 📄 ARCHITECTURE.md           # System architecture & design
├── 📄 package.json              # Root package for monorepo scripts
├── 📄 docker-compose.yml        # Docker services configuration
├── 📄 .gitignore               # Git ignore patterns
├── 📄 .gitattributes           # Git attributes
├── 📄 .editorconfig            # Editor configuration
│
├── 🗂️ backend/                  # Node.js Express backend
│   ├── 📄 package.json          # Backend dependencies
│   ├── 📄 tsconfig.json         # TypeScript configuration
│   ├── 📄 .eslintrc.json        # ESLint configuration
│   ├── 📄 .npmrc                # NPM configuration
│   ├── 📄 jest.config.js        # Jest test configuration
│   ├── 📄 Dockerfile            # Docker build configuration
│   ├── 📄 .env.example          # Environment variables template
│   │
│   ├── 🗂️ src/
│   │   ├── 📄 index.ts          # Application entry point
│   │   │
│   │   ├── 🗂️ config/           # Configuration files
│   │   │   ├── database.ts      # PostgreSQL connection
│   │   │   └── redis.ts         # Redis connection
│   │   │
│   │   ├── 🗂️ routes/           # API route handlers
│   │   │   ├── index.ts         # Main router
│   │   │   ├── leads.ts         # Leads endpoints
│   │   │   ├── campaigns.ts     # Campaign endpoints
│   │   │   ├── messages.ts      # Message endpoints
│   │   │   └── analytics.ts     # Analytics endpoints
│   │   │
│   │   ├── 🗂️ controllers/      # Request handlers
│   │   │   ├── leadsController.ts
│   │   │   ├── campaignsController.ts
│   │   │   ├── messagesController.ts
│   │   │   └── analyticsController.ts
│   │   │
│   │   ├── 🗂️ services/         # Business logic
│   │   │   ├── leadsService.ts
│   │   │   ├── campaignsService.ts
│   │   │   ├── messagesService.ts
│   │   │   └── analyticsService.ts
│   │   │
│   │   ├── 🗂️ models/           # Database models
│   │   │   └── (placeholders for future models)
│   │   │
│   │   ├── 🗂️ middleware/       # Express middleware
│   │   │   ├── errorHandler.ts  # Error handling
│   │   │   └── logger.ts        # Request logging
│   │   │
│   │   ├── 🗂️ jobs/             # Background jobs
│   │   │   └── scheduler.ts     # Bull queue configuration
│   │   │
│   │   ├── 🗂️ utils/            # Utility functions
│   │   │   ├── index.ts         # Common utilities
│   │   │   └── validators.ts    # Input validation schemas
│   │   │
│   │   ├── 🗂️ types/            # TypeScript type definitions
│   │   │   └── index.ts         # API types
│   │   │
│   │   └── 🗂️ __tests__/        # Unit tests
│   │       └── leads.test.ts    # Test example
│   │
│   ├── 🗂️ migrations/           # Database migrations
│   │   ├── 001_initial_schema.ts # Initial schema
│   │   ├── run.ts               # Migration runner
│   │   └── seed.ts              # Data seeding
│   │
│   └── 🗂️ dist/                 # Compiled JavaScript (generated)
│
│
├── 🗂️ frontend/                 # React TypeScript frontend
│   ├── 📄 package.json          # Frontend dependencies
│   ├── 📄 index.html            # HTML entry point
│   ├── 📄 vite.config.ts        # Vite configuration
│   ├── 📄 tsconfig.json         # TypeScript configuration
│   ├── 📄 tsconfig.node.json    # TypeScript node config
│   ├── 📄 .eslintrc.json        # ESLint configuration
│   ├── 📄 .npmrc                # NPM configuration
│   ├── 📄 Dockerfile            # Docker build configuration
│   ├── 📄 tailwind.config.js    # Tailwind CSS configuration
│   ├── 📄 postcss.config.js     # PostCSS configuration
│   │
│   ├── 🗂️ src/
│   │   ├── 📄 main.tsx          # React entry point
│   │   ├── 📄 App.tsx           # Root component
│   │   ├── 📄 App.css           # Root styles
│   │   ├── 📄 index.css         # Global styles
│   │   │
│   │   ├── 🗂️ pages/            # Page components
│   │   │   ├── Dashboard.tsx    # Dashboard page
│   │   │   ├── Leads.tsx        # Leads management
│   │   │   ├── Campaigns.tsx    # Campaign management
│   │   │   └── Analytics.tsx    # Analytics page
│   │   │
│   │   ├── 🗂️ components/       # Reusable components
│   │   │   ├── Navbar.tsx       # Navigation bar
│   │   │   └── Navbar.css       # Navbar styles
│   │   │
│   │   ├── 🗂️ styles/           # Component styles
│   │   │   ├── Dashboard.css
│   │   │   ├── Leads.css
│   │   │   ├── Campaigns.css
│   │   │   └── Analytics.css
│   │   │
│   │   ├── 🗂️ services/         # API integration
│   │   │   └── api.ts           # Axios API client
│   │   │
│   │   ├── 🗂️ store/            # State management
│   │   │   └── index.ts         # Zustand store
│   │   │
│   │   ├── 🗂️ types/            # TypeScript types
│   │   │   └── index.ts         # Type definitions
│   │   │
│   │   ├── 🗂️ utils/            # Utility functions
│   │   │   └── index.ts         # Common utilities
│   │   │
│   │   └── 🗂️ __tests__/        # Component tests
│   │       └── Dashboard.test.tsx # Test example
│   │
│   ├── 🗂️ public/               # Static assets
│   │   └── (place images, icons here)
│   │
│   └── 🗂️ dist/                 # Built files (generated)
│
│
└── 🗂️ node_modules/             # Project dependencies (generated)
    └── (managed by npm/node)
```

## Key Directories Explained

### Backend (`backend/`)
Contains the Node.js + Express API server.

- **`src/config/`** - Database and Redis setup
- **`src/routes/`** - HTTP endpoint definitions
- **`src/controllers/`** - Request handlers that call services
- **`src/services/`** - Business logic and database queries
- **`src/middleware/`** - Error handling, logging, authentication
- **`src/jobs/`** - Background task scheduler (Bull queues)
- **`migrations/`** - Database schema and seed data
- **`src/__tests__/`** - Unit tests

### Frontend (`frontend/`)
Contains the React + TypeScript web interface.

- **`src/pages/`** - Full page components
- **`src/components/`** - Reusable UI components
- **`src/services/`** - API client and HTTP utilities
- **`src/store/`** - Global state management (Zustand)
- **`src/types/`** - TypeScript interfaces
- **`src/styles/`** - CSS stylesheets
- **`public/`** - Static assets (images, fonts, etc.)
- **`src/__tests__/`** - Component tests

## File Organization Patterns

### Service Layer Pattern (Backend)
```
User Request
    ↓
Route Handler
    ↓
Controller (validation, error handling)
    ↓
Service (business logic)
    ↓
Database Query
    ↓
Response
```

### Component Pattern (Frontend)
```
Page Component
    ↓
Sub Components
    ↓
Services (API calls)
    ↓
Store (state management)
    ↓
Rendered UI
```

## Configuration Files Explained

| File | Purpose |
|------|---------|
| `.env.example` | Template for environment variables |
| `package.json` | Project dependencies and scripts |
| `tsconfig.json` | TypeScript compiler options |
| `.eslintrc.json` | Code style rules |
| `jest.config.js` | Test runner configuration |
| `docker-compose.yml` | Docker services setup |
| `Dockerfile` | Docker image definition |
| `vite.config.ts` | Frontend build tool configuration |
| `tailwind.config.js` | CSS framework configuration |

## How to Add New Features

### Adding a New API Endpoint

1. Create controller in `backend/src/controllers/featureName.ts`
2. Create service in `backend/src/services/featureService.ts`
3. Add route in `backend/src/routes/feature.ts`
4. Register route in `backend/src/routes/index.ts`

### Adding a New Database Table

1. Create migration in `backend/migrations/XXX_table_name.ts`
2. Run migration: `npm run migrate`
3. Create TypeScript interface in `backend/src/types/index.ts`
4. Create service in `backend/src/services/`

### Adding a New Page

1. Create page component in `frontend/src/pages/PageName.tsx`
2. Create styles in `frontend/src/styles/PageName.css`
3. Add route in `frontend/src/App.tsx`
4. Add navigation in `frontend/src/components/Navbar.tsx`

### Adding a New Component

1. Create component in `frontend/src/components/ComponentName.tsx`
2. Create styles in `frontend/src/components/ComponentName.css`
3. Optionally add unit tests in `frontend/src/__tests__/`
4. Import and use in pages

## Git Workflow

```
main (production)
    ↓
develop (development)
    ↓
feature/feature-name (individual features)
```

## Naming Conventions

### Backend
- Files: `camelCase.ts` for services, `PascalCase.ts` for models
- Folders: `lowercase`
- Functions: `camelCase`
- Constants: `UPPERCASE_WITH_UNDERSCORES`

### Frontend
- Files: `PascalCase.tsx` for components, `camelCase.ts` for utilities
- Folders: `lowercase`
- Components: `PascalCase`
- Functions: `camelCase`

## Environment Setup

Backend environment variables are in `backend/.env`:
```env
DATABASE_URL=...
REDIS_URL=...
OPENAI_API_KEY=...
JWT_SECRET=...
PORT=3000
NODE_ENV=development
```

## Important Notes

- **Never commit `.env` files** - Contains sensitive information
- **Database runs in Docker** - Changes persist between restarts
- **Frontend proxies to backend** - See `vite.config.ts`
- **All services configured in `docker-compose.yml`**
- **Tests go in `__tests__` folders**
- **Migrations are tracked in Git** - Apply in order

## Quick Reference

```bash
# Backend development
cd backend && npm run dev

# Frontend development
cd frontend && npm run dev

# Docker operations
docker-compose up -d
docker-compose logs -f
docker-compose down

# Database operations
docker-compose exec backend npm run migrate
docker-compose exec backend npm run seed
docker-compose exec postgres psql -U leadflow_user -d leadflow_db
```

For more details, see the comprehensive guides:
- [SETUP.md](SETUP.md) - Quick start
- [DEVELOPMENT.md](DEVELOPMENT.md) - Detailed development
- [ARCHITECTURE.md](ARCHITECTURE.md) - System design
