# Use Node.js base image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY ./src/server/package*.json ./
RUN npm install --legacy-peer-deps

# Copy the backend and ws-worker code
COPY ./src/server .

# Backend Service
FROM base AS backend
# Expose any necessary ports for the backend (e.g., 4000)
EXPOSE 4000
# Run the backend
CMD ["node", "backend.js"]

# WebSocket Worker Service
FROM base AS ws-worker
# Expose any necessary ports for the WebSocket worker (optional)
EXPOSE 4001
# Run the WebSocket worker
CMD ["node", "ws-worker.js"]