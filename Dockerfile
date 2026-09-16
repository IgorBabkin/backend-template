# Stage 1: Build
FROM node:26-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the app
COPY . .

# Generate Prisma client and build the app
RUN npm run build

# Stage 2: Production
FROM node:26-alpine

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

# Copy only necessary files from builder stage
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "db:migrate"]
CMD ["npm", "start"]
