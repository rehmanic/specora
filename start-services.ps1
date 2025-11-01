# Specora Quick Start Script
# Run this to start all services needed for demo

Write-Host "🚀 Starting Specora Services..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "1️⃣  Checking Docker..." -ForegroundColor Yellow
try {
    docker info *> $null
    Write-Host "   ✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Docker is not running. Please start Docker Desktop first!" -ForegroundColor Red
    exit 1
}

# Start Redis container
Write-Host ""
Write-Host "2️⃣  Starting Redis container..." -ForegroundColor Yellow
$redisStatus = docker ps -q --filter "name=specora-redis"
if ($redisStatus) {
    Write-Host "   ✅ Redis is already running" -ForegroundColor Green
} else {
    docker start specora-redis 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Redis started successfully" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Failed to start Redis" -ForegroundColor Red
        exit 1
    }
}

# Wait for Redis to be ready
Write-Host ""
Write-Host "3️⃣  Waiting for Redis to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Write-Host "   ✅ Redis is ready" -ForegroundColor Green

# Check if port 5000 is available
Write-Host ""
Write-Host "4️⃣  Checking port 5000..." -ForegroundColor Yellow
$portCheck = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($portCheck) {
    Write-Host "   ⚠️  Port 5000 is in use. Killing Node processes..." -ForegroundColor Yellow
    taskkill /F /IM node.exe 2>&1 | Out-Null
    Start-Sleep -Seconds 1
    Write-Host "   ✅ Port 5000 is now available" -ForegroundColor Green
} else {
    Write-Host "   ✅ Port 5000 is available" -ForegroundColor Green
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✨ All services are ready!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Start backend:  cd backend && npm start" -ForegroundColor White
Write-Host "   2. Start frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host "   3. Open browser:   http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "🧪 To test email:    cd backend && npm run test-email" -ForegroundColor Cyan
Write-Host "🔗 To setup webhook: cd backend && npm run setup-webhook" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to start the backend server..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Start backend
Write-Host ""
Write-Host "🔄 Starting backend server..." -ForegroundColor Cyan
Set-Location -Path "d:\FAST NU\FYP\Specora\backend"
node server.js
