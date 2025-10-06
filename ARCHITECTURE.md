# 🏗️ Specora Architecture - Meetings Module

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Next.js Frontend (Port 3000)                 │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  /app/(sidebar)/meetings/page.jsx                   │  │  │
│  │  │  - Main meetings page component                     │  │  │
│  │  │  - State management (upcoming/completed)            │  │  │
│  │  │  - API fetch logic                                  │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  ┌─────────────────┐  ┌─────────────────┐              │  │
│  │  │  MeetingList    │  │  MeetingCard    │              │  │
│  │  │  Component      │  │  Component      │              │  │
│  │  └─────────────────┘  └─────────────────┘              │  │
│  │            │                    │                        │  │
│  │            └────────┬───────────┘                        │  │
│  │                     │                                    │  │
│  │         ┌───────────▼──────────────┐                    │  │
│  │         │ ScheduleMeetingModal     │                    │  │
│  │         │ - Form handling          │                    │  │
│  │         │ - Validation             │                    │  │
│  │         └──────────────────────────┘                    │  │
│  └────────────────────┬───────────────────────────────────┘  │
│                       │ HTTP Requests                         │
└───────────────────────┼───────────────────────────────────────┘
                        │
                        │ REST API
                        │
┌───────────────────────▼───────────────────────────────────────┐
│                      SERVER LAYER                              │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐│
│  │         Express.js Backend (Port 5000)                    ││
│  │                                                            ││
│  │  ┌────────────────────────────────────────────────────┐  ││
│  │  │  app.js - Express Application                       │  ││
│  │  │  - Middleware (CORS, Helmet, Compression)           │  ││
│  │  │  - Route mounting                                   │  ││
│  │  │  - Error handling                                   │  ││
│  │  └────────────────────────────────────────────────────┘  ││
│  │                                                            ││
│  │  ┌────────────────────────────────────────────────────┐  ││
│  │  │  modules/meetings/routes.js                         │  ││
│  │  │  - Route definitions                                │  ││
│  │  │  - Input validation (express-validator)             │  ││
│  │  │  - Auth middleware (placeholder)                    │  ││
│  │  └──────────────────┬─────────────────────────────────┘  ││
│  │                     │                                     ││
│  │  ┌──────────────────▼─────────────────────────────────┐  ││
│  │  │  modules/meetings/controller.js                     │  ││
│  │  │  - Request handlers                                 │  ││
│  │  │  - HTTP response formatting                         │  ││
│  │  │  - Error handling                                   │  ││
│  │  └──────────────────┬─────────────────────────────────┘  ││
│  │                     │                                     ││
│  │  ┌──────────────────▼─────────────────────────────────┐  ││
│  │  │  modules/meetings/service.js                        │  ││
│  │  │  - Business logic                                   │  ││
│  │  │  - Email service (Nodemailer)                       │  ││
│  │  │  - Data transformation                              │  ││
│  │  └──────────────────┬─────────────────────────────────┘  ││
│  │                     │                                     ││
│  │  ┌──────────────────▼─────────────────────────────────┐  ││
│  │  │  modules/meetings/repository.js                     │  ││
│  │  │  - Database operations (CRUD)                       │  ││
│  │  │  - Query building                                   │  ││
│  │  │  - Sequelize ORM calls                              │  ││
│  │  └──────────────────┬─────────────────────────────────┘  ││
│  └────────────────────┼─────────────────────────────────────┘│
└────────────────────────┼──────────────────────────────────────┘
                         │
                         │ Sequelize ORM
                         │
┌────────────────────────▼──────────────────────────────────────┐
│                     DATA LAYER                                 │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │        PostgreSQL Database (Port 5432)                    │ │
│  │                                                            │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │  meetings table                                     │  │ │
│  │  │  - id (PRIMARY KEY)                                 │  │ │
│  │  │  - name                                             │  │ │
│  │  │  - description                                      │  │ │
│  │  │  - stakeholders (ARRAY)                             │  │ │
│  │  │  - scheduled_by                                     │  │ │
│  │  │  - meeting_link                                     │  │ │
│  │  │  - recording_link                                   │  │ │
│  │  │  - scheduled_at                                     │  │ │
│  │  │  - is_completed                                     │  │ │
│  │  │  - transcript_summary (AI ready)                    │  │ │
│  │  │  - requirement_extraction (JSONB - AI ready)        │  │ │
│  │  │  - created_at                                       │  │ │
│  │  │  - updated_at                                       │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  │                                                            │ │
│  │  Indexes:                                                  │ │
│  │  - idx_meetings_is_completed                               │ │
│  │  - idx_meetings_scheduled_at                               │ │
│  │  - idx_meetings_scheduled_by                               │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                            │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Email Service (SMTP)                                     │ │
│  │  - Gmail SMTP                                             │ │
│  │  - Nodemailer transport                                   │ │
│  │  - HTML email templates                                   │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

