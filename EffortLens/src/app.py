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
import plotly.graph_objects as go
import plotly.express as px
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ========== Configuration ==========

MODEL_PATH = os.getenv('ECON_MODEL_PATH', './models/model.joblib')
ENCODERS_PATH = os.getenv('ECON_ENCODERS_PATH', './models/encoders.joblib')

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


# ========== Template-Based Narrative Generation ==========

import random

# 5 Different narrative templates for variety (using HTML for proper rendering)
NARRATIVE_TEMPLATES = [
    # Template 1: Professional & Formal
    """<h3 style="color: #1E3A5F; margin-bottom: 15px;">📊 AI-Powered Project Effort and Cost Forecast</h3>

<h4 style="color: #2C5282; margin-top: 20px;">Effort Summary</h4>
<p>Based on your project parameters, the estimated development effort is <strong>{effort_hours:,.0f} person-hours</strong>, which translates to approximately <strong>{person_months:.1f} person-months</strong> of work (calculated at {hours_per_month} working hours per month).</p>

<h4 style="color: #2C5282; margin-top: 20px;">Cost Interpretation</h4>
<p>Applying an industry-standard labor rate of <strong>${labor_rate:,}</strong> per person-month, the projected cost is <strong>${cost_estimate:,.0f}</strong>.</p>
<p>Accounting for typical project variance (±20%), budget planning should consider a range of <strong>${cost_low:,.0f}</strong> to <strong>${cost_high:,.0f}</strong>.</p>

<h4 style="color: #2C5282; margin-top: 20px;">Key Drivers</h4>
<p>{driver_text}</p>

<h4 style="color: #2C5282; margin-top: 20px;">💡 Actionable Recommendation</h4>
<p style="background: #EBF8FF; padding: 12px; border-radius: 6px; border-left: 4px solid #3182CE;">{recommendation}</p>""",

    # Template 2: Executive Summary Style
    """<h3 style="color: #1E3A5F; margin-bottom: 15px;">📋 Project Estimation Report</h3>

<p style="background: #F0FFF4; padding: 15px; border-radius: 8px; margin-bottom: 15px; font-size: 16px;"><strong style="color: #276749;">📊 Executive Summary:</strong> This analysis predicts <strong>{effort_hours:,.0f} person-hours</strong> (~{person_months:.1f} person-months) of development effort, with an estimated budget of <strong>${cost_estimate:,.0f}</strong>.</p>

<h4 style="color: #2C5282; margin-top: 20px;">💰 Financial Overview</h4>
<table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
    <tr style="background: #EDF2F7;">
        <td style="padding: 10px; border: 1px solid #CBD5E0;"><strong>Base Estimate</strong></td>
        <td style="padding: 10px; border: 1px solid #CBD5E0;">${cost_estimate:,.0f}</td>
    </tr>
    <tr>
        <td style="padding: 10px; border: 1px solid #CBD5E0;"><strong>Budget Range</strong></td>
        <td style="padding: 10px; border: 1px solid #CBD5E0;">${cost_low:,.0f} - ${cost_high:,.0f}</td>
    </tr>
    <tr style="background: #EDF2F7;">
        <td style="padding: 10px; border: 1px solid #CBD5E0;"><strong>Rate Applied</strong></td>
        <td style="padding: 10px; border: 1px solid #CBD5E0;">${labor_rate:,}/person-month</td>
    </tr>
</table>

<h4 style="color: #2C5282; margin-top: 20px;">🎯 Critical Factors</h4>
<p>{driver_text}</p>

<h4 style="color: #2C5282; margin-top: 20px;">✅ Recommended Action</h4>
<p style="background: #F0FFF4; padding: 12px; border-radius: 6px; border-left: 4px solid #48BB78;">{recommendation}</p>""",

    # Template 3: Detailed Technical
    """<h3 style="color: #1E3A5F; margin-bottom: 15px;">🔬 Comprehensive Effort Analysis</h3>

<h4 style="color: #2C5282; margin-top: 20px;">Metrics Breakdown</h4>
<p>The model predicts a total effort of <strong>{effort_hours:,.0f} person-hours</strong>. For a team working standard {hours_per_month}-hour months, this equates to <strong>{person_months:.1f} person-months</strong> of dedicated development time.</p>

<h4 style="color: #2C5282; margin-top: 20px;">Budget Projection</h4>
<p>Using the baseline rate of <strong>${labor_rate:,}/person-month</strong>:</p>
<ul style="list-style: none; padding-left: 0;">
    <li style="padding: 8px 0; border-bottom: 1px solid #E2E8F0;">📌 <strong>Point Estimate:</strong> ${cost_estimate:,.0f}</li>
    <li style="padding: 8px 0; border-bottom: 1px solid #E2E8F0;">📉 <strong>Lower Bound (-20%):</strong> ${cost_low:,.0f}</li>
    <li style="padding: 8px 0;">📈 <strong>Upper Bound (+20%):</strong> ${cost_high:,.0f}</li>
</ul>

<h4 style="color: #2C5282; margin-top: 20px;">Influencing Factors</h4>
<p>{driver_text}</p>

<h4 style="color: #2C5282; margin-top: 20px;">🎯 Strategic Recommendation</h4>
<p style="background: #FFF5F5; padding: 12px; border-radius: 6px; border-left: 4px solid #E53E3E;">{recommendation}</p>""",

    # Template 4: Concise & Action-Oriented
    """<h3 style="color: #1E3A5F; margin-bottom: 15px;">⚡ Quick Forecast Summary</h3>

<p style="display: inline-block; width: 48%; background: #EBF8FF; padding: 15px; border-radius: 8px; text-align: center; vertical-align: top; margin-right: 2%;"><span style="color: #2B6CB0; font-size: 14px;">⏱️ EFFORT</span><br/><strong style="font-size: 20px; color: #1A365D;">{effort_hours:,.0f} hours</strong><br/><span style="color: #4A5568; font-size: 12px;">({person_months:.1f} person-months)</span></p>

<p style="display: inline-block; width: 48%; background: #F0FFF4; padding: 15px; border-radius: 8px; text-align: center; vertical-align: top;"><span style="color: #276749; font-size: 14px;">💵 COST</span><br/><strong style="font-size: 20px; color: #22543D;">${cost_estimate:,.0f}</strong><br/><span style="color: #4A5568; font-size: 12px;">(${cost_low:,.0f} - ${cost_high:,.0f})</span></p>

<h4 style="color: #2C5282; margin-top: 20px;">📈 Analysis</h4>
<p>{driver_text}</p>

<h4 style="color: #2C5282; margin-top: 20px;">💡 Key Takeaway</h4>
<p style="background: #FFFAF0; padding: 12px; border-radius: 6px; border-left: 4px solid #DD6B20;">{recommendation}</p>""",

    # Template 5: Narrative Style
    """<h3 style="color: #1E3A5F; margin-bottom: 15px;">📝 Project Feasibility Assessment</h3>

<p style="background: #F7FAFC; padding: 15px; border-radius: 8px; line-height: 1.8;">Based on the provided specifications, your project is estimated to require <strong>{effort_hours:,.0f} person-hours</strong> of development work. When distributed across standard working months ({hours_per_month} hours each), this represents approximately <strong>{person_months:.1f} person-months</strong> of effort.</p>

<p style="background: #F7FAFC; padding: 15px; border-radius: 8px; line-height: 1.8; margin-top: 10px;">From a budgetary perspective, at <strong>${labor_rate:,}</strong> per person-month, you should plan for approximately <strong>${cost_estimate:,.0f}</strong> in development costs. Industry best practice suggests maintaining a contingency buffer, so consider a working range of <strong>${cost_low:,.0f}</strong> to <strong>${cost_high:,.0f}</strong>.</p>

<h4 style="color: #2C5282; margin-top: 20px;">🔍 Key Observations</h4>
<p>{driver_text}</p>

<h4 style="color: #2C5282; margin-top: 20px;">✨ Our Recommendation</h4>
<p style="background: #FAF5FF; padding: 12px; border-radius: 6px; border-left: 4px solid #805AD5;">{recommendation}</p>"""
]

