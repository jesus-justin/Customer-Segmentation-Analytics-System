# Customer Segmentation Analytics API Documentation

## Base URL
```
http://localhost:5000
```

## Overview
The Customer Segmentation Analytics System provides a comprehensive REST API for performing customer clustering analysis. The system supports data upload, preprocessing, K-Means clustering, visualization, and detailed analytics.

## Endpoints

### Authentication
Currently, no authentication is required. All endpoints are public.

---

## Upload & Data Processing

### POST /api/upload
Upload a CSV file for clustering analysis.

**Request:**
```
Headers: Content-Type: multipart/form-data
Body: 
  - file: CSV file (max 16MB)
```

**Response (Success):**
```json
{
  "success": true,
  "message": "File uploaded successfully. 200 rows processed in 1.23s.",
  "shape": [200, 5],
  "statistics": {
    "Age": {
      "count": 200.0,
      "mean": 35.5,
      "std": 12.3,
      ...
    }
  },
  "features": ["Age", "Income", "Spending_Score", ...],
  "processing_time": 1.23
}
```

**Response (Error):**
```json
{
  "error": "Only CSV files are allowed"
}
```

**Status Codes:**
- 200: File uploaded and processed successfully
- 400: Invalid file format or missing file
- 413: File size exceeds limit

---

### GET /api/data-quality
Get data quality metrics for the uploaded dataset.

**Response (Success):**
```json
{
  "success": true,
  "metrics": {
    "total_rows": 200,
    "total_columns": 5,
    "numeric_columns": 4,
    "categorical_columns": 1,
    "duplicate_rows": 0,
    "missing_values": {
      "Age": 0,
      "Income": 2,
      ...
    },
    "missing_percentage": {
      "Age": 0.0,
      "Income": 1.0,
      ...
    },
    "memory_usage_mb": 0.025
  }
}
```

**Status Codes:**
- 200: Metrics retrieved successfully
- 400: No data loaded

---

## Clustering Analysis

### GET /api/optimal-clusters
Find the optimal number of clusters using Silhouette Score analysis.

**Response (Success):**
```json
{
  "success": true,
  "silhouette_scores": {
    "2": 0.645,
    "3": 0.723,
    "4": 0.689,
    "5": 0.654,
    ...
  },
  "optimal_k": 3,
  "chart_data": {
    "x": [2, 3, 4, 5, ...],
    "y": [0.645, 0.723, 0.689, 0.654, ...]
  },
  "analysis_time": 2.45
}
```

**Status Codes:**
- 200: Analysis completed successfully
- 400: No data loaded

---

### POST /api/cluster
Perform K-Means clustering on the preprocessed data.

**Request:**
```json
{
  "n_clusters": 3
}
```

**Response (Success):**
```json
{
  "success": true,
  "metrics": {
    "silhouette_score": 0.723,
    "davies_bouldin_score": 0.456
  },
  "cluster_analysis": {
    "0": {
      "size": 67,
      "percentage": 33.5,
      "statistics": { ... }
    },
    "1": {
      "size": 58,
      "percentage": 29.0,
      "statistics": { ... }
    },
    "2": {
      "size": 75,
      "percentage": 37.5,
      "statistics": { ... }
    }
  },
  "recommendations": {
    "0": "🎯 Segment 0 (Core Segment - 33.5%): Largest customer base. Maintain loyalty programs and regular engagement.",
    "1": "📊 Segment 1 (Major Segment - 29.0%): Significant revenue contributor. Focus on retention and upselling.",
    "2": "⭐ Segment 2 (Niche Segment - 37.5%): Specialized needs. Develop targeted premium offerings."
  },
  "cluster_profiles": {
    "0": {
      "count": 67,
      "percentage": 33.5,
      "mean_values": {
        "Age": 32.5,
        "Income": 45.2,
        ...
      },
      "median_values": { ... },
      "std_values": { ... },
      "min_values": { ... },
      "max_values": { ... }
    },
    ...
  },
  "centroids": {
    "0": {
      "Age": 0.234,
      "Income": -0.456,
      ...
    },
    ...
  },
  "feature_importance": {
    "Age": 87.5,
    "Income": 92.3,
    "Spending_Score": 78.9,
    ...
  },
  "top_features": {
    "0": [
      {"feature": "Income", "mean": 45.2, "std": 8.3},
      {"feature": "Age", "mean": 32.5, "std": 6.1},
      {"feature": "Spending_Score", "mean": 65.2, "std": 12.4}
    ],
    ...
  },
  "cluster_summaries": {
    "0": "Cluster 0 contains 67 customers (33.5% of total). Characterized by high Income (avg: 45.20).",
    ...
  },
  "n_clusters": 3,
  "clustering_time": 0.89
}
```

