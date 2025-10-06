# 🎯 Specora - AI-Driven Software Requirements Engineering System

<div align="center">

![Specora Logo](./frontend/public/fav.svg)

**Automate Requirements Engineering with AI/NLP**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)](https://www.postgresql.org/)

[Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Tech Stack](#tech-stack) • [Contributing](#contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Modules](#modules)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Specora** is an intelligent platform designed to revolutionize software requirements engineering through AI-powered automation. It helps teams:

- 📝 **Elicit Requirements** - Gather requirements from stakeholders efficiently
- 🤖 **Automate Analysis** - Use AI/NLP to analyze and extract requirements
- 👥 **Collaborate** - Facilitate team communication and stakeholder meetings
- 📊 **Track Progress** - Monitor requirements engineering lifecycle
- ✅ **Ensure Quality** - Validate and verify requirements automatically

---

## ✨ Features

### ✅ **Meetings Module** (Implemented)
- Schedule and manage stakeholder meetings
- Automated email invitations with professional templates
- Meeting recordings and transcript storage
- Upcoming and completed meetings views
- Integration-ready for AI transcript summarization

### 🤖 **SpecBot** (Upcoming)
- AI-powered requirements assistant
- Natural language requirement extraction
- Intelligent requirement recommendations
- Context-aware suggestions

### 💬 **Team Chat** (In Progress)
- Real-time collaboration
- File sharing
- Requirement discussions

### 📊 **Dashboard** (Planned)
- Project analytics
- Requirement metrics
- Team performance tracking

### 👥 **User Management** (Planned)
- Role-based access control (Manager, Engineer, Customer)
- User profiles
- Permission management

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.x
- **PostgreSQL** >= 14.x
- **npm** or **yarn**
- **Git**

### 1. Clone Repository

```powershell
git clone https://github.com/Rehman-codes/Specora.git
cd Specora
```

### 2. Backend Setup

```powershell
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
# Then start the server
npm run dev
```

### 3. Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

### 4. Database Setup

```powershell
# Create database
psql -U postgres -c "CREATE DATABASE specora_db;"

# Run migrations (auto-created on server start)
# Seed sample data
cd backend
npm run seed:meetings
```

### 5. Access Application

- **Frontend**: <http://localhost:3000>
- **Backend API**: <http://localhost:5000/api>
- **Meetings**: <http://localhost:3000/meetings>

📖 **Detailed Setup**: See [QUICKSTART.md](./QUICKSTART.md)

---

## 📁 Project Structure

```
Specora/
├── backend/                    # Node.js/Express API
│   ├── config/                # Database & configuration
│   ├── core/                  # Middlewares & utilities
│   ├── database/
│   │   ├── models/           # Sequelize models
│   │   ├── migrations/       # Database migrations
│   │   └── seeders/          # Seed data
│   ├── modules/
│   │   ├── auth/             # Authentication module
│   │   ├── meetings/         # Meetings module ✅
│   │   └── specbot/          # AI assistant module
│   ├── tests/                # Jest tests
│   ├── app.js                # Express app
│   └── server.js             # Server entry point
│
├── frontend/                  # Next.js React app
│   ├── src/
│   │   ├── app/              # Next.js 13+ app directory
│   │   │   ├── (dashboard)/
│   │   │   ├── (public)/     # Login, signup
│   │   │   └── (sidebar)/    # Main app routes
│   │   │       ├── chat/
│   │   │       ├── meetings/ # Meetings UI ✅
│   │   │       ├── specbot/
│   │   │       └── users/
│   │   ├── components/       # React components
│   │   │   ├── meetings/     # Meeting components ✅
│   │   │   ├── ui/           # Shadcn UI components
│   │   │   └── layout/       # Layout components
│   │   └── lib/              # Utilities
│   └── public/               # Static assets
│
├── docker-compose.yml         # Docker orchestration
├── QUICKSTART.md             # Quick setup guide
└── README.md                 # This file
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **React 19** | UI library |
| **Tailwind CSS 4** | Utility-first CSS |
| **Shadcn/UI** | Component library (Radix UI) |
| **Lucide Icons** | Icon system |
| **Framer Motion** | Animations (planned) |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js 18+** | JavaScript runtime |
| **Express.js** | Web framework |
| **PostgreSQL 14** | Relational database |
| **Sequelize** | ORM |
| **Nodemailer** | Email service |
| **JWT** | Authentication tokens |
| **Helmet** | Security middleware |

### AI/NLP (Planned)
| Technology | Purpose |
|------------|---------|
| **LangChain** | AI orchestration |
| **OpenAI API** | GPT models |
| **HuggingFace** | NLP models |
| **Python** | ML/AI processing |

---

## 📦 Modules

### 1. Meetings Module ✅ **COMPLETED**

Comprehensive meeting management system with email automation.

**Features:**
- Schedule meetings with stakeholders
- Automated email invitations
- Upcoming & completed meetings
- Recording management
- AI-ready for transcript analysis

**Documentation:** [MEETINGS_MODULE_README.md](./MEETINGS_MODULE_README.md)

**Routes:**
- `/meetings` - Main meetings page
- API: `/api/meetings/*`

### 2. Authentication Module 🔄 **IN PROGRESS**

User authentication and authorization.

**Features:**
- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt

### 3. SpecBot Module 🔜 **PLANNED**

AI-powered requirements assistant.

**Features:**
- Natural language processing
- Requirement extraction
- Intelligent suggestions

### 4. Chat Module 🔄 **IN PROGRESS**

Real-time team collaboration.

**Features:**
- WebSocket communication
- File sharing
- Message history

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Meetings Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/meetings/upcoming` | Get upcoming meetings |
| GET | `/meetings/completed` | Get completed meetings |
| GET | `/meetings/:id` | Get meeting by ID |
| POST | `/meetings/schedule` | Schedule new meeting |
| POST | `/meetings/send-email` | Send invitations |
| PUT | `/meetings/:id` | Update meeting |
| PATCH | `/meetings/:id/complete` | Mark as completed |
| DELETE | `/meetings/:id` | Delete meeting |

**Full API Docs:** [MEETINGS_MODULE_README.md](./MEETINGS_MODULE_README.md#api-endpoints)

---

## 🐳 Deployment

### Using Docker Compose

```powershell
# Create .env file
cp .env.docker.example .env

# Edit .env with your credentials

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed production deployment guide.

---

## 🧪 Testing

### Backend Tests

```powershell
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Frontend Tests (Coming Soon)

```powershell
cd frontend
npm test
```

**Test Files:**
- Integration: `backend/tests/integration/meetings.test.js`
- Unit: `backend/tests/unit/modules/meetings/service.test.js`

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Coding Standards
- Use ESLint for JavaScript
- Follow Prettier formatting
- Write tests for new features
- Update documentation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 👥 Team

**FAST NUCES - Final Year Project**

- **Bilal Raza** - Full Stack Developer
- **Team Members** - [Add names]
- **Supervisor** - [Add name]

---

## 📞 Contact

- **GitHub**: [@Rehman-codes](https://github.com/Rehman-codes)
- **Email**: [Your email]
- **Project Link**: [https://github.com/Rehman-codes/Specora](https://github.com/Rehman-codes/Specora)

---

## 🎯 Roadmap

- [x] Meetings Module
- [ ] Complete Authentication Module
- [ ] Implement SpecBot AI Assistant
- [ ] Add Real-time Chat
- [ ] Dashboard Analytics
- [ ] Export Requirements (PDF, Word)
- [ ] Mobile Application
- [ ] Cloud Deployment

---

## 🙏 Acknowledgments

- [Shadcn/UI](https://ui.shadcn.com/) for the beautiful component library
- [Next.js](https://nextjs.org/) for the amazing framework
- [PostgreSQL](https://www.postgresql.org/) for the robust database

---

<div align="center">

**Built with ❤️ by the Specora Team**

⭐ Star this repo if you find it helpful!

</div>
