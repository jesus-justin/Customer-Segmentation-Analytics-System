# Project Structure

This document describes the organized folder structure of the Customer Segmentation Analytics System.

## 📁 Directory Layout

```
Customer-Segmentation-Analytics-System/
│
├── public/                      # Static HTML pages
│   ├── home.html               # Landing page
│   ├── get-started.html        # Quick start guide page
│   ├── analytics.html          # Analytics gateway page
│   ├── START_HERE.html         # Main entry point
│   └── index.html              # Root index page
│
├── src/                        # Python source code
│   ├── app.py                  # Main Flask application
│   └── verify_requirements.py # Dependency checker
│
├── templates/                  # Flask Jinja2 templates
│   ├── home.html              # Flask home template
│   ├── get-started.html       # Flask get started template
│   ├── index.html             # Flask analytics template
│   ├── results.html           # Results display template
│   ├── test-buttons.html      # Diagnostic page
│   └── not_found.html         # 404 error page
│
├── static/                     # Static assets
│   ├── css/                   # Stylesheets
│   └── js/                    # JavaScript files
│
├── utils/                      # Utility modules
│   ├── clustering.py          # K-Means clustering logic
│   ├── preprocessing.py       # Data preprocessing
│   ├── export.py              # Export functionality
│   ├── feature_importance.py  # Feature analysis
│   ├── logger.py              # Logging utilities
│   └── state.py               # State management
│
├── scripts/                    # Utility scripts
│   ├── START_SERVER.bat       # Quick server launcher
│   ├── create_commits.ps1     # Git commit automation
│   ├── make_50_commits.ps1    # Batch commit script
│   ├── fix_indent.py          # Code formatting
│   ├── fix_viz.py             # Visualization fixes
│   ├── restore_viz.py         # Restore visualization
│   └── test_flask.py          # Flask testing script
│
├── docs/                       # Documentation
│   ├── guides/                # User guides
│   │   ├── CONTRIBUTING.md    # Contribution guidelines
│   │   ├── CODE_OF_CONDUCT.md # Code of conduct
│   │   ├── SECURITY.md        # Security policy
│   │   ├── CHANGELOG_NEW.md   # Version history
│   │   ├── INSTALL.md         # Installation guide
│   │   ├── FAQ.md             # Frequently asked questions
│   │   ├── USAGE.md           # Usage instructions
│   │   ├── API_REFERENCE.md   # API documentation
│   │   ├── PERFORMANCE.md     # Performance tips
│   │   ├── EXAMPLES.md        # Usage examples
│   │   ├── ROADMAP.md         # Future plans
│   │   ├── ACKNOWLEDGMENTS.md # Credits
│   │   └── SOLUTION_SUMMARY.md# Solution overview
│   │
│   ├── API_DOCUMENTATION.md   # API reference
│   ├── QUICK_START.md         # Quick start guide
│   ├── DEPLOYMENT.md          # Deployment guide
│   ├── TESTING.md             # Testing guide
│   └── DEVELOPMENT.md         # Development guide
│
├── config/                     # Configuration files
│   ├── docker-compose.yml     # Docker configuration
│   ├── Dockerfile             # Docker image definition
│   ├── requirements.txt       # Python dependencies
│   ├── .htaccess              # Apache configuration
│   ├── OPEN_ANALYTICS_DASHBOARD.url  # Quick link
│   ├── OPEN_HOME_PAGE.url     # Quick link
│   └── READ_ME_FIRST.txt      # Initial instructions
│
├── data/                       # Sample datasets
│   ├── customer_segmentation_dataset.csv
│   ├── sample_customers.csv
│   └── [other datasets]
│
├── tests/                      # Test files
│   ├── test_api.py            # API tests
│   └── tests.py               # Unit tests
│
├── logs/                       # Application logs
├── model/                      # Saved models
├── pages/                      # Additional pages
│
├── README.md                   # Project overview
└── LICENSE                     # License information

```

## 🚀 Quick Access

### Static Pages (Apache)
Access via `http://localhost/Customer-Segmentation-Analytics-System/public/`
- `START_HERE.html` - Main navigation hub
- `home.html` - Feature overview
- `get-started.html` - Getting started guide
- `analytics.html` - Analytics info

### Flask Application
Start server: `scripts\START_SERVER.bat`
Access via `http://localhost:5000/`

### Documentation
All guides in `docs/guides/` folder
- Setup: `INSTALL.md`
- Usage: `USAGE.md`
- API: `API_REFERENCE.md`
- FAQ: `FAQ.md`

## 📝 Notes

- **public/** contains standalone HTML files accessible via Apache
- **templates/** contains Flask Jinja2 templates for dynamic content
- **scripts/** contains all utility and automation scripts
- **docs/guides/** contains comprehensive documentation
- **config/** contains all configuration and setup files

Last updated: 2025-12-29
