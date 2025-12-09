#!/usr/bin/env python3
"""
Train XGBoost Regression Model for Project Effort Estimation.

Uses the SEERA cost estimation dataset to train a model predicting 'Actual effort' (person-hours).
Implements robust preprocessing, imputation, and model serialization.
"""

import argparse
import json
import logging
from pathlib import Path
from typing import Tuple, Dict, List

import joblib
import numpy as np
import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import cross_validate
from sklearn.preprocessing import StandardScaler

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ========== Feature Configuration ==========

# Key features as specified in requirements (exact column names from SEERA dataset)
FEATURE_COLUMNS = [
    'Object points',
    'Product complexity',
    'Performance requirements',
    'Programmers capability ',  # Note: trailing space in original dataset
    'Project manager experience',
    'Team size',
    'Requirment stability',  # Note: typo in original dataset
    'Development environment adequacy'
]

TARGET_COLUMN = 'Actual effort'


def load_seera_dataset(data_path: str) -> pd.DataFrame:
    """
    Load SEERA cost estimation dataset from Excel file.
    
    Args:
        data_path: Path to the Excel file
        
    Returns:
        DataFrame with loaded data
    """
    logger.info(f"Loading dataset from: {data_path}")
    
    # Determine file type and load accordingly
    if data_path.endswith('.xlsx') or data_path.endswith('.xls'):
        df = pd.read_excel(data_path, header=1)  # header=1 as specified
    elif data_path.endswith('.csv'):
        df = pd.read_csv(data_path, header=1)
    else:
        # Try Excel first, then CSV
        try:
            df = pd.read_excel(data_path, header=1)
        except Exception:
            df = pd.read_csv(data_path, header=1)
    
    logger.info(f"Loaded {len(df)} rows, {len(df.columns)} columns")
    return df


