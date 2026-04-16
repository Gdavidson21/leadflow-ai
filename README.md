# Leadflow AI

Automated lead management and outreach system powered by AI.

## Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **Queue System**: Redis + Bull
- **AI**: OpenAI API (GPT-4)
- **Frontend**: React + TypeScript
- **Deployment**: Docker

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL 15+
- Redis 7+

### Setup with Docker

1. **Clone and navigate to project**:
   ```bash
   cd Leadflow\ AI/
   ```

2. **Create environment file**:
   ```bash
   cp backend/.env.example backend/.env
   ```

3. **Update environment variables** in `backend/.env`:
   ```env
   OPENAI_API_KEY=sk-your-actual-key
   JWT_SECRET=your-secure-secret
   DB_PASSWORD=your-secure-password
   ```

4. **Start all services**:
   ```bash
   docker-compose up -d
   ```

5. **Run migrations**:
   ```bash
   docker-compose exec backend npm run migrate
   ```

6. **Seed sample data**:
   ```bash
   docker-compose exec backend npm run seed
   ```

7. **Access the application**:
   - Frontend: http://localhost:3001
   - API: http://localhost:3000
   - API Docs: http://localhost:3000/api

### Local Development

#### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
Leadflow AI/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API routes
│   │   ├── models/          # Data models
│   │   ├── middleware/      # Express middleware
│   │   ├── config/          # Database & Redis config
│   │   ├── jobs/            # Background job scheduler
│   │   └── index.ts         # Application entry point
│   ├── migrations/          # Database migrations
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API calls
│   │   ├── store/           # Zustand store
│   │   ├── styles/          # CSS files
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── index.html
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## API Endpoints

### Leads
- `GET /api/leads` - Get all leads
- `GET /api/leads/:id` - Get lead by ID
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

### Campaigns
- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/:id` - Get campaign by ID
- `POST /api/campaigns` - Create campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign
- `POST /api/campaigns/:id/start` - Start campaign
- `POST /api/campaigns/:id/pause` - Pause campaign

### Messages
- `GET /api/messages` - Get all messages
- `GET /api/messages/:id` - Get message by ID
- `POST /api/messages` - Create message
- `DELETE /api/messages/:id` - Delete message

### Analytics
- `GET /api/analytics/overview` - Get overview stats
- `GET /api/analytics/campaigns/:campaignId` - Get campaign statistics
- `GET /api/analytics/leads/:leadId` - Get lead statistics

## Features

- ✅ Lead database management
- ✅ Campaign creation and scheduling
- ✅ AI-powered message generation (OpenAI GPT-4)
- ✅ Automated message scheduling with Bull queues
- ✅ Redis caching
- ✅ Real-time analytics
- ✅ PostgreSQL persistent storage
- ✅ Docker containerization
- ⏳ Email integration
- ⏳ Advanced analytics dashboard
- ⏳ User authentication
- ⏳ A/B testing

## Development

### Install Dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### Environment Variables

See `.env.example` files in backend and frontend directories.

### Database Migrations

```bash
npm run migrate
npm run seed
```

### Testing

```bash
npm test
```

### Building for Production

```bash
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT

## Support

For issues and questions, please refer to the documentation or create an issue in the repository.