---

## Request Flow Diagram

### Example: Schedule a Meeting

```
┌──────────┐
│  User    │
└────┬─────┘
     │
     │ 1. Clicks "Schedule Meeting"
     ▼
┌────────────────────────┐
│ ScheduleMeetingModal   │
│ - Opens modal form     │
└────┬───────────────────┘
     │
     │ 2. Fills form & submits
     ▼
┌────────────────────────┐
│  MeetingsPage          │
│  handleScheduleMeeting │
└────┬───────────────────┘
     │
     │ 3. POST /api/meetings/schedule
     ▼
┌────────────────────────┐
│  Express Router        │
│  - Validate input      │
└────┬───────────────────┘
     │
     │ 4. Pass to controller
     ▼
┌────────────────────────┐
│  MeetingsController    │
│  scheduleMeeting()     │
└────┬───────────────────┘
     │
     │ 5. Call service
     ▼
┌────────────────────────┐
│  MeetingsService       │
│  - Add scheduled_by    │
└────┬───────────────────┘
     │
     │ 6. Save to database
     ▼
┌────────────────────────┐
│  MeetingsRepository    │
│  createMeeting()       │
└────┬───────────────────┘
     │
     │ 7. Sequelize insert
     ▼
┌────────────────────────┐
│  PostgreSQL            │
│  INSERT INTO meetings  │
└────┬───────────────────┘
     │
     │ 8. Return created meeting
     ▼
┌────────────────────────┐
│  MeetingsController    │
│  - Format response     │
└────┬───────────────────┘
     │
     │ 9. POST /api/meetings/send-email
     ▼
┌────────────────────────┐
│  MeetingsService       │
│  sendMeetingInvites()  │
└────┬───────────────────┘
     │
     │ 10. Send emails via SMTP
     ▼
┌────────────────────────┐
│  Nodemailer            │
│  - Gmail SMTP          │
└────┬───────────────────┘
     │
     │ 11. Email sent
     ▼
┌────────────────────────┐
│  Stakeholders' Inbox   │
│  📧 Meeting Invitation │
└────┬───────────────────┘
     │
     │ 12. Response to frontend
     ▼
┌────────────────────────┐
│  MeetingsPage          │
│  - Update state        │
│  - Close modal         │
│  - Show in list        │
└────────────────────────┘
```

---

## Data Flow

```
┌─────────────┐
│  Frontend   │
│  Component  │
└──────┬──────┘
       │
       │ fetch('/api/meetings/upcoming')
       ▼
┌──────────────┐
│   Routes     │  GET /api/meetings/upcoming
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Controller  │  getUpcomingMeetings()
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Service    │  getUpcomingMeetings()
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Repository  │  Meeting.findAll({ where: { is_completed: false } })
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Sequelize   │  SELECT * FROM meetings WHERE is_completed = false
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ PostgreSQL   │  Execute query
└──────┬───────┘
       │
       │ Return rows
       ▼
┌──────────────┐
│  Repository  │  Return meeting objects
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Service    │  Return data
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Controller  │  res.json(meetings)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Frontend    │  Display in MeetingList
└──────────────┘
```

---

## Technology Stack Layers

```
┌────────────────────────────────────────────┐
│            PRESENTATION LAYER              │
│  Next.js 15 • React 19 • Tailwind CSS     │
│  Shadcn/UI • Lucide Icons                  │
└────────────────┬───────────────────────────┘
                 │
┌────────────────▼───────────────────────────┐
│          APPLICATION LAYER                 │
│  Express.js • Node.js 18+                  │
│  Middleware: Helmet, CORS, Morgan          │
└────────────────┬───────────────────────────┘
                 │
┌────────────────▼───────────────────────────┐
│           BUSINESS LOGIC LAYER             │
│  Service Layer • Repository Pattern        │
│  Email Service (Nodemailer)                │
└────────────────┬───────────────────────────┘
                 │
┌────────────────▼───────────────────────────┐
│           DATA ACCESS LAYER                │
│  Sequelize ORM • PostgreSQL Driver         │
└────────────────┬───────────────────────────┘
                 │
┌────────────────▼───────────────────────────┐
│            DATABASE LAYER                  │
│  PostgreSQL 14 • JSONB • Arrays            │
└────────────────────────────────────────────┘
```

---