# Risk-based recommendations mapping
RECOMMENDATIONS = {
    'Programmer Capability': "Consider investing in team training programs or augmenting the team with experienced developers to mitigate skill-gap risks and reduce potential delivery delays.",
    'Project Manager Experience': "Engage a senior project manager as a mentor or consider bringing in experienced PM support to strengthen project governance and risk management.",
    'Requirement Stability': "Prioritize stakeholder alignment workshops and implement formal change control procedures to minimize scope creep and rework.",
    'Environment Adequacy': "Invest in development infrastructure, CI/CD pipelines, and modern tooling to enhance team productivity and code quality.",
    'Product Complexity': "Break down the project into smaller, well-defined phases with clear milestones to manage complexity and enable iterative delivery.",
    'Performance Requirements': "Allocate dedicated time for performance testing, optimization, and load testing to ensure the system meets its performance targets."
}

DEFAULT_RECOMMENDATIONS = [
    "Maintain clear scope definition and conduct regular progress reviews to ensure alignment with project goals.",
    "Implement agile practices with sprint retrospectives to continuously improve team efficiency and delivery.",
    "Establish clear communication channels between stakeholders and the development team to prevent misunderstandings.",
    "Create detailed technical documentation early to reduce onboarding time and knowledge silos.",
    "Set up automated testing and quality gates to catch issues early and maintain code quality."
]


