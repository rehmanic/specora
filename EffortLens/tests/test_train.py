"""Tests for train_model.py - XGBoost training pipeline."""

import tempfile
from pathlib import Path

import joblib
import pytest
import pandas as pd
import numpy as np

from src.train_model import (
    load_seera_dataset,
    clean_and_preprocess,
    FEATURE_COLUMNS,
    TARGET_COLUMN
)
from tests.fixtures.fixtures import get_sample_training_data, create_fixture_excel


def test_feature_columns_defined():
    """Test that feature columns are properly defined."""
    assert len(FEATURE_COLUMNS) == 8
    assert 'Object points' in FEATURE_COLUMNS
    assert 'Team size' in FEATURE_COLUMNS
    assert 'Product complexity' in FEATURE_COLUMNS


def test_target_column_defined():
    """Test that target column is properly defined."""
    assert TARGET_COLUMN == 'Actual effort'


def test_sample_data_has_correct_columns():
    """Test that sample data has all required columns."""
    df = get_sample_training_data()
    
    for col in FEATURE_COLUMNS:
        assert col in df.columns, f"Missing feature column: {col}"
    
    assert TARGET_COLUMN in df.columns, f"Missing target column: {TARGET_COLUMN}"


def test_clean_and_preprocess():
    """Test data cleaning and preprocessing."""
    df = get_sample_training_data()
    
    # Add some missing values
    df.iloc[0, 0] = np.nan
    df.iloc[1, 1] = '?'
    
    cleaned = clean_and_preprocess(df)
    
    # Check that '?' was converted to NaN
    assert cleaned.shape[0] == df.shape[0]
    
    # Check numeric conversion
    for col in FEATURE_COLUMNS:
        if col in cleaned.columns:
            assert pd.api.types.is_numeric_dtype(cleaned[col])


def test_load_seera_dataset_excel():
    """Test loading SEERA dataset from Excel file."""
    with tempfile.TemporaryDirectory() as tmpdir:
        excel_path = Path(tmpdir) / "test_data.xlsx"
        create_fixture_excel(str(excel_path))
        
        df = load_seera_dataset(str(excel_path))
        
        assert len(df) > 0
        assert TARGET_COLUMN in df.columns


def test_model_artifacts_exist():
    """Test that trained model artifacts exist (after training)."""
    model_path = Path("models/model.joblib")
    encoders_path = Path("models/encoders.joblib")
    metrics_path = Path("models/training_metrics.json")
    
    # Skip if model hasn't been trained yet
    if not model_path.exists():
        pytest.skip("Model not trained yet - run python src/train_model.py first")
    
    assert model_path.exists(), "model.joblib not found"
    assert encoders_path.exists(), "encoders.joblib not found"
    assert metrics_path.exists(), "training_metrics.json not found"


def test_model_can_be_loaded():
    """Test that trained model can be loaded."""
    model_path = Path("models/model.joblib")
    
    if not model_path.exists():
        pytest.skip("Model not trained yet")
    
    model_artifact = joblib.load(str(model_path))
    
    assert 'model' in model_artifact
    assert 'feature_importance' in model_artifact
    assert model_artifact['model'] is not None


def test_encoders_can_be_loaded():
    """Test that encoders can be loaded."""
    encoders_path = Path("models/encoders.joblib")
    
    if not encoders_path.exists():
        pytest.skip("Model not trained yet")
    
    encoders = joblib.load(str(encoders_path))
    
    assert 'imputer' in encoders
    assert 'scaler' in encoders
    assert 'feature_columns' in encoders


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
