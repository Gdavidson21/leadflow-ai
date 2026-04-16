# Leadflow AI - Development Guide

## Getting Started

This document provides detailed instructions for setting up and developing Leadflow AI.

## System Requirements

- **OS**: macOS, Linux, or Windows (with WSL2)
- **Node.js**: 18.0+
- **npm**: 8.0+
- **Docker**: 20.10+
- **Docker Compose**: 2.0+

## Installation

### Option 1: Docker (Recommended)

```bash
# 1. Navigate to project
cd "Leadflow AI"

# 2. Copy environment template
cp backend/.env.example backend/.env

# 3. Edit backend/.env and add your OpenAI API key
# OPENAI_API_KEY=sk-your-key-here

# 4. Start all services
docker-compose up -d

# 5. Run migrations and seed data
docker-compose exec backend npm run migrate
docker-compose exec backend npm run seed
```

Access the app:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000

### Option 2: Local Development

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Run migrations
npm run migrate

# Seed sample data
npm run seed

# Start server
npm run dev
```

The server will run on http://localhost:3000

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on http://localhost:3001

## Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Run commands in container
docker-compose exec backend npm run migrate
docker-compose exec postgres psql -U leadflow_user -d leadflow_db

# Rebuild containers
docker-compose up -d --build

# Remove volumes (WARNING: Deletes data)
docker-compose down -v
```

## Database

### PostgreSQL Connection

Local development:
```
Host: localhost
Port: 5432
Database: leadflow_db
User: leadflow_user
Password: (from .env)
```

Docker:
```
Host: postgres (internal)
Port: 5432
Database: leadflow_db
User: leadflow_user
```

### Common Database Commands

```bash
# Connect to database (Docker)
docker-compose exec postgres psql -U leadflow_user -d leadflow_db

# View tables
\dt

# Run SQL query
SELECT * FROM leads;

# Exit
\q
```

## API Development

### Create new endpoint

1. **Create controller** in `backend/src/controllers/`:
```typescript
export async function myEndpoint(req: Request, res: Response): Promise<void> {
  // Implementation
  res.json({ data: 'response' });
}
```

2. **Create route** in `backend/src/routes/`:
```typescript
import { myEndpoint } from '../controllers/myController';
router.get('/endpoint', asyncHandler(myEndpoint));
```

3. **Test the endpoint**:
```bash
curl http://localhost:3000/api/endpoint
```

## Frontend Development

### Create new page

1. Create file in `frontend/src/pages/MyPage.tsx`
2. Add route in `frontend/src/App.tsx`
3. Add navigation link in `frontend/src/components/Navbar.tsx`

### Create new component

1. Create file in `frontend/src/components/MyComponent.tsx`
2. Create styles in `frontend/src/components/MyComponent.css`
3. Export and use in pages

## Configuration Files

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/leadflow_db
DB_HOST=localhost
DB_PORT=5432
DB_USER=leadflow_user
DB_PASSWORD=your_password
DB_NAME=leadflow_db

# Redis
REDIS_URL=redis://localhost:6379

# OpenAI
OPENAI_API_KEY=sk-your-key
OPENAI_MODEL=gpt-4

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_key
```

## Troubleshooting

### PostgreSQL connection errors
```bash
# Check if postgres is running
docker-compose ps postgres

# View postgres logs
docker-compose logs postgres

# Reset postgres (WARNING: Deletes data)
docker-compose down -v
docker-compose up -d postgres
```

### Redis connection errors
```bash
# Check Redis
docker-compose exec redis redis-cli ping

# View Redis logs
docker-compose logs redis
```

### Port already in use
```bash
# Find process using port
lsof -i :3000  # Backend
lsof -i :3001  # Frontend
lsof -i :5432 # PostgreSQL
lsof -i :6379 # Redis

# Kill process
kill -9 <PID>
```

### Build issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For Docker
docker-compose down
docker-compose up -d --build
```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Production Build

```bash
# Build Docker images
docker-compose -f docker-compose.yml build

# Run in production mode
docker-compose -f docker-compose.yml up -d

# Or build locally
cd backend && npm run build
cd frontend && npm run build
```

## Performance Tips

1. **Enable Redis caching** for frequently accessed data
2. **Use database indexes** on commonly queried columns
3. **Paginate large result sets**
4. **Batch OpenAI API calls** when possible
5. **Use Bull queues** for long-running tasks

## Security Best Practices

1. **Never commit .env files**
2. **Use environment variables** for sensitive data
3. **Validate and sanitize** all user input
4. **Use HTTPS** in production
5. **Enable CORS** only for trusted origins
6. **Rate limit** API endpoints
7. **Keep dependencies updated**

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Bull Queue Documentation](https://github.com/OptimalBits/bull)
- [Docker Documentation](https://docs.docker.com/)

## Support

For issues, check:
1. Docker logs: `docker-compose logs`
2. Application logs
3. Environment variables configuration
4. Database migrations status

## Next Steps

1. Set up your OpenAI API key
2. Configure database credentials
3. Run migrations and seed data
4. Start development servers
5. Begin implementing features

Happy coding! 🚀
