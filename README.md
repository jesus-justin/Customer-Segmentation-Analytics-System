# 📊 Customer Segmentation Analytics System

A professional **machine learning-powered web application** for analyzing and segmenting customers using K-Means clustering. Built with **Flask**, **Scikit-Learn**, and **Plotly** - perfect for Business Analytics students and professionals.

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Python](https://img.shields.io/badge/Python-3.8%2B-blue)

---

## 🎯 Project Overview

This system demonstrates **unsupervised learning** in a real-world business context. Upload customer datasets, preprocess data, perform K-Means clustering, and generate actionable business insights!

### 💼 Business Use Cases

- **Marketing**: Target different customer segments with personalized campaigns
- **Retail**: Identify high-value customers vs. casual shoppers
- **E-commerce**: Optimize product recommendations by segment
- **Banking**: Risk assessment and credit card limits by segment

---

## 📋 Features

✅ Data Upload & Processing (CSV)  
✅ Automatic missing value handling & feature normalization  
✅ Silhouette score calculation for optimal cluster detection  
✅ K-Means clustering with configurable clusters (2-10)  
✅ Interactive Plotly visualizations  
✅ Segment-specific business recommendations  
✅ Export results to CSV  

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip (Python package manager)

### Installation

```bash
# 1. Create virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate

# macOS/Linux:
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run the application
python app.py
```

Visit `http://localhost:5000` in your browser

---

## 📖 How to Use

1. Upload CSV file with customer data
2. Click "Analyze Clusters" to find optimal number
3. Adjust cluster count using the slider (2-10)
4. Run K-Means Clustering
5. View interactive visualizations and recommendations
6. Export results as CSV

---

## 📊 Expected CSV Format

Your CSV should contain customer data with numeric features:

```
CustomerID, Age, Annual_Income, Spending_Score, Purchase_Frequency, etc.
```

Sample data provided in `data/customers.csv` (100 customers)

---

## 🏗️ Project Structure

```
├── app.py                    # Flask application
├── requirements.txt          # Dependencies
├── README.md                 # Documentation
├── data/customers.csv        # Sample dataset
├── model/kmeans_model.pkl    # Trained model
├── utils/
│   ├── preprocessing.py      # Data cleaning
│   └── clustering.py         # K-Means analysis
├── templates/
│   ├── index.html            # Upload page
│   └── results.html          # Results dashboard
└── static/
    ├── css/style.css         # Styling
    └── js/chart.js           # Frontend logic
```

---

## 📦 Tech Stack

- **Backend**: Flask 2.3.3, Python 3.8+
- **ML**: Scikit-learn, Pandas, NumPy
- **Frontend**: HTML5, CSS3, JavaScript, Plotly
- **Serialization**: Joblib

---

## 🎓 Learning Outcomes

✅ Unsupervised Learning (K-Means Clustering)  
✅ Data Preprocessing & Normalization  
✅ Flask Web Development  
✅ RESTful API Design  
✅ Interactive Data Visualizations  
✅ Business Analytics & Decision Making  
✅ Production-ready Code Structure  

---

## 📊 Key Concepts

### Silhouette Score
Measures how similar an object is to its own cluster compared to other clusters.
- Range: -1 to 1
- Higher is better (0.5+ = good clustering)

### Davies-Bouldin Index
Average similarity between clusters.
- Lower is better
- Indicates quality of cluster separation

---

## 🔧 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/upload` | Upload CSV file |
| GET | `/api/optimal-clusters` | Find optimal k |
| POST | `/api/cluster` | Run K-Means |
| GET | `/api/visualizations` | Get charts |
| GET | `/api/export` | Export results |
| POST | `/api/reset` | Clear analysis |

---

## 📋 Sample Data Format

The `data/customers.csv` includes:
- **100 customers** across 3 segments
- Features: Age, Income, Spending Score, Purchase Frequency, Order Value, Membership Years
- Ready to test the application immediately

---

## 🛠️ Customization

### Add More Clustering Algorithms
Edit `utils/clustering.py` to include DBSCAN, Hierarchical Clustering, etc.

### Modify UI
Edit `static/css/style.css` for custom colors and layout

### Adjust Preprocessing
Edit `utils/preprocessing.py` for custom data transformations

---

## 🔐 Production Checklist

- [ ] Disable Flask debug mode
- [ ] Add authentication
- [ ] Implement file size validation
- [ ] Use environment variables
- [ ] Deploy with Gunicorn/uWSGI
- [ ] Set up database (PostgreSQL)
- [ ] Enable HTTPS

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError` | Run: `pip install -r requirements.txt` |
| Port 5000 in use | Change port in app.py: `port=5001` |
| CSV upload fails | Check file is CSV, size < 16MB, has numeric columns |
| Poor clustering results | Try different k value or check data quality |

---

## 📈 Performance Tips

- Start with smaller datasets (< 10,000 rows)
- Remove outliers for better clustering
- Increase iterations: `KMeans(n_init=50)`
- Use sampling for very large datasets

---

## 🌟 Portfolio Value

This project demonstrates:
- ✅ Real-world ML application
- ✅ Full-stack development (backend + frontend)
- ✅ Business problem solving
- ✅ Data visualization
- ✅ Professional code structure
- ✅ Deployment readiness

Perfect for:
- Portfolio websites
- Job interviews
- GitHub profile
- Resume projects

---

## 🤝 Contributing

Issues and PRs welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and create a PR

---

## 📝 License

MIT License - Free to use and modify

---

## 📞 Support

For issues:
1. Check the Troubleshooting section
2. Review code comments
3. Create GitHub issue

---

## ✨ What's Included

- ✅ Complete production-ready code
- ✅ Sample dataset (100 customers)
- ✅ Professional UI/UX
- ✅ Comprehensive documentation
- ✅ Error handling
- ✅ RESTful API design
- ✅ Data validation
- ✅ Business recommendations

---

**Made with ❤️ for Business Analytics Students**

*Last Updated: December 2024*
