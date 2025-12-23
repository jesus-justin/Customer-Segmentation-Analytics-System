"""
Export utilities for clustering results in multiple formats
"""

import pandas as pd
import json
import os
from datetime import datetime
from typing import Dict, Any


def export_to_csv(
    df_original: pd.DataFrame,
    labels: list,
    filepath: str = 'clustered_results.csv'
) -> str:
    """
    Export clustering results with cluster assignments to CSV.
    
    Args:
        df_original: Original DataFrame
        labels: Cluster labels for each row
        filepath: Output file path
        
    Returns:
        Path to exported file
    """
    export_data = df_original.copy()
    export_data['Cluster'] = labels
    
    os.makedirs(os.path.dirname(filepath) if os.path.dirname(filepath) else '.', exist_ok=True)
    export_data.to_csv(filepath, index=False)
    
    return filepath


def export_to_json(
    cluster_analysis: Dict[int, Dict[str, Any]],
    metrics: Dict[str, float],
    recommendations: Dict[int, str],
    filepath: str = 'clustering_report.json'
) -> str:
    """
    Export clustering analysis and metrics to JSON for programmatic access.
    
    Args:
        cluster_analysis: Cluster analysis dictionary
        metrics: Clustering quality metrics
        recommendations: Business recommendations per cluster
        filepath: Output file path
        
    Returns:
        Path to exported file
    """
    report = {
        'timestamp': datetime.now().isoformat(),
        'metrics': metrics,
        'clusters': cluster_analysis,
        'recommendations': recommendations
    }
    
    os.makedirs(os.path.dirname(filepath) if os.path.dirname(filepath) else '.', exist_ok=True)
    
    with open(filepath, 'w') as f:
        json.dump(report, f, indent=2)
    
    return filepath


def export_html_report(
    cluster_analysis: Dict[int, Dict[str, Any]],
    metrics: Dict[str, float],
    recommendations: Dict[int, str],
    filepath: str = 'clustering_report.html'
) -> str:
    """
    Generate standalone HTML report with clustering results.
    
    Args:
        cluster_analysis: Cluster analysis dictionary
        metrics: Clustering quality metrics
        recommendations: Business recommendations per cluster
        filepath: Output file path
        
    Returns:
        Path to exported file
    """
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Customer Segmentation Report</title>
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                max-width: 1000px;
                margin: 0 auto;
                padding: 20px;
                background: #f5f5f5;
            }}
            .header {{
                background: linear-gradient(135deg, #2563eb, #1e40af);
                color: white;
                padding: 30px;
                border-radius: 8px;
                margin-bottom: 30px;
            }}
            .header h1 {{
                margin: 0 0 10px 0;
            }}
            .metrics {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-bottom: 30px;
            }}
            .metric-card {{
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }}
            .metric-label {{
                color: #666;
                font-size: 0.9rem;
                margin-bottom: 5px;
            }}
            .metric-value {{
                font-size: 2rem;
                font-weight: bold;
                color: #2563eb;
            }}
            .cluster {{
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }}
            .cluster h3 {{
                color: #2563eb;
                margin-top: 0;
            }}
            .recommendation {{
                background: #f0f9ff;
                border-left: 4px solid #2563eb;
                padding: 15px;
                margin: 10px 0;
                border-radius: 4px;
            }}
            .timestamp {{
                color: #999;
                font-size: 0.9rem;
                text-align: center;
                margin-top: 30px;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Customer Segmentation Analysis Report</h1>
            <p>Comprehensive clustering results and business insights</p>
        </div>
        
        <h2>Clustering Metrics</h2>
        <div class="metrics">
    """
    
    for metric_name, metric_value in metrics.items():
        html_content += f"""
            <div class="metric-card">
                <div class="metric-label">{metric_name.replace('_', ' ').title()}</div>
                <div class="metric-value">{metric_value}</div>
            </div>
        """
    
    html_content += """
        </div>
        
        <h2>Cluster Analysis</h2>
    """
    
    for cluster_id, analysis in cluster_analysis.items():
        html_content += f"""
        <div class="cluster">
            <h3>Cluster {cluster_id}</h3>
            <p><strong>Size:</strong> {analysis['size']} customers ({analysis['percentage']}%)</p>
            <div class="recommendation">
                <strong>Recommendation:</strong> {recommendations.get(cluster_id, 'N/A')}
            </div>
        </div>
        """
    
    html_content += f"""
        <div class="timestamp">
            Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        </div>
    </body>
    </html>
    """
    
    os.makedirs(os.path.dirname(filepath) if os.path.dirname(filepath) else '.', exist_ok=True)
    
    with open(filepath, 'w') as f:
        f.write(html_content)
    
    return filepath
