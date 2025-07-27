# Stage 1: Build
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.* ./
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build

# Stage 2: Serve
FROM node:18 AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm install --production --legacy-peer-deps
EXPOSE 4173
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "4173"] 