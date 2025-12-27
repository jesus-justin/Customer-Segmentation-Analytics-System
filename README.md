# 📊 Customer Segmentation Analytics System
## 🔧 Recent Enhancements (Dec 2025)
- Persistent analysis state restored automatically on startup
- New `/api/status` endpoint for quick health/readiness checks
- New `/api/feature-importance` endpoint for importance scores and summaries
- Added "Load Sample Dataset" for fast demo without manual upload
- Friendly 404 page for browser requests (JSON unchanged for APIs)
- Dependency verification aligned with pinned requirements

### Quick Start (Windows)
```powershell
python -m pip install -r config\requirements.txt
python src\app.py
```

Auto-start at user logon:
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File config\windows\register-startup-task.ps1
```

[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org)
[![Flask](https://img.shields.io/badge/Flask-2.3-green)](https://flask.palletsprojects.com)

A professional, **production-ready machine learning web application** for analyzing and segmenting customers using K-Means clustering. Built with **Flask**, **Scikit-Learn**, and **Plotly** - perfect for business analytics, portfolio projects, and enterprise deployments.

## 🌟 New: Professional Landing Page

Experience our **beautifully designed landing page** featuring:
- 🎨 Modern hero section with animated gradients
- ⚡ Interactive feature showcase
- 📱 Fully responsive design
- 🎯 Step-by-step workflow visualization
- 💼 Professional presentation ready for company interviews

---

## ✨ Key Features

### Core Functionality
- 📤 **CSV Upload & Processing** - Drag-and-drop file upload with validation
- 🔍 **Data Quality Assessment** - Automated data health checks and metrics
- 📊 **Automatic Preprocessing** - Missing value handling, feature normalization, categorical encoding
- 🎯 **Optimal Cluster Detection** - Silhouette Score analysis for determining best k
- 🤖 **K-Means Clustering** - Configurable clustering with 2-10 clusters
- 📈 **Advanced Visualizations** - Interactive Plotly charts and segment profiles
- 💼 **Business Recommendations** - Actionable insights for each segment
- 📥 **Export Results** - CSV export with cluster assignments
- ⏱️ **Performance Metrics** - Execution time tracking and quality scores

### Enterprise Features
- 🔐 **Environment Configuration** - Secure config management with .env
- 📝 **Comprehensive Logging** - Structured logging for monitoring and debugging
- 🧪 **Unit Tests** - Complete test coverage for all utilities
- 🐳 **Docker Support** - Dockerfile and docker-compose for containerization
- 📚 **API Documentation** - Complete REST API reference with examples
- 🚀 **Production Deployment** - Gunicorn, Nginx, and Docker instructions

### Modern UI/UX Features
- 🌙 **Dark/Light Mode** - Theme switcher with localStorage persistence
- 🎨 **Glassmorphism Design** - Modern card and button effects with backdrop blur
- ✨ **Smooth Animations** - Floating shapes, gradient animations, and transitions
- 📱 **Fully Responsive** - Mobile-first design with optimized layouts for all devices
- 🎭 **Loading States** - Beautiful skeleton screens and enhanced spinner animations
- 📊 **Animated Counters** - Number animations for statistics and metrics
- 🎪 **Toast Notifications** - Elegant notification system with animations
- 🖱️ **Custom Scrollbars** - Theme-aware scrollbar styling
- 🎨 **Enhanced Charts** - Beautiful color palettes and improved data visualization
- ⚡ **Micro-interactions** - Hover effects, ripple animations, and visual feedback

---

## 🎯 Use Cases

- **Marketing Teams**: Segment customers for targeted campaigns
- **E-commerce**: Personalize product recommendations by segment
- **Retail**: Identify high-value vs. casual customers
- **Banking**: Risk assessment and credit limit assignment
- **SaaS**: Customer segmentation for product strategy
- **Data Science**: Educational project demonstrating ML pipeline

---

## 🏃 Quick Start

### 1. Prerequisites
```bash
# Check Python version (3.8+)
python --version

# On Windows, you may need to use python3
```

### 2. Installation
```bash
# Clone or download the project
cd Customer-Segmentation-Analytics-System

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Verify installation
python verify_requirements.py
```

### 3. Run Application
```bash
# Start Flask development server
python app.py

