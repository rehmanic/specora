#!/usr/bin/env python3
"""
EffortLens Streamlit Application - Project Cost and Effort Estimator.

A Streamlit app that uses a trained XGBoost ML model to predict project effort (person-hours)
and leverages the Gemini API for humanized narration of results.

Pipeline: ML Model (XGBoost) -> Prediction -> Gemini API (Narration)
"""

import json
import logging
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, Optional, Tuple

import joblib
import numpy as np
import streamlit as st
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ========== Configuration ==========

MODEL_PATH = os.getenv('ECON_MODEL_PATH', './models/model.joblib')
ENCODERS_PATH = os.getenv('ECON_ENCODERS_PATH', './models/encoders.joblib')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')

# Cost estimation parameters
HOURS_PER_MONTH = 160  # Standard hours per person-month
DEFAULT_LABOR_RATE = 10000  # $10,000 per person-month (industry average)


# ========== Feature Mapping ==========

# Mapping from UI-friendly names to model feature names
FEATURE_LABELS = {
    'object_points': 'Object points',
    'product_complexity': 'Product complexity',
    'performance_requirements': 'Performance requirements',
    'programmer_capability': 'Programmers capability ',  # Note trailing space
    'pm_experience': 'Project manager experience',
    'team_size': 'Team size',
    'requirement_stability': 'Requirment stability',  # Note typo in dataset
    'environment_adequacy': 'Development environment adequacy'
}

# Display names for UI
FEATURE_DISPLAY_NAMES = {
    'object_points': 'Project Size (Object Points)',
    'product_complexity': 'Product Complexity',
    'performance_requirements': 'Performance Requirements',
    'programmer_capability': 'Programmer Capability',
    'pm_experience': 'Project Manager Experience',
    'team_size': 'Dedicated Team Size',
    'requirement_stability': 'Requirement Stability',
    'environment_adequacy': 'Environment Adequacy'
}


# ========== Model Loading ==========

@st.cache_resource
def load_model_and_preprocessing():
    """Load trained model and preprocessing objects."""
    logger.info(f"Loading model from: {MODEL_PATH}")
    logger.info(f"Loading encoders from: {ENCODERS_PATH}")
    
    model_artifact = joblib.load(MODEL_PATH)
    preprocessing = joblib.load(ENCODERS_PATH)
    
    return model_artifact, preprocessing


# ========== Gemini API Integration ==========

def call_gemini_api(prompt: str) -> Optional[str]:
    """
    Call Gemini API for narrative generation.
    
    Args:
        prompt: The prompt to send to Gemini
        
    Returns:
        Generated text or None if failed
    """
    if not GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY not set, skipping LLM narration")
        return None
    
    try:
        import google.generativeai as genai
        
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        response = model.generate_content(prompt)
        return response.text
        
    except ImportError:
        logger.warning("google-generativeai not installed")
        return None
    except Exception as e:
        logger.error(f"Gemini API error: {e}")
        return None


def generate_gemini_narration(
    effort_hours: float,
    input_features: Dict[str, float],
    feature_importance: Dict[str, float]
) -> str:
    """
    Generate humanized narration using Gemini API.
    
    Args:
        effort_hours: Predicted effort in person-hours
        input_features: Dictionary of input feature values
        feature_importance: Dictionary of feature importance scores
        
    Returns:
        Narrative text
    """
    # Calculate derived values
    person_months = effort_hours / HOURS_PER_MONTH
    cost_estimate = person_months * DEFAULT_LABOR_RATE
    
    # Find key drivers (lowest scoring inputs that might increase effort)
    key_drivers = []
    risk_features = []
    
    # Check for low-scoring features (potential risk areas)
    slider_features = ['product_complexity', 'performance_requirements', 'programmer_capability',
                       'pm_experience', 'requirement_stability', 'environment_adequacy']
    
    for feat in slider_features:
        display_name = FEATURE_DISPLAY_NAMES.get(feat, feat)
        value = input_features.get(feat, 3)
        
        if value <= 2:
            risk_features.append((display_name, value))
        elif value >= 4:
            key_drivers.append((display_name, value, "high"))
    
    # Build prompt for Gemini
    risk_text = ""
    if risk_features:
        risk_text = f"LOW SCORING INPUTS (potential risks): {', '.join([f'{n} ({v}/5)' for n, v in risk_features])}"
    
    driver_text = ""
    if key_drivers:
        driver_text = f"HIGH SCORING INPUTS (positive factors): {', '.join([f'{n} ({v}/5)' for n, v, _ in key_drivers])}"
    
    prompt = f"""You are an AI Project Cost Estimation Assistant. Generate a professional, concise forecast narrative.

INPUT DATA:
- Predicted Effort: {effort_hours:.0f} person-hours
- Person-Months: {person_months:.1f} (assuming {HOURS_PER_MONTH} hours/month)
- Estimated Cost: ${cost_estimate:,.0f} (at ${DEFAULT_LABOR_RATE:,}/person-month rate)
- Object Points: {input_features.get('object_points', 0):.0f}
- Team Size: {input_features.get('team_size', 0):.0f} developers
- {risk_text}
- {driver_text}

OUTPUT REQUIREMENTS (Generate exactly this structure):

**AI-Powered Project Effort and Cost Forecast**

**Effort Summary:**
State the predicted effort of **{effort_hours:.0f} person-hours** in bold. Convert to person-months ({person_months:.1f} person-months at {HOURS_PER_MONTH} hours/month).

**Cost Interpretation:**
Explain that final cost = effort x labor rate. Using an industry rate of ${DEFAULT_LABOR_RATE:,}/person-month, the estimated cost is approximately **${cost_estimate:,.0f}**. Provide a range estimate (±20%).

**Key Drivers:**
Identify the 1-2 most influential factors from the inputs. If there are low-scoring features, mention how they may be elevating the estimate.

**Actionable Recommendation:**
Provide ONE specific, constructive action to mitigate risk based on the lowest-scoring input feature.

TONE: Professional, concise, action-oriented. No tables, no extra sections."""

    # Call Gemini API
    narrative = call_gemini_api(prompt)
    
    if narrative:
        return narrative
    
    # Fallback narrative if Gemini unavailable
    return generate_fallback_narrative(effort_hours, person_months, cost_estimate, 
                                       input_features, risk_features, key_drivers)


