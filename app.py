"""
Customer Segmentation Analytics System - Flask Application
Main application file with routes for data upload, clustering, and visualization
"""

from flask import Flask, render_template, request, jsonify, flash, redirect, url_for
import os
import json
from werkzeug.utils import secure_filename
import pandas as pd
import numpy as np
from utils.preprocessing import preprocess_data, get_feature_statistics
from utils.clustering import (
    find_optimal_clusters,
    perform_clustering,
    calculate_cluster_metrics,
    analyze_clusters,
    get_cluster_recommendations,
    save_model,
    load_model
)
import plotly
import plotly.graph_objs as go
import plotly.express as px

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-this'
app.config['UPLOAD_FOLDER'] = 'data'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure data folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs('model', exist_ok=True)

# Global state
PROCESSED_DATA = None
ORIGINAL_DATA = None
CLUSTER_LABELS = None
KMEANS_MODEL = None
METADATA = None


@app.route('/')
def index():
    """Home page with file upload"""
    return render_template('index.html')


@app.route('/api/upload', methods=['POST'])
def upload_file():
    """
    Handle file upload and initial data processing
    """
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if file and file.filename.endswith('.csv'):
            # Secure the filename
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Preprocess the data
            global PROCESSED_DATA, ORIGINAL_DATA, METADATA
            PROCESSED_DATA, METADATA, ORIGINAL_DATA = preprocess_data(filepath)
            
            # Get data statistics
            stats = get_feature_statistics(ORIGINAL_DATA)
            
            return jsonify({
                'success': True,
                'message': f'File uploaded successfully. {len(PROCESSED_DATA)} rows processed.',
                'shape': PROCESSED_DATA.shape,
                'statistics': stats,
                'features': METADATA['features']
            }), 200
        else:
            return jsonify({'error': 'Only CSV files are allowed'}), 400
    
    except Exception as e:
        return jsonify({'error': f'Processing error: {str(e)}'}), 500


