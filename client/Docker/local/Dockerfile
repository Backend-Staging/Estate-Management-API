FROM docker.io/node:20.11-alpine3.18 as base

FROM base as node-build-stage

RUN apk add --no-cache libc6-compat

# Configure npm with increased timeout and retry settings
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-timeout 300000

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Retry logic for package installation
RUN \
  if [ -f yarn.lock ]; then \
    yarn --frozen-lockfile || (sleep 5 && yarn --frozen-lockfile) || (sleep 10 && yarn --frozen-lockfile); \
  elif [ -f package-lock.json ]; then \
    npm ci || (sleep 5 && npm ci) || (sleep 10 && npm ci); \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && (pnpm i || (sleep 5 && pnpm i) || (sleep 10 && pnpm i)); \
  else \
    echo "Lockfile not found." && exit 1; \
  fi

FROM base as node-run-stage

RUN apk add --no-cache su-exec

ARG APP_HOME=/app
WORKDIR ${APP_HOME}

COPY --from=node-build-stage /node_modules ./node_modules

COPY . ${APP_HOME}

RUN addgroup -g 1001 -S nodejs && \
  adduser -S nextjs -u 1001 -G nodejs

RUN chown -R nextjs:nodejs ${APP_HOME}

COPY Docker/local/entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//g' /entrypoint.sh && chmod +x /entrypoint.sh

# Entrypoint runs as root, fixes /app/.next on the named volume, then su-exec to nextjs
ENTRYPOINT ["/entrypoint.sh"]
CMD [ "npm", "run", "dev" ]

