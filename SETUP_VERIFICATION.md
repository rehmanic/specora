# ✅ Specora Meetings Module - Setup Verification Checklist

Use this checklist to verify that the Meetings module has been implemented correctly and is ready for use.

---

## 📋 Pre-Installation Checklist

### System Requirements
- [ ] Node.js >= 18.x installed
  ```powershell
  node --version
  ```
- [ ] PostgreSQL >= 14.x installed
  ```powershell
  psql --version
  ```
- [ ] npm or yarn installed
  ```powershell
  npm --version
  ```
- [ ] Git installed (optional)
  ```powershell
  git --version
  ```

---

## 📦 Backend Installation Verification

### 1. Dependencies Installed
Navigate to `backend/` folder and verify:

- [ ] `package.json` exists
- [ ] Run installation:
  ```powershell
  cd backend
  npm install
  ```
- [ ] `node_modules/` folder created
- [ ] No installation errors

### 2. Environment Configuration
- [ ] `.env.example` file exists
- [ ] Created `.env` file:
  ```powershell
  cp .env.example .env
  ```
- [ ] Updated `.env` with your settings:
  - [ ] `DB_NAME=specora_db`
  - [ ] `DB_USER=postgres`
  - [ ] `DB_PASSWORD=your_password`
  - [ ] `SMTP_USER=your_email@gmail.com`
  - [ ] `SMTP_PASS=your_app_password`

### 3. Database Setup
- [ ] PostgreSQL service is running:
  ```powershell
  Get-Service -Name postgresql*
  ```
- [ ] Database created:
  ```powershell
  psql -U postgres -c "CREATE DATABASE specora_db;"
  ```
- [ ] Can connect to database:
  ```powershell
  psql -U postgres -d specora_db -c "SELECT version();"
  ```

### 4. Backend Server
- [ ] Server starts without errors:
  ```powershell
  npm run dev
  ```
- [ ] See success message:
  ```
  ✅ Database connection established successfully
  ✅ Database models synchronized
  🚀 Specora Backend API Server
     Port: 5000
  ```
- [ ] Health check responds:
  ```powershell
  curl http://localhost:5000/health
  ```
  Expected response:
  ```json
  {
    "status": "ok",
    "message": "Specora API is running",
    "timestamp": "..."
  }
  ```

### 5. Seed Data (Optional)
- [ ] Run seeder:
  ```powershell
  npm run seed:meetings
  ```
- [ ] See success message:
  ```
  ✅ Seeded 4 upcoming meetings
  ✅ Seeded 3 completed meetings
  🎉 Seed data inserted successfully!
  ```

---

## 🎨 Frontend Installation Verification

### 1. Dependencies Installed
Navigate to `frontend/` folder:

- [ ] `package.json` exists
- [ ] Dependencies already installed (from previous setup)
- [ ] Or run:
  ```powershell
  cd frontend
  npm install
  ```

### 2. Frontend Server
- [ ] Server starts without errors:
  ```powershell
  npm run dev
  ```
- [ ] See success message:
  ```
  ▲ Next.js 15.x
  - Local:        http://localhost:3000
  - ready started server on 0.0.0.0:3000
  ```
- [ ] Can access frontend:
  ```
  http://localhost:3000
  ```

---

## 🧪 Feature Verification

### 1. Meetings Page Access
- [ ] Navigate to: `http://localhost:3000/meetings`
- [ ] Page loads without errors
- [ ] See "Meetings" page title
- [ ] See "Schedule Meeting" button
- [ ] See two sections: "Upcoming Meetings" and "Completed Meetings"

### 2. Upcoming Meetings Display
- [ ] Upcoming meetings section visible
- [ ] Shows count badge (e.g., "3")
- [ ] Meetings displayed in grid layout
- [ ] Each card shows:
  - [ ] Meeting name
  - [ ] Description
  - [ ] Date and time
  - [ ] Stakeholder avatars
  - [ ] "Join Meeting" button

### 3. Completed Meetings Display
- [ ] Completed meetings section visible
- [ ] Shows count badge
- [ ] Meetings displayed in grid layout
- [ ] Each card shows:
  - [ ] "Completed" badge
  - [ ] Meeting details
  - [ ] "View Recording" button (if recording_link exists)

