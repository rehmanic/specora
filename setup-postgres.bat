@echo off
echo ================================================
echo    Specora - PostgreSQL Setup Helper
echo ================================================
echo.
echo This script will help you configure PostgreSQL
echo.

:check_password
echo Step 1: Testing current PostgreSQL password...
echo.
psql -U postgres -c "SELECT version();" 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ❌ Could not connect to PostgreSQL!
    echo.
    echo Please ensure:
    echo   1. PostgreSQL is installed and running
    echo   2. You know the password you set during installation
    echo.
    echo Common passwords to try:
    echo   - postgres
    echo   - admin
    echo   - root
    echo   - (empty password)
    echo.
    echo To reset password if forgotten:
    echo   1. Open pgAdmin
    echo   2. Right-click on PostgreSQL server
    echo   3. Select Properties ^> Connection
    echo   4. Set new password
    echo.
    pause
    exit /b 1
)

echo ✅ PostgreSQL connection successful!
echo.

:create_database
echo Step 2: Creating database 'specora'...
echo.
psql -U postgres -c "DROP DATABASE IF EXISTS specora;" 2>nul
psql -U postgres -c "CREATE DATABASE specora;"
if %errorlevel% neq 0 (
    echo ❌ Failed to create database
    pause
    exit /b 1
)

echo ✅ Database 'specora' created successfully!
echo.

:verify_database
echo Step 3: Verifying database...
psql -U postgres -d specora -c "SELECT current_database();"
echo.

echo ================================================
echo    Setup Complete!
echo ================================================
echo.
echo Next steps:
echo   1. Update backend\.env file with your PostgreSQL password
echo   2. Run: cd backend
echo   3. Run: npm run seed
echo   4. Run: npm start
echo.
pause
