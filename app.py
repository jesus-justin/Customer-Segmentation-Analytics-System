"""
Customer Segmentation Analytics System - Flask Application
Main application file with routes for data upload, clustering, and visualization

Author: Your Name
Version: 1.0.0
Last Updated: 2024
"""

from flask import Flask, render_template, request, jsonify, flash, redirect, url_for
import os
import json
import time
from dotenv import load_dotenv
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
from utils.logger import app_logger
import plotly
import plotly.graph_objs as go
import plotly.express as px

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configuration from environment variables
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', 'data')
app.config['MAX_CONTENT_LENGTH'] = int(os.getenv('MAX_UPLOAD_SIZE', 16)) * 1024 * 1024  # Default 16MB
app.config['JSON_SORT_KEYS'] = False

# Ensure required directories exist
for directory in [app.config['UPLOAD_FOLDER'], 'model', 'logs']:
    os.makedirs(directory, exist_ok=True)

app_logger.info("Application initialized")

# Global state
PROCESSED_DATA = None
ORIGINAL_DATA = None
CLUSTER_LABELS = None
KMEANS_MODEL = None
METADATA = None


@app.route('/api/upload', methods=['POST'])
def upload_file():
    """
    Handle CSV file upload and perform initial data preprocessing.
    
    Returns:
        JSON response with preprocessed data statistics and metadata.
        Success: {success: true, message, shape, statistics, features}
        Error: {error: error_message}
    """
    try:
        app_logger.info("File upload initiated")
        
        # Validate file presence
        if 'file' not in request.files:
            app_logger.warning("Upload attempted without file")
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            app_logger.warning("Upload attempted with empty filename")
            return jsonify({'error': 'No file selected'}), 400
        
        # Validate file extension
        if not file.filename.lower().endswith('.csv'):
            app_logger.warning(f"Invalid file type uploaded: {file.filename}")
            return jsonify({'error': 'Only CSV files are allowed'}), 400
        
        # Validate file size (before saving)
        file.seek(0, 2)  # Seek to end
        file_size = file.tell()
        max_size = int(os.getenv('MAX_UPLOAD_SIZE', 16)) * 1024 * 1024
        
        if file_size > max_size:
            app_logger.warning(f"File too large: {file_size} bytes")
            return jsonify({'error': f'File size exceeds {int(os.getenv("MAX_UPLOAD_SIZE", 16))}MB limit'}), 400
        
        file.seek(0)  # Reset to beginning
        
        # Save and process file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        app_logger.info(f"File saved: {filename}")
        
        # Preprocess the data
        global PROCESSED_DATA, ORIGINAL_DATA, METADATA
        start_time = time.time()
        PROCESSED_DATA, METADATA, ORIGINAL_DATA = preprocess_data(filepath)
        processing_time = time.time() - start_time
        
        # Validate minimum data requirements
        if len(PROCESSED_DATA) < 2:
            app_logger.error(f"Insufficient data: {len(PROCESSED_DATA)} rows")
            return jsonify({'error': 'Dataset must have at least 2 rows'}), 400
        
        # Get data statistics
        stats = get_feature_statistics(ORIGINAL_DATA)
        
        app_logger.info(f"Data processed successfully in {processing_time:.2f}s. Shape: {PROCESSED_DATA.shape}")
        
        return jsonify({
            'success': True,
            'message': f'File uploaded successfully. {len(PROCESSED_DATA)} rows processed in {processing_time:.2f}s.',
            'shape': list(PROCESSED_DATA.shape),
            'statistics': stats,
            'features': METADATA['features'],
            'processing_time': round(processing_time, 2)
        }), 200
    
    except pd.errors.ParserError as e:
        app_logger.error(f"CSV parsing error: {str(e)}")
        return jsonify({'error': 'Invalid CSV file format'}), 400
    except Exception as e:
        app_logger.error(f"Upload error: {str(e)}", exc_info=True)
        return jsonify({'error': f'Processing error: {str(e)}'}), 500