### 4. Schedule Meeting Modal
- [ ] Click "Schedule Meeting" button
- [ ] Modal opens
- [ ] Form has all fields:
  - [ ] Meeting Name (text input)
  - [ ] Description (textarea)
  - [ ] Stakeholder Emails (text input with comma separation)
  - [ ] Date (date picker)
  - [ ] Time (time picker)
  - [ ] Meeting Link (URL input)
- [ ] "Cancel" button works
- [ ] Form validation works (try submitting empty form)

### 5. Create Meeting (Full Flow)
- [ ] Open schedule modal
- [ ] Fill in all fields:
  ```
  Name: Test Meeting
  Description: This is a test meeting
  Stakeholders: test@example.com
  Date: Tomorrow's date
  Time: 10:00 AM
  Link: https://meet.google.com/test-abc
  ```
- [ ] Click "Schedule & Send Invites"
- [ ] Modal closes
- [ ] New meeting appears in "Upcoming Meetings"
- [ ] (If SMTP configured) Email received at stakeholder address

---

## 🔌 API Endpoint Testing

### 1. Get Upcoming Meetings
```powershell
curl http://localhost:5000/api/meetings/upcoming
```
- [ ] Returns JSON array
- [ ] Contains meetings with `is_completed: false`

### 2. Get Completed Meetings
```powershell
curl http://localhost:5000/api/meetings/completed
```
- [ ] Returns JSON array
- [ ] Contains meetings with `is_completed: true`

### 3. Get Meeting by ID
```powershell
curl http://localhost:5000/api/meetings/1
```
- [ ] Returns single meeting object
- [ ] Or 404 if not found

### 4. Create Meeting
```powershell
$body = @{
    name = "API Test Meeting"
    description = "Testing via API"
    stakeholders = @("test@example.com")
    meeting_link = "https://meet.google.com/test"
    scheduled_at = "2025-10-15T10:00:00Z"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/meetings/schedule" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```
- [ ] Returns 201 Created
- [ ] Returns created meeting object

### 5. Search Meetings
```powershell
curl "http://localhost:5000/api/meetings/search?q=Test"
```
- [ ] Returns matching meetings
- [ ] Empty array if no matches

---

## 📧 Email Service Verification

### 1. Gmail SMTP Setup (If using Gmail)
- [ ] Gmail account created or available
- [ ] 2-Step Verification enabled
- [ ] App Password generated (16 characters)
- [ ] App Password added to `.env` as `SMTP_PASS`
- [ ] Email address added to `.env` as `SMTP_USER`

### 2. Test Email Sending
- [ ] Schedule a test meeting with your email
- [ ] Check inbox for invitation email
- [ ] Email contains:
  - [ ] Meeting name
  - [ ] Description
  - [ ] Date and time
  - [ ] Meeting link (clickable button)
  - [ ] Professional HTML formatting

### 3. Alternative: Test SMTP (Ethereal Email)
If not using Gmail, use test SMTP:
```javascript
// In .env
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=<generated_user>@ethereal.email
SMTP_PASS=<generated_password>
```
- [ ] Visit https://ethereal.email
- [ ] Create account
- [ ] Use credentials in `.env`
- [ ] Check Ethereal inbox for test emails

---

## 🧪 Testing Suite Verification

### 1. Run Tests
```powershell
cd backend
npm test
```

- [ ] All tests pass
- [ ] See output similar to:
  ```
  PASS  tests/integration/meetings.test.js
  PASS  tests/unit/modules/meetings/service.test.js
  
  Test Suites: 2 passed, 2 total
  Tests:       20 passed, 20 total
  ```

### 2. Coverage Report
```powershell
npm test -- --coverage
```
- [ ] Coverage report generated
- [ ] Coverage > 70% (ideal: > 80%)

---

## 🐳 Docker Verification (Optional)

### 1. Docker Setup
- [ ] Docker installed
  ```powershell
  docker --version
  ```
- [ ] Docker Compose installed
  ```powershell
  docker-compose --version
  ```

### 2. Environment File
- [ ] Created `.env` from `.env.docker.example`
- [ ] Updated with credentials

### 3. Start Services
```powershell
docker-compose up -d
```
- [ ] All 3 containers start:
  - [ ] specora-db (PostgreSQL)
  - [ ] specora-backend (Node.js)
  - [ ] specora-frontend (Next.js)

### 4. Verify Containers
```powershell
docker-compose ps
```
- [ ] All containers show "Up" status

