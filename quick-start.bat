@echo off
echo ================================================
echo    Specora Meetings - Quick Start
echo ================================================
echo.

echo [1/3] Checking PostgreSQL connection...
cd backend
node -e "import('./config/database.js').then(db => db.default.authenticate()).then(() => { console.log('✅ Database connected'); process.exit(0); }).catch(err => { console.error('❌ Database connection failed:', err.message); process.exit(1); })" 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  PostgreSQL connection failed!
    echo.
    echo Please check:
    echo   1. PostgreSQL is running
    echo   2. Database 'specora' exists
    echo   3. backend\.env file has correct DB_PASSWORD
    echo.
    echo Run this to create the database:
    echo   psql -U postgres -c "CREATE DATABASE specora;"
    echo.
    pause
    exit /b 1
)

echo.
echo [2/3] Seeding database with dummy data...
call npm run seed
if %errorlevel% neq 0 (
    echo.
    echo ❌ Seeding failed! Check the error above.
    pause
    exit /b 1
)

echo.
echo [3/3] Starting servers...
echo.
echo ✅ Setup complete! Starting backend server...
echo.
echo 📝 In another terminal, run: cd frontend ^&^& npm run dev
echo.
echo 🌐 Then open: http://localhost:3000/meetings
echo.
pause
call npm start
