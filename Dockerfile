# ---- Build Stage ----
  FROM node:22-alpine AS builder

  WORKDIR /app
  
  # Installer pnpm
  RUN npm install -g pnpm
  
  # Copier les fichiers de dépendances
  COPY package.json pnpm-lock.yaml ./
  
  # Installer les dépendances
  RUN pnpm install --frozen-lockfile
  
  # Copier tout le code source
  COPY . .
  
  # Générer Prisma client
  RUN pnpm prisma generate --schema ./prisma/schema.prisma
  
  # Build NestJS
  RUN pnpm build

# ---- Test Stage ----
  FROM node:22-alpine AS test

  WORKDIR /app
  
  # Installer pnpm
  RUN npm install -g pnpm
  
  # Copier tout depuis builder (code source + node_modules + config)
  COPY --from=builder /app ./
  
  # Lancer les tests avec Jest
  CMD ["pnpm", "test"]
  
# ---- Production Stage ----
  FROM node:22-alpine AS prod
  
  WORKDIR /app

  # Lancer les tests
  CMD ["pnpm", "test"]
  
  # Copier uniquement ce qui est nécessaire
  COPY --from=builder /app/dist ./dist
  COPY --from=builder /app/package.json ./package.json
  COPY --from=builder /app/prisma ./prisma
  COPY --from=builder /app/generated ./generated
  COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
  COPY --from=builder /app/node_modules ./node_modules

  # Installer pnpm
  RUN npm install -g pnpm
  
  EXPOSE 3000

  # Script de démarrage qui exécute les migrations puis démarre l'app
  CMD ["sh", "-c", "\
    echo '=== DEBUG INFO ===' && \
    echo 'DATABASE_URL is set:' && \
    echo $DATABASE_URL && \
    echo 'Running prisma migrate deploy...' && \
    pnpm prisma migrate deploy && \
    echo 'Starting application...' && \
    node dist/src/main.js \
  "]