# Quick Start Guide - Leadflow AI

## 🚀 Get Started in 5 Minutes

### Prerequisites on macOS
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Docker Desktop
brew install --cask docker

# Install Node.js (optional, for local development)
brew install node
```

### Setup with Docker (Easiest)

```bash
# 1. Navigate to project folder
cd "Leadflow AI"

# 2. Copy environment template
cp backend/.env.example backend/.env

# 3. Edit .env and add OpenAI API key
# Open: backend/.env
# Find: OPENAI_API_KEY=sk-your-key-here
# Replace with your actual OpenAI key from https://platform.openai.com/api-keys

# 4. Start everything
docker-compose up -d

# 5. Wait for services to start (about 10 seconds)
sleep 10

# 6. Run database setup
docker-compose exec backend npm run migrate
docker-compose exec backend npm run seed
```

**Done!** Open your browser:
- Frontend: http://localhost:3001
- API: http://localhost:3000

### Setup for Local Development (Without Docker)

#### Step 1: Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Copy environment
cp .env.example .env

# Edit .env with your settings
nano .env

# Need PostgreSQL running first:
# macOS: brew install postgresql@15
# Start PostgreSQL: brew services start postgresql@15

# Run migrations
npm run migrate

# Seed demo data
npm run seed

# Start backend server
npm run dev
```

Backend will run on http://localhost:3000

#### Step 2: Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend will run on http://localhost:3001

## 📦 What Gets Set Up

### Services
- ✅ **PostgreSQL** - Lead and campaign data
- ✅ **Redis** - Message queue and caching
- ✅ **Node.js API** - Backend server
- ✅ **React App** - Web interface

### Features
- ✅ Lead management dashboard
- ✅ Campaign creation and scheduling
- ✅ AI message generation (OpenAI GPT-4)
- ✅ Real-time analytics
- ✅ Automated message queue system

## 🔑 Get Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in to your OpenAI account
3. Click "Create new secret key"
4. Copy the key (you can only see it once!)
5. Paste it in `backend/.env` where it says `OPENAI_API_KEY=sk-...`

## 📝 Common Commands

### Docker Commands
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Run migrations
docker-compose exec backend npm run migrate

# Access database
docker-compose exec postgres psql -U leadflow_user -d leadflow_db

# Run backend command
docker-compose exec backend npm run seed

# Restart services
docker-compose down
docker-compose up -d
```

### Local Development Commands
```bash
# Backend
cd backend
npm run dev      # Start dev server
npm run build    # Build for production
npm test         # Run tests
npm run lint     # Check code style

# Frontend
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Check code style
```

## 🛠️ Troubleshooting

### Services won't start
```bash
# Make sure Docker Desktop is running
open -a Docker

# Check system resources
docker-compose ps

# Reset and restart
docker-compose down -v
docker-compose up -d
```

### Can't connect to database
```bash
# Check PostgreSQL is running
docker-compose logs postgres

# Reset database
docker-compose down
docker exec leadflow_postgres rm -rf /var/lib/postgresql/data
docker-compose up -d
docker-compose exec backend npm run migrate
```

### OpenAI API errors
- Check API key is correct in `backend/.env`
- Check you have API credits: https://platform.openai.com/account/billing/overview
- Check key hasn't been revoked: https://platform.openai.com/api-keys

### Port already in use
```bash
# Kill process using port 3000
lsof -i :3000 | grep -v PID | awk '{print $2}' | xargs kill -9

# Kill process using port 3001
lsof -i :3001 | grep -v PID | awk '{print $2}' | xargs kill -9

# Kill process using port 5432
lsof -i :5432 | grep -v PID | awk '{print $2}' | xargs kill -9

# Kill process using port 6379
lsof -i :6379 | grep -v PID | awk '{print $2}' | xargs kill -9
```

### Build errors
```bash
# Clear Docker cache
docker-compose down -v
docker system prune -a

# Rebuild
docker-compose up -d --build
```

## 📚 Next Steps

1. **Explore the Dashboard**: http://localhost:3001
2. **View Sample Data**: Go to Leads page to see example leads
3. **Create Campaign**: Click "Create Campaign" to start one
4. **Check Logs**: `docker-compose logs -f` to see what's happening
5. **Read Docs**: See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed guide

## 📞 Support

If you run into issues:
1. Check [DEVELOPMENT.md](DEVELOPMENT.md) for detailed troubleshooting
2. Check [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system
3. Check Docker logs: `docker-compose logs -f`
4. Check application logs in the terminal

## 🎯 Quick API Examples

### Create a lead
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "company": "Acme Inc"
  }'
```

### Get all leads
```bash
curl http://localhost:3000/api/leads
```

### Create a campaign
```bash
curl -X POST http://localhost:3000/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Q1 Outreach",
    "description": "First quarter campaign",
    "sends_per_day": 10
  }'
```

### Start a campaign
```bash
curl -X POST http://localhost:3000/api/campaigns/CAMPAIGN_ID/start
```

### Get analytics
```bash
curl http://localhost:3000/api/analytics/overview
```

## 💡 Tips

- Backend runs on port 3000
- Frontend runs on port 3001
- PostgreSQL runs on port 5432
- Redis runs on port 6379
- All services are in Docker, so no manual installation needed
- Database data persists even after stopping containers
- Use `docker-compose down -v` to completely reset

## 🎉 You're Ready!

Your Leadflow AI instance is now running. Start building! 🚀

For more details, see the [README.md](README.md)
