# 🎯 Quick Start Guide - Meetings Module

## ⚡ Fast Setup (5 minutes)

### Step 1: Install Backend Dependencies

```powershell
cd backend
npm install
```

### Step 2: Configure Environment

Create `.env` file:

```powershell
cp .env.example .env
```

Edit `.env` with your settings:

```env
DB_NAME=specora_db
DB_USER=postgres
DB_PASSWORD=your_password

SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_char_app_password
```

### Step 3: Setup Database

```powershell
# Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE specora_db;"
```

### Step 4: Start Backend

```powershell
npm run dev
```

Backend runs on: **http://localhost:5000**

### Step 5: Seed Sample Data (Optional)

```powershell
npm run seed:meetings
```

### Step 6: Install Frontend Dependencies

```powershell
cd ../frontend
npm install
```

### Step 7: Start Frontend

```powershell
npm run dev
```

Frontend runs on: **http://localhost:3000**

---

## 🎉 You're Done!

Visit: **http://localhost:3000/meetings**

---

## 📧 Gmail App Password Setup

1. Visit: https://myaccount.google.com/security
2. Enable **2-Step Verification**
3. Go to **App Passwords**
4. Select **Mail** → Generate
5. Copy the 16-character password
6. Use in `.env` as `SMTP_PASS`

---

## 🐛 Troubleshooting

### Database Connection Error
```powershell
# Check if PostgreSQL is running
Get-Service -Name postgresql*

# Start PostgreSQL if stopped
Start-Service postgresql-x64-14
```

### Port Already in Use
```powershell
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### Email Not Sending
- Verify Gmail App Password (not regular password)
- Check 2-Step Verification is enabled
- Ensure SMTP settings are correct in `.env`

---

## 🧪 Test the API

### Test Health Endpoint
```powershell
curl http://localhost:5000/health
```

### Test Get Upcoming Meetings
```powershell
curl http://localhost:5000/api/meetings/upcoming
```

### Test Schedule Meeting
```powershell
$body = @{
    name = "Test Meeting"
    description = "This is a test"
    stakeholders = @("test@example.com")
    meeting_link = "https://meet.google.com/test"
    scheduled_at = "2025-10-10T10:00:00Z"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/meetings/schedule" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

---

## 📱 Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000/meetings |
| Backend API | http://localhost:5000/api |
| Health Check | http://localhost:5000/health |

---

**Need help? Check `MEETINGS_MODULE_README.md` for detailed documentation.**
