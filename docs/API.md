# Customer Segmentation Analytics System - API Documentation

## Overview
This document provides complete API endpoint documentation for the Customer Segmentation Analytics System.

## Base URL
```
http://localhost:5000/api
```

---

## Endpoints

### 1. Upload and Process Data
**POST** `/api/upload`

Upload a CSV file for processing and initial data analysis.

#### Request
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Parameter**: `file` (File) - CSV file to upload

#### Response
```json
{
  "success": true,
  "message": "File uploaded successfully. 200 rows processed.",
  "shape": [200, 5],
  "statistics": {
    "Age": {
      "count": 200,
      "mean": 35.5,
      "std": 10.2,
      "min": 18,
      "25%": 28,
      "50%": 35,
      "75%": 42,
      "max": 70
    }
  },
  "features": ["Age", "Annual_Income", "Spending_Score", "Purchase_Frequency"]
}
```

#### Status Codes
- `200`: Success
- `400`: Missing/invalid file
- `500`: Processing error

---

### 2. Find Optimal Clusters
**GET** `/api/optimal-clusters`

Calculate optimal number of clusters using Silhouette Score analysis.

#### Request
- **Method**: GET
- **Parameters**: None (uses uploaded data)

#### Response
```json
{
  "success": true,
  "silhouette_scores": {
    "2": 0.523,
    "3": 0.652,
    "4": 0.589,
    "5": 0.501
  },
  "optimal_k": 3,
  "chart_data": {
    "x": [2, 3, 4, 5],
    "y": [0.523, 0.652, 0.589, 0.501]
  }
}
```

#### Status Codes
- `200`: Success
- `400`: No data loaded
- `500`: Analysis error

---

### 3. Perform K-Means Clustering
**POST** `/api/cluster`

Execute K-Means clustering with specified number of clusters.

#### Request
```json
{
  "n_clusters": 3
}
```

#### Response
```json
{
  "success": true,
  "metrics": {
    "silhouette_score": 0.6523,
    "davies_bouldin_score": 0.4231
  },
  "cluster_analysis": {
    "0": {
      "size": 89,
      "percentage": 44.5,
      "statistics": {
        "Age": {
          "count": 89,
          "mean": 28.5,
          "std": 5.2
        }
      }
    },
    "1": {
      "size": 67,
      "percentage": 33.5,
      "statistics": {}
    },
    "2": {
      "size": 44,
      "percentage": 22.0,
      "statistics": {}
    }
  },
  "recommendations": {
    "0": "🎯 Segment 0 (Core Segment - 44.5%): Largest customer base. Maintain loyalty programs...",
    "1": "📊 Segment 1 (Major Segment - 33.5%): Significant revenue contributor. Focus on retention...",
    "2": "⭐ Segment 2 (Niche Segment - 22.0%): Specialized needs. Develop targeted premium offerings..."
  },
  "n_clusters": 3
}
```

#### Status Codes
- `200`: Success
- `400`: No data loaded / invalid parameters
- `500`: Clustering error

---

### 4. Get Visualizations
**GET** `/api/visualizations`

Generate Plotly visualizations for clustering results.

#### Request
- **Method**: GET
- **Parameters**: None (uses clustering results)

#### Response
```json
{
  "success": true,
  "scatter_chart": {
    "data": [...],
    "layout": {...}
  },
  "distribution_chart": {
    "data": [...],
    "layout": {...}
  }
}
```

#### Status Codes
- `200`: Success
- `400`: No clustering performed
- `500`: Visualization error

---

### 5. Export Results
**GET** `/api/export`

Export clustering results to CSV file.

#### Request
- **Method**: GET
- **Parameters**: None

#### Response
```json
{
  "success": true,
  "message": "Results exported to data/clustered_results.csv"
}
```

**Output File Format**: CSV with all original features plus a `Cluster` column

#### Status Codes
- `200`: Success
- `400`: No clustering performed
- `500`: Export error

---

### 6. Reset Analysis
**POST** `/api/reset`

Clear all loaded data and clustering results.

#### Request
- **Method**: POST
- **Parameters**: None

#### Response
```json
{
  "success": true,
  "message": "Analysis reset successfully"
}
```

#### Status Codes
- `200`: Success
- `500`: Reset error

---

### 7. Get Cluster Analysis Data
**GET** `/api/cluster-data`

Retrieve cluster analysis and recommendations (for results page).

#### Request
- **Method**: GET
- **Parameters**: None (uses clustering results)

#### Response
```json
{
  "success": true,
  "cluster_analysis": {...},
  "recommendations": {...},
  "metrics": {...}
}
```

#### Status Codes
- `200`: Success
- `400`: No clustering performed
- `500`: Error retrieving data

---

## Error Handling

All errors follow this format:
```json
{
  "error": "Description of what went wrong"
}
```

## Data Requirements

### CSV Format
The uploaded CSV file should contain:
- **Numeric columns**: Age, Income, Spending Score, etc.
- **Optional categorical columns**: Will be encoded automatically
- **Optional ID column**: CustomerID (will be excluded from clustering)

### Minimum Requirements
- At least 2 numeric columns
- At least 10 rows of data
- Maximum file size: 16 MB

## Example Usage

### Complete Workflow
```bash
# 1. Upload file
curl -X POST -F "file=@customers.csv" http://localhost:5000/api/upload

# 2. Find optimal clusters
curl http://localhost:5000/api/optimal-clusters

# 3. Perform clustering with 3 clusters
curl -X POST -H "Content-Type: application/json" \
  -d '{"n_clusters": 3}' \
  http://localhost:5000/api/cluster

# 4. Get visualizations
curl http://localhost:5000/api/visualizations

# 5. Export results
curl http://localhost:5000/api/export
```

---

## Notes

- Silhouette Score: Ranges from -1 to 1. Higher values indicate better clustering (0.5+ is good).
- Davies-Bouldin Index: Lower values indicate better cluster separation.
- All data is processed server-side for security and performance.
- Models are automatically saved to `model/kmeans_model.pkl`.
