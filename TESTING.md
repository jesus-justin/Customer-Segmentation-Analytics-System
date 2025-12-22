# Testing Guide

## Setup Test Environment

```bash
# Install test dependencies
pip install pytest pytest-cov flask-testing

# Create sample test data
# See sample_data.csv in docs/
```

## Running Tests

```bash
# Run all tests
pytest

# Run with coverage report
pytest --cov=.

# Run specific test file
pytest tests/test_clustering.py

# Run with verbose output
pytest -v
```

## Test Coverage

- Unit tests for preprocessing functions
- Unit tests for clustering algorithms
- Integration tests for API endpoints
- UI tests for frontend interactions (optional)

## Test Data

A sample dataset is provided in `data/customers.csv` for manual testing.

### Sample Dataset Features:
- **Age**: Customer age (18-70)
- **Annual_Income**: Annual income in thousands
- **Spending_Score**: Customer spending behavior (1-100)
- **Purchase_Frequency**: How often customer makes purchases
- **Average_Order_Value**: Average spend per order

## Manual Testing Checklist

- [ ] Upload CSV file successfully
- [ ] Invalid file format rejected
- [ ] File size limit enforced (16MB)
- [ ] Optimal clusters analysis works
- [ ] K-Means clustering produces valid results
- [ ] Visualizations render correctly
- [ ] Export CSV contains cluster assignments
- [ ] Reset clears all data properly
- [ ] Results page displays metrics
- [ ] Dark mode toggle works
- [ ] Mobile responsiveness verified
- [ ] Error messages are user-friendly

## Troubleshooting

If tests fail:
1. Ensure all dependencies are installed: `pip install -r requirements.txt`
2. Check that data folder exists: `mkdir -p data model logs`
3. Verify Python version is 3.8+: `python --version`
4. Clear any cached files: `rm -rf __pycache__ .pytest_cache`

## Performance Benchmarks

Expected performance metrics:
- File upload: < 5 seconds (200 rows)
- Optimal clusters analysis: < 10 seconds
- K-Means clustering: < 3 seconds
- Visualization generation: < 2 seconds
