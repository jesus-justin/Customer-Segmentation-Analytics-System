"""
Data preprocessing utilities for customer segmentation
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from typing import Tuple, Dict, Any


def load_data(filepath: str) -> pd.DataFrame:
    """
    Load customer data from CSV file.
    
    Args:
        filepath: Path to the CSV file
        
    Returns:
        DataFrame containing customer data
    """
    return pd.read_csv(filepath)


def handle_missing_values(df: pd.DataFrame, strategy: str = 'mean') -> pd.DataFrame:
    """
    Handle missing values in the dataset.
    
    Args:
        df: Input DataFrame
        strategy: How to handle missing values ('mean', 'median', 'drop')
        
    Returns:
        DataFrame with missing values handled
    """
    df = df.copy()
    
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    categorical_cols = df.select_dtypes(include=['object']).columns
    
    # Handle numeric columns
    if strategy == 'mean':
        df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].mean())
    elif strategy == 'median':
        df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())
    elif strategy == 'drop':
        df = df.dropna()
    
    # Handle categorical columns
    for col in categorical_cols:
        if df[col].isnull().any():
            df[col] = df[col].fillna(df[col].mode()[0])
    
    return df


def encode_categorical_features(df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, LabelEncoder]]:
    """
    Encode categorical features to numeric values.
    
    Args:
        df: Input DataFrame
        
    Returns:
        Tuple of (encoded DataFrame, encoders dictionary)
    """
    df = df.copy()
    encoders = {}
    
    categorical_cols = df.select_dtypes(include=['object']).columns
    
    for col in categorical_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        encoders[col] = le
    
    return df, encoders


def normalize_features(df: pd.DataFrame, exclude_cols: list = None) -> Tuple[pd.DataFrame, StandardScaler]:
    """
    Normalize numeric features using StandardScaler.
    
    Args:
        df: Input DataFrame
        exclude_cols: Columns to exclude from normalization
        
    Returns:
        Tuple of (normalized DataFrame, scaler object)
    """
    df = df.copy()
    exclude_cols = exclude_cols or []
    
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    cols_to_scale = [col for col in numeric_cols if col not in exclude_cols]
    
    scaler = StandardScaler()
    df[cols_to_scale] = scaler.fit_transform(df[cols_to_scale])
    
    return df, scaler


def preprocess_data(filepath: str) -> Tuple[pd.DataFrame, Dict[str, Any], pd.DataFrame]:
    """
    Complete preprocessing pipeline for customer data.
    
    Args:
        filepath: Path to the CSV file
        
    Returns:
        Tuple of (processed DataFrame, metadata dict, original DataFrame)
    """
    # Load data
    original_df = load_data(filepath)
    df = original_df.copy()
    
    # Store original info
    original_shape = df.shape
    
    # Handle missing values
    df = handle_missing_values(df, strategy='mean')
    
    # Encode categorical features
    df, encoders = encode_categorical_features(df)
    
    # Normalize features
    df, scaler = normalize_features(df, exclude_cols=['CustomerID'] if 'CustomerID' in df.columns else [])
    
    # Prepare metadata
    metadata = {
        'original_shape': original_shape,
        'processed_shape': df.shape,
        'encoders': encoders,
        'scaler': scaler,
        'features': df.columns.tolist()
    }
    
    return df, metadata, original_df


def get_feature_statistics(df: pd.DataFrame) -> Dict[str, Dict[str, float]]:
    """
    Calculate statistical summaries of features.
    
    Args:
        df: Input DataFrame
        
    Returns:
        Dictionary containing statistics for each feature
    """
    return df.describe().to_dict()
