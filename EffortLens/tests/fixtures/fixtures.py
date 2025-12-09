"""Test fixtures for EffortLens tests."""

import pandas as pd
import numpy as np
from pathlib import Path


def get_sample_training_data() -> pd.DataFrame:
    """
    Get sample SEERA-like training data with the 8 key features.
    
    Returns:
        DataFrame with sample training data matching SEERA structure
    """
    np.random.seed(42)
    n_samples = 20
    
    data = {
        'Object points': np.random.randint(50, 500, n_samples),
        'Product complexity': np.random.randint(1, 6, n_samples),
        'Performance requirements': np.random.randint(1, 6, n_samples),
        'Programmers capability ': np.random.randint(1, 6, n_samples),  # Note trailing space
        'Project manager experience': np.random.randint(1, 6, n_samples),
        'Team size': np.random.randint(2, 15, n_samples),
        'Requirment stability': np.random.randint(1, 6, n_samples),  # Note typo
        'Development environment adequacy': np.random.randint(1, 6, n_samples),
        'Actual effort': np.random.randint(1000, 50000, n_samples)
    }
    return pd.DataFrame(data)


def create_fixture_excel(output_path: str) -> str:
    """
    Create fixture Excel file matching SEERA format.
    
    Args:
        output_path: Path to save the Excel file
        
    Returns:
        Path to created file
    """
    df = get_sample_training_data()
    
    # Create with header row at row 0 (data starts at row 1, matching header=1 in load_seera_dataset)
    # Write an empty row first, then the data with headers
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    
    with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
        # Write empty row 0
        empty_df = pd.DataFrame([[''] * len(df.columns)])
        empty_df.to_excel(writer, index=False, header=False, startrow=0)
        # Write headers at row 1 and data starting row 2
        df.to_excel(writer, index=False, header=True, startrow=1)
    
    return output_path


def get_sample_input_features() -> dict:
    """
    Get sample input features for prediction testing.
    
    Returns:
        Dictionary of input features
    """
    return {
        'object_points': 200,
        'product_complexity': 3,
        'performance_requirements': 4,
        'programmer_capability': 4,
        'pm_experience': 3,
        'team_size': 5,
        'requirement_stability': 3,
        'environment_adequacy': 4
    }


def get_sample_model_features() -> list:
    """
    Get list of feature names as used by the model.
    
    Returns:
        List of feature column names
    """
    return [
        'Object points',
        'Product complexity',
        'Performance requirements',
        'Programmers capability ',
        'Project manager experience',
        'Team size',
        'Requirment stability',
        'Development environment adequacy'
    ]
