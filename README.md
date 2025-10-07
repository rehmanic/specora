# Specora
AI-Assisted Requirements Engineering Platform

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Setup
```bash
# 1. Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE specora;"

# 2. Configure environment
# Copy backend/.env.example to backend/.env
# Set your DB_PASSWORD

# 3. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 4. Seed database with dummy data
cd backend && npm run seed

# 5. Start backend
npm start

# 6. Start frontend (in new terminal)
cd frontend && npm run dev
```

### Or Use Quick Start Script (Windows)
```bash
quick-start.bat
# Then in another terminal: cd frontend && npm run dev
```

## 📚 Documentation
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup instructions
- **[QUICK_SUMMARY.md](./QUICK_SUMMARY.md)** - Feature overview
- **[POSTGRESQL_SETUP.md](./POSTGRESQL_SETUP.md)** - Database installation guide

## ✨ Features

### Meetings Module
- ✅ **Video Conferencing** - WebRTC-based video calls
- ✅ **Shareable Links** - Google Meet-style meeting URLs
- ✅ **Meeting Recording** - Record and playback meetings
- ✅ **Screen Sharing** - Share your screen with participants
- ✅ **Meeting Scheduling** - Schedule meetings with stakeholders
- ✅ **PostgreSQL Database** - Persistent meeting storage
- ✅ **AI Transcription** - Automatic meeting transcripts
- ✅ **Requirement Extraction** - AI-powered requirement analysis

### Authentication Module
- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Protected routes

### Specbot Module
- ✅ AI-powered requirements assistant
- ✅ Real-time chat interface
- ✅ Context-aware responses

## 🛠️ Tech Stack

### Frontend
- Next.js 15
- React 19
- Tailwind CSS
- shadcn/ui components
- Socket.io-client
- Simple-peer (WebRTC)
- Video.js

### Backend
- Node.js 18+
- Express.js
- PostgreSQL 14+
- Sequelize ORM
- Socket.io
- JWT Authentication
- Multer (file uploads)

## 📁 Project Structure
```
specora/
├── backend/
│   ├── config/
│   │   └── database.js          # PostgreSQL configuration
│   ├── database/
│   │   └── models/
│   │       ├── user.js
│   │       └── meeting.js       # Meeting model
│   ├── modules/
│   │   ├── auth/                # Authentication module
│   │   ├── meetings/            # Meetings CRUD
│   │   ├── specbot/             # AI assistant
│   │   └── video/               # Video conferencing
│   ├── seed.js                  # Database seeding
│   ├── app.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (dashboard)/
│   │   │   ├── (public)/        # Auth pages
│   │   │   └── (sidebar)/       # Main app pages
│   │   │       └── meetings/    # Meetings module
│   │   └── components/
│   │       ├── meetings/        # Meeting components
│   │       ├── video/           # Video room
│   │       └── ui/              # UI components
│   └── package.json
├── SETUP_GUIDE.md              # Complete setup guide
├── QUICK_SUMMARY.md            # Feature summary
└── quick-start.bat             # Windows quick start
```

## 🔗 Shareable Meeting Links

Specora generates Google Meet-style shareable links for meetings:

```
Format: http://localhost:3000/meetings/room/room_{id}_{timestamp}
Example: http://localhost:3000/meetings/room/room_1_1705839234567
```

**How it works:**
1. Click "Start Meeting" on any upcoming meeting
2. System generates unique room URL
3. Link is saved to database and displayed on meeting card
4. Copy and share the link with participants
5. Anyone with the link can click to join

## 🎯 Usage

### Access the Meetings Page
```
http://localhost:3000/meetings
```

### Schedule a New Meeting
1. Click "Schedule Meeting" button
2. Fill in:
   - Meeting name
   - Description
   - Stakeholders (comma-separated emails)
   - Date and time
3. Click "Schedule Meeting"
4. Meeting saved to PostgreSQL database

### Start a Meeting
1. Find the meeting in "Upcoming Meetings"
2. Click "Start Meeting" button
3. System generates shareable link
4. You're redirected to the video room

### Share Meeting Link
1. Return to meetings page after starting
2. Meeting card now shows "Meeting Link" section
3. Click "Copy" button to copy link
4. Share via email, Slack, WhatsApp, etc.
5. Participants click link to join

### Join a Meeting
- Click the "Click to join meeting" link on meeting card
- Or paste the shared URL in browser
- Allow camera/microphone permissions
- Start collaborating!

## 🧪 Sample Data

The seed script provides 7 meetings:
- **4 Upcoming Meetings** (including one with pre-generated link)
- **3 Completed Meetings** (with recordings and transcripts)

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=specora
DB_USER=postgres
DB_PASSWORD=your_password_here
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_secret_key
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 📦 Available Scripts

### Backend
```bash
npm start              # Start server
npm run dev            # Development mode with nodemon
npm run seed           # Seed database with dummy data
```

### Frontend
```bash
npm run dev            # Start development server
npm run build          # Build for production
npm start              # Start production server
```

## 🤝 Contributing
This is a Final Year Project (FYP) for FAST NUCES.

## 📄 License
See LICENSE file for details.

## 🆘 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
# Windows: Services → postgresql-x64-14

# Verify database exists
psql -U postgres -l

# Check credentials in backend/.env
```

### Port Already in Use
```bash
# Backend (default: 5000)
# Change PORT in backend/.env

# Frontend (default: 3000)
# Change in package.json or use: npm run dev -- -p 3001
```

### Video Not Working
- Allow camera/microphone permissions
- Use Chrome or Firefox (best WebRTC support)
- Check if backend WebSocket server is running

## 📞 Support
For detailed setup instructions, see:
- [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- [POSTGRESQL_SETUP.md](./POSTGRESQL_SETUP.md)

---

**Built with ❤️ for FAST NUCES FYP**
