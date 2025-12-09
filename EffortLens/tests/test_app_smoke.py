"""Smoke tests for app.py - EffortLens Streamlit application."""

import pytest


def test_import_app():
    """Test that app.py can be imported without errors."""
    try:
        from src import app
        assert True
    except ImportError as e:
        pytest.fail(f"Failed to import app: {e}")


def test_import_utils():
    """Test that utils.py can be imported."""
    try:
        from src import utils
        assert True
    except ImportError as e:
        pytest.fail(f"Failed to import utils: {e}")


def test_import_train_model():
    """Test that train_model.py can be imported."""
    try:
        from src import train_model
        assert True
    except ImportError as e:
        pytest.fail(f"Failed to import train_model: {e}")


def test_utils_cost_calculation():
    """Test cost calculation utility function."""
    from src.utils import calculate_cost_estimate
    
    result = calculate_cost_estimate(1600)  # 1600 person-hours
    
    assert 'effort_hours' in result
    assert 'person_months' in result
    assert 'total_cost' in result
    assert result['effort_hours'] == 1600
    assert result['person_months'] == 10.0  # 1600 / 160


def test_utils_identify_risk_factors():
    """Test risk factor identification."""
    from src.utils import identify_risk_factors
    
    input_features = {
        'programmer_capability': 2,  # Low - should be flagged
        'pm_experience': 4,  # OK
        'requirement_stability': 1,  # Very low - should be flagged
        'environment_adequacy': 3  # OK
    }
    
    risks = identify_risk_factors(input_features, threshold=2.5)
    
    assert len(risks) >= 2
    assert any('programmer_capability' in r[0] for r in risks)
    assert any('requirement_stability' in r[0] for r in risks)


def test_utils_format_currency():
    """Test currency formatting."""
    from src.utils import format_currency
    
    result = format_currency(100000)
    
    assert '$' in result
    assert '100,000' in result


def test_utils_format_effort():
    """Test effort formatting."""
    from src.utils import format_effort
    
    result = format_effort(1600)
    
    assert '1,600' in result
    assert 'person-hours' in result
    assert 'person-months' in result


def test_train_model_constants():
    """Test that train_model has required constants."""
    from src.train_model import FEATURE_COLUMNS, TARGET_COLUMN
    
    assert len(FEATURE_COLUMNS) == 8
    assert TARGET_COLUMN == 'Actual effort'


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
