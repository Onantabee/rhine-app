FROM node:20-alpine
WORKDIR /app

# Ensure the dev server binds to 0.0.0.0 and use reproducible installs when lockfile present
ENV NODE_ENV=development
ENV HOST=0.0.0.0

# Copy package manifests first to leverage Docker layer caching
COPY package.json package-lock.json* ./
# Prefer npm ci when a lockfile exists for reproducible installs.
# Use --legacy-peer-deps to avoid peer dependency resolution failures in CI/build envs.
RUN if [ -f package-lock.json ]; then npm ci --silent --legacy-peer-deps; else npm install --silent --legacy-peer-deps; fi

# Copy source and expose dev port
COPY . .
EXPOSE 5173

# Start Vite dev server, explicitly binding to host and port
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