def generate_fallback_narrative(
    effort_hours: float,
    person_months: float,
    cost_estimate: float,
    input_features: Dict,
    risk_features: list,
    key_drivers: list
) -> str:
    """Generate fallback narrative when Gemini is unavailable."""
    
    # Build driver text
    driver_text = "The estimate reflects the provided project parameters."
    if risk_features:
        lowest = min(risk_features, key=lambda x: x[1])
        driver_text = f"The estimate is influenced primarily by **{lowest[0]}** scoring {lowest[1]}/5."
    
    # Build recommendation
    recommendation = "Maintain clear scope definition and regular progress reviews."
    if risk_features:
        lowest = min(risk_features, key=lambda x: x[1])
        recommendations = {
            'Programmer Capability': "Consider investing in team training or adding experienced developers to reduce delivery risk.",
            'Project Manager Experience': "Engage a senior PM or provide mentorship to strengthen project governance.",
            'Requirement Stability': "Prioritize requirements clarification workshops and implement change control procedures.",
            'Environment Adequacy': "Invest in development tooling and infrastructure to improve team productivity.",
            'Product Complexity': "Consider breaking the project into smaller, manageable phases with clear milestones.",
            'Performance Requirements': "Allocate additional time for performance testing and optimization."
        }
        recommendation = recommendations.get(lowest[0], recommendation)
    
    cost_low = cost_estimate * 0.8
    cost_high = cost_estimate * 1.2
    
    return f"""**AI-Powered Project Effort and Cost Forecast**

**Effort Summary:**
The predicted effort is **{effort_hours:,.0f} person-hours**, equivalent to approximately **{person_months:.1f} person-months** (at {HOURS_PER_MONTH} hours/month).

**Cost Interpretation:**
Final project cost equals effort multiplied by labor rate. Using an industry rate of ${DEFAULT_LABOR_RATE:,} per person-month, the estimated cost is approximately **${cost_estimate:,.0f}**. Accounting for typical variance, expect a range of **${cost_low:,.0f} to ${cost_high:,.0f}**.

**Key Drivers:**
{driver_text}

**Actionable Recommendation:**
{recommendation}"""


# ========== Prediction Logic ==========

def prepare_input_features(
    object_points: float,
    product_complexity: int,
    performance_requirements: int,
    programmer_capability: int,
    pm_experience: int,
    team_size: int,
    requirement_stability: int,
    environment_adequacy: int,
    preprocessing: Dict
) -> Tuple[np.ndarray, Dict[str, float]]:
    """
    Prepare input features for model prediction.
    
    Returns:
        Tuple of (feature_array, feature_dict)
    """
    # Build feature dictionary with model column names
    feature_dict = {
        'object_points': float(object_points),
        'product_complexity': float(product_complexity),
        'performance_requirements': float(performance_requirements),
        'programmer_capability': float(programmer_capability),
        'pm_experience': float(pm_experience),
        'team_size': float(team_size),
        'requirement_stability': float(requirement_stability),
        'environment_adequacy': float(environment_adequacy)
    }
    
    # Get feature order from preprocessing
    feature_columns = preprocessing.get('feature_columns', [])
    
    # Map our feature names to model feature names
    feature_mapping = {
        'Object points': feature_dict['object_points'],
        'Product complexity': feature_dict['product_complexity'],
        'Performance requirements': feature_dict['performance_requirements'],
        'Programmers capability ': feature_dict['programmer_capability'],
        'Project manager experience': feature_dict['pm_experience'],
        'Team size': feature_dict['team_size'],
        'Requirment stability': feature_dict['requirement_stability'],
        'Development environment adequacy': feature_dict['environment_adequacy']
    }
    
    # Build feature array in correct order
    X_raw = np.array([[feature_mapping.get(col, 0) for col in feature_columns]])
    
    # Apply preprocessing (imputation and scaling)
    imputer = preprocessing.get('imputer')
    scaler = preprocessing.get('scaler')
    
    X_imputed = imputer.transform(X_raw) if imputer else X_raw
    X_scaled = scaler.transform(X_imputed) if scaler else X_imputed
    
    return X_scaled, feature_dict


