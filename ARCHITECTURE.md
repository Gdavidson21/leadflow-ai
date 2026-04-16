# Leadflow AI - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                          │
│  Dashboard | Leads | Campaigns | Analytics                       │
│  (Port 3001)                                                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    HTTP/REST API
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    Backend (Express)                              │
│  Controllers → Services → Database & Queue Queries               │
│  (Port 3000)                                                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   PostgreSQL          Redis + Bull          OpenAI API
   (Port 5432)         (Port 6379)           (Cloud)
   - Leads             - Message Queue       - GPT-4
   - Campaigns         - Job Scheduler       - Text Generation
   - Messages          - Caching
```

## Data Flow

### Lead Management
1. User creates lead via Frontend
2. Frontend sends POST to Backend
3. Backend validates and stores in PostgreSQL
4. Lead appears in Leads page with status "new"

### Campaign Creation
1. User creates campaign with message template
2. Campaign saved as "draft"
3. User starts campaign
4. Backend queues lead-message jobs in Redis using Bull
5. Background workers process queue every minute

### Message Generation
1. Scheduled job picks up lead
2. Backend calls OpenAI GPT-4 API
3. AI generates personalized message
4. Message stored in database
5. Job marked as complete

### Analytics
1. Dashboard queries aggregated stats
2. Filters by date range
3. Calculates conversion/response rates
4. Real-time metric updates

## Technology Rationale

| Component | Technology | Why |
|-----------|-----------|-----|
| Backend Runtime | Node.js | Fast, scalable, JavaScript ecosystem |
| Web Framework | Express | Lightweight, flexible, widely adopted |
| Database | PostgreSQL | ACID compliance, reliability, JSON support |
| Caching | Redis | Ultra-fast in-memory store, pub/sub |
| Background Jobs | Bull | Built on Redis, reliable, feature-rich |
| AI Integration | OpenAI API | State-of-the-art GPT-4, easy integration |
| Frontend | React | Component-based, large ecosystem, performance |
| Frontend Build | Vite | Fast dev server, optimized production build |
| Containerization | Docker | Consistency, easy deployment, isolation |

## Core Services

### LeadsService
- CRUD operations for leads
- Status tracking
- Lead filtering and search

### CampaignsService
- Campaign lifecycle management
- Message template handling
- Campaign execution control (start/pause)

### MessagesService
- Message creation and storage
- OpenAI integration for AI generation
- Message tracking and delivery status

### AnalyticsService
- Statistics aggregation
- Campaign performance metrics
- Lead engagement tracking

## Process Flow: Campaign Execution

```
┌─────────────────────┐
│  User Starts        │
│  Campaign           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Backend Updates    │
│  Status to "running"│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│  Bull Scheduler (every minute)          │
│  - Fetch active campaigns               │
│  - Get target leads                     │
│  - Queue message send jobs              │
└──────────┬──────────────────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Message Send Job            │
│  - Get lead details          │
│  - Call OpenAI API           │
│  - Generate personalized msg │
│  - Store in database         │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Job Complete                │
│  Message ready for delivery  │
└──────────────────────────────┘
```

## Database Schema

### leads
- id (UUID, Primary Key)
- email (VARCHAR, UNIQUE)
- first_name, last_name (VARCHAR)
- company (VARCHAR)
- phone (VARCHAR)
- status (VARCHAR: new, contacted, interested, converted, rejected)
- created_at, updated_at (TIMESTAMP)

### campaigns
- id (UUID, Primary Key)
- name (VARCHAR)
- description (TEXT)
- message_template (TEXT)
- status (VARCHAR: draft, running, paused, completed)
- sends_per_day (INT)
- created_at, updated_at (TIMESTAMP)

### messages
- id (UUID, Primary Key)
- lead_id (UUID, Foreign Key)
- campaign_id (UUID, Foreign Key)
- content (TEXT)
- generated (BOOLEAN)
- sent_at (TIMESTAMP, nullable)
- created_at, updated_at (TIMESTAMP)

### campaign_leads
- id (UUID, Primary Key)
- campaign_id (UUID, Foreign Key)
- lead_id (UUID, Foreign Key)
- status (VARCHAR)
- created_at (TIMESTAMP)

## API Endpoints Summary

| Method | Endpoint | Function |
|--------|----------|----------|
| GET | /api/leads | Get all leads |
| POST | /api/leads | Create lead |
| PUT | /api/leads/:id | Update lead |
| DELETE | /api/leads/:id | Delete lead |
| GET | /api/campaigns | Get all campaigns |
| POST | /api/campaigns | Create campaign |
| POST | /api/campaigns/:id/start | Start campaign |
| POST | /api/campaigns/:id/pause | Pause campaign |
| GET | /api/messages | Get all messages |
| POST | /api/messages | Create message |
| GET | /api/analytics/overview | Get dashboard stats |

## Scaling Considerations

1. **Database**: Add read replicas, implement sharding
2. **Cache**: Increase Redis cluster, implement cache warming
3. **Jobs**: Distribute Bull workers across multiple instances
4. **API**: Load balance with nginx/HAProxy
5. **Frontend**: Implement CDN, code splitting
6. **Storage**: Move large files to S3/Cloud Storage

## Security Considerations

1. **Authentication**: Implement JWT tokens
2. **Authorization**: Role-based access control (RBAC)
3. **API Keys**: Secure OpenAI key management
4. **Database**: Encrypted passwords, SSL connections
5. **CORS**: Restrict to trusted domains
6. **Rate Limiting**: Prevent abuse
7. **Input Validation**: Sanitize all inputs
8. **Logging**: Audit trail for compliance

## Monitoring & Logging

Recommended additions:
- Sentry for error tracking
- Winston/Pino for structured logging
- Prometheus for metrics
- Grafana for visualization
- DataDog or NewRelic for APM