@app.route('/api/optimal-clusters', methods=['GET'])
def optimal_clusters():
    """
    Calculate optimal number of clusters using Silhouette Score analysis.
    
    Returns:
        JSON response with silhouette scores for each cluster count.
        Success: {success: true, silhouette_scores, optimal_k, chart_data}
        Error: {error: error_message}
    """
    try:
        app_logger.info("Optimal clusters analysis initiated")
        
        if PROCESSED_DATA is None:
            app_logger.warning("Optimal clusters analysis without data loaded")
            return jsonify({'error': 'No data loaded'}), 400
        
        start_time = time.time()
        max_k = min(10, len(PROCESSED_DATA) // 5)  # Max k is 10 or 1/5 of data
        silhouette_scores = find_optimal_clusters(PROCESSED_DATA, max_k=max_k)
        
        # Find optimal k
        optimal_k = max(silhouette_scores, key=silhouette_scores.get)
        
        analysis_time = time.time() - start_time
        
        app_logger.info(f"Optimal clusters analysis completed. Optimal k: {optimal_k} in {analysis_time:.2f}s")
        
        return jsonify({
            'success': True,
            'silhouette_scores': silhouette_scores,
            'optimal_k': optimal_k,
            'chart_data': {
                'x': list(silhouette_scores.keys()),
                'y': list(silhouette_scores.values())
            },
            'analysis_time': round(analysis_time, 2)
        }), 200
    
    except Exception as e:
        app_logger.error(f"Optimal clusters error: {str(e)}", exc_info=True)
        return jsonify({'error': f'Error: {str(e)}'}), 500


@app.route('/api/cluster', methods=['POST'])
def cluster():
    """
    Perform K-Means clustering on preprocessed data.
    
    Request JSON:
        n_clusters (int): Number of clusters (2-10)
    
    Returns:
        JSON response with clustering results and analysis.
        Success: {success: true, metrics, cluster_analysis, recommendations, n_clusters}
        Error: {error: error_message}
    """
    try:
        app_logger.info("Clustering initiated")
        
        if PROCESSED_DATA is None:
            app_logger.warning("Clustering attempted without data loaded")
            return jsonify({'error': 'No data loaded'}), 400
        
        data = request.get_json()
        
        if not data:
            app_logger.warning("Clustering attempted without JSON data")
            return jsonify({'error': 'Invalid request body'}), 400
        
        try:
            n_clusters = int(data.get('n_clusters', 3))
            if n_clusters < 2 or n_clusters > 10:
                raise ValueError("Clusters must be between 2 and 10")
        except (ValueError, TypeError) as e:
            app_logger.warning(f"Invalid cluster count: {str(e)}")
            return jsonify({'error': f'Invalid cluster count: {str(e)}'}), 400
        
        start_time = time.time()
        
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
        
        clustering_time = time.time() - start_time
        
        app_logger.info(f"Clustering completed with {n_clusters} clusters in {clustering_time:.2f}s")
        
        return jsonify({
            'success': True,
            'metrics': metrics,
            'cluster_analysis': cluster_analysis,
            'recommendations': recommendations,
            'n_clusters': n_clusters,
            'clustering_time': round(clustering_time, 2)
        }), 200
    
    except Exception as e:
        app_logger.error(f"Clustering error: {str(e)}", exc_info=True)
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
        app_logger.error(f"Visualization error: {str(e)}", exc_info=True)
        return jsonify({'error': f'Visualization error: {str(e)}'}), 500


@app.route('/api/cluster-data', methods=['GET'])
def get_cluster_data():
    """
    Retrieve cluster analysis and recommendations for results page.
    
    Returns:
        JSON response with cluster analysis, recommendations, and metrics.
    """
    try:
        app_logger.info("Cluster data requested")
        
        if CLUSTER_LABELS is None:
            app_logger.warning("Cluster data requested without clustering performed")
            return jsonify({'error': 'No clustering performed'}), 400
        
        # Analyze clusters
        cluster_analysis = analyze_clusters(PROCESSED_DATA, ORIGINAL_DATA, CLUSTER_LABELS)
        recommendations = get_cluster_recommendations(cluster_analysis)
        metrics = calculate_cluster_metrics(PROCESSED_DATA, CLUSTER_LABELS)
        
        return jsonify({
            'success': True,
            'cluster_analysis': cluster_analysis,
            'recommendations': recommendations,
            'metrics': metrics,
            'n_clusters': len(np.unique(CLUSTER_LABELS))
        }), 200
    
    except Exception as e:
        app_logger.error(f"Error retrieving cluster data: {str(e)}", exc_info=True)
        return jsonify({'error': f'Error retrieving data: {str(e)}'}), 500


@app.route('/results')
def results():
    """
    Results page showing clustering results and recommendations.
    
    Redirects to home if no clustering has been performed.
    """
    app_logger.info("Results page accessed")
    if CLUSTER_LABELS is None:
        app_logger.warning("Results page accessed without clustering performed")
        return redirect(url_for('index'))
    
    return render_template('results.html')


@app.route('/api/export', methods=['GET'])
def export_results():
    """
    Export clustering results to CSV file with cluster assignments.
    
    Returns:
        JSON response with export confirmation.
        Success: {success: true, message}
        Error: {error: error_message}
    """
    try:
        app_logger.info("Export results initiated")
        
        if CLUSTER_LABELS is None:
            app_logger.warning("Export attempted without clustering performed")
            return jsonify({'error': 'No clustering performed'}), 400
        
        export_data = ORIGINAL_DATA.copy()
        export_data['Cluster'] = CLUSTER_LABELS
        
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], 'clustered_results.csv')
        export_data.to_csv(filepath, index=False)
        
        app_logger.info(f"Results exported to {filepath}")
        
        return jsonify({
            'success': True,
            'message': f'Results exported to {filepath}',
            'file': filepath
        }), 200
    
    except Exception as e:
        app_logger.error(f"Export error: {str(e)}", exc_info=True)
        return jsonify({'error': f'Export error: {str(e)}'}), 500


