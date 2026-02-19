# Specora Backend

The backend service for **Specora**, providing API endpoints, real-time communication, and AI-driven features.

## 🚀 Features

- **Authentication**: Secure user registration and login with JWT and bcrypt.
- **Real-time Communication**: Live chat and live meeting signaling via Socket.io and LiveKit.
- **AI Integration**: Powered by Google Gemini and OpenAI for intelligent features.
- **Project Management**: Modules for managing projects, meetings, and feedback.
- **File Handling**: Upload capabilities via Multer.
- **Security**: Robust protection using Helmet and Express Validator.

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database ORM**: Prisma (PostgreSQL)
- **Real-time**: Socket.io & LiveKit
- **AI**: Google Generative AI & OpenAI
- **Testing**: Vitest
- **Security**: JWT, bcryptjs, Helmet

## 📁 Project Structure

```text
be/
├── config/             # Database (Prisma) and server configurations
├── src/
│   ├── modules/        # Core business logic (Auth, Chat, Meetings, etc.)
│   ├── middlewares/    # Custom Express middlewares (Auth, Validation)
│   └── utils/          # Utility functions and helpers
├── tests/              # Test suites
├── server.js           # Entry point
└── app.js              # Express app configuration
```

## 🚥 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (ESM support required)
- [PostgreSQL](https://www.postgresql.org/)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository and navigate to the `be` directory.
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Configuration

Copy the example environment file and fill in your credentials:
```bash
cp .env.example .env
```
Key variables to configure: `DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`, and `LIVEKIT_*`.

### Database Setup

Specora uses Prisma ORM. Initialize your database schema:

```bash
# Pull current schema from DB
npx prisma db pull

# Generate Prisma Client
npx prisma generate
```

> [!NOTE]
> Database commands must be run from the directory containing `schema.prisma` if not in the default location, but the `package.json` setup handles generating client.

## 📜 Available Scripts

- `npm run dev`: Start the development server with Nodemon.
- `npm run test`: Run all tests using Vitest.
- `npm run test:watch`: Run tests in watch mode.
- `npm run test:coverage`: Generate test coverage reports.

## 🛡️ Security

- All endpoints are protected by JWT authentication where applicable.
- Input validation is handled via `express-validator`.
- Security headers are set using `helmet`.

## 📄 License

MIT