def generate_narrative(
    effort_hours: float,
    input_features: Dict[str, float],
    feature_importance: Dict[str, float]
) -> str:
    """
    Generate humanized narrative using template system (no API required).
    
    Randomly selects from 5 templates and fills in the prediction data.
    
    Args:
        effort_hours: Predicted effort in person-hours
        input_features: Dictionary of input feature values
        feature_importance: Dictionary of feature importance scores
        
    Returns:
        Formatted narrative text
    """
    # Calculate derived values
    person_months = effort_hours / HOURS_PER_MONTH
    cost_estimate = person_months * DEFAULT_LABOR_RATE
    cost_low = cost_estimate * 0.8
    cost_high = cost_estimate * 1.2
    
    # Analyze input features for risks and drivers
    risk_features = []
    positive_features = []
    
    slider_features = ['product_complexity', 'performance_requirements', 'programmer_capability',
                       'pm_experience', 'requirement_stability', 'environment_adequacy']
    
    for feat in slider_features:
        display_name = FEATURE_DISPLAY_NAMES.get(feat, feat)
        value = input_features.get(feat, 3)
        
        if value <= 2:
            risk_features.append((display_name, value))
        elif value >= 4:
            positive_features.append((display_name, value))
    
    # Build driver text based on analysis
    driver_text = _build_driver_text(input_features, risk_features, positive_features, feature_importance)
    
    # Select recommendation based on lowest scoring feature
    recommendation = _select_recommendation(risk_features)
    
    # Randomly select a template
    template = random.choice(NARRATIVE_TEMPLATES)
    
    # Fill in the template
    narrative = template.format(
        effort_hours=effort_hours,
        person_months=person_months,
        cost_estimate=cost_estimate,
        cost_low=cost_low,
        cost_high=cost_high,
        hours_per_month=HOURS_PER_MONTH,
        labor_rate=DEFAULT_LABOR_RATE,
        driver_text=driver_text,
        recommendation=recommendation
    )
    
    return narrative


