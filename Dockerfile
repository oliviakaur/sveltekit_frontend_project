FROM node:22.17.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV DEPLOY_TARGET=node
RUN npm run build

FROM node:22.17.0-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
ENV PROTOCOL_HEADER=x-forwarded-proto
ENV HOST_HEADER=x-forwarded-host
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/build ./build
EXPOSE 3000
CMD ["node", "build/index.js"]