FROM node:23-alpine3.20 AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM node:23-alpine3.20 AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./dist/.env
COPY --from=builder /app/package* ./
# To run migrations from inside runner container; preferably set up a seperate container for migrations
COPY --from=builder /app/src/drizzle ./dist/drizzle
RUN npm ci --omit=dev
EXPOSE 3000
CMD npm run start