# Application will be available at http://localhost:5000
```

### 4. Use the Application
1. Visit http://localhost:5000
2. Upload a CSV file (try `data/sample_customers.csv`)
3. Click "Analyze Clusters" to find optimal number
4. Adjust cluster count and run clustering
5. View results and export

---

## 📊 What You Can Do

### Upload Data
- CSV format with numeric and categorical features
- Automatic handling of missing values
- Duplicate detection and removal options

### Analyze
- **Data Quality Check**: View missing values, duplicates, memory usage
- **Optimal Clusters**: Find best k value using Silhouette Score
- **Feature Statistics**: Min, max, mean, std deviation

### Visualize
- 2D scatter plots of clusters
- Cluster distribution bar charts
- Feature correlation heatmaps
- Cluster profiles with statistics

### Export
- Download results with cluster assignments
- Save for further analysis or reporting

---

## 📁 Project Structure

```
Customer-Segmentation-Analytics-System/
├── app.py                              # Flask application (498 lines)
├── requirements.txt                    # Python dependencies
├── verify_requirements.py               # Dependency verification script
├── tests.py                            # Unit and integration tests
├── README.md                           # This file
├── API.md                              # Complete API documentation
├── DEPLOYMENT.md                       # Deployment instructions
├── TESTING.md                          # Testing guide
├── .env.example                        # Environment config template
├── .env                                # Environment config (dev)
├── Dockerfile                          # Docker image definition
├── docker-compose.yml                  # Docker Compose configuration
│
├── utils/
│   ├── __init__.py
│   ├── logger.py                       # Logging configuration (60 lines)
│   ├── preprocessing.py                # Data preprocessing (191 lines)
│   └── clustering.py                   # Clustering utilities (230 lines)
│
├── data/
│   ├── customers.csv                   # Original sample data
│   ├── sample_customers.csv            # Updated sample data (100 rows)
│   └── clustered_results.csv           # Export results (generated)
│
├── model/
│   └── kmeans_model.pkl                # Trained model (generated)
│
├── logs/
│   └── app_YYYYMMDD.log               # Application logs
│
├── static/
│   ├── css/
│   │   └── style.css                   # Main stylesheet (658 lines)
│   └── js/
│       └── chart.js                    # Frontend logic (448 lines)
│
└── templates/
    ├── index.html                      # Home/upload page (142 lines)
    └── results.html                    # Results dashboard (140 lines)
```

**Total Code Lines**: ~2,500+ lines of production code

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Flask 2.3.3
- **Python**: 3.8+
- **ML Libraries**: Scikit-learn, NumPy, Pandas
- **Data Serialization**: Joblib
- **Configuration**: Python-dotenv
- **Production Server**: Gunicorn

### Frontend
- **HTML5** with semantic structure
- **CSS3** with responsive design
- **JavaScript** (vanilla, no frameworks)
- **Plotly.js** for interactive visualizations
- **Font Awesome** for icons

### DevOps & Deployment
- **Docker** & Docker Compose
- **Nginx** for reverse proxy
- **Environment variables** for configuration
- **Logging** with rotating file handlers

---

## 📖 Documentation

### Quick References
- **[API.md](API.md)** - REST API endpoints, request/response examples
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Docker, production deployment
- **[TESTING.md](TESTING.md)** - Running tests, test coverage

### Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Home page |
| `/results` | GET | Results dashboard |
| `/api/upload` | POST | Upload CSV file |
| `/api/data-quality` | GET | Data quality metrics |
| `/api/optimal-clusters` | GET | Find optimal k |
| `/api/cluster` | POST | Run K-Means |
| `/api/cluster-data` | GET | Get cluster data for results |
| `/api/visualizations` | GET | Get visualization charts |
| `/api/export` | GET | Export results |
| `/api/reset` | POST | Reset analysis |

See [API.md](API.md) for complete documentation with examples.

---

## 🧪 Testing

### Run Tests
```bash
# Install test dependencies
pip install pytest pytest-cov flask-testing

# Run all tests
pytest tests.py -v

# Run with coverage
pytest tests.py --cov=. --cov-report=html
```

### Test Coverage
- ✅ Unit tests for preprocessing functions
- ✅ Unit tests for clustering algorithms
- ✅ Integration tests for complete pipeline
- ✅ Test fixtures with sample data

See [TESTING.md](TESTING.md) for detailed testing guide.

---

## 🐳 Docker Deployment

### Quick Start with Docker
```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f web

# Stop containers
docker-compose down
```

### Build Custom Image
```bash
# Build image
docker build -t customer-segmentation .

# Run container
docker run -p 5000:5000 customer-segmentation
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide.

---

## 📋 Sample Data

### Included Files
- **`data/sample_customers.csv`** - 100 customers with 6 features
  - CustomerID, Age, Annual_Income, Spending_Score, Purchase_Frequency, Average_Order_Value

### Features Description
| Feature | Range | Description |
|---------|-------|-------------|
| Age | 18-80 | Customer age |
| Annual_Income | 20-170K | Annual income in thousands |
| Spending_Score | 1-100 | Spending behavior score |
| Purchase_Frequency | 1-7 | How often they purchase per month |
| Average_Order_Value | $25-$210 | Average spend per order |

---

## 🎓 Learning Outcomes

This project teaches:

- ✅ **Machine Learning**: Unsupervised learning, K-Means, clustering evaluation
- ✅ **Data Science**: Preprocessing, normalization, feature scaling
- ✅ **Web Development**: Flask, REST APIs, HTML/CSS/JavaScript
- ✅ **Data Visualization**: Interactive charts with Plotly
- ✅ **Software Engineering**: Project structure, logging, error handling, testing
- ✅ **DevOps**: Docker, containerization, deployment
- ✅ **Business Analysis**: Translating ML results into actionable insights

