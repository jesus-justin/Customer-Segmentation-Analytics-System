"""
Unit Tests for Customer Segmentation Analytics System

Run tests with: pytest tests.py -v
"""

import unittest
import os
import sys
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.preprocessing import (
    load_data, 
    handle_missing_values,
    encode_categorical_features,
    normalize_features,
    preprocess_data,
    get_feature_statistics,
    get_data_quality_metrics,
    get_correlation_matrix
)
from utils.clustering import (
    find_optimal_clusters,
    perform_clustering,
    calculate_cluster_metrics,
    analyze_clusters,
    get_cluster_recommendations,
    get_cluster_centroids,
    calculate_inertia,
    get_cluster_profiles
)


class TestPreprocessing(unittest.TestCase):
    """Test data preprocessing functions"""
    
    def setUp(self):
        """Create sample data for testing"""
        self.sample_data = pd.DataFrame({
            'Age': [25, 35, 45, np.nan, 55],
            'Income': [30, 40, 50, 60, 70],
            'Score': [30, 50, 70, 80, 90],
            'Category': ['A', 'B', 'A', 'C', 'B']
        })
    
    def test_handle_missing_values(self):
        """Test missing value handling"""
        result = handle_missing_values(self.sample_data, strategy='mean')
        self.assertFalse(result['Age'].isnull().any())
    
    def test_encode_categorical_features(self):
        """Test categorical encoding"""
        result, encoders = encode_categorical_features(self.sample_data)
        self.assertIsInstance(result['Category'].iloc[0], (int, np.integer))
        self.assertIn('Category', encoders)
    
    def test_normalize_features(self):
        """Test feature normalization"""
        test_df = self.sample_data.drop('Category', axis=1).fillna(self.sample_data.mean())
        result, scaler = normalize_features(test_df)
        
        # Check that normalization occurred
        self.assertNotEqual(result['Age'].iloc[0], test_df['Age'].iloc[0])
    
    def test_get_feature_statistics(self):
        """Test statistics calculation"""
        stats = get_feature_statistics(self.sample_data.select_dtypes(include=[np.number]))
        self.assertIn('Age', stats)
        self.assertIn('mean', stats['Age'])
    
    def test_get_data_quality_metrics(self):
        """Test data quality metrics"""
        metrics = get_data_quality_metrics(self.sample_data)
        self.assertEqual(metrics['total_rows'], 5)
        self.assertIn('missing_values', metrics)
    
    def test_get_correlation_matrix(self):
        """Test correlation calculation"""
        numeric_df = self.sample_data.select_dtypes(include=[np.number])
        corr = get_correlation_matrix(numeric_df)
        self.assertIn('Age', corr)


class TestClustering(unittest.TestCase):
    """Test clustering functions"""
    
    def setUp(self):
        """Create sample data for clustering"""
        np.random.seed(42)
        self.sample_data = pd.DataFrame({
            'Feature1': np.random.rand(50),
            'Feature2': np.random.rand(50),
            'Feature3': np.random.rand(50)
        })
    
    def test_find_optimal_clusters(self):
        """Test optimal cluster finding"""
        scores = find_optimal_clusters(self.sample_data, max_k=5)
        self.assertGreater(len(scores), 0)
        self.assertTrue(all(isinstance(k, int) for k in scores.keys()))
    
    def test_perform_clustering(self):
        """Test K-Means clustering"""
        labels, model = perform_clustering(self.sample_data, n_clusters=3)
        self.assertEqual(len(labels), len(self.sample_data))
        self.assertEqual(len(np.unique(labels)), 3)
    
    def test_calculate_cluster_metrics(self):
        """Test metric calculation"""
        labels, _ = perform_clustering(self.sample_data, n_clusters=3)
        metrics = calculate_cluster_metrics(self.sample_data, labels)
        
        self.assertIn('silhouette_score', metrics)
        self.assertIn('davies_bouldin_score', metrics)
        self.assertGreaterEqual(metrics['silhouette_score'], -1)
        self.assertLessEqual(metrics['silhouette_score'], 1)
    
    def test_get_cluster_recommendations(self):
        """Test recommendation generation"""
        labels, _ = perform_clustering(self.sample_data, n_clusters=2)
        original_df = pd.DataFrame({
            'Feature1': self.sample_data['Feature1'],
            'Feature2': self.sample_data['Feature2']
        })
        
        analysis = analyze_clusters(self.sample_data, original_df, labels)
        recommendations = get_cluster_recommendations(analysis)
        
        self.assertEqual(len(recommendations), 2)
        self.assertTrue(all(isinstance(rec, str) for rec in recommendations.values()))
    
    def test_get_cluster_centroids(self):
        """Test centroid extraction"""
        _, model = perform_clustering(self.sample_data, n_clusters=3)
        feature_names = ['Feature1', 'Feature2', 'Feature3']
        centroids = get_cluster_centroids(model, feature_names)
        
        self.assertEqual(len(centroids), 3)
        self.assertTrue(all(isinstance(c, dict) for c in centroids.values()))
    
    def test_calculate_inertia(self):
        """Test inertia calculation"""
        _, model = perform_clustering(self.sample_data, n_clusters=3)
        inertia = calculate_inertia(model)
        self.assertIsInstance(inertia, float)
        self.assertGreater(inertia, 0)
    
    def test_get_cluster_profiles(self):
        """Test cluster profile generation"""
        labels, _ = perform_clustering(self.sample_data, n_clusters=2)
        profiles = get_cluster_profiles(self.sample_data, self.sample_data, labels)
        
        self.assertEqual(len(profiles), 2)
        self.assertTrue(all('count' in p for p in profiles.values()))
        self.assertTrue(all('percentage' in p for p in profiles.values()))


class TestIntegration(unittest.TestCase):
    """Integration tests"""
    
    def setUp(self):
        """Create test CSV file"""
        self.test_csv = 'test_data.csv'
        test_df = pd.DataFrame({
            'CustomerID': range(1, 101),
            'Age': np.random.randint(18, 70, 100),
            'Income': np.random.randint(20, 150, 100),
            'Spending_Score': np.random.randint(1, 100, 100)
        })
        test_df.to_csv(self.test_csv, index=False)
    
    def tearDown(self):
        """Clean up test CSV"""
        if os.path.exists(self.test_csv):
            os.remove(self.test_csv)
    
    def test_full_preprocessing_pipeline(self):
        """Test complete preprocessing pipeline"""
        processed, metadata, original = preprocess_data(self.test_csv)
        
        self.assertIsNotNone(processed)
        self.assertIsNotNone(metadata)
        self.assertIsNotNone(original)
        self.assertEqual(len(processed), 100)
        self.assertIn('scaler', metadata)
        self.assertIn('encoders', metadata)
    
    def test_full_clustering_pipeline(self):
        """Test complete clustering pipeline"""
        processed, metadata, original = preprocess_data(self.test_csv)
        
        # Find optimal clusters
        scores = find_optimal_clusters(processed, max_k=5)
        optimal_k = max(scores, key=scores.get)
        
        # Perform clustering
        labels, model = perform_clustering(processed, n_clusters=optimal_k)
        
        # Analyze results
        metrics = calculate_cluster_metrics(processed, labels)
        analysis = analyze_clusters(processed, original, labels)
        recommendations = get_cluster_recommendations(analysis)
        
        self.assertGreater(len(recommendations), 0)
        self.assertGreater(metrics['silhouette_score'], -1)


if __name__ == '__main__':
    unittest.main()