def _build_driver_text(
    input_features: Dict,
    risk_features: list,
    positive_features: list,
    feature_importance: Dict
) -> str:
    """Build the key drivers text section."""
    
    parts = []
    
    # Mention team size and object points as primary drivers
    team_size = input_features.get('team_size', 0)
    object_points = input_features.get('object_points', 0)
    
    if team_size > 0:
        parts.append(f"Team size ({team_size:.0f} developers) is a significant factor in the estimation")
    
    if object_points > 0:
        if object_points > 300:
            parts.append(f"the high object point count ({object_points:.0f}) indicates substantial project scope")
        elif object_points < 100:
            parts.append(f"the moderate object point count ({object_points:.0f}) suggests manageable scope")
        else:
            parts.append(f"object points ({object_points:.0f}) reflect the project's functional complexity")
    
    # Mention risk factors
    if risk_features:
        lowest_risk = min(risk_features, key=lambda x: x[1])
        parts.append(f"<strong>{lowest_risk[0]}</strong> (scored {lowest_risk[1]}/5) may be contributing to elevated effort estimates")
    
    # Mention positive factors
    if positive_features and not risk_features:
        highest_positive = max(positive_features, key=lambda x: x[1])
        parts.append(f"strong {highest_positive[0]} (scored {highest_positive[1]}/5) is a positive factor")
    
    if not parts:
        return "The estimate is based on balanced project parameters with no significant risk factors identified."
    
    # Join with proper grammar
    if len(parts) == 1:
        return parts[0].capitalize() + "."
    elif len(parts) == 2:
        return parts[0].capitalize() + ", and " + parts[1] + "."
    else:
        return parts[0].capitalize() + "; " + "; ".join(parts[1:-1]) + "; and " + parts[-1] + "."


def _select_recommendation(risk_features: list) -> str:
    """Select an appropriate recommendation based on risk features."""
    
    if risk_features:
        # Get the lowest scoring feature
        lowest = min(risk_features, key=lambda x: x[1])
        feature_name = lowest[0]
        
        # Return specific recommendation if available
        if feature_name in RECOMMENDATIONS:
            return RECOMMENDATIONS[feature_name]
    
    # Return a random default recommendation
    return random.choice(DEFAULT_RECOMMENDATIONS)


# ========== Dynamic Visualization Functions ==========

def create_radar_chart(input_features: Dict[str, float]) -> go.Figure:
    """
    Create a radar chart showing the project parameter profile.
    
    Args:
        input_features: Dictionary of input feature values
        
    Returns:
        Plotly figure object
    """
    # Get slider-based features (1-5 scale) for radar
    categories = [
        'Product Complexity',
        'Performance Req.',
        'Programmer Capability',
        'PM Experience',
        'Requirement Stability',
        'Environment Adequacy'
    ]
    
    values = [
        input_features.get('product_complexity', 3),
        input_features.get('performance_requirements', 3),
        input_features.get('programmer_capability', 3),
        input_features.get('pm_experience', 3),
        input_features.get('requirement_stability', 3),
        input_features.get('environment_adequacy', 3)
    ]
    
    # Close the radar chart
    categories_closed = categories + [categories[0]]
    values_closed = values + [values[0]]
    
    fig = go.Figure()
    
    # Add the radar trace
    fig.add_trace(go.Scatterpolar(
        r=values_closed,
        theta=categories_closed,
        fill='toself',
        fillcolor='rgba(102, 126, 234, 0.3)',
        line=dict(color='#667eea', width=2),
        name='Your Project',
        hovertemplate='%{theta}: %{r}/5<extra></extra>'
    ))
    
    # Add ideal benchmark (all 5s)
    ideal_values = [5] * len(categories) + [5]
    fig.add_trace(go.Scatterpolar(
        r=ideal_values,
        theta=categories_closed,
        fill='none',
        line=dict(color='#48BB78', width=1, dash='dash'),
        name='Ideal (5/5)',
        hovertemplate='%{theta}: %{r}/5<extra></extra>'
    ))
    
    fig.update_layout(
        polar=dict(
            radialaxis=dict(
                visible=True,
                range=[0, 5],
                tickvals=[1, 2, 3, 4, 5],
                ticktext=['1', '2', '3', '4', '5'],
                gridcolor='rgba(0,0,0,0.1)'
            ),
            angularaxis=dict(
                gridcolor='rgba(0,0,0,0.1)'
            ),
            bgcolor='rgba(0,0,0,0)'
        ),
        showlegend=True,
        legend=dict(
            orientation='h',
            yanchor='bottom',
            y=-0.2,
            xanchor='center',
            x=0.5
        ),
        margin=dict(l=60, r=60, t=40, b=60),
        height=400,
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)'
    )
    
    return fig


