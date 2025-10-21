# Specora
AI Assited Requirements Engineering

# Database
Prisma Integration

## 1. Install Dependencies
```bash
npm install prisma @prisma/client
npx prisma init
```

---

## 2. Configure `.env`
```env
# Database Connection
DATABASE_URL="postgresql://<db_username>:<db_password>@<db_host>:<db_port>/<db_name>"
```

---

## 3. Define Prisma Schema

**File:** `prisma/generated/client/schema.prisma`
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  output   = "./generated/client"
}
```

---

## 4. Pull Existing Database Schema

If your database already exists (e.g., created via pgAdmin):
```bash
npx prisma db pull
```

---

## 5. Generate Prisma Client
```bash
npx prisma generate
```

This creates a ready-to-use Prisma client.

---

## Additional
- Always run `npx prisma generate` after modifying your schema
- Use `npx prisma studio` to visually browse and edit your database