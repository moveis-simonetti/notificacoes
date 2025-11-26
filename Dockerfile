FROM node:lts-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:lts-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

ENV NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=false \
    NEW_RELIC_APP_NAME="" \
    NEW_RELIC_LICENSE_KEY="" \
    NEW_RELIC_LOG=stdout

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy built code + runtime files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/bin ./bin
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/cli ./cli
COPY --from=builder /app/.babelrc ./.babelrc
COPY --from=builder /app/newrelic.js ./newrelic.js

# Install your helper scripts into PATH
RUN mkdir -p /usr/local/bin \
  && cp cli/docker-npm-* /usr/local/bin/ \
  && chmod a+x /usr/local/bin/docker-npm-*

EXPOSE 3000

CMD ["docker-npm-start-server"]