@app.route('/api/optimal-clusters', methods=['GET'])
def optimal_clusters():
    """
    Find optimal number of clusters
    """
    try:
        if PROCESSED_DATA is None:
            return jsonify({'error': 'No data loaded'}), 400
        
        max_k = min(10, len(PROCESSED_DATA) // 5)  # Max k is 10 or 1/5 of data
        silhouette_scores = find_optimal_clusters(PROCESSED_DATA, max_k=max_k)
        
        # Find optimal k
        optimal_k = max(silhouette_scores, key=silhouette_scores.get)
        
        return jsonify({
            'success': True,
            'silhouette_scores': silhouette_scores,
            'optimal_k': optimal_k,
            'chart_data': {
                'x': list(silhouette_scores.keys()),
                'y': list(silhouette_scores.values())
            }
        }), 200
    
    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500


@app.route('/api/cluster', methods=['POST'])
def cluster():
    """
    Perform K-Means clustering
    """
    try:
        if PROCESSED_DATA is None:
            return jsonify({'error': 'No data loaded'}), 400
        
        data = request.get_json()
        n_clusters = int(data.get('n_clusters', 3))
        
        # Perform clustering
        global CLUSTER_LABELS, KMEANS_MODEL
        CLUSTER_LABELS, KMEANS_MODEL = perform_clustering(PROCESSED_DATA, n_clusters=n_clusters)
        
        # Save model
        save_model(KMEANS_MODEL, 'model/kmeans_model.pkl')
        
        # Calculate metrics
        metrics = calculate_cluster_metrics(PROCESSED_DATA, CLUSTER_LABELS)
        
        # Analyze clusters
        cluster_analysis = analyze_clusters(PROCESSED_DATA, ORIGINAL_DATA, CLUSTER_LABELS)
        
        # Get recommendations
        recommendations = get_cluster_recommendations(cluster_analysis)
        
        return jsonify({
            'success': True,
            'metrics': metrics,
            'cluster_analysis': cluster_analysis,
            'recommendations': recommendations,
            'n_clusters': n_clusters
        }), 200
    
    except Exception as e:
        return jsonify({'error': f'Clustering error: {str(e)}'}), 500


@app.route('/api/visualizations', methods=['GET'])
def visualizations():
    """
    Generate visualizations for clusters
    """
    try:
        if CLUSTER_LABELS is None:
            return jsonify({'error': 'No clustering performed'}), 400
        
        # Create a copy with cluster labels
        viz_data = PROCESSED_DATA.copy()
        viz_data['Cluster'] = CLUSTER_LABELS
        
        # Get first two features for 2D visualization
        features = [col for col in PROCESSED_DATA.columns if col not in ['CustomerID']][:2]
        
        if len(features) < 2:
            features = PROCESSED_DATA.columns.tolist()[:2]
        
        # Create scatter plot
        fig = px.scatter(
            viz_data,
            x=features[0] if len(features) > 0 else viz_data.columns[0],
            y=features[1] if len(features) > 1 else viz_data.columns[1],
            color='Cluster',
            title='Customer Segments Visualization',
            labels={'Cluster': 'Cluster ID'},
            color_continuous_scale='Viridis'
        )
        
        fig.update_layout(
            hovermode='closest',
            plot_bgcolor='rgba(240,240,240,0.9)',
            paper_bgcolor='white',
            font=dict(family='Arial, sans-serif', size=12),
            width=1000,
            height=600
        )
        
        scatter_chart = json.loads(plotly.io.to_json(fig))
        
        # Create cluster distribution chart
        cluster_counts = pd.Series(CLUSTER_LABELS).value_counts().sort_index()
        fig_dist = go.Figure(data=[
            go.Bar(
                x=cluster_counts.index,
                y=cluster_counts.values,
                marker_color=['#636EFA', '#EF553B', '#00CC96', '#AB63FA', '#FFA15A'][:len(cluster_counts)]
            )
        ])
        
        fig_dist.update_layout(
            title='Cluster Distribution',
            xaxis_title='Cluster ID',
            yaxis_title='Number of Customers',
            plot_bgcolor='rgba(240,240,240,0.9)',
            paper_bgcolor='white',
            height=500,
            width=600
        )
        
        dist_chart = json.loads(plotly.io.to_json(fig_dist))
        
        return jsonify({
            'success': True,
            'scatter_chart': scatter_chart,
            'distribution_chart': dist_chart
        }), 200
    
    except Exception as e:
        return jsonify({'error': f'Visualization error: {str(e)}'}), 500


@app.route('/results')
def results():
    """Results page showing clustering results and recommendations"""
    if CLUSTER_LABELS is None:
        return redirect(url_for('index'))
    
    return render_template('results.html')


@app.route('/api/export', methods=['GET'])
def export_results():
    """Export clustering results to CSV"""
    try:
        if CLUSTER_LABELS is None:
            return jsonify({'error': 'No clustering performed'}), 400
        
        export_data = ORIGINAL_DATA.copy()
        export_data['Cluster'] = CLUSTER_LABELS
        
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], 'clustered_results.csv')
        export_data.to_csv(filepath, index=False)
        
        return jsonify({
            'success': True,
            'message': f'Results exported to {filepath}'
        }), 200
    
    except Exception as e:
        return jsonify({'error': f'Export error: {str(e)}'}), 500


@app.route('/api/reset', methods=['POST'])
def reset():
    """Reset all analysis"""
    global PROCESSED_DATA, ORIGINAL_DATA, CLUSTER_LABELS, KMEANS_MODEL, METADATA
    PROCESSED_DATA = None
    ORIGINAL_DATA = None
    CLUSTER_LABELS = None
    KMEANS_MODEL = None
    METADATA = None
    
    return jsonify({'success': True, 'message': 'Analysis reset successfully'}), 200


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Resource not found'}), 404


@app.errorhandler(500)
def server_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
