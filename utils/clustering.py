"""
Clustering utilities for customer segmentation
"""

import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, davies_bouldin_score
import joblib
from typing import Tuple, Dict, Any, List


def find_optimal_clusters(df: pd.DataFrame, max_k: int = 10, random_state: int = 42) -> Dict[int, float]:
    """
    Find optimal number of clusters using Elbow Method and Silhouette Score.
    
    Args:
        df: Input DataFrame (should be normalized)
        max_k: Maximum number of clusters to test
        random_state: Random state for reproducibility
        
    Returns:
        Dictionary mapping cluster counts to silhouette scores
    """
    silhouette_scores = {}
    
    for k in range(2, max_k + 1):
        kmeans = KMeans(n_clusters=k, random_state=random_state, n_init=10)
        labels = kmeans.fit_predict(df)
        
        # Calculate silhouette score
        score = silhouette_score(df, labels)
        silhouette_scores[k] = score
    
    return silhouette_scores


def perform_clustering(df: pd.DataFrame, n_clusters: int = 3, random_state: int = 42) -> Tuple[np.ndarray, KMeans]:
    """
    Perform K-Means clustering on the data.
    
    Args:
        df: Input DataFrame (should be normalized)
        n_clusters: Number of clusters
        random_state: Random state for reproducibility
        
    Returns:
        Tuple of (cluster labels, KMeans model)
    """
    kmeans = KMeans(n_clusters=n_clusters, random_state=random_state, n_init=10)
    labels = kmeans.fit_predict(df)
    
    return labels, kmeans


def calculate_cluster_metrics(df: pd.DataFrame, labels: np.ndarray) -> Dict[str, float]:
    """
    Calculate clustering quality metrics.
    
    Args:
        df: Input DataFrame
        labels: Cluster labels
        
    Returns:
        Dictionary containing clustering metrics
    """
    silhouette = silhouette_score(df, labels)
    davies_bouldin = davies_bouldin_score(df, labels)
    
    return {
        'silhouette_score': round(silhouette, 4),
        'davies_bouldin_score': round(davies_bouldin, 4)
    }


def analyze_clusters(df: pd.DataFrame, original_df: pd.DataFrame, labels: np.ndarray) -> Dict[int, Dict[str, Any]]:
    """
    Analyze and profile each cluster.
    
    Args:
        df: Normalized DataFrame
        original_df: Original DataFrame (for meaningful features)
        labels: Cluster labels
        
    Returns:
        Dictionary containing cluster analysis
    """
    df_with_clusters = original_df.copy()
    df_with_clusters['Cluster'] = labels
    
    cluster_analysis = {}
    
    for cluster_id in sorted(np.unique(labels)):
        cluster_data = df_with_clusters[df_with_clusters['Cluster'] == cluster_id]
        
        # Calculate numeric statistics
        numeric_cols = cluster_data.select_dtypes(include=[np.number]).columns
        numeric_cols = [col for col in numeric_cols if col != 'Cluster']
        
        cluster_analysis[int(cluster_id)] = {
            'size': len(cluster_data),
            'percentage': round(len(cluster_data) / len(df_with_clusters) * 100, 2),
            'statistics': cluster_data[numeric_cols].describe().to_dict() if len(numeric_cols) > 0 else {}
        }
    
    return cluster_analysis


def save_model(kmeans: KMeans, filepath: str) -> None:
    """
    Save trained K-Means model to disk.
    
    Args:
        kmeans: Trained KMeans model
        filepath: Path to save the model
    """
    joblib.dump(kmeans, filepath)


def load_model(filepath: str) -> KMeans:
    """
    Load trained K-Means model from disk.
    
    Args:
        filepath: Path to the saved model
        
    Returns:
        Loaded KMeans model
    """
    return joblib.load(filepath)


def get_cluster_recommendations(cluster_analysis: Dict[int, Dict[str, Any]]) -> Dict[int, str]:
    """
    Generate business recommendations for each cluster.
    
    Args:
        cluster_analysis: Cluster analysis dictionary
        
    Returns:
        Dictionary mapping cluster IDs to recommendations
    """
    recommendations = {}
    
    for cluster_id, analysis in cluster_analysis.items():
        size = analysis['size']
        percentage = analysis['percentage']
        
        if percentage > 40:
            rec = f"🎯 Segment {cluster_id} (Core Segment - {percentage}%): Largest customer base. Maintain loyalty programs and regular engagement."
        elif percentage > 25:
            rec = f"📊 Segment {cluster_id} (Major Segment - {percentage}%): Significant revenue contributor. Focus on retention and upselling."
        else:
            rec = f"⭐ Segment {cluster_id} (Niche Segment - {percentage}%): Specialized needs. Develop targeted premium offerings."
        
        recommendations[cluster_id] = rec
    
    return recommendations
