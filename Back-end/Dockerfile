# Estágio 1: Base para dependências
FROM node:20-alpine AS base

# Instalar OpenSSL (necessário para o Prisma)
RUN apk add --no-cache openssl

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Estágio 2: Dependências
FROM base AS dependencies

# Instalar todas as dependências
RUN npm ci

# Estágio 3: Produção
FROM base AS production

# Copiar node_modules do estágio de dependências
COPY --from=dependencies /app/node_modules ./node_modules

# Copiar código da aplicação
COPY . .

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Expor porta da aplicação
EXPOSE 3000

# Script de inicialização que gera Prisma Client, executa migrations e inicia o servidor
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npm start"]