### 5. Access Services
- [ ] Frontend: http://localhost:3000
- [ ] Backend: http://localhost:5000/health
- [ ] Database: `localhost:5432` (psql)

### 6. Stop Services
```powershell
docker-compose down
```
- [ ] All containers stopped

---

## 📚 Documentation Verification

### Files Created and Reviewed
- [ ] `MEETINGS_MODULE_README.md` - Complete guide
- [ ] `QUICKSTART.md` - Setup in 5 minutes
- [ ] `PROJECT_README.md` - Project overview
- [ ] `IMPLEMENTATION_STATUS.md` - Progress tracking
- [ ] `IMPLEMENTATION_SUMMARY.md` - What was built
- [ ] `ARCHITECTURE.md` - System architecture
- [ ] `CHANGELOG.md` - Version history
- [ ] This file: `SETUP_VERIFICATION.md`

---

## 🔍 Code Quality Checks

### Backend Code
- [ ] No syntax errors
- [ ] All imports resolve
- [ ] ES modules working (`.js` with `"type": "module"`)
- [ ] Environment variables loading
- [ ] Database connection working
- [ ] Models sync without errors

### Frontend Code
- [ ] No console errors in browser
- [ ] No React warnings
- [ ] Components render correctly
- [ ] Tailwind CSS styling applied
- [ ] Icons display (Lucide React)
- [ ] Forms validate correctly

---

## 🐛 Common Issues Checklist

### Issue: "Cannot connect to database"
- [ ] PostgreSQL is running
- [ ] Database `specora_db` exists
- [ ] Credentials in `.env` are correct
- [ ] Port 5432 is not blocked

### Issue: "Port 5000 already in use"
- [ ] Check if another process is using port 5000
- [ ] Kill the process or change port in `.env`
  ```powershell
  netstat -ano | findstr :5000
  ```

### Issue: "Email not sending"
- [ ] SMTP credentials are correct
- [ ] Using App Password (not regular password)
- [ ] 2-Step Verification enabled (for Gmail)
- [ ] Firewall not blocking SMTP port 587

### Issue: "Module not found"
- [ ] Run `npm install` in both `backend/` and `frontend/`
- [ ] Delete `node_modules/` and reinstall
- [ ] Check import paths are correct

### Issue: "Frontend shows blank page"
- [ ] Check browser console for errors
- [ ] Ensure backend is running on port 5000
- [ ] Check API endpoints are accessible
- [ ] Clear browser cache

---

## ✅ Final Verification

### All Systems Go
- [ ] Backend server running (Port 5000)
- [ ] Frontend server running (Port 3000)
- [ ] Database connected and synced
- [ ] Can access `/meetings` page
- [ ] Can schedule a meeting
- [ ] Can view meetings list
- [ ] API endpoints respond correctly
- [ ] Tests pass successfully
- [ ] Documentation reviewed

---

## 🎯 Success Criteria

You can mark the implementation as **COMPLETE** if:

✅ All items in "Final Verification" are checked  
✅ You can schedule a meeting successfully  
✅ You can see the meeting in the list  
✅ Emails are sent (or SMTP is configured for later)  
✅ No critical errors in console or terminal  
✅ Tests pass without failures  

---

## 📞 Need Help?

If any item fails verification:

1. **Check Documentation**
   - `QUICKSTART.md` for setup
   - `MEETINGS_MODULE_README.md` for details
   - `ARCHITECTURE.md` for understanding flow

2. **Troubleshooting**
   - See "Common Issues" section above
   - Check terminal/console for error messages
   - Verify environment variables

3. **Test Individual Components**
   - Test database connection separately
   - Test API endpoints with curl
   - Check frontend in browser console

---

## 📊 Verification Summary

Total Checks: **~150 items**  
Time Required: **15-20 minutes**

**Current Status:**

- [ ] Pre-Installation Complete
- [ ] Backend Setup Complete
- [ ] Frontend Setup Complete
- [ ] Features Working
- [ ] API Endpoints Tested
- [ ] Email Service Configured
- [ ] Tests Passing
- [ ] Docker Working (optional)
- [ ] Documentation Reviewed
- [ ] **ALL SYSTEMS READY** 🚀

---

**Last Updated:** October 6, 2025  
**Version:** 1.0.0  

✨ **Congratulations! Your Meetings Module is ready for production!** ✨
