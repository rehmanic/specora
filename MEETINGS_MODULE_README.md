# 🚀 Specora - Meetings Module Documentation

## Overview

The **Meetings Module** is a comprehensive meeting management system for Specora, designed to facilitate requirements engineering collaboration between managers, engineers, and stakeholders.

## ✨ Features

- ✅ **Schedule Meetings** - Create and schedule meetings with multiple stakeholders
- ✅ **Email Invitations** - Automatically send professional email invites to all stakeholders
- ✅ **Upcoming & Completed Views** - Organized views for past and future meetings
- ✅ **Meeting Details** - Track name, description, stakeholders, links, and recordings
- ✅ **Responsive UI** - Beautiful, modern interface built with Next.js and Tailwind CSS
- ✅ **Role-Based Access** - Different permissions for managers, engineers, and customers
- 🔜 **AI Integration Ready** - Prepared for transcript summarization and requirement extraction

---

## 📁 Project Structure

### Frontend (`/frontend`)

```
src/
├── app/
│   └── (sidebar)/
│       └── meetings/
│           └── page.jsx              # Main meetings page
├── components/
│   └── meetings/
│       ├── MeetingList.jsx          # List of meetings
│       ├── MeetingCard.jsx          # Individual meeting card
│       └── ScheduleMeetingModal.jsx # Schedule meeting form
```

### Backend (`/backend`)

```
backend/
├── config/
│   └── database.js                   # PostgreSQL configuration
├── database/
│   ├── models/
│   │   └── meeting.js               # Meeting model (Sequelize)
│   └── seeders/
│       └── meetings.js              # Seed data
├── modules/
│   └── meetings/
│       ├── controller.js            # Request handlers
│       ├── service.js               # Business logic + email service
│       ├── repository.js            # Database operations
│       └── routes.js                # API routes
├── app.js                           # Express app configuration
└── server.js                        # Server entry point
```

---

## 🛠️ Setup Instructions

### Prerequisites

- **Node.js** >= 18.x
- **PostgreSQL** >= 14.x
- **npm** or **yarn**

### 1. Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env and configure:
# - Database credentials (PostgreSQL)
# - SMTP settings (Gmail recommended)
# - JWT secret
```

#### Configure `.env` File

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=specora_db
DB_USER=postgres
DB_PASSWORD=your_password

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password  # Use App Password, not regular password
```

#### Create Database

```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE specora_db;

# Exit
\q
```

#### Run Database Migrations & Seed Data

```powershell
# Start the server (this will auto-create tables)
npm run dev

# In another terminal, run seeder
node database/seeders/meetings.js
```

### 2. Frontend Setup

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Access the Application

- **Frontend**: http://localhost:3000/meetings
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

---

## 🔌 API Endpoints

### Base URL: `http://localhost:5000/api/meetings`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/upcoming` | Get all upcoming meetings | Yes |
| GET | `/completed` | Get all completed meetings | Yes |
| GET | `/:id` | Get meeting by ID | Yes |
| GET | `/search?q=query` | Search meetings | Yes |
| POST | `/schedule` | Schedule a new meeting | Yes (Manager/Engineer) |
| POST | `/send-email` | Send meeting invitations | Yes (Manager/Engineer) |
| PUT | `/:id` | Update meeting | Yes (Manager/Engineer) |
| PATCH | `/:id/complete` | Mark as completed | Yes (Manager/Engineer) |
| DELETE | `/:id` | Delete meeting | Yes (Manager) |

### Example Requests

#### Schedule Meeting

```bash
POST /api/meetings/schedule
Content-Type: application/json

{
  "name": "Sprint Planning Q2",
  "description": "Plan sprints for Q2 2025",
  "stakeholders": ["alice@company.com", "bob@company.com"],
  "meeting_link": "https://meet.google.com/abc-defg",
  "scheduled_at": "2025-10-15T10:00:00Z"
}
```