def clean_and_preprocess(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean dataset by handling missing values and invalid entries.
    
    - Converts '?' and 'N/A' to NaN
    - Converts feature columns to numeric types
    
    Args:
        df: Raw DataFrame
        
    Returns:
        Cleaned DataFrame
    """
    logger.info("Cleaning and preprocessing data...")
    df = df.copy()
    
    # Replace common missing value indicators with NaN
    missing_indicators = ['?', 'N/A', 'n/a', 'NA', '', ' ', 'null', 'NULL', 'None']
    df = df.replace(missing_indicators, np.nan)
    
    # Convert feature columns to numeric
    for col in FEATURE_COLUMNS:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
            logger.info(f"  Converted '{col}' to numeric, NaN count: {df[col].isna().sum()}")
    
    # Convert target column to numeric
    if TARGET_COLUMN in df.columns:
        df[TARGET_COLUMN] = pd.to_numeric(df[TARGET_COLUMN], errors='coerce')
        logger.info(f"  Target '{TARGET_COLUMN}' - NaN count: {df[TARGET_COLUMN].isna().sum()}")
    
    return df


def prepare_features_and_target(
    df: pd.DataFrame
) -> Tuple[np.ndarray, np.ndarray, Dict, List[str]]:
    """
    Prepare feature matrix and target vector with imputation.
    
    Args:
        df: Cleaned DataFrame
        
    Returns:
        Tuple of (X, y, preprocessing_dict, feature_names)
    """
    logger.info("Preparing features and target...")
    
    # Verify all feature columns exist
    available_features = [col for col in FEATURE_COLUMNS if col in df.columns]
    missing_features = [col for col in FEATURE_COLUMNS if col not in df.columns]
    
    if missing_features:
        logger.warning(f"Missing feature columns: {missing_features}")
    
    logger.info(f"Using {len(available_features)} features: {available_features}")
    
    # Drop rows with missing target
    df_clean = df.dropna(subset=[TARGET_COLUMN]).copy()
    logger.info(f"After dropping missing target: {len(df_clean)} rows")
    
    # Extract features and target
    X = df_clean[available_features].copy()
    y = df_clean[TARGET_COLUMN].values
    
    # Create and fit imputer for missing feature values
    imputer = SimpleImputer(strategy='median')
    X_imputed = imputer.fit_transform(X)
    
    # Create and fit scaler (helps with model stability)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_imputed)
    
    # Store preprocessing objects
    preprocessing = {
        'imputer': imputer,
        'scaler': scaler,
        'feature_columns': available_features,
        'target_column': TARGET_COLUMN
    }
    
    logger.info(f"Feature matrix shape: {X_scaled.shape}")
    logger.info(f"Target shape: {y.shape}")
    
    return X_scaled, y, preprocessing, available_features


def train_xgboost_model(
    X: np.ndarray,
    y: np.ndarray,
    random_state: int = 42
) -> Dict:
    """
    Train XGBoost Regressor with cross-validation.
    
    Args:
        X: Feature matrix
        y: Target vector
        random_state: Random seed
        
    Returns:
        Dictionary with model and metrics
    """
    logger.info("Training XGBoost Regressor...")
    
    try:
        import xgboost as xgb
        
        # XGBoost with tuned hyperparameters for effort estimation
        model = xgb.XGBRegressor(
            n_estimators=200,
            max_depth=6,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            min_child_weight=3,
            reg_alpha=0.1,
            reg_lambda=1.0,
            random_state=random_state,
            n_jobs=-1,
            objective='reg:squarederror'
        )
        
        # Cross-validation
        logger.info("Performing 5-fold cross-validation...")
        cv_results = cross_validate(
            model, X, y, cv=5,
            scoring=['neg_mean_absolute_error', 'neg_root_mean_squared_error', 'r2'],
            return_train_score=True
        )
        
        # Fit on full data
        model.fit(X, y)
        
        # Extract metrics
        cv_mae = -cv_results['test_neg_mean_absolute_error'].mean()
        cv_rmse = -cv_results['test_neg_root_mean_squared_error'].mean()
        cv_r2 = cv_results['test_r2'].mean()
        
        logger.info(f"XGBoost CV Results:")
        logger.info(f"  MAE: {cv_mae:.2f} person-hours")
        logger.info(f"  RMSE: {cv_rmse:.2f} person-hours")
        logger.info(f"  R2: {cv_r2:.4f}")
        
        return {
            'model': model,
            'model_name': 'XGBRegressor',
            'cv_mae': cv_mae,
            'cv_rmse': cv_rmse,
            'cv_r2': cv_r2
        }
        
    except ImportError:
        logger.error("XGBoost not installed. Install with: pip install xgboost")
        raise


def compute_feature_importance(model, feature_names: List[str]) -> Dict[str, float]:
    """
    Compute feature importance from trained model.
    
    Args:
        model: Trained model
        feature_names: List of feature names
        
    Returns:
        Dictionary mapping feature names to importance scores
    """
    if hasattr(model, 'feature_importances_'):
        importances = model.feature_importances_
        importance_dict = dict(zip(feature_names, importances))
        # Sort by importance
        importance_dict = dict(sorted(importance_dict.items(), key=lambda x: x[1], reverse=True))
        return importance_dict
    return {}


def evaluate_model(model, X: np.ndarray, y: np.ndarray) -> Dict:
    """
    Evaluate model on training data.
    
    Args:
        model: Trained model
        X: Feature matrix
        y: Target vector
        
    Returns:
        Dictionary with evaluation metrics
    """
    y_pred = model.predict(X)
    
    mae = mean_absolute_error(y, y_pred)
    rmse = np.sqrt(mean_squared_error(y, y_pred))
    r2 = r2_score(y, y_pred)
    
    # MAPE (Mean Absolute Percentage Error)
    mape = np.mean(np.abs((y - y_pred) / np.maximum(y, 1e-9))) * 100
    
    return {
        'train_mae': mae,
        'train_rmse': rmse,
        'train_r2': r2,
        'train_mape': mape
    }


def save_model_artifacts(
    model,
    model_name: str,
    preprocessing: Dict,
    feature_names: List[str],
    metrics: Dict,
    feature_importance: Dict,
    output_dir: str = 'models'
) -> None:
    """
    Save model and preprocessing artifacts to disk.
    
    Args:
        model: Trained model
        model_name: Name of the model
        preprocessing: Preprocessing objects dictionary
        feature_names: List of feature names
        metrics: Training metrics
        feature_importance: Feature importance dictionary
        output_dir: Output directory path
    """
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    # Save main model artifact
    model_artifact = {
        'model': model,
        'model_name': model_name,
        'features': feature_names,
        'feature_importance': feature_importance,
        'version': 'v1.0-seera',
        'target': TARGET_COLUMN,
        'description': 'XGBoost model for project effort estimation (person-hours)'
    }
    
    model_path = output_path / 'model.joblib'
    logger.info(f"Saving model to: {model_path}")
    joblib.dump(model_artifact, model_path)
    
    # Save preprocessing/encoders
    encoders_path = output_path / 'encoders.joblib'
    logger.info(f"Saving preprocessing to: {encoders_path}")
    joblib.dump(preprocessing, encoders_path)
    
    # Save training metrics as JSON
    metrics_data = {
        'model_name': model_name,
        'target': TARGET_COLUMN,
        'features': feature_names,
        'feature_importance': {k: float(v) for k, v in feature_importance.items()},
        **{k: float(v) if isinstance(v, (np.floating, float)) else v for k, v in metrics.items()}
    }
    
    metrics_path = output_path / 'training_metrics.json'
    logger.info(f"Saving metrics to: {metrics_path}")
    with open(metrics_path, 'w') as f:
        json.dump(metrics_data, f, indent=2)
    
    logger.info("Model artifacts saved successfully!")


def train_pipeline(
    data_path: str,
    output_dir: str = 'models',
    random_state: int = 42
) -> None:
    """
    Main training pipeline.
    
    Args:
        data_path: Path to SEERA dataset
        output_dir: Directory to save model artifacts
        random_state: Random seed
    """
    logger.info("=" * 60)
    logger.info("Starting Effort Estimation Model Training Pipeline")
    logger.info("=" * 60)
    
    # Step 1: Load data
    df = load_seera_dataset(data_path)
    
    # Step 2: Clean and preprocess
    df = clean_and_preprocess(df)
    
    # Step 3: Prepare features and target
    X, y, preprocessing, feature_names = prepare_features_and_target(df)
    
    # Step 4: Train XGBoost model
    result = train_xgboost_model(X, y, random_state)
    model = result['model']
    
    # Step 5: Evaluate model
    eval_metrics = evaluate_model(model, X, y)
    
    # Step 6: Compute feature importance
    feature_importance = compute_feature_importance(model, feature_names)
    logger.info("Feature Importance:")
    for feat, imp in feature_importance.items():
        logger.info(f"  {feat}: {imp:.4f}")
    
    # Combine metrics
    all_metrics = {
        'cv_mae': result['cv_mae'],
        'cv_rmse': result['cv_rmse'],
        'cv_r2': result['cv_r2'],
        **eval_metrics,
        'n_features': len(feature_names),
        'n_samples': len(y)
    }
    
    # Step 7: Save artifacts
    save_model_artifacts(
        model=model,
        model_name=result['model_name'],
        preprocessing=preprocessing,
        feature_names=feature_names,
        metrics=all_metrics,
        feature_importance=feature_importance,
        output_dir=output_dir
    )
    
    logger.info("=" * 60)
    logger.info("Training Pipeline Complete!")
    logger.info(f"Model saved to: {output_dir}/model.joblib")
    logger.info(f"CV MAE: {result['cv_mae']:.2f} person-hours")
    logger.info(f"CV R2: {result['cv_r2']:.4f}")
    logger.info("=" * 60)


def main():
    """CLI entry point."""
    parser = argparse.ArgumentParser(
        description='Train XGBoost model for project effort estimation',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python src/train_model.py --data "data/raw/SEERA cost estimation dataset.xlsx"
  python src/train_model.py --data data.csv --output models --seed 42
        """
    )
    
    parser.add_argument(
        '--data',
        required=True,
        help='Path to SEERA dataset (Excel or CSV with header at row 2)'
    )
    parser.add_argument(
        '--output',
        default='models',
        help='Output directory for model artifacts (default: models)'
    )
    parser.add_argument(
        '--seed',
        type=int,
        default=42,
        help='Random seed (default: 42)'
    )
    
    args = parser.parse_args()
    
    train_pipeline(
        data_path=args.data,
        output_dir=args.output,
        random_state=args.seed
    )


if __name__ == '__main__':
    main()
