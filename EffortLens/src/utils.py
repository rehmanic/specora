#!/usr/bin/env python3
"""
Utility functions for EffortLens - Project Cost and Effort Estimator.

This module provides utility functions for the ML-based effort estimation system.
Uses template-based narrative generation (no external API required).
"""

import logging
from typing import Dict, Optional

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ========== Cost Calculation Utilities ==========

def calculate_cost_estimate(
    effort_hours: float,
    hourly_rate: float = 62.5,  # ~$10,000/month at 160 hrs
    hours_per_month: int = 160
) -> Dict[str, float]:
    """
    Calculate cost estimates from effort in person-hours.
    
    Args:
        effort_hours: Predicted effort in person-hours
        hourly_rate: Cost per hour (default ~$62.5 = $10K/month)
        hours_per_month: Standard hours per month
        
    Returns:
        Dictionary with cost metrics
    """
    person_months = effort_hours / hours_per_month
    total_cost = effort_hours * hourly_rate
    
    # Calculate range (+/- 20%)
    cost_low = total_cost * 0.8
    cost_high = total_cost * 1.2
    
    return {
        'effort_hours': effort_hours,
        'person_months': person_months,
        'hourly_rate': hourly_rate,
        'total_cost': total_cost,
        'cost_low': cost_low,
        'cost_high': cost_high,
        'cost_per_month': hourly_rate * hours_per_month
    }


def format_currency(amount: float, currency: str = 'USD') -> str:
    """Format amount as currency string."""
    if currency == 'USD':
        return f"${amount:,.0f}"
    return f"{amount:,.0f} {currency}"


def format_effort(hours: float) -> str:
    """Format effort hours with person-months conversion."""
    person_months = hours / 160
    return f"{hours:,.0f} person-hours ({person_months:.1f} person-months)"


# ========== Feature Analysis Utilities ==========

def identify_risk_factors(
    input_features: Dict[str, float],
    threshold: float = 2.5
) -> list:
    """
    Identify risk factors from input features.
    
    Args:
        input_features: Dictionary of input feature values
        threshold: Value below which a feature is considered a risk
        
    Returns:
        List of (feature_name, value, risk_description) tuples
    """
    risk_mapping = {
        'programmer_capability': "Low programmer capability may extend timeline",
        'pm_experience': "Limited PM experience increases delivery risk",
        'requirement_stability': "Unstable requirements lead to scope creep",
        'environment_adequacy': "Poor tooling reduces productivity"
    }
    
    risks = []
    for feature, description in risk_mapping.items():
        value = input_features.get(feature, 3)
        if value <= threshold:
            risks.append((feature, value, description))
    
    return sorted(risks, key=lambda x: x[1])


def identify_key_drivers(
    feature_importance: Dict[str, float],
    input_features: Dict[str, float],
    top_n: int = 3
) -> list:
    """
    Identify the top feature drivers affecting the estimate.
    
    Args:
        feature_importance: Model feature importance scores
        input_features: User input feature values
        top_n: Number of top drivers to return
        
    Returns:
        List of (feature_name, importance, value) tuples
    """
    if not feature_importance:
        return []
    
    # Sort by importance
    sorted_features = sorted(
        feature_importance.items(),
        key=lambda x: x[1],
        reverse=True
    )
    
    drivers = []
    for feature, importance in sorted_features[:top_n]:
        # Map model feature names to input feature names
        feature_key = feature.lower().replace(' ', '_').rstrip('_')
        value = input_features.get(feature_key, 'N/A')
        drivers.append((feature, importance, value))
    
    return drivers


# ========== Validation Utilities ==========

def validate_input_features(
    object_points: float,
    team_size: int,
    slider_values: Dict[str, int]
) -> tuple:
    """
    Validate input features and return any warnings.
    
    Returns:
        Tuple of (is_valid, warnings_list)
    """
    warnings = []
    
    if object_points < 1:
        warnings.append("Object points should be at least 1")
    elif object_points > 10000:
        warnings.append("Very high object points (>10000) - estimate may be unreliable")
    
    if team_size < 1:
        warnings.append("Team size should be at least 1")
    elif team_size > 50:
        warnings.append("Large team size (>50) - coordination overhead may affect accuracy")
    
    # Check slider values
    for name, value in slider_values.items():
        if value < 1 or value > 5:
            warnings.append(f"{name} should be between 1 and 5")
    
    return len(warnings) == 0, warnings


# ========== Narrative Generation ==========