def predict_effort(model, X: np.ndarray) -> float:
    """
    Make effort prediction using trained model.
    
    Args:
        model: Trained model object
        X: Preprocessed feature array
        
    Returns:
        Predicted effort in person-hours
    """
    prediction = model.predict(X)[0]
    # Ensure non-negative
    return max(0, float(prediction))


# ========== Streamlit UI ==========

def main():
    """Main Streamlit application."""
    st.set_page_config(
        page_title="Project Cost and Effort Estimator",
        page_icon="💰",
        layout="wide"
    )
    
    # Custom CSS for professional styling
    st.markdown("""
    <style>
    .main-header {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1E3A5F;
        text-align: center;
        margin-bottom: 0.5rem;
    }
    .sub-header {
        font-size: 1.1rem;
        color: #666;
        text-align: center;
        margin-bottom: 2rem;
    }
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1.5rem;
        border-radius: 12px;
        color: white;
        text-align: center;
    }
    .result-box {
        background: #f8f9fa;
        border-left: 4px solid #667eea;
        padding: 1.5rem;
        border-radius: 8px;
        margin: 1rem 0;
        color: #1a1a1a;
    }
    .result-box h1, .result-box h2, .result-box h3, .result-box h4, .result-box p, .result-box li, .result-box strong {
        color: #1a1a1a !important;
    }
    .stButton > button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-weight: 600;
        padding: 0.75rem 2rem;
        border-radius: 8px;
        border: none;
        width: 100%;
    }
    .stButton > button:hover {
        background: linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%);
    }
    </style>
    """, unsafe_allow_html=True)
    
    # Header
    st.markdown('<div class="main-header">💰 Project Cost and Effort Estimator (Demo)</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">ML-Powered Estimation with AI-Generated Insights</div>', unsafe_allow_html=True)
    
    # Check model artifacts
    model_exists = Path(MODEL_PATH).exists()
    encoders_exist = Path(ENCODERS_PATH).exists()
    
    if not (model_exists and encoders_exist):
        st.error("⚠️ Model artifacts not found. Please train the model first.")
        st.markdown("""
        ### Setup Instructions:
        1. Ensure the SEERA dataset is in `data/raw/`
        2. Run training: `python src/train_model.py --data "data/raw/SEERA cost estimation dataset.xlsx"`
        3. Restart this application
        """)
        return
    
    # Load model
    try:
        model_artifact, preprocessing = load_model_and_preprocessing()
        model = model_artifact['model']
        model_name = model_artifact.get('model_name', 'XGBRegressor')
        feature_importance = model_artifact.get('feature_importance', {})
        
        st.success(f"✅ Model loaded: {model_name}")
    except Exception as e:
        st.error(f"Failed to load model: {e}")
        logger.exception(e)
        return
    
    # Input Form
    st.markdown("---")
    st.subheader("📊 Project Parameters")
    st.markdown("Provide your project characteristics below to estimate effort and cost.")
    
    # Create form
    with st.form("estimation_form"):
        col1, col2 = st.columns(2)
        
        with col1:
            object_points = st.number_input(
                "🎯 Project Size (Object Points)",
                min_value=1,
                max_value=10000,
                value=100,
                step=10,
                help="Estimated size in object/function points (typical range: 10-5000)"
            )
            
            product_complexity = st.select_slider(
                "🔧 Product Complexity",
                options=[1, 2, 3, 4, 5],
                value=3,
                help="1 = Very Low, 2 = Low, 3 = Medium, 4 = High, 5 = Very High"
            )
            
            performance_requirements = st.select_slider(
                "⚡ Performance Requirements",
                options=[1, 2, 3, 4, 5],
                value=3,
                help="1 = Minimal, 2 = Low, 3 = Moderate, 4 = High, 5 = Critical"
            )
            
            programmer_capability = st.select_slider(
                "👨‍💻 Programmer Capability",
                options=[1, 2, 3, 4, 5],
                value=3,
                help="1 = Low, 2 = Below Average, 3 = Average, 4 = Above Average, 5 = Expert"
            )
        
        with col2:
            pm_experience = st.select_slider(
                "👔 Project Manager Experience",
                options=[1, 2, 3, 4, 5],
                value=3,
                help="1 = Novice, 2 = Junior, 3 = Intermediate, 4 = Senior, 5 = Expert"
            )
            
            team_size = st.number_input(
                "👥 Dedicated Team Size",
                min_value=1,
                max_value=100,
                value=5,
                step=1,
                help="Number of dedicated developers on the project"
            )
            
            requirement_stability = st.select_slider(
                "📋 Requirement Stability",
                options=[1, 2, 3, 4, 5],
                value=3,
                help="1 = Volatile, 2 = Unstable, 3 = Moderate, 4 = Stable, 5 = Fixed"
            )
            
            environment_adequacy = st.select_slider(
                "🖥️ Environment Adequacy",
                options=[1, 2, 3, 4, 5],
                value=3,
                help="1 = Poor, 2 = Below Average, 3 = Adequate, 4 = Good, 5 = Excellent"
            )
        
        # Submit button
        submitted = st.form_submit_button("🚀 Estimate Effort & Cost", use_container_width=True)
    
    # Process estimation
    if submitted:
        with st.spinner("Calculating estimate..."):
            try:
                # Prepare features
                X, input_features = prepare_input_features(
                    object_points=object_points,
                    product_complexity=product_complexity,
                    performance_requirements=performance_requirements,
                    programmer_capability=programmer_capability,
                    pm_experience=pm_experience,
                    team_size=team_size,
                    requirement_stability=requirement_stability,
                    environment_adequacy=environment_adequacy,
                    preprocessing=preprocessing
                )
                
                # Make prediction
                effort_hours = predict_effort(model, X)
                
            except Exception as e:
                st.error(f"Prediction failed: {e}")
                logger.exception(e)
                return
        
        # Display results
        st.markdown("---")
        st.subheader("📈 Estimation Results")
        
        # Derived metrics
        person_months = effort_hours / HOURS_PER_MONTH
        cost_estimate = person_months * DEFAULT_LABOR_RATE
        
        # Metrics display
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.metric(
                label="⏱️ Predicted Effort",
                value=f"{effort_hours:,.0f}",
                delta="person-hours"
            )
        
        with col2:
            st.metric(
                label="📅 Person-Months",
                value=f"{person_months:.1f}",
                delta=f"at {HOURS_PER_MONTH} hrs/month"
            )
        
        with col3:
            st.metric(
                label="💵 Estimated Cost",
                value=f"${cost_estimate:,.0f}",
                delta=f"at ${DEFAULT_LABOR_RATE:,}/month"
            )
        
        # Generate narrative
        st.markdown("---")
        st.subheader("📝 AI-Generated Analysis")
        
        with st.spinner("Generating detailed analysis with Gemini AI..."):
            narrative = generate_gemini_narration(
                effort_hours=effort_hours,
                input_features=input_features,
                feature_importance=feature_importance
            )
        
        st.markdown(f'<div class="result-box">{narrative}</div>', unsafe_allow_html=True)
        
        # Additional details
        with st.expander("🔍 View Input Summary"):
            summary_data = {
                'Parameter': list(FEATURE_DISPLAY_NAMES.values()),
                'Value': [
                    f"{object_points:,}",
                    f"{product_complexity}/5",
                    f"{performance_requirements}/5",
                    f"{programmer_capability}/5",
                    f"{pm_experience}/5",
                    f"{team_size}",
                    f"{requirement_stability}/5",
                    f"{environment_adequacy}/5"
                ]
            }
            st.table(summary_data)
        
        # Export results
        st.markdown("---")
        st.subheader("💾 Export Results")
        
        export_data = {
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'model': model_name,
            'inputs': {
                'object_points': object_points,
                'product_complexity': product_complexity,
                'performance_requirements': performance_requirements,
                'programmer_capability': programmer_capability,
                'pm_experience': pm_experience,
                'team_size': team_size,
                'requirement_stability': requirement_stability,
                'environment_adequacy': environment_adequacy
            },
            'prediction': {
                'effort_person_hours': round(effort_hours, 2),
                'effort_person_months': round(person_months, 2),
                'estimated_cost_usd': round(cost_estimate, 2),
                'labor_rate_per_month': DEFAULT_LABOR_RATE,
                'hours_per_month': HOURS_PER_MONTH
            },
            'narrative': narrative
        }
        
        json_str = json.dumps(export_data, indent=2)
        st.download_button(
            label="📥 Download Estimate (JSON)",
            data=json_str,
            file_name=f"effort_estimate_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
            mime="application/json"
        )


if __name__ == '__main__':
    main()
