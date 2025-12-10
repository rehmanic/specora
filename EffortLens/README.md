# EffortLens - Project Cost & Effort Estimation System

**ML-powered software effort estimation using XGBoost regression**

EffortLens is a machine learning system that predicts software development effort and cost using the SEERA cost estimation dataset. It uses XGBoost regression trained on 120 historical projects and generates professional narratives using smart templates (no external API required).

## 🎯 Features

- **XGBoost ML Model**: Trained regression model for accurate effort prediction
- **8 Project Inputs**: Team size, complexity, object points, and 5 other key factors
- **Cost Calculation**: Automatic conversion from effort to cost estimates
- **Smart Narratives**: Template-based professional reports (no API key needed)
- **Interactive Visualizations**: Radar charts, feature importance, cost gauges, and duration charts
- **Streamlit UI**: Clean, user-friendly web interface with progress indicators
- **Risk Detection**: Identifies low-scoring inputs as risk factors
- **Docker Ready**: Containerized deployment with docker-compose
- **Offline Ready**: Works completely offline without external dependencies

## 📁 Repository Structure

```
EffortLens/
├── data/
│   └── raw/                     # Place SEERA Excel dataset here
├── models/
│   ├── model.joblib             # Trained XGBoost model
│   ├── encoders.joblib          # Preprocessing (imputer, scaler)
│   └── training_metrics.json    # Training performance metrics
├── src/
│   ├── train_model.py           # XGBoost training pipeline
│   ├── utils.py                 # Cost calculation utilities
│   └── app.py                   # Streamlit UI + narrative templates
├── tests/
│   ├── test_train.py
│   └── test_app_smoke.py
├── requirements.txt
├── README.md
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- SEERA cost estimation dataset (Excel: `SEERA - Software Project Effort Estimation.xlsx`)
- No API keys required!

### Installation

```powershell
# Navigate to EffortLens directory
cd EffortLens

# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

### Setup Pipeline

1. **Place your data**:
   ```powershell
   # Copy SEERA Excel dataset to data/raw/
   copy "path\to\SEERA - Software Project Effort Estimation.xlsx" data\raw\
   ```

2. **Train the model**:
   ```powershell
   python src\train_model.py
   ```

3. **Run Streamlit UI**:
   ```powershell
   streamlit run src\app.py
   ```

4. **Open browser**: Navigate to http://localhost:8501

## 🧠 Model Details

### Input Features (8 total)

| Feature | Type | Range | Description |
|---------|------|-------|-------------|
| Object Points | Numeric | 1-1000+ | Function points / object points |
| Team Size | Numeric | 1-50+ | Number of developers |
| Product Complexity | Scale | 1-5 | Low (1) to Very High (5) |
| Performance Requirements | Scale | 1-5 | Low (1) to Very High (5) |
| Programmer Capability | Scale | 1-5 | Low (1) to Very High (5) |
| PM Experience | Scale | 1-5 | Low (1) to Very High (5) |
| Requirement Stability | Scale | 1-5 | Unstable (1) to Very Stable (5) |
| Dev Environment Adequacy | Scale | 1-5 | Poor (1) to Excellent (5) |

### Output

- **Effort**: Person-hours (primary prediction)
- **Person-Months**: Effort ÷ 160 hours
- **Cost Estimate**: Person-months × $10,000/month
- **Smart Narrative**: Professional template-based analysis

### Training Metrics

- **Dataset**: SEERA (120 projects)
- **Algorithm**: XGBoost Regressor
- **Cross-Validation R²**: ~0.39
- **Cross-Validation MAE**: ~5,000 person-hours
- **Top Features**: Team size (33%), Object points (26%), Environment adequacy (14%)

## 🔧 Environment Configuration

No environment variables required! The system works out of the box.

Optionally create `.env` file to override model paths:

```env
# Optional: Override default model paths
# MODEL_PATH=./models/model.joblib
# ENCODERS_PATH=./models/encoders.joblib
```

## 🎨 Streamlit UI Usage

1. **Enter 8 project parameters**:
   - Object Points (numeric)
   - Team Size (numeric)
   - 6 scale inputs (1-5 sliders)

2. **Click "Calculate Effort Estimate"**

3. **View results**:
   - Effort in person-hours
   - Person-months equivalent
   - Cost estimate in USD
   - AI-generated professional narrative

## 🐳 Docker Deployment

```powershell
cd EffortLens
docker-compose up --build
```

Access UI at: http://localhost:8501

## 🧪 Testing

```powershell
pytest tests/ -v
```

## 🔬 Technical Pipeline

```
┌─────────────────────────────────────────────────────────┐
│                    TRAINING PHASE                        │
├─────────────────────────────────────────────────────────┤
│  SEERA Dataset (120 projects, 76 columns)               │
│       ↓                                                 │
│  Feature Selection (8 key features)                     │
│       ↓                                                 │
│  Preprocessing (SimpleImputer median, StandardScaler)   │
│       ↓                                                 │
│  XGBoost Training (5-fold cross-validation)             │
│       ↓                                                 │
│  Save: model.joblib + encoders.joblib                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   PREDICTION PHASE                       │
├─────────────────────────────────────────────────────────┤
│  User Input (8 features via Streamlit UI)               │
│       ↓                                                 │
│  Load model.joblib + encoders.joblib                    │
│       ↓                                                 │
│  Apply same preprocessing pipeline                      │
│       ↓                                                 │
│  XGBoost model.predict()                                │
│       ↓                                                 │
│  Cost Calculation (effort → person-months → USD)        │
│       ↓                                                 │
│  Template-Based → Professional Narrative                │
└─────────────────────────────────────────────────────────┘
```

## 🐛 Troubleshooting

### Issue: "Model artifacts not found"
**Solution**: Run `python src/train_model.py` first

### Issue: "Narrative generation error"
**Solution**: The app uses template-based narratives (no API needed). Restart the app.

### Issue: Import errors
**Solution**: Activate virtual environment and install requirements

## 📄 License

See LICENSE file in repository root.

---

**Built with ❤️ for accurate software cost estimation**