def generate_effort_narrative_prompt(
    effort_hours: float,
    input_features: Dict[str, float],
    feature_importance: Dict[str, float] = None
) -> str:
    """
    Generate a prompt for narrative generation (legacy function - now uses templates).
    
    Note: This function is kept for backward compatibility but the app now uses
    template-based narrative generation instead of external API calls.
    
    Args:
        effort_hours: Predicted effort
        input_features: User input values
        feature_importance: Optional model feature importance
        
    Returns:
        Formatted prompt string
    """
    cost_data = calculate_cost_estimate(effort_hours)
    risks = identify_risk_factors(input_features)
    
    risk_text = ""
    if risks:
        risk_text = f"RISK FACTORS: {', '.join([f'{r[0]} ({r[1]}/5)' for r in risks])}"
    
    prompt = f"""You are an AI Project Cost Estimation Assistant. Generate a professional narrative.

PREDICTION DATA:
- Effort: {effort_hours:.0f} person-hours ({cost_data['person_months']:.1f} person-months)
- Cost Range: {format_currency(cost_data['cost_low'])} to {format_currency(cost_data['cost_high'])}
- Labor Rate: {format_currency(cost_data['cost_per_month'])}/person-month
{risk_text}

REQUIRED OUTPUT STRUCTURE:

**AI-Powered Project Effort and Cost Forecast**

**Effort Summary:**
State **{effort_hours:.0f} person-hours** in bold. Convert to person-months.

**Cost Interpretation:**
Cost = effort x rate. Range: {format_currency(cost_data['cost_low'])} to {format_currency(cost_data['cost_high'])}.

**Key Drivers:**
1-2 factors influencing the estimate.

**Actionable Recommendation:**
One specific action to mitigate risk.

Keep it professional, concise, and actionable."""

    return prompt
    lines = []
    
    lines.append("## Economic Feasibility Analysis\n")
    
    lines.append("### Executive Summary")
    lines.append(f"Based on analysis of {len(retrieved_chunks)} similar historical projects, the estimated effort is {estimate:.2f} {unit} (range: {low:.2f} - {high:.2f}).")
    
    if estimate < 1000:
        lines.append("**Recommendation**: Proceed - project appears feasible with moderate effort.")
    elif estimate < 5000:
        lines.append("**Recommendation**: Proceed with caution - ensure adequate resources and planning.")
    else:
        lines.append("**Recommendation**: More information needed - high effort estimate requires detailed scoping.")
    
    lines.append("\n### Key Assumptions")
    lines.append(f"- Estimated size: {features_used.get('estimated_size', 'N/A')}")
    lines.append(f"- Team size: {features_used.get('team_size', 'N/A')}")
    lines.append(f"- Development type: {features_used.get('development_type', 'N/A')}")
    lines.append(f"- Domain: {features_used.get('application_domain', 'N/A')}")
    
    lines.append("\n### Estimates")
    lines.append(f"- **Low**: {low:.2f} {unit}")
    lines.append(f"- **Typical**: {estimate:.2f} {unit}")
    lines.append(f"- **High**: {high:.2f} {unit}")
    
    lines.append("\n### Main Risks")
    lines.append("- Requirement changes may impact effort significantly")
    lines.append("- Team experience and maturity affect productivity")
    lines.append("- External dependencies and integrations may introduce delays")
    
    lines.append("\n### Retrieved Analogs")
    for i, chunk_data in enumerate(retrieved_chunks[:5]):
        proj_id = chunk_data.get('project_id', 'Unknown')
        est_effort = chunk_data.get('estimated_effort', 'N/A')
        score = chunk_data.get('score', 0.0)
        lines.append(f"{i+1}. ProjectID: {proj_id}, Estimated Effort: {est_effort}, Similarity: {score:.3f}")
    
    lines.append("\n### Next Steps")
    lines.append("- Refine requirements and validate assumptions")
    lines.append("- Review team capacity and skills")
    lines.append("- Conduct detailed technical feasibility study")
    
    return "\n".join(lines)


# ========== Helpers ==========

def parse_llm_json_response(response_text: str) -> Optional[dict]:
    """
    Parse LLM response as JSON, handling markdown code blocks.
    
    Returns:
        Parsed JSON dictionary or None
    """
    import json
    
    # Strip markdown code blocks
    text = response_text.strip()
    if text.startswith('```'):
        text = text.split('```')[1]
        if text.startswith('json'):
            text = text[4:]
        text = text.strip()
    
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse LLM JSON response: {e}")
        return None
