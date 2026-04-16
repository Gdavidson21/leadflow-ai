FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript/React
RUN npm run build

# Expose port
EXPOSE 3001

# Start development server
CMD ["npm", "run", "preview"]
