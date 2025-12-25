# Development Guide - Customer Segmentation Analytics System

## Project Structure

```
Customer-Segmentation-Analytics-System/
├── app.py                           # Main Flask application
├── tests.py                         # Unit tests
├── requirements.txt                 # Python dependencies
├── Dockerfile                       # Docker container configuration
├── docker-compose.yml              # Docker Compose setup
├── API_DOCUMENTATION.md            # REST API reference
├── DEVELOPMENT.md                  # This file
│
├── data/                           # Data directory
│   ├── customers.csv              # Sample customer data
│   └── sample_customers.csv       # Alternative sample
│
├── model/                          # Trained models storage
│   └── kmeans_model.pkl           # Saved K-Means model
│
├── utils/                          # Core utilities
│   ├── __init__.py
│   ├── preprocessing.py            # Data loading and preparation
│   ├── clustering.py               # K-Means and analysis functions
│   ├── feature_importance.py       # Feature analysis utilities
│   ├── export.py                   # Export to multiple formats
│   └── logger.py                   # Application logging
│
├── templates/                      # HTML templates
│   ├── index.html                 # Home page
│   └── results.html               # Results page
│
└── static/                         # Frontend assets
    ├── css/
    │   └── style.css              # Main stylesheet
    └── js/
        └── chart.js               # Client-side interactions
```

## Environment Setup

### Prerequisites
- Python 3.8+
- pip or conda
- Git

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/Customer-Segmentation-Analytics-System.git
cd Customer-Segmentation-Analytics-System
```

2. **Create virtual environment:**
```bash
# Using venv
python -m venv venv

# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables:**
Create `.env` file in project root:
```env
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here
UPLOAD_FOLDER=data
MAX_UPLOAD_SIZE=16
SERVER_PORT=5000
```

5. **Run the application:**
```bash
python app.py
```

Access the application at: `http://localhost:5000`

---

## Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER UPLOAD CSV FILE                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. DATA PREPROCESSING (utils/preprocessing.py)              │
│   - Load CSV data                                            │
│   - Handle missing values                                    │
│   - Encode categorical features                             │
│   - Normalize numeric features (StandardScaler)             │
│   - Calculate data quality metrics                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. CLUSTERING ANALYSIS (utils/clustering.py)               │
│   - Find optimal clusters (Silhouette Score)               │
│   - Perform K-Means clustering                             │
│   - Calculate metrics (Silhouette, Davies-Bouldin)         │
│   - Analyze cluster characteristics                         │
│   - Generate recommendations                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. ADVANCED ANALYTICS (utils/feature_importance.py)        │
│   - Calculate feature importance scores                     │
│   - Identify top discriminative features                    │
│   - Detect outliers within clusters                        │
│   - Generate cluster summaries                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. VISUALIZATION & EXPORT                                   │
│   - Generate Plotly charts                                 │
│   - Export to CSV, JSON, HTML (utils/export.py)           │
│   - Render results page with insights                      │
└─────────────────────────────────────────────────────────────┘
```

### Backend Architecture

**Flask Application (app.py)**
- Handles HTTP requests/responses
- Manages global state (PROCESSED_DATA, CLUSTER_LABELS, etc.)
- Delegates business logic to utility modules
- Handles errors and logging

**Utility Modules**
- `preprocessing.py`: Data cleaning and preparation
- `clustering.py`: K-Means implementation and analysis
- `feature_importance.py`: Advanced analytics
- `export.py`: Multi-format result export
- `logger.py`: Centralized logging configuration

### Frontend Architecture

**JavaScript (chart.js)**
- Safe DOM element binding with guards
- API communication and error handling
- Interactive visualizations with Plotly
- Session storage for offline fallback

**HTML Templates**
- `index.html`: Upload and clustering workflow
- `results.html`: Comprehensive results visualization

---

## Key Features & Implementation

### 1. Data Preprocessing
Located in: `utils/preprocessing.py`

**Features:**
- Automatic missing value imputation (mean/median/drop)
- Categorical feature encoding using LabelEncoder
- Numeric feature normalization using StandardScaler
- Data quality metrics calculation

**Example:**
```python
from utils.preprocessing import preprocess_data

df, metadata, original = preprocess_data('customers.csv')
print(f"Processed shape: {df.shape}")
print(f"Features: {metadata['features']}")
```

### 2. K-Means Clustering
Located in: `utils/clustering.py`

**Features:**
- Elbow method using Silhouette Score
- K-Means clustering with configurable clusters
- Cluster quality metrics (Silhouette, Davies-Bouldin)
- Detailed cluster profiling and statistics

**Example:**
```python
from utils.clustering import find_optimal_clusters, perform_clustering

# Find optimal number of clusters
scores = find_optimal_clusters(df, max_k=10)
optimal_k = max(scores, key=scores.get)

# Perform clustering
labels, model = perform_clustering(df, n_clusters=optimal_k)
```

### 3. Feature Importance Analysis
Located in: `utils/feature_importance.py`

**Features:**
- Variance-based importance scoring
- Top discriminative features per cluster
- Cluster separation metrics
- Outlier detection within clusters
- Natural language cluster summaries

**Example:**
```python
from utils.feature_importance import get_top_features_per_cluster

