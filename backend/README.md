# Prisma ORM Setup
Prisma Integration

## 1. Install

```bash
npm install prisma @prisma/client
```

## 2. Initialize
```bash
npx prisma init
```

## 3. Configure `.env`
```env
DATABASE_URL="postgresql://<db_username>:<db_password>@<db_host>:<db_port>/<db_name>"
```

## 4. Define Prisma Schema

**File:** `./config/db/schema.prisma`
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  output   = "../../prisma/generated/client"
}
```

Note: Following commands must be run from the folder containing schema.prisma

## 5. Pull Existing Database Schema
```bash
npx prisma db pull
```

## 6. Generate Prisma Client
```bash
npx prisma generate
```

## On Schema Update

Delete "generated" folder inside prisma first!
```bash
npx prisma db pull
```

```bash
npx prisma generate
```