---

## 🔧 Configuration

### Environment Variables (.env)
```
FLASK_ENV=development
FLASK_DEBUG=False
SECRET_KEY=your-secret-key
SERVER_HOST=0.0.0.0
SERVER_PORT=5000
MAX_UPLOAD_SIZE=16
LOG_LEVEL=INFO
```

### For Production
```
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=<generate-strong-key>
LOG_LEVEL=WARNING
```

Generate a strong secret key:
```python
import secrets
print(secrets.token_urlsafe(32))
```

---

## 📈 Algorithm Details

### K-Means Clustering
- **Algorithm**: K-Means with k-means++ initialization
- **Distance Metric**: Euclidean distance
- **Convergence**: 10 iterations of improvement
- **Reproducibility**: Fixed random_state=42

### Evaluation Metrics

**Silhouette Score**
- Range: -1 to 1
- Interpretation: Measures how similar an object is to its own cluster vs. others
- Good clustering: > 0.5

**Davies-Bouldin Index**
- Lower is better
- Measures average similarity between clusters
- Good clustering: < 1.0

---

## 🚀 Deployment Guide

### Production Checklist
- [x] Secure SECRET_KEY in .env
- [x] Environment variables configured
- [x] Logging enabled
- [x] HTTPS/SSL ready
- [x] Docker configured
- [x] Unit tests passing
- [x] Error handlers in place
- [x] File upload validation
- [x] Input sanitization
- [x] Rate limiting ready

### Deployment Options

#### Option 1: Docker (Recommended)
```bash
docker-compose -f docker-compose.yml up -d
```

#### Option 2: Gunicorn + Nginx
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

#### Option 3: Heroku
```bash
# Configure Procfile and push to Heroku
git push heroku main
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete instructions.

---

## 🔐 Security Best Practices

✅ **Implemented**
- File upload validation (size, extension)
- Input sanitization with secure_filename
- CSRF protection ready
- SQL injection protection (no SQL used)
- Error handling without sensitive info

✅ **Recommended for Production**
- Implement authentication
- Use HTTPS/SSL certificates
- Set up rate limiting
- Configure CORS policies
- Regular security audits
- Keep dependencies updated

---

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError` | Run: `pip install -r requirements.txt` |
| Port 5000 already in use | Kill process: `lsof -i :5000` or change port in .env |
| CSV upload fails | Ensure file is CSV, < 16MB, has numeric columns |
| Poor clustering results | Try different k value, check data quality |
| Permission denied (Docker) | Run: `sudo usermod -aG docker $USER` |

### Debugging

Enable debug logging:
```python
# In .env
FLASK_DEBUG=True
LOG_LEVEL=DEBUG
```

Check logs:
```bash
# Development
tail -f logs/app_*.log

# Docker
docker-compose logs -f web
```

---

## 📚 Additional Resources

- **Scikit-learn K-Means**: https://scikit-learn.org/stable/modules/clustering.html#k-means
- **Flask Documentation**: https://flask.palletsprojects.com/
- **Plotly.js**: https://plotly.com/javascript/
- **Machine Learning**: https://www.coursera.org/learn/machine-learning

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

---

## 🌟 Portfolio Tips

This project is great for your portfolio because it demonstrates:

✅ **Full-stack development** - Backend + Frontend
✅ **ML implementation** - Real clustering algorithm
✅ **Production readiness** - Logging, error handling, validation
✅ **DevOps knowledge** - Docker, deployment
✅ **Testing** - Unit and integration tests
✅ **Documentation** - Comprehensive guides and API docs
✅ **Professional code** - Clean, organized, well-commented
✅ **Real business value** - Actionable insights

### Showcase Ideas
- Add to your portfolio website
- Include in GitHub portfolio
- Present in interviews
- Write a blog post about it
- Use as case study for ML roles

---

## 📞 Support & Questions

- 📖 Check [README.md](README.md) (this file)
- 📚 See [API.md](API.md) for API documentation
- 🚀 Read [DEPLOYMENT.md](DEPLOYMENT.md) for deployment
- 🧪 Check [TESTING.md](TESTING.md) for testing
- 🐛 Create an issue on GitHub

---

## ✨ Version History

**v1.0.0** (December 2024)
- Initial release
- Complete ML pipeline
- Production-ready deployment
- Comprehensive documentation
- Docker support
- Unit tests
- Data quality metrics
- Advanced visualizations

---

## 👨‍💻 Author Notes

This project was designed to be:
- **Educational** - Learn ML and web development
- **Professional** - Production-ready code quality
- **Practical** - Real business use cases
- **Extensible** - Easy to add new features
- **Maintainable** - Well-documented and tested

---

**Made with ❤️ for Data Scientists and Business Analysts**

*Last Updated: December 22, 2024*
