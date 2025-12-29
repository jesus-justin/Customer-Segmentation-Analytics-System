"""
FEATURE IMPORTANCE Module
Enhanced utility module for customer segmentation analytics
Last updated: 2025-12-29
"""
"""
Feature importance and cluster characterization utilities
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from typing import Dict, List, Any


def calculate_feature_importance_in_clusters(
    df_normalized: pd.DataFrame,
    df_original: pd.DataFrame,
    labels: np.ndarray
) -> Dict[int, Dict[str, float]]:
    """
    Calculate feature importance for each cluster using variance analysis.
    
    Features with high variance between clusters are more discriminative.
    
    Args:
        df_normalized: Normalized feature DataFrame
        df_original: Original DataFrame (for reference)
        labels: Cluster labels
        
    Returns:
        Dictionary mapping cluster IDs to feature importance scores
    """
    df_with_clusters = df_normalized.copy()
    df_with_clusters['Cluster'] = labels
    
    # Calculate overall variance for each feature
    overall_variance = df_with_clusters.groupby('Cluster').mean().var()
    
    # Normalize by max variance to get importance scores 0-1
    max_var = overall_variance.max()
    if max_var > 0:
        importance_scores = (overall_variance / max_var * 100).round(2).to_dict()
    else:
        importance_scores = {col: 0 for col in overall_variance.index}
    
    return importance_scores


def get_top_features_per_cluster(
    df_original: pd.DataFrame,
    labels: np.ndarray,
    n_features: int = 5
) -> Dict[int, List[Dict[str, Any]]]:
    """
    Extract top discriminative features for each cluster.
    
    Args:
        df_original: Original DataFrame
        labels: Cluster labels
        n_features: Number of top features to return per cluster
        
    Returns:
        Dictionary mapping cluster IDs to lists of (feature, value) pairs
    """
    df_with_clusters = df_original.copy()
    df_with_clusters['Cluster'] = labels
    
    top_features = {}
    
    for cluster_id in sorted(np.unique(labels)):
        cluster_data = df_with_clusters[df_with_clusters['Cluster'] == cluster_id]
        numeric_cols = cluster_data.select_dtypes(include=[np.number]).columns
        numeric_cols = [col for col in numeric_cols if col != 'Cluster']
        
        if len(numeric_cols) > 0:
            # Get mean values for numeric columns
            means = cluster_data[numeric_cols].mean()
            
            # Sort by absolute mean value to find most characteristic features
            top_features[int(cluster_id)] = [
                {
                    'feature': feature,
                    'mean': round(float(value), 2),
                    'std': round(float(cluster_data[feature].std()), 2)
                }
                for feature, value in means.abs().nlargest(n_features).items()
            ]
        else:
            top_features[int(cluster_id)] = []
    
    return top_features


def calculate_cluster_separation(
    centroids: np.ndarray,
    labels: np.ndarray
) -> float:
    """
    Calculate average inter-cluster distance as measure of cluster separation.
    
    Args:
        centroids: Cluster centroids from KMeans model
        labels: Cluster labels
        
    Returns:
        Average distance between cluster centers (normalized)
    """
    if len(centroids) < 2:
        return 0.0
    
    # Calculate pairwise distances between centroids
    distances = []
    for i in range(len(centroids)):
        for j in range(i + 1, len(centroids)):
            dist = np.linalg.norm(centroids[i] - centroids[j])
            distances.append(dist)
    
    if distances:
        return round(float(np.mean(distances)), 4)
    return 0.0


def get_cluster_outliers(
    df_normalized: pd.DataFrame,
    labels: np.ndarray,
    percentile: float = 95.0
) -> Dict[int, List[int]]:
    """
    Identify potential outliers within each cluster based on distance to centroid.
    
    Args:
        df_normalized: Normalized feature DataFrame
        labels: Cluster labels
        percentile: Percentile threshold for outlier detection
        
    Returns:
        Dictionary mapping cluster IDs to lists of outlier indices
    """
    df_with_clusters = df_normalized.copy()
    df_with_clusters['Cluster'] = labels
    df_with_clusters['Index'] = range(len(df_normalized))
    
    outliers = {}
    
    for cluster_id in np.unique(labels):
        cluster_data = df_with_clusters[df_with_clusters['Cluster'] == cluster_id]
        cluster_centroid = cluster_data[df_normalized.columns].mean().values
        
        # Calculate distance from each point to cluster centroid
        distances = np.linalg.norm(
            cluster_data[df_normalized.columns].values - cluster_centroid,
            axis=1
        )
        
        # Find points in the top percentile (farthest from centroid)
        threshold = np.percentile(distances, percentile)
        outlier_mask = distances > threshold
        outlier_indices = cluster_data.loc[outlier_mask, 'Index'].tolist()
        
        outliers[int(cluster_id)] = outlier_indices
    
    return outliers


def generate_cluster_summary(
    df_original: pd.DataFrame,
    df_normalized: pd.DataFrame,
    labels: np.ndarray,
    kmeans_model: Any
) -> Dict[int, str]:
    """
    Generate natural language summaries for each cluster.
    
    Args:
        df_original: Original DataFrame
        df_normalized: Normalized DataFrame
        labels: Cluster labels
        kmeans_model: Fitted KMeans model
        
    Returns:
        Dictionary mapping cluster IDs to text summaries
    """
    df_with_clusters = df_original.copy()
    df_with_clusters['Cluster'] = labels
    
    summaries = {}
    
    for cluster_id in sorted(np.unique(labels)):
        cluster_data = df_with_clusters[df_with_clusters['Cluster'] == cluster_id]
        size = len(cluster_data)
        percentage = len(cluster_data) / len(df_with_clusters) * 100
        
        # Get top features
        numeric_cols = cluster_data.select_dtypes(include=[np.number]).columns
        numeric_cols = [col for col in numeric_cols if col != 'Cluster']
        
        if len(numeric_cols) > 0:
            top_feature = cluster_data[numeric_cols].mean().abs().idxmax()
            top_value = cluster_data[numeric_cols].mean().max()
            
            summary = f"Cluster {cluster_id} contains {size} customers ({percentage:.1f}% of total). " \
                     f"Characterized by high {top_feature} (avg: {top_value:.1f})."
        else:
            summary = f"Cluster {cluster_id} contains {size} customers ({percentage:.1f}% of total)."
        
        summaries[int(cluster_id)] = summary
    
    return summaries