top_features = get_top_features_per_cluster(df, labels, n_features=5)
# Returns top 5 features for each cluster with statistics
```

### 4. Multi-Format Export
Located in: `utils/export.py`

**Supported Formats:**
- CSV: Raw data with cluster assignments
- JSON: Structured analysis report
- HTML: Self-contained standalone report

**Example:**
```python
from utils.export import export_to_csv, export_to_json

export_to_csv(df, labels, 'results.csv')
export_to_json(analysis, metrics, recommendations, 'report.json')
```

---

## API Endpoints

### Data Upload
```
POST /api/upload
```

### Clustering
```
GET /api/optimal-clusters
POST /api/cluster
GET /api/cluster-data
```

### Analytics
```
GET /api/data-quality
GET /api/correlation-matrix
GET /api/visualizations
```

### Export
```
GET /api/export
POST /api/reset
```

See `API_DOCUMENTATION.md` for detailed endpoint specifications.

---

## Testing

### Run Unit Tests
```bash
pytest tests.py -v
```

### Test Coverage
```bash
pytest tests.py --cov=utils
```

### Available Test Classes
- `TestPreprocessing`: Data preprocessing functions
- `TestClustering`: K-Means and analysis functions
- `TestIntegration`: End-to-end workflows

---

## Adding New Features

### Adding a New Utility Function

1. **Create function in appropriate module** (e.g., `utils/clustering.py`)
2. **Add type hints** for parameters and return values
3. **Include comprehensive docstring**
4. **Write unit tests** in `tests.py`
5. **Update API endpoints** in `app.py` if needed

Example:
```python
def my_new_function(data: pd.DataFrame, param: int) -> Dict[str, Any]:
    """
    Detailed description of what this function does.
    
    Args:
        data: Input DataFrame
        param: Parameter description
        
    Returns:
        Dictionary containing results
    """
    # Implementation
    return results
```

### Adding a New API Endpoint

1. **Define route in** `app.py`:
```python
@app.route('/api/new-endpoint', methods=['GET', 'POST'])
def new_endpoint():
    """Route documentation."""
    try:
        # Your logic here
        return jsonify({'success': True, 'data': result}), 200
    except Exception as e:
        app_logger.error(f"Error: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500
```

2. **Update** `API_DOCUMENTATION.md`
3. **Add corresponding frontend logic** in `static/js/chart.js`
4. **Test with curl or Postman**

---

## Deployment

### Docker Deployment

```bash
# Build image
docker build -t customer-segmentation .

# Run container
docker run -p 5000:5000 customer-segmentation

# Or use Docker Compose
docker-compose up
```

### Production Checklist

- [ ] Set `FLASK_ENV=production`
- [ ] Use strong `SECRET_KEY`
- [ ] Configure CORS properly
- [ ] Set up reverse proxy (nginx/Apache)
- [ ] Enable HTTPS/SSL
- [ ] Configure database for persistence
- [ ] Set up logging and monitoring
- [ ] Implement rate limiting
- [ ] Add authentication if needed

---

## Troubleshooting

### Common Issues

**Issue: ModuleNotFoundError for utils**
```bash
# Make sure you're in project root and have activated venv
pip install -r requirements.txt
```

**Issue: Port 5000 already in use**
```bash
# Change port in .env or specify when running:
python app.py --port 5001
```

**Issue: CSV file not being processed**
- Check file format is valid CSV
- Ensure numeric columns exist
- Check file size under 16MB (or adjust MAX_UPLOAD_SIZE)

**Issue: Clustering results incorrect**
- Verify data preprocessing completed successfully
- Check for missing values in data
- Ensure sufficient data points (at least 2 per cluster)

---

## Performance Optimization

### Memory Usage
- Implement data chunking for large files
- Use sparse matrices for categorical data
- Clear intermediate results after use

### Speed Optimization
- Use GPU acceleration for KMeans (CuML)
- Implement caching for repeated analyses
- Optimize Plotly rendering with data thinning

### Database Optimization
- Index frequently queried fields
- Implement result caching
- Archive old analyses

---

## Code Style Guidelines

- Follow PEP 8 for Python code
- Use type hints for functions
- Write descriptive docstrings
- Keep functions under 50 lines
- Use meaningful variable names
- Add inline comments for complex logic

---

## Version Control

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Code style
- refactor: Code refactoring
- test: Tests
- chore: Build/dependencies

**Example:**
```
feat(clustering): Add feature importance scoring

Implement variance-based feature importance calculation
to identify most discriminative features per cluster.

Closes #123
```

---

## Security Considerations

1. **File Upload:**
   - Validate file type (check magic bytes, not just extension)
   - Limit file size
   - Scan for malware
   - Store in restricted directory

2. **Input Validation:**
   - Validate all API parameters
   - Sanitize user input
   - Use parameterized queries if using database

3. **Secrets Management:**
   - Never commit secrets to git
   - Use environment variables
   - Rotate secrets regularly
   - Use .env files (exclude from git)

---

## Contributing

See `CONTRIBUTING.md` for detailed contribution guidelines.

---

## License

MIT License - See `LICENSE` file for details.

---

## Support & Contact

For questions, issues, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review test cases for examples

Happy coding!