def create_feature_importance_chart(feature_importance: Dict[str, float], input_features: Dict[str, float]) -> go.Figure:
    """
    Create a horizontal bar chart showing feature importance with user values.
    
    Args:
        feature_importance: Dictionary of feature importance scores
        input_features: Dictionary of user input values
        
    Returns:
        Plotly figure object
    """
    # Map feature names to display names
    display_mapping = {
        'Object points': 'Project Size',
        'Product complexity': 'Product Complexity',
        'Performance requirements': 'Performance Req.',
        'Programmers capability ': 'Programmer Capability',
        'Project manager experience': 'PM Experience',
        'Team size': 'Team Size',
        'Requirment stability': 'Requirement Stability',
        'Development environment adequacy': 'Environment Adequacy'
    }
    
    # Sort by importance
    sorted_features = sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)
    
    names = [display_mapping.get(f[0], f[0]) for f in sorted_features]
    importances = [f[1] for f in sorted_features]
    
    # Create color gradient based on importance
    colors = ['#667eea' if imp > 0.1 else '#a0aec0' for imp in importances]
    
    fig = go.Figure()
    
    fig.add_trace(go.Bar(
        y=names,
        x=importances,
        orientation='h',
        marker=dict(
            color=importances,
            colorscale=[[0, '#a0aec0'], [0.5, '#667eea'], [1, '#764ba2']],
            line=dict(width=0)
        ),
        hovertemplate='%{y}<br>Importance: %{x:.1%}<extra></extra>'
    ))
    
    fig.update_layout(
        xaxis=dict(
            title='Relative Importance',
            tickformat='.0%',
            gridcolor='rgba(0,0,0,0.1)',
            range=[0, max(importances) * 1.1]
        ),
        yaxis=dict(
            title='',
            autorange='reversed'
        ),
        margin=dict(l=130, r=20, t=20, b=40),
        height=350,
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)'
    )
    
    return fig


def create_cost_breakdown_chart(cost_estimate: float) -> go.Figure:
    """
    Create a gauge chart showing cost estimate with range.
    
    Args:
        cost_estimate: Base cost estimate in USD
        
    Returns:
        Plotly figure object
    """
    cost_low = cost_estimate * 0.8
    cost_high = cost_estimate * 1.2
    
    fig = go.Figure(go.Indicator(
        mode="gauge+number+delta",
        value=cost_estimate,
        number={'prefix': "$", 'valueformat': ',.0f'},
        delta={'reference': cost_low, 'relative': False, 'valueformat': ',.0f', 'prefix': '+$'},
        gauge={
            'axis': {
                'range': [0, cost_high * 1.2],
                'tickformat': '$,.0f',
                'tickmode': 'array',
                'tickvals': [0, cost_low, cost_estimate, cost_high],
                'ticktext': ['$0', f'${cost_low:,.0f}', f'${cost_estimate:,.0f}', f'${cost_high:,.0f}']
            },
            'bar': {'color': '#667eea'},
            'steps': [
                {'range': [0, cost_low], 'color': '#C6F6D5'},
                {'range': [cost_low, cost_estimate], 'color': '#F6E05E'},
                {'range': [cost_estimate, cost_high], 'color': '#FEB2B2'},
                {'range': [cost_high, cost_high * 1.2], 'color': '#FC8181'}
            ],
            'threshold': {
                'line': {'color': '#1E3A5F', 'width': 4},
                'thickness': 0.75,
                'value': cost_estimate
            }
        },
        title={'text': "Budget Estimate Range", 'font': {'size': 16}}
    ))
    
    fig.update_layout(
        height=300,
        margin=dict(l=30, r=30, t=60, b=30),
        paper_bgcolor='rgba(0,0,0,0)'
    )
    
    return fig