## Module Interaction (Future)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│     Auth     │────▶│   Meetings   │◀────│   SpecBot    │
│   Module     │     │    Module    │     │    Module    │
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
                            │
                     ┌──────▼───────┐
                     │  Transcripts │
                     │  & AI Data   │
                     └──────────────┘
```

### Integration Points:
- **Auth Module** → Provides user context (scheduled_by)
- **Meetings Module** → Stores transcripts
- **SpecBot Module** → Analyzes transcripts, extracts requirements

---

## Deployment Architecture (Docker)

```
┌───────────────────────────────────────────────────────┐
│                    Docker Host                        │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │  Docker Compose Network: specora-network        │ │
│  │                                                  │ │
│  │  ┌──────────────┐  ┌──────────────┐           │ │
│  │  │  Frontend    │  │   Backend    │           │ │
│  │  │  Container   │  │   Container  │           │ │
│  │  │  Port: 3000  │  │   Port: 5000 │           │ │
│  │  └──────┬───────┘  └──────┬───────┘           │ │
│  │         │                  │                    │ │
│  │         └──────────┬───────┘                    │ │
│  │                    │                            │ │
│  │         ┌──────────▼───────┐                   │ │
│  │         │   PostgreSQL     │                   │ │
│  │         │   Container      │                   │ │
│  │         │   Port: 5432     │                   │ │
│  │         └──────────────────┘                   │ │
│  │                                                  │ │
│  │  Volume: postgres_data (persistent storage)     │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  External Access:                                     │
│  - localhost:3000 → Frontend                          │
│  - localhost:5000 → Backend API                       │
│  - localhost:5432 → PostgreSQL (dev only)             │
└───────────────────────────────────────────────────────┘
```

---

## Security Layers

```
┌────────────────────────────────────────┐
│  Request from Client                   │
└─────────────┬──────────────────────────┘
              │
              ▼
┌────────────────────────────────────────┐
│  1. Helmet - Security Headers          │
│     - XSS Protection                   │
│     - Content Security Policy          │
│     - HSTS                             │
└─────────────┬──────────────────────────┘
              │
              ▼
┌────────────────────────────────────────┐
│  2. CORS - Origin Validation           │
│     - Allow: localhost:3000            │
└─────────────┬──────────────────────────┘
              │
              ▼
┌────────────────────────────────────────┐
│  3. Express Validator                  │
│     - Input sanitization               │
│     - Type checking                    │
│     - Format validation                │
└─────────────┬──────────────────────────┘
              │
              ▼
┌────────────────────────────────────────┐
│  4. Auth Middleware (Future)           │
│     - JWT verification                 │
│     - Role-based access                │
└─────────────┬──────────────────────────┘
              │
              ▼
┌────────────────────────────────────────┐
│  5. Controller Logic                   │
│     - Business rules                   │
│     - Authorization checks             │
└─────────────┬──────────────────────────┘
              │
              ▼
┌────────────────────────────────────────┐
│  6. Database (Sequelize)               │
│     - Parameterized queries            │
│     - SQL injection prevention         │
└────────────────────────────────────────┘
```

---

## File Organization

```
Specora/
│
├── frontend/
│   └── src/
│       ├── app/
│       │   └── (sidebar)/
│       │       └── meetings/
│       │           └── page.jsx ────────── Main UI
│       │
│       └── components/
│           └── meetings/
│               ├── MeetingList.jsx ──────── List view
│               ├── MeetingCard.jsx ──────── Card component
│               └── ScheduleMeetingModal.jsx── Form modal
│
└── backend/
    ├── database/
    │   ├── models/
    │   │   └── meeting.js ───────────────── Sequelize model
    │   ├── migrations/
    │   │   └── 001_create_meetings_table.sql
    │   └── seeders/
    │       └── meetings.js ──────────────── Sample data
    │
    ├── modules/
    │   └── meetings/
    │       ├── routes.js ────────────────── API routes
    │       ├── controller.js ────────────── Request handlers
    │       ├── service.js ───────────────── Business logic
    │       └── repository.js ────────────── Database queries
    │
    ├── config/
    │   └── database.js ──────────────────── DB config
    │
    ├── app.js ───────────────────────────── Express app
    └── server.js ────────────────────────── Server startup
```

---

This architecture ensures:
- ✅ **Separation of concerns** - Clear layer boundaries
- ✅ **Scalability** - Easy to add new features
- ✅ **Testability** - Each layer can be tested independently
- ✅ **Maintainability** - Organized code structure
- ✅ **Security** - Multiple security layers
- ✅ **Future-proof** - Ready for AI integration
