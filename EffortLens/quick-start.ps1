# EffortLens Quick Start Script for Windows PowerShell
# Run this script from the EffortLens directory

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  EffortLens Quick Start Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Python version
Write-Host "Checking Python version..." -ForegroundColor Yellow
$pythonVersion = python --version 2>&1
Write-Host "Found: $pythonVersion" -ForegroundColor Green

# Check if virtual environment exists
if (-Not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "✓ Virtual environment created" -ForegroundColor Green
} else {
    Write-Host "✓ Virtual environment already exists" -ForegroundColor Green
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

Write-Host "✓ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Check for data file
Write-Host "Checking for SEERA dataset..." -ForegroundColor Yellow
$xlsxFiles = Get-ChildItem -Path "data\raw" -Filter "*.xlsx" -ErrorAction SilentlyContinue

if ($xlsxFiles.Count -eq 0) {
    Write-Host "⚠ No dataset found in data/raw/" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please place your SEERA Excel dataset in data/raw/ and run this script again." -ForegroundColor Yellow
    Write-Host 'Expected file: "SEERA - Software Project Effort Estimation.xlsx"' -ForegroundColor Cyan
    Write-Host ""
    exit
} else {
    $dataFile = $xlsxFiles[0].FullName
    Write-Host "✓ Found dataset: $($dataFile)" -ForegroundColor Green
}

# Check for existing model
if (Test-Path "models\model.joblib") {
    Write-Host "✓ Trained model found" -ForegroundColor Green
    $response = Read-Host "Re-train model? (y/n)"
} else {
    Write-Host "No trained model found. Training required." -ForegroundColor Yellow
    $response = 'y'
}

if ($response -eq 'y') {
    Write-Host ""
    Write-Host "Running model training..." -ForegroundColor Yellow
    python src\train_model.py
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Training complete" -ForegroundColor Green
    } else {
        Write-Host "✗ Training failed" -ForegroundColor Red
        exit
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting Streamlit UI..." -ForegroundColor Yellow
Write-Host "Access the app at: http://localhost:8501" -ForegroundColor Cyan
Write-Host ""

streamlit run src\app.py
