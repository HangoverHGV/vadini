# Use Node.js
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install deps separately (for caching)
COPY package*.json ./
RUN npm install

# Copy source (will be overridden by volume in dev)
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Force polling for HMR (useful inside Docker)
ENV CHOKIDAR_USEPOLLING=true

# Run Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]