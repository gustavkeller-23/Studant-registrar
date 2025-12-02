# 🐳 Guia Docker - Student Registrar

Este guia explica como executar a aplicação Student Registrar completa usando Docker.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Docker](https://docs.docker.com/get-docker/) (versão 20.10 ou superior)
- [Docker Compose](https://docs.docker.com/compose/install/) (versão 2.0 ou superior)

Para verificar se estão instalados corretamente:

```bash
docker --version
docker-compose --version
```

## 🏗️ Arquitetura

A aplicação é composta por 3 serviços Docker:

1. **PostgreSQL Database** (`studant_db`) - Porta 5432
2. **Back-end API** (`studant_backend`) - Porta 3000
3. **Front-end Server** (`studant_frontend`) - Porta 80

## 🚀 Como Executar

### 1. Iniciar a Aplicação

No diretório raiz do projeto, execute:

```bash
docker-compose -f docker/docker-compose.yml up -d
```

> **Nota**: A flag `-d` executa os containers em modo "detached" (em segundo plano).

### 2. Acompanhar os Logs

Para ver os logs de todos os serviços:

```bash
docker-compose -f docker/docker-compose.yml logs -f
```

Para ver logs de um serviço específico:

```bash
docker-compose -f docker/docker-compose.yml logs -f backend
docker-compose -f docker/docker-compose.yml logs -f frontend
docker-compose -f docker/docker-compose.yml logs -f db
```

### 3. Acessar a Aplicação

Após alguns segundos, a aplicação estará disponível:

- **Front-end**: http://localhost
- **API Back-end**: http://localhost:3000
- **PostgreSQL**: localhost:5432

## 🛑 Como Parar

### Parar os Containers (mantém os dados)

```bash
docker-compose -f docker/docker-compose.yml stop
```

### Parar e Remover Containers

```bash
docker-compose -f docker/docker-compose.yml down
```

### Remover Tudo (incluindo volumes/dados)

```bash
docker-compose -f docker/docker-compose.yml down -v
```

> ⚠️ **ATENÇÃO**: O comando acima irá apagar todos os dados do banco de dados!

## 🔧 Comandos Úteis para Desenvolvimento

### Reconstruir as Imagens

Se fizer alterações no código, reconstrua as imagens:

```bash
docker-compose -f docker/docker-compose.yml build
```

Para forçar rebuild sem cache:

```bash
docker-compose -f docker/docker-compose.yml build --no-cache
```

### Reiniciar um Serviço Específico

```bash
docker-compose -f docker/docker-compose.yml restart backend
```

### Ver Status dos Containers

```bash
docker-compose -f docker/docker-compose.yml ps
```

### Executar Comandos dentro do Container

**Acessar o terminal do back-end:**

```bash
docker exec -it studant_backend sh
```

**Executar migrations do Prisma manualmente:**

```bash
docker exec -it studant_backend npx prisma migrate deploy
```

**Abrir Prisma Studio:**

```bash
docker exec -it studant_backend npx prisma studio
```

**Acessar o PostgreSQL:**

```bash
docker exec -it studant_db psql -U postgres -d studant_db
```

## 🔍 Troubleshooting

### Problema: "Port already in use"

Se alguma porta já estiver em uso, você pode:

1. **Parar o serviço que está usando a porta**
2. **Ou modificar as portas no `docker-compose.yml`**

Exemplo para mudar a porta do front-end de 80 para 8080:

```yaml
frontend:
  ports:
    - "8080:80"  # Porta local:Porta no container
```

### Problema: Banco de dados não conecta

Verifique os logs do serviço de banco de dados:

```bash
docker-compose -f docker/docker-compose.yml logs db
```

Certifique-se de que o health check está passando:

```bash
docker-compose -f docker/docker-compose.yml ps
```

### Problema: Migrations não executam automaticamente

Execute manualmente:

```bash
docker exec -it studant_backend npx prisma migrate deploy
```

### Problema: Front-end não carrega

1. Verifique se o back-end está rodando:
   ```bash
   curl http://localhost:3000/students
   ```

2. Verifique os logs do Nginx:
   ```bash
   docker-compose -f docker/docker-compose.yml logs frontend
   ```

### Limpar Tudo e Começar do Zero

```bash
# Parar e remover tudo
docker-compose -f docker/docker-compose.yml down -v

# Remover imagens antigas
docker rmi studant_backend studant_frontend

# Reconstruir e iniciar
docker-compose -f docker/docker-compose.yml up -d --build
```

## 📝 Variáveis de Ambiente

As variáveis de ambiente são configuradas no `docker-compose.yml`:

### Back-end

- `DATABASE_URL`: String de conexão com PostgreSQL
- `PORT`: Porta do servidor (padrão: 3000)
- `NODE_ENV`: Ambiente de execução (production/development)

### Database

- `POSTGRES_USER`: Usuário do banco (padrão: postgres)
- `POSTGRES_PASSWORD`: Senha do banco (padrão: postgres)
- `POSTGRES_DB`: Nome do banco (padrão: studant_db)

> **Segurança**: Para produção, altere as senhas padrão!

## 🔐 Segurança em Produção

Para ambiente de produção:

1. **Altere as credenciais do banco de dados**
2. **Use secrets do Docker** ao invés de variáveis em texto
3. **Configure HTTPS** no Nginx
4. **Use variáveis de ambiente** via arquivo `.env`

Exemplo de arquivo `.env`:

```env
POSTGRES_PASSWORD=senha_segura_aqui
DATABASE_URL=postgresql://postgres:senha_segura_aqui@db:5432/studant_db
```

E no `docker-compose.yml`:

```yaml
environment:
  - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
```

## 📚 Recursos Adicionais

- [Documentação Docker](https://docs.docker.com/)
- [Documentação Docker Compose](https://docs.docker.com/compose/)
- [Melhores Práticas Dockerfile](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