@app.route('/api/reset', methods=['POST'])
def reset():
    """
    Reset all analysis and clear loaded data.
    
    Returns:
        JSON response with success confirmation.
    """
    try:
        app_logger.info("Analysis reset initiated")
        
        global PROCESSED_DATA, ORIGINAL_DATA, CLUSTER_LABELS, KMEANS_MODEL, METADATA
        PROCESSED_DATA = None
        ORIGINAL_DATA = None
        CLUSTER_LABELS = None
        KMEANS_MODEL = None
        METADATA = None
        
        app_logger.info("Analysis reset successfully")
        
        return jsonify({'success': True, 'message': 'Analysis reset successfully'}), 200
    
    except Exception as e:
        app_logger.error(f"Reset error: {str(e)}", exc_info=True)
        return jsonify({'error': f'Reset error: {str(e)}'}), 500


@app.route('/')
def index():
    """
    Home page with file upload interface.
    """
    app_logger.info("Home page accessed")
    return render_template('index.html')


@app.errorhandler(404)
def not_found(error):
    """
    Handle 404 Not Found errors.
    
    Args:
        error: The error object
    
    Returns:
        JSON error response
    """
    app_logger.warning(f"404 error: {request.path}")
    return jsonify({'error': 'Resource not found'}), 404


@app.errorhandler(500)
def server_error(error):
    """
    Handle 500 Internal Server Error.
    
    Args:
        error: The error object
    
    Returns:
        JSON error response
    """
    app_logger.error(f"500 error: {str(error)}", exc_info=True)
    return jsonify({'error': 'Internal server error'}), 500


@app.errorhandler(413)
def request_entity_too_large(error):
    """
    Handle 413 Request Entity Too Large errors (file upload size limit).
    
    Args:
        error: The error object
    
    Returns:
        JSON error response
    """
    max_size = int(os.getenv('MAX_UPLOAD_SIZE', 16))
    app_logger.warning(f"413 error: File too large")
    return jsonify({'error': f'File size exceeds {max_size}MB limit'}), 413


if __name__ == '__main__':
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    port = int(os.getenv('SERVER_PORT', 5000))
    app_logger.info(f"Starting Customer Segmentation Analytics System on port {port}")
    app.run(debug=debug_mode, port=port, host='0.0.0.0')