**Request Parameters:**
- `n_clusters` (int, required): Number of clusters (2-10)

**Status Codes:**
- 200: Clustering completed successfully
- 400: Invalid parameters or no data loaded
- 500: Clustering error

---

## Results & Visualization

### GET /api/cluster-data
Retrieve comprehensive cluster analysis and recommendations.

**Response (Success):**
```json
{
  "success": true,
  "cluster_analysis": { ... },
  "recommendations": { ... },
  "metrics": { ... },
  "cluster_profiles": { ... },
  "centroids": { ... },
  "feature_importance": { ... },
  "top_features": { ... },
  "cluster_summaries": { ... },
  "n_clusters": 3
}
```

**Status Codes:**
- 200: Data retrieved successfully
- 400: No clustering performed

---

### GET /api/visualizations
Generate interactive Plotly visualizations for cluster results.

**Response (Success):**
```json
{
  "success": true,
  "scatter_chart": {
    "data": [ ... ],
    "layout": { ... }
  },
  "distribution_chart": {
    "data": [ ... ],
    "layout": { ... }
  }
}
```

**Response Format:**
Charts are returned as Plotly JSON objects compatible with `Plotly.newPlot()`.

**Status Codes:**
- 200: Visualizations generated successfully
- 400: No clustering performed

---

### GET /api/correlation-matrix
Get feature correlation matrix for multicollinearity analysis.

**Response (Success):**
```json
{
  "success": true,
  "features": ["Age", "Income", "Spending_Score", ...],
  "matrix": [
    [1.0, 0.234, -0.456, ...],
    [0.234, 1.0, 0.678, ...],
    [-0.456, 0.678, 1.0, ...],
    ...
  ]
}
```

**Status Codes:**
- 200: Correlation matrix calculated successfully
- 400: No numeric features available

---

## Export & Data Management

### GET /api/export
Export clustering results in multiple formats (CSV, JSON, HTML).

**Response (Success):**
```json
{
  "success": true,
  "message": "Results exported successfully",
  "files": {
    "csv": "data/clustered_results.csv",
    "json": "data/clustering_report.json",
    "html": "data/clustering_report.html"
  }
}
```

**Exported Files:**
- **CSV**: Original data with cluster assignments
- **JSON**: Complete analysis report with metrics and recommendations
- **HTML**: Standalone report for sharing and archiving

**Status Codes:**
- 200: Export successful
- 400: No clustering performed
- 500: Export error

---

### POST /api/reset
Clear all loaded data and clustering results to start fresh analysis.

**Response (Success):**
```json
{
  "success": true,
  "message": "Analysis reset successfully"
}
```

**Status Codes:**
- 200: Reset successful
- 500: Reset error

---

## Error Handling

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

**Common Status Codes:**
- 200: Success
- 400: Bad request (invalid parameters, missing data)
- 404: Endpoint not found
- 413: Payload too large (file size exceeded)
- 500: Internal server error

---

## Rate Limiting
Currently, no rate limiting is enforced. For production deployments, implement rate limiting at the infrastructure level.

---

## CORS Policy
CORS is enabled for all origins. For production, configure appropriate CORS policies in `app.config`.

---

## Example Workflow

```bash
# 1. Upload data
curl -X POST http://localhost:5000/api/upload \
  -F "file=@customers.csv"

# 2. Check data quality
curl http://localhost:5000/api/data-quality

# 3. Find optimal clusters
curl http://localhost:5000/api/optimal-clusters

# 4. Perform clustering
curl -X POST http://localhost:5000/api/cluster \
  -H "Content-Type: application/json" \
  -d '{"n_clusters": 3}'

# 5. Get visualizations
curl http://localhost:5000/api/visualizations

# 6. Get comprehensive analysis
curl http://localhost:5000/api/cluster-data

# 7. Export results
curl http://localhost:5000/api/export
```

---

## Version History

### v1.0.0 (Current)
- Customer data upload and preprocessing
- K-Means clustering with optimal cluster detection
- Interactive Plotly visualizations
- Comprehensive cluster profiling and analysis
- Feature correlation analysis
- Multi-format export (CSV, JSON, HTML)
- Natural language cluster summaries
- Feature importance scoring

---

## Support
For issues, feature requests, or contributions, please visit the GitHub repository.


<!-- Last updated: 2025-12-29 16:27:28 -->