#### Response

```json
{
  "message": "Meeting scheduled successfully",
  "meeting": {
    "id": 1,
    "name": "Sprint Planning Q2",
    "description": "Plan sprints for Q2 2025",
    "stakeholders": ["alice@company.com", "bob@company.com"],
    "scheduled_by": "John Doe",
    "meeting_link": "https://meet.google.com/abc-defg",
    "scheduled_at": "2025-10-15T10:00:00.000Z",
    "is_completed": false,
    "created_at": "2025-10-06T10:00:00.000Z",
    "updated_at": "2025-10-06T10:00:00.000Z"
  }
}
```

---

## 📧 Email Configuration (Gmail)

### Enable App Passwords

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Go to **App Passwords**
4. Generate a new app password for "Mail"
5. Copy the 16-character password
6. Use this in `.env` as `SMTP_PASS`

---

## 🎨 UI Components

### MeetingCard Features

- Meeting name and description
- Scheduled date and time
- Stakeholder avatars (up to 5 visible)
- Join meeting button (for upcoming)
- View recording button (for completed)
- Hover animations and transitions

### ScheduleMeetingModal Features

- Form validation
- Date/time pickers
- Email list input (comma-separated)
- Meeting link validation
- Loading states

---

## 🔐 Role-Based Access Control (Future Implementation)

### Roles

| Role | Permissions |
|------|-------------|
| **Manager** | Full CRUD access, analytics, export data |
| **Requirements Engineer** | Schedule, view, update meetings |
| **Customer** | View-only access to meetings |

### Implementation (Placeholder)

```javascript
// In routes.js - uncomment when auth is ready
import { authenticate, authorize } from "../../core/middlewares/auth.js";

router.post("/schedule", 
  authenticate, 
  authorize(["manager", "engineer"]), 
  scheduleMeetingValidation,
  meetingsController.scheduleMeeting
);
```

---

## 🧪 Testing

### Run Backend Tests

```powershell
cd backend
npm test
```

### Test Checklist

- [ ] Schedule meeting successfully
- [ ] Fetch upcoming meetings
- [ ] Fetch completed meetings
- [ ] Send email invitations
- [ ] Mark meeting as completed
- [ ] Update meeting details
- [ ] Delete meeting
- [ ] Search meetings
- [ ] Validate input data

---

## 🚀 Deployment

### Docker Support (Coming Soon)

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
  
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: specora_db
      POSTGRES_PASSWORD: postgres
```

---

## 🔮 Future Enhancements

### AI/NLP Integration

- **Transcript Summarization**: Automatically summarize meeting recordings
- **Requirement Extraction**: Extract requirements from transcripts using NLP
- **Action Items Detection**: Identify and track action items

### Database Schema (Ready for AI)

```sql
-- Already included in Meeting model
transcript_summary: TEXT
requirement_extraction: JSONB
```

### Example Usage

```javascript
await meetingsService.updateMeeting(meetingId, {
  transcript_summary: "Discussed 5 key features...",
  requirement_extraction: {
    requirements: [
      { id: 1, text: "User authentication", priority: "high" },
      { id: 2, text: "Payment integration", priority: "medium" }
    ]
  }
});
```

---

## 📚 Tech Stack

### Frontend
- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn/UI (Radix UI)
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Email**: Nodemailer
- **Validation**: Express Validator
- **Security**: Helmet, CORS

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/meetings-enhancement`
2. Make changes and commit: `git commit -m "Add new feature"`
3. Push to branch: `git push origin feature/meetings-enhancement`
4. Create Pull Request

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👥 Team

**Specora Development Team**
- Project Lead: John Doe
- Backend Engineer: Jane Smith
- Frontend Engineer: Alice Johnson

---

## 📞 Support

For issues or questions:
- Create an issue on GitHub
- Email: support@specora.com
- Slack: #specora-meetings

---

**Built with ❤️ by the Specora Team**