def create_effort_comparison_chart(effort_hours: float, team_size: int) -> go.Figure:
    """
    Create a chart showing effort distribution over different team configurations.
    
    Args:
        effort_hours: Predicted effort in person-hours
        team_size: Number of team members
        
    Returns:
        Plotly figure object
    """
    # Calculate duration for different team sizes
    team_sizes = [max(1, team_size - 2), max(1, team_size - 1), team_size, team_size + 1, team_size + 2]
    team_sizes = sorted(set([t for t in team_sizes if t >= 1]))  # Remove duplicates and negatives
    
    # Estimate duration (months) for each team size
    # Using simple formula: duration = effort / (team_size * hours_per_month)
    durations = [effort_hours / (t * HOURS_PER_MONTH) for t in team_sizes]
    
    # Highlight current team size
    colors = ['#667eea' if t == team_size else '#a0aec0' for t in team_sizes]
    
    fig = go.Figure()
    
    fig.add_trace(go.Bar(
        x=[f"{t} devs" for t in team_sizes],
        y=durations,
        marker_color=colors,
        text=[f"{d:.1f} mo" for d in durations],
        textposition='outside',
        hovertemplate='Team: %{x}<br>Duration: %{y:.1f} months<extra></extra>'
    ))
    
    fig.update_layout(
        xaxis=dict(title='Team Size'),
        yaxis=dict(title='Project Duration (months)', gridcolor='rgba(0,0,0,0.1)'),
        margin=dict(l=60, r=20, t=20, b=60),
        height=300,
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        showlegend=False
    )
    
    return fig


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
        background: #ffffff;
        border-left: 4px solid #667eea;
        padding: 1.5rem 2rem;
        border-radius: 8px;
        margin: 1rem 0;
        color: #1a1a1a;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .result-box h3 {
        margin-top: 0;
        margin-bottom: 1rem;
        font-size: 1.4rem;
    }
    .result-box h4 {
        margin-top: 1.2rem;
        margin-bottom: 0.5rem;
        font-size: 1.1rem;
    }
    .result-box p {
        margin: 0.5rem 0;
        line-height: 1.6;
        color: #333;
    }
    .result-box ul {
        margin: 0.5rem 0;
        padding-left: 1.5rem;
    }
    .result-box li {
        margin: 0.3rem 0;
        line-height: 1.5;
        color: #333;
    }
    .result-box strong {
        color: #1E3A5F;
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
        
        narrative = generate_narrative(
            effort_hours=effort_hours,
            input_features=input_features,
            feature_importance=feature_importance
        )
        
        st.markdown(f'<div class="result-box">{narrative}</div>', unsafe_allow_html=True)
        
        # ========== Dynamic Visualizations ==========
        st.markdown("---")
        st.subheader("📊 Visual Analytics")
        
        # Row 1: Radar Chart and Feature Importance
        viz_col1, viz_col2 = st.columns(2)
        
        with viz_col1:
            st.markdown("##### 🎯 Project Parameter Profile")
            st.markdown("*Compare your project parameters against ideal values*")
            radar_fig = create_radar_chart(input_features)
            st.plotly_chart(radar_fig, use_container_width=True, key="radar_chart")
        
        with viz_col2:
            st.markdown("##### 📈 Feature Importance")
            st.markdown("*Which factors most influence effort predictions*")
            importance_fig = create_feature_importance_chart(feature_importance, input_features)
            st.plotly_chart(importance_fig, use_container_width=True, key="importance_chart")
        
        # Row 2: Cost Gauge and Duration by Team Size
        viz_col3, viz_col4 = st.columns(2)
        
        with viz_col3:
            st.markdown("##### 💰 Budget Estimate Range")
            st.markdown("*Cost estimate with ±20% contingency range*")
            cost_fig = create_cost_breakdown_chart(cost_estimate)
            st.plotly_chart(cost_fig, use_container_width=True, key="cost_gauge")
        
        with viz_col4:
            st.markdown("##### ⏱️ Duration by Team Size")
            st.markdown("*How team size affects project duration*")
            duration_fig = create_effort_comparison_chart(effort_hours, team_size)
            st.plotly_chart(duration_fig, use_container_width=True, key="duration_chart")
        
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
