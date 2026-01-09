# Prompt: Dockerize Next.js App for Coolify Deployment

Use this prompt to set up any Next.js project for Docker-based deployment on Coolify.

---

## Prompt

```
Set up this Next.js project for Docker-based deployment on Coolify. Create the following files:

### 1. Update next.config.js
Add `output: "standalone"` to the Next.js config for optimized Docker builds.

### 2. Create Dockerfile
Create a multi-stage Dockerfile with:
- Node 22 Alpine base image
- Separate stages: base, deps, builder, runner
- Install dependencies with `npm ci`
- Build with `npm run build`
- Copy standalone output to final image
- Run as non-root user (nextjs:nodejs) for security
- Expose port 3000
- Use `node server.js` as the command

### 3. Create docker-compose.yml
Create a simple docker-compose.yml with:
- Single app service
- Build args for environment variables needed at build time
- Runtime environment variables
- Port 3000 exposed
- Healthcheck endpoint (adjust path as needed)
- No database container (use external DATABASE_URL)

### 4. Create .dockerignore
Exclude from build context:
- node_modules
- .next
- .git
- Test files and directories
- Environment files (.env*)
- IDE files
- Docker files themselves
- Documentation (*.md except README.md)

### 5. Create .env.docker.example
Template file listing all required and optional environment variables.

### 6. Fix any build issues
- Ensure all imports work without test/dev-only files
- Use DefinePlugin instead of EnvironmentPlugin for optional env vars
- Provide default values for optional environment variables

After creating the files, test with:
docker compose up --build
```

---

## Expected File Contents

### Dockerfile

```dockerfile
# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Add any required build-time ARGs here
ARG DATABASE_URL
ARG NEXT_PUBLIC_API_URL
# Set them as ENV for the build
ENV DATABASE_URL=${DATABASE_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - DATABASE_URL=${DATABASE_URL}
        - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-}
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### .dockerignore

```
node_modules
.next
.git
.gitignore
*.md
!README.md
.env*
.vscode
.idea
Dockerfile*
docker-compose*
.dockerignore
coverage
__tests__
*.test.*
*.spec.*
.husky
.eslintrc*
.prettierrc*
```

### next.config.js addition

```js
module.exports = {
  output: "standalone",
  // ... rest of config
}
```

---

## Coolify Deployment

1. Push code to Git repository
2. In Coolify, create new resource → select your repo
3. Choose "Docker Compose" as build pack
4. Add environment variables in Coolify UI
5. Deploy

---

## Local Testing

```bash
# With env file
cp .env.docker.example .env.docker
# Edit .env.docker with your values
docker compose --env-file .env.docker up --build

# Or inline
DATABASE_URL=postgres://... docker compose up --build
```
